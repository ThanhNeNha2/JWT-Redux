const User = require("../Model/User");

const getAll = async (req, res) => {
  const data = await User.find({});

  return res.status(200).json({
    ErrCode: 0,
    data,
  });
};

const deleteUser = async (req, res) => {
  const id = req.params.id;

  const data = await User.deleteOne({ _id: id });

  return res.status(200).json({
    ErrCode: 0,
    data,
  });
};
module.exports = { getAll, deleteUser };
