import express from "express"
import ProductManager from "../managers/product-manager.js";

const router = express.Router()
const productManager = new ProductManager()

//! ruta para listar todos los productos
router.get("/", async (req,res)=>{
    try {
        const { limit = 10, page = 1, sort, query } = req.query

        const productos = await productManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort, query
        })
        
        res.json({
            status: 'success',
            payload: productos,
            totalPages: productos.totalPages,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            page: productos.page,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevLink: productos.hasPrevPage ? `/api/products?limit=${limit}&page=${productos.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: productos.hasNextPage ? `/api/products?limit=${limit}&page=${productos.nextPage}&sort=${sort}&query=${query}` : null,
        })
    } catch (error) {
        console.log("error al obtener los productos", error);
        res.status(500).json({status: "error", error: "error interno del servidor"})
    }
})

//! ruta para retornar un producto por id
router.get("/:pid", async (req,res)=>{
    let id = req.params.pid;
    try {
        const productoBuscado = await productManager.getProductById(id)

        if (!productoBuscado) {
            console.log("el producto no ha sido encontrado");
        }

        res.json(productoBuscado)
    } catch (error) {
        console.log("error al obtener el producto", error);
        res.status(500).json({status: "error", error: "error interno del servidor"})
    }

})

//! ruta para agregar un nuevo producto
router.post("/", async (req,res)=>{

    const nuevoProducto = req.body

    try {
        await productManager.addProduct(nuevoProducto)

        res.status(201).json({ message: "el producto ha sido agregado con exito"})
    } catch (error) {
        console.log("error al agregar el producto", error);
        res.status(500).json({status: "error", error: "error interno del servidor"})
    }
})

//! ruta para modificar un producto
router.put("/:pid", async (req,res)=>{

    let id = req.params.pid
    let nuevoProducto = req.body

    try {
        await productManager.UpdateProductById(id, nuevoProducto)

        res.status(200).json({ message: "el producto ha sido actualizado con exito"})
    } catch (error) {
        console.log("error al actualizar el producto", error);
        res.status(500).json({status: "error", error: "error interno del servidor"})
    }
})

//! ruta para eliminar un producto
router.delete("/:pid", async (req,res)=>{
    let id = req.params.pid

    try {
        await productManager.deleteProductById(id)
        
        res.json({ message: "el producto ha sido eliminado con exito"})

    } catch (error) {
        console.log("error al eliminar el producto", error);
        res.status(500).json({status: "error", error: "error interno del servidor"})
    }
})

export default router
