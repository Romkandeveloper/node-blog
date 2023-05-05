import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://romanchaban9:csDVnub5Cj7GIpp3@blog.yw96xl4.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('DB has been connected!'))
    .catch(e => console.log(e));

const SECRET = 'secretKey';
app.post('/auth/login', (req, res) => {
    try {
        const token = jwt.sign({
            email: req.body.email,
            fullName: req.body.fullName,
        }, SECRET);

        res.json({status: 'success', token});
    } catch (e) {
        res.status(400).json({status: 'error'});
    }
});

const PORT = 3000;
app.listen(PORT, (err) => {
    if (err) return console.log(err);
    console.log('Server has been started!');
});
