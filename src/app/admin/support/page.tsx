import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Mail, Clock } from 'lucide-react';

export default function AdminSupportPage() {
    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Support</h1>
                <p className="text-gray-400">Manage customer support requests</p>
            </div>

            {/* Coming Soon */}
            <Card>
                <CardContent className="py-16 text-center">
                    <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-8 h-8 text-brand-gold" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Support System Coming Soon</h2>
                    <p className="text-gray-400 max-w-md mx-auto mb-8">
                        We're building a comprehensive support ticketing system.
                        For now, please manage support via WhatsApp.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                        <Card className="bg-white/5">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <MessageCircle className="w-5 h-5 text-green-400" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold">WhatsApp Support</h3>
                                    <p className="text-sm text-gray-400">Direct customer communication</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold">Email Support</h3>
                                    <p className="text-sm text-gray-400">contact@quickly.dz</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>

            {/* Placeholder Stats */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">Response Time</span>
                        </div>
                        <div className="text-2xl font-bold">~2 hours</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">Open Tickets</span>
                        </div>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm">Resolved Today</span>
                        </div>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
