'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { ShoppingCart, Search, CheckCircle, Clock, XCircle, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
    id: string;
    user_id: string;
    product_id: string;
    status: string;
    amount: number;
    created_at: string;
    profiles?: { full_name: string; username: string } | null;
    products?: { name: string } | null;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'cancelled'>('all');

    const supabase = createClient();

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        const { data } = await supabase
            .from('orders')
            .select('*, profiles(full_name, username), products(name)')
            .order('created_at', { ascending: false });

        setOrders((data as any) || []);
        setIsLoading(false);
    }

    async function updateOrderStatus(orderId: string, newStatus: string) {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus as any })
            .eq('id', orderId);

        if (error) {
            toast.error('Failed to update order');
        } else {
            toast.success('Order updated');
            loadOrders();
        }
    }

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(o => o.status === filter);

    const counts = {
        all: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        paid: orders.filter(o => o.status === 'paid').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
    };

    function getStatusBadge(status: string) {
        switch (status) {
            case 'paid':
                return <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3" />Paid</span>;
            case 'pending':
                return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded flex items-center gap-1 w-fit"><Clock className="w-3 h-3" />Pending</span>;
            case 'cancelled':
                return <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded flex items-center gap-1 w-fit"><XCircle className="w-3 h-3" />Cancelled</span>;
            default:
                return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded">{status}</span>;
        }
    }

    if (isLoading) {
        return <div className="animate-pulse">Loading orders...</div>;
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Orders</h1>
                    <p className="text-gray-400">Manage customer orders</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                {[
                    { key: 'all', label: 'All' },
                    { key: 'pending', label: 'Pending' },
                    { key: 'paid', label: 'Paid' },
                    { key: 'cancelled', label: 'Cancelled' },
                ].map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setFilter(key as typeof filter)}
                        className={`px-4 py-2 rounded-lg transition ${filter === key
                            ? 'bg-brand-gold text-brand-navy'
                            : 'bg-white/5 hover:bg-white/10'
                            }`}
                    >
                        {label} ({counts[key as keyof typeof counts]})
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left p-4 text-sm font-medium text-gray-400">Order ID</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-400">Customer</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-400">Product</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-400">Amount</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-400">Date</th>
                                    <th className="text-right p-4 text-sm font-medium text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="p-4">
                                            <code className="text-sm">#{order.id.slice(0, 8)}</code>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-medium">{order.profiles?.full_name || 'Unknown'}</p>
                                            <p className="text-sm text-gray-400">@{order.profiles?.username || 'N/A'}</p>
                                        </td>
                                        <td className="p-4">
                                            {order.products?.name || 'Unknown Product'}
                                        </td>
                                        <td className="p-4 font-semibold">
                                            {order.amount?.toLocaleString()} DZD
                                        </td>
                                        <td className="p-4">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="p-4 text-gray-400">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {order.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => updateOrderStatus(order.id, 'paid')}
                                                        >
                                                            Mark Paid
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-red-400"
                                                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </>
                                                )}
                                                <Button size="sm" variant="ghost">
                                                    <MessageCircle className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredOrders.length === 0 && (
                        <div className="p-8 text-center text-gray-400">
                            No orders found
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
