import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div 
      className="gradient-bg min-h-screen flex items-center justify-center px-4 py-8 sm:py-12" 
      style={{ backgroundColor: '#0a1628' }}
    >
      {/* Animated gradient orbs */}
      <div className="gradient-orb gradient-orb-1" />
      <div className="gradient-orb gradient-orb-2" />
      <div className="gradient-orb gradient-orb-3" />

      {/* Mesh gradient overlay */}
      <div className="gradient-mesh" />

      <div className="gradient-content animate-fade-in-up" style={{ zIndex: 10 }}>
        <SignUp 
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'bg-[#0f1d32]/90 backdrop-blur-lg border border-gray-600/30 shadow-2xl',
              headerTitle: 'text-white',
              headerSubtitle: 'text-gray-400',
              socialButtonsBlockButton: 'bg-white hover:bg-gray-100 text-gray-800 border-none',
              socialButtonsBlockButtonText: 'font-semibold',
              dividerLine: 'bg-gray-600',
              dividerText: 'text-gray-400',
              formFieldLabel: 'text-gray-300',
              formFieldInput: 'bg-[#1a2942] border-gray-600 text-white placeholder:text-gray-500',
              formButtonPrimary: 'bg-cyan-500 hover:bg-cyan-600 text-white',
              footerActionLink: 'text-cyan-400 hover:text-cyan-300',
              identityPreviewText: 'text-white',
              identityPreviewEditButton: 'text-cyan-400',
              formFieldInputShowPasswordButton: 'text-gray-400',
              otpCodeFieldInput: 'bg-[#1a2942] border-gray-600 text-white',
              formResendCodeLink: 'text-cyan-400',
              footer: 'hidden',
            },
            layout: {
              socialButtonsPlacement: 'top',
              socialButtonsVariant: 'blockButton',
            },
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
        />
      </div>
    </div>
  );
}

