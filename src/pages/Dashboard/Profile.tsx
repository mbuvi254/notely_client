import DashboardLayout from "./Dashlayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import MainLoader from "../../components/common/MainLoader";
import useUserStore from "../../Store/userStore";
import { useNavigate } from "react-router-dom";
import { User, Mail, MapPin, Edit, Lock, Shield, Activity } from "lucide-react";





const AuthorProfile = () => {
  const { firstName, lastName, username, emailAddress, setUser, clearUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    navigate("/dashboard/profile/update");
    setIsLoading(false);
  };

  const author = {
        firstName: firstName,
        lastName: lastName,
        role: "Author",
        location: "Nairobi, Kenya",
        emailAddress: emailAddress,
  };

  return (
    <DashboardLayout title="Author Profile" subtitle="Manage your author profile and account settings">
      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        {/* Main Profile Section */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-emerald-100/50 shadow-xl">
            <CardHeader className="border-emerald-100/50 border-b pb-8">
              <div className="flex flex-wrap items-center gap-6">
                <div className="relative">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-semibold shadow-lg">
                    {firstName?.[0]}{lastName?.[0] || "U"}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Activity className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
                    {author.firstName} {author.lastName}
                  </CardTitle>
                  <CardDescription className="text-gray-600 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    {author.role} • 
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    {author.location}
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-3">
                  <Button 
                    variant="outline" 
                    className="border-emerald-200 hover:bg-emerald-50 text-emerald-600 gap-2"
                    asChild
                  >
                    <Link to="/dashboard/profile/update/password">
                      <Lock className="w-4 h-4" />
                      Update password
                    </Link>
                  </Button>
                  <Button 
                    onClick={handleUpdateProfile} 
                    disabled={isLoading}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    {isLoading ? "Updating..." : "Update Profile"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              {/* Profile Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-500" />
                  Profile Information
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-100/50">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="w-4 h-4 text-emerald-600" />
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Email Address</p>
                    </div>
                    <p className="text-gray-800 font-medium">{author.emailAddress}</p>
                  </div>
                  <div className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-100/50">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="w-4 h-4 text-emerald-600" />
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Username</p>
                    </div>
                    <p className="text-gray-800 font-medium">{username || "Not set"}</p>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  Account Status
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mx-auto mb-2 animate-pulse"></div>
                    <p className="text-sm font-medium text-emerald-700">Active</p>
                    <p className="text-xs text-gray-600">Account is active</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-2"></div>
                    <p className="text-sm font-medium text-blue-700">Verified</p>
                    <p className="text-xs text-gray-600">Email verified</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-2"></div>
                    <p className="text-sm font-medium text-purple-700">Author</p>
                    <p className="text-xs text-gray-600">Full access</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="bg-white/80 backdrop-blur-sm border-emerald-100/50 shadow-lg">
            <CardHeader className="pb-4">
              <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 border-emerald-200 hover:bg-emerald-50"
                asChild
              >
                <Link to="/dashboard/profile/update">
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 border-emerald-200 hover:bg-emerald-50"
                asChild
              >
                <Link to="/dashboard/profile/update/password">
                  <Lock className="w-4 h-4" />
                  Change Password
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card className="bg-white/80 backdrop-blur-sm border-emerald-100/50 shadow-lg">
            <CardHeader className="pb-4">
              <h3 className="text-lg font-semibold text-gray-800">Account Details</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="text-sm font-medium text-gray-800">2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Account Type</span>
                <span className="text-sm font-medium text-emerald-600">Author</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <span className="text-sm font-medium text-emerald-600">Active</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <MainLoader />
            <p className="mt-4 text-gray-600">Updating profile...</p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AuthorProfile;