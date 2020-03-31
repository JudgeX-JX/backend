import mongoose from 'mongoose';

export default function (
  document: mongoose.Model<mongoose.Document>,
  id: string,
): string {
  return `No ${document.modelName.toUpperCase()} with id ${id}`;
}
