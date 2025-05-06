
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LockKeyhole, LogIn, Mail, ShieldAlert } from 'lucide-react';
import PiEatLogo from '@/components/PiEatLogo';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

// Form validation schema
const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const AdminLogin: React.FC = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, isAdmin, isLoading } = useAdminAuth();
  const navigate = useNavigate();

  // Initialize react-hook-form with zod resolver
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect if already logged in as admin
  useEffect(() => {
    if (isAdmin && !isLoading) {
      navigate('/admin');
    }
  }, [isAdmin, isLoading, navigate]);

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoggingIn(true);
    
    try {
      const success = await login(values.email, values.password);
      
      if (success) {
        navigate('/admin');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md shadow-xl border-primary/10">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <PiEatLogo size="lg" />
          </div>
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <ShieldAlert className="h-6 w-6 text-orange" />
            <span>لوحة إدارة النظام</span>
          </CardTitle>
          <CardDescription>
            أدخل بيانات الدخول للوصول إلى لوحة الإدارة
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input
                          placeholder="أدخل البريد الإلكتروني"
                          className="pl-10"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور</FormLabel>
                    <div className="relative">
                      <LockKeyhole className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input
                          placeholder="أدخل كلمة المرور"
                          className="pl-10"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <p className="text-xs text-muted-foreground">
                إذا كان لديك حساب مسؤول، يرجى تسجيل الدخول. وإلا اتصل بمسؤول النظام.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full button-gradient" 
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">●</span>
                    جاري تسجيل الدخول...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    تسجيل الدخول
                  </span>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLogin;
