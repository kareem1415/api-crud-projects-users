import * as express from 'express';
const router = express.Router();
import {
    getAllusersHandler,
    createUserHandler,
    getUserHandler,
    updateUserHandler,
    deleteUserHandler,
    loginUserHandler,
} from '../controllers/userController';
import { protect } from '../models/authMiddleware';
router
    .route('/')
    .get(protect, getAllusersHandler)
    .post(protect, createUserHandler);
router
    .route('/:id')
    .get(getUserHandler)
    .put(protect, updateUserHandler)
    .delete(protect, deleteUserHandler);
router.route('/login').post(loginUserHandler);

module.exports = router;
