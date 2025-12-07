import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  CheckCircle, 
  BarChart2, 
  Users, 
  ArrowRight, 
  Star,
  Zap,
  ChevronDown,
  Check,
  Monitor,
  UserPlus,
  TrendingUp
} from "lucide-react";

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  
  const features = [
    {
      icon: <BarChart2 className="w-8 h-8 text-indigo-600" />,
      title: "Track Progress",
      description: "Monitor project status and keep your team aligned and informed.",
      color: "bg-indigo-100"
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
      title: "Manage Tasks",
      description: "Organize and update project status with our streamlined interface.",
      color: "bg-green-100"
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Collaborate Easily",
      description: "Keep your team aligned and communicate effectively.",
      color: "bg-purple-100"
    }
  ];

  // Updated testimonials with photos of Black people using randomuser.me API
  const testimonials = [
    {
      name: "Aisha Johnson",
      role: "Project Manager at TechCorp",
      content: "ProjectPulse transformed how our team collaborates. We've seen a 40% increase in productivity since implementing it.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/44.jpg" // Black woman
    },
    {
      name: "Marcus Williams",
      role: "CEO at StartupHub",
      content: "The intuitive interface and powerful features make project management a breeze. Highly recommended for small teams.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg" // Black man
    },
    {
      name: "Jamila Davis",
      role: "Creative Director at DesignWorks",
      content: "Finally, a project management tool that doesn't get in the way of creativity. It's simple, elegant, and effective.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/90.jpg" // Black woman
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      features: ["Up to 3 users", "Basic project management", "Task tracking", "Email support"],
      highlighted: false
    },
    {
      name: "Professional",
      price: "$12",
      period: "per user/month",
      features: ["Up to 20 users", "Advanced project management", "Time tracking", "Priority support", "Custom integrations"],
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: ["Unlimited users", "Advanced security", "Dedicated account manager", "Custom training", "SLA guarantee"],
      highlighted: false
    }
  ];

  const faqs = [
    {
      question: "How does ProjectPulse compare to other project management tools?",
      answer: "ProjectPulse is specifically designed for small teams that need a simple, intuitive solution without the complexity of enterprise tools. We focus on the essential features that drive productivity without overwhelming your team."
    },
    {
      question: "Can I integrate ProjectPulse with tools I already use?",
      answer: "Yes! ProjectPulse offers integrations with popular tools like Slack, Google Drive, and more. Our Professional plan includes custom integrations to connect with your existing workflow."
    },
    {
      question: "Is my data secure with ProjectPulse?",
      answer: "Absolutely. We use industry-standard encryption and security practices to ensure your data is safe. All data is backed up regularly and stored in secure, SOC 2 compliant data centers."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 opacity-70"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-2 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200 mb-6 sm:mb-8">
              <Zap className="w-3 h-3 mr-1" />
              Simple Project Management
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-4 sm:mb-6">
              Keep Your Projects <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">On Track</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto">
              A lightweight dashboard for small teams to track progress, manage tasks, and stay aligned. Simple, fast, and focused on what matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center text-base sm:text-lg"
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Link>
              <Link
                to="/features"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center text-base sm:text-lg"
              >
                View Features
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Link>
            </div>
            {!isAuthenticated && (
              <p className="text-sm text-gray-600 mb-12 sm:mb-16">
                Free forever for up to 3 users. No credit card required.
              </p>
            )}
            <div className="relative max-w-3xl sm:max-w-4xl lg:max-w-5xl mx-auto">
              <div className="bg-white rounded-xl shadow-xl p-2 sm:p-4">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 sm:p-8 md:p-12">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
                    <div>
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-600 mb-2">40%</div>
                      <div className="text-sm sm:text-base text-gray-600">Increase in Productivity</div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600 mb-2">2,500+</div>
                      <div className="text-sm sm:text-base text-gray-600">Teams Using ProjectPulse</div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-600 mb-2">4.9/5</div>
                      <div className="text-sm sm:text-base text-gray-600">Customer Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to manage projects</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides all the essential tools your team needs to stay organized and productive.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 ${feature.color} rounded-full flex items-center justify-center mb-4 sm:mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{feature.description}</p>
                  <Link to="/features" className="text-indigo-600 font-medium flex items-center text-sm sm:text-base">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - Reverted to Icon-based Layout */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">How ProjectPulse Works</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in minutes and see immediate improvements in your team's productivity.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Sign Up</h3>
              <p className="text-sm sm:text-base text-gray-600">Create your free account in less than a minute. No credit card required.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Monitor className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Create Projects</h3>
              <p className="text-sm sm:text-base text-gray-600">Set up your projects and invite team members to collaborate.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Track Progress</h3>
              <p className="text-sm sm:text-base text-gray-600">Monitor tasks, deadlines, and milestones to keep projects on track.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with New Avatars */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied teams who have transformed their project management with ProjectPulse.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover mr-3 sm:mr-4 border-2 border-gray-100"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</div>
                    <div className="text-gray-600 text-xs sm:text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for your team. Start free and upgrade as you grow.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-xl shadow-lg overflow-hidden ${plan.highlighted ? 'ring-2 ring-indigo-500 transform lg:scale-105' : ''}`}>
                {plan.highlighted && (
                  <div className="bg-indigo-600 text-white text-center py-2 text-xs sm:text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="p-6 sm:p-8">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4 sm:mb-6">
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-sm sm:text-base text-gray-600 ml-2">{plan.period}</span>}
                  </div>
                  <ul className="mb-6 sm:mb-8 space-y-2 sm:space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-sm sm:text-base">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={isAuthenticated ? "/dashboard" : "/register"}
                    className={`block w-full py-2 sm:py-3 px-4 rounded-lg text-center font-medium transition-colors text-sm sm:text-base ${
                      plan.highlighted
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isAuthenticated ? "Go to Dashboard" : plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions? We've got answers. If you don't see what you're looking for, feel free to contact our support team.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-3 sm:mb-4">
                <button
                  className="w-full text-left bg-white rounded-lg shadow-md p-4 sm:p-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onClick={() => setActiveTab(activeTab === index ? -1 : index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">{faq.question}</h3>
                    <div className={`transform transition-transform ${activeTab === index ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    </div>
                  </div>
                </button>
                {activeTab === index && (
                  <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mt-2">
                    <p className="text-sm sm:text-base text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
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
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-base sm:text-lg"
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          </Link>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-indigo-100">
            {isAuthenticated ? "" : "Free forever for up to 3 users"}
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;