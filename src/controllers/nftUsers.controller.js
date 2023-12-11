const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { nftUserService } = require('../services');
const { sendResponse } = require('../utils/responseHandler');

const addUser = catchAsync(async (req, res) => {
  const reqData = await pick(req.body, [
    'name',
    'address1',
    'address2',
    'email',
    'coverLogo',
    'role',
    'username',
    'password',
    'country',
    'phoneNumber',
    'primaryCommission',
    'secondaryRoyalty',
    'coverImage',
    'bio',
    'wallet',
    'orgId', 
    'coverBgColor',
    'pageBgColor',
    'coverDescBgColor',
    'pageDescFontColor',
    'city',
    'state',
    'postalCode'
  ]);
  // const reqData = {};
  const insertResult = await nftUserService.addUser(reqData);
  const { username, email, password } = reqData;
  // await handlePostSignup(username, password, email);
  // await handlePostSignup(insertResult, email);
  if (insertResult) {
    sendResponse(res, httpStatus.OK, insertResult, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Cannot Add User');
  }
});

const listUsers = catchAsync(async (req, res) => {
 

  let options = req.body.options
  let filter = req.body.filter
  
  var result1 ={}
  if(filter.name) {
    let searchRegex = new RegExp(`.*${filter.name}.*`, "i")
    console.log("searcgh regex---", searchRegex);
    result1 = {
      name:{ $regex:searchRegex},
      role: 'brand',
      active:true

    };
  }
  else{
    result1 = {
      ...filter,
      role: 'brand',
      active:true
    };
  } 
  console.log("result1---", result1);

  const result = await Brand.paginate(result1, options); //.exec()
  // console.log(result.page);
  try {
    if (result) {
      sendResponse(res, httpStatus.OK, result, null);
    }
  } catch (error) {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'cannot getting user');
    console.log(error);
  }
});


const deleteUser = catchAsync(async (req, res) => {
  const { userId } = await pick(req.body, ['userId']);
  const updateResult = await nftUserService.deleteUser(userId);
  if (updateResult) {
    sendResponse(res, httpStatus.OK, 'User Deleted Successfully', null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Failed to delete user');
  }
});

const updateUser = catchAsync(async (req, res) => {
  const reqBody = req.body;
  const { id } = req.params;
  const updateResult = await nftUserService.updateUser(reqBody, id);
  if (updateResult) {
    sendResponse(res, httpStatus.OK, updateResult, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Username already taken');
  }
});

module.exports = {
  addUser,
  listUsers,
  deleteUser,
  updateUser,
};
