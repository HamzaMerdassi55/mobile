const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      "." +
      file.originalname.split(".").pop();
    const originalName = file.originalname.split(".").slice(0, -1).join(".");
    const newFileName = originalName + "-" + uniqueSuffix;
    file.originalname = `${req.protocol}://${req.get("host")}/${newFileName}`;
    cb(null, newFileName);
    req;
  },
});

const upload = multer({ storage: storage });

exports.uploadFileHandler = (uploadMode, fieldName) => {
  if (uploadMode == "single") {
    return upload.single(fieldName);
  } else if (uploadMode == "multiple") {
    return upload.array(fieldName, 5);
  }
};
