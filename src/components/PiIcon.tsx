import React from "react";

interface PiIconProps {
  /** Size of the icon in pixels or Tailwind classes (e.g., "24" or "w-6 h-6") */
  size?: string | number;
  /** Additional CSS classes */
  className?: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Click handler */
  onClick?: () => void;
  /** Opacity level (0-1) for background usage */
  opacity?: number;
  /** Custom style object */
  style?: React.CSSProperties;
}

const PiIcon: React.FC<PiIconProps> = ({
  size = 24,
  className = "",
  alt = "Pi Network",
  onClick,
  opacity,
  style,
}) => {
  // Handle size prop - can be number, pixel string, or Tailwind classes
  const getSize = () => {
    if (typeof size === "number") {
      return { width: size, height: size };
    }

    if (typeof size === "string") {
      // If it's a number string, treat as pixels
      if (/^\d+$/.test(size)) {
        const pixels = parseInt(size, 10);
        return { width: pixels, height: pixels };
      }

      // If it contains Tailwind classes, don't set inline styles
      if (size.includes("w-") || size.includes("h-")) {
        return {};
      }

      // Otherwise treat as CSS size value
      return { width: size, height: size };
    }

    return { width: 24, height: 24 };
  };

  const sizeStyles = getSize();
  const opacityStyle = opacity !== undefined ? { opacity } : {};

  // Combine all styles
  const combinedStyle = {
    ...sizeStyles,
    ...opacityStyle,
    ...style,
  };

  // Add Tailwind size classes if provided
  const sizeClassName =
    typeof size === "string" && (size.includes("w-") || size.includes("h-"))
      ? size
      : "";
  const combinedClassName = `${sizeClassName} ${className}`.trim();

  return (
    <img
      src="https://cdn.worldvectorlogo.com/logos/pi-network-lvquy.svg"
      alt={alt}
      className={combinedClassName}
      style={combinedStyle}
      onClick={onClick}
    />
  );
};

export default PiIcon;

// Usage Examples:
/*
// Basic usage
<PiIcon />

// With pixel size
<PiIcon size={32} />

// With string pixel size
<PiIcon size="48" />

// With CSS size
<PiIcon size="2rem" />

// With Tailwind classes
<PiIcon size="w-8 h-8" />

// With custom className and opacity for backgrounds
<PiIcon 
  size="w-16 h-16" 
  className="absolute top-2 right-2" 
  opacity={0.1}
  alt="Pi Network Background Logo"
/>

// Clickable with custom styling
<PiIcon 
  size={24}
  className="cursor-pointer hover:scale-110 transition-transform"
  onClick={() => console.log('Pi icon clicked!')}
/>

// For inline text usage
<PiIcon size="w-4 h-4" className="inline mx-1" />

// Background usage
<PiIcon 
  size={64}
  className="absolute top-4 right-4"
  opacity={0.05}
/>
*/
