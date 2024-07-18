import { Request,Response,NextFunction } from "express";
import {Orders,IOrders} from '../models/ordersModel'
import errorHandler from "../middleware/error";
import catchAsyncError from '../middleware/catchAsyncError'


export const newOrder=catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    
})
