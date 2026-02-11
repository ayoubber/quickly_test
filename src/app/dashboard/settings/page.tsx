'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateProfile } from '@/actions/profile';
import { signOut } from '@/actions/auth';
import { User, Mail, Lock, Bell, Trash2, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(false);

    async function handleUpdateProfile(formData: FormData) {
        setIsLoading(true);
        const result = await updateProfile(formData);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Settings updated');
        }
        setIsLoading(false);
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-gray-400">
                    Manage your account settings
                </p>
            </div>

            <div className="max-w-2xl space-y-6">
                {/* Account Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Account Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={handleUpdateProfile} className="space-y-4">
                            <Input
                                name="fullName"
                                label="Full Name"
                                placeholder="Your name"
                            />
                            <div className="space-y-1">
                                <Input
                                    name="username"
                                    label="Username"
                                    placeholder="username"
                                />
                                <p className="text-sm text-gray-400">This is your public profile URL: quickly.website/u/username</p>
                            </div>
                            <Button type="submit" isLoading={isLoading}>
                                Save Changes
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Email */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="w-5 h-5" />
                            Email
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">
                                    To change your email, please contact support.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Password */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="w-5 h-5" />
                            Password
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-400 text-sm mb-4">
                            Use the forgot password feature to reset your password.
                        </p>
                        <Button variant="outline" asChild>
                            <a href="/auth/forgot-password">Reset Password</a>
                        </Button>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="w-5 h-5" />
                            Notifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <label className="flex items-center justify-between">
                                <span>Email notifications for new views</span>
                                <input type="checkbox" className="toggle" />
                            </label>
                            <label className="flex items-center justify-between">
                                <span>Weekly analytics summary</span>
                                <input type="checkbox" className="toggle" defaultChecked />
                            </label>
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-red-500/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-400">
                            <Trash2 className="w-5 h-5" />
                            Danger Zone
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Sign Out</p>
                                <p className="text-sm text-gray-400">Sign out from your account</p>
                            </div>
                            <form action={signOut}>
                                <Button variant="outline" type="submit">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sign Out
                                </Button>
                            </form>
                        </div>
                        <hr className="border-white/10" />
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-red-400">Delete Account</p>
                                <p className="text-sm text-gray-400">Permanently delete your account and data</p>
                            </div>
                            <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                                Delete Account
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
