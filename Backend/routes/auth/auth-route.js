
const express = require ('express');
const { registerUser,loginUser,logoutUser,authMiddleware, forgotPassword,reset_password,verify_otp} = require('../../controllers/auth/auth-controller');

const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/logout",logoutUser);
router.post("/forgot",forgotPassword);
router.post("/reset",reset_password);
router.post("/verify",verify_otp);
router.get('/check-auth',authMiddleware, (req,res)=>{
    const user = req.user;
    res.status(200).json({
        success : true ,
        message : 'Authenticated user',
        user,
    })
})

module.exports=router;