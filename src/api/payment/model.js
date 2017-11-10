import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema({
  paymentResponse: {
    type: Object
  },
  user: {
    type: Schema.ObjectId,
    ref: "user"
  },
  event: {
    type: Schema.ObjectId,
    ref: "event"
  }
});

const model = mongoose.model("Payment", paymentSchema);
export default model;
