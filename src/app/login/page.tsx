'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore, type Role } from '@/store/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Users, ShoppingBag, Palette } from 'lucide-react'

const roles: Array<{
  id: string
  role: Role
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}> = [
  {
    id: 'admin-1',
    role: 'admin',
    name: '管理员',
    description: '管理整个平台，查看所有数据',
    icon: User,
    color: 'bg-red-500',
  },
  {
    id: 'supplier-1',
    role: 'supplier',
    name: '供应商',
    description: '管理产品和服务信息',
    icon: Users,
    color: 'bg-blue-500',
  },
  {
    id: 'user-1',
    role: 'user',
    name: '普通用户',
    description: '使用AI购物助手',
    icon: ShoppingBag,
    color: 'bg-green-500',
  },
  {
    id: 'creator-1',
    role: 'creator',
    name: '创作者',
    description: '提供创意和内容服务',
    icon: Palette,
    color: 'bg-purple-500',
  },
]

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()

  const handleLogin = (userId: string, role: Role) => {
    login(userId, role)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-headline mb-2">AI智能匹配平台</h1>
          <p className="text-muted-foreground">请选择您的角色身份登录</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((roleInfo) => {
            const Icon = roleInfo.icon
            return (
              <Card key={roleInfo.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full ${roleInfo.color} flex items-center justify-center mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="font-headline">{roleInfo.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    {roleInfo.description}
                  </p>
                  <Button
                    onClick={() => handleLogin(roleInfo.id, roleInfo.role)}
                    className="w-full"
                  >
                    登录
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
