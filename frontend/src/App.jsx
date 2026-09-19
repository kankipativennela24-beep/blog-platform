import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import EditPost from "./pages/EditPost";
import Profile from "./pages/Profile";

import Navbar from "./components/Navbar";

function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        "https://blog-platform-ywny.onrender.com/posts"
      );

      setPosts(response.data);
    } catch (error) {
      console.log(
        "Error fetching posts:",
        error
      );
    }
  };

  const filteredPosts = posts.filter((post) => {
    const searchText = search.toLowerCase();

    return (
      post.title
        .toLowerCase()
        .includes(searchText) ||
      post.content
        .toLowerCase()
        .includes(searchText) ||
      post.author?.name
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  return (
    <div className="home">

      <div className="hero-section">
        <h1>📝 Welcome to Blog Platform</h1>

        <p>
          Create, share and discuss your ideas
          with others.
        </p>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Search blog posts..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      <h2 className="latest-title">
        Latest Blog Posts
      </h2>

      {filteredPosts.length === 0 ? (
        <div className="empty-posts">
          <p>
            {search
              ? "No matching posts found."
              : "No blog posts available."}
          </p>

          {!search && (
            <Link
              to="/create-post"
              className="read-btn"
            >
              Create Your First Post
            </Link>
          )}
        </div>
      ) : (
        filteredPosts.map((post) => (
          <div
            className="post-card"
            key={post._id}
          >
            <h2>{post.title}</h2>

            <p>{post.content}</p>

            <p className="author">
              By{" "}
              {post.author?.name ||
                "Unknown User"}
            </p>

            <p className="post-date">
              {new Date(
                post.createdAt
              ).toLocaleDateString()}
            </p>

            <Link
              to={`/post/${post._id}`}
              className="read-btn"
            >
              Read More →
            </Link>
          </div>
        ))
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/create-post"
          element={<CreatePost />}
        />

        <Route
          path="/post/:id"
          element={<PostDetails />}
        />

        <Route
          path="/edit-post/:id"
          element={<EditPost />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;