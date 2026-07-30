import { Schema, model, Document, Types } from 'mongoose';
import { REPORT_STATUSES, ReportStatus } from '../../config/constants';

export interface IReport extends Document {
  _id: Types.ObjectId;
  reporter_id: Types.ObjectId;
  reported_user_id: Types.ObjectId;
  related_ride_id?: Types.ObjectId;
  reason: string;
  description?: string;
  status: ReportStatus;
  resolved_by?: Types.ObjectId;
  created_at: Date;
  resolved_at?: Date;
}

const reportSchema = new Schema<IReport>(
  {
    reporter_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reported_user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    related_ride_id: { type: Schema.Types.ObjectId, ref: 'Ride' },
    reason: { type: String, required: true },
    description: String,
    status: { type: String, enum: REPORT_STATUSES, default: 'open' },
    resolved_by: { type: Schema.Types.ObjectId, ref: 'User' },
    resolved_at: Date,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } },
);

export const ReportModel = model<IReport>('Report', reportSchema);
