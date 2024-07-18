import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

import ErrorHandler from '../utils/errorHandler';
import catchAsyncError from './catchAsyncError';
import User, { IUser } from '../models/userModel'; // Adjust UserModel and IUser as per your actual implementation

// Extend Express's Request interface to include a user property
declare global {
    namespace Express {
        interface Request {
            user?: IUser; // Assuming IUser is the interface for your User model
        }
    }
}

// Middleware function to authenticate user
export const isAuthenticatedUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        return next(new ErrorHandler("Login first to access this resource", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret) as { id: string };
        const user = await User.findById(decoded.id);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }
        req.user = user;
        next();
    } catch (err) {
        return next(new ErrorHandler("Invalid or expired token, please login again", 401));
    }
});

// Middleware function to authorize user roles
export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new ErrorHandler("You are not authorized to access this resource", 403));
        }
        next();
    };
};
