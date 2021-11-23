const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9uobc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(express.json());
app.use(cors({origin:'*'}));
app.use(express.static('doctors'));
app.use(fileUpload());




const port = process.env.PORT || 5500;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const apointmentCollection = client.db("doctorsPortal").collection("appoointments");
  const doctorsCollection = client.db("doctorsPortal").collection("doctor");


  app.post('/addAppointment',(req, res)=>{
        const appointment =  req.body;
        apointmentCollection.insertOne(appointment)
        .then(result => {
            res.send(result.insertedCount)
        })
  })

  app.get('/appointments', (req, res)=>{
    apointmentCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.post('/appointmentByDate',(req, res)=>{
      const date =  req.body.selectedDate;
      console.log(date)
      apointmentCollection.find({date: date})
      .toArray((err, documents) => {
          res.send(documents)
      })
  })

  app.get('/doctors', async (req, res) => {
    const cursor = doctorsCollection.find({});
    const doctors = await cursor.toArray();
    res.json(doctors);
  });

  app.post('/addDoctor', async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const pic = req.files.image;
    const picData = pic.data;
    const encodedPic = picData.toString('base64');
    const imageBuffer = Buffer.from(encodedPic, 'base64');
    const doctor = {
        name,
        email,
        image: imageBuffer
    }
    const result = await doctorsCollection.insertOne(doctor);
    res.json(result);
})



  // app.post('/addDoctor', (req, res) =>{
  //   const file = req.files.file;

  //   const name = req.body.name;
  //   const email = req.body.email;
  //   console.log(name, email, file);

  //   file.mv(`${__dirname}/doctors/${file.name}`, err =>{
  //     if (err) {
  //       console.log(err)
  //       return res.status(500).send({msg: 'failed to upload image'})
  //     }
  //     return res.send({name: file.name, path: `/${file.name}`})

  //   })

  // })


});


app.get('/', (req, res) => {
  res.send('Hello planet B!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})