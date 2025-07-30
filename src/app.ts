import cors from "cors";
import express,{Request,Response} from "express";


const app = express();
app.use(express.json())
app.use(cors())

app.get("/", (req:Request, res:Response) => {
    res.status(200).json({
        message:"Getting Into Digital Wallet Server"
    })
    
})

export default app;