import React, { useState } from "react";
import axios from "axios";
import { FaFileImage, FaRegPaperPlane, FaSpinner } from "react-icons/fa";

const CreateRelease = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [featuredImage, setFeaturedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formStatus, setFormStatus] = useState({ message: "", type: "" });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFeaturedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormStatus({ message: "", type: "" });

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("releaseDate", releaseDate);
        if (featuredImage) {
            formData.append("featuredImage", featuredImage);
        }

        try {
            const response = await axios.post("http://localhost:5000/api/upcoming-releases/create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setFormStatus({ message: response.data.message, type: "success" });

            // Reset form fields
            setTitle("");
            setDescription("");
            setReleaseDate("");
            setFeaturedImage(null);
            setImagePreview(null);
        } catch (error) {
            setFormStatus({ 
                message: error.response?.data?.message || "Error creating release", 
                type: "error" 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-[#FFFFFF] p-8  rounded-2xl shadow-lg border border-[#D6E4E5]">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#EFF5F5] p-3 rounded-lg shadow">
                    <FaRegPaperPlane className="text-[#497174] text-xl" />
                </div>
                <h2 className="text-3xl font-bold text-[#000000]">Create New Release</h2>
            </div>

            {/* Status Message */}
            {formStatus.message && (
                <div className={`p-4 mb-6 rounded-md ${
                    formStatus.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                    {formStatus.message}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block font-medium text-sm text-[#497174] mb-1">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-[#D6E4E5] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#497174] outline-none"
                        placeholder="Enter release title"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium text-sm text-[#497174] mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="5"
                        className="w-full border border-[#D6E4E5] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#497174] outline-none"
                        placeholder="Describe the release"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium text-sm text-[#497174] mb-1">Release Date</label>
                    <input
                        type="date"
                        value={releaseDate}
                        onChange={(e) => setReleaseDate(e.target.value)}
                        className="w-full border border-[#D6E4E5] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#497174] outline-none"
                        required
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block font-medium text-sm text-[#497174] mb-1">Featured Image</label>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-grow">
                            <label className="flex justify-center items-center w-full h-32 px-4 transition bg-white border-2 border-dashed border-[#D6E4E5] rounded-md cursor-pointer hover:border-[#EB6440]">
                                <span className="flex flex-col items-center space-y-2">
                                    <FaFileImage className="text-4xl text-[#497174]" />
                                    <span className="text-sm text-[#497174]">
                                        {featuredImage ? featuredImage.name : "Click or drag & drop image"}
                                    </span>
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        {imagePreview && (
                            <div className="flex-shrink-0 h-32 w-32 border border-[#D6E4E5] rounded-md overflow-hidden">
                                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full p-4 rounded-lg font-semibold text-white transition transform ${
                            loading 
                                ? "bg-[#D6E4E5] cursor-not-allowed" 
                                : "bg-[#EB6440] hover:bg-[#497174] active:bg-[#497174] hover:-translate-y-1"
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <FaSpinner className="animate-spin" />
                                Creating...
                            </span>
                        ) : (
                            "Create Release"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateRelease;
