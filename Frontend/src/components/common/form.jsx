import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiLoader } from "react-icons/fi";

const CommonForm = ({
   formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
  forgotPassword = false,
  error = {},
  handleEmailChange,
  handlePasswordChange, // Add handleEmailChange prop
}) => {
  const [showPassword, setShowPassword] = useState({});
  const {isLoading}=useSelector(state=>state.auth)
  // const location=useLocation()
// console.log(error,'email');
// console.log("Received props in CommonForm:", { handleEmailChange });

  const togglePasswordVisibility = (name) => {
    setShowPassword((prev) => ({ ...prev, [name]: !prev[name] }));
  };
  const renderInputsByComponantType = (getControlItem) => {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
  element = (
    <div className="relative">
      <Input
        name={getControlItem.name}
        placeholder={getControlItem.placeholder}
        id={getControlItem.name}
        type={
          (getControlItem.name === "password"|| getControlItem.name === "confirmPassword") && showPassword[getControlItem.name]
            ? "text"
            : getControlItem.type || "text"
        }
        value={value}
        onChange={(e) => {
          const newval=e.target.value
          console.log(getControlItem.name);
          // console.log(error)
          if (getControlItem.name === "email" ||getControlItem.name==='otp') {
            
            handleEmailChange(e); 
          }
          else if (getControlItem.name === "password") {
            handlePasswordChange(e);
          }
          setFormData((prevData) => ({
            ...prevData,
            [getControlItem.name]: newval,
          }));
        }}
      />
      {getControlItem.name === "password" && (
        <button
          type="button"
          className="absolute inset-y-0 right-3 flex items-center"
          onClick={() => togglePasswordVisibility(getControlItem.name)}
        >
          {showPassword[getControlItem.name] ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      )}
      {getControlItem.name === "confirmPassword" && (
        <button
          type="button"
          className="absolute inset-y-0 right-3 flex items-center"
          onClick={() => togglePasswordVisibility(getControlItem.name)}
        >
          {showPassword[getControlItem.name] ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      )}
    </div>
  );
  break;

        case "checkbox":
          element = (
            <div className="grid grid-cols-2 gap-2">
              {getControlItem.options?.map((option) => (
                <div key={option.id} className="flex items-center">
                <Checkbox
                id={option.id}
                name={getControlItem.name}
                value={option.id}
                checked={value.includes(option.id)}
                onCheckedChange={(checked) => {
                  const newSizes = checked
                    ? [...value, option.id]
                    : value.filter((size) => size !== option.id);
                  setFormData({ ...formData, [getControlItem.name]: newSizes });
                }}
              />
                  <label htmlFor={option.id} className="ml-2">{option.label}</label>
                </div>
              ))}
            </div>
          );
          break;
      case "select":
        element = (
          <Select
            onValueChange={(value) => setFormData({
              ...formData,
              [getControlItem.name]: value,
            })}
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionsItem) => (
                    <SelectItem key={optionsItem.id} value={optionsItem.id}>
                      {optionsItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;
      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(e) => setFormData({ ...formData, [getControlItem.name]: e.target.value })}
          />
        );
        break;
      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(e) => setFormData({ ...formData, [getControlItem.name]: e.target.value })}
          />
        );
        break;
    }
    return element;
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        { formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponantType(controlItem)}
            {controlItem.name === "email" && error.emailError && (
              <p className="text-red-500 text-sm">{error.emailError}</p>
            )}
            {controlItem.name === "otp" && error.otpError&& (
              <p className="text-red-500 text-sm">{error.otpError}</p>
            )}
               {controlItem.name === "password" && error.passwordError && (
              <p className="text-red-500 text-sm">{error.passwordError}</p>
            )}
          </div>
        ))}
      </div>
      {forgotPassword ? (
        <div className="flex justify-end mt-5 mb-5">
          <Link to='/auth/forgot' className="font-medium hover:text-blue-500">
            Forgot password ?
          </Link>
        </div>
      ) : null}

      <Button
        disabled={isBtnDisabled}
        type="submit"
        className={`mt-2 w-full flex items-center justify-center space-x-2 cursor-pointer`}
      >
        {isLoading? <FiLoader className="animate-spin h-5 w-5"/>:buttonText }
      </Button>
    </form>
  );
};

export default CommonForm;