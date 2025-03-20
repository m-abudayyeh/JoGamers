import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditRelease = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [featuredImage, setFeaturedImage] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Color palette
    const colors = {
        background: "#EFF5F5",
        secondaryBg: "#D6E4E5",
        primary: "#497174",
        accent: "#EB6440",
        white: "#FFFFFF",
        black: "#000000"
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const fetchRelease = async () => {
            setFetchLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/upcoming-releases/${id}`);
                const release = response.data.release;
                setTitle(release.title);
                setDescription(release.description);
                setReleaseDate(formatDate(release.releaseDate));
                setCurrentImage(release.featuredImage);
                setError(null);
            } catch (err) {
                console.error("Error fetching release:", err);
                setError("Failed to fetch release details. Please try again later.");
            } finally {
                setFetchLoading(false);
            }
        };        
        fetchRelease();
    }, [id]);

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
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("releaseDate", releaseDate);
        if (featuredImage) {
            formData.append("featuredImage", featuredImage);
        }

        try {
            await axios.put(`http://localhost:5000/api/upcoming-releases/${id}`, formData);
            showNotification("Release updated successfully!", "success");
            navigate('/publisher');        
        } catch (err) {
            console.error("Error updating release:", err);
            showNotification("Error updating the release.", "error");
            setLoading(false);
        }
    };

    const showNotification = (message, type) => {
        alert(message);
    };

    const handleCancel = () => {
        navigate('/upcoming-releases');
    };

    if (fetchLoading) {
        return (
            <div style={{ backgroundColor: colors.white }} className="p-8 rounded-lg shadow-lg max-w-2xl mx-auto my-8 flex justify-center items-center min-h-[400px]">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-4" 
                        style={{ borderColor: colors.secondaryBg, borderTopColor: colors.accent }}></div>
                    <p className="mt-4 text-lg font-medium" style={{ color: colors.primary }}>Loading release details...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: colors.background }} className="min-h-screen py-10 px-4">
            <div style={{ backgroundColor: colors.white }} className="p-8 rounded-xl shadow-xl max-w-2xl mx-auto">
                <div className="flex items-center mb-8">
                    <button 
                        onClick={handleCancel}
                        className="mr-4 p-2 rounded-full transition-colors"
                        style={{ backgroundColor: colors.secondaryBg }}
                        aria-label="Go back"
                    >
                        <span className="block h-5 w-5 text-center font-bold" style={{ color: colors.primary }}>←</span>
                    </button>
                    <h2 className="text-3xl font-bold" style={{ color: colors.primary }}>Edit Release</h2>
                </div>

                {error && (
                    <div className="p-4 mb-6 rounded-lg" style={{ backgroundColor: '#FFEBE6', borderLeft: `4px solid ${colors.accent}` }}>
                        <div className="flex">
                            <div className="ml-2">
                                <p className="text-sm font-medium" style={{ color: colors.accent }}>{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: colors.secondaryBg }}>
                    <div className="flex items-center">
                        <span className="inline-block w-6 h-6 rounded-full mr-2 text-center font-bold" style={{ backgroundColor: colors.primary, color: colors.white }}>i</span>
                        <p className="text-sm" style={{ color: colors.primary }}>
                            Editing release ID: <span className="font-mono font-medium" style={{ color: colors.accent }}>{id}</span>
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: colors.primary }}>Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 transition-colors"
                            style={{ borderColor: colors.secondaryBg, backgroundColor: colors.white, color: colors.black }}
                            placeholder="Enter release title"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: colors.primary }}>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="5"
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 transition-colors"
                            style={{ borderColor: colors.secondaryBg, backgroundColor: colors.white, color: colors.black }}
                            placeholder="Describe the release"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: colors.primary }}>Release Date</label>
                        <input
                            type="date"
                            value={releaseDate}
                            onChange={(e) => setReleaseDate(e.target.value)}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 transition-colors"
                            style={{ borderColor: colors.secondaryBg, backgroundColor: colors.white, color: colors.black }}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: colors.primary }}>Featured Image</label>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-grow">
                                <label className="flex justify-center items-center w-full h-32 px-4 transition border-2 border-dashed rounded-md appearance-none cursor-pointer hover:border-blue-500 focus:outline-none"
                                    style={{ backgroundColor: colors.white, borderColor: colors.secondaryBg }}>
                                    <span className="flex flex-col items-center space-y-2">
                                        <span className="text-sm text-center" style={{ color: colors.primary }}>
                                            {featuredImage ? featuredImage.name : "Choose a new image (optional)"}
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
                            <div className="flex-shrink-0">
                                {(imagePreview || currentImage) && (
                                    <div className="relative h-32 w-32 border rounded-md overflow-hidden"
                                        style={{ borderColor: colors.secondaryBg }}>
                                        <img 
                                            src={imagePreview || currentImage} 
                                            alt="Release preview" 
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/api/placeholder/128/128";
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <span className="text-white text-xs">Current image</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex-1 p-3 font-medium rounded-lg transition-colors"
                            style={{ backgroundColor: colors.secondaryBg, color: colors.primary }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 p-3 font-semibold rounded-lg transition-colors flex items-center justify-center`}
                            style={{ 
                                backgroundColor: loading ? '#ccc' : colors.accent, 
                                color: colors.white,
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-4 border-t-4 border-white rounded-full" 
                                        style={{ borderTopColor: 'transparent' }}></div>
                                    Updating...
                                </>
                            ) : (
                                "Update Release"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditRelease;