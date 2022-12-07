const router = require("express").Router();
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const multer = require("multer");

const {
  registerValidation,
  loginValidation,
} = require("../middleware/validation");

router.post("/register", async (req, res) => {
  console.log(req.body);
  //Validating data
  const { error } = registerValidation(req.body);
  if (error)
    return res
      .status(200)
      .json({ status: "not ok", message: error.details[0].message });

  //Checking if the user is already registered
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res
      .status(200)
      .json({ status: "not ok", message: "Email Already Registered" });

  //Hashing the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  req.body.password = hashedPassword;
  //Creating new user
  const user = new User(req.body);
  try {
    const savedUser = await user.save();
    res.status(200).json({
      status: "ok",
      message: "Succesfully registered",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "not ok", message: "Something Went Wrong! Try again" });
  }
});
//LOGIN
router.post("/login", multer().none(), async (req, res) => {
  try {
    //Validating data
    const { error } = loginValidation(req.body);
    if (error)
      return res
        .status(200)
        .json({ status: "not ok", message: error.details[0].message });

    //Checking if the email exists
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.json({
        status: "not ok",
        auth: false,
        message: "No email found",
      });

    //Checking if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      return res.json({
        status: "not ok",
        auth: false,
        message: "Password is wrong",
      });
    }

    const result = user;
    result.password = "Not so fast";

    res.json({
      result: result,
      status: "ok",
      message: "LoggedIn Successfully",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
