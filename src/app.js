//*con common js
// const express = require("express")

//*con ESmodules
import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";

const app = express();
const PUERTO = 8080;

//*con common js
// const productRouter = require("./routes/product.router.js")
// const cartRouter = require("./routes/cart.router.js")

//*con ESmodules
import cartRouter from "./routes/cart.router.js";
import productRouter from "./routes/product.router.js";
import viewsRouter from "./routes/views.router.js";

//! middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("./src/public"));

//! handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//! rutas
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

//! LISTEN
const httpserver = app.listen(PUERTO, ()=>{
    console.log(`escuchando el puerto http://localhost:${PUERTO}`);
});

//! websockets
import ProductManager from "./managers/product-manager.js";
const manager = new ProductManager("./src/data/productos.json");

const io = new Server(httpserver);

io.on("connection", async (socket)=>{
    console.log("un cliente se conecto");

    //envio el array de productos al cliente que se conecto
    socket.emit("productos", await manager.getProducts());

    //agrego producto
    socket.on("agregarProducto", async (producto)=> {
        await manager.getProducts(producto);
        io.sockets.emit("productos", await manager.getProducts());
    })

    //elimino producto
    socket.on("eliminarProducto", async (id)=> {
        await manager.deleteProductById(id);
        io.sockets.emit("productos", await manager.getProducts());
    });
});