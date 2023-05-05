import express from "express";
import mongoose from "mongoose";
import { registerValidation } from "./validation/auth/RegisterValidation.js";
import { loginValidation } from "./validation/auth/LoginValidation.js";
import { isAuthMiddleware } from "./middlewares/IsAuthMiddleware.js";
import * as UserController  from "./controllers/UserController.js";

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://romanchaban9:csDVnub5Cj7GIpp3@blog.yw96xl4.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB has been connected!'))
    .catch(e => console.log(e));

export const SECRET = 'secretKey';
app.post('/auth/login', loginValidation, UserController.login);
app.post('/auth/register', registerValidation, UserController.register);
app.get('/auth/me', isAuthMiddleware, UserController.me);

const PORT = 3000;
app.listen(PORT, (err) => {
    if (err) return console.log(err);
    console.log('Server has been started!');
});
