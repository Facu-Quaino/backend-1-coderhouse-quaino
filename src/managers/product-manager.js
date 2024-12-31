//! actividad 2 - product manager

//*con common js
// const fs = require("fs").promises

//*con ESmodules: 
import {promises as fs} from "fs"

class ProductManager {
    static ultimoId = 0
    constructor(path) {
        this.products = [];
        this.path = path
    }

//! agregar producto

    async addProduct({title, description, price, img, code, stock}){

        //*puedo leer el archivo y guardar el array con los productos
        const arrayProductos = await this.leerArchivo()

        //*valido que se agregaron todos los campos
        if (!title || !description || !price || !img || !code || !stock) {
            console.log("debe llenar todos los campos");
            return
        }

        //*valido que el code sea unico
        if (arrayProductos.some(item => item.code === code)) {
            console.log("el codigo debe ser unico");
            return
        }

        //*una vez que paso las validaciones puedo crear un objeto
        const nuevoProducto = {
            id: ++ProductManager.ultimoId,
            title,
            description,
            price,
            img,
            code,
            stock
        }

        //*una vez lo creo, lo pusheo al array
        arrayProductos.push(nuevoProducto)

        //*una vez que agrego el nuevo producto al array, guardo el array al archivo
        await this.guardarArchivo(arrayProductos)
    }

    //! obtener productos

    async getProducts(){
        const arrayProductos = await this.leerArchivo()
        return arrayProductos
    }

    //!obtener un producto por su id

    async getProductById(id){
        //*primero leo el archivo y genero el array
        const arrayProductos = await this.leerArchivo()

        const producto = arrayProductos.find(item => item.id === id)
        if (!producto) {
            return "not found";
            
        }else{
            return producto;
            
        }
    }

    //!modificar un producto por su id

    async UpdateProductById(id , nuevoProducto ){
        const arrayProductos = await this.leerArchivo()

        const producto = arrayProductos.find(item => item.id === id)
        
        if (!producto) {
            return null;
            
        }else{
            producto.title = nuevoProducto.title
            producto.description = nuevoProducto.description
            producto.price = nuevoProducto.price
            producto.img = nuevoProducto.img
            producto.code = nuevoProducto.code
            producto.stock = nuevoProducto.stock
        }

        await this.guardarArchivo(arrayProductos)
    }

    //! borrar un producto por su id
    async deleteProductById(id){
        const arrayProductos = await this.leerArchivo()

        const productoIndex = arrayProductos.findIndex(item => item.id === id)

        if(productoIndex != -1){
            arrayProductos.splice(productoIndex, 1)
            
        }else{
            return null
        }

        await this.guardarArchivo(arrayProductos)
        return arrayProductos
    }

    //! puedo armar metodos auxiliares que guarden el archivo y recupere los datos (opcional)

    //! guardar los datos

    async guardarArchivo(arrayProductos){
        try{
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2))
        }catch(error) {
            console.log(error.toString())
            console.log("error al guardar el archivo");
        }
    }

    //! recuperar los datos

    async leerArchivo(){
        try{
            const respuesta = await fs.readFile(this.path, "utf-8")
            const arrayProductos = JSON.parse(respuesta)
            return arrayProductos
        }catch(error) {
            console.log("error al intentar leer el archivo");
        }
    }
}

//*con common js
// module.exports = ProductManager;

//*con ESmodules
export default ProductManager