import { useState, useEffect, useRef } from "react";
import "./App.css";

import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import CtaSection from "./components/CtaSection";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import AllStatsModal from "./components/AllStatsModal";

export default function App() {
  const rootRef = useRef(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAllStatsOpen, setIsAllStatsOpen] = useState(false);

  // Scroll-reveal for elements with the .reveal class
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const revealEls = root.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return (
    <div className="fold-landing" ref={rootRef}>
      <Nav 
        onOpenAuth={() => setIsAuthOpen(true)} 
        onOpenAllStats={() => setIsAllStatsOpen(true)}
      />
      <Hero />
      <Features />
      <HowItWorks />
      <CtaSection />
      <Footer />
      {isAuthOpen && <AuthModal onClose={() => setIsAuthOpen(false)} />}
      {isAllStatsOpen && <AllStatsModal onClose={() => setIsAllStatsOpen(false)} />}
    </div>
  );
}
