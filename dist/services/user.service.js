"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.listUsers = exports.updateProfile = exports.getProfile = void 0;
const apiError_1 = require("../utils/apiError");
const User_1 = require("../models/User");
const getProfile = async (id) => User_1.User.findById(id).select('-password');
exports.getProfile = getProfile;
const updateProfile = async (id, payload) => {
    const user = await User_1.User.findById(id);
    if (!user)
        throw new apiError_1.ApiError(404, 'User not found');
    if (payload.name)
        user.name = payload.name;
    await user.save();
    return user;
};
exports.updateProfile = updateProfile;
const listUsers = async () => User_1.User.find().select('-password');
exports.listUsers = listUsers;
const deleteUser = async (id) => User_1.User.findByIdAndDelete(id);
exports.deleteUser = deleteUser;
