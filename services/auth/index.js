const cfg = require('../../pkg/config/index');
require('../../pkg/db');
const cors = require('cors');

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');

const auth = require('../auth/handlers/auth');

const api = express();
api.use(cors());
api.use(bodyParser.json());
api.use(jwt({ 
    secret: cfg.get('security').jwt_key,
    algorithms: ['HS256']
}).unless({
    path: [
        { url: '/api/v1/auth', methods: ['POST'] },
        { url: '/api/v1/auth/login', methods: ['POST'] }
    ]
}));
api.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('Bad JWT');
    }
});

api.post('/api/v1/auth', auth.create);
api.post('/api/v1/auth/login', auth.login);
api.get('/api/v1/auth/:uid', auth.getUser);
api.put('/api/v1/auth/:uid', auth.updateUser);

api.listen(cfg.get('services').auth.port, err => {
    if(err){
        console.error('Could not start server:', err);
    }
    console.log('Server successfully started on port', cfg.get('services').auth.port);
});