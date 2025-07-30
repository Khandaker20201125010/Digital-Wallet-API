/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errroHelpers/appError";

export const  globalErrorHandler = (err:any, req :Request, res:Response, next:NextFunction) => {

    let statusCode = err.status || 500;
    let message = err.message || `Opps! Something went wrong ${err.message} from global error`;

    if(err instanceof AppError){
      statusCode = err.statusCode;
      message = err.message;
    }else if(err instanceof Error){
      statusCode = 500;
      message = err.message
    }

     res.status(statusCode).json({
        success: false,
        message, 
        err,
        stack: envVars.NODE_ENV === "development" ? err.stack : null,
     })
}