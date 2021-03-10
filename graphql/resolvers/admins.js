const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../../config");
const Admin = require("../../models/Admin");
const User = require("../../models/User");
const { UserInputError } = require("apollo-server");
const { validateRegisterInput } = require("../../utils/validators");
const { validateLoginInput } = require("../../utils/validators");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Mutation: {
    async admin_login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await Admin.findOne({ username });

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    async admin_register(
      _,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info
    ) {
      // Validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      //Make sure user doesn't not exist
      const user = await Admin.findOne({ username });
      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "this Username is taken",
          },
        });
      }
      //Unique user
      password = await bcrypt.hash(password, 12);

      const newAdmin = new Admin({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newAdmin.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
