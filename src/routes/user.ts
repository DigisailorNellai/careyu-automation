import express from 'express';
import { registerUser, login, logout, forgotPassword } from '../controller/userController';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', login);

router.post('/logout', logout);

router.post('/forgotpassword', forgotPassword);

export default router;
