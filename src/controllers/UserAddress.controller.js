const UserAddressModal = require("../models/UserAddress.modal");
const { USER_ADD_API } = require("../constants/User.message");
const { STATUS, COMMON_ERROR } = require("../constants/Constants");
const { apiResponse } = require("../helpers/apiResponse");
const { errorResponse } = require("../helpers/errorResponse");

module.exports.getAddresses = async (req, resp, next) => {
  const { user_id } = req;
  const userAddresses = await UserAddressModal.findOne({
    user_id: user_id,
  }).populate({
    path: "user_address",
    populate: [
      {
        path: "place_id",
      },
    ],
  });
  if (userAddresses) {
    return resp
      .status(STATUS.SUCCESS)
      .send(
        apiResponse(
          STATUS.SUCCESS,
          USER_ADD_API.USER_ADD_SUCCESS.message,
          userAddresses
        )
      );
  } else {
    return resp
      .status(STATUS.INTERNAL_SERVER)
      .send(
        errorResponse(STATUS.INTERNAL_SERVER, COMMON_ERROR.SERVER_ERROR.message)
      );
  }
};

module.exports.addUserAddress = async (req, resp, next) => {
  const { user_id } = req;
  const { address_line1, address_line2, address_type, place_id } = req.body;

  const UserAddress = await UserAddressModal.findOne({
    user_id: user_id,
    user_address: {
      $elemMatch: {
        address_type: address_type,
      },
    },
  });
  if (!UserAddress) {
    const updateUserAddress = await UserAddressModal.findOne({
      user_id: user_id,
    });
    if (updateUserAddress) {
      updateUserAddress.user_id = user_id;
      updateUserAddress.user_address = [
        ...updateUserAddress.user_address,
        {
          address_line1: address_line1,
          address_line2: address_line2,
          address_type: address_type,
          place_id: place_id,
        },
      ];

      await updateUserAddress.save();

      return resp
        .status(STATUS.SUCCESS)
        .send(
          apiResponse(
            STATUS.SUCCESS,
            USER_ADD_API.USER_ADD_UPDATE.message,
            updateUserAddress
          )
        );
    } else {
      const userAddress = new UserAddressModal({
        user_id: user_id,
        user_address: [
          {
            address_line1: address_line1,
            address_line2: address_line2,
            address_type: address_type,
            place_id: place_id,
          },
        ],
      });

      await userAddress.save();

      return resp
        .status(STATUS.CREATED)
        .send(
          apiResponse(
            STATUS.CREATED,
            USER_ADD_API.USER_ADD_CREATE.message,
            userAddress
          )
        );
    }
  } else {
    return resp
      .status(STATUS.BAD)
      .send(
        errorResponse(
          STATUS.BAD,
          USER_ADD_API.USER_ADD_ALREADY_REGISTER.message
        )
      );
  }
};

module.exports.deleteUserAddress = async (req, resp, next) => {
  const { user_id } = req;
  const address_id = req.params.id;
  const userAddresses = await UserAddressModal.findOne({
    user_id: user_id,
  });
  if (userAddresses) {
    await UserAddressModal.updateOne(
      { user_id: user_id },
      { $pull: { user_address: { _id: address_id } } }
    );
    return resp
      .status(STATUS.SUCCESS)
      .send(apiResponse(STATUS.SUCCESS, USER_ADD_API.USER_ADD_DELETE.message));
  } else {
    return resp
      .status(STATUS.INTERNAL_SERVER)
      .send(
        errorResponse(STATUS.INTERNAL_SERVER, COMMON_ERROR.SERVER_ERROR.message)
      );
  }
};
