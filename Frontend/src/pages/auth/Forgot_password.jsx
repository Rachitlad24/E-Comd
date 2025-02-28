import CommonForm from '@/components/common/form';
import { forgotPasswordFormControl } from '@/config';
import { useToast } from '@/hooks/use-toast';
import { forgotPassword } from '@/store/auth-slice';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const initialState = {
  email: "",
};

const ForgotPassword = () => {
  const [formData, setFormData] = useState(initialState);
  const [emailError, setEmailError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
 
  const isFormValid = () => {
    const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const valid = emailReg.test(formData.email);
    return Object.keys(formData).map((key) => formData[key] !== '').every((item) => item) && valid;
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    // console.log("Email changed:", email);
    // console.log("Valid Email:", emailRegex.test(email));
    
    
    setFormData({ ...formData, email });

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    console.log(emailRegex.test(email));
    
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      console.log(emailError,'email error');
      
    } else {
      
      setEmailError(""); // Clear error if email is valid
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid()) {
      dispatch(forgotPassword(formData))
        .then((result) => {
          console.log(result);
          if(result.payload.success){
            localStorage.setItem('email', formData.email)
            toast({
              title:result.payload.message
            })
            navigate('/auth/otp')
          }else {
            toast({
              title: result.payload.message,
              variant: "destructive",
            });
          }
          
          
        })
        .catch((error) => {
          console.error("Forgot password failed:", error.message);
        });
    } else {
      setEmailError("Please enter a valid email address.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Forgot Password
        </h1>
      </div>
      <CommonForm
         formControls={forgotPasswordFormControl}
        buttonText="Submit"
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        
        isBtnDisabled={!isFormValid()}
        error={{ emailError }}  // Pass the emailError correctly here
        handleEmailChange={handleEmailChange}
      />
    </div>
  );
};

export default ForgotPassword;