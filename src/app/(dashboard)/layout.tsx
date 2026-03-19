import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid-bg" style={{ background: '#030311' }}>
      <Sidebar />
      {/* BETA badge */}
      <div className="fixed top-3 right-4 z-50 pointer-events-none">
        <span
          className="px-3 py-1 text-[11px] font-bold tracking-widest rounded-full uppercase"
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            color: '#fff',
            boxShadow: '0 0 16px rgba(245,158,11,0.6)',
            letterSpacing: '0.15em',
          }}
        >
          BETA
        </span>
      </div>
      <div className="ml-60 min-h-screen">
        <main className="p-6 max-w-350">{children}</main>
      </div>
    </div>
  )
}
