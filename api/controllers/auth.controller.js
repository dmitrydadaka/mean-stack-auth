import Role from '../models/Role.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { CreateError } from '../utils/error.js';
import { CreateSuccess } from '../utils/success.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res, next) => {

    const role = await Role.find({ role: 'User'});
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
        const user = await User.findOne({email: req.body.email}).populate('roles', 'role');
        const { roles } = user;

        if(!user){
            return res.status(404).send('User not found');
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

        if(!isPasswordCorrect){
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
        return res.cookie('access_token', token, {httpOnly: true})
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

    const role = await Role.find({ role: 'User'});
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
