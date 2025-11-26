import React from 'react'

interface ClientLogoProps {
  logo: string | null | undefined
  size?: number
  className?: string
}

// SVGs dos logos das empresas - baseados no design do Figma
export const ClientLogo: React.FC<ClientLogoProps> = ({ logo, size = 20, className = '' }) => {
  const logos: Record<string, JSX.Element> = {
    renault: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12L12 5L19 12L12 19L5 12Z" fill="#ABAEB3" />
        <path d="M9 12L12 9L15 12L12 15L9 12Z" fill="#ABAEB3" />
      </svg>
    ),
    toyota: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" fill="#ABAEB3" />
        <circle cx="12" cy="12" r="4" fill="#17181A" />
      </svg>
    ),
    honda: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15 8L22 9L17 13L18 20L12 17L6 20L7 13L2 9L9 8L12 2Z" fill="#ABAEB3" />
      </svg>
    ),
    hyundai: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 6L12 2L22 6V18L12 22L2 18V6Z" fill="#ABAEB3" />
        <path d="M12 6L6 9V15L12 18L18 15V9L12 6Z" fill="#17181A" />
      </svg>
    ),
    ford: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="6" width="16" height="12" fill="#ABAEB3" />
        <path d="M8 10H16V14H8V10Z" fill="#17181A" />
      </svg>
    ),
    tesla: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15 10H22L16 14L18 22L12 17L6 22L8 14L2 10H9L12 2Z" fill="#ABAEB3" />
      </svg>
    ),
    peugeot: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4L4 8V16L12 20L20 16V8L12 4Z" fill="#ABAEB3" />
        <circle cx="12" cy="12" r="3" fill="#17181A" />
      </svg>
    ),
  }

  // Safe logo handling: if logo is null/undefined or not found, show placeholder
  const logoKey = logo ? logo.toLowerCase() : '';
  const LogoComponent = logos[logoKey];

  return (
    <div className={`w-${size} h-${size} ${className}`} style={{ width: size, height: size }}>
      {LogoComponent || (
        <div className="w-full h-full bg-[#2F3133] rounded flex items-center justify-center text-[10px] text-[#ABAEB3] font-bold">
          {/* Fallback content (e.g. initials) */}
          ?
        </div>
      )}
    </div>
  )
}
