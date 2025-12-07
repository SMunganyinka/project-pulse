import React from "react";
import { Link } from "react-router-dom";

const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    aria-hidden="true"
    fill="currentColor"
  >
    <path d="M4 4h4.5l3.1 4.5L15.3 4H20l-6.2 8.1L20 20h-4.5l-3.4-4.9L8.7 20H4l6.3-8.2L4 4z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    aria-hidden="true"
    fill="currentColor"
  >
    <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.25 8.5h4.5V23H.25zM8.75 8.5H13v2h.06c.59-1.1 2.03-2.25 4.19-2.25C21.75 8.25 23 10.2 23 13.57V23h-4.5v-8.18c0-1.95-.7-3.28-2.45-3.28-1.33 0-2.12.9-2.47 1.77-.13.32-.16.77-.16 1.22V23H8.75z" />
  </svg>
);

const GitHubIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    aria-hidden="true"
    fill="currentColor"
  >
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.42 7.9 10.95.58.11.8-.25.8-.57 0-.28-.01-1.02-.02-2-3.22.7-3.9-1.55-3.9-1.55-.53-1.35-1.29-1.7-1.29-1.7-1.06-.73.08-.72.08-.72 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.26 3.4.96.1-.76.4-1.26.72-1.55-2.57-.29-5.27-1.29-5.27-5.74 0-1.27.45-2.31 1.2-3.12-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.19A11 11 0 0 1 12 5.8c.98 0 1.96.13 2.88.37 2.2-1.5 3.17-1.19 3.17-1.19.63 1.59.23 2.76.11 3.05.75.81 1.2 1.85 1.2 3.12 0 4.46-2.7 5.44-5.28 5.73.41.36.77 1.08.77 2.18 0 1.57-.02 2.83-.02 3.22 0 .32.21.69.81.57A10.51 10.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
  </svg>
);

// New Instagram Icon Component
const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    aria-hidden="true"
    fill="currentColor"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
  </svg>
);

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Project Pulse & Our Vision */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 mb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                P
              </span>
              <span className="text-sm font-semibold text-slate-900">
                Project Pulse
              </span>
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-2">Our Vision</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Empowering teams of all sizes with intuitive project management tools that simplify complexity and drive success.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold text-slate-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-xs text-slate-600 hover:text-indigo-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-xs text-slate-600 hover:text-indigo-600 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-xs text-slate-600 hover:text-indigo-600 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-semibold text-slate-900 mb-4">Contact</h3>
            <p className="text-xs text-slate-600 mb-2">
              Nexventures Ltd.
            </p>
            <p className="text-xs text-slate-600 mb-2">
              Kigali, Rwanda
            </p>
            <p className="text-xs text-slate-600">
              Email:{" "}
              <a
                href="mailto:info@nexventures.net"
                className="text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                info@nexventures.net
              </a>
            </p>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center mt-8 space-x-4">
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
          >
            <XIcon />
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
          >
            <LinkedInIcon />
          </a>
          <a
            href="https://www.instagram.com" // Added Instagram link
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
          >
            <InstagramIcon /> {/* Added Instagram Icon component */}
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
          >
            <GitHubIcon />
          </a>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-600">
            © {year} Project Pulse. Built for Nexventures Ltd.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;