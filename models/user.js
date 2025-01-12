import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcrypt"; // For password hashing

// User schema definition
const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true, // Ensure email is unique
      required: [true, "Email is required!"], // Email is mandatory
    },
    username: {
      type: String,
      required: [true, "Username is required!"], // Username is mandatory
      match: [
        /^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
        "Username invalid, it should contain 5-20 alphanumeric letters and be unique!",
      ], // Username validation
    },
    password: {
      type: String,
      required: [true, "Password is required!"], // Password is mandatory
    },
    image: {
      type: String, // Optional user image URL
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Hash the password before saving to the database
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if the password has been modified
  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next();
  } catch (err) {
    next(err); // Pass error to the next middleware
  }
});

// Compare the provided password with the stored hashed password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Ensure the model is registered only once
const User = models.User || model("User", UserSchema);

export default User;
