const {
  verifyToken,
  verifyAdmin,
} = require("../Controller/MiddlewareController");
const { getAll, deleteUser } = require("../Controller/UserController");

const router = require("express").Router();

router.get("/", verifyToken, getAll);

router.delete("/:id", verifyAdmin, deleteUser);

module.exports = router;
