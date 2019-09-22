import mongoose from 'mongoose';

export type PossibleDocumentOrObjectID = {} | string | mongoose.Types.ObjectId;
