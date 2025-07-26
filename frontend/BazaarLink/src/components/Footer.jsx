import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">BazaarLink</h3>
            <p className="text-gray-300 mb-4">
              Connecting vendors and suppliers for seamless B2B transactions. 
              Join our marketplace to grow your business.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white transition-colors">
                  Join as Vendor
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white transition-colors">
                  Join as Supplier
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} BazaarLink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;