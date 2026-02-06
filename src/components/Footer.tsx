import { Bell, Mail, MapPin, Phone, Github, Linkedin, Twitter, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState, ReactNode } from 'react';

interface FooterProps {
  onBackToTop?: () => void;
  onModeChange?: () => void;
  showNewsletter?: boolean;
  showSocialLinks?: boolean;
  feedbackComponent?: ReactNode;
}

const Footer = ({
  onBackToTop,
  onModeChange,
  showNewsletter = true,
  showSocialLinks = true,
  feedbackComponent,
}: FooterProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: 'Error', description: 'Please enter your email address.' });
      return;
    }
    setSubscribing(true);
    // Simulate API call
    setTimeout(() => {
      setSubscribing(false);
      setEmail('');
      toast({ title: 'Success', description: 'Thanks for subscribing to our newsletter!' });
    }, 1000);
  };

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
  ];

  const contactInfo = [
    { icon: Mail, text: 'contact@alerthub.edu', href: 'mailto:contact@alerthub.edu' },
    { icon: Phone, text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: MapPin, text: 'Campus Address, City', href: '#' },
  ];

  const quickLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Features', href: '#features' },
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Contact Us', href: '#contact' },
  ];

  const resources = [
    { label: 'Documentation', href: '#docs' },
    { label: 'Help Center', href: '#help' },
    { label: 'Blog', href: '#blog' },
    { label: 'Community', href: '#community' },
    { label: 'Status', href: '#status' },
  ];

  return (
    <footer className="border-t border-border/50 bg-gradient-to-b from-background to-background/50">
      {/* Newsletter Section */}
      {showNewsletter && (
        <div className="border-b border-border/30">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get notified about important campus updates and announcements.
                </p>
              </div>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={subscribing}
                  className="bg-gradient-to-r from-primary to-accent hover:shadow-glow"
                >
                  {subscribing ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Section */}
      {feedbackComponent && (
        <div className="border-b border-border/30">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <h3 className="text-lg font-semibold mb-4">Share Your Feedback</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Help us improve AlertHub. Your feedback is valuable to us.
            </p>
            {feedbackComponent}
          </div>
        </div>
      )}

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <button
              type="button"
              onClick={() => {
                onBackToTop?.();
              }}
              className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Bell className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold gradient-text">AlertHub</span>
            </button>
            <p className="text-sm text-muted-foreground">
              Smart campus notification system designed for students and advisors.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Resources</h4>
            <ul className="space-y-2">
              {resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-2">
            <h4 className="font-semibold mb-4 text-sm">Contact & Support</h4>
            <ul className="space-y-3">
              {contactInfo.map((info) => {
                const Icon = info.icon;
                return (
                  <li key={info.text}>
                    <a
                      href={info.href}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                      {info.text}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/30 pt-8">
          {/* Social Links */}
          {showSocialLinks && (
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      className="p-2 rounded-lg hover:bg-secondary transition-colors"
                      aria-label={social.label}
                    >
                      <Icon className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                    </a>
                  );
                })}
              </div>

              {/* Copyright & Mode Toggle */}
              <div className="flex items-center gap-4 flex-wrap">
                <p className="text-sm text-muted-foreground">
                  © 2025 AlertHub. All rights reserved.
                </p>
                {onModeChange && (
                  <button
                    type="button"
                    onClick={onModeChange}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Theme
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
