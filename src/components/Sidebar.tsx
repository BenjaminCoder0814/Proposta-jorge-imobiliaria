'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Building2,
  Key,
  Users,
  Calendar,
  TrendingUp,
  LogOut,
  ShoppingBag,
  UserPlus,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: '#3b82f6' },
  { href: '/imoveis', label: 'Imóveis', icon: Building2, color: '#06b6d4' },
  { href: '/alugueis', label: 'Aluguéis', icon: Key, color: '#8b5cf6' },
  { href: '/vendas', label: 'Vendas', icon: ShoppingBag, color: '#3b82f6' },
  { href: '/leads', label: 'Leads / CRM', icon: UserPlus, color: '#f97316' },
  { href: '/clientes', label: 'Clientes', icon: Users, color: '#10b981' },
  { href: '/agenda', label: 'Agenda', icon: Calendar, color: '#f59e0b' },
  { href: '/financeiro', label: 'Financeiro', icon: TrendingUp, color: '#ec4899' },
  { href: '/admin', label: 'Administração', icon: ShieldCheck, color: '#64748b' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    toast.success('Até logo, Jorge!')
    router.push('/login')
    router.refresh()
  }

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-60 flex flex-col z-50"
      style={{
        background: 'rgba(2, 2, 15, 0.97)',
        borderRight: '1px solid rgba(59, 130, 246, 0.1)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo / Brand */}
      <div
        className="p-4 flex items-center gap-3"
        style={{ borderBottom: '1px solid rgba(59, 130, 246, 0.08)' }}
      >
        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
          style={{ background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(59,130,246,0.2)' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold text-white leading-tight truncate">ERP Imobiliário</div>
          <div className="text-[10px] text-slate-500">Sistema de Gestão</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all"
                style={{
                  background: isActive ? `${item.color}14` : 'transparent',
                  border: isActive ? `1px solid ${item.color}28` : '1px solid transparent',
                  color: isActive ? item.color : '#64748b',
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-r-full"
                    style={{ background: item.color }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon
                  className="w-4.5 h-4.5 shrink-0"
                  style={{ color: isActive ? item.color : '#475569' }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: isActive ? item.color : '#94a3b8' }}
                >
                  {item.label}
                </span>
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="ml-auto w-2 h-2 rounded-full shrink-0"
                      style={{
                        background: item.color,
                        boxShadow: `0 0 8px ${item.color}`,
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* User & Logout */}
      <div
        className="p-3"
        style={{ borderTop: '1px solid rgba(59, 130, 246, 0.08)' }}
      >
        <div className="flex items-center gap-2.5 px-3 py-2 mb-2">
          <div
            className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center shrink-0"
            style={{ background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white leading-tight">Administrador</div>
            <div className="text-[11px] text-slate-500 truncate">Admin</div>
          </div>
        </div>

        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{
            background: 'rgba(239, 68, 68, 0.07)',
            border: '1px solid rgba(239, 68, 68, 0.15)',
            color: '#f87171',
          }}
        >
          <LogOut className="w-4 h-4" />
          Sair do Sistema
        </motion.button>
      </div>
    </aside>
  )
}
