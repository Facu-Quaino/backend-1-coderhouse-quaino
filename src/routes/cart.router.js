import express from "express"
import CartManager from "../managers/cart-manager.js";
import CartModel from "../models/cart.model.js";

const router = express.Router()
const cartManager = new CartManager()

//! crear nuevo carrito
router.post("/", async (req,res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito()
        res.json(nuevoCarrito)
    } catch (error) {
        console.log("error al intentar crear el carrito", error);
        res.status(500).json({status: "error", error: "error interno del servidor"})
    }
})

//! listamos los productos que pertenecen a tal carrito
router.get("/:cid", async (req,res)=>{
    const cartId = req.params.cid

    try {
        const carritoBuscado = await cartManager.getCarritoById(cartId)
        res.json(carritoBuscado.products)
    } catch (error) {
        console.log("error al intentar obtener el carrito", error);
        res.status(500).json({status: "error", error: "error interno del servidor"})
    }
})

//! agregar productos al carrito
router.post("/:cid/product/:pid", async (req,res)=>{
    const cartId = req.params.cid; 
    const productId = req.params.pid; 
    const quantity = req.body.quantity || 1; 

    try {
        const actualizarCarrito = await cartManager.agregarUnProductoAlCarrito(cartId, productId, quantity)
        res.json(actualizarCarrito.products)
    } catch (error) {
        console.log("error al intentar agregar productos en el carrito", error);
        res.status(500).json({status: "error", error: "error interno del servidor"})
    }
})

//! elimino un solo producto del carrito
router.delete("/:cid/product/:pid", async (req,res) => {
    const cartId = req.params.cid; 
    const productId = req.params.pid;

    try {
        const productoBorrado = await cartManager.eliminarUnProductoDelCarrito(cartId, productId)

        res.json({status: "success", message: "el producto ha sido eliminado del carrito", productoBorrado})
    } catch (error) {
        console.log("error al intentar eliminar un producto del carrito", error);
        res.status(500).json({status: "error", error: "error interno del servidor"})
    }
})

//!actualizo productos en el carrito
router.put("/:cid", async (req,res) => {
    const cartId = req.params.cid
    const productos = req.body

    try {
        const carritoActualizado = await cartManager.actualizarElCarrito(cartId, productos)
        res.json({status: "success", message: "el carrito ha sido actualizado", carritoActualizado})
    } catch (error) {
        console.log("error al intentar actualizar el carrito", error);
        res.status(500).json({status: "error", error: "error interno del servidor"})
    }
})

//!actualizo cantidades de productos
router.put("/:cid/product/:pid", async (req,res) => {
    const cartId = req.params.cid; 
    const productId = req.params.pid;
    const cantidad = req.body.quantity

    try {
        const cantidadActualizada = await cartManager.actualizarLaCantidadDeProductos(cartId, productId, cantidad)
        res.json({status: "success", message: "el carrito ha sido actualizado", cantidadActualizada})
    } catch (error) {
        console.log("error al intentar actualizar la cantidad del producto dentro del carrito", error);
        res.status(500).json({status: "error", error: "error interno del servidor"})
    }
})

//!vacio el carrito
router.delete("/:cid", async (req,res) => {
    const cartId = req.params.cid; 

    try {
        const vaciarCarrito = await cartManager.vaciarElCarrito(cartId)
        res.json({status: "success", message: "el carrito ha sido vaciado", vaciarCarrito})
    } catch (error) {
        console.log("error al intentar vaciar el carrito", error);
        res.status(500).json({status: "error", error: "error interno del servidor"})
    }
})

export default router
