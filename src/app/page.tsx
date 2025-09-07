'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Send, Upload, Bot, User, Sparkles } from 'lucide-react'

interface Message {
  type: 'user' | 'ai'
  text?: string
  imageUrl?: string
  profile?: {
    age: string
    style: string
    preferences: string[]
  }
  recommendations?: Array<{
    name: string
    price: string
    description: string
    image: string
  }>
}

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'user',
      text: '我想要一件适合约会的连衣裙，预算在500-800元之间',
    },
    {
      type: 'ai',
      text: '根据您的需求，我为您推荐以下连衣裙：',
      profile: {
        age: '25-30岁',
        style: '优雅知性',
        preferences: ['简约风格', '高品质面料', '适合约会']
      },
      recommendations: [
        {
          name: '优雅小黑裙',
          price: '¥699',
          description: '经典小黑裙，适合各种场合',
          image: 'https://via.placeholder.com/150x200/6366f1/ffffff?text=小黑裙'
        },
        {
          name: '粉色雪纺裙',
          price: '¥599',
          description: '温柔粉色，展现女性魅力',
          image: 'https://via.placeholder.com/150x200/ec4899/ffffff?text=粉色裙'
        }
      ]
    }
  ])
  const [inputText, setInputText] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleSend = () => {
    if (!inputText.trim()) return

    const newMessage: Message = {
      type: 'user',
      text: inputText,
      imageUrl: imagePreview || undefined
    }

    setMessages(prev => [...prev, newMessage])
    setInputText('')
    setImagePreview(null)

    // 模拟AI回复
    setTimeout(() => {
      const aiMessage: Message = {
        type: 'ai',
        text: '正在为您分析需求...',
        profile: {
          age: '25-30岁',
          style: '时尚潮流',
          preferences: ['现代简约', '舒适面料', '性价比高']
        },
        recommendations: [
          {
            name: '推荐商品1',
            price: '¥399',
            description: '根据您的需求推荐的商品',
            image: 'https://via.placeholder.com/150x200/10b981/ffffff?text=推荐1'
          }
        ]
      }
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-headline mb-2">AI购物助手</h1>
          <p className="text-muted-foreground">智能分析您的需求，为您推荐最合适的商品</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 输入区域 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  描述您的需求
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">文字描述</label>
                  <Input
                    placeholder="请描述您想要购买的商品..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">上传图片（可选）</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center gap-2 px-3 py-2 border border-dashed rounded-md cursor-pointer hover:bg-accent"
                    >
                      <Upload className="h-4 w-4" />
                      选择图片
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="预览"
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>

                <Button onClick={handleSend} className="w-full" disabled={!inputText.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  发送
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 对话区域 */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  对话记录
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto h-[500px] space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.type === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                    
                    <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                      <div className={`rounded-lg p-4 ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        {message.text && <p className="mb-2">{message.text}</p>}
                        
                        {message.imageUrl && (
                          <img
                            src={message.imageUrl}
                            alt="用户上传"
                            className="w-32 h-32 object-cover rounded-md mb-2"
                          />
                        )}

                        {message.profile && (
                          <div className="mt-3 p-3 bg-background rounded-md">
                            <h4 className="font-medium mb-2">用户画像</h4>
                            <div className="space-y-1 text-sm">
                              <p><strong>年龄段：</strong>{message.profile.age}</p>
                              <p><strong>风格偏好：</strong>{message.profile.style}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {message.profile.preferences.map((pref, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {pref}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {message.recommendations && (
                          <div className="mt-3">
                            <h4 className="font-medium mb-2">推荐商品</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {message.recommendations.map((item, i) => (
                                <div key={i} className="border rounded-md p-3 bg-background">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-32 object-cover rounded-md mb-2"
                                  />
                                  <h5 className="font-medium">{item.name}</h5>
                                  <p className="text-sm text-muted-foreground mb-1">{item.description}</p>
                                  <p className="text-lg font-bold text-primary">{item.price}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {message.type === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
