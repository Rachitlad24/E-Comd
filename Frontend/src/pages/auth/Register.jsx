import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";



function AuthRegister(){
    const initialState={
     userName: '',
     email : '',
     password : ''   
    }

    const [formData,setFormData]=useState(initialState)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {toast} = useToast();
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handlePasswordChange = (e) => {
      const password = e.target.value;
      setFormData({ ...formData, password });
    
      if (password.length < 6) {
        setPasswordError("Password must be at least 6 characters long.");
      } else {
        setPasswordError("");
      }
    };

    const isFormValid=()=>{
        const emailReg= /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        const valid=emailReg.test(formData.email)
        const validPassword = formData.password.length >= 6;
        return Object.keys(formData).map((key) => formData[key] !== '').every((item) => item) && (valid && validPassword);
      }
      const handleEmailChange = (e) => {
        const email = e.target.value;
        setFormData({ ...formData, email });
         // Validate email format
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    setEmailError("Please enter a valid email address.");
    return; // Show error message if invalid
  } else {
    setEmailError(""); // Clear error if email is valid
  }
};

    function onSubmit(event){
        event.preventDefault ()
        dispatch(registerUser(formData)).then((data)=>{
        if(data?.payload?.success){
            toast({
                title : data?.payload?.message,

            });
            navigate('/auth/login'); 
        } 
        else{
            toast({
                title : data?.payload?.message,
                variant : "destructive",
              });
        }  
        console.log(data);   
     } );
    }
     //console.log(formData)
    return(
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground"> Create new account </h1>
                <p className="mt-2">Already have an account?
                  <Link className="font-medium ml-2 text-primary hover:underline hover:text-blue-500" to='/auth/login'>Login</Link>  
                </p>

            </div>
            <CommonForm formControls={registerFormControls}
             buttonText={'Sign Up'}
             formData={formData}
             setFormData={setFormData}
             onSubmit={onSubmit}
             isBtnDisabled={! isFormValid()}
             handleEmailChange={handleEmailChange}
             error={{emailError,passwordError}}
             handlePasswordChange={handlePasswordChange}
             />
        </div>
    )
}

export default AuthRegister;