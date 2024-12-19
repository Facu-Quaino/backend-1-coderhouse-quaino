//*con common js
// const express = require("express")

//*con ESmodules
import express from "express"

const app = express()
const PUERTO = 8080

//*con common js
// const productRouter = require("./routes/product.router.js")
// const cartRouter = require("./routes/cart.router.js")

//*con ESmodules
import cartRouter from "./routes/cart.router.js"
import productRouter from "./routes/product.router.js"

//! middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//! rutas
app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)

//! LISTEN
app.listen(PUERTO, ()=>{
    console.log(`escuchando el puerto http://localhost:${PUERTO}`);
    
})

