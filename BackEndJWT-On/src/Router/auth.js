const {
  register,
  login,
  refreshToken,
  logout,
} = require("../Controller/AuthController");
const { verifyToken } = require("../Controller/MiddlewareController");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", verifyToken, logout);

module.exports = router;
