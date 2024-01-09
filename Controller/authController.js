const User = require(`${__dirname}/../Models/userModel`);
const jwt = require("jsonwebtoken");
const AppError = require(`${__dirname}/../utils/appError`);
const { promisify } = require("util");

const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};
exports.registerUser = async (req, res, next) => {
  const userData = { ...req.body };
  //data Sanitization
  let user = {
    nom: userData.nom,
    prenom: userData.prenom,
    email: userData.email,
    cin: userData.cin,
    departement: userData.departement,
    niveau: userData.niveau,
    groupe: userData.groupe,
    telephone: userData.telephone,
  };
  try {
    user = await User.create(user);
  } catch (err) {
    return res.status(400).json({
      status: 400,
      message: err.message,
    });
  }

  return res.status(201).json({
    status: "success",
    message: "Account created with success",
  });
};

exports.userLogin = async (req, res, next) => {
  const userData = { ...req.body };
  let user;
  if (!userData.cin || !userData.password) {
    return res.status(400).json({
      status: 400,
      message: "Incorrect cin or password",
    });
  }
  try {
    user = await User.findOne({
      cin: req.body.cin,
    });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
  if (!user) {
    return next(
      new AppError("Sorry you are not registered! Please sign up first", 400)
    );
  }
  return res.status(200).json({
    status: "success",
    token: generateToken(user._id),
    data: {
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      departement: user.departement,
      niveau: user.niveau,
      group: user.group,
      telephone: user.telephone,
    },
  });
};
exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError(
        "Access denied, You are not logged in! Please log in to get access.",
        401
      )
    );
  }
  let decodedPayload;
  try {
    decodedPayload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError("Invalid access please log in again.", 401));
  }
  const user = await User.findOne({ _id: decodedPayload._id });
  if (!user) {
    return next(
      new AppError("The user belonging to this token does no longer exist.")
    );
  }
  req.user = user;
  next();
};

exports.restrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "Access was denied, You do not have permission to perform this action",
          401
        )
      );
    }
    next();
  };
};
