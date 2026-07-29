import { Schema, model, Document, Types } from 'mongoose';
import { MATCH_STATUSES, MatchStatus } from '../../config/constants';

export interface IMatch extends Document {
  _id: Types.ObjectId;
  requester_id: Types.ObjectId;
  addressee_id: Types.ObjectId;
  requester_commute_id: Types.ObjectId;
  addressee_commute_id: Types.ObjectId;
  status: MatchStatus;
  compatibility_score?: number;
  matched_at?: Date;
  created_at: Date;
  updated_at: Date;
}

const matchSchema = new Schema<IMatch>(
  {
    requester_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    addressee_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    requester_commute_id: { type: Schema.Types.ObjectId, ref: 'Commute', required: true },
    addressee_commute_id: { type: Schema.Types.ObjectId, ref: 'Commute', required: true },
    status: { type: String, enum: MATCH_STATUSES, default: 'pending' },
    compatibility_score: Number,
    matched_at: Date,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

matchSchema.index(
  { requester_id: 1, addressee_id: 1, requester_commute_id: 1, addressee_commute_id: 1 },
  { unique: true },
);

export const MatchModel = model<IMatch>('Match', matchSchema);
