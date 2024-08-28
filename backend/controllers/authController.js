import crypto from "crypto";
import { comparePassword, hashPassword } from "../helper/authHelper.js";
import { sendToken } from "../helper/jwtToken.js";
import { sendEmail } from "../helper/sendEmail.js";
import userModel from "../models/userModel.js";
import cloudinary from "cloudinary";

// register
export const userRegisterController = async (req, res) => {
  try {
    // console.log("req.body.avatar==", req.body);
    // const resp = await cloudinary.v2.uploader.upload(req.body.avatar, {
    //   resource_type: "auto",
    //   folder: "public",
    // });

    if (!req.files || !req.files.avatar) {
      return res.status(400).send("No file uploaded");
    }

    const file = req.files.avatar;
    console.log("req.file====>", req.file);
    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });

    console.log("response", result);
    const { name, email, password } = req.body;

    const isExist = await userModel.findOne({ email });

    if (isExist) {
      return res.status(201).send({
        success: false,
        message: "You are already sign-up please sign-in",
      });
    }

    const hashPass = await hashPassword(password);

    const user = await new userModel({
      name,
      email,
      password: hashPass,
      avatar: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    }).save();

    sendToken(user, 200, "User Register Successfully", res);
  } catch (error) {
    console.log(`User Register Error ${error}`);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
};

// login

export const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Please Enter Your Email & Password",
      });
    }

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not Found",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Your password is invalid",
      });
    }

    sendToken(user, 200, "User Login Successfully", res);
  } catch (error) {
    console.log(`User login Error ${error}`);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
};

// Logout

export const userLogOutController = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).send({
      success: true,
      message: "User Logout Successfully",
    });
  } catch (error) {
    console.log(`User LogOut Error: ${error}`);
    res.status(500).send({ success: false, message: "Something went wrong" });
  }
};

// forgot
export const forgotPasswordController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/password-reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email, please ignore it.`;

    try {
      await sendEmail({
        email: user.email,
        subject: `Ecommerce Password Recovery`,
        message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).send({
        success: false,
        message: "Email could not be sent",
      });
    }
  } catch (error) {
    console.log(`User Forgot Passowrd Error: ${error}`);
    res.status(500).send({ success: false, message: "Something went wrong" });
  }
};

// reset

export const resetPasswordController = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    console.log(req.params.token);

    const user = await userModel.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Reset Password Token is invalid or has been expired",
      });
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).send({
        success: false,
        message: "Password does not password",
      });
    }

    const hashPass = await hashPassword(req.body.password);

    user.password = hashPass;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    console.log("user==========>", user);
    await user.save();

    sendToken(user, 200, "Password Reset Successfully", res);
  } catch (error) {
    console.log(`User Reset Password Error: ${error}`);
    res.status(500).send({ success: false, message: "Something went wrong" });
  }
};

// current user Detail

export const currentUserController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    res.status(200).send({
      success: true,
      message: "Current user Get successfully",
      user,
    });
  } catch (error) {
    console.log(`User Current Detail Error: ${error}`);
    res.status(500).send({ success: false, message: "Something went wrong" });
  }
};

// update password
export const updatePasswordController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("+password");

    const match = await comparePassword(req.body.oldPassword, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Your password is invalid",
      });
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.status(400).send({
        success: false,
        message: "Password does not password",
      });
    }

    const hashPass = await hashPassword(req.body.newPassword);

    user.password = hashPass;

    await user.save();

    sendToken(user, 200, "Password Update successfully", res);
  } catch (error) {
    console.log(`Update Passowrd Error: ${error}`);
    res.status(500).send({ success: false, message: "Something went wrong" });
  }
};

// update user
export const updateUserController = async (req, res) => {
  try {
    const updateUser = {
      name: req.body.name,
      email: req.body.email,
    };

    const user = await userModel.findByIdAndUpdate(req.user.id, updateUser, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res
      .status(200)
      .send({ success: true, message: "User Update Successfully", user });
  } catch (error) {
    console.log(`Updating User Error: ${error}`);
    res.status(500).send({ success: false, message: "Something went wrong" });
  }
};

// Get Single user admin route
export const getSingleUserController = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (!user) {
      res.status(404).send({
        success: false,
        message: `User does not Exist with id ${req.params.id}`,
      });
    }

    res.status(200).send({
      success: true,
      message: "Get Single User Successfully",
      user,
    });
  } catch (error) {
    console.log(`User Get Error: ${error}`);
    res.status(500).send({ success: false, message: "Something went wrong" });
  }
};

// Get All user admin route
export const getAllUserController = async (req, res) => {
  try {
    const totalUser = await userModel.countDocuments();
    const user = await userModel.find();
    console.log(user);
    res.status(200).send({
      success: true,
      message: "Get All Users successfully",
      totalUser,
      user,
    });
  } catch (error) {
    console.log(`Get All Users Error: ${error}`);
    res.status(500).send({ success: false, message: "Something went wrong" });
  }
};

export const updateUserRoleController = async (req, res) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };

    const user = await userModel.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res
      .status(200)
      .send({ success: true, message: "Update Users Role Sucessfully", user });
  } catch (error) {
    console.log(`Update User Role Error: ${error}`);
    res.status(500).send({ success: false, message: "Something went wrong" });
  }
};

// Delete User --Admin
export const deleteUserController = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (!user) {
      res.status(404).send({
        success: false,
        message: `User does not Exist with id ${req.params.id}`,
      });
    }

    await user.deleteOne();

    res.status(200).send({
      success: true,
      message: "User Deleted Successfully",
    });

    // const imageId = user.avatar.public_id;

    // await cloudinary.v2.uploader.destroy(imageId);
  } catch (error) {
    console.log(`Delete User Error: ${error}`);
    res.status(500).send({ success: false, message: "Something went wrong" });
  }
};
