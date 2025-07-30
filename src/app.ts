import cors from "cors";
import express,{NextFunction, Request,Response} from "express";
import { router } from "./app/routes";
import { envVars } from "./app/config/env";
import { globalErrorHandler } from "./app/middlewares/globalErroHandeler";



const app = express();
app.use(express.json())
app.use(cors())


app.use("/api/v1",router)


app.get("/", (req:Request, res:Response) => {
    res.status(200).json({
        message:"Getting Into Digital Wallet Server"
    })
    
})


app.use(globalErrorHandler)

export default app;