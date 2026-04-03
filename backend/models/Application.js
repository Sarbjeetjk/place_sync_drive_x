import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['applied', 'shortlisted', 'interview', 'rejected'], default: 'applied' },
  matchScore: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Application', applicationSchema);
