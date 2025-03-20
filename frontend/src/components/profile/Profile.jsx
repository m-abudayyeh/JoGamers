import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import { User, Mail, Edit2, X, Camera, Bookmark, MessageSquare, Clock, Heart } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(""); // تخزين الصورة كـ base64
  const [newProfileImage, setNewProfileImage] = useState(null);

  // User data
  const [savedArticles, setSavedArticles] = useState([]);
  const [likedArticles, setLikedArticles] = useState([]);
  const [comments, setComments] = useState([]);
  const [readingHistory, setReadingHistory] = useState([]);

  // Fetch user data from the server
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/profile", {
          withCredentials: true,
        });
        const user = response.data;
        setUserId(user._id);
        setUsername(user.username);
        setEmail(user.email);

        // استرجاع الصورة من localStorage إذا كانت موجودة
        const savedProfileImage = localStorage.getItem("profileImage");
        if (savedProfileImage) {
          setProfileImage(savedProfileImage);
        } else {
          setProfileImage(user.profileImage || ""); // إذا كانت الصورة موجودة في الباكند
        }

        // Fetch saved articles, comments, and reading history
        fetchSavedArticles(user._id);
        fetchLikedArticles(user._id);
        fetchComments(user._id);
        fetchReadingHistory(user._id);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to fetch user data.",
          icon: "error",
          background: "#EFF5F5",
          color: "#497174",
        });
      }
    };

    fetchUserData();
  }, []);

  // Fetch saved articles
  const fetchSavedArticles = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${userId}/saved-articles`, {
        withCredentials: true,
      });
      setSavedArticles(response.data);
    } catch (error) {
      console.error("Failed to fetch saved articles:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch saved articles.",
        icon: "error",
        background: "#EFF5F5",
        color: "#497174",
      });
    }
  };

  // Fetch liked articles
  const fetchLikedArticles = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${userId}/liked-articles`, {
        withCredentials: true,
      });
      setLikedArticles(response.data);
    } catch (error) {
      console.error("Failed to fetch liked articles:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch liked articles.",
        icon: "error",
        background: "#EFF5F5",
        color: "#497174",
      });
    }
  };

  // Fetch comments
  const fetchComments = async (userId) => {
    try {
      // Mock data
      setComments([
        { id: 1, articleTitle: "New leaks about GTA 6", text: "I hope these leaks are true!", date: "2025-03-12", likes: 15 },
        { id: 2, articleTitle: "Elden Ring 2 Review", text: "The game is amazing, deserves a 10/10 rating", date: "2025-03-07", likes: 8 },
        { id: 3, articleTitle: "Most Anticipated Games of 2026", text: "Where is the new God of War game?", date: "2025-03-01", likes: 4 },
      ]);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  // Fetch reading history
  const fetchReadingHistory = async (userId) => {
    try {
      // Mock data
      setReadingHistory([
        { id: 1, title: "Official Announcement of PlayStation 6", date: "2025-03-15", category: "News" },
        { id: 2, title: "Secrets You Haven't Discovered in Starfield", date: "2025-03-14", category: "Tips" },
        { id: 3, title: "Top 10 Games of 2024", date: "2025-03-13", category: "Lists" },
        { id: 4, title: "Exclusive Interview with Cyberpunk 2077: Phantom Liberty Developer", date: "2025-03-12", category: "Interviews" },
      ]);
    } catch (error) {
      console.error("Failed to fetch reading history:", error);
    }
  };

  // Convert image to base64
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle image change
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imageBase64 = await convertImageToBase64(file);
        setProfileImage(imageBase64); // تحديث الحالة بالصورة الجديدة
        setNewProfileImage(file); // تخزين الملف الجديد (اختياري)
        localStorage.setItem("profileImage", imageBase64); // حفظ الصورة في localStorage
      } catch (error) {
        console.error("Failed to convert image to base64:", error);
      }
    }
  };

  // Save changes
  const handleSaveChanges = async () => {
    try {
      if (!userId) {
        console.error("Update Error: userId is not available");
        Swal.fire({
          title: "Error",
          text: "User ID is not available. Please try again.",
          icon: "error",
          background: "#EFF5F5",
          color: "#497174",
        });
        return;
      }

      const updatedUser = {
        username,
        email,
       // استخدام الصورة المحولة إلى base64
      };

      console.log("Updated User Data:", updatedUser);

      await axios.put(`http://localhost:5000/api/users/${userId}`, updatedUser, { withCredentials: true });

      Swal.fire({
        title: "Updated Successfully",
        text: "Profile updated successfully.",
        icon: "success",
        background: "#EFF5F5",
        color: "#497174",
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Update Error:", error.response?.data || error.message);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to update profile.",
        icon: "error",
        background: "#EFF5F5",
        color: "#497174",
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div className="min-h-screen bg-[#EFF5F5] px-4 py-30">
      <Navbar />
      {/* Profile Header */}
      <div className="max-w-6xl mx-auto bg-[#497174] rounded-lg shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Profile Image */}
          <div className="relative mb-6 md:mb-0">
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-[#EFF5F5] shadow-lg">
              <img
                src={profileImage || "https://via.placeholder.com/150"} // عرض الصورة من الحالة
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              className="absolute bottom-0 right-0 bg-[#EB6440] p-2 rounded-full shadow-lg hover:bg-[#d85a3a] transition-all duration-300 cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              <Camera className="text-white" size={20} />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-grow px-8 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">{username}</h2>
            <div className="flex items-center justify-center md:justify-start mb-4">
              <Mail className="text-[#EB6440] mr-2" size={18} />
              <p className="text-white">{email}</p>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="bg-[#D6E4E5] px-4 py-2 rounded-lg">
                <span className="text-[#497174] font-semibold">{savedArticles.length}</span> <span className="text-[#497174]">saved articles</span>
              </div>
              <div className="bg-[#D6E4E5] px-4 py-2 rounded-lg">
                <span className="text-[#497174] font-semibold">{likedArticles.length}</span> <span className="text-[#497174]">liked articles</span>
              </div>
              <div className="bg-[#D6E4E5] px-4 py-2 rounded-lg">
                <span className="text-[#497174] font-semibold">{comments.length}</span> <span className="text-[#497174]">comments</span>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="mt-6 md:mt-0">
            <button
              className="bg-[#EB6440] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#d85a3a] transition-all duration-300 flex items-center cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="mr-2" size={20} />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#497174] rounded-lg shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex flex-wrap border-b border-[#D6E4E5]">
            <button
              className={`flex items-center px-6 py-4 font-medium cursor-pointer ${
                activeTab === "profile" ? "bg-[#EB6440] text-white" : "text-white hover:bg-[#5C8587]"
              } transition-all duration-200`}
              onClick={() => setActiveTab("profile")}
            >
              <User className="mr-2" size={18} />
              Profile
            </button>
            <button
              className={`flex items-center px-6 py-4 font-medium cursor-pointer ${
                activeTab === "saved" ? "bg-[#EB6440] text-white" : "text-white hover:bg-[#5C8587]"
              } transition-all duration-200`}
              onClick={() => setActiveTab("saved")}
            >
              <Bookmark className="mr-2" size={18} />
              Saved Articles
            </button>
            <button
              className={`flex items-center px-6 py-4 font-medium cursor-pointer ${
                activeTab === "liked" ? "bg-[#EB6440] text-white" : "text-white hover:bg-[#5C8587]"
              } transition-all duration-200`}
              onClick={() => setActiveTab("liked")}
            >
              <Heart className="mr-2" size={18} />
              Liked Articles
            </button>
            <button
              className={`flex items-center px-6 py-4 font-medium cursor-pointer ${
                activeTab === "comments" ? "bg-[#EB6440] text-white" : "text-white hover:bg-[#5C8587]"
              } transition-all duration-200`}
              onClick={() => setActiveTab("comments")}
            >
              <MessageSquare className="mr-2" size={18} />
              Comments
            </button>
            <button
              className={`flex items-center px-6 py-4 font-medium cursor-pointer ${
                activeTab === "history" ? "bg-[#EB6440] text-white" : "text-white hover:bg-[#5C8587]"
              } transition-all duration-200`}
              onClick={() => setActiveTab("history")}
            >
              <Clock className="mr-2" size={18} />
              Reading History
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8 bg-white">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[#497174] mb-6">Profile Information</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-[#EFF5F5] p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <User className="text-[#EB6440] mr-2" size={20} />
                      <h4 className="text-[#497174] font-semibold">Username</h4>
                    </div>
                    <p className="text-gray-700 pl-7">{username}</p>
                  </div>
                  <div className="bg-[#EFF5F5] p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <Mail className="text-[#EB6440] mr-2" size={20} />
                      <h4 className="text-[#497174] font-semibold">Email</h4>
                    </div>
                    <p className="text-gray-700 pl-7">{email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Articles Tab */}
            {activeTab === "saved" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-[#497174]">Saved Articles</h3>
                  <span className="bg-[#EB6440] text-white px-3 py-1 rounded-full text-sm">
                    {savedArticles.length} articles
                  </span>
                </div>
                {savedArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedArticles.map((article) => (
                      <div key={article._id} className="bg-[#EFF5F5] rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={article.images[0] || "https://via.placeholder.com/300x200"}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 bg-[#EB6440] text-white px-3 py-1 rounded-tr-lg">
                            {article.category}
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="text-[#497174] font-bold text-lg mb-2 line-clamp-2">{article.title}</h4>
                          <p className="text-gray-600 text-sm">
                            {formatDate(article.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Bookmark className="mx-auto text-[#497174] mb-4 opacity-40" size={48} />
                    <p className="text-[#497174] text-lg">No saved articles yet.</p>
                    <p className="text-gray-500">Articles you save will appear here.</p>
                  </div>
                )}
              </div>
            )}

            {/* Liked Articles Tab */}
            {activeTab === "liked" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-[#497174]">Liked Articles</h3>
                  <span className="bg-[#EB6440] text-white px-3 py-1 rounded-full text-sm">
                    {likedArticles.length} articles
                  </span>
                </div>
                {likedArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {likedArticles.map((article) => (
                      <div key={article._id} className="bg-[#EFF5F5] rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={article.images[0] || "https://via.placeholder.com/300x200"}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 bg-[#EB6440] text-white px-3 py-1 rounded-tr-lg">
                            {article.category}
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="text-[#497174] font-bold text-lg mb-2 line-clamp-2">{article.title}</h4>
                          <p className="text-gray-600 text-sm">
                            {formatDate(article.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Heart className="mx-auto text-[#497174] mb-4 opacity-40" size={48} />
                    <p className="text-[#497174] text-lg">No liked articles yet.</p>
                    <p className="text-gray-500">Articles you like will appear here.</p>
                  </div>
                )}
              </div>
            )}

            {/* Comments Tab */}
            {activeTab === "comments" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-[#497174]">Comments</h3>
                  <span className="bg-[#EB6440] text-white px-3 py-1 rounded-full text-sm">
                    {comments.length} comments
                  </span>
                </div>
                {comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-[#EFF5F5] p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                        <h4 className="text-[#497174] font-bold text-lg mb-2">{comment.articleTitle}</h4>
                        <p className="text-gray-700 mb-4 bg-white p-4 rounded-lg border-l-4 border-[#EB6440]">"{comment.text}"</p>
                        <div className="flex justify-between items-center text-sm text-gray-600">
                          <p>{formatDate(comment.date)}</p>
                          <div className="flex items-center">
                            <Heart className="text-[#EB6440] mr-1" size={16} />
                            <span>{comment.likes}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <MessageSquare className="mx-auto text-[#497174] mb-4 opacity-40" size={48} />
                    <p className="text-[#497174] text-lg">No comments yet.</p>
                    <p className="text-gray-500">Your comments will appear here.</p>
                  </div>
                )}
              </div>
            )}

            {/* Reading History Tab */}
            {activeTab === "history" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-[#497174]">Reading History</h3>
                  <span className="bg-[#EB6440] text-white px-3 py-1 rounded-full text-sm">
                    {readingHistory.length} articles
                  </span>
                </div>
                {readingHistory.length > 0 ? (
                  <div className="space-y-4">
                    {readingHistory.map((history) => (
                      <div key={history.id} className="bg-[#EFF5F5] p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-[#497174] font-bold text-lg mb-2">{history.title}</h4>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center text-sm text-gray-600">
                                <Clock className="mr-1" size={16} />
                                <span>{formatDate(history.date)}</span>
                              </div>
                              <div className="bg-[#EB6440] text-white px-3 py-1 rounded-full text-xs">
                                {history.category}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Clock className="mx-auto text-[#497174] mb-4 opacity-40" size={48} />
                    <p className="text-[#497174] text-lg">No reading history yet.</p>
                    <p className="text-gray-500">Articles you've read will appear here.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="bg-[#497174] rounded-t-lg p-6 relative">
              <h5 className="text-white text-2xl font-bold text-center">Edit Profile</h5>
              <button
                className="absolute right-4 top-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                onClick={() => setIsEditing(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Profile Image Preview */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#497174] mx-auto">
                    <img
                      src={profileImage || "https://via.placeholder.com/96"} // عرض الصورة من الحالة
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="text"
                    className="w-full p-3 pl-10 border border-[#D6E4E5] rounded-lg bg-[#EFF5F5] focus:ring-2 focus:ring-[#EB6440] focus:border-transparent"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="email"
                    className="w-full p-3 pl-10 border border-[#D6E4E5] rounded-lg bg-[#EFF5F5] focus:ring-2 focus:ring-[#EB6440] focus:border-transparent"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Camera className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="file"
                    className="w-full p-3 pl-10 border border-[#D6E4E5] rounded-lg bg-[#EFF5F5] focus:ring-2 focus:ring-[#EB6440] focus:border-transparent"
                    onChange={handleImageChange} // استدعاء الدالة عند اختيار ملف
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#EFF5F5] rounded-b-lg flex justify-end space-x-4">
              <button
                className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-all flex items-center"
                onClick={() => setIsEditing(false)}
              >
                <X className="mr-2" size={18} />
                Cancel
              </button>
              <button
                className="px-6 py-3 rounded-lg bg-[#EB6440] hover:bg-[#d55835] text-white font-medium transition-all flex items-center"
                onClick={handleSaveChanges}
              >
                <Edit2 className="mr-2" size={18} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;