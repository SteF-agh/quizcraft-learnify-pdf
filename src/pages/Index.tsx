import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/landing/HeroSection";
import { KeyFeatures } from "@/components/landing/KeyFeatures";
import { LoginSection } from "@/components/landing/LoginSection";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        handleUserRedirect(session);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        handleUserRedirect(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleUserRedirect = async (session: any) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role === 'admin') {
        navigate('/admin');
      } else if (profile?.role === 'trainee') {
        navigate('/dashboard');
      } else {
        toast.error("Rolle nicht erkannt");
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      toast.error("Fehler beim Laden der Benutzerrolle");
      navigate('/dashboard');
    }
  };

  if (session) {
    return null;
  }

  return (
    <Layout>
      <HeroSection />
      <KeyFeatures />
      <LoginSection />
    </Layout>
  );
};

export default Index;