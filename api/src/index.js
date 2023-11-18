import express from "express";
import ProductsRouter from './controllers/products.js';
import CategoriesRouter from './controllers/categories.js';

const app = express();
const port = process.env.PORT || 8080;

app.get('/api/v1', function(req, res) {
    res.json({
        ok: true   
    })
});

app.use('/api/v1/products', ProductsRouter);
app.use('/api/v1/categories', CategoriesRouter);

app.listen(port);

console.log(`Node Express server listening on http://localhost:${port}`);
