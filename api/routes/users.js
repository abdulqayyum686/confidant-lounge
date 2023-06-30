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
  router.put("/forgot-password", userController.forgotPassword);
  router.put("/reset-password", userController.resetPassword);
  router.put(
    "/update-user/:id",
    upload.single("profileImage"),
    userController.updateUser
  );
  router.put("/update-bio/:id", userController.updateBio);
  router.put("/update-password/:id", userController.updatePasswordByUser);
  router.get("/get-current-user/:id", userController.getCurrentUser);
  router.get("/get-user/:id", userController.getUser);

  router.post(
    "/add-user-article",
    upload.single("pdf"),
    userController.addUserArticle
  );
  router.post("/add-user-pindded-article", userController.pindUserArticle);

  router.post("/add-user-pindded-review", userController.pindUserReview);
  router.get("/get-user-article", userController.getAllUserArticle);
  router.get("/get-user-article-byid/:id", userController.getUserArticleById);

  return router;
}

let userRouterFile = {
  router: router,
  userRouter: userRouter,
};
module.exports = userRouterFile;
