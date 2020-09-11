const { response } = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const {generateWJT} = require('../helpers/jwt');


const createUser =  async (req, res = response) => {
    try{
        const { email, password } = req.body;

        const existEmail = await User.findOne({email});

        if(existEmail){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            })
        }

        const user = new User(req.body);

        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        //GENERAR JWT
        const token = await generateWJT(user.id);
    
        res.json({
            ok: true,
            msg: user,
            token: token
        });
    }catch(error){
        res.status(500).json({
            ok: false,
            msg: 'Contacte al admin'
        });
    }
}


const login =  async (req, res = response) => {
    try{
        const { email, password } = req.body;

        const userDB = await User.findOne({email});
        if(!userDB){
            res.status('404').json({
                ok: false,
                msg: 'Email no encontrado'
            });    
        }

        //Validar password
        const validPass = bcrypt.compareSync(password, userDB.password);

        if(!validPass){
            res.status('400').json({
                ok: false,
                msg: 'Contraseña no es valida'
            });    
        }

        const token = await generateWJT(userDB.id);

        res.json({
            ok: true,
            msg: userDB,
            token: token
        });
     }catch(error){
        res.status(500).json({
            ok: false,
            msg: 'Contacte al admin'
        });
    }
}

const renewToken =  async (req, res = response) => {
    try{
        const {uid} = req;
        
        const token = await generateWJT(uid);

        const user = await User.findById(uid);

        res.json({
            ok: true,
            msg: user,
            token: token
        });
    }catch(error){
        res.status(500).json({
            ok: false,
            msg: 'Contacte al admin'
        });
    }
}


module.exports = {
    createUser,
    login,
    renewToken
}