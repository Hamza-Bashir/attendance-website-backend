const { verifyJWTToken } = require("../utilis/jwtToken");
const { STATUS_CODES, TEXTS } = require("../config/constants");

const authenticate = async (req, res, next) => {
 
  const header = req.get("Authorization");
  if (!header || !header.startsWith("Bearer")) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .json({ message: TEXTS.UNAUTHORIZED });
  }

  const accessToken = header.split(" ")[1];
  if (accessToken) {
    const result = await verifyJWTToken(accessToken);
    if (result.err) {
      res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: TEXTS.UNAUTHORIZED });
    } else {
      req.user = result.decoded;
     
      next();
    }
    
  } else {
    res
      .status(STATUS_CODES.UNAUTHORIZED)
      .json({ message: TEXTS.UNAUTHORIZED });
  }
};

module.exports = {
  authenticate,
};