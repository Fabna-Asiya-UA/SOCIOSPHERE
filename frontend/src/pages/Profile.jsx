import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();

  const loggedInUsername = localStorage.getItem("username");
  const finalUsername = username || loggedInUsername;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (finalUsername) {
      fetchProfile();
    } else {
      setError("Invalid profile URL");
      setLoading(false);
    }
  }, [finalUsername]);

  const fetchProfile = async () => {
    try {
      const res = await API.get(`profile/${finalUsername}/`);
      setProfile(res.data);
      setError(null);
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError("Profile not found");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      if (profile.is_following) {
        await API.post(`unfollow/${finalUsername}/`);
      } else {
        await API.post(`follow/${finalUsername}/`);
      }
      fetchProfile();
    } catch (err) {
      console.error("Follow/unfollow error:", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!profile) return null;

  const isOwnProfile = profile.username === loggedInUsername;

  return (
    <div className="min-h-screen bg-pink-100 p-8">
      <div className="max-w-xl mx-auto bg-purple-200 p-6 rounded-2xl shadow">

        <div className="flex items-center gap-4 mb-4">
          <img
            src={profile.profile_pic || "/default-avatar.png"}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold">{profile.username}</h2>
            <p className="text-gray-500">{profile.email}</p>
          </div>
        </div>

        {profile.bio && <p className="mb-4">{profile.bio}</p>}

        <div className="flex gap-6 mb-4 ">
          <p className="bg-pink-200 min-h-10 min-w-25 border rounded px-4 py-2 ">Followers: {profile.followers_count ?? 0}</p>
          <p className="bg-pink-200 min-h-10 min-w-25 border rounded px-4 py-2  ">Following: {profile.following_count ?? 0}</p>
        </div>

        <div className="mt-4">
          {isOwnProfile ? (
            <button
              onClick={() => navigate("/edit-profile")}
              className="px-4 py-2 rounded-lg bg-purple-800 text-white"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleFollow}
              className={`px-4 py-2 rounded-lg text-white ${
                profile.is_following ? "bg-red-500" : "bg-blue-500"
              }`}
            >
              {profile.is_following ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Posts</h3>

          {profile.posts?.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            profile.posts?.map((post) => (
              <div
                key={post.id}
                className="bg-gray-100 p-4 rounded-lg mb-4"
              >
                <p>{post.content}</p>

                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="mt-2 rounded-lg w-full"
                  />
                )}

                <p className="text-sm text-gray-500 mt-2">
                  ❤️ {post.likes_count}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default Profile;
