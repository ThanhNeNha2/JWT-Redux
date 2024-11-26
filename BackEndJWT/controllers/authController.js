const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ms = require("ms");
var refreshTokens = [];
let registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Kiểm tra username đã tồn tại
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        errCode: 1,
        message: "Username already exists",
      });
    }

    // Kiểm tra email đã tồn tại (nếu cần)
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        errCode: 1,
        message: "Email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ username, email, password: hashed });
    return res.status(200).json({
      errCode: 0,
      user,
    });
  } catch (error) {
    console.log("ErrCode", error);
    return res.status(500).json(error);
  }
};

let generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      admin: user.admin,
    },
    process.env.JWT_ACCESS_KEY,
    {
      // het han trong bao laau
      expiresIn: "60d",
    }
  );
};
let generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      admin: user.admin,
    },
    process.env.JWT_REFRESH_KEY,
    {
      // het han trong bao laau
      expiresIn: "365d",
    }
  );
};
let loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json("Wrong username");
    }
    const validatePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validatePassword) {
      return res.status(404).json("Wrong password");
    }
    if (user && validatePassword) {
      let accessToken = generateAccessToken(user);
      let refreshToken = generateRefreshToken(user);
      refreshTokens.push(refreshToken);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });

      // loai bo password
      const { password, ...other } = user._doc;
      return res.status(200).json({ ...other, accessToken });
    }
  } catch (error) {
    console.log("ErrCode", error);
    return res.status(500).json(error);
  }
};

let requestRefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json("Ban chua dang nhap ");
  }
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("Ma nay khong phai cua tui ");
  }
  jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
    if (err) {
      console.log(err);
    }
    // loai bo cai refresh cu de nhan cai moi
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    // nhan cai moi
    refreshTokens.push(newRefreshToken);
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    });
    return res.status(200).json({ accessToken: newAccessToken });
  });
};

let userLogout = async (req, res) => {
  res.clearCookie("refreshToken");
  refreshTokens = refreshTokens.filter(
    (token) => token !== req.cookies.refreshToken
  );
  return res.status(200).json("Logout success! ");
};
module.exports = { registerUser, loginUser, requestRefreshToken, userLogout };
