import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Shield, Sparkles, Nfc, QrCode, Smartphone } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-gold to-brand-gold-light rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-brand-navy" />
              </div>
              <span className="text-xl font-bold gradient-text">Quickly</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/store" className="text-gray-300 hover:text-white transition">
                Store
              </Link>
              <Link href="/services" className="text-gray-300 hover:text-white transition">
                Services
              </Link>
              <Link href="/how-it-works" className="text-gray-300 hover:text-white transition">
                How It Works
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/30">
              <span className="text-brand-gold font-semibold">✨ Next-Gen Business Cards</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Share Your World{' '}
              <span className="gradient-text">Instantly</span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Premium NFC & QR cards that open your personalized link-in-bio page.
              One tap to connect, impress, and grow your network.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/store">
                <Button size="lg" className="group">
                  Shop Cards
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline">
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold gradient-text mb-2">10K+</div>
                <div className="text-gray-400 text-sm">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text mb-2">99.9%</div>
                <div className="text-gray-400 text-sm">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text mb-2">24/7</div>
                <div className="text-gray-400 text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-brand-navy-light">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Why Choose <span className="gradient-text">Quickly</span>?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              The smartest way to share your professional presence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Nfc className="w-8 h-8" />}
              title="NFC Technology"
              description="Just tap your card on any smartphone. No app needed - works instantly on iOS and Android."
            />
            <FeatureCard
              icon={<QrCode className="w-8 h-8" />}
              title="QR Backup"
              description="Every card includes a QR code for maximum compatibility. Always accessible, always reliable."
            />
            <FeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              title="Beautiful Templates"
              description="Choose from stunning templates. Customize colors, fonts, and layouts to match your brand."
            />
            <FeatureCard
              icon={<Smartphone className="w-8 h-8" />}
              title="Mobile Optimized"
              description="Your profile page loads instantly and looks perfect on any device. First impressions matter."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Privacy First"
              description="Your data is yours. We don't sell information. Full control over what you share and who sees it."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Real-Time Updates"
              description="Update your links anytime. Changes go live instantly - no need to reprint cards."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="glass rounded-3xl p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Make an <span className="gradient-text">Impact</span>?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who upgraded their networking game with Quickly.
            </p>
            <Link href="/store">
              <Button size="lg">
                Get Your Card Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-gold to-brand-gold-light rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-brand-navy" />
                </div>
                <span className="font-bold gradient-text">Quickly</span>
              </div>
              <p className="text-gray-400 text-sm">
                Premium NFC & QR cards for modern professionals.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/store" className="hover:text-white transition">Store</Link></li>
                <li><Link href="/services" className="hover:text-white transition">Services</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white transition">How It Works</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><Link href="/support" className="hover:text-white transition">Support</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Quickly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group">
      <div className="w-14 h-14 bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
        <div className="text-brand-gold">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
