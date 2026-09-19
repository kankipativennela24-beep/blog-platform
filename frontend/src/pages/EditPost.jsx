import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(
        `https://blog-platform-ywny.onrender.com/${id}`
      );

      setTitle(response.data.title);
      setContent(response.data.content);
    } catch (error) {
      alert("Unable to load post");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      await axios.put(
        `https://blog-platform-ywny.onrender.com/${id}`,
        {
          title,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Post updated successfully!");

      navigate(`/post/${id}`);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update post"
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

  return (
    <div className="form-container create-post">
      <h1>✏️ Edit Blog Post</h1>

      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Blog Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <button type="submit">
          Update Post
        </button>
      </form>
    </div>
  );
}

export default EditPost;