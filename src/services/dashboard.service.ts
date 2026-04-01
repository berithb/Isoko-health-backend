import { Types } from 'mongoose';
import { Appointment } from '../models/Appointment';
import { DiagnosticTest } from '../models/DiagnosticTest';
import { Doctor } from '../models/Doctor';
import { Subscription } from '../models/Subscription';
import { User, UserRole } from '../models/User';

const normalizeId = (id?: string) => {
  if (!id) return undefined;
  try {
    return new Types.ObjectId(id);
  } catch {
    return undefined;
  }
};

export type DashboardUser = { id: string; role: UserRole };

export const getDashboardData = async (user: DashboardUser) => {
  const now = new Date();
  const isPatient = user.role === 'patient' || user.role === 'caregiver';
  const isDoctor = user.role === 'doctor';

  const appointmentFilter: Record<string, unknown> = {};
  const patientId = isPatient ? normalizeId(user.id) : undefined;
  if (isDoctor) {
    const doctorUserId = normalizeId(user.id);
    const doctor = await Doctor.findOne({ userId: doctorUserId });
    if (doctor) {
      appointmentFilter.doctorId = doctor._id;
    }
  }
  if (patientId) appointmentFilter.patientId = patientId;

  const diagnosticFilter: Record<string, unknown> = {};
  const diagnosticUserId = isPatient ? normalizeId(user.id) : undefined;
  if (diagnosticUserId) diagnosticFilter.userId = diagnosticUserId;

  const [userGroups, appointmentGroups, diagnosticGroups, subscriptionGroups, upcomingAppointments, recentDiagnostics] =
    await Promise.all([
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
      Appointment.aggregate([
        { $match: appointmentFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      DiagnosticTest.aggregate([
        { $match: diagnosticFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Subscription.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Appointment.find({
        ...appointmentFilter,
        date: { $gte: now },
      })
        .sort({ date: 1 })
        .limit(5),
      DiagnosticTest.find(diagnosticFilter).sort({ createdAt: -1 }).limit(5),
    ]);

  const toMap = (rows: { _id: string; count: number }[]) =>
    rows.reduce<Record<string, number>>((acc, row) => ({ ...acc, [row._id]: row.count }), {});

  const users = toMap(userGroups as any);
  const appointments = toMap(appointmentGroups as any);
  const diagnostics = toMap(diagnosticGroups as any);
  const subscriptions = toMap(subscriptionGroups as any);

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
