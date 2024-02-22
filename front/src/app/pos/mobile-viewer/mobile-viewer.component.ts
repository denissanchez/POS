import { Component, OnDestroy, OnInit } from "@angular/core";
import { DraftTransaction, Product } from "@app/shared/models";
import { BehaviorSubject, Observable } from "rxjs";
import { Socket, io } from 'socket.io-client';

@Component({
    selector: 'app-mobile-viewer',
    templateUrl: './mobile-viewer.component.html',
    styleUrls: ['./mobile-viewer.component.scss']
})
export class MobileViewerComponent implements OnInit, OnDestroy {
    private socket!: Socket;
    private _product: BehaviorSubject<Product | undefined> = new BehaviorSubject<Product | undefined>(undefined);

    private _lastRead: Date | undefined = undefined;

    public get lastRead(): string {
        if (this._lastRead) {
            return this._lastRead.toLocaleTimeString();
        }

        return "No ha habido lecturas aún.";
    }

    public get product$(): Observable<Product | undefined> {
        return this._product.asObservable();
    }

    public currentTransaction: DraftTransaction | undefined = undefined;

    constructor() {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.socket = io('/');

        this.socket.on('product:scanned', (product) => {
            this._product.next(Product.fromJson(product));
            this._lastRead = new Date();
        });

        this.socket.on('product:not-found', (data) => {
            this._product.next(undefined);
            this._lastRead = new Date();
        });

        this.socket.on('summary:sync', (data) => {
            this.currentTransaction = DraftTransaction.fromJson(data);
        })
    }

    syncRequest(): void {
        this.socket.emit('summary:sync_request');
    }

    plusOne(productId: string): void {
        this.socket.emit('summary:plus_one', productId);
    }

    minusOne(productId: string): void {
        this.socket.emit('summary:minus_one', productId);
    }

    remove(productId: string): void {
        this.socket.emit('summary:remove', productId);
    }

    enableCapture(): void {
        this.socket.emit('summary:capture');
    }

    cancel(): void {
        this.socket.emit('summary:cancel');
    }

    ngOnDestroy(): void {
        this.socket.disconnect();
    }

    logout() {
        window.location.href = '/logout';
    }
}
