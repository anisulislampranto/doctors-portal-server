const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()
// const corsOptions = {
//   origin: '*',
//   optionsSuccessStatus: 200,
//   }

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9uobc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

// app.use(cors(corsOptions));
app.use(express.json());
app.use(cors({origin:'*'}));
app.use(bodyParser.json());




const port = process.env.PORT || 5500;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const apointmentCollection = client.db("doctorsPortal").collection("appoointments");

  app.post('/addAppointment',(req, res)=>{
        const appointment =  req.body;
        apointmentCollection.insertOne(appointment)
        .then(result => {
            res.send(result.insertedCount)
        })
  })

  app.post('/appointmentByDate',(req, res)=>{
      const date =  req.body;
      console.log(date)
      apointmentCollection.find({date: date})
      .toArray((err, documents) => {
          res.send(documents)
      })
  })


});


app.get('/', (req, res) => {
  res.send('Hello planet B!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})