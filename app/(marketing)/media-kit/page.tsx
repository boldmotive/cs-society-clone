import Image from "next/image";

export const metadata = {
  title: "Media Kit | CS Society",
  description: "Download our brand assets, logos, and guidelines for press and partnership materials.",
};

export default function MediaKitPage() {
  const brandColors = [
    { name: "Primary Cyan", hex: "#06b6d4", rgb: "6, 182, 212" },
    { name: "Dark Background", hex: "#0a1628", rgb: "10, 22, 40" },
    { name: "Card Background", hex: "#0f1d32", rgb: "15, 29, 50" },
    { name: "Accent Purple", hex: "#8b5cf6", rgb: "139, 92, 246" },
  ];

  const logoVariants = [
    { name: "Primary Logo", description: "Full color on dark background", file: "logo-primary.png" },
    { name: "White Logo", description: "For dark or busy backgrounds", file: "logo-white.png" },
    { name: "Icon Only", description: "For small spaces and favicons", file: "logo-icon.png" },
  ];

  return (
    <div className="w-full py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-sm mb-4">
            ✦ Brand Resources
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Media Kit
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Everything you need to represent the Computer Science Society in press,
            partnerships, and promotional materials.
          </p>
        </div>

        {/* Logo Section */}
        <div className="mb-16 animate-fade-in-up animation-delay-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Our Logo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {logoVariants.map((variant, index) => (
              <div key={index} className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl p-6 card-hover">
                <div className="h-32 bg-[#1a2a42] rounded-lg mb-4 flex items-center justify-center">
                  <Image
                    src="/images/computer-science-society-logo.png"
                    alt={variant.name}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-white font-semibold mb-1">{variant.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{variant.description}</p>
                <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">
                  Download PNG →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Colors */}
        <div className="mb-16 animate-fade-in-up animation-delay-300">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Brand Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {brandColors.map((color, index) => (
              <div key={index} className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl overflow-hidden card-hover">
                <div className="h-24" style={{ backgroundColor: color.hex }} />
                <div className="p-4">
                  <h3 className="text-white font-semibold text-sm mb-1">{color.name}</h3>
                  <p className="text-gray-400 text-xs mb-1">{color.hex}</p>
                  <p className="text-gray-500 text-xs">RGB: {color.rgb}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="mb-16 animate-fade-in-up animation-delay-400">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Typography</h2>
          <div className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl p-6 sm:p-8">
            <div className="space-y-6">
              <div>
                <p className="text-gray-400 text-sm mb-2">Primary Font</p>
                <p className="text-4xl text-white font-semibold">System UI / SF Pro</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">Heading Example</p>
                <p className="text-2xl text-white font-bold">Computer Science Society</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">Body Example</p>
                <p className="text-gray-300">
                  We believe that everyone has the potential to create amazing things with technology.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Guidelines */}
        <div className="mb-16 animate-fade-in-up animation-delay-500">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Usage Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0f1d32]/80 border border-green-500/30 rounded-xl p-6">
              <h3 className="text-green-400 font-semibold mb-4 flex items-center gap-2">
                <span>✓</span> Do
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Use the logo with adequate spacing around it</li>
                <li>• Maintain the original aspect ratio</li>
                <li>• Use on contrasting backgrounds</li>
                <li>• Reference us as &quot;Computer Science Society&quot; or &quot;CS Society&quot;</li>
              </ul>
            </div>
            <div className="bg-[#0f1d32]/80 border border-red-500/30 rounded-xl p-6">
              <h3 className="text-red-400 font-semibold mb-4 flex items-center gap-2">
                <span>✗</span> Don&apos;t
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Stretch or distort the logo</li>
                <li>• Change the logo colors</li>
                <li>• Add effects like shadows or outlines</li>
                <li>• Use on busy backgrounds without a container</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Download All */}
        <div className="text-center animate-fade-in-up animation-delay-600">
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Download Complete Media Kit</h2>
            <p className="text-gray-400 mb-6">
              Get all logos, colors, and guidelines in one convenient package.
            </p>
            <button className="btn-animated">
              <span className="btn-text">Download Media Kit (.zip)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
