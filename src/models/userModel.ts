import mongoose, { Document, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: string;
  role: string;
  resetPasswordToken?: string;
  resetPasswordTokenExpire?: Date;
  createdAt: Date;
  getJwtToken: () => string;
  isValidPassword: (enteredPassword: string) => Promise<boolean>;
  getResetPasswordToken: () => string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "Please enter name"],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter valid email address"],
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    maxlength: [6, "Password cannot exceed 6 characters"],
  },
  avatar: {
    //profile picture
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordTokenExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Function for generating the secret key
userSchema.methods.getJwtToken = function (): string {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_TIME as string }
  );
};

// Function to check the password
userSchema.methods.isValidPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Reset Password
userSchema.methods.getResetPasswordToken = function (): string {
  // Generate Token
  const token = crypto.randomBytes(20).toString('hex');

  // Generate hash and set to resetPasswordToken
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

  // Set token expire time
  this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

  return token;
};

const user = mongoose.model<IUser>('User', userSchema);

export default user;
