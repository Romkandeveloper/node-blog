import {validationResult} from "express-validator";
import PostModel from "../models/Post.js";

export const store = async (req, res) => {
    try {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            throw ({code: 422, message: 'Validation Error.'});
        }

        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            image: req.body.image,
            tags: req.body.tags,
            user: req.userId,
        });

        const post = await doc.save();

        res.status(203).json({
            data: {post},
        });
    } catch (e) {
        return res.status(e.code || 400).json({status: 'error', message: e.message});
    }
}