import mongoose, { Schema } from "mongoose";

const feedSchema = new Schema(
  {
    user: {
      type: Schema.ObjectId,
      ref: "User",
      required: true
    },
    commentsId: [
      {
        type: Schema.ObjectId,
        ref: "Comment"
      }
    ],
    reactionId: [
      {
        type: Schema.ObjectId,
        required: true,
        unique: true
      }
    ],
    type: {
      type: String
    },
    url: {
      type: String
    },
    category: {
      type: String
    },
    text: {
      type: String
    },
    image: {
      small: String,
      medium: String,
      large: String
    },
    slug: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

feedSchema.methods = {
  view(full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(full),
      type: this.type,
      url: this.url,
      category: this.category,
      text: this.text,
      image: this.image,
      slug: this.slug,
      reactionId: this.reactionId,
      commentsId: this.commentsId,
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

const model = mongoose.model("Feed", feedSchema);

export const schema = model.schema;
export default model;
