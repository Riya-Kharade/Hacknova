import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
dotenv.config()
import cors from "cors"


let port = process.env.PORT || 6000

let app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.use("/api/auth", authRouter )

app.use("/api", chatRoute);





app.listen(port,()=>{
    connectDb()
    console.log("server started")
})