import { AlertTriangle, Lock, Shield } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function SecurityNotice() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Enhanced Security Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertTitle>Privacy Protection Active</AlertTitle>
            <AlertDescription>
              We've enhanced our security to protect mechanic and user privacy. 
              Sensitive information like phone numbers and addresses are now only 
              visible to authenticated users.
            </AlertDescription>
          </Alert>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              What's Protected:
            </h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Mechanic phone numbers and addresses</li>
              <li>• User identities in reviews</li>
              <li>• Location-based search requires login</li>
              <li>• Personal contact information</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => navigate('/login')} className="flex-1">
              Sign In to Access Full Features
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="flex-1">
              Continue Browsing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}