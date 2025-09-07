'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Save, Trash2, Upload, Bot } from 'lucide-react'

interface ProductService {
  id: string
  name: string
  description: string
  category: string
  price: string
  unit: string
  status: 'active' | 'inactive'
}

interface SupplementaryField {
  id: string
  label: string
  value: string
  type: 'text' | 'number' | 'date'
}

const mockProducts: ProductService[] = [
  {
    id: '1',
    name: '企业礼品定制',
    description: '提供各类企业礼品定制服务，包括办公用品、纪念品等',
    category: '礼品定制',
    price: '100',
    unit: '件',
    status: 'active'
  },
  {
    id: '2',
    name: '办公室装修设计',
    description: '专业办公室装修设计服务，现代简约风格',
    category: '装修设计',
    price: '500',
    unit: '平米',
    status: 'active'
  },
  {
    id: '3',
    name: '员工培训课程',
    description: '提供专业技能培训、管理培训等各类培训课程',
    category: '培训服务',
    price: '2000',
    unit: '人/天',
    status: 'inactive'
  }
]

const mockSupplementaryFields: SupplementaryField[] = [
  {
    id: '1',
    label: '公司规模',
    value: '50-100人',
    type: 'text'
  },
  {
    id: '2',
    label: '成立时间',
    value: '2015-01-01',
    type: 'date'
  },
  {
    id: '3',
    label: '服务客户数',
    value: '500',
    type: 'number'
  }
]

export default function SuppliersPage() {
  const [products, setProducts] = useState<ProductService[]>(mockProducts)
  const [supplementaryFields, setSupplementaryFields] = useState<SupplementaryField[]>(mockSupplementaryFields)

  const addProduct = () => {
    const newProduct: ProductService = {
      id: Date.now().toString(),
      name: '',
      description: '',
      category: '',
      price: '',
      unit: '',
      status: 'active'
    }
    setProducts(prev => [...prev, newProduct])
  }

  const updateProduct = (id: string, updates: Partial<ProductService>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updates } : product
    ))
  }

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id))
  }

  const addSupplementaryField = () => {
    const newField: SupplementaryField = {
      id: Date.now().toString(),
      label: '',
      value: '',
      type: 'text'
    }
    setSupplementaryFields(prev => [...prev, newField])
  }

  const updateSupplementaryField = (id: string, updates: Partial<SupplementaryField>) => {
    setSupplementaryFields(prev => prev.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ))
  }

  const removeSupplementaryField = (id: string) => {
    setSupplementaryFields(prev => prev.filter(field => field.id !== id))
  }

  const handleDataProcessing = () => {
    // 模拟数据处理
    alert('数据处理功能演示：正在分析供应商数据...')
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-headline mb-2">供应商中心</h1>
          <p className="text-muted-foreground">管理您的产品和服务信息</p>
        </div>

        {/* 公司基本信息 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>公司基本信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 block">公司名称</label>
                <Input placeholder="请输入公司名称" defaultValue="示例科技有限公司" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">联系人</label>
                <Input placeholder="请输入联系人" defaultValue="张经理" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">联系电话</label>
                <Input placeholder="请输入联系电话" defaultValue="138****1234" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">邮箱</label>
                <Input placeholder="请输入邮箱" defaultValue="contact@example.com" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">公司简介</label>
              <textarea
                placeholder="请输入公司简介"
                className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                defaultValue="我们是一家专业的服务提供商，致力于为客户提供优质的产品和服务。"
              />
            </div>
          </CardContent>
        </Card>

        {/* 补充信息字段 */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>补充信息</CardTitle>
              <Button size="sm" onClick={addSupplementaryField}>
                <Plus className="h-4 w-4 mr-2" />
                添加字段
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {supplementaryFields.map((field) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <Input
                    placeholder="字段名称"
                    value={field.label}
                    onChange={(e) => updateSupplementaryField(field.id, { label: e.target.value })}
                    className="flex-1"
                  />
                  <select
                    value={field.type}
                    onChange={(e) => updateSupplementaryField(field.id, { type: e.target.value as any })}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="text">文本</option>
                    <option value="number">数字</option>
                    <option value="date">日期</option>
                  </select>
                  <Input
                    placeholder="字段值"
                    value={field.value}
                    onChange={(e) => updateSupplementaryField(field.id, { value: e.target.value })}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeSupplementaryField(field.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 产品/服务管理 */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>产品/服务管理</CardTitle>
              <Button onClick={addProduct}>
                <Plus className="h-4 w-4 mr-2" />
                添加产品
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.map((product) => (
                <ProductServiceItem
                  key={product.id}
                  product={product}
                  onUpdate={(updates) => updateProduct(product.id, updates)}
                  onRemove={() => removeProduct(product.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 数据处理模块 */}
        <Card>
          <CardHeader>
            <CardTitle>数据处理</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">批量数据处理</h3>
              <p className="text-muted-foreground mb-4">
                上传CSV文件，AI将自动分析并优化您的供应商数据
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  选择文件
                </Button>
                <Button onClick={handleDataProcessing}>
                  <Bot className="h-4 w-4 mr-2" />
                  AI分析处理
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

// 产品/服务项组件
function ProductServiceItem({
  product,
  onUpdate,
  onRemove
}: {
  product: ProductService
  onUpdate: (updates: Partial<ProductService>) => void
  onRemove: () => void
}) {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">产品/服务名称</label>
            <Input
              value={product.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="请输入产品/服务名称"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">分类</label>
            <Input
              value={product.category}
              onChange={(e) => onUpdate({ category: e.target.value })}
              placeholder="请输入分类"
            />
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <Button size="sm" variant="outline">
            <Save className="h-4 w-4 mr-1" />
            保存
          </Button>
          <Button size="sm" variant="outline" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">描述</label>
        <textarea
          value={product.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="请输入产品/服务描述"
          className="w-full min-h-[80px] p-3 border rounded-md resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">价格</label>
          <Input
            value={product.price}
            onChange={(e) => onUpdate({ price: e.target.value })}
            placeholder="请输入价格"
            type="number"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">单位</label>
          <Input
            value={product.unit}
            onChange={(e) => onUpdate({ unit: e.target.value })}
            placeholder="如：件、平米、人/天"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">状态</label>
          <select
            value={product.status}
            onChange={(e) => onUpdate({ status: e.target.value as 'active' | 'inactive' })}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="active">启用</option>
            <option value="inactive">禁用</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
            {product.status === 'active' ? '启用' : '禁用'}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          价格: ¥{product.price}/{product.unit}
        </div>
      </div>
    </div>
  )
}
