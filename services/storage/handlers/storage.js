const fs = require('fs');
const strings = require('../../../pkg/strings/index.js');


const storeFile = async (req, res) => {

    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/pjpeg',
        'image/jpg'
    ];
    if (!allowedTypes.includes(req.files.document.mimetype)) {
        return res.status(400).send('Bad Request');
    }
    const allowedSize = 10 * 1024 * 1024;
    if (allowedSize < req.files.document.size) {
        return res.status(400).send('Bad Request: File Too Large');
    }
 
    let userDir = `${__dirname}/../uploads`;
    console.log(userDir);
    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir);
    }
    let fileName = `${strings.makeID(8)}_${req.files.document.name.replace(/ /g, '_')}`;
    let filePath = `${userDir}/${fileName}`;
    try {
        await req.files.document.mv(filePath);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal Server Error');
    }
    res.status(201).send({
        filename: fileName
    });
    console.log('fileName', fileName);
    
    console.log(req.body, req.file);
    res.status(200).send('try')
};

const getFile = (req, res) => {
    let userDir = `${__dirname}/../uploads`
    let fileName = req.params.fid;
    let filePath = `${userDir}/${fileName}`;
    
    if (!fs.existsSync(filePath)) {
        res.status(404).send('File Not Found');
    }
    res.download(filePath);
};


module.exports = {
    storeFile,
    getFile
};