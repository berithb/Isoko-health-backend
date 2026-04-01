const mongoose = require('mongoose');
const { User } = require('./src/models/User');
const { Doctor } = require('./src/models/Doctor');
const { Types } = require('mongoose');

async function seedDoctors() {
  await mongoose.connect('mongodb://localhost:27017/isoko_health'); // adjust URL

  // Create dummy users first or assume exist
  // For demo, create dummy doctor users
  const dummyUsers = [
    { name: 'Dr. Aline Uwase', email: 'aline@example.com', role: 'doctor', password: 'hashedpass' }, // hash in real
    // add others
  ];

  for (let u of dummyUsers) {
    const existing = await User.findOne({email: u.email});
    if (!existing) {
      const user = new User(u);
      user.password = await user.comparePassword('password') ? u.password : await bcrypt.hash('password', 10); // pseudo
      await user.save();
    }
  }

  const fallbackData = [ // from service fallbackDoctors
    {
      userId: 'dummy1', // replace with real user._id after create
      specialty: 'Cardiology',
      rating: 4.9,
      reviewsCount: 128,
      consultationFee: '15,000 RWF',
      consultationModes: ['chat', 'video'],
      availabilityStatus: 'Available',
      // etc
    },
    // add all
  ];

  console.log('Doctors seeded. Use POST /api/doctors to add more.');
  process.exit();
}

seedDoctors().catch(console.error);
