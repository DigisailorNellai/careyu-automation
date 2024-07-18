import mongoose, { Schema, Document } from 'mongoose';

interface ITypesOfProducts{
    LBR:Number;
    TMB:Number;
    LP:Number;
    TMA:Number;
}

interface IOrders extends Document{
    customerName:String;
    customerCode:String;
    typesOfProducts:ITypesOfProducts;
    TotalOrders:Number;
}

const typesOfProducts:Schema=new Schema({
    LBR:{type:Number},
    TMB:{type:Number},
    LP:{type:Number},
    TMA:{type:Number}
})

const orders:Schema=new Schema({
    customerName:{type:String,required:true},
    customerCode:{type:String,required:true},
    typesOfProducts:{type:typesOfProducts},
    ToralOrders:{type:Number}
},{timestamps:true});

const Orders=mongoose.model<IOrders>('Orders',orders)

export{Orders,IOrders}
