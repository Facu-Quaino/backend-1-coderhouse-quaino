import {promises as fs} from "fs"

class CartManager{
    constructor(path){
        this.carts = []
        this.path = path
        this.ultId = 0

        //*cargo los carritos almacenados en el archivo
        this.cargarCarritos()
    }

    async cargarCarritos(){
        try {
            const data = await fs.readFile(this.path, "utf-8")
            this.carts = JSON.parse(data)
            if (this.carts.length > 0) {
                //*verifico si hay al menos un carrito creado
                this.ultId = Math.max(...this.carts.map(cart => cart.id))
                //* utilizo el metodo map para crear un nuevo array que solo obtenga los ids del carrito y con Math.max obtengo el mayor
            }
        } catch (error) {
            //* si no existe el archivo, lo creo
            await this.guardarCarritos()
        }
    }

    async guardarCarritos(){
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2))
    }

    //! metodos que me piden las consignas

    async CrearCarrito(){
        const nuevoCarrito = {
            id: ++this.ultId,
            products: []
        }

        //*pusheo el nuevo carrito dentro del array de carritos
        this.carts.push(nuevoCarrito)

        //*guardo este array en el archivo
        await this.guardarCarritos()
        return nuevoCarrito
    }

    async getCarritoById(cartId){
        const carrito = this.carts.find(carro => carro.id === cartId)

        if(!carrito){
            throw new Error("no existe un carrito con ese ID")
        }

        return carrito
        //*en vez de esto puedo usar un try catch
    }

    async agregarProductoAlCarrito(cartId, productId, quantity = 1){
        const carrito = await this.getCarritoById(cartId)

        //*verifico si el producto ya existe en el carrito
        const existeProducto = carrito.products.find(prod => prod.product === productId)

        //*si el producto ya esta en el carrito, le aumento la cantidad
        //*si no esta, lo pusheo
        if (existeProducto) {
            existeProducto.quantity++
        } else{
            carrito.products.push({product: productId, quantity})
        }

        await this.guardarCarritos(); 
        return carrito; 
    }
}

export default CartManager