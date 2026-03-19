'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck, UserPlus, X, Pencil, Trash2, Check, Lock,
} from 'lucide-react'
import { toast } from 'sonner'
import type { SistemaUser } from '@/lib/types'

const roleMeta: Record<string, { label: string; color: string; bg: string }> = {
  admin: { label: 'Admin', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  corretor: { label: 'Corretor', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  funcionaria: { label: 'Funcionária', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  funcionario: { label: 'Funcionário', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
}

const EMPTY_FORM = {
  nome: '', username: '', password: '', role: 'funcionario',
  email: '', telefone: '', ativo: true,
}

type UserForm = typeof EMPTY_FORM

export default function AdminPage() {
  const [users, setUsers] = useState<SistemaUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<UserForm & { newPassword?: string }>>({})

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then(data => { setUsers(data); setLoading(false) })
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const novo = await res.json()
        setUsers(prev => [...prev, novo])
        setShowModal(false)
        setForm(EMPTY_FORM)
        toast.success('Usuário criado!')
      } else {
        const err = await res.json()
        toast.error(err.error ?? 'Erro ao criar usuário')
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdate(id: string, data: Partial<UserForm & { newPassword?: string }>) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const updated = await res.json()
      setUsers(prev => prev.map(u => u.id === id ? updated : u))
      setEditingId(null)
      toast.success('Usuário atualizado!')
    }
  }

  async function handleDelete(id: string, nome: string) {
    if (!confirm(`Excluir o usuário "${nome}"? Esta ação não pode ser desfeita.`)) return
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setUsers(prev => prev.filter(u => u.id !== id))
      toast.success('Usuário excluído')
    } else {
      const err = await res.json()
      toast.error(err.error ?? 'Erro ao excluir')
    }
  }

  async function toggleAtivo(user: SistemaUser) {
    await handleUpdate(user.id, { ativo: !user.ativo })
  }

  const initials = (nome: string) => nome.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-violet-400" /> Administração
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Gerenciar usuários do sistema</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 0 20px rgba(124,58,237,0.3)' }}
        >
          <UserPlus className="w-4 h-4" /> Novo Usuário
        </motion.button>
      </motion.div>

      {/* Users */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {users.map(user => {
            const rm = roleMeta[user.role] ?? { label: user.role, color: '#64748b', bg: 'rgba(100,116,139,0.1)' }
            const isEditing = editingId === user.id

            return (
              <motion.div
                key={user.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl p-5"
                style={{
                  background: 'rgba(13,13,43,0.9)',
                  border: `1px solid ${isEditing ? 'rgba(124,58,237,0.35)' : 'rgba(59,130,246,0.12)'}`,
                  boxShadow: isEditing ? '0 0 20px rgba(124,58,237,0.15)' : '0 4px 16px rgba(0,0,0,0.2)',
                }}
              >
                {!isEditing ? (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold"
                        style={{ background: `${rm.color}18`, color: rm.color, border: `1px solid ${rm.color}30` }}
                      >
                        {initials(user.nome)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white truncate">{user.nome}</div>
                        <div className="text-xs text-slate-500">@{user.username}</div>
                      </div>
                      <button
                        onClick={() => toggleAtivo(user)}
                        className="w-8 h-5 rounded-full relative transition-all"
                        style={{ background: user.ativo ? '#10b981' : 'rgba(100,116,139,0.3)' }}
                        title={user.ativo ? 'Ativo — clique para desativar' : 'Inativo — clique para ativar'}
                      >
                        <div
                          className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                          style={{ left: user.ativo ? '14px' : '2px' }}
                        />
                      </button>
                    </div>
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ background: rm.bg, color: rm.color }}>{rm.label}</span>
                        {!user.ativo && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>Inativo</span>
                        )}
                      </div>
                      {user.email && <div className="text-xs text-slate-400 truncate">{user.email}</div>}
                      {user.telefone && <div className="text-xs text-slate-500">{user.telefone}</div>}
                    </div>
                    <div className="flex gap-2 pt-3" style={{ borderTop: '1px solid rgba(59,130,246,0.08)' }}>
                      <button
                        onClick={() => { setEditingId(user.id); setEditForm({ nome: user.nome, role: user.role, email: user.email ?? '', telefone: user.telefone ?? '' }) }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-all"
                        style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}
                      >
                        <Pencil className="w-3 h-3" /> Editar
                      </button>
                      <button
                        onClick={() => { setEditingId(user.id); setEditForm({ newPassword: '' }) }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-all"
                        style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}
                      >
                        <Lock className="w-3 h-3" /> Senha
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.nome)}
                        className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </>
                ) : (
                  /* Edit inline */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white">Editando: {user.nome}</span>
                      <button onClick={() => setEditingId(null)} className="text-slate-500 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {'newPassword' in editForm ? (
                      <>
                        <div>
                          <label className="text-xs text-slate-400 mb-1 block">Nova Senha</label>
                          <input
                            type="password"
                            value={editForm.newPassword ?? ''}
                            onChange={e => setEditForm({ newPassword: e.target.value })}
                            placeholder="Mínimo 6 caracteres"
                            className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none bg-transparent"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.25)' }}
                          />
                        </div>
                        <button
                          onClick={() => editForm.newPassword && editForm.newPassword.length >= 6
                            ? handleUpdate(user.id, { password: editForm.newPassword })
                            : toast.error('Senha deve ter ao menos 6 caracteres')}
                          className="w-full py-2 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2"
                          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                        >
                          <Lock className="w-3 h-3" /> Alterar Senha
                        </button>
                      </>
                    ) : (
                      <>
                        {[
                          { label: 'Nome', key: 'nome' as const, type: 'text' },
                          { label: 'E-mail', key: 'email' as const, type: 'email' },
                          { label: 'Telefone', key: 'telefone' as const, type: 'text' },
                        ].map(f => (
                          <div key={f.key}>
                            <label className="text-xs text-slate-400 mb-1 block">{f.label}</label>
                            <input
                              type={f.type}
                              value={String(editForm[f.key] ?? '')}
                              onChange={e => setEditForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                              className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none bg-transparent"
                              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.25)' }}
                            />
                          </div>
                        ))}
                        <div>
                          <label className="text-xs text-slate-400 mb-1 block">Papel</label>
                          <select
                            value={editForm.role ?? user.role}
                            onChange={e => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                            style={{ background: '#0d1020', border: '1px solid rgba(124,58,237,0.25)' }}
                          >
                            <option value="admin">Admin</option>
                            <option value="corretor">Corretor</option>
                            <option value="funcionario">Funcionário</option>
                            <option value="funcionaria">Funcionária</option>
                          </select>
                        </div>
                        <button
                          onClick={() => handleUpdate(user.id, editForm)}
                          className="w-full py-2 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2"
                          style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
                        >
                          <Check className="w-3 h-3" /> Salvar Alterações
                        </button>
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      {/* New User Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md rounded-2xl p-6"
              style={{ background: '#0d0d2b', border: '1px solid rgba(124,58,237,0.25)' }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-violet-400" /> Novo Usuário
                </h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Nome completo *</label>
                  <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required
                    placeholder="Ex: Ana Costa"
                    className="w-full px-3 py-2 rounded-xl text-sm text-white bg-transparent outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.2)' }} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Usuário (login) *</label>
                    <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required
                      placeholder="Ex: ana"
                      className="w-full px-3 py-2 rounded-xl text-sm text-white bg-transparent outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.2)' }} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Senha *</label>
                    <input value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required
                      type="password" placeholder="Mínimo 6 chars"
                      className="w-full px-3 py-2 rounded-xl text-sm text-white bg-transparent outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.2)' }} />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Papel *</label>
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required
                    className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                    style={{ background: '#0d1020', border: '1px solid rgba(124,58,237,0.2)' }}>
                    <option value="corretor">Corretor</option>
                    <option value="funcionario">Funcionário</option>
                    <option value="funcionaria">Funcionária</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">E-mail</label>
                    <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      type="email" placeholder="email@..."
                      className="w-full px-3 py-2 rounded-xl text-sm text-white bg-transparent outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.2)' }} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Telefone</label>
                    <input value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })}
                      placeholder="(19) 99999-9999"
                      className="w-full px-3 py-2 rounded-xl text-sm text-white bg-transparent outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.2)' }} />
                  </div>
                </div>
                <motion.button
                  type="submit" disabled={saving}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  {saving ? 'Criando...' : 'Criar Usuário'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
