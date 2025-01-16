import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/landing/HeroSection";
import { KeyFeatures } from "@/components/landing/KeyFeatures";
import { LoginSection } from "@/components/landing/LoginSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <KeyFeatures />
      <LoginSection />
    </Layout>
  );
};

export default Index;