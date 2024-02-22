import fs from 'fs';
import ExcelJS from 'exceljs';
import MiniSearch from 'minisearch';
import XlsxPopulate from 'xlsx-populate';


const STOCK_SHEET_NAME = "STOCK DE TIENDA";


const MONTHS = [
    "ENERO",
    "FEBRERO",
    "MARZO",
    "ABRIL",
    "MAYO",
    "JUNIO",
    "JULIO",
    "AGOSTO",
    "SEPTIEMBRE",
    "OCTUBRE",
    "NOVIEMBRE",
    "DICIEMBRE"
]

const POR_MAYOR_SUFFIX = '(Por mayor)';

const TIPO_COBRADO = "COBRADO";
const TIPO_CREDITO = "CREDITO";

const STORE_FIELDS_FOR_EACH_PRODUCT = ['price', 'quantity', 'name', 'category', 'row', 'cost']


class StockFileAdapter {
    constructor() {
        this._excelPath = process.env.XLSX_PATH;
        this._products = [];
        this._codeIndexer = {}
        this._categories = [];
        this._subscribers = [];

        this._minisearch = new MiniSearch({
            idField: '_id',
            fields: ['name'],
            storeFields: STORE_FIELDS_FOR_EACH_PRODUCT,
            searchOptions: {
                combineWith: 'AND',
                fuzzy: 0.2
            }
        })
        
        this.syncData();

        this.observer = fs.watchFile(this._excelPath, { interval: 1000 }, (curr, prev) => {
            if (curr.mtime.getTime() == prev.mtime.getTime()) {
                return;
            }
    
            this.syncData();
        })
    }

    get products() {
        return [...this._products];
    }

    get categories() {
        return [...this._categories];
    }

    addSubscriber(socket) {
        this._subscribers.push(socket);
        return this._subscribers.length - 1;
    }

    removeSubscriber(id) {
        this._subscribers.splice(id, 1);
    }

    async getStockWorksheet() {
        const workbook = new ExcelJS.Workbook();
    
        await workbook.xlsx.readFile(this._excelPath);
        workbook.calcProperties.fullCalcOnLoad = true;
    
        return [workbook.getWorksheet(STOCK_SHEET_NAME), workbook]
    }

    async getCategories(stockWorkSheet) {
        const categoriesCol = stockWorkSheet.getColumn('A');
    
        const categoriesSet = new Set();
    
        categoriesCol.eachCell(function(cell, rowNumber) {
            if (!cell.value) {
                return;
            }
    
            categoriesSet.add(cell.value);
        })
    
        const [header, ...categories] = Array.from(categoriesSet);
    
        return categories.map((c, index) => ({
            _id: `${c.replace(' ', '')}`,
            name: c
        }));
    }

    async getProducts(stockWorkSheet) {
        const baseFields = {
            'A': 'category',
            'B': 'name',
            'C': 'quantity',
            'D': 'cost'
        }

        const priceBasedFields = {
            'F': 'M', // Lowest price (Large quantities)
            'G': '', // Highest price (Small quantities)
        }

        const nameBasedSuffix = {
            'M': POR_MAYOR_SUFFIX,
            '': '',
        }
    
        const rows = []
    
        stockWorkSheet.eachRow({includeEmpty: true}, (row, rowNumber) => {
            const product = {
                quantity: 0,
            }
    
            if (!row.getCell('B').value) {
                return;
            }
    
            Object.entries(baseFields).forEach(([key, name]) => {
                const cell = row.getCell(key);
    
                if (cell.value instanceof Object) {
                    product[name] = cell.value.result;
                } else {
                    product[name] = cell.value
                }
            });

            const code = row.getCell('N').value;

            if (code == null || (!String(code).match(/\d/) && !String(code).match(/[a-zA-Z]/))) {
                return;
            }

            Object.entries(priceBasedFields).forEach(([key, preffix]) => {

                const cell = row.getCell(key);

                const _id = `${preffix}${code}`;
                const name = `${product.name} ${nameBasedSuffix[preffix]}`.trim()

                let price = 0;

                if (cell.value instanceof Object) {
                    price = cell.value.result;
                } else {
                    price = cell.value;
                }

                if (isNaN(+price)) {
                    return;
                }

                rows.push({...product, _id, name, price, row: rowNumber})
            });
        });
    
        return rows;
    }

    async syncData() {
        const [worksheet, ] = await this.getStockWorksheet();
    
        this._products = await this.getProducts(worksheet);
        this._categories = await this.getCategories(worksheet);

        this._products.forEach((p) => {
            this._codeIndexer[`${p._id}`] = p;

            const has = this._minisearch.has(p._id)

            if (has) {
                this._minisearch.replace(p)
            } else {
                this._minisearch.add(p);
            }
        });

        this._subscribers.forEach(s => s.emit('stock', 'update'))
    }

    getById(_id) {
        return this._codeIndexer[`${_id}`];
    }

    search(txt) {
        const byCode = this._codeIndexer[txt];

        if (byCode) {
            return {...byCode};
        }
        
        return this._minisearch.search(txt).map(p => {
            const { terms, match, score, ...product } = p;
            return product;
        });
    }

    async updateStock(items) {
        const workbook = await XlsxPopulate.fromFileAsync(this._excelPath);

        const worksheet = workbook.sheet(STOCK_SHEET_NAME);

        for (let item of items) {
            const productDB = this.getById(item.product._id);
            worksheet.cell(`C${productDB.row}`).value(+worksheet.cell(`C${productDB.row}`).value() - +item.quantity);
        }

        await workbook.toFileAsync(this._excelPath)
    }

    async registerTransaction(type, items, customer) {
        if (![TIPO_COBRADO, TIPO_CREDITO].includes(type)) {
            return;
        }

        const now = new Date();
        const currentMonth = MONTHS[now.getMonth()];
        
        const worksheetTitle = `VENTAS ${currentMonth} ${now.getFullYear()}`;
        
        const workbook = await XlsxPopulate.fromFileAsync(this._excelPath);

        const worksheet = workbook.sheet(worksheetTitle);

        const COLUMNS = {
            TIPO_PRODUCTO: 'A',
            DESCRIPCION_PRODUCTO: 'B',
            CANTIDAD: 'C',
            COSTO: 'D', 
            TIPO_VENTA: 'E',
            PRECIO_UNIDAD: 'F',
            FECHA: 'G',
            TOTAL: 'H',
            UTILIDAD: 'I',
            ESTADO_PAGO: 'J',
            MONTO: 'L',
            CLIENTE: 'K'
        }

        let row = 1;

        while(worksheet.cell(`A${row + 1}`).value() != undefined & worksheet.cell(`A${row + 1}`).value() !== "") {
            row++;
        }
        
        for (let item of items) {
            const productDB = this.getById(item.product._id);

            const firstChart = item.product._id[0];

            worksheet.cell(`${COLUMNS.TIPO_PRODUCTO}${row + 1}`).value(productDB.category);
            worksheet.cell(`${COLUMNS.DESCRIPCION_PRODUCTO}${row + 1}`).value(productDB.name.replace(POR_MAYOR_SUFFIX, ""));
            worksheet.cell(`${COLUMNS.CANTIDAD}${row + 1}`).value(item.quantity);
            worksheet.cell(`${COLUMNS.COSTO}${row + 1}`).value(productDB.cost);
            worksheet.cell(`${COLUMNS.TIPO_VENTA}${row + 1}`).value(firstChart === 'M' ? 'POR MAYOR': 'AL PUBLICO');
            worksheet.cell(`${COLUMNS.PRECIO_UNIDAD}${row + 1}`).value((item.subtotal / item.quantity).toFixed(2));
            worksheet.cell(`${COLUMNS.FECHA}${row + 1}`).value(now).style("numberFormat", "dddd, dd mmmm yyyy");
            worksheet.cell(`${COLUMNS.TOTAL}${row + 1}`).value(item.subtotal);
            worksheet.cell(`${COLUMNS.UTILIDAD}${row + 1}`).value((item.quantity * (item.subtotal / item.quantity - productDB.cost)).toFixed(2));
            worksheet.cell(`${COLUMNS.ESTADO_PAGO}${row + 1}`).value(type);

            if (customer && customer !== "Desconocido") {
                worksheet.cell(`${COLUMNS.CLIENTE}${row + 1}`).value(customer);
            }

            row++;
        }

        await workbook.toFileAsync(this._excelPath)
    }
}

let instance = undefined;

function getAdapter() {
    if (!instance) {
        console.log("Adapter has been created")
        instance = new StockFileAdapter();
    }

    return instance;
}

export { getAdapter };
