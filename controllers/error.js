import logger from "../handlers/logger.js";

export const pageNotFound = (req, res, next) => {
  const error = new Error(`Not Found-${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const error = (error, req, res, next) => {
  logger.log("error", error.message);
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({ message: error.message });
};
