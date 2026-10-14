import mongoose from 'mongoose';

const VisitSchema = new mongoose.Schema({
    slug:     { type: String, required: true, index: true },
    day:      { type: String, required: true, index: true }, // YYYY-MM-DD
    path:     { type: String, default: '/' },
    referrer: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Visit', VisitSchema);
