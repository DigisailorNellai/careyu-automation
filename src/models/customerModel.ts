import mongoose, { Schema, Document } from 'mongoose';

interface IBusinessAddress {
  street: string;
  apartment: string;
  city: string;
  state: string;
  country: string;
}

interface IManagerContactInfo {
  name: string;
  email: string;
  phone: string;
}

interface ICustomer extends Document {
  name: string;
  businessType: string;
  businessAddress: IBusinessAddress;
  managerContactInfo: IManagerContactInfo;
  createdAt: Date; // Add createdAt field to ICustomer interface
}

const BusinessAddressSchema: Schema = new Schema({
  street: { type: String, required: true },
  apartment: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
});

const ManagerContactInfoSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});

const CustomerSchema: Schema = new Schema({
  name: { type: String, required: true },
  businessType: { type: String, required: true },
  businessAddress: { type: BusinessAddressSchema, required: true },
  managerContactInfo: { type: ManagerContactInfoSchema, required: true },
  User: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true }); 

// Index createdAt field
CustomerSchema.index({ createdAt: 1 });

const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);

export { Customer, ICustomer };
