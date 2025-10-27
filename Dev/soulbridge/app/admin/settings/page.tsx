import { getSupabaseAdmin } from '@/lib/supabase/client';
import { Settings as SettingsIcon, Database, Bell, Shield, Globe } from 'lucide-react';

export const metadata = {
  title: 'Admin Settings - SoulBridge',
  description: 'Configure platform settings',
};

export default async function AdminSettingsPage() {
  const supabase = getSupabaseAdmin();

  // Get admin settings
  const { data: settings } = await supabase
    .from('admin_settings')
    .select('*')
    .order('setting_key');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configure platform-wide settings and preferences
        </p>
      </div>

      {/* Settings Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Settings */}
        <SettingsCard
          title="Platform Settings"
          description="General platform configuration"
          icon={Globe}
          color="blue"
        >
          <div className="space-y-4">
            {settings && settings.length > 0 ? (
              settings.map((setting: any) => (
                <SettingItem
                  key={setting.id}
                  label={setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                  value={JSON.stringify(setting.setting_value, null, 2)}
                  description={setting.description}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No settings configured</p>
            )}
          </div>
        </SettingsCard>

        {/* Database Info */}
        <SettingsCard
          title="Database Information"
          description="Database connection and status"
          icon={Database}
          color="green"
        >
          <div className="space-y-4">
            <InfoItem label="Database Type" value="PostgreSQL (Supabase)" />
            <InfoItem label="Connection" value="Active" status="success" />
            <InfoItem
              label="Migration Status"
              value="Migration 015 - Admin Schema"
              status="info"
            />
          </div>
        </SettingsCard>

        {/* Notifications */}
        <SettingsCard
          title="Notifications"
          description="Email and system notifications"
          icon={Bell}
          color="purple"
        >
          <div className="space-y-4">
            <InfoItem label="Email Provider" value="Not Configured" status="warning" />
            <InfoItem label="Admin Alerts" value="Enabled" status="success" />
            <InfoItem label="User Notifications" value="Enabled" status="success" />
          </div>
        </SettingsCard>

        {/* Security */}
        <SettingsCard
          title="Security"
          description="Security and access control"
          icon={Shield}
          color="red"
        >
          <div className="space-y-4">
            <InfoItem label="Authentication" value="Clerk (Production)" status="success" />
            <InfoItem label="Admin Protection" value="Active" status="success" />
            <InfoItem label="RLS Policies" value="Enabled" status="success" />
          </div>
        </SettingsCard>
      </div>

      {/* Admin Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Admin Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionButton
            label="Clear Cache"
            description="Clear platform cache"
            color="blue"
            disabled
          />
          <ActionButton
            label="Backup Database"
            description="Create database backup"
            color="green"
            disabled
          />
          <ActionButton
            label="View Logs"
            description="View system logs"
            color="gray"
            disabled
          />
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <SettingsIcon className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
              Admin Access Required
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              To access this admin dashboard, your profile must have <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded">is_admin = true</code> in the profiles table. Run the SQL command in the migration file to grant admin access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// SettingsCard Component
interface SettingsCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'purple' | 'red';
  children: React.ReactNode;
}

function SettingsCard({ title, description, icon: Icon, color, children }: SettingsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className={`${colorClasses[color]} p-2 rounded-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

// SettingItem Component
interface SettingItemProps {
  label: string;
  value: string;
  description?: string;
}

function SettingItem({ label, value, description }: SettingItemProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          )}
        </div>
      </div>
      <pre className="mt-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded overflow-x-auto">
        {value}
      </pre>
    </div>
  );
}

// InfoItem Component
interface InfoItemProps {
  label: string;
  value: string;
  status?: 'success' | 'warning' | 'error' | 'info';
}

function InfoItem({ label, value, status }: InfoItemProps) {
  const statusClasses = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  };

  return (
    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      {status ? (
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusClasses[status]}`}>
          {value}
        </span>
      ) : (
        <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
      )}
    </div>
  );
}

// ActionButton Component
interface ActionButtonProps {
  label: string;
  description: string;
  color: 'blue' | 'green' | 'gray';
  disabled?: boolean;
}

function ActionButton({ label, description, color, disabled }: ActionButtonProps) {
  const colorClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    green: 'bg-green-500 hover:bg-green-600',
    gray: 'bg-gray-500 hover:bg-gray-600',
  };

  return (
    <button
      disabled={disabled}
      className={`${
        disabled ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' : colorClasses[color]
      } text-white p-4 rounded-lg transition-colors text-left`}
    >
      <p className="font-medium">{label}</p>
      <p className="text-sm opacity-90 mt-1">{description}</p>
      {disabled && <p className="text-xs mt-2 opacity-75">(Coming soon)</p>}
    </button>
  );
}
