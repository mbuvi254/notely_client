import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { ArrowRight, BookOpen, Lock, Users, Zap } from "lucide-react";
import NotelyNav from "./NotelyNav";
import NotelyFooter from "./NotelyFooter";

const LandingPage = () => {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <div className="flex-1 w-full">
        <NotelyNav />
        
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
          {/* Hero Section */}
          <section className="relative px-4 py-20 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Notely
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground">
                  Your intelligent note-taking companion. Organize, share, and collaborate with ease.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2" asChild>
                  <Link to="/dashboard/register">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/public/notes">
                    Browse Public Notes
                    <BookOpen className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="px-4 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Notely?</h2>
                <p className="text-xl text-muted-foreground">
                  Powerful features designed for modern note-taking
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 text-center space-y-4 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Private & Secure</h3>
                  <p className="text-sm text-muted-foreground">
                    Your personal notes are encrypted and accessible only to you
                  </p>
                </Card>

                <Card className="p-6 text-center space-y-4 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Public Sharing</h3>
                  <p className="text-sm text-muted-foreground">
                    Share your knowledge with the community through public notes
                  </p>
                </Card>

                <Card className="p-6 text-center space-y-4 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Lightning Fast</h3>
                  <p className="text-sm text-muted-foreground">
                    Instant search and seamless organization of all your notes
                  </p>
                </Card>

                <Card className="p-6 text-center space-y-4 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Rich Editor</h3>
                  <p className="text-sm text-muted-foreground">
                    Create beautiful notes with our intuitive rich text editor
                  </p>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="px-4 py-20 bg-muted/30">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Ready to start organizing your thoughts?
                </h2>
                <p className="text-xl text-muted-foreground">
                  Join thousands of users who trust Notely for their note-taking needs
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2" asChild>
                  <Link to="/dashboard/register">
                    Create Free Account
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/dashboard/login">
                    Sign In
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Footer Preview */}
          <section className="px-4 py-12 border-t border-border/50">
            <div className="max-w-6xl mx-auto text-center text-muted-foreground">
              <p className="mb-4">
                Already have an account?{" "}
                <Link to="/dashboard/login" className="text-primary hover:underline">
                  Sign in here
                </Link>
              </p>
              <p>
                Want to explore?{" "}
                <Link to="/public/notes" className="text-primary hover:underline">
                  Browse public notes
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>

      <NotelyFooter />
    </div>
  );
};

export default LandingPage;
