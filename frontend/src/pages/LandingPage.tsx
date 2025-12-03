import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { CheckCircle, BarChart2, Users} from "lucide-react";

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">


      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-6">
        <div className="max-w-6xl w-full flex flex-col items-center text-center py-16">
          {/* Tagline */}
          <p className="inline-flex items-center rounded-full bg-indigo-50 px-4 py-2 text-xs font-medium text-indigo-700 ring-1 ring-indigo-100">
            Simple Project Management
          </p>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mt-6">
            Keep Your Projects  <span className="text-indigo-600">On Track</span>
          </h1>

          {/* Subtext */}
          <p className="max-w-xl text-gray-600 text-lg leading-relaxed mt-6">
            A lightweight dashboard for small teams to track progress,
             manage tasks, and stay aligned. Simple, fast, and focused on what matters.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 transition"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
            </Link>
            <Link
              to="/features"
              className="px-6 py-3 text-gray-700 font-medium hover:text-gray-900 transition"
            >
              View Features
            </Link>
          </div>

          {/* Features Section */}
          <div className="mt-20 w-full max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-10">Everything you need to manage projects</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <BarChart2 className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Progress</h3>
                <p className="text-gray-600">
                  Monitor project status and keep your team aligned and informed.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Manage Tasks</h3>
                <p className="text-gray-600">
                  Organize and update project status with our streamlined interface.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Collaborate Easily</h3>
                <p className="text-gray-600">
                  Keep your team aligned and communicate effectively.
                </p>
              </div>
            </div>
          </div>

          {/* Ready to Get Started Section */}
          <div className="mt-20 w-full max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ready to get started?</h2>
            <p className=" text-sm text-gray-600 sm:text-base mb-6">Create your free account and start managing your projects today.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 transition"
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
              </Link>
        
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;