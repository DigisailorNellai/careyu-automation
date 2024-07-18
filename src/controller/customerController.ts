import { Request, Response, NextFunction } from 'express';
import { Customer, ICustomer } from '../models/customerModel';
import ErrorHandler from '../utils/errorHandler';
import catchAsyncError from '../middleware/catchAsyncError';
import APIFeatures from '../utils/apiFeatures';
import moment from 'moment';
import { isValidObjectId } from 'mongoose';

// Creating a new customer
export const newCustomer = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {


    req.body.User=req.user!.id 

    console.log(req.body);
    
    const customer: ICustomer = await Customer.create(req.body);
    res.status(201).json({
        success: true,
        customer,
    });
});

// Get all customers
export const getCustomers = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const customers: ICustomer[] = await Customer.find({});
    res.status(200).json({
        success: true,
        count: customers.length,
        customers,
    });
});

// Get a single customer
export const getSingleCustomer = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const customer = await Customer.findById(req.params.id).select('name businessAddress managerContactInfo.phone createdAt');

    if (!customer) {
        return next(new ErrorHandler('Customer not found', 404));
    }

    const combinedAddress = `${customer.businessAddress.street}, ${customer.businessAddress.apartment}, ${customer.businessAddress.city}, ${customer.businessAddress.state}, ${customer.businessAddress.country}`;
    const formattedDate = moment(customer.createdAt).format('DD-MM-YYYY');

    res.status(200).json({
        success: true,
        customer: {
            name: customer.name,
            businessAddress: combinedAddress,
            phone: customer.managerContactInfo.phone,
            Date: formattedDate
        }
    });
});


// export const getSingleCustomer = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     const customer: ICustomer | null = await Customer.findById(req.params.id);

//     if (!customer) {
//         return next(new ErrorHandler('Customer not found', 404));
//     }

//     res.status(200).json({
//         success: true,
//         customer,
//     });
// });

// Update a customer
export const updateCustomer = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    let customer: ICustomer | null = await Customer.findById(req.params.id);

    if (!customer) {
        return res.status(404).json({
            success: false,
            message: 'Customer not found',
        });
    }

    customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        customer,
    });
});

// Delete a customer
export const deleteCustomer = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const customer: ICustomer | null = await Customer.findById(req.params.id);

    if (!customer) {
        return res.status(404).json({
            success: false,
            message: 'Customer not found',
        });
    }

    await Customer.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Customer deleted successfully',
    });
});

//Search/filter customers
const resultsPerPage = 1; // Example: change as per your pagination needs

export const filterCustomers = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const apiFeatures = new APIFeatures(Customer.find(), req.query).search().filter().filterByDate().paginate(resultsPerPage);
    const customers = await apiFeatures.query;

    res.status(200).json({
        success: true,
        count: customers.length,
        customers,
    });
});
