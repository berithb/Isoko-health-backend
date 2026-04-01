"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubscription = exports.updateSubscription = exports.getSubscriptionById = exports.listSubscriptions = exports.createSubscription = void 0;
const apiError_1 = require("../utils/apiError");
const Subscription_1 = require("../models/Subscription");
const createSubscription = async (payload) => Subscription_1.Subscription.create(payload);
exports.createSubscription = createSubscription;
const listSubscriptions = async (filter = {}) => Subscription_1.Subscription.find(filter);
exports.listSubscriptions = listSubscriptions;
const getSubscriptionById = async (id) => {
    const subscription = await Subscription_1.Subscription.findById(id);
    if (!subscription)
        throw new apiError_1.ApiError(404, 'Subscription not found');
    return subscription;
};
exports.getSubscriptionById = getSubscriptionById;
const updateSubscription = async (id, payload) => {
    const subscription = await Subscription_1.Subscription.findByIdAndUpdate(id, payload, { new: true });
    if (!subscription)
        throw new apiError_1.ApiError(404, 'Subscription not found');
    return subscription;
};
exports.updateSubscription = updateSubscription;
const deleteSubscription = async (id) => {
    const subscription = await Subscription_1.Subscription.findByIdAndDelete(id);
    if (!subscription)
        throw new apiError_1.ApiError(404, 'Subscription not found');
    return subscription;
};
exports.deleteSubscription = deleteSubscription;
