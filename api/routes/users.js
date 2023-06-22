const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const upload = require("../middleware/uploadImages");

function userRouter(io) {
  function ioMiddleware(req, res, next) {
    (req.io = io), next();
  }
  io.on("connection", (socket) => {
    socket.emit("request", { data: "Socket connected" });
    socket.on("reply", (data) => {
      console.log("admin routes => ", data);
    });
  });
  router.post("/user-login", userController.userLogin);
  router.post("/user-signup", userController.userSignup);
  router.put(
    "/update-user/:id",
    upload.single("profileImage"),
    userController.updateUser
  );
  router.get("/get-current-user/:id", userController.getCurrentUser);

  router.post(
    "/add-user-article",
    upload.single("pdf"),
    userController.addUserArticle
  );
  router.get("/get-user-article", userController.getAllUserArticle);
  router.get("/get-user-article-byid/:id", userController.getUserArticleById);

  return router;
}

let userRouterFile = {
  router: router,
  userRouter: userRouter,
};
module.exports = userRouterFile;
