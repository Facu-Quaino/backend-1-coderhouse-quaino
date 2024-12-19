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

    async getProducts(){
        const arrayProductos = await this.leerArchivo()
        return arrayProductos
    }

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

    //*puedo armar metodos auxiliares que guarden el archivo y recupere los datos (opcional)
    async guardarArchivo(arrayProductos){
        try{
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2))
        }catch(error) {
            console.log(error.toString())
            console.log("error al guardar el archivo");
        }
    }

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

//!testing

//*creo una instancia de product manager

// const manager = new ProductManager()

//*llamo get products luego de crear la instancia, debe devolver un array vacio

// console.log(manager.getProducts());

//*llamo add product con los campos

// title: “producto prueba”
// description:”Este es un producto prueba”
// price:200,
// thumbnail:”Sin imagen”
// code:”abc123”,
// stock:25

// manager.addProduct("producto prueba", "este es un producto prueba", 200, "sin imagen", "abc123", 25)

//*llamo a get products de nuevo, debe aparecer el producto prueba

// console.log(manager.getProducts());

//*agrego varios mas oara ver el incremento de id

// manager.addProduct("producto test", "este es un producto test", 150, "sin imagen", "abc124", 15)
// manager.addProduct("producto evaluacion", "este es un producto evaluacion", 300, "sin imagen", "abc125", 20)
// manager.addProduct("producto desafio", "este es un producto desafio", 250, "sin imagen", "abc126", 30)

//*llamo a get products de nuevo, deben aparecer todos los productos con id 1, 2, 3, 4

// console.log(manager.getProducts());

//* si dejo un campo en blanco no se carga el producto que contenga el campo sin llenar porque no pasa la primer evaluacion
//* si pongo el mismo codigo en dos productos no se carga el segundo producto con el mismo codigo porque no pasa la segunda evaluacion

//*evaluo get product by id, si no encuentra el id que tire error, si lo encuentra que tire el producto

// console.log("verifico: ");
// manager.getProductById(2)
// manager.getProductById(20)

