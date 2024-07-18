import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }

  if (process.env.NODE_ENV === 'production') {
    let message = err.message;
    let error = new Error(message);

    // Handle validation errors specified in schema design
    if (err.name === 'ValidationError') {
      message = Object.values(err.errors).map((value: any) => value.message).join(', ');
      error = new Error(message);
    }

    // Handle cast errors (e.g., resource not found)
    if (err.name === 'CastError') {
      message = `Resource not found for ${err.path}`;
      error = new Error(message);
    }

    res.status(err.statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};

export default errorHandler;
