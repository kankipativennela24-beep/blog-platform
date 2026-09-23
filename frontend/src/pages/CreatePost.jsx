import { useState } from "react";
import axios from "axios";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCreatePost = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await axios.post(
        "https://blog-platform-1-pwno.onrender.com/api/posts",
        {
          title,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Post created:", response.data);

      alert("Blog post created successfully!");

      setTitle("");
      setContent("");

      window.location.href = "/";
    } catch (error) {
      console.log("CREATE POST ERROR:", error);

      console.log(
        "Backend response:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to create post"
      );
    }
  };

  return (
    <div className="form-container create-post">
      <h1>📝 Create New Blog</h1>

      <form onSubmit={handleCreatePost}>
        <input
          type="text"
          placeholder="Enter Blog Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          required
        />

        <textarea
          placeholder="Write your blog content..."
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
          required
        />

        <button type="submit">
          Publish Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;