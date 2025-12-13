import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { ArrowRight, BookOpen, Lock, Users, Zap } from "lucide-react";
import NotelyLayout from "./NotelyLayout";

const LandingPage = () => {
  return (
    <NotelyLayout title="">
      <div className="relative">
        
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-200 to-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-to-r from-teal-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        {/* Hero Section */}
        <section className="relative px-4 py-24 md:py-32 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Notely
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                  Your intelligent note-taking companion. <span className="font-medium text-gray-800">Organize, share, and collaborate</span> with ease.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="gap-2 px-8 py-6 text-base font-medium bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
                  asChild
                >
                  <Link to="/dashboard/register" className="flex items-center">
                    Get Started for Free
                    <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="gap-2 px-8 py-6 text-base font-medium border-2 border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all duration-300"
                  asChild
                >
                  <Link to="/public/notes" className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-1" />
                    Browse Public Notes
                  </Link>
                </Button>
              </div>
              
             
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative px-4 py-20 md:py-28 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-4 py-2 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-medium mb-4">
                Why Choose Notely?
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Powerful features for <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">modern note-taking</span>
              </h2>
              <p className="text-xl text-gray-600">
                Everything you need to capture, organize, and share your thoughts
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Lock className="w-8 h-8 text-emerald-600" />,
                  title: "Private & Secure",
                  description: "Your personal notes are encrypted and accessible only to you",
                  gradient: "from-emerald-100 to-teal-100"
                },
                {
                  icon: <Users className="w-8 h-8 text-teal-600" />,
                  title: "Public Sharing",
                  description: "Share your knowledge with the community through public notes",
                  gradient: "from-teal-100 to-cyan-100"
                },
                {
                  icon: <Zap className="w-8 h-8 text-cyan-600" />,
                  title: "Lightning Fast",
                  description: "Instant search and seamless organization of all your notes",
                  gradient: "from-cyan-100 to-emerald-100"
                },
                {
                  icon: <BookOpen className="w-8 h-8 text-green-600" />,
                  title: "Rich Editor",
                  description: "Create beautiful notes with our intuitive rich text editor",
                  gradient: "from-green-100 to-emerald-100"
                }
              ].map((feature, index) => (
                <Card 
                  key={index}
                  className={`p-8 text-left space-y-4 bg-gradient-to-br ${feature.gradient} border-0 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
                >
                  <div className={`w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-sm`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative px-4 py-20 md:py-28 bg-gradient-to-r from-emerald-600 to-teal-600 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC42Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold">
                  Ready to transform your note-taking?
                </h2>
                <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                  Join thousands of users who trust Notely to organize their thoughts and ideas
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="gap-2 px-8 py-6 text-base font-medium bg-white text-emerald-700 hover:bg-white/90 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
                  asChild
                >
                  <Link to="/dashboard/register" className="flex items-center">
                    Start Your Free Trial
                    <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="gap-2 px-8 py-6 text-base font-medium border-2 border-white/50 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/70 transition-all duration-300 text-white shadow-lg"
                  asChild
                >
                  <Link to="/dashboard/login" className="flex items-center">
                    Sign In to Your Account
                  </Link>
                </Button>
              </div>
              
           
            </div>
          </div>
        </section>
      </div>
    </NotelyLayout>
  );
};

export default LandingPage;
