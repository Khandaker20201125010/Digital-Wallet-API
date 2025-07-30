/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"

export const  globalErrorHandler = (err:any, req :Request, res:Response, next:NextFunction) => {

    const statusCode = err.status || 500;
    const message = err.message || `Opps! Something went wrong ${err.message} from global error`;

     res.status(statusCode).json({
        success: false,
        message, 
        err,
        stack: envVars.NODE_ENV === "development" ? err.stack : null,
     })
}