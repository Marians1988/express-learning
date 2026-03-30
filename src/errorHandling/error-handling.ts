import { HttpStatusCode } from "axios";
import { Request, Response, NextFunction } from "express";


export default (err: any , req :Request, res :Response, next: NextFunction) => {
  
  console.error(`[Error Log]: ${err.message}`);

  const statusCode = err.status || HttpStatusCode.InternalServerError;
  res.status(statusCode).json({
    success: false,
    status: err.status || HttpStatusCode.InternalServerError,
    message: err.message || 'InternalServerError',  
    errors: err.errors || undefined
  });
};