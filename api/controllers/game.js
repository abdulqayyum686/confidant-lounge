const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gameSchema = require("../models/game");
const reviewSchema = require("../models/review");
const playingSchema = require("../models/playing");
const contextSchema = require("../models/context");
const recomendedContentSchema = require("../models/recomendedContent");
var ObjectId = require("mongodb").ObjectID;
//games controllers
module.exports.addGame = async (req, res) => {
  console.log("addGame", req.body);
  const { title, name, platform, releaseYear, contentType, belongsTo } =
    req.body;

  try {
    const add_game = new gameSchema({
      title,
      name,
      platform,
      releaseYear,
      contentType,
      belongsTo,
    });
    const response = await add_game.save();
    if (response) {
      res
        .status(200)
        .json({ message: "add game successfully", game: response });
    } else {
      res.status(500).json({ error: "game does not add" });
    }
  } catch (error) {
    console.log("add game  api error", error);
  }
};
module.exports.addGameReview = async (req, res) => {
  console.log("addGameReview", req.body);
  const { link, gameId, gameScore, reviewType, belongsTo } = req.body;

  try {
    const add_game_review = new reviewSchema({
      link,
      gameId,
      gameScore,
      reviewType,
      belongsTo,
    });
    const response = await add_game_review.save();
    if (response) {
      let updated_game = await gameSchema.findOneAndUpdate(
        { _id: gameId },
        { $push: { reviewIds: response._id } },
        {
          new: true,
        }
      );
      if (updated_game) {
        res
          .status(200)
          .json({ message: "game review add successfully", review: response });
      } else {
        res.status(500).json({ error: "game review does not add" });
      }
    } else {
      res.status(500).json({ error: "game review does not add" });
    }
  } catch (error) {
    console.log("game review  api error", error);
    res.status(500).json({ error: error });
  }
};
exports.getGamesById = async (req, res) => {
  try {
    let data = await gameSchema
      .find({ belongsTo: req.params.id })
      .populate({
        path: "reviewIds",
        populate: {
          path: "belongsTo",
          model: "Users",
        },
      })
      .populate("belongsTo");
    if (data) {
      res.status(200).json({
        data,
      });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ error: err });
  }
};
exports.getAllGames = async (req, res) => {
  try {
    let data = await gameSchema
      .find()
      .populate("reviewIds")
      .populate({
        path: "reviewIds",
        populate: {
          path: "belongsTo",
          model: "Users",
        },
      });
    if (data) {
      res.status(200).json({
        message: "all data send",
        data,
      });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ error: err });
  }
};

//article controllers
module.exports.addPlaying = async (req, res) => {
  console.log("addPlaying", req.body);
  const { title, belongsTo } = req.body;
  let image = null;

  if (req.file.filename != undefined) {
    image = `/img/${req.file.filename}`;
  }

  try {
    const add_playing = new playingSchema({
      title,
      image,
      belongsTo,
    });
    const response = await add_playing.save();
    if (response) {
      res
        .status(200)
        .json({ message: "add playing successfully", playing: response });
    } else {
      res.status(500).json({ error: "playing does not add" });
    }
  } catch (error) {
    console.log("add playing api error", error);
  }
};
module.exports.addContext = async (req, res) => {
  console.log("addContext", req.body);
  const { title, belongsTo } = req.body;
  let image = null;

  if (req.file.filename != undefined) {
    image = `/img/${req.file.filename}`;
  }

  try {
    const add_context = new contextSchema({
      title,
      image,
      belongsTo,
    });
    const response = await add_context.save();
    if (response) {
      res
        .status(200)
        .json({ message: "add context successfully", context: response });
    } else {
      res.status(500).json({ error: "context does not add" });
    }
  } catch (error) {
    console.log("add context api error", error);
  }
};
module.exports.addRecomendedContent = async (req, res) => {
  console.log("addRecomendedContent", req.body);
  const { link, belongsTo } = req.body;

  try {
    const add_recomended_content = new recomendedContentSchema({
      link,
      belongsTo,
    });
    const response = await add_recomended_content.save();
    if (response) {
      res.status(200).json({
        message: "add recomended content successfully",
        recomendedContent: response,
      });
    } else {
      res.status(500).json({ error: "recomended content does not add" });
    }
  } catch (error) {
    console.log("add recomended content api error", error);
  }
};
exports.getUserPlaying = async (req, res) => {
  try {
    let data = await playingSchema
      .find({ belongsTo: req.params.id })
      .populate("belongsTo");
    if (data) {
      res.status(200).json({
        message: "all data send",
        data,
      });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ error: err });
  }
};
exports.getUserContext = async (req, res) => {
  try {
    let data = await contextSchema
      .find({ belongsTo: req.params.id })
      .populate("belongsTo");
    if (data) {
      res.status(200).json({
        message: "all data send",
        data,
      });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ error: err });
  }
};
exports.getUserRecomendedContentById = async (req, res) => {
  try {
    let data = await recomendedContentSchema
      .find({ belongsTo: req.params.id })
      .populate("belongsTo");
    if (data) {
      res.status(200).json({
        message: "all data send",
        data,
      });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ error: err });
  }
};
/////
exports.updateProdcut = async (req, res) => {
  try {
    let image1 = null;

    if (req.files.image1 != undefined) {
      image1 = `/img/${req.files.image1[0].filename}`;
    }

    let data = await gameSchema.findOneAndUpdate(
      { _id: req.params.id },
      {
        ...req.body,
        image1: image1 === null ? req.body.image1 : image1,
        image2: image2 === null ? req.body.image2 : image2,
        image3: image3 === null ? req.body.image3 : image3,
        vedioMasg: vedioMasg === null ? req.body.vedioMasg : vedioMasg,
        audioFile: audioFile == null ? req.body.audioFile : audioFile,
      },
      {
        new: true,
      }
    );

    if (data) {
      res.status(201).json({ message: "Product has been update succesfully" });
    } else {
      res
        .status(500)
        .json({ message: "Product not update plase check your script" });
    }
  } catch (error) {
    console.log("update Product api have error plases check your code", error);
  }
};
exports.deletProduct = async (req, res) => {
  try {
    let data = await gameSchema.findOneAndDelete({ _id: req.params.id });

    if (data) {
      res.status(200).json({
        message: "This product  has been delete",
        data,
      });
    } else {
      console.log("no any product exit in data base");
    }
  } catch (err) {
    console.log("error", err);
  }
};
