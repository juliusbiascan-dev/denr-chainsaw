import { NavItem } from '@/types';

export type FuelType = 'GAS' | 'DIESEL' | 'ELECTRIC' | 'OTHER';
export type UseType = 'WOOD_PROCESSING' | 'TREE_CUTTING' | 'LEGAL_PURPOSES' | 'OFFICIAL_TREE_CUTTING' | 'OTHER';

export type Equipment = {
  id: string;
  brand: string;
  model: string;
  serialNumber: string;
  guidBarLength: number;
  horsePower: number;
  fuelType: FuelType;
  dateAcquired: string;
  stencilOfSerialNo: string;
  otherInfo: string;
  intendedUse: UseType;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive';
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Equipments',
    url: '/dashboard/equipments',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  // {
  //   title: 'Skills',
  //   url: '/dashboard/product',
  //   icon: 'product',
  //   shortcut: ['p', 'p'],
  //   isActive: false,
  //   items: [] // No child items
  // },
  // {
  //   title: 'Details',
  //   url: '#', // Placeholder as there is no direct link for the parent
  //   icon: 'billing',
  //   isActive: true,

  //   items: [
  //     {
  //       title: 'Profile',
  //       url: '/dashboard/profile',
  //       icon: 'userPen',
  //       shortcut: ['m', 'm']
  //     },
  //     {
  //       title: 'Information',
  //       shortcut: ['l', 'l'],
  //       url: '/',
  //       icon: 'login'
  //     }
  //   ]
  // },
  // {
  //   title: 'Kanban',
  //   url: '/dashboard/kanban',
  //   icon: 'kanban',
  //   shortcut: ['k', 'k'],
  //   isActive: false,
  //   items: [] // No child items
  // }
];
