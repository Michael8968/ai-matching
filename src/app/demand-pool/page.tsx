'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Bot, Search, Filter } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

interface Demand {
  id: string
  title: string
  description: string
  category: string
  budget: string
  deadline: string
  status: 'pending' | 'matched' | 'completed'
  createdAt: string
  creator: string
}

const mockDemands: Demand[] = [
  {
    id: '1',
    title: '企业年会礼品采购',
    description: '需要采购200份年会礼品，预算每份100-200元，要求包装精美，适合企业员工',
    category: '礼品',
    budget: '¥20,000 - ¥40,000',
    deadline: '2024-01-15',
    status: 'pending',
    createdAt: '2024-01-01',
    creator: '张经理'
  },
  {
    id: '2',
    title: '办公室装修设计',
    description: '500平米办公室需要重新装修设计，现代简约风格，预算50万',
    category: '装修',
    budget: '¥500,000',
    deadline: '2024-02-28',
    status: 'matched',
    createdAt: '2024-01-02',
    creator: '李总'
  },
  {
    id: '3',
    title: '员工培训课程',
    description: '需要为50名员工提供专业技能培训，包括线上和线下课程',
    category: '培训',
    budget: '¥100,000 - ¥150,000',
    deadline: '2024-03-01',
    status: 'pending',
    createdAt: '2024-01-03',
    creator: '王主管'
  }
]

export default function DemandPoolPage() {
  const { role } = useAuthStore()
  const [demands, setDemands] = useState<Demand[]>(mockDemands)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isRecDialogOpen, setIsRecDialogOpen] = useState(false)
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null)
  const [isNewDemandOpen, setIsNewDemandOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const isAdmin = role === 'admin'

  const handleSelectRow = (demandId: string, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, demandId])
    } else {
      setSelectedRows(prev => prev.filter(id => id !== demandId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(demands.map(d => d.id))
    } else {
      setSelectedRows([])
    }
  }

  const handleBatchRecommend = () => {
    setSelectedDemand(null)
    setIsRecDialogOpen(true)
  }

  const handleSingleRecommend = (demand: Demand) => {
    setSelectedDemand(demand)
    setIsRecDialogOpen(true)
  }

  const handleNewDemand = (formData: any) => {
    const newDemand: Demand = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      budget: formData.budget,
      deadline: formData.deadline,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      creator: '当前用户'
    }
    setDemands(prev => [newDemand, ...prev])
    setIsNewDemandOpen(false)
  }

  const filteredDemands = demands.filter(demand =>
    demand.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demand.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: Demand['status']) => {
    const variants = {
      pending: 'default',
      matched: 'secondary',
      completed: 'outline'
    } as const

    const labels = {
      pending: '待匹配',
      matched: '已匹配',
      completed: '已完成'
    }

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-headline mb-2">需求池</h1>
          <p className="text-muted-foreground">管理和匹配各类需求</p>
        </div>

        {/* 操作栏 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索需求..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              筛选
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={isNewDemandOpen} onOpenChange={setIsNewDemandOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  发布新需求
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>发布新需求</DialogTitle>
                </DialogHeader>
                <NewDemandForm onSubmit={handleNewDemand} />
              </DialogContent>
            </Dialog>

            {isAdmin && (
              <Button
                variant="outline"
                onClick={handleBatchRecommend}
                disabled={selectedRows.length === 0}
              >
                <Bot className="h-4 w-4 mr-2" />
                AI批量推荐 ({selectedRows.length})
              </Button>
            )}
          </div>
        </div>

        {/* 需求列表 */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    {isAdmin && (
                      <th className="text-left p-4">
                        <Checkbox
                          checked={selectedRows.length === demands.length && demands.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </th>
                    )}
                    <th className="text-left p-4">需求标题</th>
                    <th className="text-left p-4">分类</th>
                    <th className="text-left p-4">预算</th>
                    <th className="text-left p-4">截止日期</th>
                    <th className="text-left p-4">状态</th>
                    <th className="text-left p-4">创建者</th>
                    {isAdmin && <th className="text-left p-4">操作</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredDemands.map((demand) => (
                    <tr key={demand.id} className="border-b hover:bg-muted/50">
                      {isAdmin && (
                        <td className="p-4">
                          <Checkbox
                            checked={selectedRows.includes(demand.id)}
                            onCheckedChange={(checked) => handleSelectRow(demand.id, checked as boolean)}
                          />
                        </td>
                      )}
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{demand.title}</div>
                          <div className="text-sm text-muted-foreground mt-1 max-w-xs truncate">
                            {demand.description}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{demand.category}</Badge>
                      </td>
                      <td className="p-4">{demand.budget}</td>
                      <td className="p-4">{demand.deadline}</td>
                      <td className="p-4">{getStatusBadge(demand.status)}</td>
                      <td className="p-4">{demand.creator}</td>
                      {isAdmin && (
                        <td className="p-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSingleRecommend(demand)}
                          >
                            <Bot className="h-4 w-4 mr-1" />
                            推荐
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* AI推荐对话框 */}
        <Dialog open={isRecDialogOpen} onOpenChange={setIsRecDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>AI智能推荐</DialogTitle>
            </DialogHeader>
            <RecommendationDialog
              demand={selectedDemand}
              selectedDemands={selectedRows.map(id => demands.find(d => d.id === id)!).filter(Boolean)}
              onClose={() => setIsRecDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}

// 新需求表单组件
function NewDemandForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    deadline: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">需求标题</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="请输入需求标题"
          required
        />
      </div>
      
      <div>
        <label className="text-sm font-medium mb-2 block">需求描述</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="请详细描述您的需求"
          className="w-full min-h-[100px] p-3 border rounded-md resize-none"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">分类</label>
          <Input
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            placeholder="如：礼品、装修、培训"
            required
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">预算</label>
          <Input
            value={formData.budget}
            onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
            placeholder="如：¥10,000 - ¥20,000"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">截止日期</label>
        <Input
          type="date"
          value={formData.deadline}
          onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
          required
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit">发布需求</Button>
      </div>
    </form>
  )
}

// AI推荐对话框组件
function RecommendationDialog({ 
  demand, 
  selectedDemands, 
  onClose 
}: { 
  demand: Demand | null
  selectedDemands: Demand[]
  onClose: () => void 
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const handleAiRecommend = async () => {
    setIsLoading(true)
    
    // 模拟AI推荐
    setTimeout(() => {
      setResults([
        {
          id: '1',
          name: '推荐供应商A',
          score: 95,
          description: '专业度高，价格合理，服务优质',
          contact: '138****1234'
        },
        {
          id: '2',
          name: '推荐供应商B',
          score: 88,
          description: '经验丰富，响应速度快',
          contact: '139****5678'
        }
      ])
      setIsLoading(false)
    }, 2000)
  }

  const targetDemands = demand ? [demand] : selectedDemands

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">目标需求：</h3>
        {targetDemands.map((d) => (
          <div key={d.id} className="p-3 bg-muted rounded-md mb-2">
            <div className="font-medium">{d.title}</div>
            <div className="text-sm text-muted-foreground">{d.description}</div>
          </div>
        ))}
      </div>

      {!isLoading && results.length === 0 && (
        <div className="text-center py-8">
          <Button onClick={handleAiRecommend}>
            <Bot className="h-4 w-4 mr-2" />
            启动AI推荐
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>AI正在分析需求并匹配供应商...</p>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <h3 className="font-medium mb-4">推荐结果：</h3>
          <div className="space-y-3">
            {results.map((result) => (
              <div key={result.id} className="p-4 border rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{result.name}</h4>
                  <Badge variant="default">匹配度: {result.score}%</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{result.description}</p>
                <p className="text-sm">联系方式: {result.contact}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          关闭
        </Button>
      </div>
    </div>
  )
}
