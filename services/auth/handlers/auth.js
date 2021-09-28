const usersModel = require('../../../pkg/users');
const usersValidator = require('../../../pkg/users/validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cfg = require('../../../pkg/config');

const create = async (req, res) => {
    try {
        await usersValidator.validate(req.body, usersValidator.registrationSchema);
    } catch(err) {
        console.log(err);
        return res.status(400).send('Bad Request');
    }
    try {
        let ru = await usersModel.getOneByEmail(req.body.email);
        if(ru) {
            return res.status(409).send('Conflict');
        }
    } catch(err) {
        console.log(err);
        return res.status(500).send('Internal Server Error');
    }
    
    req.body.password = bcrypt.hashSync(req.body.password);
    try {
        let user = await usersModel.save(req.body);
        res.status(201).send(user);
    } catch(err) {
        console.log(err);
        return res.status(500).send('Internal Server Error');
    }
};

const login = async (req, res) => {
    console.log(req.body)
    try {
        
        await usersValidator.validate(req.body, usersValidator.loginSchema);
    } catch (err) {
        console.log(err);
        return res.status(400).send('Bad Request');
    }
    try {
        let ru = await usersModel.getOneByEmail(req.body.email);
        if (!ru) {
            return res.status(403).send('Forbidden');
        }
        if(bcrypt.compareSync(req.body.password, ru.password)) {
            let payload = {
                uid: ru._id,
                email: ru.email,
                firstName: ru.firstName,
                lastName: ru.lastName,
                exp: (new Date().getTime() + (365 * 24 * 60 * 60 * 1000)) / 1000
            };
            let key = cfg.get('security').jwt_key;
            let token = jwt.sign(payload, key);
            console.log(token);
            return res.status(200).send({user:ru, jwt: token});
        }
        return res.status(401).send('Unauthorized');
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal Server Error');
    }
};

const getUser = async(req, res) => {
    const uid = jwt.parse(req.params.token)
    await console.log( uid, req.params.token);
    try {
        let data = await usersModel.getOne({_id:req.params.uid})
        return res.status(200).send(data);
    } catch (error) {
        console.log(error);
        return res.status(404).send('Internal Server Error');
    }
}

const updateUser = async (req,res) => {
    try {
        let data = await usersModel.updateUser({_id:req.params.uid}, req.body)
        if(data){
            return res.status(200).send('User Updated');
        }
        return res.status(404).send('Not Found');
    } catch (error) {
        console.log(error);
        return res.status(404).send('Internal Server Error');
    }
}

module.exports = {
    create,
    login,
    getUser,
    updateUser
};