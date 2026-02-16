import { useState } from "react";
import API from "../api/api";

function PostCard({ post, refreshPosts }) {
  const [commentText, setCommentText] = useState("");
  const loggedInUser = localStorage.getItem("username");

  
  const handleLike = async () => {
    try {
      await API.post(`posts/${post.id}/like/`);
      refreshPosts();
    } catch (err) {
      console.error("Like error:", err);
    }
  };


  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      await API.post("comments/", {
        post: post.id,
        content: commentText,
      });

      setCommentText("");
      refreshPosts();
    } catch (err) {
      console.error("Comment error:", err);
    }
  };


  const handleDeletePost = async () => {
    try {
      await API.delete(`posts/${post.id}/delete/`);
      refreshPosts();
    } catch (err) {
      console.error("Delete post error:", err);
    }
  };

 
  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`comments/${commentId}/delete/`);
      refreshPosts();
    } catch (err) {
      console.error("Delete comment error:", err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 mb-5">

      
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{post.user}</h3>

        {post.user === loggedInUser && (
          <button
            onClick={handleDeletePost}
            className="text-red-500 text-sm hover:underline"
          >
            Delete
          </button>
        )}
      </div>

      <p className="mt-2">{post.content}</p>

    
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="mt-3 rounded-lg w-full"
        />
      )}

    
      <button
        onClick={handleLike}
        className="mt-3 text-sm font-medium"
      >
        {post.is_liked ? "💔 Unlike" : "❤️ Like"} ({post.likes_count})
      </button>

 
      <div className="mt-4">
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="w-full border p-2 rounded-lg"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleComment();
            }
          }}
        />
      </div>

      
      <div className="mt-4 space-y-2">
        {post.comments?.map((comment) => (
          <div
            key={comment.id}
            className="flex justify-between items-center border-t pt-2"
          >
            <div>
              <strong>{comment.user}</strong>: {comment.content}
            </div>

            {comment.user === loggedInUser && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-red-400 text-xs hover:text-red-600"
              >
                ❌
              </button>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}

export default PostCard;
