import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto max-w-md">
          <svg
            className="mx-auto h-32 w-32 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8a7.962 7.962 0 01-2 5.291z"
            />
          </svg>
          <h1 className="mt-6 text-6xl font-bold text-gray-900">404</h1>
          <h2 className="mt-4 text-2xl font-semibold text-gray-700">Page not found</h2>
          <p className="mt-4 text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <div className="mt-8">
            <Link to="/">
              <Button variant="primary" size="lg">
                Go back home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;