const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gameSchema = require("../models/game");
const reviewSchema = require("../models/review");
const newreviewtype = require("../models/NewReviewType");
const newplateform = require("../models/Platform");
const Article = require("../models/article");
const articleSchema = require("../models/article");

const playingSchema = require("../models/playing");
const Pinned = require("../models/pinned");

const contextSchema = require("../models/context");
const recomendedContentSchema = require("../models/recomendedContent");
var ObjectId = require("mongodb").ObjectID;

//games controllers
module.exports.addGame = async (req, res) => {
  console.log("addGame", req.body);
  const { name, platform, releaseYear, belongsTo } = req.body;

  try {
    const add_game = new gameSchema({
      name,
      platform,
      releaseYear,
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

  let reviewFile = null;

  if (req.file.filename != undefined) {
    reviewFile = `/img/${req.file.filename}`;
  }

  try {
    const add_game_review = new reviewSchema({
      link: link,
      gameId: gameId,
      gameScore: gameScore,
      reviewType: reviewType,
      reviewFile: reviewFile,
      belongsTo: belongsTo,
    });

    const response = await add_game_review.save();
    if (response) {
      await response.populate("belongsTo").execPopulate();
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

module.exports.getAllReviewsData = async (req, res) => {
  try {
    const reviews = await reviewSchema
      .find()
      .sort({ createdAt: -1 })
      .populate("belongsTo")
      .exec();
    res.status(200).json({ reviews });
  } catch (error) {
    console.log("Error fetching reviews", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};
module.exports.getAllReviewsDataById = async (req, res) => {
  try {
    const reviews = await reviewSchema
      .find({ belongsTo: req.params.id })
      .sort({ createdAt: -1 })
      .populate("belongsTo")
      .exec();
    res.status(200).json({ reviews });
  } catch (error) {
    console.log("Error fetching reviews", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};
module.exports.newreviewtype = async (req, res) => {
  console.log("addGameReview", req.body);
  const { newReviewType, belongsTo } = req.body;

  try {
    const add_game_review = new newreviewtype({
      newReviewType,
      belongsTo,
    });
    const response = await add_game_review.save();
    res
      .status(200)
      .json({ message: "game new  review add successfully", response });
  } catch (error) {
    console.log("game review  api error", error);
    res.status(500).json({ error: error });
  }
};

module.exports.newplateform = async (req, res) => {
  console.log("addGameReview", req.body);
  const { newPlatform, belongsTo } = req.body.newPlatform;

  try {
    const add_game_review = new newplateform({
      newPlatform,
      belongsTo,
    });
    const response = await add_game_review.save();
    res
      .status(200)
      .json({ message: "game new  review add successfully", response });
  } catch (error) {
    console.log("game review  api error", error);
    res.status(500).json({ error: error });
  }
};
module.exports.getAllnewReviews = async (req, res) => {
  try {
    const reviews = await newreviewtype.find().sort({ createdAt: -1 }).exec();
    res.status(200).json({ reviews });
  } catch (error) {
    console.log("Error fetching reviews", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

module.exports.getAllnewplatform = async (req, res) => {
  try {
    const reviews = await newplateform.find().sort({ createdAt: -1 }).exec();
    res.status(200).json({ reviews });
  } catch (error) {
    console.log("Error fetching reviews", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
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
      })
      .collation({ locale: "en", strength: 1 })
      .sort({ name: 1 });

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
exports.getAllGamesFilter = async (req, res) => {
  try {
    const name = req.query.name; // Replace with the desired game name
    const platform = req.query.platform; // Replace with the desired platform
    const releaseYear = req.query.year; // Replace with the desired release year

    const query = {};

    if (name) {
      query.name = { $regex: new RegExp(name, "i") };
    }

    if (platform) {
      query.platform = { $regex: new RegExp(platform, "i") };
    }

    if (releaseYear) {
      query.releaseYear = releaseYear;
    }

    const data = await gameSchema
      .find(query)
      .populate("reviewIds")
      .populate({
        path: "reviewIds",
        populate: {
          path: "belongsTo",
          model: "Users",
        },
      })
      .collation({ locale: "en", strength: 1 })
      .sort({ name: 1 });

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
  const { title, belongsTo, link } = req.body;
  let image = null;

  if (req.file.filename != undefined) {
    image = `/img/${req.file.filename}`;
  }

  try {
    const add_playing = new playingSchema({
      title,
      image,
      belongsTo,
      link,
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
  const { title, belongsTo, link } = req.body;
  let image = null;

  if (req.file.filename != undefined) {
    image = `/img/${req.file.filename}`;
  }

  try {
    const add_context = new contextSchema({
      title,
      image,
      belongsTo,
      link: req.body.link,
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
      .sort({ createdAt: -1 })
      .populate("belongsTo")
      .exec();
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
exports.deleteUserPlaying = async (req, res) => {
  try {
    const deletedDocument = await playingSchema.findByIdAndDelete(
      req.params.id
    );
    if (deletedDocument) {
      res.status(200).json({
        message: "Document deleted successfully",
        deletedDocument,
      });
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (err) {
    console.log("Error deleting document:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.deleteUserContext = async (req, res) => {
  try {
    const deletedDocument = await contextSchema.findByIdAndDelete(
      req.params.id
    );
    if (deletedDocument) {
      res.status(200).json({
        message: "Document deleted successfully",
        deletedDocument,
      });
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (err) {
    console.log("Error deleting document:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getUserContext = async (req, res) => {
  try {
    let data = await contextSchema
      .find({ belongsTo: req.params.id })
      .sort({ createdAt: -1 })
      .populate("belongsTo")
      .exec();
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
      .sort({ createdAt: -1 })
      .populate("belongsTo")
      .exec();
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

///pin by ID
module.exports.pinArticle = async (req, res) => {
  console.log("req.body", req.body);
  try {
    const { articleId, pinnedById } = req.body;

    // Create a new pinned document for the article
    const pinnedArticle = new Pinned({
      article: articleId,
      pinnedBy: pinnedById,
    });

    const savedPinnedArticle = await pinnedArticle.save();
    const article = await articleSchema.findOneAndUpdate(
      { _id: articleId },
      { $push: { pinnedBy: pinnedById } },
      { new: true }
    );

    res
      .status(200)
      .json({ savedPinnedArticle: savedPinnedArticle, article: article });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to pin the article" });
  }
};
//Get all pinned review and article

module.exports.getPinnedDataByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all pinned documents for the specified user ID
    const pinnedItems = await Pinned.find({ pinnedBy: userId });

    // Extract the article IDs and review IDs from the pinned documents
    const articleIds = pinnedItems.map((item) => item.article);
    const reviewIds = pinnedItems.map((item) => item.review);

    // Find all articles and reviews that match the extracted IDs
    const pinnedArticles = await Article.find({
      _id: { $in: articleIds },
    }).populate("belongsTo");
    const pinnedReviews = await reviewSchema
      .find({ _id: { $in: reviewIds } })
      .populate("belongsTo");

    const pinnedData = {
      articles: pinnedArticles,
      reviews: pinnedReviews,
    };
    const pinnedIte = await Pinned.find({ pinnedBy: userId })
      .populate([
        {
          path: "review",
          populate: {
            path: "belongsTo",
            model: "Users",
          },
        },
        {
          path: "article",
          populate: {
            path: "belongsTo",
            model: "Users",
          },
        },
      ])
      .sort({ createdAt: -1 })
      .exec();
    res.status(200).json({ pinnedData: pinnedIte });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve pinned items" });
  }
};

// Define a route for pinning a review
module.exports.pinReview = async (req, res) => {
  try {
    const { reviewId, pinnedById } = req.body;

    // Create a new pinned document for the review
    const pinnedReview = new Pinned({
      review: reviewId,
      pinnedBy: pinnedById,
    });

    const review = await reviewSchema.findOneAndUpdate(
      { _id: reviewId },
      { $push: { pinnedBy: pinnedById } },
      { new: true }
    );

    // Save the pinned review
    const savedPinnedReview = await pinnedReview.save();

    res
      .status(200)
      .json({ savedPinnedReview: savedPinnedReview, review: review });
  } catch (error) {
    res.status(500).json({ error: "Failed to pin the review" });
  }
};

module.exports.RemovePinArticle = async (req, res) => {
  try {
    const { articleId, pinnedById, pinnedId } = req.body;
    const result = await Pinned.findOneAndDelete({ _id: pinnedId });
    const article = await articleSchema.findOneAndUpdate(
      { _id: articleId },
      { $pull: { pinnedBy: pinnedById } },
      { new: true }
    );
    res.status(200).json({ status: true, article: article });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to pin the article" });
  }
};
module.exports.RemovePinReview = async (req, res) => {
  try {
    const { reviewId, pinnedById, pinnedId } = req.body;
    const result = await Pinned.findOneAndDelete({ _id: pinnedId });
    const review = await reviewSchema.findOneAndUpdate(
      { _id: reviewId },
      { $pull: { pinnedBy: pinnedById } },
      { new: true }
    );
    res.status(200).json({ status: true, review: review });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to pin the article" });
  }
};
exports.deletReview = async (req, res) => {
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
