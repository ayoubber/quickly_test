'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { CreditCard, Search, UserPlus, Ban, CheckCircle, Clock, Package } from 'lucide-react';
import { toast } from 'sonner';

interface CardItem {
    id: string;
    card_uid: string;
    status: string;
    assigned_to: string | null;
    activated_at: string | null;
    created_at: string;
    profiles?: { full_name: string; username: string } | null;
}

export default function AdminCardsPage() {
    const [cards, setCards] = useState<CardItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'in_stock' | 'assigned' | 'disabled'>('all');

    const supabase = createClient();

    useEffect(() => {
        loadCards();
    }, []);

    async function loadCards() {
        let query = supabase
            .from('cards')
            .select('*, profiles(full_name, username)')
            .order('created_at', { ascending: false });

        const { data } = await query;
        setCards((data as any) || []);
        setIsLoading(false);
    }

    async function handleStatusChange(cardId: string, newStatus: string) {
        const { error } = await supabase
            .from('cards')
            .update({ status: newStatus as any })
            .eq('id', cardId);

        if (error) {
            toast.error('Failed to update status');
        } else {
            toast.success('Card status updated');
            loadCards();
        }
    }

    const filteredCards = cards.filter(card => {
        const matchesSearch = card.card_uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (card.profiles?.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (card.profiles?.username?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' || card.status === filter;
        return matchesSearch && matchesFilter;
    });

    const counts = {
        all: cards.length,
        in_stock: cards.filter(c => c.status === 'in_stock').length,
        assigned: cards.filter(c => c.status === 'assigned').length,
        disabled: cards.filter(c => c.status === 'disabled').length,
    };

    function getStatusBadge(status: string) {
        switch (status) {
            case 'assigned':
                return <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">Assigned</span>;
            case 'in_stock':
                return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">In Stock</span>;
            case 'disabled':
                return <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">Disabled</span>;
            default:
                return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded">{status}</span>;
        }
    }

    if (isLoading) {
        return <div className="animate-pulse">Loading cards...</div>;
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Card Inventory</h1>
                    <p className="text-gray-400">Manage NFC & QR cards</p>
                </div>
                <Button>
                    <Package className="w-4 h-4 mr-2" />
                    Add Cards
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                    { key: 'all', label: 'Total', icon: CreditCard, color: 'text-blue-400' },
                    { key: 'in_stock', label: 'In Stock', icon: Clock, color: 'text-yellow-400' },
                    { key: 'assigned', label: 'Assigned', icon: CheckCircle, color: 'text-green-400' },
                    { key: 'disabled', label: 'Disabled', icon: Ban, color: 'text-red-400' },
                ].map(({ key, label, icon: Icon, color }) => (
                    <button
                        key={key}
                        onClick={() => setFilter(key as typeof filter)}
                        className={`p-4 rounded-lg border transition ${filter === key
                            ? 'bg-white/10 border-white/20'
                            : 'bg-white/5 border-transparent hover:bg-white/10'
                            }`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Icon className={`w-4 h-4 ${color}`} />
                            <span className="text-sm text-gray-400">{label}</span>
                        </div>
                        <div className="text-2xl font-bold">{counts[key as keyof typeof counts]}</div>
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by card UID or assigned user..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                    />
                </div>
            </div>

            {/* Cards Table */}
            <Card>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left p-4 text-sm font-medium text-gray-400">Card UID</th>
                                <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                                <th className="text-left p-4 text-sm font-medium text-gray-400">Assigned To</th>
                                <th className="text-left p-4 text-sm font-medium text-gray-400">Created</th>
                                <th className="text-right p-4 text-sm font-medium text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCards.map((card) => (
                                <tr key={card.id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="p-4">
                                        <code className="text-brand-gold">{card.card_uid}</code>
                                    </td>
                                    <td className="p-4">{getStatusBadge(card.status)}</td>
                                    <td className="p-4">
                                        {card.profiles ? (
                                            <div>
                                                <p className="font-medium">{card.profiles.full_name}</p>
                                                <p className="text-sm text-gray-400">@{card.profiles.username}</p>
                                            </div>
                                        ) : (
                                            <span className="text-gray-500">—</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-gray-400">
                                        {new Date(card.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {card.status === 'in_stock' && (
                                                <Button size="sm" variant="outline">
                                                    <UserPlus className="w-4 h-4 mr-1" />
                                                    Assign
                                                </Button>
                                            )}
                                            {card.status === 'assigned' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-400"
                                                    onClick={() => handleStatusChange(card.id, 'disabled')}
                                                >
                                                    <Ban className="w-4 h-4 mr-1" />
                                                    Disable
                                                </Button>
                                            )}
                                            {card.status === 'disabled' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleStatusChange(card.id, 'in_stock')}
                                                >
                                                    Re-enable
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredCards.length === 0 && (
                        <div className="p-8 text-center text-gray-400">
                            No cards found
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
