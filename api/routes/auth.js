import express from 'express';
import { login, register, registerAdmin, sendEmail } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/register-admin', registerAdmin);

router.post('/send-email', sendEmail)

export default router; 
