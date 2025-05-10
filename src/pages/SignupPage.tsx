
import React from 'react';
import SignupForm from '@/components/SignupForm';

const SignupPage = () => {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join thousands of companies optimizing their supply chain with Supply Seer
          </p>
        </div>
        
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
