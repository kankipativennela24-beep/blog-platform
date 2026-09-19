const express = require("express");

const Comment = require("../models/Comment");
const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET COMMENTS
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({
      postId: req.params.postId,
    })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ADD COMMENT
router.post("/:postId", authMiddleware, async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const newComment = await Comment.create({
      postId: req.params.postId,
      userId: req.user.id,
      comment: comment.trim(),
    });

    const populatedComment = await newComment.populate(
      "userId",
      "name"
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// UPDATE COMMENT
router.put("/:commentId", authMiddleware, async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    const existingComment = await Comment.findById(
      req.params.commentId
    );

    if (!existingComment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (
      existingComment.userId.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message: "You can edit only your own comment",
      });
    }

    existingComment.comment = comment.trim();

    await existingComment.save();

    const updatedComment = await existingComment.populate(
      "userId",
      "name"
    );

    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// DELETE COMMENT
router.delete(
  "/:commentId",
  authMiddleware,
  async (req, res) => {
    try {
      const existingComment = await Comment.findById(
        req.params.commentId
      );

      if (!existingComment) {
        return res.status(404).json({
          message: "Comment not found",
        });
      }

      if (
        existingComment.userId.toString() !==
        req.user.id
      ) {
        return res.status(403).json({
          message: "You can delete only your own comment",
        });
      }

      await Comment.findByIdAndDelete(
        req.params.commentId
      );

      res.json({
        message: "Comment deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;