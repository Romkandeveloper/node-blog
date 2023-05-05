import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            throw ({code: 422, message: 'Validation Error.'});
        }
        const pass = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(pass, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatar: req.body.avatar,
            password: hash,
        });

        const user = await doc.save();
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, {expiresIn: '30d'});

        const {password, ...userData} = user._doc;

        res.status(203).json({
            data: {
                user: userData,
                token
            },
        });
    } catch (e) {
        return res.status(e.code || 400).json({status: 'error', message: e.message});
    }
}
export const login = async (req, res) => {
    try {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            throw ({code: 422, message: 'Validation Error.'});
        }

        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            throw ({code: 403, message: 'Wrong email or password.'});
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.password);

        if (!isValidPass) {
            throw ({code: 403, message: 'Wrong email or password.'});
        }

        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, {expiresIn: '30d'});
        const { password, ...userData } = user._doc;

        res.json({
            data: {
                user: userData,
                token
            }
        });
    } catch (e) {
        return res.status(e.code || 400).json({status: 'error', message: e.message});
    }
}
export const me = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) throw ({code: 404, message: 'User not found.'});

        const {password, ...userData} = user._doc;

        res.json({data: {user: userData}});
    } catch (e) {
        return res.status(e.code || 400).json({status: 'error', message: e.message});
    }
}