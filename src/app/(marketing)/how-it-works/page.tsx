import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    Smartphone,
    Wifi,
    QrCode,
    CheckCircle,
    ArrowRight,
    Apple,
    Smartphone as Android
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function HowItWorksPage() {
    const t = await getTranslations('howItWorks');

    return (
        <div className="py-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">{t('title')}</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </div>

                {/* How It Works Steps */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-brand-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl font-bold text-brand-gold">1</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-3">{t('step1Title')}</h3>
                        <p className="text-gray-400">{t('step1Desc')}</p>
                    </div>
                    <div className="text-center">
                        <div className="w-20 h-20 bg-brand-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl font-bold text-brand-gold">2</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-3">{t('step2Title')}</h3>
                        <p className="text-gray-400">{t('step2Desc')}</p>
                    </div>
                    <div className="text-center">
                        <div className="w-20 h-20 bg-brand-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl font-bold text-brand-gold">3</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-3">{t('step3Title')}</h3>
                        <p className="text-gray-400">{t('step3Desc')}</p>
                    </div>
                </div>

                {/* NFC Activation Guides */}
                <div className="glass rounded-2xl p-8 md:p-12 mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                        Enable NFC on Your Phone
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* iOS */}
                        <div className="bg-white/5 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                                    <Apple className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-semibold">iPhone (iOS)</h3>
                            </div>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>iPhone XR/XS and newer: NFC reads automatically</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>No settings needed - just tap the card</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Hold card near the top back of the phone</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>A notification will appear - tap to open</span>
                                </li>
                            </ul>
                        </div>

                        {/* Android */}
                        <div className="bg-white/5 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                                    <Android className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-semibold">Android</h3>
                            </div>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Go to Settings → Connections → NFC</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Enable NFC toggle (may vary by device)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Hold card near the back center of phone</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Browser will open automatically</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* QR Scanning */}
                <div className="glass rounded-2xl p-8 md:p-12 mb-12">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center flex-shrink-0">
                            <QrCode className="w-20 h-20 text-brand-navy" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Scan QR Code</h2>
                            <p className="text-gray-400 mb-4">
                                Every Quickly card has a QR code on the back. Perfect for phones without NFC
                                or when you want to share from a distance.
                            </p>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    Open your camera app
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    Point at the QR code
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    Tap the notification to open the link
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">{t('ctaTitle')}</h2>
                    <p className="text-gray-400 mb-6">{t('ctaSubtitle')}</p>
                    <Link href="/store">
                        <Button size="lg">
                            {t('ctaButton')}
                            <ArrowRight className="w-5 h-5 ms-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
