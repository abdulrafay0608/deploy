import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const isAuthenticatedUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Please login to access this resource",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).send({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Server error",
    });
  }
};

export const isAdmin = (...roles) => {
  try {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).send({
          success: false,
          message: `Role ${req.user.role} is not Allow to Access this resource`,
        });
      } else {
        next();
      }
    };
  } catch (error) {
    console.log(`Error is Admin Authorization ${error}) `);
    res.status(401).send({
      success: false,
      message: "Error Is Admin Authorization",
      error,
    });
  }
};
