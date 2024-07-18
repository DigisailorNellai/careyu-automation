import { Request, Response, NextFunction } from 'express';
import user, { IUser } from '../models/userModel';
import catchAsyncError from '../middleware/catchAsyncError';
import errorHandler from '../utils/errorHandler';
import sendToken from '../utils/jwt';
import sendEmail from '../utils/email';

export const registerUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, avatar } = req.body;
    const User = await user.create({
        name,
        email,
        password,
        avatar
    });

    sendToken(User, 201, res);
});

export const login = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new errorHandler("Please Enter Email and Password", 400));
    }

    const User = await user.findOne({ email }).select("+password");

    if (!User) {
        return next(new errorHandler("Invalid Email or Password", 401));
    }

    if (!(await User.isValidPassword(password))) { // corrected to isValidPassword
        return next(new errorHandler("Invalid Email or Password", 401));
    }

    sendToken(User, 201, res);
});

// for logout
export const logout = (req: Request, res: Response, next: NextFunction) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    }).status(200).json({
        success: true,
        message: "Logged out"
    });
};

// forgotPassword
export const forgotPassword = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const User = await user.findOne({ email: req.body.email });

    if (!User) {
        return next(new errorHandler('User not found with this email', 400));
    }

    const resetToken = User.getResetPasswordToken();
    await User.save({ validateBeforeSave: false });

    // create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/user/password/reset/${resetToken}`;

    const message = `Your Password reset url is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;

    try {
        sendEmail({
            email: User.email,
            subject: "Password Recovery Email",
            message
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${User.email}`
        });
    } catch (error:any) {
        User.resetPasswordToken = undefined;
        User.resetPasswordTokenExpire = undefined;
        await User.save({ validateBeforeSave: false });
        return next(new errorHandler(error.message,500));
    }
});
