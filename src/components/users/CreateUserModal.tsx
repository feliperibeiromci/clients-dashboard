import React, { useState, useEffect } from 'react'
import { X, Search, Check } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { ClientLogo } from '../projects/ClientLogo'

interface Project {
  id: string
  name: string
  company: string
  logo: string
}

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  initialData?: {
    id: string
    fullName: string
    phone: string
    email: string
    role: string
  } | null
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData
}) => {
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('All Clients')
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    role: '',
  })

  useEffect(() => {
    if (isOpen) {
      fetchProjects()
      if (initialData) {
        setFormData({
          fullName: initialData.fullName || '',
          phone: initialData.phone || '',
          email: initialData.email || '',
          role: initialData.role || '',
        })
        fetchUserProjects(initialData.id)
      } else {
        setFormData({ fullName: '', phone: '', email: '', role: '' })
        setSelectedProjects(new Set())
      }
    }
  }, [isOpen, initialData])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('name')
      
      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const fetchUserProjects = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_project_access')
        .select('project_id')
        .eq('user_id', userId)

      if (error) throw error
      
      if (data) {
        setSelectedProjects(new Set(data.map(item => item.project_id)))
      }
    } catch (error) {
      console.error('Error fetching user projects:', error)
    }
  }

  const handleToggleProject = (projectId: string) => {
    const newSelection = new Set(selectedProjects)
    if (newSelection.has(projectId)) {
      newSelection.delete(projectId)
    } else {
      newSelection.add(projectId)
    }
    setSelectedProjects(newSelection)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let userId = initialData?.id

      if (userId) {
        // UPDATE existing user
        const { error: updateError } = await supabase
          .from('clients')
          .update({
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            app_role: formData.role,
          })
          .eq('id', userId)

        if (updateError) throw updateError

        // Update projects: delete all and re-insert (simplest strategy)
        const { error: deleteError } = await supabase
          .from('user_project_access')
          .delete()
          .eq('user_id', userId)

        if (deleteError) throw deleteError

      } else {
        // CREATE new user
        const { data: userData, error: userError } = await supabase
          .from('clients')
          .insert([
            {
              name: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              app_role: formData.role,
            },
          ])
          .select()
          .single()

        if (userError) throw userError
        userId = userData.id
      }

      // Insert Project Access links
      if (userId && selectedProjects.size > 0) {
        const accessInserts = Array.from(selectedProjects).map(projectId => ({
          user_id: userId,
          project_id: projectId
        }))

        const { error: accessError } = await supabase
          .from('user_project_access')
          .insert(accessInserts)

        if (accessError) throw accessError
      }

      onSuccess()
      onClose()
      if (!initialData) {
        setFormData({ fullName: '', phone: '', email: '', role: '' })
        setSelectedProjects(new Set())
      }
    } catch (error: any) {
      console.error('Error saving user:', error)
      alert(`Error saving user: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  // Unique companies for filter
  const companies = ['All Clients', ...Array.from(new Set(projects.map(p => p.company)))]

  // Filtered projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = activeFilter === 'All Clients' || project.company === activeFilter
    
    return matchesSearch && matchesFilter
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#17181A] rounded-[24px] w-full max-w-2xl border border-[#2F3133] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-semibold text-white tracking-tight">
              {initialData ? 'Edit User' : 'Add User'}
            </h2>
            <button onClick={onClose} className="text-[#ABAEB3] hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>
          <p className="text-[#ABAEB3] text-base">
            {initialData 
              ? 'Update user details and project access.' 
              : "An email will be sent to this user and he'll be invited to access the MCI Dashboard."}
          </p>
        </div>

        <div className="px-8 flex-1 overflow-y-auto custom-scrollbar">
          <form id="createUserForm" onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Inputs Grid */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-[#ABAEB3] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#212326] border border-[#2F3133] rounded-lg px-4 py-3 text-white placeholder-[#5D6166] focus:outline-none focus:border-[#FF3856] transition-colors"
                  placeholder="e.g. James Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#ABAEB3] mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#212326] border border-[#2F3133] rounded-lg px-4 py-3 text-white placeholder-[#5D6166] focus:outline-none focus:border-[#FF3856] transition-colors"
                  placeholder="+0 123 465 7890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#ABAEB3] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#212326] border border-[#2F3133] rounded-lg px-4 py-3 text-white placeholder-[#5D6166] focus:outline-none focus:border-[#FF3856] transition-colors"
                  placeholder="james.smith@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#ABAEB3] mb-2">
                  {initialData ? 'User Role' : 'New User Role'}
                </label>
                <div className="relative">
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-[#212326] border border-[#2F3133] rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-[#FF3856] transition-colors cursor-pointer"
                    required
                  >
                    <option value="" disabled>Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#ABAEB3]">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Access Section */}
            <div className="mt-2">
              <h3 className="text-lg font-semibold text-white mb-2">Project Access</h3>
              <p className="text-[#ABAEB3] text-sm mb-4">
                Give access to specific projects for this user before hand. He'll be able to interact with it depending on the role you chose for him.
              </p>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar max-w-[60%] pb-2">
                  {companies.map(company => (
                    <button
                      key={company}
                      type="button"
                      onClick={() => setActiveFilter(company)}
                      className={`
                        px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border
                        ${activeFilter === company
                          ? 'bg-[#F1F2F3] text-black border-[#F1F2F3]'
                          : 'bg-transparent text-[#ABAEB3] border-[#2F3133] hover:border-[#ABAEB3] hover:text-white'
                        }
                      `}
                    >
                      {company}
                    </button>
                  ))}
                </div>
                
                <div className="flex-1 min-w-[150px] relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5D6166]" size={16} />
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for Something"
                    className="w-full bg-[#212326] border border-[#2F3133] rounded-full pl-9 pr-4 py-1.5 text-sm text-white placeholder-[#5D6166] focus:outline-none focus:border-[#FF3856] transition-colors"
                  />
                </div>
              </div>

              {/* Projects List */}
              <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredProjects.length === 0 ? (
                   <div className="text-center py-8 text-[#5D6166] text-sm">No projects found</div>
                ) : (
                  filteredProjects.map(project => {
                    const isSelected = selectedProjects.has(project.id)
                    return (
                      <div 
                        key={project.id}
                        onClick={() => handleToggleProject(project.id)}
                        className={`
                          flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200
                          ${isSelected 
                            ? 'bg-[#FF3856]/10 border-[#FF3856]' 
                            : 'bg-[#212326] border-[#2F3133] hover:border-[#45484D]'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors
                            ${isSelected 
                              ? 'bg-[#FF3856] border-[#FF3856]' 
                              : 'bg-transparent border-[#5D6166]'
                            }
                          `}>
                            {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                          </div>
                          <span className={`font-medium text-base ${isSelected ? 'text-white' : 'text-[#ABAEB3]'}`}>
                            {project.name}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 opacity-80">
                          <ClientLogo logo={project.logo} size={16} />
                          <span className="text-[#ABAEB3] text-sm">{project.company}</span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-8 pt-4 flex items-center justify-end gap-4 border-t border-[#2F3133] mt-4 bg-[#17181A]">
          <button
            onClick={onClose}
            className="px-6 py-3 text-white font-medium hover:opacity-80 transition-opacity"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="createUserForm"
            disabled={loading}
            className="bg-[#FF3856] hover:bg-[#FF3856]/90 text-white font-medium px-8 py-3 rounded-full transition-colors disabled:opacity-50 shadow-[0_4px_14px_0_rgba(255,56,86,0.39)]"
          >
            {loading ? 'Saving...' : (initialData ? 'Update User' : 'Add New User')}
          </button>
        </div>

      </div>
    </div>
  )
}
