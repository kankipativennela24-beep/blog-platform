import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  Link,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import CommentSection from "../components/CommentSection";

function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(
        `https://blog-platform-ywny.onrender.com/${id}`
      );

      setPost(response.data);
    } catch (error) {
      console.log(
        "Error fetching post:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this post?"
      );

    if (!confirmDelete) {
      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      await axios.delete(
        `https://blog-platform-ywny.onrender.composts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        "Post deleted successfully!"
      );

      navigate("/");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete post"
      );
    }
  };

  if (loading) {
    return (
      <div className="form-container">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="form-container">
        <h2>Post not found</h2>

        <Link to="/">
          ← Back to Home
        </Link>
      </div>
    );
  }

  let loggedInUser = null;

  try {
    const savedUser =
      localStorage.getItem("user");

    if (savedUser) {
      loggedInUser =
        JSON.parse(savedUser);
    }
  } catch (error) {
    console.log(
      "User data error:",
      error
    );
  }

  const isAuthor =
    loggedInUser &&
    post.author &&
    loggedInUser.id ===
      post.author._id;

  return (
    <div className="home">
      <div className="post-card details-card">
        <h1>{post.title}</h1>

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

        <hr />

        <p className="post-content">
          {post.content}
        </p>

        {isAuthor && (
          <div className="buttons">
            <Link
              to={`/edit-post/${id}`}
            >
              ✏️ Edit
            </Link>

            <button
              onClick={handleDelete}
              className="delete-btn"
            >
              🗑️ Delete
            </button>
          </div>
        )}

        <Link
          to="/"
          className="read-btn"
        >
          ← Back to Home
        </Link>
      </div>

      <CommentSection postId={id} />
    </div>
  );
}

export default PostDetails;