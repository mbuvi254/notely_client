import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Button } from  "../../components/ui/button";
import { useState } from "react";
import MainLoader from "../../components/common/MainLoader";
import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api";
import useUserStore from "../../Store/userStore";
import { toastUtils } from "../../lib/toast";
import { ArrowRight, User, Mail, Lock, Eye, EyeOff } from "lucide-react";

interface UserInformation {
  firstName: string;
  lastName: string;
  emailAddress: string;
  username: string;
  password: string;
}

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const navigate = useNavigate();

  const registerMutation = useMutation<any, any, UserInformation>({
    mutationKey: [`register-user-key`],
    mutationFn: async (payload: UserInformation) => {
      const res = await api.post("/auth/register", payload);
      return res.data;
    },
    onSuccess: (data) => {
      setFirstName("");
      setLastName("");
      setEmailAddress("");
      setUsername("");
      setPassword("");
      setCPassword("");
      // Auto-login after successful registration
      useUserStore.getState().setUser(data.data);
      toastUtils.auth.registrationSuccess();
      navigate("/dashboard");
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data;
      const derivedMessage =
        serverMessage?.message ||
        serverMessage?.error ||
        serverMessage?.errors?.[0]?.message ||
        error?.message;
      toastUtils.auth.registrationFailed(derivedMessage, () => console.log("Retry registration"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !emailAddress || !username || !password || !cpassword) {
      toastUtils.auth.validationError("Please provide all required fields", () => console.log("Focus on empty fields"));
      return;
    }
    if (password !== cpassword) {
      toastUtils.auth.passwordMismatch(() => console.log("Focus on password fields"));
      return;
    }

    registerMutation.mutate({
      firstName,
      lastName,
      emailAddress,
      username,
      password,
    });
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-200 to-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>
      
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-sm rounded-3xl border border-emerald-100/50 p-8 shadow-xl">
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-gray-600">Join Notely and start organizing your thoughts</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input 
                type="text" 
                placeholder="First name" 
                required 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input 
                type="text" 
                placeholder="Last name" 
                required 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input 
              type="email" 
              placeholder="you@example.com" 
              required 
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input 
              type="text" 
              placeholder="Username" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input 
                type={showPassword ? "text" : "password"}
                placeholder="Password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-emerald-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input 
                type={showCPassword ? "text" : "password"}
                placeholder="Confirm password" 
                required 
                value={cpassword}
                onChange={(e) => setCPassword(e.target.value)}
                className="pl-10 pr-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowCPassword(!showCPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-emerald-600 transition-colors"
              >
                {showCPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200" 
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating account...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Create Account
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link 
              to="/dashboard/login" 
              className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
      
      {registerMutation.isPending && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <MainLoader />
        </div>
      )}
    </div>
  );
};

export default Register;