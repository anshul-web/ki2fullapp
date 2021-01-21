const express = require('express');
const { requireSignin } = require('../../common-middleware');
const { signup, signin, signout } = require('../../controller/admin/auth');
const { validateSignupRequest, isRequestValidate, validateSigninRequest } = require('../../validators/auth')
const router = express.Router();

router.post('/admin/signup',validateSignupRequest, isRequestValidate, signup);
router.post('/admin/signin',validateSigninRequest, isRequestValidate, signin);
router.post('/admin/signout', signout )

module.exports = router;