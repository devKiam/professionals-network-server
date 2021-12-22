const express = require('express')
const app = express()
const port = 5000
const cors = require('cors')
const objectId = require('mongodb').ObjectId


// middleware
app.use(cors())
app.use(express.json())     //  string data convert to json


// mongodb connection and inserting data into db ----------------------------------------------------------------------------------------------

const {MongoClient} = require('mongodb');
const {json} = require("express");
const uri = "mongodb+srv://kiamknowsriwanon:8wegGojRag3K9TUS@cluster0.isxky.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
// client.connect(err => {
//     const collection = client.db("food").collection("users");
//     // perform actions on the collection object
//     console.log('hitting the db')
//
//     // inserting a data
//     const user = {name:'Kiam', address:'MI'}
//     collection.insertOne(user)
//         .then(() => {
//             console.log('insert successful')
//         })
//
//     // client.close();
// });

async function run() {
    try {
        await client.connect();
        const database = client.db("food");
        const usersCollection = database.collection("users");
        const jobsCollection = database.collection("jobs");
        const usersInfoCollection = database.collection("usersInfo");
        // create a document to insert
        // const doc = {
        //     name: "Maria",
        //     address: "Russia",
        // }
        // const result = await usersCollection.insertOne(doc);
        // console.log(`A document was inserted with the _id: ${result.insertedId}`);


        // POST api for posts-timeline-------------------------------
        app.post('/users', async (req, res) => {
            const doc = req.body
            const result = await usersCollection.insertOne(doc);

            console.log('got new user', req.body)
            console.log('added user', result)
            res.send(JSON.stringify(result))
        })

        // GET api
        app.get('/users', async (req, res) => {
            const data = usersCollection.find({})
            const dataArr = await data.toArray()
            res.send(dataArr)
        })

        // DELETE api
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id
            const query = {_id: objectId(id)};
            const result = await usersCollection.deleteOne(query);
            console.log('deleting ', result)
            res.send(JSON.stringify(result))
        })






        // POST api for jobs
        app.post('/jobs', async (req, res) => {
            const doc = req.body
            const result = await jobsCollection.insertOne(doc);

            console.log('got new job', req.body)
            console.log('added job', result)
            res.send(JSON.stringify(result))
        })

        // GET api
        app.get('/jobs', async (req, res) => {
            const search = req.query.search
            const data = jobsCollection.find({})
            const dataArr = await data.toArray()

            if (search) {
                const result = dataArr.filter(x => x.name.toLowerCase().includes(search.toLowerCase()))
                res.send(result)
            } else {
                res.send(dataArr)
            }
            res.send(dataArr)
        })


        // app.get('/users', (req, res) => {
        //     const search = req.query.search
        //
        //     //  search query
        //     if (search) {
        //         const result = fakeData.filter(x => x.name.toLowerCase().includes(search.toLowerCase()))
        //         res.send(result)
        //     } else {
        //         res.send(fakeData)
        //     }
        //
        // })


        // saving user information API PUT
        app.put('/usersInfo', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersInfoCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });
        // GET api
        app.get('/usersInfo', async (req, res) => {
            const data = usersInfoCollection.find({})
            const dataArr = await data.toArray()
            res.send(dataArr)
        })


    } finally {
        // await client.close();
    }
}

run().catch(console.dir);

// mongodb connection and inserting data into db ----------------------------------------------------------------------------------------------





//  checking if works
app.get('/', (req, res) => {
    res.send("Hello Node")
})
//  checking if works


app.listen(port, () => {
    console.log('listening to port', port)
})


// mongodb database user-admin information
// username: kiamknowsriwanon
// password: 8wegGojRag3K9TUS