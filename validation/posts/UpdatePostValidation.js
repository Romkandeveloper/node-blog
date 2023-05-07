import { body } from 'express-validator';

export const updatePostValidation = [
    body('title').isString().isLength({min: 3}),
    body('text').isString().isLength({min: 10}),
    body('tags').optional().isArray(),
    body('tags.*').isString().isLength({min: 3}),
];
