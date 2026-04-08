/**
 * 13 main modules of ROHU Contable shown in the landing "Modules" grid.
 * Icons reference lucide-react exported names.
 */
export type ModuleEntry = {
  id: string;
  label: string;
  description: string;
  icon: string;
};

export const modulesSection = {
  eyebrow: 'Módulos',
  section_title: 'Módulos que trabajan juntos',
  section_subtitle:
    'Una sola plataforma para operar, controlar y decidir — sin saltar entre herramientas.',
};

export const modules: ModuleEntry[] = [
  {
    id: 'dashboard',
    label: 'Tablero',
    description: 'Vista general de ventas, caja y alertas del día.',
    icon: 'LayoutDashboard',
  },
  {
    id: 'pos',
    label: 'Punto de venta',
    description: 'Vende rápido con QR, efectivo o transferencia.',
    icon: 'ShoppingCart',
  },
  {
    id: 'inventory',
    label: 'Inventario',
    description: 'Control de entradas, salidas y stock mínimo.',
    icon: 'Boxes',
  },
  {
    id: 'purchases',
    label: 'Compras',
    description: 'Crea y sigue órdenes de compra a tus proveedores.',
    icon: 'ClipboardList',
  },
  {
    id: 'suppliers',
    label: 'Proveedores',
    description: 'Historial, saldos y condiciones por proveedor.',
    icon: 'Handshake',
  },
  {
    id: 'customers',
    label: 'Clientes',
    description: 'Base de datos de clientes con historial de compras.',
    icon: 'Users',
  },
  {
    id: 'collections',
    label: 'Cobro de cartera',
    description: 'Gestiona cuentas por cobrar y pagos pendientes.',
    icon: 'Wallet',
  },
  {
    id: 'reports',
    label: 'Reportes',
    description: 'Exporta ventas, compras y movimientos cuando los necesites.',
    icon: 'FileText',
  },
  {
    id: 'analytics',
    label: 'Análisis',
    description: 'Gráficas de tendencias para entender tu negocio.',
    icon: 'TrendingUp',
  },
  {
    id: 'financial',
    label: 'Estados financieros',
    description: 'Balance y PyG listos para revisar con tu contador.',
    icon: 'FileBarChart2',
  },
  {
    id: 'dian_support',
    label: 'Soporte DIAN',
    description: 'Información de referencia sobre obligaciones tributarias frecuentes.',
    icon: 'ShieldCheck',
  },
  {
    id: 'accounting',
    label: 'Contabilidad',
    description: 'Partidas dobles, cuentas PUC y reportes bajo NIIF.',
    icon: 'Calculator',
  },
  {
    id: 'cash_bank',
    label: 'Caja y bancos',
    description: 'Concilia movimientos de caja y cuentas bancarias fácilmente.',
    icon: 'Banknote',
  },
];
