import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Role = 'admin' | 'supplier' | 'user' | 'creator'

export interface User {
  id: string
  name: string
  email: string
  role: Role
}

interface AuthState {
  role: Role | null
  user: User | null
  login: (userId: string, role: Role) => void
  logout: () => void
}

const mockUsers: Record<string, User> = {
  'admin-1': { id: 'admin-1', name: '管理员', email: 'admin@example.com', role: 'admin' },
  'supplier-1': { id: 'supplier-1', name: '供应商', email: 'supplier@example.com', role: 'supplier' },
  'user-1': { id: 'user-1', name: '普通用户', email: 'user@example.com', role: 'user' },
  'creator-1': { id: 'creator-1', name: '创作者', email: 'creator@example.com', role: 'creator' },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      user: null,
      login: (userId: string, role: Role) => {
        const user = mockUsers[userId] || { id: userId, name: role, email: `${role}@example.com`, role }
        set({ role, user })
      },
      logout: () => set({ role: null, user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
