import mongoose, { Schema } from "mongoose";

const reactionSchema = new Schema(
  {
    user: {
      type: Schema.ObjectId,
      ref: "User",
      required: true
    },
    feedId: {
      type: Schema.ObjectId,
      ref: "Feed",
      required: true
    },
    liked: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    timestamps: true
  }
);

reactionSchema.methods = {
  view(full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(),
      feedId: this.feedId,
      liked: this.liked,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };

    return full
      ? {
          ...view
          // add properties for a full view
        }
      : view;
  }
};

const model = mongoose.model("Reaction", reactionSchema);

export const schema = model.schema;
export default model;
