import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail, MapPin } from 'lucide-react';

/**
 * Site-wide footer component with navigation, contact info, social links, and legal pages.
 * Appears on every page via the root layout.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 text-gray-700 border-t border-gray-200" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* About Section */}
          <div className="lg:col-span-2">
            <h3 className="text-gray-900 font-semibold text-lg mb-4">SC Innovation Hub</h3>
            <p className="text-gray-600 mb-4 max-w-md">
              Connecting South Carolina's innovation ecosystem. Discover companies, events, and opportunities 
              that are shaping the future of technology in the Palmetto State.
            </p>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Charleston, South Carolina</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Mail className="h-4 w-4 mr-2" />
              <a 
                href="mailto:hello@scinnovationhub.com" 
                className="hover:text-gray-900 transition-colors"
              >
                hello@scinnovationhub.com
              </a>
            </div>
          </div>

          {/* Navigation Section */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Companies
                </Link>
              </li>
              <li>
                <Link 
                  href="/events" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link 
                  href="/account-dashboard" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Account
                </Link>
              </li>
              <li>
                <Link 
                  href="/saved-companies" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Saved Companies
                </Link>
              </li>
              <li>
                <Link 
                  href="/saved-events" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Saved Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support Section */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4">Legal & Support</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/privacy" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section with Social Links and Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          
          {/* Social Links */}
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a 
              href="https://twitter.com/scinnovationhub" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Follow us on Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="https://linkedin.com/company/sc-innovation-hub" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Follow us on LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href="https://github.com/sc-innovation-hub" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="View our GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-gray-600 text-sm">
            © {currentYear} SC Innovation Hub. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}