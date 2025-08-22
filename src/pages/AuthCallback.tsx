import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTimeoutReached(true), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      toast.success('Email confirmed! Redirecting to your dashboard...');
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-gray-50 px-4 py-16">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Confirming your account</CardTitle>
            <CardDescription>
              Please wait while we complete your sign-in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse-slow mb-6">Setting up your session…</div>
            {timeoutReached && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  If this takes too long, you can proceed to the dashboard or log in manually.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
                  <Button variant="outline" onClick={() => navigate('/login')}>Go to Login</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default AuthCallback;
