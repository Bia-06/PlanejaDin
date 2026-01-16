import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

export function useSubscription() {
  const [plan, setPlan] = useState('free');
  const [isPro, setIsPro] = useState(false);
  const [customRole, setCustomRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchSubscription = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          if (mounted) setLoading(false);
          return;
        }

        const isSuperUser = user.email === 'beatrizpires067@gmail.com' || user.email === 'dev@test.com';

        if (isSuperUser) {
            if (mounted) {
                setIsPro(true);
                setPlan('pro');
                setCustomRole('Desenvolvedora');
                setLoading(false);
            }
            return; 
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('subscription_plan, subscription_status, subscription_ends_at, trial_ends_at, custom_role, is_pro')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (mounted && data) {
          const now = new Date();
          const isDev = data.custom_role === 'Desenvolvedora'; 
          const isProPlanActive = data.subscription_plan === 'pro' && data.subscription_status === 'active';
          const hasValidProDate = data.subscription_ends_at && new Date(data.subscription_ends_at) > now;
          const hasValidTrial = data.trial_ends_at && new Date(data.trial_ends_at) > now;
          const isLegacyPro = data.is_pro === true;
          
          const finalIsPro = isDev || isProPlanActive || hasValidProDate || hasValidTrial || isLegacyPro;

          setIsPro(finalIsPro);
          setPlan(finalIsPro ? 'pro' : 'free');
          setCustomRole(data.custom_role);
        }
      } catch (err) {
        console.error('Erro ao verificar plano:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSubscription();

    const channel = supabase
      .channel('public:profiles')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'profiles' }, 
        (payload) => {
          if (payload.new.id) {
             fetchSubscription();
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const handleCheckout = async (priceId, isMonthly) => {
    setCheckoutLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setCheckoutLoading(false);
        return false; 
      }

      const response = await fetch('https://agkiucerpgabynaqulxy.supabase.co/functions/v1/stripe-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          priceId,
          isMonthly, 
          returnUrl: window.location.origin 
        }),
      });

      const { url, error } = await response.json();
      if (error) throw new Error(error);
      
      if (url) window.location.href = url;
      return true;

    } catch (error) {
      console.error('Erro no checkout:', error);
      alert('Erro ao iniciar pagamento. Tente novamente.');
      setCheckoutLoading(false);
      return true; 
    }
  };

  return {
    plan,
    isPro,
    customRole,
    loading,
    handleCheckout, 
    checkoutLoading 
  };
}