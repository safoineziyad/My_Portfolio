'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TopBar } from '@/ecommerce/components/Sidebar';
import { Store, CreditCard, Bell, Users, Save, ArrowRight } from 'lucide-react';

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
  const [storeEmail, setStoreEmail] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('America/New_York');
  const [taxRate, setTaxRate] = useState('8');
  const [shippingRate, setShippingRate] = useState('5.99');
  const [lowStockEmail, setLowStockEmail] = useState(true);
  const [orderConfirmationEmail, setOrderConfirmationEmail] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/ecommerce/api/settings')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then(data => {
        setStoreName(data.storeName || 'Ziyad Store');
        setStoreEmail(data.storeEmail || '');
        setCurrency(data.currency || 'USD');
        setTimezone(data.timezone || 'America/New_York');
        setTaxRate(data.taxRate || '8');
        setShippingRate(data.shippingRate || '5.99');
        setLowStockEmail(data.lowStockEmail ?? true);
        setOrderConfirmationEmail(data.orderConfirmationEmail ?? true);
      })
      .catch(() => setError('Could not load settings from the server.'));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/ecommerce/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeName, storeEmail, currency, timezone, taxRate, shippingRate, lowStockEmail, orderConfirmationEmail }),
      });
      if (!res.ok) throw new Error('Failed to save');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
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

        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

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
          </div>
        </SettingsSection>

        <SettingsSection icon={Users} title="Team Members">
          <div className="text-center py-10">
            <Users size={40} className="mx-auto mb-3 text-slate-300 dark:text-slate-700" />
            <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">Manage your team</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Invite team members and manage roles and permissions.</p>
            <Link
              href="/ecommerce/dashboard/team"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-colors"
            >
              Go to Team Management <ArrowRight size={16} />
            </Link>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}
