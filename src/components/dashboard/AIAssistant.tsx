import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { BaseProps } from "@/types/props";
import { useElevenLabs } from "@11labs/react";

interface AIAssistantProps extends BaseProps {
  onAddTransaction: (transaction: {
    type: 'income' | 'expense';
    amount: number;
    category: string;
  }) => void;
}

const DEFAULT_API_KEY = "AIzaSyBzf8G9oFSfdI-8fc7bjFHw5JdXxOUrA-g";
const ELEVEN_LABS_KEY = "YOUR_ELEVEN_LABS_API_KEY"; // يجب استبدالها بمفتاح API الخاص بك

export const AIAssistant = ({ className, onAddTransaction }: AIAssistantProps) => {
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey] = useState(DEFAULT_API_KEY);
  const [responseText, setResponseText] = useState("");
  
  const { play, stop } = useElevenLabs({
    apiKey: ELEVEN_LABS_KEY,
    voiceId: "21m00Tcm4TlvDq8ikWAM", // صوت عربي
  });

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
        const responseMessage = "تم إضافة المعاملات بنجاح!";
        setResponseText(responseMessage);
        toast.success(responseMessage);
      } else {
        const responseMessage = "لم يتم العثور على معاملات مالية في النشاط";
        setResponseText(responseMessage);
        toast.info(responseMessage);
      }
    } catch (error) {
      console.error('Error processing activity:', error);
      const errorMessage = "فشل في معالجة النشاط. يرجى المحاولة مرة أخرى.";
      setResponseText(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
      setText("");
    }
  };

  const handleSpeak = () => {
    if (responseText) {
      play(responseText);
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
            <label className="text-sm font-medium">أخبرني عن يومك</label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="مثال: ذهبت إلى السوبر ماركت وأنفقت 50 دولارًا على البقالة، ثم استلمت راتبي 3000 دولار"
              className="min-h-[100px] text-right"
              dir="rtl"
            />
          </div>

          <div className="flex space-x-2 rtl:space-x-reverse">
            <Button
              onClick={() => processActivity(text)}
              disabled={isProcessing || !text}
              className="flex-1"
            >
              <Send className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              معالجة النص
            </Button>
            {responseText && (
              <Button
                variant="outline"
                onClick={handleSpeak}
                className="px-3"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};