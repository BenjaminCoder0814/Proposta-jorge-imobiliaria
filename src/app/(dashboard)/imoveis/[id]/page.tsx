'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft, Building2, Bed, Bath, Car, Home, MapPin, Calendar, Tag,
  Pencil, Trash2, ChevronLeft, ChevronRight, X, Star, Phone, Mail, User, FileText, FileDown,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Imovel, Documento } from '@/lib/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  disponivel: { label: 'Disponível', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' },
  reservado: { label: 'Reservado', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
  vendido: { label: 'Vendido', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)' },
  alugado: { label: 'Alugado', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.3)' },
}

export default function ImovelDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [imovel, setImovel] = useState<Imovel | null>(null)
  const [loading, setLoading] = useState(true)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [documentos, setDocumentos] = useState<Documento[]>([])

  useEffect(() => {
    fetch(`/api/imoveis/${params.id}`)
      .then((r) => r.json())
      .then((data) => { setImovel(data); setLoading(false) })
      .catch(() => { toast.error('Imóvel não encontrado'); setLoading(false) })
    fetch(`/api/documentos?imovelId=${params.id}`)
      .then((r) => r.json())
      .then(setDocumentos)
      .catch(() => {})
  }, [params.id])

  async function handleDelete() {
    if (!confirm('Excluir este imóvel permanentemente?')) return
    const res = await fetch(`/api/imoveis/${params.id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Imóvel excluído')
      router.push('/imoveis')
    } else {
      toast.error('Erro ao excluir')
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
    </div>
  )

  if (!imovel) return (
    <div className="text-center py-20 text-slate-500">
      Imóvel não encontrado.{' '}
      <Link href="/imoveis" className="text-blue-400 hover:underline">Voltar</Link>
    </div>
  )

  const status = statusConfig[imovel.status]

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/imoveis">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <ArrowLeft className="w-4 h-4 text-blue-400" />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">{imovel.titulo}</h1>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
              <MapPin className="w-3 h-3" />
              {imovel.endereco}{imovel.bairro ? `, ${imovel.bairro}` : ''} — {imovel.cidade}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/imoveis/${imovel.id}/editar`}>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-amber-400 transition-all" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <Pencil className="w-4 h-4" /> Editar
            </button>
          </Link>
          <button onClick={handleDelete} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-red-400 transition-all" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <Trash2 className="w-4 h-4" /> Excluir
          </button>
        </div>
      </motion.div>

      {/* Gallery */}
      {imovel.fotos.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="rounded-2xl overflow-hidden relative h-72 cursor-pointer" onClick={() => setLightbox(true)}
          style={{ background: '#0a0a20', border: '1px solid rgba(59,130,246,0.12)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imovel.fotos[photoIndex]} alt={imovel.titulo} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)' }} />
          {imovel.fotos.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setPhotoIndex((i) => (i > 0 ? i - 1 : imovel.fotos.length - 1)) }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); setPhotoIndex((i) => (i < imovel.fotos.length - 1 ? i + 1 : 0)) }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {imovel.fotos.map((_, i) => (
                  <button key={i} onClick={(e) => { e.stopPropagation(); setPhotoIndex(i) }}
                    className="w-1.5 h-1.5 rounded-full transition-all"
                    style={{ background: i === photoIndex ? '#3b82f6' : 'rgba(255,255,255,0.4)' }} />
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Thumbnail strip */}
      {imovel.fotos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {imovel.fotos.map((foto, i) => (
            <button key={foto} onClick={() => setPhotoIndex(i)} className="shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all"
              style={{ border: i === photoIndex ? '2px solid #3b82f6' : '2px solid transparent', opacity: i === photoIndex ? 1 : 0.5 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={foto} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Details grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="md:col-span-2 rounded-2xl p-5 space-y-4"
          style={{ background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(59,130,246,0.12)' }}>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1.5 rounded-full text-sm font-semibold" style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}>
              {status.label}
            </span>
            {imovel.destaque && (
              <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-sm font-semibold" style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)' }}>
                <Star className="w-3.5 h-3.5 fill-current" /> Destaque
              </span>
            )}
          </div>

          <div className="text-3xl font-bold text-white">
            R$ {imovel.valor.toLocaleString('pt-BR')}
            <span className="text-sm text-slate-500 font-normal ml-2">
              {imovel.finalidade === 'aluguel' ? '/mês' : ''}
            </span>
          </div>

          {imovel.descricao && (
            <p className="text-sm text-slate-400 leading-relaxed">{imovel.descricao}</p>
          )}

          {imovel.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {imovel.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs" style={{ background: 'rgba(59,130,246,0.08)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.15)' }}>
                  <Tag className="w-3 h-3" /> {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Specs */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl p-5 space-y-3"
          style={{ background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(59,130,246,0.12)' }}>
          <h3 className="text-sm font-semibold text-white mb-4">Especificações</h3>
          {[
            { icon: Home, label: 'Tipo', value: imovel.tipo },
            { icon: Building2, label: 'Área', value: `${imovel.area} m²` },
            { icon: Bed, label: 'Quartos', value: imovel.quartos },
            { icon: Bath, label: 'Banheiros', value: imovel.banheiros },
            { icon: Car, label: 'Garagem', value: imovel.garagem },
            { icon: Calendar, label: 'Cadastrado', value: format(new Date(imovel.createdAt), 'dd/MM/yyyy', { locale: ptBR }) },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(59,130,246,0.08)' }}>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Icon className="w-3.5 h-3.5" /> {label}
              </div>
              <span className="text-xs font-medium text-slate-300 capitalize">{value}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.95)' }}
            onClick={() => setLightbox(false)}>
            <button className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <X className="w-5 h-5 text-white" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imovel.fotos[photoIndex]} alt={imovel.titulo} className="max-w-full max-h-[85vh] rounded-xl object-contain" onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proprietário + Documentos row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Proprietário */}
        {(imovel.proprietarioNome || imovel.proprietarioTelefone) && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl p-5"
            style={{ background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(59,130,246,0.12)' }}
          >
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" /> Proprietário
            </h3>
            <div className="space-y-3">
              {imovel.proprietarioNome && (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
                    <User className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Nome</div>
                    <div className="text-sm font-medium text-white">{imovel.proprietarioNome}</div>
                  </div>
                </div>
              )}
              {imovel.proprietarioTelefone && (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <Phone className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Telefone</div>
                    <a href={`tel:${imovel.proprietarioTelefone}`} className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                      {imovel.proprietarioTelefone}
                    </a>
                  </div>
                </div>
              )}
              {imovel.proprietarioEmail && (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <Mail className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">E-mail</div>
                    <a href={`mailto:${imovel.proprietarioEmail}`} className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors truncate block max-w-[200px]">
                      {imovel.proprietarioEmail}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Documentos */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="rounded-2xl p-5"
          style={{ background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(59,130,246,0.12)' }}
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" /> Documentos ({documentos.length})
          </h3>
          {documentos.length === 0 ? (
            <p className="text-xs text-slate-500">Nenhum documento cadastrado.</p>
          ) : (
            <div className="space-y-2">
              {documentos.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between py-2 px-3 rounded-xl"
                  style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)' }}>
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-white truncate">{doc.nome}</div>
                      <div className="text-[10px] text-slate-500">{doc.tipo.replace('_', ' ')} {doc.tamanho ? `• ${doc.tamanho}` : ''}</div>
                    </div>
                  </div>
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all hover:bg-blue-500/10"
                    style={{ color: '#3b82f6' }}>
                    <FileDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
