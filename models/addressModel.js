import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  streetAddress: { type: String, trim: true },
  city: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  pincode: { type: String, required: true, trim: true },
});

export const Address = mongoose.model("Address", addressSchema);
