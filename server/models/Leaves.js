import mongoose from "mongoose";
const { Schema } = mongoose;

const leaveSchema = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    leaveType: {
      type: String,
      enum: ["Sick Leave", "Casual Leave", "Annual Leave"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const Leave = mongoose.model("Leave", leaveSchema);
export default Leave;
