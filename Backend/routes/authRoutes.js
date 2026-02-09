import express from 'express';
import { passwordUpdateValidationRules, userValidationRules, validate } from '../middleware/validationMiddleware.js';
import { registerUser, loginUser, updatePassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', userValidationRules(), validate, registerUser);
router.post('/login', loginUser);
router.put('/update-password', protect, passwordUpdateValidationRules(), validate, updatePassword );
export default router;