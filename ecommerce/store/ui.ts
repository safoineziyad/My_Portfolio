import { create } from 'zustand';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'stock' | 'system';
}

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  unreadCount: () => number;
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  activeModal: null,
  setActiveModal: (modal) => set({ activeModal: modal }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  addNotification: (notification) => set((s) => ({
    notifications: [notification, ...s.notifications],
  })),
  markNotificationRead: (id) => set((s) => ({
    notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n),
  })),
  unreadCount: () => get().notifications.filter(n => !n.read).length,
}));
