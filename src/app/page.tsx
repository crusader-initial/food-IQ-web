'use client'
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useState, useRef } from 'react';
import { analyzeImage } from '@/lib/api';

export default function Home() {

const [selectedImage, setSelectedImage] = useState<string | null>(null);
const [analysisResult, setAnalysisResult] = useState<string | null>(null);
const [isAnalyzing, setIsAnalyzing] = useState(false);
console.log('API Key:', !!process.env.NEXT_PUBLIC_OPENAI_API_KEY); // 只打印是否存在，不打印具体值

const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件');
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Image = e.target?.result as string;
      setSelectedImage(base64Image);
      setIsAnalyzing(true);
      try {
        const result = await analyzeImage(base64Image);
        setAnalysisResult(result);
      } catch (error) {
        console.error('Error:', error);
        alert('分析失败，请稍后重试');
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen p-8 pb-20 gap-8 sm:p-20">
      <main className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Food IQ</h1>
          <p className="text-muted-foreground">智能化你的饮食，上传食物图片获取营养分析</p>
        </div>

        <Card className="p-8">
          <div
            className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-1">点击或拖拽上传图片</h3>
            <p className="text-sm text-muted-foreground">支持 JPG、PNG 格式</p>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold">图片预览</h3>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              {selectedImage ? (
                <img src={selectedImage} alt="预览图片" className="w-full h-full object-contain" />
              ) : (
                <p className="text-muted-foreground">暂无图片</p>
              )}
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="font-semibold">识别结果</h3>
            <div className="space-y-2">
              {isAnalyzing ? (
                <p className="text-muted-foreground">正在分析图片中...</p>
              ) : analysisResult ? (
                <p className="whitespace-pre-line">{analysisResult}</p>
              ) : (
                <p className="text-muted-foreground">上传图片后将显示分析结果</p>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
