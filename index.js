import dotenv from 'dotenv';
import express from "express";
import mongoose from "mongoose";
import { registerValidation } from "./validation/auth/RegisterValidation.js";
import { loginValidation } from "./validation/auth/LoginValidation.js";
import { isAuthMiddleware } from "./middlewares/IsAuthMiddleware.js";
import * as UserController  from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import {createPostValidation} from "./validation/posts/CreatePostValidation.js";
import Post from "./models/Post.js";

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@blog.yw96xl4.mongodb.net/blog?retryWrites=true&w=majority`)
    .then(() => console.log('DB has been connected!'))
    .catch(e => console.log(e));

app.post('/auth/login', loginValidation, UserController.login);
app.post('/auth/register', registerValidation, UserController.register);
app.get('/auth/me', isAuthMiddleware, UserController.me);
app.post('/posts', isAuthMiddleware, createPostValidation, PostController.store);
app.get('/posts', PostController.index);

const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, (err) => {
    if (err) return console.log(err);
    console.log('Server has been started!');
});
