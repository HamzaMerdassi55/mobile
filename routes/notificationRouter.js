const exp = require("express");
const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
  getMyNotifications,
} = require(`${__dirname}/../Controller/notificationController`);
const {
  protect,
  restrictedTo,
} = require(`${__dirname}/../Controller/authController`);
const { uploadFileHandler } = require(`${__dirname}/../utils/uploadImg`);
const router = exp.Router();

router.use(protect);
router.route("/myNotifications").get(getMyNotifications);
router.route("/:id").get(getOne).patch(updateOne).delete(deleteOne);
router.use(restrictedTo("admin"));
router
  .route("/")
  .get(getAll)
  .post(uploadFileHandler("multiple", "images"), createOne);
module.exports = router;
