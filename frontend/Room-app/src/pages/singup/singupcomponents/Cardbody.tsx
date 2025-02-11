import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent } from "@/components/ui/card";
import { useState } from "react";

interface SignUpInputs {
  Name: string;
  EmailID: string;
  Password: string;
  ConfirmPassword: string;
}

interface CardBodyProps {
  signUpInputs: SignUpInputs;
  SetSignUpInputs: React.Dispatch<React.SetStateAction<SignUpInputs>>;
  pass: () => Promise<void>;
}

const CardBody: React.FC<CardBodyProps> = ({ signUpInputs, SetSignUpInputs, pass }) => {
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    SetSignUpInputs((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Check if passwords match when ConfirmPassword is updated
    if (name === "ConfirmPassword") {
      setPasswordsMatch(signUpInputs.Password === value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpInputs.Password !== signUpInputs.ConfirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    pass();
  };

  return (
    <>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              {/* Name input */}
              <Label htmlFor="Name">Name</Label>
              <Input
                id="name"
                name="Name"
                placeholder="Name"
                value={signUpInputs.Name}
                onChange={handleChange}
              />

              {/* Email input */}
              <Label htmlFor="EmailID">Email</Label>
              <Input
                id="email"
                name="EmailID"
                placeholder="Email"
                value={signUpInputs.EmailID}
                onChange={handleChange}
              />

              {/* Password input */}
              <Label htmlFor="Password">Password</Label>
              <Input
                id="password"
                name="Password"
                type="password"
                placeholder="Password"
                value={signUpInputs.Password}
                onChange={handleChange}
              />

              {/* Confirm Password input */}
              <Label htmlFor="ConfirmPassword">Confirm Password</Label>
              <Input
                id="confirmpassword"
                name="ConfirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={signUpInputs.ConfirmPassword}
                onChange={handleChange}
                className={`${passwordsMatch ? "" : "border-red-600"}`}
              />
              {/* Show an error message if passwords don't match */}
              {!passwordsMatch && (
                <p className="text-red-600 text-sm mt-1">Passwords do not match.</p>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </>
  );
};

export default CardBody;