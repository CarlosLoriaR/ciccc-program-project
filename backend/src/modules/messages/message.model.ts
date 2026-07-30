import { Schema, model, Document, Types } from 'mongoose';

export interface Attachment {
  url: string;
  type: string;
  size?: number;
}

export interface IMessage extends Document {
  _id: Types.ObjectId;
  conversation_id: Types.ObjectId;
  sender_id: Types.ObjectId;
  body: string;
  attachments: Attachment[];
  read_by: Types.ObjectId[];
  created_at: Date;
}

const attachmentSchema = new Schema<Attachment>(
  { url: { type: String, required: true }, type: { type: String, required: true }, size: Number },
  { _id: false },
);

const messageSchema = new Schema<IMessage>(
  {
    conversation_id: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, required: true },
    attachments: { type: [attachmentSchema], default: [] },
    read_by: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } },
);

messageSchema.index({ conversation_id: 1, created_at: -1 });

export const MessageModel = model<IMessage>('Message', messageSchema);
