const { Post, Developer } = require("../models");

module.exports = {
  // GET /api/posts (newest first)
  async getPosts(req, res) {
    try {
      const posts = await Post.find().sort({ createdAt: -1 });
      res.json(posts);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to fetch posts", error: err.message });
    }
  },

  // GET /api/posts/:postId
  async getSinglePost(req, res) {
    try {
      const post = await Post.findById(req.params.postId);

      if (!post) {
        return res.status(404).json({ message: "No post found with that id" });
      }

      res.json(post);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to fetch post", error: err.message });
    }
  },

  // POST /api/posts (create + associate with developer)
  async createPost(req, res) {
    try {
      const { content, authorUsername } = req.body;

      if (!content || !authorUsername) {
        return res.status(400).json({
          message: "content and authorUsername are required",
        });
      }

      // ensure developer exists
      const author = await Developer.findOne({ username: authorUsername });
      if (!author) {
        return res.status(404).json({
          message: `No developer found with username "${authorUsername}"`,
        });
      }

      // create post
      const post = await Post.create({ content, authorUsername });

      // link post to developer
      await Developer.updateOne(
        { _id: author._id },
        { $addToSet: { posts: post._id } }
      );

      res.status(201).json(post);
    } catch (err) {
      res
        .status(400)
        .json({ message: "Failed to create post", error: err.message });
    }
  },

  // PUT /api/posts/:postId (update a post)
  async updatePost(req, res) {
    try {
      // Only allow updating fields that make sense
      const update = {};
      if (typeof req.body.content === "string") update.content = req.body.content;

      const post = await Post.findByIdAndUpdate(req.params.postId, update, {
        new: true,
        runValidators: true,
      });

      if (!post) {
        return res.status(404).json({ message: "No post found with that id" });
      }

      res.json(post);
    } catch (err) {
      res
        .status(400)
        .json({ message: "Failed to update post", error: err.message });
    }
  },

  // DELETE /api/posts/:postId (delete + de-associate from developer)
  async deletePost(req, res) {
    try {
      const post = await Post.findById(req.params.postId);

      if (!post) {
        return res.status(404).json({ message: "No post found with that id" });
      }

      // remove post id from the developer.posts array
      await Developer.updateOne(
        { username: post.authorUsername },
        { $pull: { posts: post._id } }
      );

      // delete the post
      await Post.deleteOne({ _id: post._id });

      res.json({ message: "Post deleted", postId: post._id });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to delete post", error: err.message });
    }
  },

  // POST /api/posts/:postId/reactions (add reaction)
  async addReaction(req, res) {
    try {
      const { reactionBody, username } = req.body;

      if (!username) {
        return res.status(400).json({ message: "username is required" });
      }

      const post = await Post.findByIdAndUpdate(
        req.params.postId,
        {
          $push: {
            reactions: { reactionBody, username },
          },
        },
        { new: true, runValidators: true }
      );

      if (!post) {
        return res.status(404).json({ message: "No post found with that id" });
      }

      res.status(201).json(post);
    } catch (err) {
      res
        .status(400)
        .json({ message: "Failed to add reaction", error: err.message });
    }
  },

  // DELETE /api/posts/:postId/reactions/:reactionId (remove reaction by reactionId)
  async removeReaction(req, res) {
    try {
      const post = await Post.findByIdAndUpdate(
        req.params.postId,
        {
          $pull: { reactions: { reactionId: req.params.reactionId } },
        },
        { new: true }
      );

      if (!post) {
        return res.status(404).json({ message: "No post found with that id" });
      }

      res.json(post);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to remove reaction", error: err.message });
    }
  },
};