
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Upload, Edit, Trash2, Link, Code, UploadCloud, File, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { getLinks, getApis, type PublicLink, type PublicApi } from '@/store/resources';
import { Badge } from '@/components/ui/badge';


function ImportDialog() {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const { toast } = useToast();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleImport = () => {
        if (!file) {
            toast({
                variant: 'destructive',
                title: '未选择文件',
                description: '请选择一个文件进行导入。',
            });
            return;
        }
        // Placeholder for actual import logic
        toast({
            title: '导入成功',
            description: `${file.name} 已被成功导入。`,
        });
        setFile(null);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline"><Upload className="mr-2 h-4 w-4"/> 导入</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>导入资源</DialogTitle>
                    <DialogDescription>
                        选择一个文件来批量导入外部链接或API端点。请确保文件格式正确。
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                     <label htmlFor="file-upload" className="block cursor-pointer border-2 border-dashed border-muted-foreground/50 rounded-lg p-12 text-center hover:border-primary transition-colors">
                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 text-sm font-semibold">将文件拖放到此处，或点击浏览</p>
                        <p className="mt-1 text-xs text-muted-foreground">支持的文件格式: CSV, JSON</p>
                        <Input id="file-upload" type="file" accept=".csv,.json" className="hidden" onChange={handleFileChange} />
                    </label>
                    {file && (
                         <div className="mt-4 flex items-center justify-center text-sm text-muted-foreground">
                            <File className="mr-2 h-4 w-4"/>
                            已选择文件: <span className="font-medium text-foreground ml-1">{file.name}</span>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={handleImport} disabled={!file}>确认导入</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function PublicResourcesPage() {
  const [activeTab, setActiveTab] = useState('links');
  const [links, setLinks] = useState<PublicLink[]>([]);
  const [apis, setApis] = useState<PublicApi[]>([]);
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);
  const [isLoadingApis, setIsLoadingApis] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchLinks() {
      try {
        setIsLoadingLinks(true);
        const fetchedLinks = await getLinks();
        setLinks(fetchedLinks);
      } catch (error) {
        toast({ variant: 'destructive', title: '加载失败', description: '无法加载外部链接列表' });
      } finally {
        setIsLoadingLinks(false);
      }
    }
    
    async function fetchApis() {
        try {
            setIsLoadingApis(true);
            const fetchedApis = await getApis();
            setApis(fetchedApis);
        } catch (error) {
            toast({ variant: 'destructive', title: '加载失败', description: '无法加载API端点列表' });
        } finally {
            setIsLoadingApis(false);
        }
    }

    if (activeTab === 'links') {
        fetchLinks();
    } else if (activeTab === 'apis') {
        fetchApis();
    }
  }, [toast, activeTab]);

  const handleExport = () => {
    const dataToExport = activeTab === 'links' ? links : apis;
    if (dataToExport.length === 0) {
      toast({ variant: 'destructive', title: '无数据可导出' });
      return;
    }
    const headers = Object.keys(dataToExport[0]);
    const csvContent = [
      headers.join(','),
      ...dataToExport.map(row => 
        headers.map(header => `"${(row as any)[header]}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeTab}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
        title: '导出成功',
        description: `已成功将 ${dataToExport.length} 条记录导出为 ${activeTab}.csv`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">公共资源库</h1>
        <p className="text-muted-foreground">管理共享资源，如外部链接和API端点。</p>
      </div>

      <Tabs defaultValue="links" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-start">
            <TabsList className="grid grid-cols-2 w-[400px]">
                <TabsTrigger value="links"><Link className="mr-2"/> 外部链接</TabsTrigger>
                <TabsTrigger value="apis"><Code className="mr-2"/> API端点</TabsTrigger>
            </TabsList>
             <div className="flex gap-2">
                <ImportDialog />
                <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4"/> 导出</Button>
            </div>
        </div>

        <TabsContent value="links" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>外部链接</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>名称</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>描述</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingLinks ? (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                           <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                        </TableCell>
                    </TableRow>
                  ) : links.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="h-24 text-center">暂无链接。</TableCell></TableRow>
                  ) : links.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell>{link.name}</TableCell>
                      <TableCell><a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{link.url}</a></TableCell>
                      <TableCell>{link.desc}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" disabled><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" disabled><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apis" className="mt-4">
          <Card>
             <CardHeader>
              <CardTitle>API 端点</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>名称</TableHead>
                    <TableHead>端点</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingApis ? (
                     <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                           <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                        </TableCell>
                    </TableRow>
                  ) : apis.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="h-24 text-center">暂无API。</TableCell></TableRow>
                  ) : apis.map((api) => (
                    <TableRow key={api.id}>
                      <TableCell>{api.name}</TableCell>
                      <TableCell className="font-mono text-sm">{api.endpoint}</TableCell>
                      <TableCell>
                        <Badge variant={api.status === '生效中' ? 'default' : 'destructive'} className={api.status === '生效中' ? 'bg-green-500' : ''}>
                          {api.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" disabled><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" disabled><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
