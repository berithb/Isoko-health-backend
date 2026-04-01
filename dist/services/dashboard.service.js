"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardData = void 0;
const mongoose_1 = require("mongoose");
const Appointment_1 = require("../models/Appointment");
const DiagnosticTest_1 = require("../models/DiagnosticTest");
const Doctor_1 = require("../models/Doctor");
const Subscription_1 = require("../models/Subscription");
const User_1 = require("../models/User");
const normalizeId = (id) => {
    if (!id)
        return undefined;
    try {
        return new mongoose_1.Types.ObjectId(id);
    }
    catch {
        return undefined;
    }
};
const getDashboardData = async (user) => {
    const now = new Date();
    const isPatient = user.role === 'patient' || user.role === 'caregiver';
    const isDoctor = user.role === 'doctor';
    const appointmentFilter = {};
    const patientId = isPatient ? normalizeId(user.id) : undefined;
    if (isDoctor) {
        const doctorUserId = normalizeId(user.id);
        const doctor = await Doctor_1.Doctor.findOne({ userId: doctorUserId });
        if (doctor) {
            appointmentFilter.doctorId = doctor._id;
        }
    }
    if (patientId)
        appointmentFilter.patientId = patientId;
    const diagnosticFilter = {};
    const diagnosticUserId = isPatient ? normalizeId(user.id) : undefined;
    if (diagnosticUserId)
        diagnosticFilter.userId = diagnosticUserId;
    const [userGroups, appointmentGroups, diagnosticGroups, subscriptionGroups, upcomingAppointments, recentDiagnostics] = await Promise.all([
        User_1.User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
        Appointment_1.Appointment.aggregate([
            { $match: appointmentFilter },
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
        DiagnosticTest_1.DiagnosticTest.aggregate([
            { $match: diagnosticFilter },
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
        Subscription_1.Subscription.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        Appointment_1.Appointment.find({
            ...appointmentFilter,
            date: { $gte: now },
        })
            .sort({ date: 1 })
            .limit(5),
        DiagnosticTest_1.DiagnosticTest.find(diagnosticFilter).sort({ createdAt: -1 }).limit(5),
    ]);
    const toMap = (rows) => rows.reduce((acc, row) => ({ ...acc, [row._id]: row.count }), {});
    const users = toMap(userGroups);
    const appointments = toMap(appointmentGroups);
    const diagnostics = toMap(diagnosticGroups);
    const subscriptions = toMap(subscriptionGroups);
    return {
        navigation: ['Home', 'Consultation', 'Diagnostics', 'IoT Monitor', 'AI Assistant', 'Pricing'],
        user: { id: user.id, role: user.role },
        summary: {
            users: { total: Object.values(users).reduce((t, n) => t + n, 0), byRole: users },
            appointments: {
                total: Object.values(appointments).reduce((t, n) => t + n, 0),
                pending: appointments.pending ?? 0,
                completed: appointments.completed ?? 0,
                cancelled: appointments.cancelled ?? 0,
                upcoming: upcomingAppointments.length,
            },
            diagnostics: {
                total: Object.values(diagnostics).reduce((t, n) => t + n, 0),
                requested: diagnostics.requested ?? 0,
                inProgress: diagnostics['in-progress'] ?? diagnostics.inProgress ?? 0,
                completed: diagnostics.completed ?? 0,
            },
            subscriptions: {
                active: subscriptions.active ?? 0,
                inactive: subscriptions.inactive ?? 0,
                cancelled: subscriptions.cancelled ?? 0,
            },
        },
        consultation: {
            upcoming: upcomingAppointments.map((appt) => ({
                id: appt.id,
                patientId: appt.patientId,
                doctorId: appt.doctorId,
                date: appt.date,
                status: appt.status,
            })),
        },
        diagnostics: {
            recent: recentDiagnostics.map((test) => ({
                id: test.id,
                userId: test.userId,
                type: test.type,
                status: test.status,
                createdAt: test.createdAt,
            })),
        },
        aiAssistant: {
            quickActions: [
                'Summarize latest diagnostics',
                'Draft follow-up message',
                'Explain upcoming appointment schedule',
            ],
        },
        pricing: {
            suggestedPlans: [
                { name: 'Starter', price: '$19/mo', audience: 'Individual patients' },
                { name: 'Pro', price: '$49/mo', audience: 'Clinics and doctors' },
                { name: 'Enterprise', price: 'Talk to sales', audience: 'Hospitals' },
            ],
        },
    };
};
exports.getDashboardData = getDashboardData;
