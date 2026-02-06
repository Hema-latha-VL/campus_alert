import { PageLayout } from '@/components/PageLayout';
import { GlassCard } from '@/components/GlassCard';
import { Badge } from '@/components/ui/badge';
import { useAppState } from '@/state/AppState';
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  XCircle,
  Eye,
  TrendingUp,
  Users,
  Building
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

const viewsData = [
  { name: 'Mon', views: 1200 },
  { name: 'Tue', views: 1800 },
  { name: 'Wed', views: 2400 },
  { name: 'Thu', views: 2100 },
  { name: 'Fri', views: 2800 },
  { name: 'Sat', views: 1500 },
  { name: 'Sun', views: 900 },
];

const engagementData = [
  { name: 'Viewed', value: 78 },
  { name: 'Engaged', value: 45 },
  { name: 'Acted', value: 22 },
];

const departmentData = [
  { name: 'CSE', reach: 95 },
  { name: 'ECE', reach: 87 },
  { name: 'MECH', reach: 72 },
  { name: 'CIVIL', reach: 68 },
  { name: 'EEE', reach: 61 },
];

const COLORS = ['hsl(168, 80%, 40%)', 'hsl(187, 85%, 53%)', 'hsl(25, 95%, 53%)'];

const pendingNotices = [
  { id: 1, title: 'Workshop on Machine Learning', department: 'CSE', status: 'pending' },
  { id: 2, title: 'Sports Day Registration', department: 'Sports', status: 'pending' },
  { id: 3, title: 'Lab Equipment Maintenance', department: 'ECE', status: 'pending' },
];

const AdminPage = () => {
  const { allNotices } = useAppState();
  return (
    <PageLayout mode="quiet" className="pt-28 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-display-md font-bold">Admin Dashboard</h1>
            <Badge className="bg-primary/20 text-primary border-primary/30">
              <Shield className="h-3 w-3 mr-1" />
              Admin Preview
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Monitor notice performance and verification status
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard className="p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20 text-primary">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">15,234</p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-teal-100 text-teal-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">67%</p>
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-accent/20 text-accent">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">4,521</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-coral-100 text-coral-600">
                <Building className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">7</p>
                <p className="text-sm text-muted-foreground">Departments</p>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Views Chart */}
          <GlassCard className="p-6 lg:col-span-2">
            <h3 className="font-semibold mb-4">Views Over Time</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={viewsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="hsl(168, 80%, 40%)"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(168, 80%, 40%)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Engagement Pie */}
          <GlassCard className="p-6">
            <h3 className="font-semibold mb-4">Engagement Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {engagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {engagementData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Department Reach */}
          <GlassCard className="p-6">
            <h3 className="font-semibold mb-4">Department Reach</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="reach" fill="hsl(187, 85%, 53%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Pending Verification */}
          <GlassCard className="p-6">
            <h3 className="font-semibold mb-4">Pending Verification</h3>
            <div className="space-y-4">
              {pendingNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/30"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-coral-500" />
                    <div>
                      <p className="font-medium">{notice.title}</p>
                      <p className="text-sm text-muted-foreground">{notice.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg bg-teal-100 text-teal-600 hover:bg-teal-200 transition-colors">
                      <CheckCircle className="h-4 w-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-coral-100 text-coral-600 hover:bg-coral-200 transition-colors">
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Recent Verified Notices */}
        <GlassCard className="p-6">
          <h3 className="font-semibold mb-4">Recently Verified Notices</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allNotices.slice(0, 6).map((notice) => (
              <div
                key={notice.id}
                className="p-4 rounded-xl bg-secondary/30 flex items-center gap-3"
              >
                <div className="p-2 rounded-lg bg-primary/20">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{notice.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{notice.category}</p>
                </div>
                <Badge variant="secondary" className="bg-teal-100 text-teal-700 text-xs">
                  Verified
                </Badge>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </PageLayout>
  );
};

export default AdminPage;
