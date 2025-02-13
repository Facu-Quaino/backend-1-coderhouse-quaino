import ProductModel from "../models/product.model.js";

class ProductManager {

    //! agregar producto
    async addProduct({title, description, price, img, code, stock, category, thumbnails}){
        try {
            //*valido que se agregaron todos los campos
            if (!title || !description || !price || !code || !stock || !category) {
                console.log("Debe llenar todos los campos");
                return
            }

            //*valido que el code sea unico
            const productoExistente = await ProductModel.findOne({code: code})

            if(productoExistente){
                console.log("No pueden existir dos productos con el mismo codigo");
                return
            }

            //*una vez que paso las validaciones puedo crear un producto nuevo
            const nuevoProducto = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            })

            await nuevoProducto.save()
        } catch (error) {
            console.log("Ha surgido un error al intentar agregar el producto", error);
            throw error
        }
    }

    //! obtener productos
    async getProducts({ limit = 10, page = 1, sort, query } = {}){
        try {
            const skip = (page - 1) * limit;

            let queryOptions = {};

            if (query) {
                queryOptions = { category: query };
            }

            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }

            const productos = await ProductModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments(queryOptions);

            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: productos,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            console.log("Error al obtener los productos", error);
            throw error;
        }
    }

    //!obtener un producto por su id
    async getProductById(id){
        try {
            const producto = await ProductModel.findById(id)

            if (!producto) {
                console.log("no se ha encontrado el producto");
                return null
            }

            console.log("Se ha encontrado el producto");
            return producto
            
        } catch (error) {
            console.log("No se ha logrado obtener el producto", error);
            throw error;
        }
    }

    //!modificar un producto por su id
    async UpdateProductById(id , actualizado){
        try {
            const encontrarYActualizar = await ProductModel.findByIdAndUpdate(id, actualizado)

            if (!encontrarYActualizar) {
                console.log("el producto no ha sido encontrado");
                return null
            }

            console.log("el producto ha sido actualizado con exito")
            return encontrarYActualizar
        } catch (error) {
            console.log("error al actualizar el producto", error);
            throw error
        }
    }

    //! borrar un producto por su id
    async deleteProductById(id){
        try {
            const encontrarYBorrar = await ProductModel.findByIdAndDelete(id)

            if (!encontrarYBorrar) {
                console.log("no se encuentra el producto");
                return null
            }
        } catch (error) {
            console.log("error al intentar borrar el producto", error);
            throw error
        }
    }
}

export default ProductManager