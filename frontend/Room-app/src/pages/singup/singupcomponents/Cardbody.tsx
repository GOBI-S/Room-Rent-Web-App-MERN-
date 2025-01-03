import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardContent } from "@/components/ui/card";
import { useState } from "react";
interface CardBodyProps {
 
  signUpInputs: {
    Name: string;
    EmailID: string;
    Password: string;
    ConfirmPassword: string;
    Ownership: string;
  };
  SetSignUpInputs: React.Dispatch<
    React.SetStateAction<{
      Name: string;
      EmailID: string;
      Password: string;
      ConfirmPassword: string;
      Ownership: string;
    }>
  >;
    pass: () => Promise<void>;
  
}

const CardBody: React.FC<CardBodyProps> = ({ signUpInputs, SetSignUpInputs,pass }) => {
   // Handling password confirmation state

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    SetSignUpInputs((prev) => ({
      ...prev,
      [name]: value, // Use name attribute to update the corresponding field in state
    }));
  };

  // Handle the select change for ownership
  const handleSelectChange = (value: string) => {
    SetSignUpInputs((prev) => ({
      ...prev,
      Ownership: value, // Update Ownership field in state
    }));
  };

  // // Handle password confirmation check
  const handlePasswordCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    SetSignUpInputs((prev) => ({
      ...prev,
      [name]: value,
    }));

  //   if (signUpInputs.Password !== value) {
  //     setconfirmp(false); // Set the confirmation to false if passwords do not match
  //   } else {
  //     setconfirmp(true); // Set it back to true if they match
  //   }
 };

  console.log(signUpInputs); // Log the signUpInputs state to check values

  return (
    <>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              {/* Name input */}
              <Label htmlFor="Name">Name</Label>
              <Input
                id="name"
                name="Name" // Ensure name is set so handleChange can work
                placeholder="Name"
                value={signUpInputs.Name} // Bind value to state
                onChange={handleChange}
              />

              {/* Email input */}
              <Label htmlFor="EmailID">Email</Label>
              <Input
                id="email"
                name="EmailID" // Ensure name is set so handleChange can work
                placeholder="Email"
                value={signUpInputs.EmailID} // Bind value to state
                onChange={handleChange}
              />

              {/* Password input */}
              <Label htmlFor="Password">Password</Label>
              <Input
                id="password"
                name="Password" // Ensure name is set so handleChange can work
                type="password"
                placeholder="Password"
                value={signUpInputs.Password}
                onChange={handleChange}
              />

              {/* Confirm Password input */}
              <Label htmlFor="ConfirmPassword">Confirm Password</Label>
              <Input
                id="confirmpassword"
                name="ConfirmPassword" // Ensure name is set so handleChange can work
                type="password"
                placeholder="Confirm Password"
                value={signUpInputs.ConfirmPassword}
                onChange={handleChange} 
                className={`${signUpInputs.Password==signUpInputs.ConfirmPassword?"":"border-red-600"}`}// Special handler for Confirm Password
              />
              {/* Show an error message if passwords don't match */}
            </div>

            {/* Role Selection */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="Role">Role</Label>
              <Select
                value={signUpInputs.Ownership}
                onValueChange={handleSelectChange} // Use onValueChange for Select component
              >
                <SelectTrigger id="Role">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Owner">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
    </>
  );
};

export default CardBody;
