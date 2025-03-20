const User = require("../Models/User");
const jwt = require("jsonwebtoken");
// إنشاء توكن JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// تسجيل مستخدم جديد
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // التحقق من وجود المستخدم مسبقًا
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // إنشاء مستخدم جديد
    const user = await User.create({ username, email, password });

    // إنشاء توكن
    const token = generateToken(user._id);

    // إرسال التوكن في الكوكيز
    res
      .cookie("token", token, { httpOnly: true })
      .status(201)
      .json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// تسجيل الدخول
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user._id);

    res
      .cookie("token", token, { httpOnly: true })
      .status(200)
      .json({ message: "Logged in successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password for security
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};


// Update User
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, role },
      { new: true, runValidators: true }
    ).select("-password"); // Exclude password

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// // Protected Route (Profile)
exports.profile = async (req, res) => {
  const token = req.cookies.token; // التحقق من وجود الكوكيز

  if (!token) {
    return res.status(401).json({ error: "Unauthorized, token missing" });
  }

  try {
    // التحقق من صحة التوكن باستخدام JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // جلب بيانات المستخدم بناءً على الـ userId المخزن في التوكن
    const user = await User.findById(decoded.userId).select('-password'); 
    res.json(user); // إرجاع بيانات المستخدم
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// جلب بيانات المستخدم
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  console.log("Request Body:", req.body); // تحقق من البيانات المرسلة
  const { username, email } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: { username, email } },
      { new: true }
    ).select("-password");

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};