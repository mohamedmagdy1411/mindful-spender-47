import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";

export const AuthUI = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2FCE2] to-[#D3E4FD] dark:from-[#1A1F2C] dark:to-[#2C1A2F] flex items-center justify-center">
      <div className="bg-white/80 dark:bg-gray-800/80 p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
        <Auth 
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#0EA5E9',
                  brandAccent: '#0284C7',
                },
              },
            },
          }}
          providers={["google"]}
          localization={{
            variables: {
              sign_in: {
                email_label: 'البريد الإلكتروني',
                password_label: 'كلمة المرور',
                button_label: 'تسجيل الدخول',
                email_input_placeholder: 'أدخل بريدك الإلكتروني',
                password_input_placeholder: 'أدخل كلمة المرور',
              },
              sign_up: {
                email_label: 'البريد الإلكتروني',
                password_label: 'كلمة المرور',
                button_label: 'إنشاء حساب',
                email_input_placeholder: 'أدخل بريدك الإلكتروني',
                password_input_placeholder: 'أدخل كلمة المرور',
              },
            },
          }}
        />
      </div>
    </div>
  );
};