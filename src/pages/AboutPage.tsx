import { PageLayout } from '@/components/PageLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Brain, Sparkles, Filter, Bell, Users, Calendar, Target, Shield, Zap } from 'lucide-react';

const AboutPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'Campus Intelligence',
      description: 'AI-powered notice relevance engine that understands your academic context and priorities.',
    },
    {
      icon: Sparkles,
      title: 'Personal Attention Engine',
      description: 'Every notice tells you why it matters to YOU specifically with personalized relevance scoring.',
    },
    {
      icon: Filter,
      title: 'Smart Filtering',
      description: 'Switch between Quiet, Exam, and Event modes instantly to match your current needs.',
    },
    {
      icon: Target,
      title: 'Priority-Based Display',
      description: 'Critical updates appear first with visual indicators for urgency and importance.',
    },
    {
      icon: Shield,
      title: 'Verified Content',
      description: 'All notices are verified by authorized personnel ensuring authenticity and reliability.',
    },
    {
      icon: Zap,
      title: 'Real-Time Updates',
      description: 'Instant notifications for time-sensitive information so you never miss important deadlines.',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Notices Delivered', icon: Bell },
    { value: '98%', label: 'On-time Awareness', icon: Target },
    { value: '5,000+', label: 'Active Students', icon: Users },
    { value: '50+', label: 'Departments', icon: Calendar },
  ];

  return (
    <PageLayout showOrbs mode="quiet" className="pt-28">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-display-xl font-bold gradient-text">
              About Campus Pulse
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your intelligent campus notification system that keeps you informed, organized, and ahead of important deadlines.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/')}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/timeline')}>
              View Timeline
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-12">
            <div className="space-y-6">
              <h2 className="text-display-md font-bold text-center">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Campus Pulse was created to solve the overwhelming problem of information overload in modern campus life. 
                We believe that students shouldn't have to sift through hundreds of irrelevant notices to find what matters to them.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our intelligent platform uses advanced algorithms to understand your academic profile, preferences, and priorities, 
                delivering only the most relevant information at the right time. From exam schedules to placement opportunities, 
                club events to academic deadlines – we ensure you never miss what's important.
              </p>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-display-md font-bold mb-4">Key Features</h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to stay on top of campus life
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <GlassCard
                  key={index}
                  className="p-8 hover-lift"
                  glow={index % 3 === 0 ? 'teal' : index % 3 === 1 ? 'cyan' : 'coral'}
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <GlassCard className="p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center space-y-3">
                    <div className="flex justify-center mb-2">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-4xl font-bold gradient-text">{stat.value}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-display-md font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">
              Simple, intelligent, and effective
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'Set Your Preferences',
                description: 'Tell us your department, year, and interests so we can personalize your feed.',
              },
              {
                step: '02',
                title: 'Get Relevant Notices',
                description: 'Our AI filters and ranks notices based on your profile and current priorities.',
              },
              {
                step: '03',
                title: 'Never Miss Important Updates',
                description: 'Urgent notices are highlighted, and you get timely reminders for upcoming deadlines.',
              },
              {
                step: '04',
                title: 'Stay Organized',
                description: 'Access your timeline, archive past notices, and track your engagement history.',
              },
            ].map((item, index) => (
              <GlassCard key={index} className="p-8 hover-lift">
                <div className="flex gap-6 items-start">
                  <div className="text-6xl font-bold text-primary/20">{item.step}</div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-2xl font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <GlassCard glow="teal" className="p-12">
            <h2 className="text-display-md font-bold mb-4">
              Ready to Transform Your Campus Experience?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of students who are staying ahead with Campus Pulse.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/')}>
                Get Started Now
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/settings')}>
                Customize Preferences
              </Button>
            </div>
          </GlassCard>
        </div>
      </section>
    </PageLayout>
  );
};

export default AboutPage;
