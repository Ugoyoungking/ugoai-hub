
'use client';

import { useState, useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '@/lib/firebase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Bell, BellOff } from 'lucide-react';

export default function NotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission | 'loading'>('loading');
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setPermission(Notification.permission);
     if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      if (messaging) {
        onMessage(messaging, (payload) => {
          console.log('Message received. ', payload);
          toast({
            title: payload.notification?.title,
            description: payload.notification?.body,
          });
        });
      }
    }
  }, [toast]);

  const requestPermission = async () => {
    if (!messaging) return;
    try {
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);

      if (permissionResult === 'granted') {
        const currentToken = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY });
        if (currentToken) {
          setFcmToken(currentToken);
          // In a real app, you would send this token to your server
          console.log('FCM Token:', currentToken);
          toast({
            title: 'Notifications Enabled',
            description: 'You will now receive push notifications.',
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Could not get token',
            description: 'No registration token available. Request permission to generate one.',
          });
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Permission Denied',
          description: 'You will not receive notifications.',
        });
      }
    } catch (error) {
      console.error('An error occurred while requesting permission. ', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not set up notifications.',
      });
    }
  };

  const sendTestNotification = async () => {
    if (!fcmToken) {
       toast({ variant: 'destructive', title: 'Error', description: 'FCM Token not available.' });
       return;
    }
    // This is a mock-up. In a real app, you'd trigger this from a server.
    // For demonstration, we'll use a local notification if the user has granted permission.
    if (permission === 'granted') {
        new Notification('Test Notification', {
            body: 'This is a test notification from UGO AI Studio!',
            icon: '/icon-192x192.png'
        });
    }
  }

  const handleToggle = (checked: boolean) => {
    if (checked) {
      requestPermission();
    } else {
        // In a real app you might want to delete the token from the server
        setFcmToken(null);
        setPermission('denied');
         toast({
            title: 'Notifications Disabled',
            description: 'You will no longer receive push notifications.',
          });
    }
  };


  if (permission === 'loading') {
    return null;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Manage how you receive notifications from UGO AI Studio.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center space-x-3">
             {permission === 'granted' ? <Bell className="text-green-500"/> : <BellOff className="text-destructive"/>}
            <div>
              <Label htmlFor="notifications" className="font-semibold">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates and alerts even when the app is in the background.
              </p>
            </div>
          </div>
          <Switch
            id="notifications"
            checked={permission === 'granted'}
            onCheckedChange={handleToggle}
            aria-label="Toggle push notifications"
          />
        </div>
        {permission === 'denied' && (
            <div className="text-sm text-center text-muted-foreground p-4 bg-secondary rounded-md">
                <p>You have disabled notifications. To re-enable them, please go to your browser settings for this site and allow notifications.</p>
            </div>
        )}
        {permission === 'granted' && fcmToken && (
             <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">You're All Set!</CardTitle>
                        <CardDescription>Your device is ready to receive notifications.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Button onClick={sendTestNotification}>Send a Test Notification</Button>
                    </CardContent>
                </Card>

                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Your FCM Token (for debugging)</Label>
                    <p className="text-xs font-mono break-all p-2 bg-secondary rounded-md">{fcmToken}</p>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
