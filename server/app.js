const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser());

let status = '900';

app.get('/', function (req, res) {
    res.send('hack proxy server');
});

app.get('/status', function (req, res) {
    if(status === "Ordered") {
        res.json({id: '2', status: 'Ordered' });
    }
    res.json({id: '2', status: status > 700 ? 'OutOfStock' : 'InStock' });
});

app.post('/push', function (req, res) {
    console.log('---------------')
    console.log(req.body);
    console.log('---------------')
    if(req.body.status) {
        status = req.body.status;
    }
    res.send(req.body)
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Hack proxy server');
});