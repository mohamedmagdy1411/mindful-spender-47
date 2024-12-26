import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, Trash, Plus, Edit } from "lucide-react";
import { useLanguageStore, translations } from "@/stores/languageStore";
import { toast } from "sonner";

interface AIAssistantProps {
  onAddTransaction: (transaction: {
    type: 'income' | 'expense';
    amount: number;
    category: string;
  }) => void;
  className?: string;
}

export const AIAssistant = ({ onAddTransaction, className }: AIAssistantProps) => {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { language } = useLanguageStore();
  const t = translations[language];

  const processUserInput = async () => {
    if (!input.trim()) {
      toast.error("الرجاء إدخال نص");
      return;
    }

    setIsProcessing(true);
    try {
      const words = input.toLowerCase().split(' ');
      const amount = words.find(word => !isNaN(Number(word)));
      const isExpense = words.some(word => 
        ['صرفت', 'دفعت', 'اشتريت', 'spent', 'paid', 'bought'].includes(word)
      );
      const isIncome = words.some(word => 
        ['استلمت', 'ربحت', 'received', 'earned', 'got'].includes(word)
      );
      
      if (amount) {
        const transaction = {
          type: isExpense ? 'expense' : (isIncome ? 'income' : 'expense'),
          amount: Number(amount),
          category: detectCategory(words),
        };
        
        onAddTransaction(transaction);
        toast.success("تم إضافة المعاملة بنجاح");
        setInput("");
      } else {
        const suggestion = analyzeText(input);
        toast.info(suggestion);
      }
    } catch (error) {
      toast.error("حدث خطأ في معالجة النص");
    } finally {
      setIsProcessing(false);
    }
  };

  const detectCategory = (words: string[]): string => {
    const categories = {
      طعام: ['طعام', 'مطعم', 'غداء', 'food', 'restaurant', 'lunch'],
      مواصلات: ['سيارة', 'بنزين', 'تاكسي', 'car', 'gas', 'taxi'],
      تسوق: ['ملابس', 'تسوق', 'clothes', 'shopping'],
      راتب: ['راتب', 'salary', 'wage'],
      استثمار: ['استثمار', 'أسهم', 'investment', 'stocks']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (words.some(word => keywords.includes(word))) {
        return category;
      }
    }
    return 'أخرى';
  };

  const analyzeText = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('كم') || lowerText.includes('how much')) {
      return "يمكنني مساعدتك في تتبع مصروفاتك. هل تريد إضافة معاملة جديدة؟";
    }
    
    if (lowerText.includes('نصيحة') || lowerText.includes('advice')) {
      return "حاول تخصيص 50% للضروريات، 30% للرغبات، و20% للادخار";
    }
    
    if (lowerText.includes('توفير') || lowerText.includes('save')) {
      return "جرب تحدي 52 أسبوع للتوفير - ابدأ بمبلغ صغير وزد المبلغ كل أسبوع";
    }
    
    return "يمكنني مساعدتك في إدارة أموالك. جرب إخباري عن معاملاتك اليومية";
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          <span>{t.tellMeAboutYourDay}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="مثال: صرفت 50 على الغداء اليوم"
            className="min-h-[100px] resize-none"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
          <Button
            onClick={processUserInput}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{t.processText}</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};