import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { COMMUTE_MODES, CommuteMode, USER_ROLES, UserRole, USER_STATUSES, UserStatus } from '../../config/constants';
import { GeoPoint } from '../../common/utils/geo';

const SALT_ROUNDS = 12;

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password_hash: string;
  full_name: string;
  display_name?: string;
  avatar_url?: string;
  phone?: string;
  home_location?: GeoPoint;
  work_location?: GeoPoint;
  preferred_modes: CommuteMode[];
  schedule?: Record<string, unknown>;
  is_verified: boolean;
  rating_avg: number;
  rating_count: number;
  role: UserRole;
  status: UserStatus;
  created_at: Date;
  updated_at: Date;
}

const geoPointSchema = new Schema<GeoPoint>(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: undefined },
    label: String,
  },
  { _id: false },
);

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true, select: false },
    full_name: { type: String, required: true, trim: true },
    display_name: { type: String, trim: true },
    avatar_url: String,
    phone: String,
    home_location: geoPointSchema,
    work_location: geoPointSchema,
    preferred_modes: [{ type: String, enum: COMMUTE_MODES }],
    schedule: Schema.Types.Mixed,
    is_verified: { type: Boolean, default: false },
    rating_avg: { type: Number, default: 0 },
    rating_count: { type: Number, default: 0 },
    role: { type: String, enum: USER_ROLES, default: 'user' },
    status: { type: String, enum: USER_STATUSES, default: 'active' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

userSchema.index({ home_location: '2dsphere' });
userSchema.index({ work_location: '2dsphere' });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password_hash')) return next();
  this.password_hash = await bcrypt.hash(this.password_hash, SALT_ROUNDS);
  next();
});

export const UserModel = model<IUser>('User', userSchema);
