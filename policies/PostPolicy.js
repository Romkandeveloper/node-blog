import PostModel from "../models/Post.js";

export const remove = async (req, res, next) => {
    try {
        const post = await PostModel.findById(req.params.postId);
        if (!post) throw {code: 404, message: 'Post not found.'};
        if (post.user != req.userId) throw {code: 403, message: 'Forbidden.'};
        next();
    } catch (e) {
        return res.status(e.code || 400).json({status: 'error', message: e.message});
    }
}

export const update = async (req, res, next) => {
    try {
        const post = await PostModel.findById(req.params.postId);
        if (!post) throw {code: 404, message: 'Post not found.'};
        if (post.user != req.userId) throw {code: 403, message: 'Forbidden.'};
        next();
    } catch (e) {
        return res.status(e.code || 400).json({status: 'error', message: e.message});
    }
}