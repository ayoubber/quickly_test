import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CreditCard, ShoppingCart, Eye, TrendingUp, AlertCircle } from 'lucide-react';

export default async function AdminPage() {
    const supabase = await createClient();

    // Get counts
    const { count: clientsCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'client');

    const { count: cardsTotal } = await supabase
        .from('cards')
        .select('*', { count: 'exact', head: true });

    const { count: cardsAssigned } = await supabase
        .from('cards')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'assigned');

    const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

    const { count: viewsCount } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true });

    // Recent orders
    const { data: recentOrders } = await supabase
        .from('orders')
        .select('*, profiles(full_name, username)')
        .order('created_at', { ascending: false })
        .limit(5);

    // Recent signups
    const { data: recentSignups } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client')
        .order('created_at', { ascending: false })
        .limit(5);

    const stats = [
        { name: 'Total Clients', value: clientsCount || 0, icon: Users, color: 'text-blue-400' },
        { name: 'Cards in Stock', value: (cardsTotal || 0) - (cardsAssigned || 0), icon: CreditCard, color: 'text-green-400' },
        { name: 'Cards Assigned', value: cardsAssigned || 0, icon: CreditCard, color: 'text-brand-gold' },
        { name: 'Total Orders', value: ordersCount || 0, icon: ShoppingCart, color: 'text-purple-400' },
        { name: 'Page Views', value: viewsCount || 0, icon: Eye, color: 'text-pink-400' },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-gray-400">
                    Overview of your Quickly platform
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-5 gap-4 mb-8">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.name}>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <Icon className={`w-5 h-5 ${stat.color}`} />
                                    <TrendingUp className="w-4 h-4 text-gray-500" />
                                </div>
                                <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                                <div className="text-sm text-gray-400">{stat.name}</div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5" />
                            Recent Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentOrders && recentOrders.length > 0 ? (
                            <div className="space-y-4">
                                {recentOrders.map((order: any) => (
                                    <div key={order.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{order.profiles?.full_name || 'Unknown'}</p>
                                            <p className="text-sm text-gray-400">Order #{order.id.slice(0, 8)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{order.amount?.toLocaleString()} DZD</p>
                                            <span className={`text-xs px-2 py-1 rounded ${order.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                                                    order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">No orders yet</p>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Signups */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Recent Signups
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentSignups && recentSignups.length > 0 ? (
                            <div className="space-y-4">
                                {recentSignups.map((client: any) => (
                                    <div key={client.id} className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-gold to-brand-gold-light flex items-center justify-center text-brand-navy font-bold">
                                            {client.full_name?.[0] || '?'}
                                        </div>
                                        <div>
                                            <p className="font-medium">{client.full_name || 'Unknown'}</p>
                                            <p className="text-sm text-gray-400">
                                                @{client.username || 'no-username'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">No clients yet</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Alerts */}
            <div className="mt-8">
                <Card className="border-yellow-500/30 bg-yellow-500/5">
                    <CardContent className="flex items-center gap-4 pt-6">
                        <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                        <div>
                            <p className="font-medium">Low stock alert</p>
                            <p className="text-sm text-gray-400">
                                {(cardsTotal || 0) - (cardsAssigned || 0) < 10
                                    ? 'Card inventory is running low. Consider restocking soon.'
                                    : 'Inventory levels are healthy.'}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
