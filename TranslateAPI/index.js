// importing express
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 3000;

const db = "mongodb+srv://umashankar:8726160693@cluster0.va1mo.mongodb.net/TranslateDB?retryWrites=true&w=majority";

mongoose.connect(db,{
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false
}).then(()=> {
    console.log('connection successful');
}).catch((err) => console.log('not connected'));

const Text = require('./Models/textSchema');

// ejs template engine
const ejs = require('ejs');

// requiring translate api
const translate = require('@vitalets/google-translate-api');
const { response } = require('express');

// initalizing app
const app = express();

// setup the template engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'));

// public folder setup
app.use(express.static(__dirname + '/public'));

// body parser middleware
app.use(express.urlencoded({extended:true}));

// Form page route
app.get('/', (req,res) => {
     res.render('index.ejs',{title:"Translated Text", text:""});
});

// route to handle form data
app.post('/translate', (req,res) => {
    // getting form data from the request body
    const text= req.body.text;

    // destination language
    const language= req.body.language

    if(!language || !text){
        return ('/back');
    }

    Text.findOne({text: text})
    .then((response) => {
        if(!response){
            const text = new Text({language:req.body.language,text: req.body.text});
            text.save().then(() => {
                console.log('saved');
            }).catch(err => {
                console.log("error");
            })
        }
    }).catch(err => {
        console.log("error in finding text");
    })

    // call translate method
    translate(text,{to: language}).then(response => {
        console.log(response.text);
     return res.render('index.ejs',{title:"Translated Text", text:response.text});
    }).catch(err => {
        console.error(err);
    });
});

app.listen(port,() => {
    console.log(`Server running on port ${port}`)
});

