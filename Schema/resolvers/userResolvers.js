const { GraphQLError } = require("graphql");
const models = require("../../models");
const bcrypt = require("bcrypt");
const {
  UserInputError,
  AuthenticationError,
} = require("apollo-server-express");
const {
  validateEmail,
  otpGeneratorFunc,
  getIPAddress,
  getLocationByIP,
} = require("../../utils/general");
const jwt = require("jsonwebtoken");
const { sendOtpEmail } = require("../../utils/nodemailer");
require("dotenv").config();
const { readFile, removeFile } = require("../../middleware/file");
const path = require("path");
const cloudinary = require("../../config/cloudinary");

const userResolvers = {
  Query: {
    listUser: async (parent, args, context) => {
      return await models.DB_People.find({});
    },
    getUser: async (parent, args, context) => {
      try {
        const user = await models.DB_People.findById(args.id);
        if (!user) return null;
        return {
          ...user._doc,
          id: user._id,
          password: "secured_password",
        };
      } catch (err) {
        throw new Error(err.message);
      }
    },
    verifyOTP: async (parent, args, context) => {
      const { otp, email } = args;
      if (!otp || !email) {
        throw new UserInputError("❌ OTP or Email is missing!");
      }
      const matchedOtp = await models.DB_OTP.findOne({
        otp: otp,
        userEmail: email,
      });

      if (!matchedOtp) {
        return false;
      } else {
        return true;
      }
    },
    loginUser: async (parent, args, { req, res }) => {
      try {
        const { email, password } = args;
        if (!email || !password) {
          throw new UserInputError("❌ Email or Password is missing!");
        }

        const matchedUser = await models.DB_People.findOne({ email: email });
        if (!matchedUser) {
          throw new Error("❌ User not found!");
        }
        const isMatched = await bcrypt.compare(password, matchedUser.password);
        if (!isMatched) {
          throw new Error("❌ Password is incorrect!");
        }
        const location = await getLocationByIP(
          args?.userIP,
          process.env.IPAPI_KEY
        );

        const deviceInfo = {
          userIP: args?.userIP,
          onMobile: args?.onMobile,
          userPlatform: args?.userPlatform,
          userAgent: args?.userAgent,
          userBrowser: args?.userBrowser,
          ipCity: location?.city,
          ipCountry: location?.country_name,
        };

        await models.DB_People.updateOne(
          { _id: matchedUser._id },
          { $addToSet: { devices: deviceInfo } }
        );

        // generate token for cookies
        const token = jwt.sign(
          {
            userId: matchedUser._id,
            userEmail: matchedUser.email,
            userRole: matchedUser.role,
            userIP: args?.userIP,
            userCity: location?.city,
            userCountry: location?.country_name,
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRY }
        );

        return {
          userId: matchedUser._id,
          userRole: matchedUser.role,
          token: token,
          tokenExpiration: process.env.JWT_EXPIRY,
        };
      } catch (err) {
        console.log("❌ Failed to login user: \n", err);
        throw new Error(err.message);
      }
    },
    currentUser: async (parent, args, { req, res }) => {
      if (!req.isAuth || !req.userId) {
        return;
      }
      try {
        const user = await models.DB_People.findById(req.userId);
        if (!user) {
          throw new Error("User not found! Please login first!");
        }
        return {
          ...user._doc,
          id: user._id,
          password: "secured_password",
        };
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },

  Mutation: {
    getOtp: async (parent, { email }, context) => {
      if (!email) {
        throw new UserInputError("Email is missing!");
      }
      // regex email validation
      if (!validateEmail(email)) {
        throw new UserInputError("Invalid Email!");
      }
      try {
        // check if email already exists
        const matchedUser = await models.DB_OTP.findOne({ userEmail: email });

        if (matchedUser) {
          throw new UserInputError(
            `OTP already sent to ${email}. Please try again after 5 minutes.`
          );
        }
        // generating OTP
        const genOtp = otpGeneratorFunc();

        const newOtp = new models.DB_OTP({
          otp: genOtp,
          userEmail: email,
          medium: "email",
        });

        await newOtp.save();

        await sendOtpEmail(
          email,
          "Please use this following OTP to complete register!",
          genOtp
        );
        return `OTP sent to ${email} at ${new Date()}`;
      } catch (err) {
        console.log("Failed to send otp: \n", err);
        throw new GraphQLError(`${err.message}`);
      }
    },
    createUser: async (parent, args, context) => {
      try {
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
        // regex email validation
        if (!validateEmail(args.input.email)) {
          throw new UserInputError("Invalid Email!");
        }
        // check if email already exists
        const matchedUser = await models.DB_People.findOne({
          email: args.input.email,
        });
        if (matchedUser) return new UserInputError("Email already exists!");
        // hashing password
        const hashedPassword = await bcrypt.hash(args.input.password, salt);
        if (!hashedPassword) throw new Error("Failed to hash password");
        // creating new user
        const newUser = new models.DB_People({
          name: args.input.name,
          email: args.input.email,
          password: hashedPassword,
          avatar: args.input.avatar || "",
          role: args.input.role,
          designation: args.input.designation || "",
          dialCode: args.input.dialCode || "",
          phone: args.input.phone || null,
          cloudinary_id: args.input.cloudinary_id || "",
          flag: args.input.flag || "",
          country: args.input.country || "",
          numLen: args.input.numLen || null,
        });
        // saving new user to database
        const result = await newUser.save();

        return {
          ...result._doc,
          id: result._id,
          password: "secured_password",
        };
      } catch (err) {
        console.log("❌ Failed to register user: \n", err);
        console.log(err.keyValue);
        if (err.code === 11000) {
          let errField = Object.keys(err.keyValue)[0];
          throw new UserInputError(`${errField} already exists in Database!`);
        } else {
          throw new GraphQLError(`${err.message}`);
        }
      }
    },
    updateUserPassword: async (parent, args, context) => {
      try {
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
        // regex email validation
        if (!validateEmail(args?.email)) {
          throw new UserInputError("Invalid Email!");
        }
        // check if email already exists
        const matchedUser = await models.DB_People.findOne({
          email: args.email,
        });
        if (!matchedUser) return new UserInputError("Email not found!");
        // hashing password
        const hashedPassword = await bcrypt.hash(args?.password, salt);
        if (!hashedPassword) throw new Error("Failed to hash password");
        // updating user password
        const updatedUserInfo = new models.DB_People({
          _id: matchedUser._id,
          password: hashedPassword,
        });

        const result = await models.DB_People.findOneAndUpdate(
          { _id: matchedUser._id },
          updatedUserInfo,
          {
            new: true,
          }
        );

        return {
          ...result._doc,
          id: result._id,
          password: "secured_password",
        };
      } catch (err) {
        console.log(
          "❌ ~ file: userResolvers.js:227 ~ updateUserPassword: ~ err:",
          err
        );
        console.log(err.keyValue);
        if (err.code === 11000) {
          let errField = Object.keys(err.keyValue)[0];
          throw new UserInputError(`${errField} already exists in Database!`);
        } else {
          throw new GraphQLError(`${err.message}`);
        }
      }
    },
    updateUser: async (parent, args, { req, res }) => {
      if (!req.isAuth) {
        throw new AuthenticationError("Unauthenticated!");
      }

      try {
        const updatedUserInfo = new models.DB_People({
          _id: args.id,
          name: args.input.name,
          avatar: args.input.avatar,
          designation: args.input.designation,
          dialCode: args.input.dialCode,
          phone: args.input.phone,
          cloudinary_id: args.input.cloudinary_id,
          flag: args.input.flag,
          country: args.input.country,
          numLen: args.input.numLen,
        });

        const result = await models.DB_People.findOneAndUpdate(
          { _id: args.id },
          updatedUserInfo,
          {
            new: true,
          }
        );

        return {
          ...result._doc,
          id: result._id,
          password: "secured_password",
        };
      } catch (err) {
        throw new GraphQLError(`${err.message}`);
      }
    },
    uploadProfileImg: async (parent, { file }, { req, res }) => {
      if (!req.isAuth) {
        throw new AuthenticationError("Unauthenticated!");
      }
      try {
        const imageName = await readFile(file); // reading file and saving to uploads folder
        const mainDir = path.dirname(require.main.filename);
        let newFile = `${mainDir}/uploads/${imageName}`; // new file path
        const userDetails = await models.DB_People.findById(req.userId);
        let prvImgId = userDetails.cloudinary_id; // previous image id
        if (imageName && newFile) {
          const uploadFile = await cloudinary.v2.uploader.upload(newFile);
          if (!uploadFile) {
            removeFile(newFile);
            throw new Error("Failed to upload image");
          }

          const updatedUser = new models.DB_People({
            _id: req.userId,
            avatar: uploadFile?.secure_url,
            cloudinary_id: uploadFile?.public_id,
          });
          // deleting file from uploads folder after uploading to cloudinary
          removeFile(newFile);

          // deleting previous image from cloudinary
          prvImgId && (await cloudinary.v2.uploader.destroy(prvImgId));

          const updatedUserInfo = await models.DB_People.findOneAndUpdate(
            { _id: req.userId },
            updatedUser,
            {
              new: true,
            }
          );
          return updatedUserInfo;
        }
      } catch (err) {
        console.log(err);
        return GraphQLError(`${err.message}`);
      }
    },
    updateUserRole: async (parent, args, context) => {
      if (!context.req.isAuth) {
        throw new AuthenticationError("Unauthenticated!");
      }
      const updatedUserRole = new models.DB_People({
        _id: args.id,
        role: args.input.role,
      });

      return await models.DB_People.findOneAndUpdate(
        { _id: args.id },
        updatedUserRole,
        {
          new: true,
        }
      );
    },
    deleteUser: async (parent, args, { req, res }) => {
      if (!req.isAuth || !req.userId || req.userRole !== "Admin") {
        throw new AuthenticationError("Unauthenticated!");
      }

      return await models.DB_People.findByIdAndDelete(args.id);
    },

    removeDevice: async (parent, args, { req, res }) => {
      try {
        const matchedUser = await models.DB_People.findOne({
          _id: args.userId,
        });
        if (!matchedUser) {
          throw new Error("❌ User not found!");
        }

        const deviceInfo = {
          userIP: req.userIP,
          onMobile: args?.onMobile,
          userPlatform: args?.userPlatform,
          userAgent: args?.userAgent,
          userBrowser: args?.userBrowser,
          ipCity: req.userCity,
          ipCountry: req.userCounty,
        };

        await models.DB_People.updateOne(
          { _id: matchedUser.id },
          { $pull: { devices: deviceInfo } }
        );

        return "Device removed successfully!";
      } catch (err) {
        console.log("❌ Failed to login user: \n", err);
        throw new Error(err.message);
      }
    },
  },
};

module.exports = userResolvers;
