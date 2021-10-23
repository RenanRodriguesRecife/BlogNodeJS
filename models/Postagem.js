const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Postagem = new Schema({
    titulo:{
        type: String,
        require: true
    },
    slug:{
        type: String,
        required: true
    },
    descricao:{
        type: String,
        required: true
    },
    conteudo:{
        type: String,
        require: true
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref: "categorias",
        require: true
    },
    data:{
        type: Date,
        default: Date.now()
    }

})

mongoose.model("postagens", Postagem)