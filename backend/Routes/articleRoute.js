const express              = require("express");
const router               = express.Router();
const multer               = require("multer");
const articleController    = require("../controllers/articleController");
const protect              = require("../middlewares/authMiddleware");
const authorize            = require("../middlewares/authorizeMiddleware");
const latestNewsController = require("../controllers/latestNewsController");
const authorize_nav        = require("../middlewares/authorize_nav");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage }).array("images", 10);

router.get("/verfiy-navbar", authorize_nav(), (req, res) => {
  const userRole = req.userRole;

  if (userRole === "admin") {
    return res.json({ role: userRole, navbarItems: ["Home", "Dashboard", "Settings", "Admin Panel"] });
  }
  else if (userRole === "publisher") {
    return res.json({ role: userRole, navbarItems: ["Home", "Dashboard", "Profile"] });
  }
  else {
    return res.json({ role: "user", navbarItems: ["Home"] });
  }

});

router.get    ("/",            authorize('publisher'), (req, res, next) => { next();}, articleController.getAllArticle);
router.get    ("/:id",                                                                 articleController.getArticleById);
router.post   ("/create",      protect, authorize('publisher'), upload,                articleController.createArticle);
router.put    ("/:id",         protect, authorize('publisher'), upload,                articleController.updateArticle);
router.delete ("/:id",         protect, authorize('publisher'),                        articleController.deleteArticle);
router.put    ("/:id/approve", protect, authorize('publisher'),                        articleController.approveArticle);
router.get    ("/latest",                                                              latestNewsController.getLatestArticles);
router.post   ("/logout",       
(req, res) =>
  {
    res.clearCookie("token", { path: "/" }); 
    res.json({ message: "Successfully logged out" });
  });

module.exports = router;
