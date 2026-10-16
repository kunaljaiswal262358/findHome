import mongoose from "mongoose";
import { USER_TYPES } from "../fixed-data/constants";

const homeSchema = new mongoose.Schema({
  name: { type: String, required: true, min: 2, max: 200 },
  ownerId: { type: mongoose.Schema.Types.ObjectId, required: true , validate: {
    validator: async (userId) => {
        const user = await mongoose.model('User').findById(userId);
        return user && user.accountType === USER_TYPES.OWNER;
    },
    message: "The referenced must have ${USER_TYPES.OWNER} account type."
  }},
  location: {
    type: [Number],
    required: true,
    validate: {
      validator: (coords) => {
        const [lng, lat] = coords;
        return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
      },
      message: "Invalid geo location.",
    },
  },
  address: { type: mongoose.Schema.Types.ObjectId },
  createdAt: { type: Date, default: Date.now() },
});

export const Home = mongoose.model("Home", homeSchema);
