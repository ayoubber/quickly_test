import { redirect } from 'next/navigation';
import { getUser, getProfile } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signOut } from '@/actions/auth';
import {
  LayoutDashboard,
  User,
  Link as LinkIcon,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Zap,
} from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  const profile = await getProfile();

  if (!user) {
    redirect('/auth/login');
  }

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Links', href: '/dashboard/links', icon: LinkIcon },
    { name: 'Cards', href: '/dashboard/cards', icon: CreditCard },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-navy-dark border-r border-white/10 fixed h-full flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-gold to-brand-gold-light rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-brand-navy" />
            </div>
            <span className="text-xl font-bold gradient-text">Quickly</span>
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
                <Icon className="w-5 h-5 group-hover:text-brand-gold transition" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-gold to-brand-gold-light flex items-center justify-center text-brand-navy font-bold">
              {profile?.full_name?.[0] || user.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
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
