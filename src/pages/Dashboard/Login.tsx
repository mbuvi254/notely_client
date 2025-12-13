import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api";
import useUserStore from '../../Store/userStore';
import { useNavigate, Link } from "react-router-dom";
import MainLoader from "../../components/common/MainLoader";
import { toastUtils } from "../../lib/toast";
import { ArrowRight, Lock, Mail, Eye, EyeOff } from "lucide-react";

interface UserInformation {
  emailAddress: string;
  password: string;
}

const Login = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const loginMutation = useMutation<any, any, UserInformation>({
    mutationKey: ["login-user-key"],
    mutationFn: async (payload: UserInformation) => {
      console.log("Sending login request:", payload);
      const res = await api.post("/auth/login", payload);
      console.log("Login response:", res.data);
      return res.data;
    },
    onSuccess: (data) => {
      setEmailAddress("");
      setPassword("");
      useUserStore.getState().setUser(data.data);
      toastUtils.auth.loginSuccess();
      navigate("/dashboard");
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data;
      const derivedMessage =
        serverMessage?.message ||
        serverMessage?.error ||
        serverMessage?.errors?.[0]?.message ||
        error?.message;
      toastUtils.auth.loginFailed(derivedMessage, () => console.log("Retry login"));
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailAddress || !password) {
      toastUtils.auth.validationError("Please provide all required fields", () => console.log("Focus on empty fields"));
      return;
    }
    loginMutation.mutate({ emailAddress, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-200 to-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>
      
      <Card className="w-full max-w-md mx-auto p-8 bg-white/80 backdrop-blur-sm border border-emerald-100/50 shadow-xl">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to access your dashboard and manage your notes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="Email or username"
                  required
                  className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
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
            </div>

            <div className="flex justify-end">
              <Link 
                to="/dashboard/update-password" 
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200" 
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-gray-600">
              New here?{" "}
              <Link 
                to="/dashboard/register" 
                className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {loginMutation.isPending && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
            <MainLoader />
          </div>
        )}
      </Card>
    </div>
  );
};

export default Login;
