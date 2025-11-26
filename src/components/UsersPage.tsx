import React, { useEffect, useState } from 'react'
import { Plus, ChevronsUpDown, Trash2, Edit2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { CreateUserModal } from './users/CreateUserModal'
import { ClientLogo } from './projects/ClientLogo'

interface UserData {
  id: string
  name: string // Full Name
  email: string | null
  phone: string | null
  app_role: string | null
  created_at: string
}

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'individuals' | 'companies'>('all')
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [editingUser, setEditingUser] = useState<UserData | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleTabChange = (tab: 'all' | 'individuals' | 'companies') => {
    setActiveTab(tab)
  }

  const toggleUserSelection = (userId: string) => {
    const newSelection = new Set(selectedUsers)
    if (newSelection.has(userId)) {
      newSelection.delete(userId)
    } else {
      newSelection.add(userId)
    }
    setSelectedUsers(newSelection)
  }

  const toggleAllSelection = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set())
    } else {
      setSelectedUsers(new Set(users.map(u => u.id)))
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedUsers.size === 0) return

    if (!confirm(`Are you sure you want to delete ${selectedUsers.size} user(s)?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .in('id', Array.from(selectedUsers))

      if (error) throw error

      setSelectedUsers(new Set())
      fetchUsers()
    } catch (error) {
      console.error('Error deleting users:', error)
      alert('Error deleting users')
    }
  }

  const handleEdit = () => {
    if (selectedUsers.size !== 1) return
    const userId = Array.from(selectedUsers)[0]
    const userToEdit = users.find(u => u.id === userId)
    if (userToEdit) {
      setEditingUser(userToEdit)
      setIsCreateModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsCreateModalOpen(false)
    setEditingUser(null)
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
            All Users
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
          {selectedUsers.size > 0 && (
            <button 
              onClick={handleDeleteSelected}
              className="flex items-center space-x-2 bg-[#2F3133] hover:bg-red-900/50 text-red-500 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              <span>Delete ({selectedUsers.size})</span>
              <Trash2 size={16} />
            </button>
          )}
          
          {selectedUsers.size === 1 && (
             <button 
              onClick={handleEdit}
              className="flex items-center space-x-2 bg-[#2F3133] hover:bg-[#45484D] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              <span>Edit</span>
              <Edit2 size={16} />
            </button>
          )}

          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 bg-[#FF3856] hover:bg-[#FF3856]/90 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            <span>Add New User</span>
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
                    selectedUsers.size > 0 && selectedUsers.size === users.length 
                      ? 'border-[#FF3856] bg-transparent' 
                      : 'border-[#ABAEB3] bg-transparent'
                  }`}
                >
                  {selectedUsers.size > 0 && selectedUsers.size === users.length && <div className="w-2.5 h-2.5 bg-[#FF3856] rounded-[2px]" />}
                </div>
              </th>
              <th className="py-4 px-4 text-sm font-medium text-[#ABAEB3]">
                <div className="flex items-center gap-2 cursor-pointer hover:text-white">
                  User Name
                  <ChevronsUpDown size={14} />
                </div>
              </th>
              <th className="py-4 px-4 text-sm font-medium text-[#ABAEB3]">
                <div className="flex items-center gap-2 cursor-pointer hover:text-white">
                  Email
                  <ChevronsUpDown size={14} />
                </div>
              </th>
              <th className="py-4 px-4 text-sm font-medium text-[#ABAEB3]">
                <div className="flex items-center gap-2 cursor-pointer hover:text-white">
                  Phone
                  <ChevronsUpDown size={14} />
                </div>
              </th>
              <th className="py-4 px-4 text-sm font-medium text-[#ABAEB3]">
                <div className="flex items-center gap-2 cursor-pointer hover:text-white">
                  Role
                  <ChevronsUpDown size={14} />
                </div>
              </th>
              <th className="py-4 px-4 text-sm font-medium text-[#ABAEB3]">
                <div className="flex items-center gap-2 cursor-pointer hover:text-white">
                  Projects Assigned
                  <ChevronsUpDown size={14} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2F3133]">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#ABAEB3]">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#ABAEB3]">
                  No users found. Click "Add New User" to create one.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-[#17181A] transition-colors group">
                  <td className="py-4 px-4">
                    <div 
                      onClick={() => toggleUserSelection(user.id)}
                      className={`w-5 h-5 border rounded cursor-pointer flex items-center justify-center transition-colors ${
                        selectedUsers.has(user.id) 
                          ? 'border-[#FF3856] bg-transparent' 
                          : 'border-[#ABAEB3] bg-transparent group-hover:border-white'
                      }`}
                    >
                      {selectedUsers.has(user.id) && <div className="w-2.5 h-2.5 bg-[#FF3856] rounded-[2px]" />}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-[#2F3133] flex items-center justify-center shrink-0">
                         {/* Placeholder for User Avatar - maybe initials? */}
                         <div className="text-xs font-bold text-white">{user.name.slice(0, 2).toUpperCase()}</div>
                      </div>
                      <span className="text-sm text-[#F1F2F3] font-medium">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-[#ABAEB3]">
                      {user.email || '-'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-[#ABAEB3]">
                      {user.phone || '-'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-[#ABAEB3]">
                      {user.app_role || 'Client'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-[#ABAEB3]">
                      -
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CreateUserModal 
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onSuccess={() => {
          fetchUsers()
          setEditingUser(null)
        }}
        initialData={editingUser ? {
          id: editingUser.id,
          fullName: editingUser.name,
          phone: editingUser.phone || '',
          email: editingUser.email || '',
          role: editingUser.app_role || ''
        } : null}
      />
    </div>
  )
}
