'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore, type Role } from '@/store/auth'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Home, Users, ShoppingBag, User, LogOut } from 'lucide-react'

interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
}

const navItemsByRole: Record<Role, NavItem[]> = {
  admin: [
    { title: 'AI购物助手', url: '/', icon: Home },
    { title: '需求池', url: '/demand-pool', icon: ShoppingBag },
    { title: '供应商中心', url: '/suppliers', icon: Users },
  ],
  supplier: [
    { title: 'AI购物助手', url: '/', icon: Home },
    { title: '供应商中心', url: '/suppliers', icon: Users },
  ],
  user: [
    { title: 'AI购物助手', url: '/', icon: Home },
  ],
  creator: [
    { title: 'AI购物助手', url: '/', icon: Home },
  ],
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { role, user, logout } = useAuthStore()
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !role) {
      router.replace('/login')
    }
  }, [mounted, role, router])

  if (!mounted || !role || !user) {
    return null
  }

  const currentNavItems = navItemsByRole[role] || []

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-4 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold">AI</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold font-headline">智能匹配平台</h1>
              <p className="text-xs text-muted-foreground">AI Matching Platform</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {currentNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.url
              
              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    className={isActive ? 'bg-accent text-accent-foreground' : ''}
                  >
                    <a href={item.url}>
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <User className="h-4 w-4" />
                <span className="truncate">{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={logout}>
                <LogOut className="h-4 w-4" />
                <span>退出登录</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
