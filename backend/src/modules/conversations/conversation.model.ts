import { Schema, model, Document, Types } from 'mongoose';

export interface IConversation extends Document {
  _id: Types.ObjectId;
  match_id: Types.ObjectId;
  participant_ids: Types.ObjectId[];
  last_message_at?: Date;
  created_at: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    match_id: { type: Schema.Types.ObjectId, ref: 'Match', required: true, unique: true },
    participant_ids: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    last_message_at: Date,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } },
);

conversationSchema.index({ participant_ids: 1, last_message_at: -1 });

export const ConversationModel = model<IConversation>('Conversation', conversationSchema);
