export class AppError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        // Mantiene lo stack trace corretto (specifico per V8/Node)
        Error.captureStackTrace(this, this.constructor);
    }
}
