import DashboardLayout from "./Dashlayout";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useState } from "react";
import MainLoader from "../../components/common/MainLoader";
import useUserStore from "../../Store/userStore";
import toastUtils from "../../lib/toast";
import api from "../../lib/api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { User, Mail, Shield, Lock, Save, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";


const UpdateProfile = () => {
  const { firstName: storeFirstName, lastName: storeLastName, username: storeUsername, emailAddress: storeEmail, setUser, clearUser } = useUserStore();

  const [firstName, setFirstName] = useState(storeFirstName);
  const [lastName, setLastName] = useState(storeLastName);
  const [username, setUsername] = useState(storeUsername);
  const [emailAddress, setEmailAddress] = useState(storeEmail);

  const navigate = useNavigate();

  const profileMutation = useMutation({
    mutationFn: async (data: { firstName: string; lastName: string; username: string; emailAddress: string }) => {
      const res = await api.patch("/users/profile", data);
      return res.data;
    },
    onSuccess: (data) => {
      toastUtils.dismiss();
      toastUtils.success("Profile updated!", "Your profile has been updated. Please login again.");
      setUser({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        emailAddress: data.emailAddress,
      });
      
   
      setTimeout(() => {
        clearUser();
        navigate("/dashboard/login");
      }, 2000);
    },
    onError: (error: any, variables) => {
      toastUtils.dismiss();
      const message = error?.response?.data?.message || error?.message || "Failed to update profile";
      toastUtils.error("Profile update failed", message, "Retry", () => {
        profileMutation.mutate(variables);
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !username || !emailAddress) {
      toastUtils.auth.validationError("All fields are required");
      return;
    }

    profileMutation.mutate({ firstName, lastName, username, emailAddress });
  };

  return (
    <DashboardLayout title="Update Profile" subtitle="Refresh your personal information and account settings">
      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <section className="space-y-6">
          {/* Personal Details Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-8 shadow-xl">
            <header className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Personal Details</h2>
                  <p className="text-sm text-gray-600">Update your profile information that appears across the platform</p>
                </div>
              </div>
            </header>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-500" />
                  First Name
                </label>
                <Input 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  placeholder="Enter your first name"
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-500" />
                  Last Name
                </label>
                <Input 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                  placeholder="Enter your last name"
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-500" />
                  Username
                </label>
                <Input 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="Choose a username"
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-500" />
                  Email Address
                </label>
                <Input 
                  type="email" 
                  value={emailAddress} 
                  onChange={(e) => setEmailAddress(e.target.value)} 
                  placeholder="your.email@example.com"
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
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
              disabled={profileMutation.isPending}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 gap-2"
            >
              {profileMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </span>
              )}
            </Button>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Security Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Security</h3>
                <p className="text-sm text-gray-600">Manage your account security</p>
              </div>
            </div>
            <div className="space-y-3">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate("/dashboard/profile/update/password")}
                className="w-full justify-start gap-3 border-blue-200 hover:bg-blue-50 text-blue-600"
              >
                <Lock className="w-4 h-4" />
                Change Password
              </Button>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Update Tips</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Profile updates will require you to login again</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Username changes affect your login credentials</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Email updates require verification</span>
              </li>
            </ul>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50/80 backdrop-blur-sm rounded-2xl border border-yellow-200/50 p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-yellow-800">Important Notice</h3>
            </div>
            <p className="text-sm text-yellow-700">
              After updating your profile, you will be automatically logged out and redirected to the login page to verify your new credentials.
            </p>
          </div>
        </aside>
      </form>

      {profileMutation.isPending && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <MainLoader />
            <p className="mt-4 text-gray-600">Updating your profile...</p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UpdateProfile;
