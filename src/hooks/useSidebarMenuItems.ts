import { useAuth } from '@/hooks/useAuth';
import {
  Search,
  Pill,
  Package,
  Apple,
  AlertTriangle,
  ShieldAlert,
  Users,
  ArrowUpDown,
  Eye,
  FileText,
  BookOpen,
  Image,
  ClipboardCheck,
  Zap,
  Calculator,
  Stethoscope,
  FileBarChart,
  RefreshCw
} from 'lucide-react';

interface MenuItem {
  title: string;
  icon: React.ComponentType<any>;
  section:
    | "search"
    | "medications"
    | "materials"
    | "diets"
    | "intoxication"
    | "high-alert"
    | "elderly"
    | "sequential-therapy"
    | "pharmacovigilance"
    | "cft"
    | "protocols"
    | "pictogram"
    | "discharge-guidelines"
    | "drug-interactions"
    | "treatment-estimation"
    | "therapeutic-alternatives"
    | "multiprofessional-round"
    | "round-reports"
    | "calculator";
  hasAccess: boolean;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

export const useSidebarMenuItems = () => {
  const { hasPermission, isFarmaceutico } = useAuth();

  const menuItems = [
    {
      title: "Padronizado",
      items: [
        {
          title: "Busca Geral",
          icon: Search,
          section: "search" as const,
          hasAccess: hasPermission("search")
        },
        {
          title: "Medicamentos",
          icon: Pill,
          section: "medications" as const,
          hasAccess: hasPermission("medications")
        },
        {
          title: "Materiais",
          icon: Package,
          section: "materials" as const,
          hasAccess: hasPermission("materials")
        },
        {
          title: "Dietas",
          icon: Apple,
          section: "diets" as const,
          hasAccess: hasPermission("diets")
        }
      ]
    },
    {
      title: "Farmácia Clínica",
      items: [
        {
          title: "Intoxicação",
          icon: AlertTriangle,
          section: "intoxication" as const,
          hasAccess: hasPermission("intoxication")
        },
        {
          title: "Medicamentos de Alta Vigilância",
          icon: ShieldAlert,
          section: "high-alert" as const,
          hasAccess: hasPermission("high-alert")
        },
        {
          title: "Idosos",
          icon: Users,
          section: "elderly" as const,
          hasAccess: hasPermission("elderly")
        },
        {
          title: "Terapia Sequencial",
          icon: ArrowUpDown,
          section: "sequential-therapy" as const,
          hasAccess: hasPermission("sequential-therapy")
        },
        {
          title: "Farmacovigilância",
          icon: Eye,
          section: "pharmacovigilance" as const,
          hasAccess: hasPermission("pharmacovigilance")
        },
        {
          title: "CFT",
          icon: FileText,
          section: "cft" as const,
          hasAccess: hasPermission("cft")
        },
        {
          title: "Protocolos",
          icon: BookOpen,
          section: "protocols" as const,
          hasAccess: hasPermission("protocols")
        },
        {
          title: "Pictograma",
          icon: Image,
          section: "pictogram" as const,
          hasAccess: hasPermission("pictogram")
        },
        {
          title: "Orientações de Alta",
          icon: ClipboardCheck,
          section: "discharge-guidelines" as const,
          hasAccess: hasPermission("discharge-guidelines")
        },
        {
          title: "Interações Medicamentosas",
          icon: Zap,
          section: "drug-interactions" as const,
          hasAccess: hasPermission("drug-interactions")
        },
        {
          title: "Estimativa de Tratamento",
          icon: Calculator,
          section: "treatment-estimation" as const,
          hasAccess: hasPermission("treatment-estimation")
        },
        {
          title: "Alternativas Terapêuticas",
          icon: RefreshCw,
          section: "therapeutic-alternatives" as const,
          hasAccess: hasPermission("therapeutic-alternatives")
        }
      ]
    },
    {
      title: "Calculadora",
      items: [
        {
          title: "Calculadoras Médicas",
          icon: Calculator,
          section: "calculator" as const,
          hasAccess: hasPermission("calculator")
        }
      ]
    },
    {
      title: "Round Multiprofissional",
      items: [
        {
          title: "Registro de Round",
          icon: Stethoscope,
          section: "multiprofessional-round" as const,
          hasAccess: hasPermission("multiprofessional-round")
        },
        {
          title: "Relatórios",
          icon: FileBarChart,
          section: "round-reports" as const,
          hasAccess: hasPermission("round-reports")
        }
      ]
    }
  ];

  const filteredMenuItems = menuItems.map((group) => ({
    ...group,
    items: group.items.filter((item) => item.hasAccess)
  })).filter((group) => group.items.length > 0);

  return {
    menuItems: filteredMenuItems,
    userManagementAccess: isFarmaceutico
  };
};
