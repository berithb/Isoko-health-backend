import { User } from '../models/User';

export type DoctorProfile = {
  id: string;
  name: string;
  email?: string;
  specialty?: string;
  bio?: string;
  rating?: number;
  reviewsCount?: number;
  price?: string;
  modes?: Array<'chat' | 'video'>;
  languages?: string[];
  experienceYears?: number;
  nextAvailable?: string;
};

const fallbackDoctors: DoctorProfile[] = [
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

export const listDoctors = async (): Promise<DoctorProfile[]> => {
  const doctors = await User.find({ role: 'doctor' }).select('name email createdAt');

  if (!doctors.length) {
    return fallbackDoctors;
  }

  return doctors.map((doctor, index) => ({
    id: doctor.id,
    name: doctor.name,
    email: doctor.email,
    specialty: 'General Medicine',
    rating: 4.7,
    reviewsCount: 50 + index * 7,
    price: '12,000 RWF',
    modes: ['video', 'chat'],
    languages: ['Kinyarwanda', 'English'],
    experienceYears: 5 + index,
    nextAvailable: 'Today',
    bio: 'Licensed medical doctor available for virtual consultations.',
  }));
};

export const getDoctorById = async (id: string): Promise<DoctorProfile | null> => {
  if (!id) return null;

  const seeded = fallbackDoctors.find((doctor) => doctor.id === id);
  if (seeded) {
    return seeded;
  }

  const doctor = await User.findById(id).select('name email createdAt role');
  if (!doctor || doctor.role !== 'doctor') {
    return null;
  }

  return {
    id: doctor.id,
    name: doctor.name,
    email: doctor.email,
    specialty: 'General Medicine',
    rating: 4.7,
    reviewsCount: 52,
    price: '12,000 RWF',
    modes: ['video', 'chat'],
    languages: ['Kinyarwanda', 'English'],
    experienceYears: 6,
    nextAvailable: 'Today',
    bio: 'Doctor available for teleconsultation.',
  };
};
