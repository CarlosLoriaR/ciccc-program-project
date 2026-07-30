import { Schema, model, Document, Types } from 'mongoose';

export interface ISession extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  refresh_token_hash: string;
  user_agent?: string;
  ip_address?: string;
  expires_at: Date;
  created_at: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    refresh_token_hash: { type: String, required: true, unique: true },
    user_agent: String,
    ip_address: String,
    expires_at: { type: Date, required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } },
);

// TTL index: Mongo automatically deletes the document once expires_at passes.
sessionSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

export const SessionModel = model<ISession>('Session', sessionSchema);
