
import mongoose, { Schema, Document } from 'mongoose';

interface ProductDocument extends Document {
  productName: string;
  productCode: string;
  attachment: Array<Array<any>>;
  imageUrl: string;
}

const ProductSchema: Schema = new Schema({
  productName: { type: String, required: true },
  productCode: { type: String, required: true,unique:true },
  attachment: { type: [[Schema.Types.Mixed]], required: true },
  imageUrl: { type: String, required: true }
});

const Product = mongoose.model<ProductDocument>('Product', ProductSchema);
export default Product;


