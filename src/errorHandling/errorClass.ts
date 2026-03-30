export class AppError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    // Mantiene lo stack trace corretto (specifico per V8/Node)
    Error.captureStackTrace(this, this.constructor);
  }
}
