'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsSuccess(true);
        toast.success('Message sent! We\'ll get back to you soon.');
        setIsLoading(false);
    }

    return (
        <div className="py-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Get in <span className="gradient-text">Touch</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Have questions? We'd love to hear from you.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Contact Info */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                        <div className="space-y-6">
                            <Card>
                                <CardContent className="flex items-center gap-4 p-4">
                                    <div className="w-12 h-12 bg-brand-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MessageCircle className="w-6 h-6 text-brand-gold" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">WhatsApp</h3>
                                        <p className="text-gray-400 text-sm">+213 XXX XXX XXX</p>
                                        <p className="text-xs text-gray-500">Fastest response</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="flex items-center gap-4 p-4">
                                    <div className="w-12 h-12 bg-brand-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-brand-gold" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Email</h3>
                                        <p className="text-gray-400 text-sm">contact@quickly.dz</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="flex items-center gap-4 p-4">
                                    <div className="w-12 h-12 bg-brand-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-brand-gold" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Location</h3>
                                        <p className="text-gray-400 text-sm">Algeria 🇩🇿</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="mt-8 p-6 bg-brand-gold/10 rounded-xl border border-brand-gold/20">
                            <h3 className="font-semibold mb-2">Business Hours</h3>
                            <p className="text-gray-400 text-sm">
                                Saturday - Thursday: 9:00 AM - 6:00 PM<br />
                                Friday: Closed
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <Card>
                            <CardContent className="p-6">
                                {isSuccess ? (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="w-8 h-8 text-green-500" />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                                        <p className="text-gray-400">
                                            Thank you for reaching out. We'll respond within 24 hours.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-bold mb-6">Send a Message</h2>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <Input
                                                name="name"
                                                type="text"
                                                label="Name"
                                                placeholder="Your name"
                                                required
                                            />
                                            <Input
                                                name="email"
                                                type="email"
                                                label="Email"
                                                placeholder="you@example.com"
                                                required
                                            />
                                            <Input
                                                name="phone"
                                                type="tel"
                                                label="Phone (Optional)"
                                                placeholder="+213 XXX XXX XXX"
                                            />
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Message</label>
                                                <textarea
                                                    name="message"
                                                    rows={4}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold resize-none"
                                                    placeholder="How can we help you?"
                                                    required
                                                />
                                            </div>
                                            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                                                <Send className="w-4 h-4 mr-2" />
                                                Send Message
                                            </Button>
                                        </form>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
