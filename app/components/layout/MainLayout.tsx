'use client'
import React, { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Debug authentication state
  useEffect(() => {
    console.log('Auth state in MainLayout:', { isAuthenticated, loading, user });
  }, [isAuthenticated, loading, user]);

  // Add authentication check with a delay to ensure localStorage is checked
  useEffect(() => {
    // Only run this effect once the initial loading is complete
    if (!loading) {
      setInitialLoadComplete(true);
      
      // If not authenticated after loading is complete, redirect to login
      if (!isAuthenticated && window.location.pathname !== '/login') {
        console.log('Not authenticated, redirecting to login');
        router.push('/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  // Close mobile menu when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setMobileMenuOpen(false);
    };
    
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Only check authentication for non-login pages
  if (!isAuthenticated && window.location.pathname !== '/login') {
    return null; // Don't render anything, we're redirecting
  }

  // If not authenticated after loading, don't render the layout at all
  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-gray-600">Please log in to access this page</p>
      </div>
    </div>;
  }

  // Only render the layout if authenticated
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-gradient-to-r bg-gray-800 text-white shadow-md">
        <div className="container mx-auto py-4 px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Case Management</h1>
            </div>
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li>
                  <Link href="/" className="flex items-center space-x-1 hover:text-blue-200 transition duration-150">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Dashboard</span>
                  </Link>
                </li>
                {user?.role !== "AC" && user?.role !== "Mukhtiarkar" && ( 
                  <li>
                    <Link href="/signup" className="flex items-center space-x-1 hover:text-blue-200 transition duration-150">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Add User</span>
                    </Link>
                  </li>
                )}
                <li>
                  <Link href="/cases" className="flex items-center space-x-1 hover:text-blue-200 transition duration-150">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>Cases</span>
                  </Link>
                </li>
                {user?.role !== "AC" && user?.role !== "Mukhtiarkar" && (  
                  <li>
                    <Link href="/cases/cases_all_reports_recieved" className="flex items-center space-x-1 hover:text-blue-200 transition duration-150">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span>Complete Cases</span>
                    </Link>
                  </li>
                )}
                {isAuthenticated && (
                  <li className="relative">
                    <div className="group">
                      <button 
                        className="text-xs flex items-center space-x-1 hover:text-blue-200 transition duration-150"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{user?.name || 'User'}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div className="absolute right-0 w-55 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                          <p className="font-medium">{user?.name || 'User'}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                          <p className="text-xs text-gray-500">Role: {user?.role}</p>
                        </div>
                        <Link 
                          href="/reset-password" 
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Reset Password
                        </Link>
                        <button 
                          onClick={logout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-200"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </nav>
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-2 border-t border-gray-700">
              <ul className="pt-4 space-y-4">
                <li>
                  <div className="px-2 py-2 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium">{user?.name || 'User'}</p>
                          <p className="text-xs text-gray-400">{user?.email}</p>
                          <p className="text-xs text-gray-400">Role: {user?.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <Link 
                    href="/" 
                    className="flex items-center space-x-2 px-2 py-2 rounded hover:bg-gray-700 transition duration-150"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Dashboard</span>
                  </Link>
                </li>
                {user?.role !== "AC" && user?.role !== "Mukhtiarkar" && (
                  <li>
                    <Link 
                      href="/cases" 
                      className="flex items-center space-x-2 px-2 py-2 rounded hover:bg-gray-700 transition duration-150"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span>Cases</span>
                    </Link>
                  </li>
                )}
                {user?.role !== "AC" && user?.role !== "Mukhtiarkar" && (
                  <li>
                    <Link 
                      href="/cases/cases_all_reports_recieved" 
                      className="flex items-center space-x-2 px-2 py-2 rounded hover:bg-gray-700 transition duration-150"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span>Complete Cases</span>
                    </Link>
                  </li>
                )}
                {isAuthenticated && (
                  <>
                    <li>
                      <Link
                        href="/reset-password"
                        className="flex items-center space-x-2 px-2 py-2 rounded hover:bg-gray-700 transition duration-150"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        <span>Reset Password</span>
                      </Link>
                    </li>
                    <li>
                      <button 
                        onClick={() => {
                          setMobileMenuOpen(false);
                          logout();
                        }}
                        className="flex items-center space-x-2 px-2 py-2 rounded hover:bg-gray-700 transition duration-150 w-full text-left"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-6 py-8">
        {children}
      </main>
      
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto py-3 px-3">
          <div className="pt-3 text-center text-gray-300">
            <p>© {new Date().getFullYear()} Case Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;