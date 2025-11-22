
'use client';

import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';


const profileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters.'),
});

const passwordSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters.'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters.'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});


type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
    const { user, updateUserProfile, updateUserPassword } = useAuth();
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    const {
        control: profileControl,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors }
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            displayName: user?.displayName ?? '',
        },
    });

     const {
        control: passwordControl,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors },
        reset: resetPasswordForm
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        },
    });

    const onProfileSubmit = async (data: ProfileFormData) => {
        setProfileLoading(true);
        await updateUserProfile(data.displayName);
        setProfileLoading(false);
    };

    const onPasswordSubmit = async (data: PasswordFormData) => {
        setPasswordLoading(true);
        await updateUserPassword(data.newPassword);
        setPasswordLoading(false);
        resetPasswordForm();
    };

    return (
        <div className="grid gap-6 max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Update your display name and email address.</CardDescription>
                </CardHeader>
                <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="displayName">Display Name</Label>
                            <Controller
                                name="displayName"
                                control={profileControl}
                                render={({ field }) => <Input id="displayName" {...field} />}
                            />
                            {profileErrors.displayName && <p className="text-sm text-destructive">{profileErrors.displayName.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={user?.email ?? ''} disabled />
                             <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={profileLoading}>
                             {profileLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </CardFooter>
                </form>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password here. Please choose a strong one.</CardDescription>
                </CardHeader>
                 <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                             <Controller
                                name="newPassword"
                                control={passwordControl}
                                render={({ field }) => <Input id="newPassword" type="password" {...field} />}
                            />
                            {passwordErrors.newPassword && <p className="text-sm text-destructive">{passwordErrors.newPassword.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                             <Controller
                                name="confirmPassword"
                                control={passwordControl}
                                render={({ field }) => <Input id="confirmPassword" type="password" {...field} />}
                            />
                            {passwordErrors.confirmPassword && <p className="text-sm text-destructive">{passwordErrors.confirmPassword.message}</p>}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={passwordLoading}>
                            {passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Password
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
