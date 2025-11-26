import React, { useEffect, useState } from 'react'
import { Plus, ChevronsUpDown, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { CreateClientModal } from './clients/CreateClientModal'
import { ClientLogo } from './projects/ClientLogo'

interface Client {
  id: string
  name: string // Company Name
  email: string | null
  metadata: {
    contact_name?: string
    phone?: string
    address?: string
  } | null
  created_at: string
}

export const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'individuals' | 'companies'>('all')
  const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set())

  const fetchClients = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setClients(data || [])
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const handleTabChange = (tab: 'all' | 'individuals' | 'companies') => {
    setActiveTab(tab)
    // Implement filter logic here if we had a type field
  }

  const toggleClientSelection = (clientId: string) => {
    const newSelection = new Set(selectedClients)
    if (newSelection.has(clientId)) {
      newSelection.delete(clientId)
    } else {
      newSelection.add(clientId)
    }
    setSelectedClients(newSelection)
  }

  const toggleAllSelection = () => {
    if (selectedClients.size === clients.length) {
      setSelectedClients(new Set())
    } else {
      setSelectedClients(new Set(clients.map(c => c.id)))
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedClients.size === 0) return

    if (!confirm(`Are you sure you want to delete ${selectedClients.size} client(s)?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .in('id', Array.from(selectedClients))

      if (error) throw error

      setSelectedClients(new Set())
      fetchClients()
    } catch (error) {
      console.error('Error deleting clients:', error)
      alert('Error deleting clients')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Tabs and Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleTabChange('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'all' 
                ? 'bg-[#2F3133] text-white' 
                : 'text-[#ABAEB3] hover:text-white'
            }`}
          >
            All Clients
          </button>
          <button
            onClick={() => handleTabChange('individuals')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'individuals' 
                ? 'bg-[#2F3133] text-white' 
                : 'text-[#ABAEB3] hover:text-white'
            }`}
          >
            Individuals
          </button>
          <button
            onClick={() => handleTabChange('companies')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'companies' 
                ? 'bg-[#2F3133] text-white' 
                : 'text-[#ABAEB3] hover:text-white'
            }`}
          >
            Companies
          </button>
        </div>

        <div className="flex items-center gap-2">
          {selectedClients.size > 0 && (
            <button 
              onClick={handleDeleteSelected}
              className="flex items-center space-x-2 bg-[#2F3133] hover:bg-red-900/50 text-red-500 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              <span>Delete ({selectedClients.size})</span>
              <Trash2 size={16} />
            </button>
          )}
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 bg-[#FF3856] hover:bg-[#FF3856]/90 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
          <span>Add New Client</span>
          <Plus size={16} />
        </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-hidden">
        <table className="w-full text-left border-collapse">
            <thead>
            <tr className="border-b border-[#2F3133]">
              <th className="py-4 px-4 w-10">
                <div 
                  onClick={toggleAllSelection}
                  className={`w-5 h-5 border rounded cursor-pointer flex items-center justify-center ${
                    selectedClients.size > 0 && selectedClients.size === clients.length 
                      ? 'border-[#FF3856] bg-transparent' 
                      : 'border-[#ABAEB3] bg-transparent'
                  }`}
                >
                  {selectedClients.size > 0 && selectedClients.size === clients.length && <div className="w-2.5 h-2.5 bg-[#FF3856] rounded-[2px]" />}
                </div>
              </th>
              <th className="py-4 px-4 text-sm font-medium text-[#ABAEB3]">
                <div className="flex items-center gap-2 cursor-pointer hover:text-white">
                  Client Name
                  <ChevronsUpDown size={14} />
                </div>
              </th>
              <th className="py-4 px-4 text-sm font-medium text-[#ABAEB3]">
                <div className="flex items-center gap-2 cursor-pointer hover:text-white">
                  Contact Email
                  <ChevronsUpDown size={14} />
                </div>
              </th>
              <th className="py-4 px-4 text-sm font-medium text-[#ABAEB3]">
                <div className="flex items-center gap-2 cursor-pointer hover:text-white">
                  Company Name
                  <ChevronsUpDown size={14} />
                </div>
              </th>
              <th className="py-4 px-4 text-sm font-medium text-[#ABAEB3]">
                <div className="flex items-center gap-2 cursor-pointer hover:text-white">
                  Address
                  <ChevronsUpDown size={14} />
                </div>
              </th>
              <th className="py-4 px-4 text-sm font-medium text-[#ABAEB3]">
                <div className="flex items-center gap-2 cursor-pointer hover:text-white">
                  List of Projects Assigned
                  <ChevronsUpDown size={14} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2F3133]">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#ABAEB3]">
                  Loading clients...
                </td>
              </tr>
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#ABAEB3]">
                  No clients found. Click "Add New Client" to create one.
                </td>
              </tr>
            ) : (
              clients.map((client, index) => (
                <tr key={client.id} className="hover:bg-[#17181A] transition-colors group">
                  <td className="py-4 px-4">
                    <div 
                      onClick={() => toggleClientSelection(client.id)}
                      className={`w-5 h-5 border rounded cursor-pointer flex items-center justify-center transition-colors ${
                        selectedClients.has(client.id) 
                          ? 'border-[#FF3856] bg-transparent' 
                          : 'border-[#ABAEB3] bg-transparent group-hover:border-white'
                      }`}
                    >
                      {selectedClients.has(client.id) && <div className="w-2.5 h-2.5 bg-[#FF3856] rounded-[2px]" />}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-[#2F3133] flex items-center justify-center shrink-0">
                        {/* Placeholder avatar using ClientLogo or initials */}
                        <ClientLogo logo={client.name.toLowerCase().includes('renault') ? 'renault' : null} size={20} />
                      </div>
                      <span className="text-sm text-[#F1F2F3] font-medium">
                        {client.metadata?.contact_name || client.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-[#ABAEB3]">
                      {client.email || 'Lorem Ipsum'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-[#ABAEB3]">
                      {client.name}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-[#ABAEB3]">
                      {client.metadata?.address || 'Lorem Ipsum'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-[#ABAEB3]">
                      Lorem Ipsum
                    </span>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
        
      <CreateClientModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchClients}
      />
    </div>
  )
}
