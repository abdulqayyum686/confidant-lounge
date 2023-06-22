const express = require("express");
const router = express.Router();
const gameController = require("../controllers/game");
const upload = require("../middleware/uploadImages");

function gameRouter(io) {
  function ioMiddleware(req, res, next) {
    (req.io = io), next();
  }
  io.on("connection", (socket) => {
    socket.emit("request", { data: "Socket connected" });
    socket.on("reply", (data) => {
      console.log("admin routes => ", data);
    });
  });

  router.post(
    "/add-game-playing",
    upload.single("image"),
    gameController.addPlaying
  );
  router.post(
    "/add-game-context",
    upload.single("image"),
    gameController.addContext
  );
  router.post(
    "/add-game-recomended-content",
    gameController.addRecomendedContent
  );
  router.get("/get-user-playing/:id", gameController.getUserPlaying);
  router.get("/get-user-context/:id", gameController.getUserContext);
  router.get(
    "/get-user-recomended-content/:id",
    gameController.getUserRecomendedContentById
  );

  router.post(
    "/add-game-review",
    upload.single("reviewFile"),
    gameController.addGameReview
  );

  router.get("/get-Allgames-review", gameController.getAllReviewsData
  );
  
  router.get("/allPinned", gameController.AllPinnedData
  );


  

  router.post("/add-game-new-review", gameController.newreviewtype);
  router.post("/add-game-new-platform", gameController.newplateform);

  router.post("/pin-review", gameController.pinReview);
  router.post("/pin-article", gameController.pinArticle);


  router.post("/add-game", gameController.addGame);

  router.get("/get-games/:id", gameController.getGamesById);
  router.get("/get-all-games", gameController.getAllGames);
  router.get("/get-all-new-review", gameController.getAllnewReviews);
  router.get("/get-all-new-platform", gameController.getAllnewplatform);

  return router;
}

let gameRouterFile = {
  router: router,
  gameRouter: gameRouter,
};
module.exports = gameRouterFile;
