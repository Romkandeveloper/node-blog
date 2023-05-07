import { body } from 'express-validator';

export const createPostValidation = [
    body('title').isString().isLength({min: 3}),
    body('text').isString().isLength({min: 10}),
    body('tags').optional().isArray(),
    body('tags.*').isString().isLength({min: 3}),
    body('image').optional().isString(),
];
