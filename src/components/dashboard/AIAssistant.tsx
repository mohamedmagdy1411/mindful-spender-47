import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { BaseProps } from "@/types/props";
import { Input } from "@/components/ui/input";

interface AIAssistantProps extends BaseProps {
  onAddTransaction: (transaction: {
    type: 'income' | 'expense';
    amount: number;
    category: string;
  }) => void;
}

export const AIAssistant = ({ className, onAddTransaction }: AIAssistantProps) => {
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const processActivity = async (activity: string) => {
    try {
      setIsProcessing(true);
      
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a financial assistant that helps users track their expenses and income. 
              Extract financial transactions from this activity and respond in JSON format with an array of transactions.
              Each transaction should contain:
              - type: "income" or "expense"
              - amount: number (in USD)
              - category: string
              
              Activity: ${activity}
              
              Example response format: {"transactions": [{"type": "expense", "amount": 25, "category": "Food"}]}`
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            topK: 1,
            topP: 0.8,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process activity');
      }

      const data = await response.json();
      const aiResponse = JSON.parse(data.candidates[0].content.parts[0].text);
      
      if (aiResponse.transactions && aiResponse.transactions.length > 0) {
        aiResponse.transactions.forEach((transaction: any) => {
          onAddTransaction(transaction);
        });
        toast.success("تم إضافة المعاملات بنجاح!");
      } else {
        toast.info("لم يتم العثور على معاملات مالية في النشاط");
      }
    } catch (error) {
      console.error('Error processing activity:', error);
      toast.error("فشل في معالجة النشاط. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsProcessing(false);
      setText("");
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">المساعد المالي الذكي</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">مفتاح API من Google</label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="أدخل مفتاح API الخاص بك"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">أخبرني عن يومك</label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="مثال: ذهبت إلى السوبر ماركت وأنفقت 50 دولارًا على البقالة، ثم استلمت راتبي 3000 دولار"
              className="min-h-[100px] text-right"
              dir="rtl"
            />
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={() => processActivity(text)}
              disabled={isProcessing || !text || !apiKey}
              className="flex-1"
            >
              <Send className="w-4 h-4 mr-2" />
              معالجة النص
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};