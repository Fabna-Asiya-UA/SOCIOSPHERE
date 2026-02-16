import { useState, useEffect } from "react";
import API from "../api/api";
import PostCard from "./PostCard";

function Dashboard({ setLoggedIn }) {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);   

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await API.get("posts/");
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  const handleCreatePost = async () => {
    if (!content.trim() && !image) return;

    const formData = new FormData();
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    try {
      await API.post("posts/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setContent("");
      setImage(null);
      fetchPosts();
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-pink-100">
      <div className="max-w-2xl mx-auto p-6">

     
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Create Post
          </h2>

          <textarea
            rows="3"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border p-3 rounded-lg mb-4"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="mb-4"
          />

          <button
            onClick={handleCreatePost}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Post
          </button>
        </div>


        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recent Posts
        </h2>

        {posts.length === 0 ? (
          <p className="text-gray-500 text-center">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} refreshPosts={fetchPosts} />
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
