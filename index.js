import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.json({
        status: 'success'
    });
});

const PORT = 3000;
app.listen(PORT, (err) => {
    if (err) return console.log(err);
})
