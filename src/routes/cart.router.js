import { Router } from "express";
const router = Router()

//!llamo cart manager
import CartManager from "../managers/cart-manager.js";
const manager = new CartManager("./src/data/carts.json")

//! 1- crear nuevo carrito
router.post("/", async (req,res) => {
    try {
        const nuevoCarrito = await manager.CrearCarrito()
        res.json(nuevoCarrito)
    } catch (error) {
        res.status(500).json({error: "error al crear el carrito"})
    }
})

//! 2- listamos los productos que pertenecen a tal carrito
router.get("/:cid", async (req,res)=>{
    const cartId = parseInt(req.params.cid)

    try {
        const carritoBuscado = await manager.getCarritoById(cartId)
        res.json(carritoBuscado.products)
    } catch (error) {
        res.status(500).json({error: "no se encontro el carrito"})
    }
})

//! 3- agregar productos al carrito
router.post("/:cid/product/:pid", async (req,res)=>{
    const cartId = parseInt(req.params.cid); 
    const productId = req.params.pid; 
    const quantity = req.body.quantity || 1; 

    try {
        const actualizarCarrito = await manager.agregarProductoAlCarrito(cartId, productId, quantity)
        res.json(actualizarCarrito.products)
    } catch (error) {
        res.status(500).json({error: "no se pudieron agregar los productos al carrito"})
    }
})

export default router