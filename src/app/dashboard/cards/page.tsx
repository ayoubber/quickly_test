'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { CreditCard, Plus, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { activateCard } from '@/actions/cards';

interface CardItem {
    id: string;
    card_uid: string;
    status: string;
    activated_at: string | null;
    created_at: string;
}

export default function CardsPage() {
    const [cards, setCards] = useState<CardItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showActivateForm, setShowActivateForm] = useState(false);
    const [activationCode, setActivationCode] = useState('');
    const [isActivating, setIsActivating] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        loadCards();
    }, []);

    async function loadCards() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('cards')
            .select('*')
            .eq('assigned_to', user.id)
            .order('activated_at', { ascending: false });

        setCards(data || []);
        setIsLoading(false);
    }

    async function handleActivate(e: React.FormEvent) {
        e.preventDefault();
        if (!activationCode) return;

        setIsActivating(true);
        const result = await activateCard(activationCode);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Card activated successfully!');
            setActivationCode('');
            setShowActivateForm(false);
            loadCards();
        }
        setIsActivating(false);
    }

    function getStatusIcon(status: string) {
        switch (status) {
            case 'assigned':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'in_stock':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'disabled':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return null;
        }
    }

    function getStatusLabel(status: string) {
        switch (status) {
            case 'assigned':
                return <span className="text-green-400">Active</span>;
            case 'in_stock':
                return <span className="text-yellow-400">Pending</span>;
            case 'disabled':
                return <span className="text-red-400">Disabled</span>;
            default:
                return <span className="text-gray-400">{status}</span>;
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
                    <h1 className="text-3xl font-bold mb-2">Your Cards</h1>
                    <p className="text-gray-400">
                        Manage your NFC & QR cards
                    </p>
                </div>
                <Button onClick={() => setShowActivateForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Activate Card
                </Button>
            </div>

            {/* Activate Card Form */}
            {showActivateForm && (
                <Card className="mb-6 border-brand-gold/30">
                    <CardHeader>
                        <CardTitle>Activate New Card</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleActivate} className="space-y-4">
                            <Input
                                label="Activation Code"
                                placeholder="Enter the code from your card packaging"
                                value={activationCode}
                                onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
                                required
                            />
                            <p className="text-sm text-gray-400">
                                You'll find the activation code on the card packaging or instruction card.
                            </p>
                            <div className="flex gap-2">
                                <Button type="submit" isLoading={isActivating}>
                                    Activate Card
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setShowActivateForm(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Cards List */}
            {cards.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Cards Yet</h3>
                        <p className="text-gray-400 mb-4">
                            Order a Quickly card and activate it to get started.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button onClick={() => setShowActivateForm(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Activate a Card
                            </Button>
                            <Button variant="outline" asChild>
                                <a href="/store">Order a Card</a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card) => (
                        <Card key={card.id} className="overflow-hidden">
                            <div className="h-32 bg-gradient-to-br from-brand-navy-dark to-brand-navy flex items-center justify-center">
                                <CreditCard className="w-16 h-16 text-brand-gold" />
                            </div>
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <code className="text-sm text-gray-400">
                                        {card.card_uid}
                                    </code>
                                    {getStatusIcon(card.status)}
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>Status:</span>
                                    {getStatusLabel(card.status)}
                                </div>
                                {card.activated_at && (
                                    <div className="flex items-center justify-between text-sm mt-1">
                                        <span className="text-gray-400">Activated:</span>
                                        <span>{new Date(card.activated_at).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
