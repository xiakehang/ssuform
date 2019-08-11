import express from 'express';
import path from 'path';

const app = express()
const port1 = 8888;


app.use('/', express.static(path.join(__dirname, 'demo'), {
    setHeaders: function (res, path) {
        
    }
}));

app.listen(port1, () => console.log(`Example app listening on port ${port1}!`));