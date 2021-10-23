//carregando modulos 
const express = require("express")
const handlebars = require("express-handlebars")
const bodyParser = require("body-parser")
const app = express()
const admin = require("./rotas/admin")
const path = require("path")
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")
require("./models/Postagem")
const Postagem = mongoose.model("postagens")
require("./models/Categorias")
const Categoria = mongoose.model("categorias")

//configuraçãoes
    //sessão
    app.use(session({
        secret: "cursodenode",
        resave: true,
        saveUninitialized: true

    }))
    app.use(flash())

//body parser
    app.use(bodyParser.urlencoded({extended:true}))
    app.use(bodyParser.json())
//Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine','handlebars')

//Mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/blog").then(() => {
    console.log("Conectado ao mongo")
}).catch((err)=>{
    console.log("Erro ao se conectar: " + err)
})
//rotas

app.use((req,res,next)=>{
    res.locals.sucess_msg = req.flash("sucess_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})

app.get('/', (req,res) => {
    Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens) =>{
        res.render("index",{postagens: postagens})
    }).catch((err) =>{
        req.flash("error_msg","Houve um erro interno")
        res.redirect("/404")
    })
    
})

app.get("/categorias",(req,res)=>{
    Categoria.find().then((categorias)=>{
        res.render("categorias/index",{categorias: categorias})
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro interno ao listar as categorias")
        res.redirect("/")
    })
})

app.get("/categorias/:slug", (req,res)=>{
    Categoria.findOne({slug: req.params.slug}).then((categoria)=>{
        if(categoria){
            Postagem.find({categoria: categoria._id}).then((postagens)=>{
            res.render("categorias/postagens",{postagens: postagens, categoria: categoria})
            }).catch((err) => {
                req.flash("error_msg","Houve um erro ao listar os post!")
                res.redirect("/")
            })
        }else{
            req.flash("error_msg","Esta categoria não existe")
            res.redirect("/")
        }
    }).catch((err)=>{
        req.flash("error_msg","Esta categoria não existe")
        res.redirect("/")
    })
})

app.get("/404",(req,res)=>{
    res.send("Erro 404!")
})

app.use('/admin',admin)
//Public

app.use(express.static(path.join(__dirname,"public")))



const PORT = 3333;
app.listen(PORT,()=> {(console.log("servidor rodando!"))
})
