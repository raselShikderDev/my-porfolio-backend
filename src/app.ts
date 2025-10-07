import express, { type Application, type Request, type Response } from "express"
import cors from "cors"
import compression from "compression"
// import { envVars } from "./configs/envVars.js"
import notFound from "./middlewares/notFound.js"
import globalError from "./middlewares/globalError.js"
import { appRoutes } from "./routes/mainRouter.js"
import cookieParser from "cookie-parser"
import { envVars } from "./configs/envVars.js"


const app:Application = express()

// app.use(cors())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.use(cors({
    origin:envVars.FRONTEND_URL as string,
    credentials:true
}))
// app.use(cors({
//   origin: (origin, callback) => {
//     // Allow requests with no origin (like Postman, curl)
//     if (!origin) return callback(null, true);
//     // Otherwise, allow the frontend that made the request
//     callback(null, true);
//   },
//   credentials: true, // Allow cookies and auth headers
// }));

app.get("/api/v1/test-cors", (req: Request, res: Response) => {
    res.json({ 
        message: "CORS test successful",
        timestamp: new Date().toISOString()
    });
});

app.use("/api/v1", appRoutes)


app.get("/", (req:Request, res:Response)=>{
    res.send("Welcome to th my porfolio - Rasel Shikder")
})


app.use(globalError)


app.use(notFound)

export default app