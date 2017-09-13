import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
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
    text: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

commentSchema.methods = {
  view(full) {
    let view = {};
    let fields = ["user", "feedId", "text", "_id", "createdAt", "updatedAt"];
    if (full) {
      fields = [...fields];
    }

    fields.forEach(field => {
      view[field] = this[field];
    });

    return view;
  }
};

const model = mongoose.model("Comment", commentSchema);

export const schema = model.schema;
export default model;
