
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  email: string;
  role: string;
}

interface AdminAuthContextType {
  isAdmin: boolean;
  adminUser: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Function to check if a user has admin role
const checkAdminStatus = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_provider')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
    
    // For now, we're using is_provider as our admin flag
    // You might want to create a separate admin_users table in the future
    return data?.is_provider || false;
  } catch (err) {
    console.error("Error in admin check:", err);
    return false;
  }
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check admin status on mount and auth state changes
  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const isUserAdmin = await checkAdminStatus(session.user.id);
          setIsAdmin(isUserAdmin);
          
          if (isUserAdmin) {
            setAdminUser({
              id: session.user.id,
              email: session.user.email || '',
              role: 'admin'
            });
          } else {
            setAdminUser(null);
          }
        } else {
          setIsAdmin(false);
          setAdminUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check current session
    const checkCurrentSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session?.user) {
        const isUserAdmin = await checkAdminStatus(data.session.user.id);
        setIsAdmin(isUserAdmin);
        
        if (isUserAdmin) {
          setAdminUser({
            id: data.session.user.id,
            email: data.session.user.email || '',
            role: 'admin'
          });
        }
      }
      
      setIsLoading(false);
    };
    
    checkCurrentSession();

    return () => subscription.unsubscribe();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        const isUserAdmin = await checkAdminStatus(data.user.id);
        
        if (isUserAdmin) {
          setIsAdmin(true);
          setAdminUser({
            id: data.user.id,
            email: data.user.email || '',
            role: 'admin'
          });
          
          toast.success('تم تسجيل الدخول كمسؤول بنجاح');
          return true;
        } else {
          // User is not an admin
          await supabase.auth.signOut();
          toast.error('ليس لديك صلاحيات المسؤول');
          return false;
        }
      }
      
      return false;
    } catch (error: any) {
      toast.error(`خطأ في تسجيل الدخول: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAdmin(false);
      setAdminUser(null);
      toast.info('تم تسجيل الخروج بنجاح');
    } catch (error: any) {
      toast.error(`خطأ في تسجيل الخروج: ${error.message}`);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ isAdmin, adminUser, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
