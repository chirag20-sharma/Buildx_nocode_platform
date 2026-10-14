import mongoose from 'mongoose';
import { respond } from '../utils/respond.js';

export const validateObjectId = (req, res, next) => {
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id))
        return respond(res, "Invalid ID format.", 400, false);
    next();
};
