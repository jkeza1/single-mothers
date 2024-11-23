// Update user role (only for admins)
exports.update = async (req, res, next) => {
    const { role, id } = req.body;
  
    // Check if both role and id are provided
    if (!role || !id) {
      return res.status(400).json({
        message: "Role and Id must be provided",
      });
    }
  
    try {
      // Check if the role is admin
      if (role === "admin") {
        const user = await User.findById(id);
  
        if (!user) {
          return res.status(404).json({
            message: "User not found",
          });
        }
  
        // Update the user's role to admin (you can adjust this logic as needed)
        user.role = "admin"; // You might want to change how you handle roles, this is an example
        await user.save();
  
        return res.status(200).json({
          message: "User role updated to admin",
          user,
        });
      } else {
        return res.status(400).json({
          message: "Role is not admin",
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while updating the role",
        error: error.message,
      });
    }
  };
  