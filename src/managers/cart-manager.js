import CartModel from "../models/cart.model.js"

class CartManager{

    //! crear carrito
    async crearCarrito(){
        try {
            const nuevoCarrito = new CartModel({products: []})

            await nuevoCarrito.save()
            return nuevoCarrito
        } catch (error) {
            console.log("error al intentar crear el nuevo carrito", error)
            throw error
        }
    }

    //! obtener carrito por su id
    async getCarritoById(cartId){
        try {
            const carrito = await CartModel.findById(cartId)

            if (!carrito) {
                console.log("no se ha encontrado un carrito con este id");
                return null
            }

            return carrito
        } catch (error) {
            console.log("ha ocurrido un error al intentar mostrar el carrito", error);
            throw error
        }
    }

    //! agregar un producto al carrito
    async agregarUnProductoAlCarrito(cartId, productId, quantity = 1){
        try {
            const carrito = await this.getCarritoById(cartId)
            const productoEnElCarrito = carrito.products.find(producto => producto.product.toString()===productId)

            if (productoEnElCarrito) {
                productoEnElCarrito.quantity += quantity
            } else{
                carrito.products.push({product: productId, quantity})
            }

            carrito.markModified("products")

            await carrito.save()
            return carrito
        } catch (error) {
            console.log("error al intentar agregar un producto al carrito", error)
            throw error
        }
    }

    //! eliminar un producto del carrito
    async eliminarUnProductoDelCarrito(cartId, productId){
        try {
            const carrito = await this.getCarritoById(cartId)

            carrito.products = carrito.products.filter(producto => producto.product._id.toString() !== productId)

            await carrito.save()
            return carrito
        } catch (error) {
            console.log("error al intentar eliminar el producto del carrito", error);
            throw error
        }
    }

    //!actualizar el carrito
    async actualizarElCarrito(cartId, updatedProducts){
        try {
            const carrito = await this.getCarritoById(cartId)

            carrito.products = productosActualizados
            carrito.markModified("products")

            await carrito.save()
        } catch (error) {
            console.log("error al intentar actualizar el carrito", error);
            throw error
        }
    }

    //!actualizar la cantidad de productos
    async actualizarLaCantidadDeProductos(cartId, productId, nuevaCantidad){
        try {
            const carrito = await this.getCarritoById(cartId)
            
            const indexProducto = carrito.products.findIndex(producto => producto.product._id.toString() === productId)

            if (indexProducto !== -1) {
                carrito.products[indexProducto].quantity = nuevaCantidad

                carrito.markModified("products")

                await carrito.save()
                return carrito
            } else {
                console.log("error al intentar encontrar el producto dentro del carrito")
            }
        } catch (error) {
            console.log("error al intentar actualizar la cantidad de este producto", error)
            throw error
        }
    }

    //!vaciar el carrito
    async vaciarElCarrito(cartId){
        try {
            const carrito = await CartModel.findByIdAndUpdate(cartId, {products:[]}, {new:true})

            if (!carrito) {
                console.log("no se ha encontrado un carrito con este id");
                return null
            }
    
            return carrito
        } catch (error) {
            console.log("error al intentar vaciar el carrito", error);
            throw error
        }
    }
}

export default CartManager
