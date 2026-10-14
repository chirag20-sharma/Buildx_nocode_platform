import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    name:      { type: String, maxlength: 200, default: '' },
    email:     { type: String, maxlength: 200, default: '' },
    message:   { type: String, maxlength: 2000, default: '' },
    data:      { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

export default mongoose.model('Submission', SubmissionSchema);
