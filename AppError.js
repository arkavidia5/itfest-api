class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        this.statusCode = statusCode;
    }

}

module.exports = AppError;
