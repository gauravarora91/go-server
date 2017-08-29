import mongoose, { Schema } from 'mongoose'

const commentsSchema = new Schema(
  {
    user: {
      type: Schema.ObjectId,
      ref: 'User',
      required: true
    },
    feed: {
      type: String
    },
    comment: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

commentsSchema.methods = {
  view (full) {
    const view = {
      // simple view
      commentId: this.id,
      user: this.user.view(full),
      feed: this.feed,
      comment: this.comment,
      // Changed createdAt to commentAt bcoz of mergedList in  react Feed.js
      commentAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full
      ? {
        ...view
          // add properties for a full view
      }
      : view
  }
}

const model = mongoose.model('Comments', commentsSchema)

export const schema = model.schema
export default model
