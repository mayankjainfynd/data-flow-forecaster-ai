import { useState } from "react";
import { Button } from "@/components/ui/button";
import Login from "./Login";
import Register from "./Register";

interface AuthContainerProps {
  onAuth: () => void;
}

const AuthContainer = ({ onAuth }: AuthContainerProps) => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            {showLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {showLogin
              ? "Sign in to your account to continue"
              : "Register a new account to get started"}
          </p>
        </div>

        {showLogin ? (
          <Login onLogin={onAuth} />
        ) : (
          <Register onRegister={() => setShowLogin(true)} />
        )}

        <div className="text-center">
          <Button
            variant="link"
            onClick={() => setShowLogin(!showLogin)}
            className="text-sm"
          >
            {showLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer; 