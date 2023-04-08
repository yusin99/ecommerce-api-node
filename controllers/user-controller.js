const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwt-token");

const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    //Create a new User
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    // User with that email alredy exists
    throw new Error("User with that email already exists");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // checking if user exists
  const findUser = await User.findOne({ email: email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    res.json({
      id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error(
      "Invalid username or password. Please verify your credeltials"
    );
  }
});
const updateSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try{
    const updateUser = await User.findByIdAndUpdate(id, {
      firstname: req.body?.firstname,
      lastname: req.body?.lastname,
      mobile: req.body?.mobile,
      email: req.body?.email,
    }, {new: true});
    res.json(updateUser)
  }catch(error){
    throw new Error(error)
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

const getSingleUsers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getUsers = await User.findById(id);
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json(deleteUser);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getSingleUsers,
  deleteSingleUser,
  updateSingleUser
};
