export const FilipinoSunIcon = ({ className = "h-8 w-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="currentColor">
    <circle cx="50" cy="50" r="16" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
      <polygon
        key={deg}
        points="50,26 44,2 56,2"
        transform={`rotate(${deg} 50 50)`}
      />
    ))}
  </svg>
);
