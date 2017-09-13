import mongoose, { Schema } from "mongoose";

const reactionSchema = new Schema(
  {
    userId: {
      type: Schema.ObjectId,
      ref: "User",
      required: true
    },
    feedId: {
      type: Schema.ObjectId,
      required: true
    },
    likes: {
      type: Number,
      required: true
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
      userId: this.userId.view(full),
      feedId: this.feedId,
      likes: this.likes,
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
