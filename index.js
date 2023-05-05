import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { registerValidation } from "./validation/auth/RegisterValidation.js";
import { loginValidation } from "./validation/auth/LoginValidation.js";
import { validationResult } from "express-validator";
import UserModel from "./models/User.js";

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://romanchaban9:csDVnub5Cj7GIpp3@blog.yw96xl4.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB has been connected!'))
    .catch(e => console.log(e));

const SECRET = 'secretKey';
app.post('/auth/login', loginValidation, async (req, res) => {
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

        const token = jwt.sign({_id: user._id}, SECRET, {expiresIn: '30d'});
        const { passwordHash, ...userData } = user._doc;

        res.json({
            data: {
                user: userData,
                token
            }
        });
    } catch (e) {
        return res.status(e.code || 400).json({status: 'error', message: e.message});
    }
});
app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            throw ({code: 422, message: 'Validation Error.'});
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatar: req.body.avatar,
            password: hash,
        });

        const user = await doc.save();
        const token = jwt.sign({_id: user._id}, SECRET, {expiresIn: '30d'});

        const { passwordHash, ...userData } = user._doc;

        res.status(203).json({
            data: {
                user: userData,
                token
            },
        });
    } catch (e) {
        return res.status(e.code || 400).json({status: 'error', message: e.message});
    };
});

const PORT = 3000;
app.listen(PORT, (err) => {
    if (err) return console.log(err);
    console.log('Server has been started!');
});
