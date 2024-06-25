import Role from '../models/Role.js';
import { CreateSuccess } from '../utils/success.js';

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
            return res.status(200).send('Role updated');
        } else {
            return res.status(404).send('Role not found')
        }
    } catch (error) {
        return res.status(500).send('Internal server error')
    }
};

export const getAllRoles = async (req, res, next) => {
    try {
        const roles = await Role.find({});
        return res.status(200).send(roles);
    } catch (error) {

    }
};

export const deleteRole = async (req, res, next) => {
    try {
        const role = await Role.findById({_id: req.params.id});
        if (role) {
            await Role.findByIdAndDelete(req.params.id);         
            return res.status(200).send('Role deleted');
        } else {
            return res.status(404).send('Role not found')
        }

    } catch (error) {
        return res.status(500).send('Internal server error')
    }
}
