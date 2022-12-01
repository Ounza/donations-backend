import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import {MongoClient} from "mongodb"
import { ngosRouter } from "./ngos.js"
import { userAuthRouter } from "./userauth.js"
import { orderRouter } from "./order.js"
import Razorpay from "razorpay"

dotenv.config()

const app = express()

const PORT = process.env.PORT

var instance = new Razorpay({
  key_id:process.env.key_id,
  key_secret:process.env.key_secret
});

app.use(cors({origin:true}));

app.use(express.json())

const MONGO_URL = process.env.MONGO_URL

async function createConnection(){
    const client = new MongoClient(MONGO_URL)
    await client.connect()
    console.log("mongodb connected")
    return client
}

export const client = await createConnection()

app.get("/", (request, response)=>{
    response.send("hi from charity donation app")
})

app.get("/charity-donations/order/createOrder/:grandTotal", (request, response)=>{
    request.setHeader('Access-Control-Allow-Origin', '*');
    request.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    );
    let {grandTotal} = request.params
    const amount = grandTotal * 100
    const currency = "KSH"
    const receipt = "receipt#123"
    instance.orders.create({amount, currency, receipt}, (error, order)=>{
        if(error){
            return response.send({error:error.message})
        }else{
            return response.send(order)
        }
    })
})

app.use("/charity-donations/user", userAuthRouter)
app.use("/ngos", ngosRouter)
app.use("/charity-donations/order", orderRouter)


app.listen(PORT, ()=>{
    console.log("app started at", PORT)
})