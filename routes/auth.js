/*
    path: api/login
*/

const { Router } = require('express');
const { createUser , login, renewToken} = require('../controllers/auth');
const { check } = require('express-validator');

const {validateFields} = require('../middlewares/validate-fields');
const {validateJWT} = require('../middlewares/validate-jwt');

const router = Router();


router.post('/new',[
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email tiene que ser un correo valido').isEmail(),
    check('password', 'Ingrese una contraseña de minimo 5 caracteres').isLength({ min: 5 }),
    validateFields    
],createUser);


router.post('/', [
    check('email', 'El email tiene que ser un correo valido').isEmail(),
    check('password', 'Ingrese una contraseña de minimo 5 caracteres').isLength({ min: 5 }),
    validateFields
], login);

router.get('/renew',validateJWT,renewToken);

module.exports = router;



