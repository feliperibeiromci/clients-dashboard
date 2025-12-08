import React from 'react'
import { ClientLogo } from './ClientLogo'

interface ClientFilterProps {
  selectedClient: string
  onSelectClient: (client: string) => void
}

const clients = [
  { id: 'all', name: 'All Clients', logo: null },
  { id: 'renault', name: 'Renault', logo: 'renault' },
  { id: 'toyota', name: 'Toyota', logo: 'toyota' },
  { id: 'hyundai', name: 'Hyundai', logo: 'hyundai' },
  { id: 'honda', name: 'Honda', logo: 'honda' },
  { id: 'ford', name: 'Ford', logo: 'ford' },
  { id: 'tesla', name: 'Tesla', logo: 'tesla' },
  { id: 'peugeot', name: 'Peugeot', logo: 'peugeot' },
]

export const ClientFilter: React.FC<ClientFilterProps> = ({ selectedClient, onSelectClient }) => {
  return (
    <div className="flex items-center gap-2 flex-wrap overflow-x-auto scrollbar-hide pb-2">
      {clients.map((client) => {
        const isSelected = selectedClient === client.id
        return (
          <button
            key={client.id}
            onClick={() => onSelectClient(client.id)}
            className={`
              relative flex items-center gap-1.5 px-1 py-0.5 rounded transition-all duration-300 group shrink-0
              ${isSelected 
                ? 'opacity-100' 
                : 'opacity-50 hover:opacity-75'
              }
            `}
          >
            {/* Background for selected state */}
            {isSelected && (
              <div className="absolute inset-0 rounded border border-[#5D6166] bg-[#5D6166] transition-all duration-300" />
            )}
            
            {/* Background for unselected state */}
            {!isSelected && (
              <div className="absolute inset-0 rounded border border-[#747980] bg-[#747980]/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
            )}

            {/* Content */}
            <div className="relative z-10 flex items-center gap-1.5 px-1 py-0.5">
              {client.logo && (
                <div className="shrink-0 w-3.5 h-3.5 md:w-4 md:h-4">
                  <ClientLogo logo={client.logo} size={14} />
                </div>
              )}
              <span className={`
                text-xs md:text-sm font-normal leading-[15.6px] md:leading-[18.2px] tracking-[-0.24px] md:tracking-[-0.28px] whitespace-nowrap transition-colors duration-300
                ${isSelected 
                  ? 'text-[#F1F2F3]' 
                  : 'text-[#F1F2F3]'
                }
              `}>
                {client.name}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

