import express from "express";
import CartManager from "../managers/cart-manager.js";
import ProductManager from "../managers/product-manager.js";

const router = express.Router();
const productManager = new ProductManager()
const cartManager = new CartManager()

router.get("/products", async (req,res) => {
    try {
        const { page = 1, limit = 3 } = req.query

        const productos = await productManager.getProducts({ page: parseInt(page), limit: parseInt(limit) });

        const listado = productos.docs.map(producto => {
            const {_id, ...rest} = producto.toObject()

            return rest
        })

        res.render("products", {
            productos: listado,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            currentPage: productos.page,
            totalPages: productos.totalPages
        });
    } catch (error) {
        console.log("error al obtener los productos", error);
        res.status(500).json({status: "error", error: "error interno del servidor"})
    }
});

router.get("/carts/:cid", async (req,res) => {
    const cartId = req.params.cid

    try {
        const carrito = await cartManager.getCarritoById(cartId)

        if(!carrito) {
            console.log("no se encuentra ningun carrito que tenga ese id")
            return res.status(404).json({status: "error", message: "no encontrado"})
        }

    const productos = carrito.products.map(producto => ({
        product: producto.product.toObject(), 
        quantity: producto.quantity
    }))

    res.render("carts", {productos: productos})
    } catch (error) {
        console.log("error al intentar obtener el carrito", error);
        res.status(500).json({status: "error", error: "error interno del servidor"})
    }
})



export default router;