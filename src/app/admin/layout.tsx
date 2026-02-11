import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signOut } from '@/actions/auth';
import Logo from '@/components/ui/logo';
import { MobileSidebar } from '@/components/ui/mobile-sidebar';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { getTranslations, getLocale } from 'next-intl/server';
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    CreditCard,
    Users,
    HelpCircle,
    LogOut,
    Settings,
    FileText,
} from 'lucide-react';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const t = await getTranslations('admin');
    const tCommon = await getTranslations('common');
    const locale = await getLocale();

    if (!user) {
        redirect('/auth/login');
    }

    // Check if user is admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        redirect('/dashboard');
    }

    const navigation = [
        { name: t('dashboard'), href: '/admin', icon: LayoutDashboard },
        { name: t('orders'), href: '/admin/orders', icon: ShoppingCart },
        { name: t('products'), href: '/admin/products', icon: Package },
        { name: t('clients'), href: '/admin/clients', icon: Users },
        { name: t('blogs'), href: '/admin/blogs', icon: FileText },
        { name: t('support'), href: '/admin/support', icon: HelpCircle },
    ];

    const sidebarContent = (
        <>
            <div className="p-6">
                <Link href="/admin">
                    <Logo />
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

            {/* Language Toggle */}
            <div className="px-6 py-2">
                <LanguageToggle locale={locale} />
            </div>

            {/* Profile Section */}
            <div className="p-4 border-t border-white/10 mt-auto">
                <div className="flex items-center gap-3 px-4 py-3">
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
        <div className="flex min-h-screen">
            {/* Mobile Sidebar */}
            <MobileSidebar>
                {sidebarContent}
            </MobileSidebar>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 bg-brand-navy-dark border-r border-white/10 flex-col fixed inset-y-0 z-50">
                {sidebarContent}
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ms-64 p-4 md:p-8 pt-16 md:pt-8">
                {children}
            </main>
        </div>
    );
}
