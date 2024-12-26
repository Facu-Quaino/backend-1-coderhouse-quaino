import { Router } from "express";
const router = Router()

//? importo productManager

//*con common js
// const ProductManager = require("../managers/product-manager.js")

//*con ESmodules
import ProductManager from "../managers/product-manager.js";
import { pid } from "process";
const manager = new ProductManager("./src/data/productos.json")

//! ruta para listar todos los productos
router.get("/", async (req,res)=>{
    //*guardo el query limit
    let limit = req.query.limit;
    
    const productos = await manager.getProducts()

    if(limit){
        res.send(productos.slice(0, limit))
    } else{
        res.send(productos)
    }
})

//! ruta para retornar un producto por id
router.get("/:pid", async (req,res)=>{
    let id = req.params.pid;
    const productoBuscado = await manager.getProductById(parseInt(id))
    res.send(productoBuscado)
})

//! ruta para agregar un nuevo producto
router.post("/", async (req,res)=>{

    const nuevoProducto = req.body

    try {
        await manager.addProduct(nuevoProducto)
        res.json(nuevoProducto)
    } catch (error) {
        console.log(error.toString());
        res.status(500).json({error: "error al agregar el producto"})
    }
    
})

//! ruta para modificar un producto
router.put("/:pid", async (req,res)=>{
    let id = req.params.pid
    let {title, description, price} = req.body

    try {
        await manager.getProductById(parseInt(id))

        if(producto !== -1){
            arrayProductos[producto].title = title
            arrayProductos[producto].description = description
            arrayProductos[producto].price = price

            console.log(producto);
            res.send({status: "success", mensaje: "producto actualizado"})
        } else{
            res.status(404).send({status: "error", mensaje: "producto no encontrado"})
        }
    } catch (error) {
        console.log(error.toString());
        res.status(500).json({error: "error al modificar el producto"})
    }


})

//! ruta para eliminar un producto
router.delete("/:pid", async (req,res)=>{

})

export default router
