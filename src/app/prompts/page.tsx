
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Ban, Link, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getApis, type PublicApi } from '@/store/resources';
import { useToast } from '@/hooks/use-toast';

type Prompt = {
  id: string;
  name: string;
  scope: string;
  status: '生效中' | '已禁用';
  apiEndpoint?: string;
};

// This data is static as it represents the Genkit flows defined in the codebase.
const initialMockPrompts: Prompt[] = [
  { id: 'userProfilePrompt', name: '用户画像生成器', scope: 'AI购物助手', status: '生效中' },
  { id: 'productRecommendationsPrompt', name: '商品推荐器', scope: 'AI购物助手', status: '生效中' },
  { id: 'evaluateSellerDataPrompt', name: '供应商数据评估器', scope: '供应商中心', status: '生效中' },
  { id: 'generate3DModelPrompt', name: '3D模型生成器', scope: '创意者工作台', status: '生效中' },
  { id: 'recommendCreativesPrompt', name: '创意执行者推荐器', scope: '需求池', status: '生效中' },
];

function PromptConfigDialog({ prompt, open, onOpenChange, onSave }: { prompt: Prompt | null, open: boolean, onOpenChange: (open: boolean) => void, onSave: (promptId: string, apiEndpoint: string) => void }) {
    const [selectedApi, setSelectedApi] = useState(prompt?.apiEndpoint || '');
    const [availableApis, setAvailableApis] = useState<PublicApi[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        if(open) {
            setIsLoading(true);
            getApis().then(data => {
                setAvailableApis(data);
                 if (prompt?.apiEndpoint) {
                    setSelectedApi(prompt.apiEndpoint);
                } else if (data.length > 0) {
                    // Set a default value if no API is selected yet
                    setSelectedApi(data[0].endpoint);
                }
            }).catch(() => {
                 toast({ variant: "destructive", title: "错误", description: "无法加载可用API列表" });
            }).finally(() => {
                setIsLoading(false);
            })
        }
    }, [open, toast, prompt]);

    if (!prompt) return null;

    const handleSave = () => {
        onSave(prompt.id, selectedApi);
        onOpenChange(false);
    }
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>配置提示词接口</DialogTitle>
                    <DialogDescription>
                        为提示词 <span className="font-bold text-foreground">{prompt.name}</span> 关联一个API端点。
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                   {isLoading ? <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div> : (
                     <div>
                        <Label htmlFor="api-select">选择API端点</Label>
                        <Select value={selectedApi} onValueChange={setSelectedApi}>
                            <SelectTrigger id="api-select">
                                <SelectValue placeholder="选择一个API..." />
                            </SelectTrigger>
                            <SelectContent>
                                {availableApis.map(api => (
                                    <SelectItem key={api.id} value={api.endpoint}>{api.name} ({api.endpoint})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                   )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
                    <Button onClick={handleSave} disabled={isLoading || !selectedApi}>保存配置</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function PromptsPage() {
  const [prompts, setPrompts] = useState(initialMockPrompts);
  const [isConfigOpen, setConfigOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  const handleConfigClick = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setConfigOpen(true);
  };
  
  const handleSaveConfig = (promptId: string, apiEndpoint: string) => {
    setPrompts(prompts.map(p => p.id === promptId ? { ...p, apiEndpoint } : p));
  };


  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-headline font-bold">提示词管理</h1>
          <p className="text-muted-foreground">查看并管理应用中使用的AI提示词及其关联的API接口。</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>系统提示词</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>提示词名称</TableHead>
                  <TableHead>提示词ID</TableHead>
                  <TableHead>关联API</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prompts.map((prompt) => (
                  <TableRow key={prompt.id}>
                    <TableCell className="font-medium">{prompt.name}</TableCell>
                    <TableCell className="font-mono text-xs">{prompt.id}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                        {prompt.apiEndpoint ? 
                            <a href="#" className="flex items-center gap-1 hover:text-primary"><Link className="h-3 w-3"/>{prompt.apiEndpoint}</a>
                            : '未配置'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={prompt.status === '生效中' ? 'default' : 'destructive'} className={prompt.status === '生效中' ? 'bg-green-500' : ''}>{prompt.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" disabled><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleConfigClick(prompt)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" disabled><Ban className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <PromptConfigDialog
        prompt={selectedPrompt}
        open={isConfigOpen}
        onOpenChange={setConfigOpen}
        onSave={handleSaveConfig}
      />
    </>
  );
}
