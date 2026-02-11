'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { Users, Search, Eye, Ban, CheckCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface Client {
    id: string;
    full_name: string | null;
    username: string | null;
    bio: string | null;
    avatar_url: string | null;
    is_active: boolean;
    created_at: string;
    links_count?: number;
}

export default function AdminClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const supabase = createClient();

    useEffect(() => {
        loadClients();
    }, []);

    async function loadClients() {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'client')
            .order('created_at', { ascending: false });

        // Get link counts for each client
        if (data) {
            const clientsWithCounts = await Promise.all(
                data.map(async (client) => {
                    const { count } = await supabase
                        .from('links')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', client.id);
                    return { ...client, links_count: count || 0 };
                })
            );
            setClients(clientsWithCounts);
        }

        setIsLoading(false);
    }

    async function toggleClientStatus(clientId: string, currentStatus: boolean) {
        const { error } = await supabase
            .from('profiles')
            .update({ is_active: !currentStatus })
            .eq('id', clientId);

        if (error) {
            toast.error('Failed to update status');
        } else {
            toast.success(currentStatus ? 'Client disabled' : 'Client enabled');
            loadClients();
        }
    }

    const filteredClients = clients.filter(client =>
        client.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return <div className="animate-pulse">Loading clients...</div>;
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Clients</h1>
                    <p className="text-gray-400">Manage registered clients</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold">{clients.length}</div>
                    <div className="text-sm text-gray-400">Total Clients</div>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or username..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                    />
                </div>
            </div>

            {/* Clients Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left p-4 text-sm font-medium text-gray-400">Client</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-400">Username</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-400">Links</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-400">Joined</th>
                                    <th className="text-right p-4 text-sm font-medium text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredClients.map((client) => (
                                    <tr key={client.id} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-gold to-brand-gold-light flex items-center justify-center text-brand-navy font-bold">
                                                    {client.full_name?.[0] || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{client.full_name || 'Unknown'}</p>
                                                    <p className="text-sm text-gray-400 truncate max-w-48">{client.bio || 'No bio'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {client.username ? (
                                                <code className="text-brand-gold">@{client.username}</code>
                                            ) : (
                                                <span className="text-gray-500">Not set</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className="font-medium">{client.links_count}</span>
                                            <span className="text-gray-400 ml-1">links</span>
                                        </td>
                                        <td className="p-4">
                                            {client.is_active ? (
                                                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded flex items-center gap-1 w-fit">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded flex items-center gap-1 w-fit">
                                                    <Ban className="w-3 h-3" />
                                                    Disabled
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-400">
                                            {new Date(client.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {client.username && (
                                                    <Button size="sm" variant="ghost" asChild>
                                                        <a href={`/u/${client.username}`} target="_blank">
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => toggleClientStatus(client.id, client.is_active)}
                                                    className={client.is_active ? 'text-red-400' : 'text-green-400'}
                                                >
                                                    {client.is_active ? (
                                                        <>
                                                            <Ban className="w-4 h-4 mr-1" />
                                                            Disable
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="w-4 h-4 mr-1" />
                                                            Enable
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredClients.length === 0 && (
                        <div className="p-8 text-center text-gray-400">
                            No clients found
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
