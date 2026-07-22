'use client';
import { useState } from 'react';
import { TopBar } from '@/ecommerce/components/Sidebar';
import { Store, CreditCard, Bell, Users, Save } from 'lucide-react';

function InputField({ label, value, onChange, type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
      />
    </div>
  );
}

function ToggleSwitch({ enabled, onChange, label }: { enabled: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}

function SettingsSection({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30">
          <Icon size={18} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [storeName, setStoreName] = useState('Ziyad Store');
  const [storeEmail, setStoreEmail] = useState('store@ziyad.dev');
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('America/New_York');
  const [taxRate, setTaxRate] = useState('8.5');
  const [shippingRate, setShippingRate] = useState('5.99');
  const [lowStockEmail, setLowStockEmail] = useState(true);
  const [orderConfirmationEmail, setOrderConfirmationEmail] = useState(true);
  const [newOrderEmail, setNewOrderEmail] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 500);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar title="Settings" />
      <div className="p-4 lg:p-6 space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage your store settings and preferences</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

        <SettingsSection icon={Store} title="Store Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Store Name" value={storeName} onChange={setStoreName} />
            <InputField label="Store Email" value={storeEmail} onChange={setStoreEmail} type="email" />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Currency</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Timezone</label>
              <select
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="UTC">UTC</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
              </select>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection icon={CreditCard} title="Tax & Shipping">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Tax Rate (%)" value={taxRate} onChange={setTaxRate} type="number" placeholder="0.00" />
            <InputField label="Shipping Rate ($)" value={shippingRate} onChange={setShippingRate} type="number" placeholder="0.00" />
          </div>
        </SettingsSection>

        <SettingsSection icon={Bell} title="Notifications">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <ToggleSwitch enabled={lowStockEmail} onChange={setLowStockEmail} label="Low stock alerts" />
            <ToggleSwitch enabled={orderConfirmationEmail} onChange={setOrderConfirmationEmail} label="Order confirmation emails" />
            <ToggleSwitch enabled={newOrderEmail} onChange={setNewOrderEmail} label="New order notifications" />
            <ToggleSwitch enabled={weeklyReport} onChange={setWeeklyReport} label="Weekly sales report" />
          </div>
        </SettingsSection>

        <SettingsSection icon={Users} title="Team Members">
          <div className="text-center py-10">
            <Users size={40} className="mx-auto mb-3 text-slate-300 dark:text-slate-700" />
            <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">Team Management Coming Soon</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Invite team members and manage roles and permissions.</p>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}
