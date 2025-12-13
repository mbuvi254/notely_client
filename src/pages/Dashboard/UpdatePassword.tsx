import DashboardLayout from "./Dashlayout";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useState } from "react";
import MainLoader from "../../components/common/MainLoader";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { toastUtils } from "../../lib/toast";
import { Lock, Eye, EyeOff, Shield, CheckCircle, AlertCircle, ArrowLeft, Key } from "lucide-react";

const UpdatePassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  if (newPassword !== confirmPassword) {
    toastUtils.auth.validationError("Passwords do not match");
    setIsLoading(false);
    return;
  }

  try {
    const res = await api.patch("/auth/password", {
      currentPassword,
      newPassword,
    });
    toastUtils.success("Password updated successfully!");
    navigate("/dashboard/profile");
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || "Failed to update password";
    toastUtils.error("Password update failed", message);
  } finally {
    setIsLoading(false);
  }
};


    return (
        <DashboardLayout title="Update Password" subtitle="Secure your account with a new password">
            <div className="grid gap-8 lg:grid-cols-[2fr,1fr] max-w-6xl mx-auto">
                {/* Main Form Section */}
                <div className="space-y-6">
                    {/* Password Update Card */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-8 shadow-xl">
                        <header className="space-y-4 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                    <Key className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
                                    <p className="text-sm text-gray-600">Update your account password for better security</p>
                                </div>
                            </div>
                        </header>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Current Password */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-blue-500" />
                                    Current Password
                                </label>
                                <div className="relative">
                                    <Input 
                                        type={showCurrentPassword ? "text" : "password"} 
                                        placeholder="Enter your current password" 
                                        required 
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                                    >
                                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            
                            {/* New Password */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Key className="w-4 h-4 text-emerald-500" />
                                    New Password
                                </label>
                                <div className="relative">
                                    <Input 
                                        type={showNewPassword ? "text" : "password"} 
                                        placeholder="Enter your new password" 
                                        required 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
                                    >
                                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            
                            {/* Confirm Password */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-emerald-500" />
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Input 
                                        type={showConfirmPassword ? "text" : "password"} 
                                        placeholder="Confirm your new password" 
                                        required 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 pr-10 ${
                                            confirmPassword && newPassword !== confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {confirmPassword && newPassword !== confirmPassword && (
                                    <p className="text-sm text-red-600 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        Passwords do not match
                                    </p>
                                )}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Button 
                                    type="button" 
                                    variant="outline"
                                    onClick={() => navigate("/dashboard/profile")}
                                    className="border-emerald-200 hover:bg-emerald-50 text-emerald-600 gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={isLoading || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex-1 gap-2"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Updating...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Lock className="w-4 h-4" />
                                            Update Password
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Security Tips */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Password Tips</h3>
                        </div>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span>Use at least 8 characters for better security</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span>Include uppercase and lowercase letters</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span>Add numbers and special characters</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span>Avoid using common words or personal info</span>
                            </li>
                        </ul>
                    </div>

                    {/* Security Notice */}
                    <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-3">
                            <Shield className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-blue-800">Security Notice</h3>
                        </div>
                        <p className="text-sm text-blue-700 mb-4">
                            After updating your password, you'll remain logged in for security verification.
                        </p>
                        <div className="space-y-2 text-sm text-blue-600">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                <span>Your session will be validated</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                <span>Account security will be enhanced</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <Button 
                                variant="outline" 
                                onClick={() => navigate("/dashboard/profile")}
                                className="w-full justify-start gap-3 border-emerald-200 hover:bg-emerald-50"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Profile
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={() => navigate("/dashboard/profile/update")}
                                className="w-full justify-start gap-3 border-emerald-200 hover:bg-emerald-50"
                            >
                                <Key className="w-4 h-4" />
                                Update Profile Info
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            
            {isLoading && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="text-center">
                        <MainLoader />
                        <p className="mt-4 text-gray-600">Updating your password...</p>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default UpdatePassword;