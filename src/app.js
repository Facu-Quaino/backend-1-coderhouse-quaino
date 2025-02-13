import express from "express";
import { engine } from "express-handlebars";
import "./database.js"

const app = express();
const PUERTO = 8080;

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

//! LISTENER
app.listen(PUERTO, ()=>{
    console.log(`escuchando en el puerto http://localhost:${PUERTO}`);
});