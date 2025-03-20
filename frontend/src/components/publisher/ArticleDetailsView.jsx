//--------------------------------------
// IMPORTS
//--------------------------------------
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFileImage, FaEdit, FaArrowLeft, FaClock, FaSave, FaTrash, FaBold, FaListUl, FaThumbsUp, FaItalic, FaChevronDown, FaReply, FaGamepad, FaTimes, FaCommentSlash, FaLayerGroup, FaCalendarAlt, FaComments } from "react-icons/fa";
import { Clock, CheckCircle } from "lucide-react";
import Navbar from "../navbar/Navbar"
//--------------------------------------
// IMPORTS
//--------------------------------------


const ArticleDetailsView = () => {

//--------------------------------------
// STATE
//--------------------------------------
  const { id }                                = useParams();
  const navigate                              = useNavigate();
  const fileInputRef                          = useRef(null);
  const [newsItem,        setNewsItem       ] = useState(null);
  const [comments,        setComments       ] = useState([]);
  const [isEditing,       setIsEditing      ] = useState(false);
  const [updatedTitle,    setUpdatedTitle   ] = useState("");
  const [updatedExcerpt,  setUpdatedExcerpt ] = useState("");
  const [updatedPlatform, setUpdatedPlatform] = useState("PC");
  const [updatedCategory, setUpdatedCategory] = useState("");
  const [updatedReadTime, setUpdatedReadTime] = useState("");
  const [updatedFeatured, setUpdatedFeatured] = useState(false);
  const [updatedContent,  setUpdatedContent ] = useState("");
  const [newImages,       setNewImages      ] = useState([]);
  const [previewImages,   setPreviewImages  ] = useState([]);
//--------------------------------------
// STATE
//--------------------------------------


//--------------------------------------
// GET - ARITCALES & COMMENTS
//--------------------------------------
  useEffect(() => {
    const fetchNewsItem = async () => {
      if (!id) return;
      try {
        const response = await axios.get(`http://localhost:5000/api/news/dash/${id}`, {
          withCredentials: true,
        });
        setNewsItem(response.data.news);
      } catch (error) {
        console.error("Error fetching news item:", error);
        navigate("/404");
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/comments/${id}`);
        setComments(response.data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
    fetchNewsItem();
  }, [id, navigate]);
//--------------------------------------
// GET - ARITCALES & COMMENTS
//--------------------------------------


//--------------------------------------
// Initialize Editing Fields
//--------------------------------------
  useEffect(() => {
    if (newsItem) {
      setUpdatedTitle   (newsItem.title    || ""   );
      setUpdatedExcerpt (newsItem.excerpt  || ""   );
      setUpdatedPlatform(newsItem.platform || "PC" );
      setUpdatedCategory(newsItem.category || ""   );
      setUpdatedReadTime(newsItem.readTime || ""   );
      setUpdatedFeatured(newsItem.featured || false);
      setUpdatedContent (newsItem.content  || ""   );
    }
  }, [newsItem]);
//--------------------------------------
// Initialize Editing Fields
//--------------------------------------


//--------------------------------------
// HANDLERS
//--------------------------------------
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Format date as YYYY-MM-DD
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const handleUpdate = async () => {
    if (!newsItem?._id) {
      console.error("News ID is missing or invalid.");
      return;
    }
  
    const updatedNews = {
      title: updatedTitle,
      excerpt: updatedExcerpt,
      platform: updatedPlatform,
      category: updatedCategory,
      readTime: updatedReadTime,
      featured: updatedFeatured,
      content: updatedContent,
    };
  
    const formData = new FormData();
    formData.append("title", updatedNews.title);
    formData.append("excerpt", updatedNews.excerpt);
    formData.append("platform", updatedNews.platform);
    formData.append("category", updatedNews.category);
    formData.append("readTime", updatedNews.readTime);
    formData.append("featured", updatedNews.featured);
    formData.append("content", updatedNews.content);

    if (fileInputRef.current?.files) {
      Array.from(fileInputRef.current.files).forEach((file) => {
        formData.append("images", file);
      });
    }
//--------------------------------------
// HANDLERS
//--------------------------------------


//--------------------------------------
// PUT - ARTICALTES
//--------------------------------------
    try {
      const response = await axios.put(`http://localhost:5000/api/news/dash/${newsItem._id}`, formData, {
        withCredentials: true,
      });
  
      if (response.status === 200) {
        console.log("Article updated successfully!");
        setIsEditing(false);
        setNewsItem(response.data.news);
      }
    } catch (error) {
      console.error("Error updating news:", error);
    }
  };
//--------------------------------------
// PUT - ARTICALTES
//--------------------------------------


//--------------------------------------
// Badge STYLE
//--------------------------------------
  const getStatusBadge = (approved) => {
    return approved ? (
      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 shadow-sm">
        <CheckCircle className="w-4 h-4 mr-1.5" />
        Approved
      </span>
    ) : (
      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 shadow-sm">
        <Clock className="w-4 h-4 mr-1.5" />
        Pending
      </span>
    );
  };
//--------------------------------------
// Badge STYLE
//--------------------------------------


  if (!newsItem) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="mt-10 min-h-screen bg-gradient-to-b from-[#EFF5F5] to-[#E3F0F0] py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Banner */}
            {newsItem.images && newsItem.images.length > 0 && !isEditing && (
              <div className="relative h-72 sm:h-96 md:h-[30rem] overflow-hidden">
                <img
                  src={newsItem.images[0]}
                  alt={newsItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 sm:p-10">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 max-w-3xl">
                    {newsItem.title}
                  </h1>
                  <div className="flex flex-wrap gap-3">
                    {getStatusBadge(newsItem.approve)}
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-[#D6E4E5]/90 text-[#497174] backdrop-blur-sm">
                      {newsItem.platform}
                    </span>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-[#D6E4E5]/90 text-[#497174] backdrop-blur-sm">
                      {newsItem.category}
                    </span>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-[#D6E4E5]/90 text-[#497174] backdrop-blur-sm">
                      <FaClock className="mr-2" /> {newsItem.readTime} min read
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-6 sm:p-8 md:p-10">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center text-[#497174] font-medium hover:text-[#EB6440] transition-colors group"
                >
                  <span className="flex items-center justify-center w-8 h-8 mr-2 rounded-full bg-[#F3F9F9] group-hover:bg-[#FFEDE7] transition-colors">
                    <FaArrowLeft className="text-sm" />
                  </span>
                  Back to Articles
                </button>
                <button
                  onClick={() => setIsEditing((prev) => !prev)}
                  className="px-5 py-2.5 bg-[#EB6440] text-white rounded-full hover:bg-[#d25737] shadow-md transition-all flex items-center"
                >
                  {isEditing ? (
                    "Cancel Edit"
                  ) : (
                    <>
                      <FaEdit className="mr-2" /> Edit Article
                    </>
                  )}
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-8">
                  <div>
                    <label className="block text-[#497174] font-semibold mb-2">Title</label>
                    <input
                      type="text"
                      value={updatedTitle}
                      onChange={(e) => setUpdatedTitle(e.target.value)}
                      className="w-full p-4 border border-[#D6E4E5] rounded-xl shadow-sm focus:ring-2 focus:ring-[#497174] focus:border-transparent transition-all text-lg"
                      placeholder="Article Title"
                    />
                  </div>

                  <div>
                    <label className="block text-[#497174] font-semibold mb-2">Excerpt</label>
                    <textarea
                      value={updatedExcerpt}
                      onChange={(e) => setUpdatedExcerpt(e.target.value)}
                      className="w-full p-4 border border-[#D6E4E5] rounded-xl shadow-sm focus:ring-2 focus:ring-[#497174] focus:border-transparent transition-all"
                      rows="3"
                      placeholder="Article Excerpt"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[#497174] font-semibold mb-2">Platform</label>
                      <div className="relative">
                        <select
                          value={updatedPlatform}
                          onChange={(e) => setUpdatedPlatform(e.target.value)}
                          className="w-full p-4 border border-[#D6E4E5] rounded-xl shadow-sm focus:ring-2 focus:ring-[#497174] focus:border-transparent transition-all appearance-none"
                        >
                          <option value="PC">PC</option>
                          <option value="PS4">PS4</option>
                          <option value="PS5">PS5</option>
                          <option value="Xbox">Xbox</option>
                          <option value="Nintendo Switch">Nintendo Switch</option>
                          <option value="other">Other</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <FaChevronDown className="text-[#497174]" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#497174] font-semibold mb-2">Category</label>
                      <div className="relative">
                        <select
                          value={updatedCategory}
                          onChange={(e) => setUpdatedCategory(e.target.value)}
                          className="w-full p-4 border border-[#D6E4E5] rounded-xl shadow-sm focus:ring-2 focus:ring-[#497174] focus:border-transparent transition-all appearance-none"
                        >
                          <option value="FPS">FPS</option>
                          <option value="RPG">RPG</option>
                          <option value="Adventure">Adventure</option>
                          <option value="Strategy">Strategy</option>
                          <option value="Sports">Sports</option>
                          <option value="Hardware">Hardware</option>
                          <option value="Indie">Indie</option>
                          <option value="Mobile">Mobile</option>
                          <option value="Other">Other</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <FaChevronDown className="text-[#497174]" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#497174] font-semibold mb-2">Read Time (minutes)</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={updatedReadTime}
                          onChange={(e) => setUpdatedReadTime(e.target.value)}
                          className="w-full p-4 border border-[#D6E4E5] rounded-xl shadow-sm focus:ring-2 focus:ring-[#497174] focus:border-transparent transition-all"
                          placeholder="Read Time"
                          min="1"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <FaClock className="text-[#497174]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-[#497174] font-semibold mb-2">Content</label>
                    <textarea
                      value={updatedContent}
                      onChange={(e) => setUpdatedContent(e.target.value)}
                      className="w-full p-4 border border-[#D6E4E5] rounded-xl shadow-sm focus:ring-2 focus:ring-[#497174] focus:border-transparent transition-all"
                      rows="10"
                      placeholder="Article Content"
                    />
                    <div className="absolute top-12 right-4 flex space-x-2">
                      <button className="p-2 bg-[#F3F9F9] rounded-lg hover:bg-[#D6E4E5] transition-colors">
                        <FaBold className="text-[#497174]" />
                      </button>
                      <button className="p-2 bg-[#F3F9F9] rounded-lg hover:bg-[#D6E4E5] transition-colors">
                        <FaItalic className="text-[#497174]" />
                      </button>
                      <button className="p-2 bg-[#F3F9F9] rounded-lg hover:bg-[#D6E4E5] transition-colors">
                        <FaListUl className="text-[#497174]" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#F3F9F9] rounded-2xl p-8">
                    <label className="block text-[#497174] font-semibold mb-4">Article Images</label>
                    <div className="border-2 border-dashed border-[#D6E4E5] rounded-2xl p-8 bg-white text-center cursor-pointer transition-all hover:border-[#497174] group">
                      <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        className="hidden"
                        id="file-upload"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer w-full h-full block">
                        <div className="flex flex-col items-center">
                          <div className="p-5 rounded-full bg-[#D6E4E5] group-hover:bg-[#E9F3F3] transition-colors">
                            <FaFileImage className="h-10 w-10 text-[#497174]" />
                          </div>
                          <p className="mt-5 font-medium text-[#497174] text-lg">Drag and drop or click to upload</p>
                          <p className="mt-2 text-sm text-[#497174]/70">Support JPG, PNG, WEBP up to 5MB</p>
                          <button className="mt-5 px-6 py-2.5 bg-[#497174] text-white rounded-lg hover:bg-[#3b5b5d] transition-colors">
                            Select Files
                          </button>
                        </div>
                      </label>
                    </div>

                    {/* Current images */}
                    {newsItem.images && newsItem.images.length > 0 && (
                      <div className="mt-8">

                        <h4 className="font-medium text-[#497174] mb-4">Current Images</h4>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {newsItem.images.map((img, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={img}
                                alt={`Image ${idx + 1}`}
                                className="w-full h-40 object-cover rounded-xl shadow-md transition-transform group-hover:scale-[1.02]"
                              />

                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity flex items-center justify-center">
                                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors">
                                  <FaTrash className="text-white" />
                                </button>
                              </div>

                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  {/* Display title when no banner is shown */}
                  {(!newsItem.images || newsItem.images.length === 0) && (
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#2D4446] mb-6">{newsItem.title}</h1>
                  )}

                  {/* Article metadata - visible when no banner */}
                  {(!newsItem.images || newsItem.images.length === 0) && (
                    <div className="flex flex-wrap gap-3 mb-8">
                      {getStatusBadge(newsItem.approve)}
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-[#F3F9F9] text-[#497174]">
                        {newsItem.platform}
                      </span>

                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-[#F3F9F9] text-[#497174]">
                        {newsItem.category}
                      </span>

                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-[#F3F9F9] text-[#497174]">
                        <FaClock className="mr-2" /> {newsItem.readTime} min read
                      </span>
                    </div>
                  )}

                  {/* Article excerpt */}
                  <div className="mb-8 p-6 bg-[#F9FCFC] border-l-4 border-[#497174] rounded-lg italic text-lg text-[#3A5B5D]">
                    {newsItem.excerpt}
                  </div>

                  {/* Article content */}
                  <div className="mt-8 prose prose-lg max-w-none prose-headings:text-[#2D4446] prose-p:text-[#3A5B5D] prose-strong:text-[#2D4446]">
                    {newsItem.content}
                  </div>

                  {/* Additional images gallery */}
                  {newsItem.images && newsItem.images.length > 1 && (
                    <div className="mt-12">
                      <h3 className="text-xl font-semibold text-[#2D4446] mb-6">Gallery</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {newsItem.images.slice(1).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Image ${idx + 2}`}
                            className="w-full h-48 object-cover rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-[1.03]"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Article metadata details */}
                  <div className="mt-12 p-6 bg-[#F3F9F9] rounded-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    
                    <div>
                      <p className="text-sm text-[#497174]/70 mb-1">Platform</p>
                      <p className="font-semibold text-[#497174] flex items-center">
                        <FaGamepad className="mr-2" /> {newsItem.platform}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-[#497174]/70 mb-1">Category</p>
                      <p className="font-semibold text-[#497174] flex items-center">
                        <FaLayerGroup className="mr-2" /> {newsItem.category}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-[#497174]/70 mb-1">Read Time</p>
                      <p className="font-semibold text-[#497174] flex items-center">
                        <FaClock className="mr-2" /> {newsItem.readTime} minutes
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-[#497174]/70 mb-1">Published</p>
                      <p className="font-semibold text-[#497174] flex items-center">
                        <FaCalendarAlt className="mr-2" /> {new Date().toLocaleDateString()}
                      </p>
                    </div>

                  </div>
                </div>
              )}

              {/* Comments Section */}
              <div className="mt-12 p-8 bg-[#F3F9F9] rounded-2xl">

                <h3 className="text-2xl font-bold text-[#2D4446] mb-6 flex items-center">
                  <FaComments className="mr-3 text-[#497174]" /> Comments ({comments.length})
                </h3>

                {/* Comments list */}
                <div className="space-y-6">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment._id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 rounded-full bg-[#EB6440] flex items-center justify-center text-white mr-3">
                            {comment.createdBy.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-[#2D4446]">{comment.createdBy.username}</p>
                            <p className="text-xs text-[#497174]/70">2 hours ago</p>
                          </div>
                        </div>
                        <p className="text-[#3A5B5D]">{comment.content}</p>
                        <div className="mt-3 flex items-center gap-4 text-sm text-[#497174]/70">
                          <button className="flex items-center hover:text-[#EB6440] transition-colors">
                            <FaThumbsUp className="mr-1" /> Like
                          </button>
                          <button className="flex items-center hover:text-[#EB6440] transition-colors">
                            <FaReply className="mr-1" /> Reply
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white p-8 rounded-xl text-center">
                      <FaCommentSlash className="w-12 h-12 mx-auto text-[#D6E4E5]" />
                      <p className="mt-4 text-lg text-[#497174]/70">No comments yet. Be the first to share your thoughts!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 flex justify-end space-x-4 p-6">
                {isEditing && (
                  <button
                    onClick={handleUpdate}
                    disabled={!isEditing}
                    className="px-6 py-3 bg-[#497174] text-white rounded-full hover:bg-[#3B5B5D] disabled:bg-[#D6E4E5] disabled:cursor-not-allowed transition duration-200 shadow-md hover:shadow-lg flex items-center"
                  >
                    <FaSave className="mr-2" /> Save Changes
                  </button>
                )}
                <button
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 bg-white text-[#497174] border-2 border-[#D6E4E5] rounded-full hover:border-[#497174] transition duration-200 flex items-center"
                >
                  Back
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleDetailsView;
