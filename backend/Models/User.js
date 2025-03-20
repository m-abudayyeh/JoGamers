const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["user", "publisher", "admin"],
    default: "user",
  },
  likedArticles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "News",  // Correct reference to "News"
    },
  ],
  bookmarkedArticles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "News",  // Correct reference to "News"
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  reportedComments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.toggleLike = function (articleId) {
  const index = this.likedArticles.indexOf(articleId);
  if (index === -1) {
    this.likedArticles.push(articleId);  // Add to liked articles
  } else {
    this.likedArticles.splice(index, 1);  // Remove from liked articles
  }
  return this.save();
};

userSchema.methods.toggleBookmark = function (articleId) {
  const index = this.bookmarkedArticles.indexOf(articleId);
  if (index === -1) {
    this.bookmarkedArticles.push(articleId);  // Add to bookmarked articles
  } else {
    this.bookmarkedArticles.splice(index, 1);  // Remove from bookmarked articles
  }
  return this.save();
};

userSchema.methods.toggleComment = function (articleId) {
  const index = this.comments.indexOf(articleId);
  if (index === -1) {
    this.comments.push(articleId);  // Add to comments
  } else {
    this.comments.splice(index, 1);  // Remove from comments
  }
  return this.save();
};

// Password comparison method
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
