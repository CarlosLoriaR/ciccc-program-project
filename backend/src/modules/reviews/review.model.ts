import { Schema, model, Document, Types } from 'mongoose';

export interface IReview extends Document {
  _id: Types.ObjectId;
  reviewer_id: Types.ObjectId;
  reviewee_id: Types.ObjectId;
  ride_id: Types.ObjectId;
  rating: number;
  comment?: string;
  created_at: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    reviewer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reviewee_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    ride_id: { type: Schema.Types.ObjectId, ref: 'Ride', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } },
);

reviewSchema.index({ reviewer_id: 1, reviewee_id: 1, ride_id: 1 }, { unique: true });

export const ReviewModel = model<IReview>('Review', reviewSchema);
