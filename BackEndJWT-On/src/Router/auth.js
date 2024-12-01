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
router.get("/check", (req, res) => {
  console.log(req.cookies); // Kiểm tra tất cả cookies được gửi từ client
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    return res.status(200).json({ message: "Cookie received", refreshToken });
  } else {
    return res.status(400).json({ message: "No refreshToken cookie found" });
  }
});
module.exports = router;
