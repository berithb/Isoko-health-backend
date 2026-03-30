"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectAlerts = exports.fetchVitals = exports.submitVitals = void 0;
const HealthRecord_1 = require("../models/HealthRecord");
const submitVitals = async (payload) => {
    const record = await HealthRecord_1.HealthRecord.create(payload);
    return record;
};
exports.submitVitals = submitVitals;
const fetchVitals = async (userId) => HealthRecord_1.HealthRecord.find({ userId }).sort({ createdAt: -1 });
exports.fetchVitals = fetchVitals;
const detectAlerts = (record) => {
    const alerts = [];
    if (record.bloodPressure) {
        const [systolicStr, diastolicStr] = record.bloodPressure.split('/').map(Number);
        if (systolicStr > 140 || diastolicStr > 90)
            alerts.push('High blood pressure');
    }
    if (record.glucose && record.glucose > 180)
        alerts.push('High glucose');
    if (record.temperature && record.temperature > 38)
        alerts.push('Fever detected');
    return alerts;
};
exports.detectAlerts = detectAlerts;
