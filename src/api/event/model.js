import mongoose, { Schema } from "mongoose";

/* Sub schema for backer */
const backerSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: "User",
    required: true
  },
  amount: {
    type: Number
  }
});

/* Sub schema for rewards */
const options = new Schema({
  description: {
    type: String
  },
  amount: {
    type: Number
  }
});

const eventSchema = new Schema(
  {
    createdBy: {
      type: Schema.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String
    },
    descriptionShort: {
      type: String
    },
    descriptionLong: {
      type: String
    },
    pledgedAmount: {
      type: Number
    },
    images: {
      small: String,
      medium: String,
      large: String
    },
    time: {
      type: Date,
      default: Date.now
    },
    backer: [backerSchema],
    rewards: [options]
  },
  {
    timestamps: true
  }
);

eventSchema.methods = {
  view(full) {
    const view = {
      // simple view
      id: this.id,
      createdBy: this.createdBy,
      name: this.name,
      descriptionShort: this.descriptionShort,
      descriptionLong: this.descriptionLong,
      pledgedAmount: this.pledgedAmount,
      images: this.images,
      time: this.time,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      backer: this.backer,
      rewards: this.rewards
    };

    return full
      ? {
          ...view
          // add properties for a full view
        }
      : view;
  }
};

const model = mongoose.model("Event", eventSchema);

export const schema = model.schema;
export default model;
