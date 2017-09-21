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
const rewardSchema = new Schema({
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
      type: String,
      required: true
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
    backer: backerSchema,
    rewards: [rewardSchema],
    location: {
      place: String,
      lat: { type: Number, required: true },
      long: { type: Number, required: true },
      address: { type: String, required: true }
    },
    goalRequirement: {
      type: String
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    goalCompleted: {
      type: Boolean,
      default: false
    }
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
      rewards: this.rewards,
      location: this.location,
      goalRequirement: this.goalRequirement,
      goalCompleted: this.goalCompleted,
      slug: this.slug
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
