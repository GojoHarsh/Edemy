import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDb from './configs/mongoDb.js';
import { clerkWebhooks } from './controllers/webhook.js';

//initialized express 
const app = express();

//Connect to database
await connectDb();

//middleware 
app.use(cors());

//Routes
app.get('/',(req, res )=>{
    res.send("api working");
})
app.post('/clerk' ,express.json(),clerkWebhooks)

//PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`app started on Port : ${PORT}`)
})
