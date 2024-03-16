const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    location: {
      type: [String],
      required: true,
    },
    closedOn: {
      type: Date,
      default: null,
    },
    pickedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: {
      currentTime: () => new Date().toISOString(), // Use UTC time
    },
  }
);

const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;
