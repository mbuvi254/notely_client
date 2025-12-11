import DashboardLayout from "./Dashlayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import MainLoader from "../../components/common/MainLoader";
import useUserStore from "../../Store/userStore";
import { useNavigate } from "react-router-dom";





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
    <DashboardLayout title="Author Profile" subtitle="Manage your author profile">
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-border/60 border-b pb-6">
              <div className="flex flex-wrap items-center gap-5">
                <div className="bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-semibold">
                  DM
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl font-semibold">
                    {author.firstName} {author.lastName}
                  </CardTitle>
                  <CardDescription>{author.role} • {author.location}</CardDescription>
                </div>
                <Button variant="secondary" className="mt-4 w-full justify-center" asChild>
                  <Link to="/dashboard/profile/update/password">Update password</Link>
                </Button>
                <Button onClick={handleUpdateProfile} disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-wide">Email</p>
                  <p className="text-foreground font-medium">{author.emailAddress}</p>
                </div>
              
              </div>
           
            </CardContent>
          </Card>

     
        </div>
      </div>
      
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <MainLoader />
        </div>
      )}
    </DashboardLayout>
  );
};

export default AuthorProfile;