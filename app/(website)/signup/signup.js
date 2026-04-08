"use client";
import { useState, useEffect } from 'react';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [rememberMe, setRememberMe] = useState(false);

  // Background images - Your custom images
  const backgroundImages = [
    'https://laprimagioielli.com/wp-content/uploads/2025/08/LaPrimaGioielli_SS26_1613-scaled.jpg',
    'https://laprimagioielli.com/wp-content/uploads/2025/08/LaPrimaGioielli_SS26_2200-scaled.jpg',
    'https://laprimagioielli.com/wp-content/uploads/2025/08/LaPrimaGioielli_SS26_2418-scaled.jpg'
  ];

  // Change background image every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Add your authentication logic here
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden mt-20">
     
     {/* Background Image Slideshow */}
<div className="absolute inset-0 z-0 -mt-20">
  {backgroundImages.map((img, index) => (
    <div
      key={index}
      className="absolute inset-0 transition-opacity duration-1000"
      style={{
        opacity: currentImageIndex === index ? 1 : 0,
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    />
  ))}

  {/* Overlay */}
  <div className="absolute inset-0 bg-white/50"></div>

</div>

      {/* Auth Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md text-center">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#004065] mb-3 uppercase tracking-wide font-barlow">
              {isSignUp ? 'Create Account' : 'Login'}
            </h1>
            <p className="text-[#004065] text-sm">
              {isSignUp 
                ? 'Sign up to get started with your account' 
                : 'Use your credentials to log in or contact us to request new ones.'}
            </p>
            {!isSignUp && (
              <button className="text-[#004065] text-sm font-semibold underline mt-2 hover:text-[#ec9cb2]">
                CONTACT US
              </button>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {isSignUp && (
              <div className="text-left">
                <label className="block text-sm text-[#004065] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded focus:border-[#ec9cb2] focus:outline-none transition"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div className="text-left">
              <label className="block text-sm text-[#004065] mb-2">
                {isSignUp ? 'Email Address' : 'Username or Email Address'}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded focus:border-[#ec9cb2] focus:outline-none transition"
                placeholder=""
              />
            </div>

            <div className="text-left">
              <label className="block text-sm text-[#004065] mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded focus:border-[#ec9cb2] focus:outline-none transition"
                placeholder=""
              />
            </div>

            {isSignUp && (
              <div className="text-left">
                <label className="block text-sm text-[#004065] mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded focus:border-[#ec9cb2]  focus:outline-none transition"
                  placeholder=""
                />
              </div>
            )}

            {!isSignUp && (
              <div className="flex items-center text-left">
                <input 
                  type="checkbox" 
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#004065] border-gray-300 rounded focus:ring-[#ec9cb2]" 
                />
                <label htmlFor="remember" className="ml-2 text-sm text-[#004065]">
                  Remember me
                </label>
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="w-auto px-12 py-3 bg-[#004065] text-white rounded-full font-medium hover:bg-[#ec9cb2] transition duration-200 mt-4"
            >
              {isSignUp ? 'Sign Up' : 'Log in'}
            </button>

            {/* Toggle Sign In/Sign Up */}
            <div className="mt-6">
              <p className="text-[#004065] text-sm">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                  }}
                  className="hover:text-[#004065] font-semibold text-[#ec9cb2] underline cursor-pointer"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}