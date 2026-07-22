export const metadata = { title: 'E-Commerce Dashboard' };
export default function EcommerceLayout({ children }: { children: React.ReactNode }) {
  return <div className="ecommerce-root min-h-screen bg-slate-50 dark:bg-slate-900">{children}</div>;
}
