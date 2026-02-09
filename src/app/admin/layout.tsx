import { redirect } from 'next/navigation';
import { getUser, getProfile } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signOut } from '@/actions/auth';
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    CreditCard,
    Users,
    HelpCircle,
    LogOut,
    Zap,
    Shield,
} from 'lucide-react';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUser();
    const profile = await getProfile();

    if (!user) {
        redirect('/auth/login');
    }

    // Check if user is admin
    if (profile?.role !== 'admin') {
        redirect('/dashboard');
    }

    const navigation = [
        { name: 'Overview', href: '/admin', icon: LayoutDashboard },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Cards', href: '/admin/cards', icon: CreditCard },
        { name: 'Clients', href: '/admin/clients', icon: Users },
        { name: 'Support', href: '/admin/support', icon: HelpCircle },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-brand-navy-dark border-r border-white/10 fixed h-full flex flex-col">
                {/* Logo */}
                <div className="p-6">
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <span className="text-xl font-bold text-white">Quickly</span>
                            <span className="block text-xs text-red-400">Admin Panel</span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition group"
                            >
                                <Icon className="w-5 h-5 group-hover:text-red-400 transition" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Back to Dashboard */}
                <div className="p-4 border-t border-white/10">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white transition">
                        <Zap className="w-4 h-4" />
                        Back to Dashboard
                    </Link>

                    <div className="flex items-center gap-3 px-4 py-3 mt-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold">
                            {profile?.full_name?.[0] || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{profile?.full_name || 'Admin'}</p>
                            <p className="text-xs text-red-400">Administrator</p>
                        </div>
                    </div>

                    <form action={signOut} className="mt-2">
                        <Button
                            type="submit"
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-gray-400 hover:text-white"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
