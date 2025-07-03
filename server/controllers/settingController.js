import User from "../models/User.js";
import bcrypt from "bcrypt";

const ChangePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Wrong old password" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    return res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("ChangePassword Error:", error.message);
    return res.status(500).json({ success: false, error: "Server error while changing password" });
  }
};

export { ChangePassword };
