const { Schema, Types } = require("mongoose");

// formatted date getter
const dateFormatter = (timestamp) => timestamp.toLocaleString();

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },

    reactionBody: {
      type: String,
      maxlength: 200,
      trim: true,
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
    _id: false, // prevent Mongoose from creating its own _id
  }
);

module.exports = reactionSchema;