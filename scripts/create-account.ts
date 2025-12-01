import { createClient } from '@supabase/supabase-js'
import * as readline from 'readline'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nqjttfbxxytbjnyaecvi.supabase.co'
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xanR0ZmJ4eHl0YmpueWFlY3ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NjcyNTYsImV4cCI6MjA3OTE0MzI1Nn0.zF-ZnRh3oMcijyttvltw7L4Y_7z4nfH3-gTkVc7cC-k'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve))
}

async function createAccount() {
  try {
    console.log('\n=== Criação de Conta ===\n')
    
    const email = await question('Email: ')
    const password = await question('Senha: ')
    const fullName = await question('Nome completo: ')
    const phone = await question('Telefone (opcional): ') || ''
    const role = await question('Role (admin/client) [admin]: ') || 'admin'

    console.log('\nCriando conta...')

    // 1. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone
        }
      }
    })

    if (authError) {
      throw authError
    }

    if (!authData.user) {
      throw new Error('Falha ao criar usuário')
    }

    console.log('✓ Usuário criado no Auth:', authData.user.id)

    // 2. Criar perfil na tabela profiles
    // Nota: O AuthContext busca de 'profiles' mas com campos diferentes
    // Vamos criar um perfil que corresponda ao que o AuthContext espera
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        full_name: fullName,
        email: email,
        phone: phone || null,
      })

    if (profileError) {
      console.warn('⚠ Aviso ao criar perfil:', profileError.message)
      // Não falha se o perfil já existir ou se a tabela tiver estrutura diferente
    } else {
      console.log('✓ Perfil criado na tabela profiles')
    }

    // 3. Tentar criar na tabela clients também (se necessário)
    // O CreateUserModal cria em 'clients', então vamos verificar se precisa
    try {
      const { error: clientError } = await supabase
        .from('clients')
        .insert({
          id: authData.user.id,
          name: fullName,
          email: email,
          phone: phone || null,
          app_role: role === 'admin' ? 'Admin' : 'Viewer'
        })

      if (clientError) {
        console.warn('⚠ Aviso ao criar cliente:', clientError.message)
      } else {
        console.log('✓ Cliente criado na tabela clients')
      }
    } catch (err) {
      console.warn('⚠ Não foi possível criar na tabela clients:', err)
    }

    console.log('\n✅ Conta criada com sucesso!')
    console.log(`\nEmail: ${email}`)
    console.log(`ID do usuário: ${authData.user.id}`)
    console.log(`\nVocê pode fazer login agora na aplicação.`)
    
    if (authData.session) {
      console.log('\n✓ Sessão criada automaticamente!')
    } else {
      console.log('\n⚠ Verifique seu email para confirmar a conta (se necessário).')
    }

  } catch (error: any) {
    console.error('\n❌ Erro ao criar conta:', error.message)
    process.exit(1)
  } finally {
    rl.close()
  }
}

createAccount()

