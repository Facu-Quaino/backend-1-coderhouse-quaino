import mongoose from "mongoose";

mongoose.connect("mongodb+srv://facu_quaino:coderhouse@cluster0.7ifbx.mongodb.net/proyecto-final?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Se ha conectado a la base de datos"))
    .catch((error) => console.log("Ha ocurrido un error al intentar conectarse a la base de datos:", error));