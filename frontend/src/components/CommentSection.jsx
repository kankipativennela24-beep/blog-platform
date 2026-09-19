import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

function CommentSection({ postId }) {
  const [comments, setComments] =
    useState([]);

  const [comment, setComment] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [editText, setEditText] =
    useState("");

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `https://blog-platform-ywny.onrender.com/${postId}`
      );

      setComments(response.data);
    } catch (error) {
      console.log(
        "Error fetching comments:",
        error
      );
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();

    const token =
      localStorage.getItem("token");

    if (!token) {
      alert(
        "Please login to add a comment"
      );
      return;
    }

    if (!comment.trim()) {
      alert(
        "Please enter a comment"
      );
      return;
    }

    try {
      await axios.post(
        `https://blog-platform-ywny.onrender.com/${postId}`,
        {
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComment("");

      fetchComments();

      alert(
        "Comment added successfully!"
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to add comment"
      );
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setEditText(item.comment);
  };

  const handleUpdate = async (
    commentId
  ) => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    if (!editText.trim()) {
      alert(
        "Comment cannot be empty"
      );
      return;
    }

    try {
      await axios.put(
        `https://blog-platform-ywny.onrender.com/${commentId}`,
        {
          comment: editText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditingId(null);
      setEditText("");

      fetchComments();

      alert(
        "Comment updated successfully!"
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update comment"
      );
    }
  };

  const handleDelete = async (
    commentId
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this comment?"
      );

    if (!confirmDelete) {
      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      await axios.delete(
        `https://blog-platform-ywny.onrender.com/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchComments();

      alert(
        "Comment deleted successfully!"
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete comment"
      );
    }
  };

  const loggedInUser = JSON.parse(
    localStorage.getItem("user") ||
      "null"
  );

  return (
    <div className="comments-section">
      <h2>💬 Comments</h2>

      <form onSubmit={handleComment}>
        <textarea
          placeholder="Write your comment..."
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
        />

        <button type="submit">
          Add Comment
        </button>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p>
            No comments yet. Be the first
            to comment!
          </p>
        ) : (
          comments.map((item) => {
            const isCommentAuthor =
              loggedInUser &&
              item.userId &&
              loggedInUser.id ===
                item.userId._id;

            return (
              <div
                className="comment-card"
                key={item._id}
              >
                <strong>
                  {item.userId?.name ||
                    "User"}
                </strong>

                {editingId ===
                item._id ? (
                  <>
                    <textarea
                      value={editText}
                      onChange={(e) =>
                        setEditText(
                          e.target.value
                        )
                      }
                    />

                    <div className="comment-buttons">
                      <button
                        onClick={() =>
                          handleUpdate(
                            item._id
                          )
                        }
                      >
                        💾 Save
                      </button>

                      <button
                        onClick={() => {
                          setEditingId(
                            null
                          );
                          setEditText("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p>
                      {item.comment}
                    </p>

                    <small>
                      {new Date(
                        item.createdAt
                      ).toLocaleDateString()}
                    </small>

                    {isCommentAuthor && (
                      <div className="comment-buttons">
                        <button
                          onClick={() =>
                            handleEdit(
                              item
                            )
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              item._id
                            )
                          }
                          className="comment-delete"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default CommentSection;