import Role from '../models/Role.js';
import { CreateSuccess } from '../utils/success.js';
import { CreateError } from '../utils/error.js';

export const createRole = async (req, res, next) => {
    try {
        if (req.body.role && req.body.role !== '') {
            const newRole = new Role(req.body);
            await newRole.save();
            //return res.send('Role created!');
            return next(CreateSuccess(200, 'Role Created!'))
        } else {
            //return res.status(400).send('Bad request');
            return next(CreateError(400, 'Bad Request'));

        }
    } catch (error) {
        //return res.status(500).send('Internal server error');
        return next(CreateError(500, 'Internal Server Error'));
    }
};

export const updateRole = async (req, res, next) => {
    try {
        const role = await Role.findById({ _id: req.params.id });

        if (role) {
            const role = await Role.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
            return next(CreateSuccess(200, 'Role Updated!'))
        } else {
            return next(CreateError(404, 'Role Not Found '));
        }
    } catch (error) {
        return next(CreateError(500, 'Internal Server Error'));
    }
};

export const getAllRoles = async (req, res, next) => {
    try {
        const roles = await Role.find({});
        return next(CreateSuccess(200, 'Roles found!'))
    } catch (error) {
        return next(CreateError(500, 'Internal Server Error'));
    }
};

export const deleteRole = async (req, res, next) => {
    try {
        const role = await Role.findById({_id: req.params.id});
        if (role) {
            await Role.findByIdAndDelete(req.params.id);         
            return next(CreateSuccess(200, 'Role deleted!'))
        } else {
            return next(CreateError(404, 'Role Not Found '));
        }
    } catch (error) {
        return next(CreateError(500, 'Internal Server Error'));
    }
}
