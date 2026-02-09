import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { userValidationRules, newStoreWithOwnerValidationRules, validate } from '../middleware/validationMiddleware.js';
import { createUser, createStore, getAllUsers, getAllStores, getDashboardStats } from '../controllers/adminController.js';

const router = express.Router();
router.post('/users', protect, authorize('SYSTEM_ADMIN'), userValidationRules(), validate, createUser);
router.post('/stores', protect, authorize('SYSTEM_ADMIN'), newStoreWithOwnerValidationRules(), validate, createStore);
router.get('/users', protect, authorize('SYSTEM_ADMIN'), getAllUsers);
router.get('/stores', protect, authorize('SYSTEM_ADMIN'), getAllStores);
router.get('/stats', protect, authorize('SYSTEM_ADMIN'), getDashboardStats);


export default router;