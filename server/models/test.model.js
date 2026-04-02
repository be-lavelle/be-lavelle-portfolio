import mongoose from "mongoose";

const TestSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter name"],
    },
    quantity: {
      type: Number,
      required: [true, "Please enter a quantity"],
      default: 0,
    },
  },
  { timestamps: true },
);

export const TestItem = mongoose.model("TestItem", TestSchema);
