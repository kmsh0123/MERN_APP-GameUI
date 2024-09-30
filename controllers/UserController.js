import UserModel from "../models/UserModel.js";
import TokenBlackListModel from "../models/TokenBlackList.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required',
    });
  }

  try {
    const UserExisted = await UserModel.findOne({ email });
    if (UserExisted) {
      throw new Error("User already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new UserModel({ name, email, password: hashedPassword, role: 'admin' });
    await newAdmin.save();

    const savedAdmin = await UserModel.findById(newAdmin._id).select('-password');

    return res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      admin: savedAdmin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
    });
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  try {
    const existingAdmin = await UserModel.findOne({ email });
    if (!existingAdmin) {
      return res.status(401).json({
        success: false,
        message: 'Email does not exist',
      });
    }

    const isMatch = await bcrypt.compare(password, existingAdmin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password',
      });
    }

    const adminToken = jwt.sign(
      { userId: existingAdmin._id, role: existingAdmin.role }, // Include role in the adminToken
      process.env.JWT_KEY,
      { expiresIn: "365d" }
    );

    return res.status(200).json({
      success: true,
      message: "Logged in Successfully",
      admin: {
        adminId: existingAdmin._id,
        email: existingAdmin.email,
        name: existingAdmin.name,
        role : existingAdmin.role,
        createdAt: existingAdmin.createdAt,
        updatedAt: existingAdmin.updatedAt,
      },
      adminToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
    });
  }
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required',
    });
  }

  try {
    const UserExisted = await UserModel.findOne({ email });
    if (UserExisted) {
      throw new Error("User already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({ name, email, password: hashedPassword, role: 'user' });
    await newUser.save();

    const savedUser = await UserModel.findById(newUser._id).select('-password');

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: savedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  try {
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: 'Email does not exist',
      });
    }

    // Check if user is banned
    if (existingUser.isBanned) {
      return res.status(403).json({
        success: false,
        message: 'Your account is banned.',
      });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password',
      });
    }

    const userToken = jwt.sign(
      { userId: existingUser._id, role: existingUser.role }, 
      process.env.JWT_KEY,
      { expiresIn: "365d" }
    );

    return res.status(200).json({
      success: true,
      message: "Logged in Successfully",
      user: {
        UserId: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
        role : existingUser.role,
        createdAt: existingUser.createdAt,
        updatedAt: existingUser.updatedAt,
      },
      userToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
    });
  }
};


export const logoutAdmin = async (req, res) => {
  try {
    const token = req.headers["authorization"].split(' ')[1];
    if (token) {
      await TokenBlackListModel.create({ token });
    }

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const token = req.headers["authorization"].split(' ')[1];
    if (token) {
      await TokenBlackListModel.create({ token });
    }

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({role : "user"}).select("-password"); 
    res.status(200).json({
      success : true,
      message : `Get User All Successfully`,
      users
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
    });
  }
};

export const getSingleUser = async (req, res) => {
  const id = req.params.id
  try {
    const users = await UserModel.findById(id).select("-password"); 
    res.status(200).json({
      success : true,
      message : `Get User All Successfully`,
      users
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
    });
  }
};

export const banUser = async (req, res) => {
  try {
      const { userId } = req.params;
      const user = await UserModel.findById(userId);
      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      user.isBanned = true;
      await user.save();

      return res.status(200).json({ success: true, message: "User banned successfully"});
  } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
  }
};

export const unbanUser = async (req, res) => {
  try {
      const { userId } = req.params;

      const user = await UserModel.findById(userId);
      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      user.isBanned = false;
      await user.save();

      return res.status(200).json({ success: true, message: "User unbanned successfully"});
  } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
  }
};
