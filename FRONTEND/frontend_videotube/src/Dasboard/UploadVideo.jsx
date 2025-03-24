import { useState } from "react";
import axios from "axios";

function UploadVideo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    // Handle video selection
    const handleVideoChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            if (file.size > 100 * 1024 * 1024) { // 100MB limit
                setError("Video file size cannot exceed 100MB.");
                return;
            }
            setError(null);
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file)); // Video preview
        }
    };

    // Handle thumbnail selection
    const handleThumbnailChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                setError("Thumbnail file size cannot exceed 10MB.");
                return;
            }
            setError(null);
            setThumbnailFile(file);
            setThumbnailPreview(URL.createObjectURL(file)); // Thumbnail preview
        }
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!title || !description || !videoFile || !thumbnailFile) {
            setError("Please fill in all fields and select a video and thumbnail.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("videoFile", videoFile);
        formData.append("thumbnail", thumbnailFile);

        try {
            setUploading(true);
            setError(null);
            setSuccessMessage("");

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL_BACKEND}/videos/publish-video`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials : true
            });
            

            setSuccessMessage("Video uploaded successfully!");
            setTitle("");
            setDescription("");
            setVideoFile(null);
            setThumbnailFile(null);
            setVideoPreview(null);
            setThumbnailPreview(null);
        } catch (error) {
            setError("Error uploading video. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-grey-200 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Upload a Video</h2>
            
            {error && <p className="text-red-500">{error}</p>}
            {successMessage && <p className="text-green-500">{successMessage}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    type="text"
                    placeholder="Video Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />

                <textarea 
                    placeholder="Video Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />

                {/* Video Upload */}
                <input 
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="w-full p-2 border rounded"
                    required
                />

                {/* Video Preview */}
                {videoPreview && (
                    <video controls src={videoPreview} className="w-full mt-2 rounded-lg"></video>
                )}

                {/* Thumbnail Upload */}
                <input 
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="w-full p-2 border rounded"
                    required
                />

                {/* Thumbnail Preview */}
                {thumbnailPreview && (
                    <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full mt-2 rounded-lg object-cover h-40" />
                )}

                <button 
                    type="submit" 
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    disabled={uploading}
                >
                    {uploading ? "Uploading..." : "Upload Video"}
                </button>
            </form>
        </div>
    );
}

export default UploadVideo;
