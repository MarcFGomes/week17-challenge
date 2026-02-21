const { Schema, model } = require("mongoose");

// Simple formatted date getter
const dateFormatter = (timestamp) => timestamp.toLocaleString();

const reactionSchema = new Schema(
  {
    reactionBody: {
      type: String,
      required: true,
      trim: true,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: dateFormatter,
    },
  },
  {
    toJSON: { getters: true },
    id: false,
  }
);

const postSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 300,
      trim: true,
    },
    authorUsername: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: dateFormatter,
    },
    reactions: [reactionSchema], // ✅ subdocuments
  },
  {
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
    id: false,
  }
);

// ✅ Virtual: reactionCount
postSchema.virtual("reactionCount").get(function () {
  return this.reactions?.length || 0;
});

module.exports = model("post", postSchema);