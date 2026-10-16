import mongoose from "mongoose";
import { USER_TYPES } from "../fixed-data/constants.js";
import Joi from "joi";

const userMongoSchema = new mongoose.Schema({
  name: { type: String, required: true, min: 2, max: 200 },
  username: { type: String, required: true, min: 2, max: 200 },
  password: { type: String, required: true },
  contactNumber: { type: String, required: true, trim: true },
  accountType: {
    type: String,
    enum: Object.values(USER_TYPES),
    required: true,
  },
});

export const userSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.min": "Name must be at least 2 characters long",
    "any.required": "Name is required",
  }),

  username: Joi.string().trim().min(3).max(30).alphanum().required().messages({
    "string.min": "Username must be at least 3 characters long",
    "string.alphanum": "Username can only contain letters and numbers",
    "any.required": "Username is required",
  }),

  password: Joi.string()
    .trim()
    .min(8)
    .max(30)
    .required()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\s])[A-Za-z\d@$!%*?&\s]*$/,
    )
    .messages({
      "any.required": "Password is required.",
      "string.empty": "Password is required and cannot be empty.",
      "string.min": "Password must be at least 8 characters long.",
      "string.max": "Password cannot exceed 30 characters.",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character or space.",
    }),

  phone: Joi.string()
    .trim()
    .pattern(/^\+?[1-9]\d{1,14}$/) // Validates standard 10 to 15 digit international phone formats (e.g., +1234567890 or 1234567890)
    .required()
    .messages({
      "string.pattern.base":
        "Please provide a valid phone number with or without a country code",
      "any.required": "Phone number is required",
    }),

  accountType: Joi.string()
    .valid("guest", "owner", "admin")
    .required()
    .messages({
      "any.only": "Account type must be either guest, owner, or admin",
      "any.required": "Account type is required",
      "string.empty": "Account type cannot be empty.",
    }),
})
  .required()
  .messages({ "any.required": "User payload is required" });

export const User = mongoose.model("User", userMongoSchema);
