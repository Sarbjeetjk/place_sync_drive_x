import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skills: [{ type: String }],
  bio: { type: String },
  education: { type: String },
}, { timestamps: true });

export default mongoose.model('StudentProfile', studentProfileSchema);
