// src/middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
    console.error(`Error ${err.message}`);
    const statusCode = err.statusCode || 500;
    
    res.status(statusCode).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};