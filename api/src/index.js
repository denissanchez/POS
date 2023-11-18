import dotenv from 'dotenv';

dotenv.config()

import express from "express";
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import ProductsRouter from './controllers/products.js';
import CategoriesRouter from './controllers/categories.js';
import { getAdapter } from './repository/excel.js';

const app = express();
const server = createServer(app);
const io = new Server(server);


app.get('/api/v1', function(req, res) {
    res.json({
        ok: true   
    })
});

app.use('/api/v1/products', ProductsRouter);
app.use('/api/v1/categories', CategoriesRouter);

io.on('connection', (socket) => {
    const adapter = getAdapter();
    const id = adapter.addSubscriber(socket);

    socket.on('disconnect', () => {
        adapter.removeSubscriber(id)
    })
})

const port = process.env.PORT || 8080;

server.listen(port, () => {
    console.log(`server listening on http://localhost:${port}`);
});
