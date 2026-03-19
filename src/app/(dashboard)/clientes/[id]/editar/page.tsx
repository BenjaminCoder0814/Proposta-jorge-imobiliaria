'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Phone, Mail, CreditCard, Tag, FileText, Save } from 'lucide-react'
import { toast } from 'sonner'

export default function EditarClientePage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    nome: '', email: '', telefone: '', cpf: '', tipo: 'comprador', interesse: '', observacoes: '',
  })

  useEffect(() => {
    fetch(`/api/clientes/${id}`).then(r => r.json()).then(data => { setForm(data); setLoading(false) })
  }, [id])

  function set(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nome.trim()) { toast.error('Nome é obrigatório'); return }
    setSaving(true)
    const res = await fetch(`/api/clientes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    if (res.ok) {
      toast.success('Cliente atualizado!')
      router.push('/clientes')
    } else {
      toast.error('Erro ao salvar')
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <Link href="/clientes">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(59,130,246,0.15)' }}>
            <ArrowLeft className="w-4 h-4 text-slate-400" />
          </button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><User className="w-5 h-5 text-emerald-400" /> Editar Cliente</h1>
          <p className="text-slate-500 text-sm mt-0.5">{form.nome}</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl p-5 space-y-4"
          style={{ background: 'rgba(13,13,43,0.85)', border: '1px solid rgba(59,130,246,0.12)' }}>
          <h2 className="text-sm font-semibold text-white flex items-center gap-2"><User className="w-4 h-4 text-emerald-400" /> Dados Pessoais</h2>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Nome completo *</label>
            <input required value={form.nome} onChange={e => set('nome', e.target.value)} className="w-full bg-transparent text-sm text-white placeholder-slate-600 outline-none px-3 py-2.5 rounded-xl" style={{ border: '1px solid rgba(59,130,246,0.2)' }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">CPF</label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
                <CreditCard className="w-4 h-4 text-slate-600" />
                <input value={form.cpf} onChange={e => set('cpf', e.target.value)} className="bg-transparent text-sm text-white outline-none w-full" />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Tipo</label>
              <select value={form.tipo} onChange={e => set('tipo', e.target.value)} className="w-full bg-[#0d0d2b] text-sm text-white outline-none px-3 py-2.5 rounded-xl cursor-pointer" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
                <option value="comprador">Comprador</option>
                <option value="vendedor">Vendedor</option>
                <option value="locatario">Locatário</option>
                <option value="proprietario">Proprietário</option>
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl p-5 space-y-4"
          style={{ background: 'rgba(13,13,43,0.85)', border: '1px solid rgba(59,130,246,0.12)' }}>
          <h2 className="text-sm font-semibold text-white flex items-center gap-2"><Phone className="w-4 h-4 text-blue-400" /> Contato</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Telefone</label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
                <Phone className="w-4 h-4 text-slate-600" />
                <input value={form.telefone} onChange={e => set('telefone', e.target.value)} className="bg-transparent text-sm text-white outline-none w-full" />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Email</label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
                <Mail className="w-4 h-4 text-slate-600" />
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="bg-transparent text-sm text-white outline-none w-full" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl p-5 space-y-4"
          style={{ background: 'rgba(13,13,43,0.85)', border: '1px solid rgba(59,130,246,0.12)' }}>
          <h2 className="text-sm font-semibold text-white flex items-center gap-2"><Tag className="w-4 h-4 text-purple-400" /> Interesse &amp; Observações</h2>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Interesse / Objetivo</label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
              <Tag className="w-4 h-4 text-slate-600" />
              <input value={form.interesse} onChange={e => set('interesse', e.target.value)} className="bg-transparent text-sm text-white outline-none w-full" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Observações</label>
            <div className="flex gap-2 px-3 py-2.5 rounded-xl" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
              <FileText className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
              <textarea value={form.observacoes} onChange={e => set('observacoes', e.target.value)} rows={3} className="bg-transparent text-sm text-white outline-none w-full resize-none" />
            </div>
          </div>
        </motion.div>

        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          type="submit" disabled={saving} whileHover={{ scale: saving ? 1 : 1.02 }} whileTap={{ scale: saving ? 1 : 0.98 }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 0 25px rgba(16,185,129,0.35)' }}>
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </motion.button>
      </form>
    </div>
  )
}
