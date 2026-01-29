const mongoose = require("mongoose");

const vendorSchema = mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value) => {
        const regex =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(value);
      },
      message: "Please enter a valid email address",
    },
  },
  state: { type: String, default: "" },
  city: { type: String, default: "" },
  locality: { type: String, default: "" },
  role: { type: String, default: "vendor" },
  storeName: { type: String, default: "", trim: true },
  storeImage: { type: String, default: "" },
  storeDescription: { type: String, default: "", trim: true },
  password: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value) => value.length >= 6,
      message: "Password must be at least 6 characters long",
    },
  },
});

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
