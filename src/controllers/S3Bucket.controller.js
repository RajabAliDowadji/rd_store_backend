const S3BucketModal = require("../models/S3Bucket.modal");
const { BUCKET_API, COMMON } = require("../constants/S3Bucket.message");
const { fileDelete } = require("../middlewares/fileUpload");
const { STATUS } = require("../constants/Constants");
const { apiResponse } = require("../helpers/apiResponse");
const { errorResponse } = require("../helpers/errorResponse");

module.exports.addBucketImage = async (req, resp, next) => {
  const { size, location, key } = req.file;
  const s3bucketmodal = new S3BucketModal({
    file_name: key,
    file_size: size,
    file_key: key,
    file_url: location,
  });
  await s3bucketmodal.save();
  return resp
    .status(STATUS.CREATED)
    .send(
      apiResponse(
        STATUS.CREATED,
        BUCKET_API.BUCKET_CREATE.message,
        s3bucketmodal
      )
    );
};

module.exports.deleteBucketImage = async (req, resp, next) => {
  const imageId = req.params.id;
  const image = await S3BucketModal.findOne({ _id: imageId });
  if (image) {
    await fileDelete(image.file_key);
    await S3BucketModal.findByIdAndRemove({ _id: imageId });
    return resp
      .status(STATUS.SUCCESS)
      .send(apiResponse(STATUS.SUCCESS, BUCKET_API.BUCKET_DELETE.message));
  } else {
    return resp
      .status(STATUS.CREATED)
      .send(apiResponse(STATUS.CREATED, BUCKET_API.BUCKET_INVALID_ID.message));
  }
};
