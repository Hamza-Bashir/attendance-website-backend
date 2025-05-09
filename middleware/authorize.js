const { STATUS_CODES, TEXTS } = require("../config/constants");

const authorize = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;


    if (!userRole || !roles.includes(userRole)) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: TEXTS.UNAUTHORIZED
      });
    }

    next();
  };
};

module.exports = { authorize };
