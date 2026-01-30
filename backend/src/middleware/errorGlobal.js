const errorGlobal = (err, req, res, next) => {
  let statusCode = err.status || 500;
  let message = err.message || "Internal Server Error";
  if (err.message === "ValidationError") {
    statusCode = 400;
    message = "Invalid data provided";
  }
  res.status(statusCode).json({
    success: false,
    path: req.originalUrl,
    error: message,
  });
};

export default errorGlobal;
