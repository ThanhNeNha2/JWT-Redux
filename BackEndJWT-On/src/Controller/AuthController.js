const { hashSync, compareSync } = require("bcrypt");
const User = require("../Model/User");
const jwt = require("jsonwebtoken");

var SetCookie = [];

const register = async (req, res) => {
  const { username, password, email } = req.body;
  const salt = 10;
  const passHash = hashSync(password, salt);
  const response = await User.create({ username, password: passHash, email });
  return res.status(200).json({
    message: response,
  });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (user) {
    const passHash = compareSync(password, user.password);
    if (passHash) {
      //  SET TOKEN
      const accessToken = await jwt.sign(
        {
          id: user._id,
          isAdmin: user.admin,
        },
        process.env.ACCESS_TOKEN,
        {
          expiresIn: "20s",
        }
      );

      //  SET COOKIE
      const refreshToken = await jwt.sign(
        {
          id: user._id,
          isAdmin: user.admin,
        },
        process.env.REFRESH_TOKEN,
        {
          expiresIn: "365d",
        }
      );
      SetCookie.push(refreshToken);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      const { password, ...userInfo } = user._doc;
      return res.status(200).json({
        message: "Dang nhap thanh cong ",
        accessToken: accessToken,
        userInfo,
      });
    }
  }
  return res.status(500).json({
    message: "Dang nhap khong thanh cong ",
  });
};

const refreshToken = async (req, res) => {
  const tokenCookie = req.cookies.refreshToken;
  if (!tokenCookie) {
    return res.status(401).json({
      message: "Vui long dang nhap ",
    });
  }
  console.log(" check tokenCookie ", tokenCookie);
  console.log(" check SetCookie[0] ", SetCookie[0]);
  console.log(" check SetCookie ", SetCookie);

  // if (tokenCookie !== SetCookie[0]) {
  if (!SetCookie.includes(tokenCookie)) {
    return res.status(404).json({
      message: "Khong phai tai khoan cua ban",
    });
  }

  jwt.verify(tokenCookie, process.env.REFRESH_TOKEN, async (err, user) => {
    const newToken = await jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "20s",
      }
    );

    const newResFreshCookie = await jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.REFRESH_TOKEN,
      {
        expiresIn: "365d",
      }
    );
    delete SetCookie[0];
    SetCookie.push(newResFreshCookie);

    await res.cookie("refreshToken", newResFreshCookie, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    });
    return res.status(201).json({
      message: " refresh thanh cong token  ",
      newToken,
    });
  });
};

let logout = async (req, res) => {
  res.clearCookie("refreshToken");
  SetCookie = SetCookie.filter((token) => token !== req.cookies.refreshToken);
  // SetCookie = [];
  return res.status(200).json("Logout success! ");
};

module.exports = { register, login, refreshToken, logout };
