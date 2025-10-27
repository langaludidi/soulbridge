import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
  Menu,
  X,
} from 'lucide-react';

export const metadata = {
  title: 'Admin Dashboard - SoulBridge',
  description: 'SoulBridge Admin Dashboard',
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-[#2B3E50] to-[#9FB89D] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SB</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                    SoulBridge Admin
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Platform Management</p>
                </div>
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                target="_blank"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#2B3E50] dark:hover:text-[#9FB89D] transition-colors"
              >
                View Site
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-1">
            <NavLink href="/admin" icon={LayoutDashboard}>
              Overview
            </NavLink>
            <NavLink href="/admin/memorials" icon={FileText}>
              Memorials
            </NavLink>
            <NavLink href="/admin/users" icon={Users}>
              Users
            </NavLink>
            <NavLink href="/admin/subscriptions" icon={CreditCard}>
              Subscriptions
            </NavLink>
            <NavLink href="/admin/analytics" icon={BarChart3}>
              Analytics
            </NavLink>
            <NavLink href="/admin/settings" icon={Settings}>
              Settings
            </NavLink>
          </nav>

          {/* Quick Stats */}
          <div className="p-4 mt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Quick Stats
            </h3>
            <div className="space-y-2">
              <QuickStat label="Online Users" value="—" color="green" />
              <QuickStat label="Active Plans" value="—" color="blue" />
              <QuickStat label="Today's Views" value="—" color="purple" />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

// NavLink Component
interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

function NavLink({ href, icon: Icon, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#2B3E50] dark:hover:text-[#9FB89D] transition-colors group"
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{children}</span>
    </Link>
  );
}

// QuickStat Component
interface QuickStatProps {
  label: string;
  value: string;
  color: 'green' | 'blue' | 'purple';
}

function QuickStat({ label, value, color }: QuickStatProps) {
  const colorClasses = {
    green: 'text-green-600 dark:text-green-400',
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <span className={`font-semibold ${colorClasses[color]}`}>{value}</span>
    </div>
  );
}
