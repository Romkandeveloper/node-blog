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
export const index = async (req, res) => {
    try {
        const posts = await PostModel.find();

        res.status(203).json({
            data: {posts},
        });
    } catch (e) {
        return res.status(e.code || 400).json({status: 'error', message: e.message});
    }
}
export const show = async (req, res) => {
    try {
        const post = await PostModel.findByIdAndUpdate(req.params.postId, {
            $inc: {viewsCount: 1},
        }, {
            returnDocument: 'after'
        });

        return res.json({data: {post}});
    } catch (e) {
        return res.status(e.code || 400).json({status: 'error', message: e.message});
    }
}
export const remove = async (req, res) => {
    try {
         await PostModel.findByIdAndDelete(req.params.postId);
         return res.json({status: 'success'});
    } catch (e) {
        return res.status(e.code || 400).json({status: 'error', message: e.message});
    }
}
export const update = async (req, res) => {
    try {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            throw ({code: 422, message: 'Validation Error.'});
        }

        const post = await PostModel.findByIdAndUpdate(req.params.postId, {
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
        }, {returnDocument: 'after'});

        return res.json({data: {post}});
    } catch (e) {
        return res.status(e.code || 400).json({status: 'error', message: e.message});
    }
}