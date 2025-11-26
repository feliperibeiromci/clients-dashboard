import React, { useState } from 'react'
import { X } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface CreateClientModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const CreateClientModal: React.FC<CreateClientModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '', // Company Name
    contact_name: '',
    email: '',
    phone: '',
    address: '',
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Sending data to Supabase:', formData)
      const { data, error } = await supabase.from('clients').insert([
        {
          name: formData.name,
          email: formData.email || null,
          metadata: {
            contact_name: formData.contact_name,
            phone: formData.phone,
            address: formData.address,
          }
        },
      ]).select()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Client created successfully:', data)
      onSuccess()
      onClose()
      setFormData({ name: '', contact_name: '', email: '', phone: '', address: '' })
    } catch (error: any) {
      console.error('Error creating client:', error)
      alert(`Error creating client: ${error.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[#17181A] rounded-2xl w-full max-w-md border border-[#2F3133] shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-[#2F3133]">
          <h3 className="text-xl font-semibold text-white">Add New Client</h3>
          <button
            onClick={onClose}
            className="text-[#ABAEB3] hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-[#ABAEB3] mb-1.5">
              Company Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#0b0c0d] border border-[#2F3133] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#FF3856] transition-colors"
              placeholder="e.g. Acme Corp"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#ABAEB3] mb-1.5">
              Contact Person
            </label>
            <input
              type="text"
              value={formData.contact_name}
              onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
              className="w-full bg-[#0b0c0d] border border-[#2F3133] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#FF3856] transition-colors"
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#ABAEB3] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#0b0c0d] border border-[#2F3133] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#FF3856] transition-colors"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#ABAEB3] mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#0b0c0d] border border-[#2F3133] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#FF3856] transition-colors"
                placeholder="+1 234 567 890"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#ABAEB3] mb-1.5">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-[#0b0c0d] border border-[#2F3133] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#FF3856] transition-colors resize-none h-24"
              placeholder="123 Business Rd, City, Country"
            />
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#2F3133] hover:bg-[#2F3133]/80 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#FF3856] hover:bg-[#FF3856]/90 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
