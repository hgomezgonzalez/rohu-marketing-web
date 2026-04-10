import {
  BadgeCheck,
  Banknote,
  Bell,
  BookOpenCheck,
  Boxes,
  Building2,
  Calculator,
  CalendarClock,
  ClipboardList,
  Compass,
  FileBarChart2,
  FileText,
  GraduationCap,
  Handshake,
  HeartPulse,
  KeyRound,
  Languages,
  LayoutDashboard,
  LineChart,
  MapPin,
  PackageSearch,
  Percent,
  Rocket,
  ScanLine,
  ScrollText,
  ShieldCheck,
  ShoppingCart,
  Star,
  TrendingUp,
  Truck,
  Users,
  UtensilsCrossed,
  Wallet,
  Waypoints,
  Wifi,
  Zap,
  type LucideIcon,
} from 'lucide-react';

/**
 * Single registry of every Lucide icon referenced by name from the
 * applications registry. Adding a new icon to a card or module requires
 * adding it here too — TypeScript will not catch a typo, the registry is
 * the source of truth.
 */
const registry: Record<string, LucideIcon> = {
  BadgeCheck,
  Banknote,
  Bell,
  BookOpenCheck,
  Boxes,
  Building2,
  Calculator,
  CalendarClock,
  ClipboardList,
  Compass,
  FileBarChart2,
  FileText,
  GraduationCap,
  Handshake,
  HeartPulse,
  KeyRound,
  Languages,
  LayoutDashboard,
  LineChart,
  MapPin,
  PackageSearch,
  Percent,
  Rocket,
  ScanLine,
  ScrollText,
  ShieldCheck,
  ShoppingCart,
  Star,
  TrendingUp,
  Truck,
  Users,
  UtensilsCrossed,
  Wallet,
  Waypoints,
  Wifi,
  Zap,
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
