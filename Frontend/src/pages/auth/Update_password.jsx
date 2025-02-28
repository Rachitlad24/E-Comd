import CommonForm from '@/components/common/form';
import { resetPasswordControl } from '@/config';
import { useToast } from '@/hooks/use-toast';
import { resetPass } from '@/store/auth-slice';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const initialFormData = {
  email: '',
  password: '',
  confirmPassword: '',
};

const UpdatePassword = () => {
  const [formData, setFormData] = useState(initialFormData);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('email') || '';
    setFormData((prev) => ({
      ...prev,
      email: storedEmail,
    }));
  }, []);

  const onSubmit = () => {
    dispatch(resetPass(formData)).then((data) => {
      console.log(data);
      localStorage.removeItem('email');
      toast({
        title: data.payload.message || 'Password reset successfully',
      });
      if (data.payload.success) {
        navigate('/auth/login');
      }
    });
  };

  const isFormValid = () => {
    return Object.values(formData).every((value) => typeof value === 'string' && value.trim() !== '');
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Reset Your Password
        </h1>
      </div>
      <CommonForm
        formControls={resetPasswordControl}
        buttonText="Submit"
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isBtnDisabled={!isFormValid()}
        forgotPassword={false}
      />
    </div>
  );
};

export default UpdatePassword;
