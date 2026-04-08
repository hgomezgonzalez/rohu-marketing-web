import {
  BookOpenCheck,
  Banknote,
  Boxes,
  Calculator,
  ClipboardList,
  FileBarChart2,
  FileText,
  Handshake,
  LayoutDashboard,
  LineChart,
  PackageSearch,
  ScanLine,
  ShieldCheck,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users,
  Wallet,
  Wifi,
  type LucideIcon,
} from 'lucide-react';

const registry: Record<string, LucideIcon> = {
  BookOpenCheck,
  Banknote,
  Boxes,
  Calculator,
  ClipboardList,
  FileBarChart2,
  FileText,
  Handshake,
  LayoutDashboard,
  LineChart,
  PackageSearch,
  ScanLine,
  ShieldCheck,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users,
  Wallet,
  Wifi,
};

type Props = {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
};

export function DynamicIcon({ name, size = 24, strokeWidth = 1.75, className }: Props) {
  const Icon = registry[name] ?? PackageSearch;
  return <Icon size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />;
}
