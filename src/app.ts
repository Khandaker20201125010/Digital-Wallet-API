import cors from "cors";
import express,{Request,Response} from "express";
import { userRoutes } from "./app/modules/user/user.router";


const app = express();
app.use(express.json())
app.use(cors())


app.use("/api/v1/users/",userRoutes)


app.get("/", (req:Request, res:Response) => {
    res.status(200).json({
        message:"Getting Into Digital Wallet Server"
    })
    
})

export default app;