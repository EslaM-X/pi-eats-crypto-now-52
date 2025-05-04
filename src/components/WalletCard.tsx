
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PiPriceIndicator } from '@/components/PiPriceIndicator';
import CurrencyValue from '@/components/CurrencyValue';
import { ExternalLink, WalletIcon, SendHorizontal, ArrowRightLeft, PlusCircle, History, DollarSign } from 'lucide-react';
import PiEatLogo from '@/components/PiEatLogo';
import PiNetworkLogo from '@/components/PiNetworkLogo';
import { useLanguage } from '@/contexts/LanguageContext';

interface WalletCardProps {
  title: string;
  abbreviation?: string;
  icon: React.ReactNode;
  balance: number;
  symbol?: string;
  conversionRate?: number;
  isUser: boolean;
  isPi?: boolean;
  isPtm?: boolean;
  usdValue?: number;
  egpValue?: number;
  onConnect?: () => void;
  onTopUp?: () => void;
  onExternal?: () => void;
  estimatedValue?: string;
  customActions?: React.ReactNode;
}

const WalletCard: React.FC<WalletCardProps> = ({
  title,
  abbreviation,
  icon,
  balance,
  symbol = 'π',
  conversionRate,
  isUser,
  isPi = false,
  isPtm = false,
  usdValue,
  egpValue,
  onConnect,
  onTopUp,
  onExternal,
  estimatedValue,
  customActions
}) => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  
  return (
    <Card className="glass-card overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg md:text-xl">
            {title} 
            {abbreviation && <span className={`${isRtl ? 'mr-1' : 'ml-1'} text-sm text-muted-foreground`}>({abbreviation})</span>}
          </span>
          <div className="scale-100 md:scale-125">
            {icon}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 md:mb-6">
          <div>
            <div className="text-sm text-muted-foreground mb-1">{isRtl ? 'الرصيد' : 'Balance'}</div>
            <div className="text-3xl md:text-4xl font-bold flex items-center">
              {isPi && (
                <span className={`${isRtl ? 'ml-1' : 'mr-1'} font-extrabold text-4xl md:text-5xl`}>
                  <PiNetworkLogo size="md" />
                </span>
              )}
              {isPtm && <PiEatLogo piOnly={true} showEmoji={true} size="md" className={isRtl ? 'ml-1' : 'mr-1'} />}
              <span>{isUser ? balance.toFixed(2) : '--.--'}</span>
            </div>
            
            {estimatedValue && (
              <div className="mt-2 text-sm text-muted-foreground">
                ≈ {estimatedValue}
              </div>
            )}
            
            {/* Currency conversions */}
            {isUser && balance > 0 && usdValue !== undefined && (
              <div className="flex flex-col mt-1">
                <CurrencyValue 
                  amount={usdValue}
                  symbol="$"
                  label="US Dollar value"
                  prefix={<DollarSign className="h-3 w-3 mr-1" />}
                />
                {egpValue !== undefined && (
                  <CurrencyValue 
                    amount={egpValue}
                    symbol="£E"
                    label="Egyptian Pound value"
                    prefix={<span className="text-xs mr-1">£E</span>}
                  />
                )}
              </div>
            )}
            
            {isPi && (
              <div className="mt-2">
                <PiPriceIndicator showDetails={true} />
              </div>
            )}
          </div>
          
          {!isUser && onConnect && (
            <Button 
              onClick={onConnect}
              className="mt-4 lg:mt-0 button-gradient w-full lg:w-auto animate-pulse hover:animate-none interactive-button relative overflow-hidden group"
            >
              <span className="relative z-10 font-bold tracking-wider">{isRtl ? 'الاتصال بـ π' : 'Connect with π'}</span>
              <span className="absolute inset-0 bg-gradient-to-r from-orange/80 via-pi to-orange/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[length:200%_200%] animate-gradient"></span>
            </Button>
          )}
        </div>
        
        {isUser && (
          <div className="transition-all duration-300 hover:scale-105 transform">
            {customActions ? customActions : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                <Button variant="outline" className="flex items-center justify-center text-xs md:text-sm py-1 h-auto interactive-button">
                  <WalletIcon className={`${isRtl ? 'ml-1' : 'mr-1'} h-3 w-3 md:h-4 md:w-4`} />
                  <span className="hidden sm:inline">{isRtl ? 'اتصال' : 'Connect'}</span>
                </Button>
                <Button variant="outline" className="flex items-center justify-center text-xs md:text-sm py-1 h-auto interactive-button">
                  <SendHorizontal className={`${isRtl ? 'ml-1' : 'mr-1'} h-3 w-3 md:h-4 md:w-4`} />
                  <span className="hidden sm:inline">{isRtl ? 'إرسال' : 'Send'}</span>
                </Button>
                <Button variant="outline" className="flex items-center justify-center text-xs md:text-sm py-1 h-auto interactive-button">
                  <ArrowRightLeft className={`${isRtl ? 'ml-1' : 'mr-1'} h-3 w-3 md:h-4 md:w-4`} />
                  <span className="hidden sm:inline">{isRtl ? 'المعاملات' : 'Transactions'}</span>
                </Button>
                {onTopUp && (
                  <Button variant="default" className="button-gradient flex items-center justify-center text-xs md:text-sm py-1 h-auto interactive-button" onClick={onTopUp}>
                    <PlusCircle className={`${isRtl ? 'ml-1' : 'mr-1'} h-3 w-3 md:h-4 md:w-4`} />
                    <span className="hidden sm:inline">{isRtl ? 'شحن' : 'Top Up'}</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
        
        {onExternal && (
          <div className="mt-4 md:mt-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs flex items-center hover:bg-primary/20 transition-colors duration-200 interactive-button" 
              onClick={onExternal}
            >
              <ExternalLink className={`${isRtl ? 'ml-1' : 'mr-1'} h-3 w-3`} />
              {isPi ? (isRtl ? 'زيارة متصفح π' : 'Visit π Browser') : (isRtl ? 'زيارة بِإيت' : 'Visit PiEat-Me')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletCard;
