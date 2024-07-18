class ErrorHandler extends Error {
    statusCode: number;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
  
      // Ensure correct stack trace capture
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export default ErrorHandler;
  