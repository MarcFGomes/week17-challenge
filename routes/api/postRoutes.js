const router = require("express").Router();
const {
  getPosts,
  getSinglePost,
  createPost,
  updatePost,
  deletePost,
  addReaction,
  removeReaction,
} = require("../../controllers/postController");

// /api/posts
router.route("/")
  .get(getPosts)
  .post(createPost);

// /api/posts/:postId
router.route("/:postId")
  .get(getSinglePost)
  .put(updatePost)
  .delete(deletePost);

// /api/posts/:postId/reactions
router.route("/:postId/reactions")
  .post(addReaction);

// /api/posts/:postId/reactions/:reactionId
router.route("/:postId/reactions/:reactionId")
  .delete(removeReaction);

module.exports = router;