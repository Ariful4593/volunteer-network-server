const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config()

const ObjectId = require('mongodb').ObjectId
const dbName = 'volunteerNetwork';
const collectionName = 'volunteer';

const dbUserName = 'volunteerAdmin';
const pass = 'volunteerAdmin71';


const app = express();
app.get('/', (req, res) => {
    res.send('Hello World');
})


app.use(bodyParser.json());
app.use(cors());

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xsirj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const volunteerCollection = client.db("volunteerNetwork").collection("volunteer");

    const connectedCollection = client.db("volunteerNetwork").collection("connected");

    const volunteerRegister = client.db("volunteerNetwork").collection("registerList");

    app.post('/volunteerRegisterData', (req, res) => {
        const volData = req.body;
        volunteerRegister.insertOne(volData)
        .then(result =>{
            res.send(result.insertedCount > 0);
        })
    })
    
    app.get('/getVolunteerData', (req, res) =>{
        volunteerRegister.find({})
        .toArray( (err, documents) =>{
            res.send(documents)
        })
    })

    app.post('/addCart', (req, res) =>{
        
        const card = req.body;
        connectedCollection.insertOne(card)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/volunteerSelected', (req, res) =>{
        console.log(req.query.email)
        connectedCollection.find({email: req.query.email})
        .toArray( (err, documents) =>{
            res.send(documents)
        }) 
    })

    app.delete("/delete/:id", (req, res) => {
        console.log(req.params.id)
        connectedCollection.deleteOne({ _id: req.params.id })
            .then((result) => {
                console.log("Result successfully",result)
                console.log(result.deletedCount)
                res.send(result.deletedCount > 0);
            })
            
    })
    
    app.get('/volunteerCard', (req, res) =>{
        volunteerCollection.find({})
        .toArray( (err, documents) =>{
            res.send(documents)
        }) 
    })
});




app.listen(process.env.PORT || 4000)