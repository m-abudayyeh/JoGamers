import React, { useState } from "react";
import { FaBold, FaItalic, FaFileImage, FaTrashAlt, FaRegPaperPlane } from "react-icons/fa";
import axios from "axios";

const CreateArticle = () => {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [platform, setPlatform] = useState("PC");
  const [category, setCategory] = useState("FPS");
  const [readTime, setReadTime] = useState("");
  const [featured, setFeatured] = useState(false);
  const [content, setContent] = useState("");
  const [featuredImages, setFeaturedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFeaturedImages([...featuredImages, ...files]);
    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setPreviewImages([...previewImages, ...newPreviews]);
  };

  const removeImage = (index) => {
    const updatedImages = [...featuredImages];
    updatedImages.splice(index, 1);
    setFeaturedImages(updatedImages);
    const updatedPreviews = [...previewImages];
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);
  };

  const handleBold = () => setContent(content + "<b></b>");
  const handleItalic = () => setContent(content + "<i></i>");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("excerpt", excerpt);
    formData.append("platform", platform);
    formData.append("category", category);
    formData.append("readTime", readTime);
    formData.append("featured", featured);
    formData.append("content", content);
    featuredImages.forEach((img) => formData.append("images", img));

    try {
      const response = await axios.post("http://localhost:5000/api/news/dash/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      alert(response.data.message);
      setTitle(""); setExcerpt(""); setPlatform("PC"); setCategory("FPS");
      setReadTime(""); setFeatured(false); setContent("");
      setFeaturedImages([]); setPreviewImages([]);
    } catch (err) {
      alert("Error creating news.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-[#FFFFFF] p-8  rounded-2xl shadow-xl border border-[#D6E4E5]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-[#EFF5F5] p-3 rounded-lg shadow">
          <FaRegPaperPlane className="text-[#497174] text-xl" />
        </div>
        <h2 className="text-3xl font-bold text-[#000000]">Create News Article</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium text-sm text-[#497174] mb-1">Title</label>
          <input
            type="text"
            className="w-full border border-[#D6E4E5] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#497174] outline-none"
            placeholder="News title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium text-sm text-[#497174] mb-1">Excerpt</label>
          <textarea
            className="w-full border border-[#D6E4E5] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#497174] outline-none"
            placeholder="Short excerpt"
            rows={3}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-sm text-[#497174] mb-1">Platform</label>
            <select
              className="w-full border border-[#D6E4E5] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#497174] outline-none"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              {["PC", "PS4", "PS5", "Xbox", "Nintendo Switch", "Other"].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-sm text-[#497174] mb-1">Category</label>
            <select
              className="w-full border border-[#D6E4E5] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#497174] outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {["FPS", "RPG", "Adventure", "Strategy", "Sports", "Hardware", "Indie", "Mobile", "Other"].map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-medium text-sm text-[#497174] mb-1">Read Time (minutes)</label>
          <input
            type="number"
            className="w-full border border-[#D6E4E5] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#497174] outline-none"
            placeholder="Estimated read time"
            value={readTime}
            onChange={(e) => setReadTime(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="accent-[#EB6440]"
          />
          <label className="text-sm text-[#497174] font-medium">Mark as Featured</label>
        </div>

        {/* Content Editor */}
        <div>
          <label className="block font-medium text-sm text-[#497174] mb-1">Content</label>
          <div className="flex gap-2 mb-2">
            <button type="button" onClick={handleBold} className="bg-[#D6E4E5] p-2 rounded hover:bg-[#EFF5F5]">
              <FaBold className="text-[#497174]" />
            </button>
            <button type="button" onClick={handleItalic} className="bg-[#D6E4E5] p-2 rounded hover:bg-[#EFF5F5]">
              <FaItalic className="text-[#497174]" />
            </button>
          </div>
          <textarea
            className="w-full border border-[#D6E4E5] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#497174] outline-none"
            placeholder="Article content with optional <b> or <i> formatting"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-medium text-sm text-[#497174] mb-1">Upload Featured Images</label>
          <div className="border-2 border-dashed border-[#D6E4E5] p-6 rounded-xl text-center cursor-pointer">
            <label htmlFor="image-upload" className="flex flex-col items-center justify-center">
              <FaFileImage className="text-4xl text-[#497174]" />
              <p className="text-sm text-[#497174] mt-2">Click to choose images</p>
            </label>
            <input
              id="image-upload"
              type="file"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Preview Images */}
          {previewImages.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {previewImages.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img.url} alt={img.name} className="rounded-lg h-24 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-[#EB6440] hover:bg-red-700 text-white rounded-full p-1"
                  >
                    <FaTrashAlt size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 mt-6 rounded-lg text-white font-semibold transition ${
            loading ? "bg-[#D6E4E5]" : "bg-[#EB6440] hover:bg-[#497174]"
          }`}
        >
          {loading ? "Creating..." : "Create Article"}
        </button>
      </form>
    </div>
  );
};

export default CreateArticle;
