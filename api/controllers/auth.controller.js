import Role from '../models/Role.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { CreateError } from '../utils/error.js';
import { CreateSuccess } from '../utils/success.js';

export const register = async (req, res, next) => {

    const role = await Role.find({ role: 'User'});
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    
    const newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashPassword,
        role: role
    });

    await newUser.save();
    return next(CreateSuccess(201, 'User Registered Successfully'));
    //return res.status(200).send('User Registered Successfully!');
};

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});

        if(!user){
            return res.status(404).send('User not found');
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

        if(!isPasswordCorrect){
            return res.status(400).send('Password is incorrect');
        }
        return next(CreateSuccess(201, 'Login Success!'));
    } catch (error) {
        res.status(500).send('Something went wrong');
    }
}
