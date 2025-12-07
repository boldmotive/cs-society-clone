export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full" style={{ backgroundColor: '#0a1628' }}>
      {/* Animated gradient orbs for visual interest */}
      <div className="gradient-bg min-h-screen">
        <div className="gradient-orb gradient-orb-1" />
        <div className="gradient-orb gradient-orb-2" />
        <div className="gradient-orb gradient-orb-3" />
        <div className="gradient-mesh" />

        <div className="gradient-content">
          {children}
        </div>
      </div>
    </div>
  );
}
