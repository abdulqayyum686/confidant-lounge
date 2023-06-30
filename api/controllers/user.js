const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = require("../models/user");
const articleSchema = require("../models/article");
const { forgotEmail } = require("../supportingMethods/sendEmail");
const saltRounds = 10;

// remove c
module.exports.userLogin = (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;
  userSchema
    .findOne({ email: email })
    .exec()
    .then(async (foundObject) => {
      if (foundObject) {
        await bcrypt.compare(
          password,
          foundObject.password,
          async (err, newResult) => {
            if (err) {
              return res.status(501).json({ err, err });
            } else {
              if (newResult) {
                const token = jwt.sign(
                  { ...foundObject.toObject(), password: "" },
                  "secret",
                  {
                    expiresIn: "5d",
                  }
                );

                return res.status(200).json({
                  token: token,
                  message: "Login successfully",
                  user: foundObject,
                });
              } else {
                return res.status(401).json({
                  message: "invalid password",
                  action: false,
                });
              }
            }
          }
        );
      } else {
        return res.status(404).json({
          message: "Opps invalid email",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
};

module.exports.userSignup = (req, res, next) => {
  console.log("==>>>responce sigup>>", req.body);
  const { email, password } = req.body;

  userSchema
    .findOne({ email: email })
    .exec()
    .then(async (foundObject) => {
      if (foundObject) {
        return res.status(403).json({
          message: "Opps this email/user name already exist!",
        });
      } else {
        await bcrypt.hash(password, saltRounds, (err, hash) => {
          if (err) {
            console.log(" error: ", err);
            return res.status(500).json({ err: err });
          } else {
            let newUser = new userSchema({
              email: email,
              password: hash,
            });

            newUser
              .save()
              .then(async (savedObject) => {
                console.log("savedObject", savedObject);
                return res.status(201).json({
                  message: "user signup successful",
                  user: savedObject,
                });
              })
              .catch((err) => {
                console.log("Not saved", err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
};
exports.updateUser = async (req, res) => {
  try {
    console.log("update-user", req.body, req.file.filename);
    let profileImage = null;

    if (req.file.filename != undefined) {
      profileImage = `/img/${req.file.filename}`;
    }

    let data = await userSchema.findOneAndUpdate(
      { _id: req.params.id },
      {
        profileImage:
          profileImage === null ? req.body.profileImage : profileImage,
      },
      {
        new: true,
      }
    );
    res
      .status(201)
      .json({ message: "user profile update succesfully", user: data });
  } catch (error) {
    res.status(500).json(error);
  }
};
exports.updateBio = async (req, res) => {
  try {
    let data = await userSchema.findOneAndUpdate(
      { _id: req.params.id },
      {
        bio: req.body.bio,
      },
      {
        new: true,
      }
    );
    res
      .status(201)
      .json({ message: "user profile update succesfully", user: data });
  } catch (error) {
    res.status(500).json(error);
  }
};
exports.getCurrentUser = async (req, res) => {
  try {
    let data = await userSchema.findById({ _id: req.params.id });

    res.status(200).json({
      user: data,
    });
  } catch (err) {
    console.log("error", err);
    res.status(500).json(err);
  }
};
module.exports.updatePasswordByUser = async (req, res, next) => {
  const userId = req.params.id;
  const newPassword = req.body.newPassword;

  userSchema
    .findOne({ _id: userId })
    .exec()
    .then(async (foundObject) => {
      if (foundObject) {
        bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: "Failed to hash password" });
          }

          // Update the user with the hashed password
          userSchema
            .findByIdAndUpdate(
              userId,
              { password: hashedPassword },
              { new: true }
            )
            .then((updatedUser) => {
              if (!updatedUser) {
                return res.status(404).json({ error: "User not found" });
              }
              res.json({ message: "Password is updated " });
            })
            .catch((error) => {
              console.log(error);
              res.status(500).json({
                message: "Password is not updated ",
                error: "Failed to update password",
              });
            });
        });
      } else {
        return res.status(404).json({
          message: "Invalid user",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        error: err,
        message: "something went wrong",
      });
    });
};
exports.getAllUsers = async (req, res) => {
  try {
    let data = await userSchema.find();
    if (data) {
      res.status(200).json({
        message: "all data send ",
        data,
      });
    } else {
      console.log("no any user exit in data base");
    }
  } catch (err) {
    console.log("error", err);
  }
};
exports.getUser = async (req, res) => {
  try {
    // Find the user by ID and exclude the password field
    let user = await userSchema
      .findOne({ _id: req.params.id })
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User profile updated successfully", user: user });
  } catch (error) {
    res.status(500).json(error);
  }
};
// articles controllers
module.exports.addUserArticle = async (req, res) => {
  console.log("addUserArticle", req.body);
  const { belongsTo, link } = req.body;
  try {
    let image = null;

    if (req.file.filename != undefined) {
      image = `/img/${req.file.filename}`;
    }
    const add_article = new articleSchema({
      belongsTo,
      link,
      file: image,
    });
    const response = await add_article.save();
    if (response) {
      res
        .status(200)
        .json({ message: "add article successfully", article: response });
    } else {
      res.status(500).json({ error: "article does not add" });
    }
  } catch (error) {
    console.log("add article api error", error);
  }
};
exports.getAllUserArticle = async (req, res) => {
  try {
    let data = await articleSchema
      .find()
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
exports.getUserArticleById = async (req, res) => {
  try {
    let data = await articleSchema
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

//pin article

exports.pindUserArticle = async (req, res) => {
  try {
    const { articleId, userId } = req.body;

    // Find the article by its ID
    const article = await articleSchema.findById(articleId);

    // Add the user ID to the pinnedBy array
    article.pinnedBy.push(userId);

    // Save the updated article
    const updatedArticle = await article.save();

    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(500).json({ error: "Failed to add user to the pinnedBy array" });
  }
};

//pin Review

exports.pindUserReview = async (req, res) => {
  try {
    const { reviewId, userId } = req.body;

    // Find the article by its ID
    const article = await articleSchema.findById(reviewId);

    // Add the user ID to the pinnedBy array
    article.pinnedBy.push(userId);

    // Save the updated article
    const updatedArticle = await article.save();

    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(500).json({ error: "Failed to add user to the pinnedBy array" });
  }
};
module.exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    let foundUser = await userSchema.findOne({ confirmEmail: email });
    console.log(foundUser, "foundUser");
    if (!foundUser)
      return res
        .status(404)
        .json({ message: `User with email ${email} was not found!` });
    const token = jwt.sign(
      { access: "forgot-password", userId: foundUser._id },
      "secret"
    );
    foundUser.forgotToken = token;
    foundUser.isForgotTokenUsed = false;
    foundUser = await foundUser.save();
    forgotEmail(foundUser, foundUser.confirmEmail, token);
    res.json({
      message: "Please check your email to change the password",
    });
  } catch (err) {
    console.log("POST ERRROR: ", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
module.exports.resetPassword = async (req, res, next) => {
  try {
    const { forgotToken, password, confirmPassword } = req.body;
    if (!forgotToken || !password || !confirmPassword)
      res
        .status(404)
        .json({ message: "Some fields are missing", status: false });
    if (confirmPassword !== password)
      return res
        .status(400)
        .json({ message: "Passwords do not match.", status: false });

    const foundUser = await userSchema.findOne({ forgotToken });
    if (!foundUser)
      return res.status(400).json({
        message: "The Password Token is Invalid or expired",
        status: false,
      });

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    foundUser.password = hashedPassword;
    foundUser.isForgotTokenUsed = true;
    foundUser.forgotToken = "";
    const updatedUser = await foundUser.save();

    res.json({
      status: true,
      message: "Password updated successfully!✅",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong!", status: false });
  }
};
