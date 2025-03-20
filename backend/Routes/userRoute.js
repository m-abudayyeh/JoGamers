const express = require("express");
const auth = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware")
const User = require("../Models/User");
const News = require("../Models/news");
const router = express.Router();

router.post("/register", auth.register);
router.post("/login", auth.login);
router.get("/", auth.getAllUsers); // Get all users
router.put("/:userId", auth.updateUser); // Update user
router.delete("/:userId", auth.deleteUser); // Delete user
router.get('/profile', auth.profile);// Profile (Protected Route)
router.get("/profile", authMiddleware,auth.getProfile);
router.put("/:userId", authMiddleware, auth.updateProfile);
// router.put('/:userId',authMiddleware.protect, auth.upload.single('profileImage'), auth.updateProfile);
// Update profile with image upload
// router.put(
//     "/:userId",
//     authMiddleware,
//     auth.upload.single("profileImage"), // استخدام multer لتحميل صورة واحدة
//     auth.updateProfile
//   );


router.get("/:userId/saved-articles", async (req, res) => {
  try {
    const userId = req.params.userId;

    // جلب المستخدم مع المقالات المحفوظة
    const user = await User.findById(userId).populate("bookmarkedArticles");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // إرجاع المقالات المحفوظة
    res.status(200).json(user.bookmarkedArticles);
  } catch (error) {
    console.error("Error fetching saved articles:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// في ملف routes/users.js أو أي ملف مشابه
router.get("/:userId/liked-articles", async (req, res) => {
  try {
    const userId = req.params.userId;

    // جلب المستخدم مع المقالات التي أعجب بها
    const user = await User.findById(userId).populate("likedArticles");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // إرجاع المقالات التي أعجب بها المستخدم
    res.status(200).json(user.likedArticles);
  } catch (error) {
    console.error("Error fetching liked articles:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
