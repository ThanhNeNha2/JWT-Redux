const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const tokenSave = req.headers.token;
  if (tokenSave) {
    const token = tokenSave.split(" ");

    await jwt.verify(token[1], process.env.ACCESS_TOKEN, function (err, user) {
      if (err) {
        return res.status(403).json("Token is valid");
      }
      if (user) {
        req.user = user;
        return next();
      }
    });
  } else {
    return res.status(401).json("Vui long dang nhap");
  }
};

const verifyAdmin = async (req, res, next) => {
  const tokenSave = req.headers.token;
  if (tokenSave) {
    const token = tokenSave.split(" ");

    await jwt.verify(token[1], process.env.ACCESS_TOKEN, function (err, user) {
      if (err) {
        return res.status(403).json("Token is valid");
      }
      if (user) {
        req.user = user;

        if (req.params.id === req.user.id || user.admin) {
          return next();
        } else {
          return res.status(403).json("Can you only delete your account ");
        }
      }
    });
  } else {
    return res.status(401).json("Vui long dang nhap");
  }
};
module.exports = { verifyToken, verifyAdmin };
