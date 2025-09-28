import express, { type Application, type Request, type Response } from "express"
import cors from "cors"
import compression from "compression"
import { envVars } from "./configs/envVars.js"


const app:Application = express()

app.use(cors())
app.use(compression())
app.use(express.json())

app.use(cors({
    origin:envVars.FRONTEND_URL as string,
    credentials:true
}))

app.get("/", (req:Request, res:Response)=>{
    res.send("Welcome to th my porfolio - Rasel Shikder")
})


export default app