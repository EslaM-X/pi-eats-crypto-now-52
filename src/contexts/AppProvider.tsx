
import React from 'react';
import { PiAuthProvider } from './PiAuthContext';
import { LanguageProvider } from './LanguageContext';
import { ThemeProvider } from './ThemeContext';
import { PiPriceProvider } from './PiPriceContext';
import { CartProvider } from './CartContext';
import { PaymentProvider } from './PaymentContext';
import { WalletProvider } from './wallet/WalletContext';
import { OrdersProvider } from './OrdersContext';
import { HomeFoodProvider } from './homefood/HomeFoodContext';
import { AdminAuthProvider } from './AdminAuthContext';
import { SupabaseAuthProvider } from './SupabaseAuthContext';

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SupabaseAuthProvider>
          <PiAuthProvider>
            <PiPriceProvider>
              <WalletProvider>
                <HomeFoodProvider>
                  <CartProvider>
                    <PaymentProvider>
                      <OrdersProvider>
                        <AdminAuthProvider>
                          {children}
                        </AdminAuthProvider>
                      </OrdersProvider>
                    </PaymentProvider>
                  </CartProvider>
                </HomeFoodProvider>
              </WalletProvider>
            </PiPriceProvider>
          </PiAuthProvider>
        </SupabaseAuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
