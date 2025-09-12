import { body, validationResult } from 'express-validator';

export const userValidationRules = () => [
  body('name').isLength({ min: 20, max: 60 }).withMessage('Name must be 20-60 characters'),
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('address').isLength({ max: 400 }).withMessage('Address must be max 400 characters'),
  body('password').isLength({ min: 8, max: 16 }).matches(/^(?=.*[A-Z])(?=.*[!@#$&*]).*$/).withMessage('Password must be 8-16 characters with one uppercase and one special character'),
];

export const passwordUpdateValidationRules = () => [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 8, max: 16 }).matches(/^(?=.*[A-Z])(?=.*[!@#$&*]).*$/).withMessage('New password must be 8-16 characters with one uppercase letter and one special character'),
];

export const storeValidationRules = () => [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('address').isLength({ max: 400 }).withMessage('Address must be max 400 characters'),
  body('ownerId').isInt().withMessage('Owner ID must be an integer'),
];

export const ratingValidationRules = () => [
  body('value').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
];

export const newStoreWithOwnerValidationRules = () => [
    body('storeName').notEmpty().withMessage('Store name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('storeAddress').isLength({ max: 400 }).withMessage('Store address must be max 400 characters'),
    body('ownerName').isLength({ min: 20, max: 60 }).withMessage('Owner name must be 20-60 characters'),
    body('ownerAddress').isLength({ max: 400 }).withMessage('Owner address must be max 400 characters'),
    body('password').isLength({ min: 8, max: 16 }).matches(/^(?=.*[A-Z])(?=.*[!@#$&*]).*$/).withMessage('Owner password must be 8-16 characters with one uppercase and one special character'),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ errors: errors.array() });
};