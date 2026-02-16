import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const navigate = useNavigate();
  const loggedInUsername = localStorage.getItem("username");

  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`profile/${loggedInUsername}/`);
        setBio(res.data.bio || "");
        setPreview(res.data.profile_pic || null);
      } catch (err) {
        console.log("Error loading profile", err);
      } finally {
        setLoading(false);
      }
    };

    if (loggedInUsername) {
      fetchProfile();
    } else {
      navigate("/login");
    }
  }, [loggedInUsername, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("bio", bio);

    if (profilePic) {
      formData.append("profile_pic", profilePic);
    }

    try {
      await API.patch("profile/update/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.log("Update error", err);
      alert("Update failed");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-96 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Edit Profile</h2>

      
        {preview && (
          <div className="flex justify-center">
            <img
              src={preview}
              alt="Preview"
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>
        )}

        <div>
          <label className="block mb-1 font-semibold">Bio</label>
          <textarea
            className="w-full border p-2 rounded"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

      
        <div>
          <label className="block mb-1 font-semibold">
            Profile Picture
          </label>
          <input
            type="file"
            onChange={handleImageChange}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-lg"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
