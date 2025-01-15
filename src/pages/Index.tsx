import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/landing/HeroSection";
import { KeyFeatures } from "@/components/landing/KeyFeatures";
import { LoginSection } from "@/components/landing/LoginSection";

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (session) {
    return null; // Will redirect to dashboard
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