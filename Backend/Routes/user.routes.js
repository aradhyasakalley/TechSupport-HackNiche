const express = require('express');
const router = new express.Router();
const authentication = require('../Middleware/auth.middleware');
const {
    newUser,
    userLogin,
    logout,
    logoutAll,
    forgotPass,
    verifyOtp,
    newPass,
    searchedUsers,
    deleteUser
} = require('../Controllers/user.controller');

router.post('/newUser', newUser);
router.post('/userLogin', userLogin);
router.post('/bookappointment',authentication.verifyToken,bookAppointment);
router.get('/logout', authentication.verifyToken, logout);
router.get('/logoutAll', authentication.verifyToken, logoutAll);
router.post('/forgotPass', forgotPass);
router.post('/verifyOtp', verifyOtp);
router.post('/newPass', newPass);
router.post('/searchedUsers', authentication.verifyToken, searchedUsers);
router.delete('/:id',deleteUser);

module.exports = router;