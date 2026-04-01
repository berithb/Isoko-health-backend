"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDoctor = exports.createDoctor = exports.getDoctorById = exports.listDoctors = void 0;
const User_1 = require("../models/User");
const Doctor_1 = require("../models/Doctor");
const apiError_1 = require("../utils/apiError");
const mongoose_1 = require("mongoose");
const mapToProfile = (doc) => ({
    id: doc._id.toString(),
    name: doc.userId.name,
    email: doc.userId.email,
    specialty: doc.specialty,
    bio: doc.bio,
    rating: doc.rating,
    reviewsCount: doc.reviewsCount,
    price: doc.consultationFee,
    modes: doc.consultationModes,
    languages: doc.languages,
    experienceYears: doc.experienceYears,
    nextAvailable: doc.nextAvailable || doc.availabilityStatus,
});
const fallbackDoctors = [
    {
        id: 'seed-1',
        name: 'Dr. Aline Uwase',
        specialty: 'Cardiology',
        rating: 4.9,
        reviewsCount: 128,
        price: '15,000 RWF',
        modes: ['video', 'chat'],
        languages: ['Kinyarwanda', 'English'],
        experienceYears: 8,
        nextAvailable: 'Today 5:00 PM',
        bio: 'Specialist in heart health with a focus on prevention and lifestyle coaching.',
    },
    {
        id: 'seed-2',
        name: 'Dr. Diane Mukamana',
        specialty: 'General Medicine',
        rating: 4.8,
        reviewsCount: 96,
        price: '12,000 RWF',
        modes: ['chat', 'video'],
        languages: ['Kinyarwanda', 'French'],
        experienceYears: 6,
        nextAvailable: 'Today 3:30 PM',
        bio: 'General practitioner experienced with remote care and family medicine.',
    },
    {
        id: 'seed-3',
        name: 'Dr. Eric Ndayisenga',
        specialty: 'Pediatrics',
        rating: 4.7,
        reviewsCount: 74,
        price: '10,000 RWF',
        modes: ['video'],
        languages: ['English', 'French'],
        experienceYears: 7,
        nextAvailable: 'Tomorrow 10:00 AM',
        bio: 'Pediatrician focused on preventive care and early childhood wellness.',
    },
    {
        id: 'seed-4',
        name: 'Dr. Habimana Jean',
        specialty: 'Dermatology',
        rating: 4.8,
        reviewsCount: 110,
        price: '13,000 RWF',
        modes: ['video', 'chat'],
        languages: ['Kinyarwanda', 'English'],
        experienceYears: 9,
        nextAvailable: 'Tomorrow 11:00 AM',
        bio: 'Dermatologist helping patients manage skin conditions remotely.',
    },
    {
        id: 'seed-5',
        name: 'Dr. Ingabire Claire',
        specialty: 'Neurology',
        rating: 4.6,
        reviewsCount: 70,
        price: '16,000 RWF',
        modes: ['video'],
        languages: ['English', 'French'],
        experienceYears: 10,
        nextAvailable: 'Tomorrow 4:00 PM',
        bio: 'Neurologist specializing in headaches and sleep disorders.',
    },
    {
        id: 'seed-6',
        name: 'Dr. Nzeyimana David',
        specialty: 'Orthopedics',
        rating: 4.8,
        reviewsCount: 88,
        price: '14,000 RWF',
        modes: ['chat', 'video'],
        languages: ['Kinyarwanda', 'English'],
        experienceYears: 11,
        nextAvailable: 'Today 6:30 PM',
        bio: 'Orthopedic doctor with expertise in injury prevention and recovery.',
    },
];
const listDoctors = async () => {
    return fallbackDoctors;
};
exports.listDoctors = listDoctors;
const getDoctorById = async (id) => {
    if (!id)
        return null;
    const doctor = fallbackDoctors.find((doctor) => doctor.id === id);
    if (doctor) {
        return doctor;
    }
    return null;
};
exports.getDoctorById = getDoctorById;
const createDoctor = async (userId, profile) => {
    const user = await User_1.User.findById(userId);
    if (!user || user.role !== 'doctor') {
        throw new apiError_1.ApiError(400, 'User must have doctor role');
    }
    const doctorData = {
        userId: new mongoose_1.Types.ObjectId(userId),
        ...profile,
    };
    const doctor = await Doctor_1.Doctor.create(doctorData);
    await doctor.populate('userId', 'name email');
    return mapToProfile(doctor.toObject());
};
exports.createDoctor = createDoctor;
const updateDoctor = async (id, updates) => {
    const doctor = await Doctor_1.Doctor.findByIdAndUpdate(id, updates, { new: true });
    if (!doctor) {
        throw new apiError_1.ApiError(404, 'Doctor not found');
    }
    await doctor.populate('userId', 'name email');
    return mapToProfile(doctor.toObject());
};
exports.updateDoctor = updateDoctor;
