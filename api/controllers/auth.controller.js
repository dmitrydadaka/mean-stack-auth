import Role from '../models/Role.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { CreateError } from '../utils/error.js';
import { CreateSuccess } from '../utils/success.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'
import UserToken from '../models/UserToken.js'

export const register = async (req, res, next) => {

    const role = await Role.find({ role: 'User' });
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
        username: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashPassword,
        role: role
    });

    await newUser.save();
    return next(CreateSuccess(201, 'User Registered Successfully'));
    //return res.status(200).json('User Registered Successfully!');
};

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email }).populate('roles', 'role');
        const { roles } = user;

        if (!user) {
            return res.status(404).send('User not found');
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).send('Password is incorrect');
        }
        const token = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
                roles: roles
            },
            process.env.JWT_SECRET
        );
        return res.cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json({
                status: 200,
                message: 'Login Success!',
                data: user
            });
        //next(CreateSuccess(201, 'Login Success!'));
    } catch (error) {
        res.status(500).json('Something went wrong');
    }
}

export const registerAdmin = async (req, res, next) => {

    const role = await Role.find({ role: 'User' });
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashPassword,
        role: role,
        isAdmin: true
    });

    await newUser.save();
    return next(CreateSuccess(201, 'Admin Registered Successfully'));
    //return res.status(200).json('User Registered Successfully!');
};

export const sendEmail = async (req, res, next) => {
    const email = req.body.email;
    const user = await User.findOne({ email: { $regex: '^' + email + '$', $options: 'i' } });

    if (!user) {
        return next(CreateError(404, 'User not found to reset password'));
    }
    const payload = {
        email: user.email,
    }
    const expiryTime = 300;
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiryTime });
    const newToken = new UserToken({
        userId: user._id,
        token: token
    });

    const mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "belpc2012@gmail.com",
            pass: "puassinjpmdhpcpa"
        }
    });
    let mailDetails = {
        from: 'belpc2012@gmail.com',
        to: 'belpc2012@gmail.com',
        subject: 'Reset password',
        html: `
        <html>
        <head>
                 Password reset request
        </head>
        <body>
                <h1>Password reset request</h1>
                <p> Dear ${user.username}</p>
                <p> We have received request to reset password for your account with BookMyBook. 
                To complete the password reset process, please, click on the button below</p>
                <a href=${process.env.LIVE_URL}/reset/${token}>
                <button style="background-color: #4CAF50; color: white; padding: 14px 20px; border: none;
                cursor: pointer, border-radius: 4px;">
                Reset Password</button></a>
                <p>Please note that this link is only valid for for 5 minutes. if you did not request a password reset,
                please disregard this message</p>
                <p>thank you</p>
                <p>Let's program team</p>

        </body>

        </html>`
    };
    mailTransporter.sendMail(mailDetails, async (err, data)=>{
        if(err){
            console.log(err);
            return next(CreateError(500, 'Something went wrong while sending the email!'))
        }else{
            await newToken.save()
            return next(CreateSuccess(200, 'Email sent successfully!'))
        }
    });
}
