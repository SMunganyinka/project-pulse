import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  ListChecks,
  RefreshCw,
  PlusCircle,
  BarChart2,
  Shield,
  Lock,
  ArrowRight,
  Star,
  Check,
  Zap,
} from "lucide-react";

// --- Feature type ---
interface Feature {
  title: string;
  description: string;
  icon: React.ElementType;
}

// --- Feature Data ---
const coreFeatures: Feature[] = [
  {
    icon: LayoutDashboard,
    title: "Intuitive Dashboard",
    description: "Get a clear overview of all your projects in one place with total counts and status summaries.",
  },
  {
    icon: ListChecks,
    title: "Project Management",
    description: "Create, view, and organize your projects easily. Each project displays its name, description, and status.",
  },
  {
    icon: RefreshCw,
    title: "Real-time Status Updates",
    description: "Quickly update project progress from Not Started → In Progress → Completed.",
  },
  {
    icon: PlusCircle,
    title: "Quick Project Creation",
    description: "Add new projects fast with a simple, streamlined form.",
  },
];

const securityFeatures: Feature[] = [
  {
    icon: BarChart2,
    title: "Progress Tracking",
    description: "Visual indicators help your team understand progress at a glance.",
  },
  {
    icon: Lock,
    title: "Secure Authentication",
    description: "Login, register, and manage your personal dashboard safely.",
  },
  {
    icon: Shield,
    title: "Data Persistence",
    description: "All project data is stored securely and available anytime.",
  },
];

const allInOneFeatures = [
  "Everything you need to get started",
  "No complex setup or configuration",
  "Designed for small teams and individuals",
  "Free forever for up to 3 users",
];

// --- FeatureCard Component ---
interface FeatureCardProps {
  feature: Feature;
  isVisible: boolean;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, isVisible, delay }) => (
  <div
    className={`group bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
    }`}
    style={{ transitionDelay: `${delay}ms` }}
  >
    <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 mb-6 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 transition-all duration-500 group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white group-hover:shadow-lg">
      <feature.icon className="w-7 h-7 sm:w-8 sm:h-8" />
    </div>
    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">{feature.title}</h2>
    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{feature.description}</p>
  </div>
);

// --- Scroll Animation Hook ---
const useAnimateOnScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref]);

  return isIntersecting;
};

// --- Main Component ---
const FeaturesPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const isVisible = useAnimateOnScroll(sectionRef);

  return (
    <div className="relative bg-gradient-to-b from-slate-50 to-white min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 opacity-70"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-2 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200 mb-6 sm:mb-8">
              <Zap className="w-3 h-3 mr-1" />
              Powerful Features
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4 sm:mb-6">
              Everything Your Team Needs to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Succeed</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 leading-relaxed max-w-3xl mx-auto">
              Project Pulse focuses on the essentials for small teams: clarity, speed, and a shared understanding of what matters right now.
            </p>
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="ml-3 text-sm sm:text-base text-gray-600 font-medium">Loved by 2,500+ teams worldwide</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Core Functionality</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              The essential tools you need to manage your projects effectively, without the clutter.
            </p>
          </div>
          <div ref={sectionRef} className="grid gap-6 sm:gap-8 md:grid-cols-2">
            {coreFeatures.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} isVisible={isVisible} delay={index * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* All-in-One Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">An All-in-One Platform</h2>
              <p className="text-base sm:text-lg text-gray-600">
                No need to juggle multiple tools. ProjectPulse has everything you need in one place.
              </p>
            </div>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {allInOneFeatures.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center mr-3 sm:mr-4 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security Features Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Security & Reliability</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Your data is safe with us. We use industry-standard security practices to ensure your projects are always protected.
            </p>
          </div>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {securityFeatures.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} isVisible={isVisible} delay={(index + 4) * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">Ready to get started?</h2>
          <p className="text-base sm:text-lg md:text-xl text-indigo-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Create your free account and start managing your projects today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-base sm:text-lg"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 text-white font-medium border border-white rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors hover:text-black sm:text-lg"
              >
                Sign In
              </Link>
            )}
          </div>
          <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-indigo-100">
            {isAuthenticated ? "" : "Free forever for up to 3 users"}
          </p>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;