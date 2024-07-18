import { Response } from 'express';
import { IUser } from '../models/userModel'; // Replace with the actual type if different

const sendToken = async (user: IUser, statusCode: number, res: Response) => {
    // creating jwt token
    const token = user.getJwtToken();

    // setting cookies
    const options = {
        expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRES_TIME) * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            user,
            token
        });
};

export default sendToken;
