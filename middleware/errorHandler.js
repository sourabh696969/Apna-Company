const { constants } = require("../constraints");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  switch (statusCode) {
    case constants.NOT_FOUND:
      res.json({
        statusCode: constants.NOT_FOUND,
        title: "Not Found",
        message: err.message,
      });
      break;
    case constants.VALIDATION_ERROR:
      res.json({
        statusCode: constants.VALIDATION_ERROR,
        title: "Validation Faild",
        message: err.message,
      });
      break;
    case constants.FORBIDDEN:
      res.json({
        statusCode: constants.FORBIDDEN,
        title: "Forbidden",
        message: err.message,
      });
      break;
    case constants.UNAUTHORIZED:
      res.json({
        statusCode: constants.UNAUTHORIZED,
        title: "Unauthorized",
        message: err.message,
      });
      break;
    case constants.SERVER_ERROR:
      res.json({
        statusCode: constants.SERVER_ERROR,
        title: "Server Error",
        message: err.message,
      });
      break;

    default:
      console.log(err);
      break;
  }
};

module.exports = errorHandler;
