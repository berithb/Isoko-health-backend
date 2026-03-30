"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRole = exports.getAnalytics = exports.manageSubscription = void 0;
const User_1 = require("../models/User");
const Subscription_1 = require("../models/Subscription");
const apiError_1 = require("../utils/apiError");
const manageSubscription = async (userId, plan, status) => Subscription_1.Subscription.findOneAndUpdate({ userId }, { plan, status }, { upsert: true, new: true });
exports.manageSubscription = manageSubscription;
const getAnalytics = async () => {
    const totalUsers = await User_1.User.countDocuments();
    const activeSubs = await Subscription_1.Subscription.countDocuments({ status: 'active' });
    return { totalUsers, activeSubs };
};
exports.getAnalytics = getAnalytics;
const updateUserRole = async (userId, role) => {
    const user = await User_1.User.findById(userId);
    if (!user)
        throw new apiError_1.ApiError(404, 'User not found');
    user.role = role;
    await user.save();
    return user;
};
exports.updateUserRole = updateUserRole;
