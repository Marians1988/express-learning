import { HttpStatusCode } from "axios";
export default (err, req, res, next) => {
    console.error(`[Error Log]: ${err.message}`);
    const statusCode = err.status || HttpStatusCode.InternalServerError;
    res.status(statusCode).json({
        success: false,
        status: err.status || HttpStatusCode.InternalServerError,
        message: err.message || 'InternalServerError',
        errors: err.errors || undefined
    });
};
