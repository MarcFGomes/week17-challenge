const { Schema, model } = require("mongoose");

// Email validation regex (standard, acceptable for assignments)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const developerSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      match: [emailRegex, "Please enter a valid email address"],
    },

    headline: {
      type: String,
      trim: true,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "post",
      },
    ],

    connections: [
      {
        type: Schema.Types.ObjectId,
        ref: "developer",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

// Virtual: connectionCount
developerSchema.virtual("connectionCount").get(function () {
  return this.connections?.length || 0;
});

// Virtual: postCount
developerSchema.virtual("postCount").get(function () {
  return this.posts?.length || 0;
});

module.exports = model("developer", developerSchema);