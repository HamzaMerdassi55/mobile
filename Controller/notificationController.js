const User = require(`${__dirname}/../Models/userModel`);
const Notification = require(`${__dirname}/../Models/notificationModel`);
const responseHandler = (res, status, message, data) => {
  return res.status(status).json({ message, data });
};

exports.getAll = async (req, res, next) => {
  const data = await Notification.find({
    receivers: { $in: [req.user._id] },
  }).sort({
    createdAt: "desc",
  });
  if (data.length == 0) {
    return responseHandler(
      res,
      401,
      "No notifications found for this user",
      null
    );
  }
  responseHandler(res, 200, "success", data);
};
exports.getMyNotifications = async (req, res, next) => {
  let data = await Notification.find({ sender: req.user._id });

  if (!data) {
    return responseHandler(
      res,
      404,
      "No Notification was founded if you want to create on press the button below"
    );
  }
  responseHandler(res, 200, "success", data);
};
exports.getOne = async (req, res, next) => {
  const data = await Notification.findOne({ _id: req.params.id });

  if (!data) {
    return responseHandler(
      res,
      404,
      "Sorry, We could not find any Notification with that ID"
    );
  }
  responseHandler(res, 200, "success", data);
};

exports.createOne = async (req, res, next) => {
  let data = { ...req.body };
  const images = [];
  let targetUsers = [];
  const queryParamsObject = req.query;

  if (Object.keys(queryParamsObject).length) {
    for (const property in queryParamsObject) {
      if (queryParamsObject[property] != "") {
        const users = await User.find(
          { [property]: queryParamsObject[property] },
          { _id: 1 }
        );
        for (const user of users) {
          targetUsers.push(user._id);
        }
      }
    }
  }

  data.receivers = JSON.parse(req.body.receivers);
  for (const item of data.receivers) {
    const user = await User.find({ cin: item }, { _id: 1 });
    targetUsers.push(user[0]._id);
  }
  targetUsers = targetUsers.filter(
    (obj, index, self) =>
      index === self.findIndex((t) => t.toString() === obj.toString())
  );

  for (const image of req.files) {
    images.push(image.originalname);
  }

  data.sender = req.user._id;
  data.receivers = targetUsers;
  data.images = images;

  try {
    data = await Notification.create(data);
  } catch (err) {
    return responseHandler(res, 400, err.message);
  }

  responseHandler(res, 200, "success", data);
};

exports.updateOne = async (req, res, next) => {
  const doc = await Notification.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
      runValidator: true,
    }
  );
  if (!doc) {
    return responseHandler(
      res,
      404,
      "Sorry, We could not find any Notification with that ID"
    );
  }
  responseHandler(res, 400, "success", doc);
};

exports.deleteOne = async (req, res, next) => {
  const doc = await Notification.findByIdAndDelete(req.params.id);
  if (!doc) {
    return responseHandler(
      res,
      404,
      "Sorry, We could not find any Notification with that ID"
    );
  }
  responseHandler(res, 400, "success", null);
};
