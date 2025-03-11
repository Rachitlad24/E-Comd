const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../../models/User');
const redis = require('../../helpers/redis')
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const redisClient = require("../../helpers/redis");
require("dotenv").config();

// register

const registerUser = async(req,res)=>{
    const {userName,email,password} = req.body;
    console.log(password,"register");
    
    try{

        const checkUser = await User.findOne({email});
        if(checkUser) return res.json({ success: false , message : 'User Already exists with the same email! Please try again '});
        const hashpassword =  await bcrypt.hash(password, 12);
        
        
        const newUser =  new User({
            userName,
            email,
            password : hashpassword
        })

        await newUser.save()
        res.status(200).json({
            success: true,
            message : 'Registration Sucessfully'

        })

    }
     catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message : 'some error occured'

        })
     }
}

//login

const loginUser = async(req,res)=>{
    const {email,password} = req.body;
console.log(password,'login')
    try{
        const checkUser = await User.findOne({email});
        if(!checkUser) return res.json({
            success : false,
            message : "User doesn't exists! Please register first"
        })
     const checkPasswordMatch = await bcrypt.compare(password,checkUser.password);   
    if(!checkPasswordMatch) return res.json({
        success : false,
        message : "Incorrect Password! Please try again",
    });
    const token = jwt.sign({
        id: checkUser._id , role : checkUser.role , email : checkUser.email,
        userName : checkUser.userName
    }, process.env.CLIENT_SECRET,{expiresIn : '60m'})

    res.cookie('token',token,{httpOnly : true, secure : false}).json({
        success : true,
        message : 'LoggedIn Sucessfully',
        user : {
           email : checkUser.email,
           role : checkUser.role,
           id : checkUser._id,
           userName : checkUser.userName
        }
    })
    
}
     catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message : 'some error occured'

        })
     }
};

const logoutUser = (req, res) => {
    res.clearCookie("token").json({
      success: true,
      message: "Logged out successfully!",
    });
  };
  

// auth middleware
const authMiddleware = async (req,res,next) =>
{
    const token = req.cookies.token;
    if(!token) return res.json({
        success : false ,
        message : 'Unauthorized user!'
    })
    try {
      const decoded = jwt.verify(token,process.env.CLIENT_SECRET);
      req.user = decoded;
      next()

    }
    catch(error){
        res.json({
            success : false ,
            message : 'Unauthorized user!'
        })
    }
}

// forgot password
const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      // console.log(email.toLowerCase());
      const user = await User.findOne({
        email: email.toLowerCase(),
        role: "user",
      });
      if (!user) {
        return res.json({
          success: false,
          message: " User not found",
        });
      }
      const OTP = Math.floor(100000 + Math.random() * 900000);
      const expire = Date.now() + 10 *  60 * 1000;
      await redis.setEx(email, 600, JSON.stringify({ OTP, expire }));
      console.log(`otp for ${user.email} is ${OTP}`);
      const tempPath=path.join(__dirname,'../../helpers/Otp.html')
      let emailHtml = fs.readFileSync(tempPath, "utf8");
      const transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth: {
          user: process.env.AUTH_EMAIL,
          pass: process.env.AUTH_PASSWORD,
        },
      });
      const message = {
        from: process.env.AUTH_EMAIL, // Must match authenticated email
        
        to: email,
        subject: "OTP for password Reset",
        // text: `Your otp is :${OTP} which is expire for ${expire}min`,
        html:emailHtml.replace("{{OTP}}", OTP)
      };
      transporter.sendMail(message, (error, info) => {
        if (error) {
          console.error("Error in sending email:", error);
          return res.status(500).send({
            message: "Failed to send OTP email.",
            success: false,
          });
        }
        console.log("Email sent:", info.response);
        res.send({
          message: "OTP sent to your email successfully.",
          success: true,
        });
      });
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).send({
        message: "Internal Server Error",
        success: false,
      });
    }
  
    // const user=await User.findOne({email:email.toLowerCase()})
    // res
  };
  const verify_otp=async(req,res)=>{
    try {
      const {email,otp}=req.body;
      // console.log(typeof(otp));
      // console.log(email,'emial');
      
      const redisData=await redisClient.get(email)
  
      if(!redisData){
        return res.json({
          success:false,
          message:"OTP is expired or not found.please requet a new one."
        })
      }
      // console.log(redisData,'redisdata');
      // console.log(JSON.parse(redisData),'json Parse');
      
       const parseData=JSON.parse(redisData)
       const storedOtp=String(parseData.OTP)
       const expire=parseData.expire
      //  console.log(typeof(expire),expire);
       
       if(Date.now()>expire)
       {
        await redisClient.del(email)
  
        return res.json({
          message:'OTP has expired. Please request a new one.',
          success: false,
        })
       }
      //  console.log(String(storedOtp),'otp');
      //  console.log(typeof(String(storedOtp)),'otp');
       
       if(storedOtp!==otp){
        return res.json({
          message: "Invalid OTP.",
          success: false,
        });
       }
       await redisClient.del(email)
  ;
       res.send({
         message: "OTP verified successfully! You can now reset your password.",
         success: true,
       });
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).send({
        message: "Internal Server Error",
        success: false,
      });
    }
  }
  const reset_password=async(req,res)=>{
    try {
      const {email,password,confirmPassword}=req.body
      // console.log(email)
  ;
      
      const user=await User.findOne({email,role:'user'})
      if(!user){
        return res.json({
          success:false,
          message:'User not found'
        })
      }
      if(password!==confirmPassword){
        return res.json({
          success:false,
          message:"Confirm password is not matched"
        })
      }
      const CheckPass=await bcrypt.compare(
        password,
        user.password
      )
      if(CheckPass){
        return res.json({
          success:false,
          message:'Please Use different password'
        })
      }
      const hashPassword = await bcrypt.hash(password, 12);
      user.password=hashPassword
      await user.save()
      return res.json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      console.log(error);
      
       res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

module.exports ={registerUser,loginUser,logoutUser,authMiddleware,forgotPassword,verify_otp,reset_password}
