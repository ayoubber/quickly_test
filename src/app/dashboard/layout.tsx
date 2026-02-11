import { redirect } from 'next/navigation';
import { getUser, getProfile } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signOut } from '@/actions/auth';
import { MobileSidebar } from '@/components/ui/mobile-sidebar';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { getTranslations, getLocale } from 'next-intl/server';
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
  const t = await getTranslations('dashboardNav');
  const tCommon = await getTranslations('common');
  const locale = await getLocale();

  if (!user) {
    redirect('/auth/login');
  }

  const navigation = [
    { name: t('dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('profile'), href: '/dashboard/profile', icon: User },
    { name: t('links'), href: '/dashboard/links', icon: LinkIcon },
    { name: t('cards'), href: '/dashboard/cards', icon: CreditCard },
    { name: t('analytics'), href: '/dashboard/analytics', icon: BarChart3 },
    { name: t('settings'), href: '/dashboard/settings', icon: Settings },
  ];

  const sidebarContent = (
    <>
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

      {/* Language Toggle */}
      <div className="px-6 py-2">
        <LanguageToggle locale={locale} />
      </div>

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
            className="w-full justify-start text-gray-400 hover:text-white"
          >
            <LogOut className="w-4 h-4 me-2" />
            {tCommon('logout')}
          </Button>
        </form>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex">
      {/* Mobile Sidebar */}
      <MobileSidebar>
        {sidebarContent}
      </MobileSidebar>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-brand-navy-dark border-r border-white/10 fixed h-full flex-col">
        {sidebarContent}
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ms-64 p-4 md:p-8 pt-16 md:pt-8">
        {children}
      </main>
    </div>
  );
}
