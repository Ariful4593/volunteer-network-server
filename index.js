const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
require('dotenv').config()
const port = 4000;
const app = express();


app.use(bodyParser.json())
app.use(cors());
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xsirj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    
    const volunteerCollection = client.db("volunteerNetworkFinal").collection("volunteerFinalDB");

    const volunteerRegister = client.db("volunteerNetworkFinal").collection("volunteerRegisterData");

    const volunteerSelected = client.db("volunteerNetworkFinal").collection("volunteerSelectedCard");

    app.post('/addVolunteer', (req, res) => {
        const data = req.body;
        volunteerRegister.insertOne(data)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.post('/addVolunteerSelected', (req, res) => {
        const data = req.body;
        volunteerSelected.insertOne(data)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/volunteerSelectedInfo', (req, res) => {
        volunteerSelected.find({email: req.query.email})
        .toArray( (err, documents) =>{
            res.send(documents)
        })
    })

    

    app.get('/getVolunteerRegisterInfo', (req, res) =>{
        volunteerRegister.find({})
        .toArray( (err, documents) => {
            res.send(documents)
        })
    })

    app.post('/addDatabase', (req, res) =>{
        const card = req.body;
        volunteerCollection.insertMany(card)
        .then(result =>{
            res.send(result.insertedCount > 0)
        })
    })
    app.get('/getDatabase', (req, res) =>{
        volunteerCollection.find({})
        .toArray((err, documents) =>{
            res.send(documents)
        })
    })

    

    app.delete('/delete/:id', (req, res) =>{
        volunteerSelected.deleteOne({_id: req.params.id})
        .then(result => {
            res.send(result.deletedCount > 0)
        })
    })

    app.delete('/deleteRegister/:id', (req, res) =>{
        console.log(req.params.id)
        volunteerRegister.deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
            res.send(result.deletedCount > 0)
        })
    })

    app.get('/tasks', (req, res) =>{
        const searchItem = req.query.search;
        console.log(searchItem)
        volunteerCollection.find({title: {$regex: searchItem}})
        .toArray( (err, documents) =>{
            res.send(documents)
        } )
    })


    app.get('/adminArea', (req, res) =>{
        res.send("Hey i am admin")
    })
});

app.get('/', (req, res) => {
    res.send("Hello I am Ariful ISALM");
})


app.listen(process.env.PORT || port)