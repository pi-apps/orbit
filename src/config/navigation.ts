import {
  BarChart2,
  Bell,
  Calendar,
  Cpu,
  FileText,
  LayoutGrid,
  PlusSquare,
  User,
  Users,
  Settings,
  Shield,
  Crown,
  Upload,
} from "lucide-react";
import PiIcon from "../components/PiIcon";
export const DESKTOP_NAV_LINKS = [
  { href: "/dashboard", name: "Dashboard", icon: LayoutGrid },
  { href: "/create-post", name: "Create Post", icon: PlusSquare },
  { href: "/calendar", name: "Calendar", icon: Calendar },
  { href: "/automation", name: "Automation", icon: Cpu },
  { href: "/accounts", name: "Accounts", icon: User },
  { href: "/analytics", name: "Analytics", icon: BarChart2 },
  { href: "/ai-assist", name: "AI Assist", icon: Cpu },
  { href: "/templates", name: "Templates", icon: FileText },
  { href: "/uploads", name: "Uploads", icon: Upload },
  { href: "/team", name: "Team", icon: Users },
  { href: "/settings", name: "Settings", icon: Settings },
  { href: "/pro", name: "Orbit Pro", icon: Crown },
];
export const MOBILE_DRAWER_LINKS = [
  { href: "/templates", name: "Templates", icon: FileText },
  { href: "/automation", name: "Automation", icon: Cpu },
  { href: "/uploads", name: "Uploads", icon: Upload },
  { href: "/notifications", name: "Notifications", icon: Bell },
  { href: "/team", name: "Team", icon: Users },
  { href: "/wallet", name: "Wallet", icon: PiIcon },
  { href: "/settings", name: "Settings", icon: Settings },
  { href: "/pro", name: "Orbit Pro", icon: Crown },
];
export const MOBILE_NAV_LINKS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Accounts", href: "/accounts", icon: User },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
  { name: "AI Assist", href: "/ai-assist", icon: Cpu },
];
export const EXCLUDED_ROUTES = [
  "/login",
  "/register",
  "/onboarding",
  "/landing",
];
