import express from'express';
import { getAllUsers, getById } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getById);

export default router;
