import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Transaction } from "@app/shared/models/transaction";

@Component({
    selector: 'app-general-stats',
    templateUrl: './general-stats.component.html',
    styleUrls: ['./general-stats.component.scss',],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralStatsComponent {
    @Input({
        required: true
    }) transactions: Transaction[] = [];

    public get total(): string {
        return this.transactions.reduce((acc, curr) => acc + curr.total, 0).toFixed(2);
    }

    public get count(): number {
        return this.transactions.length;
    }

    public get countQuanity(): number {
        const quantities = this.transactions.map((transaction) => transaction.items.map((item) => item.quantity));
        const quantitiesFlatten = quantities.flat();
        return quantitiesFlatten.reduce((acc, curr) => acc + curr, 0);
    }

    public get countUniqueProducts(): number {
        const products = this.transactions.map((transaction) => transaction.items.map((item) => item.product));
        const productsFlatten = products.flat();
        const productsUnique = productsFlatten.filter((product, index) => productsFlatten.indexOf(product) === index);
        return productsUnique.length;
    }

    public get countUniqueClients(): number {
        const clients = this.transactions.map((transaction) => transaction.client._id);
        const clientsUnique = clients.filter((client, index) => clients.indexOf(client) === index);
        return clientsUnique.length;
    }
}
