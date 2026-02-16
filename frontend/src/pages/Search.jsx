import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const res = await API.get(`search/?q=${query}`);
      setResults(res.data);
    } catch (err) {
      console.log("Search error", err);
    }
  };

  const goToProfile = (username) => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className="min-h-screen bg-pink-100 p-8">
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Search Users</h2>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Search by username..."
            className="flex-1 p-2 border rounded-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            Search
          </button>
        </div>

        <div className="space-y-4">
          {results.length === 0 && <p>No users found</p>}

          {results.map((user) => (
            <div
              key={user.id}
              onClick={() => goToProfile(user.username)}
              className="bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-gray-100 transition"
            >
              <h3 className="font-bold">{user.username}</h3>
              <p className="text-sm text-gray-600">
                {user.bio || "No bio"}
              </p>
              <p className="text-sm">
                Followers: {user.followers_count}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Search;
