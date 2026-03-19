'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Building2, MapPin, Home, Upload, X, Plus, Star } from 'lucide-react'
import { toast } from 'sonner'
import type { Imovel } from '@/lib/types'

export default function EditarImovelPage() {
  const params = useParams()
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [fotos, setFotos] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [form, setForm] = useState({
    titulo: '', tipo: 'casa', status: 'disponivel', finalidade: 'venda',
    endereco: '', bairro: '', cidade: 'Engenheiro Coelho', cep: '',
    area: '', quartos: '', banheiros: '', garagem: '', valor: '', descricao: '', destaque: false,
  })

  useEffect(() => {
    fetch(`/api/imoveis/${params.id}`)
      .then((r) => r.json())
      .then((data: Imovel) => {
        setForm({
          titulo: data.titulo, tipo: data.tipo, status: data.status, finalidade: data.finalidade,
          endereco: data.endereco, bairro: data.bairro, cidade: data.cidade, cep: data.cep,
          area: String(data.area), quartos: String(data.quartos), banheiros: String(data.banheiros),
          garagem: String(data.garagem), valor: String(data.valor), descricao: data.descricao, destaque: data.destaque,
        })
        setFotos(data.fotos)
        setTags(data.tags)
        setLoadingData(false)
      })
  }, [params.id])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }))
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (res.ok) { const { url } = await res.json(); setFotos((prev) => [...prev, url]) }
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/imoveis/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, fotos, tags }),
      })
      if (res.ok) { toast.success('Imóvel atualizado!'); router.push(`/imoveis/${params.id}`) }
      else toast.error('Erro ao atualizar')
    } finally { setLoading(false) }
  }

  const fieldClass = `w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none`
  const fieldStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.2)' }

  if (loadingData) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <Link href={`/imoveis/${params.id}`}>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <ArrowLeft className="w-4 h-4 text-blue-400" />
          </button>
        </Link>
        <h1 className="text-xl font-bold text-white">Editar Imóvel</h1>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Card title="Informações Básicas" icon={Building2}>
          <div className="grid gap-4">
            <input name="titulo" value={form.titulo} onChange={handleChange} placeholder="Título" className={fieldClass} style={fieldStyle} required />
            <div className="grid grid-cols-2 gap-4">
              <select name="tipo" value={form.tipo} onChange={handleChange} className={fieldClass} style={fieldStyle}>
                {['casa','apartamento','terreno','comercial','sala'].map(v => <option key={v} value={v} className="bg-[#0d0d2b]">{v.charAt(0).toUpperCase()+v.slice(1)}</option>)}
              </select>
              <select name="finalidade" value={form.finalidade} onChange={handleChange} className={fieldClass} style={fieldStyle}>
                <option value="venda" className="bg-[#0d0d2b]">Venda</option>
                <option value="aluguel" className="bg-[#0d0d2b]">Aluguel</option>
                <option value="ambos" className="bg-[#0d0d2b]">Venda e Aluguel</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <select name="status" value={form.status} onChange={handleChange} className={fieldClass} style={fieldStyle}>
                {['disponivel','reservado','vendido','alugado'].map(v => <option key={v} value={v} className="bg-[#0d0d2b]">{v.charAt(0).toUpperCase()+v.slice(1)}</option>)}
              </select>
              <input name="valor" type="number" value={form.valor} onChange={handleChange} placeholder="Valor" className={fieldClass} style={fieldStyle} />
            </div>
          </div>
        </Card>

        <Card title="Endereço" icon={MapPin}>
          <div className="grid gap-4">
            <input name="endereco" value={form.endereco} onChange={handleChange} placeholder="Rua, número" className={fieldClass} style={fieldStyle} />
            <div className="grid grid-cols-3 gap-4">
              <input name="bairro" value={form.bairro} onChange={handleChange} placeholder="Bairro" className={fieldClass} style={fieldStyle} />
              <input name="cidade" value={form.cidade} onChange={handleChange} placeholder="Cidade" className={fieldClass} style={fieldStyle} />
              <input name="cep" value={form.cep} onChange={handleChange} placeholder="CEP" className={fieldClass} style={fieldStyle} />
            </div>
          </div>
        </Card>

        <Card title="Características" icon={Home}>
          <div className="grid grid-cols-4 gap-4">
            {[['area','Área (m²)'],['quartos','Quartos'],['banheiros','Banheiros'],['garagem','Garagem']].map(([n,l]) => (
              <div key={n}>
                <label className="text-xs text-slate-400 block mb-1">{l}</label>
                <input name={n} type="number" value={(form as Record<string,unknown>)[n] as string} onChange={handleChange} className={fieldClass} style={fieldStyle} />
              </div>
            ))}
          </div>
          <textarea name="descricao" value={form.descricao} onChange={handleChange} placeholder="Descrição" rows={3} className={`${fieldClass} resize-none mt-4`} style={fieldStyle} />
          <div className="mt-4">
            <div className="flex gap-2 flex-wrap mb-2">
              {tags.map((t) => (
                <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs" style={{ background: 'rgba(59,130,246,0.12)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.2)' }}>
                  {t} <button type="button" onClick={() => setTags(p => p.filter(x => x !== t))}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if(e.key==='Enter'){e.preventDefault();if(tagInput.trim()&&!tags.includes(tagInput.trim())){setTags(p=>[...p,tagInput.trim()]);setTagInput('')}}}} placeholder="Adicionar tag..." className={`${fieldClass} flex-1`} style={fieldStyle} />
              <button type="button" onClick={() => { if(tagInput.trim()&&!tags.includes(tagInput.trim())){setTags(p=>[...p,tagInput.trim()]);setTagInput('')} }} className="px-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <label className="flex items-center gap-2 mt-4 cursor-pointer">
            <input type="checkbox" name="destaque" checked={form.destaque} onChange={handleChange} className="w-4 h-4 accent-blue-500" />
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-slate-300">Marcar como destaque</span>
          </label>
        </Card>

        <Card title="Fotos" icon={Upload}>
          <div className="border-2 border-dashed rounded-xl p-5 text-center cursor-pointer" style={{ borderColor: 'rgba(59,130,246,0.25)', background: 'rgba(59,130,246,0.03)' }} onClick={() => fileRef.current?.click()}>
            <Upload className="w-7 h-7 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Adicionar fotos</p>
            {uploading && <p className="text-xs text-blue-400 mt-1 animate-pulse">Enviando...</p>}
          </div>
          <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
          {fotos.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {fotos.map((url, i) => (
                <div key={url} className="relative group rounded-xl overflow-hidden h-20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  {i === 0 && <div className="absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.8)', color: '#fff' }}>Capa</div>}
                  <button type="button" onClick={() => setFotos(p => p.filter(f => f !== url))} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="flex gap-3 pt-2">
          <Link href={`/imoveis/${params.id}`} className="flex-1">
            <button type="button" className="w-full py-3 rounded-xl text-sm font-medium text-slate-300" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>Cancelar</button>
          </Link>
          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #0891b2, #1d4ed8)' }}>
            {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Salvando...</span> : 'Salvar Alterações'}
          </motion.button>
        </div>
      </form>
    </div>
  )
}

function Card({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(59,130,246,0.12)' }}>
      <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
        <Icon className="w-4 h-4 text-blue-400" />
        <h2 className="text-sm font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  )
}
