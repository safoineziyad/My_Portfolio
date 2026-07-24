'use client';
import { useEffect, useState } from 'react';
import { TopBar } from '@/ecommerce/components/Sidebar';
import { Settings, Save, Percent, Mail, Store } from 'lucide-react';

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

export default function MarketplaceSettingsPage() {
  const [commissionRate, setCommissionRate] = useState('10');
  const [platformName, setPlatformName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [autoApproveProducts, setAutoApproveProducts] = useState(false);
  const [autoApproveVendors, setAutoApproveVendors] = useState(false);
  const [vendorNotifications, setVendorNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/ecommerce/api/admin/marketplace/settings');
        const data = await res.json();
        setCommissionRate(data.commission_rate || '10');
        setPlatformName(data.platform_name || '');
        setContactEmail(data.contact_email || '');
        setAutoApproveProducts(data.auto_approve_products === 'true');
        setAutoApproveVendors(data.auto_approve_vendors === 'true');
        setVendorNotifications(data.vendor_notifications !== 'false');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/ecommerce/api/admin/marketplace/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commission_rate: commissionRate,
          platform_name: platformName,
          contact_email: contactEmail,
          auto_approve_products: String(autoApproveProducts),
          auto_approve_vendors: String(autoApproveVendors),
          vendor_notifications: String(vendorNotifications),
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto">
        <TopBar title="Marketplace Settings" />
        <div className="p-4 lg:p-6 space-y-6 max-w-4xl">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32" />
              </div>
              <div className="space-y-4">
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar title="Marketplace Settings" />
      <div className="p-4 lg:p-6 space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Marketplace Settings</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Configure marketplace platform settings</p>
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

        <SettingsSection icon={Percent} title="Commission">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Default Commission Rate (%)</label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Percentage deducted from each vendor sale</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={commissionRate}
                onChange={e => setCommissionRate(e.target.value)}
                className="w-32 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <span className="text-sm text-slate-500 dark:text-slate-400">%</span>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection icon={Store} title="Platform Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Platform Name</label>
              <input
                type="text"
                value={platformName}
                onChange={e => setPlatformName(e.target.value)}
                placeholder="My Marketplace"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                placeholder="support@marketplace.com"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
        </SettingsSection>

        <SettingsSection icon={Settings} title="General">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <div className="flex items-center justify-between py-3">
              <div>
                <span className="text-sm text-slate-700 dark:text-slate-300">Auto-approve products</span>
                <p className="text-xs text-slate-500 dark:text-slate-400">Automatically approve new product listings without moderation</p>
              </div>
              <button
                type="button"
                onClick={() => setAutoApproveProducts(!autoApproveProducts)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoApproveProducts ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoApproveProducts ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <span className="text-sm text-slate-700 dark:text-slate-300">Auto-approve vendors</span>
                <p className="text-xs text-slate-500 dark:text-slate-400">Automatically approve new vendor registrations</p>
              </div>
              <button
                type="button"
                onClick={() => setAutoApproveVendors(!autoApproveVendors)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoApproveVendors ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoApproveVendors ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <span className="text-sm text-slate-700 dark:text-slate-300">Vendor notifications</span>
                <p className="text-xs text-slate-500 dark:text-slate-400">Send email notifications to vendors for order updates</p>
              </div>
              <button
                type="button"
                onClick={() => setVendorNotifications(!vendorNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${vendorNotifications ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${vendorNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}
