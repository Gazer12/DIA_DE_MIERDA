'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const ocultarEn = ['/login', '/registro']
  if (ocultarEn.includes(pathname)) {
    return null
  }

  const links = [
  { href: '/', label: 'Tareas' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/gastos', label: 'Gastos' },
  { href: '/perfil', label: 'Perfil' },
]

  return (
    <>
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-surface-container border-r-4 border-surface-variant p-4 gap-4 z-50 shadow-[8px_0px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="font-pixel text-xl text-tertiary tracking-tighter italic mb-4">
          MENU PRINCIPAL
        </h1>
        <nav className="flex flex-col gap-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-pixel text-sm p-3 transition-transform ${
                pathname === link.href
                  ? 'bg-secondary text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5'
                  : 'text-on-background hover:translate-x-1'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Top bar - Desktop */}
      <header className="hidden md:flex fixed top-0 left-64 right-0 h-16 bg-background z-40 border-b-4 border-surface-variant shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] items-center px-4">
        <span className="font-pixel text-lg font-bold text-secondary tracking-tighter">
          DIA DE MIERDA
        </span>
      </header>

      {/* Bottom nav - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-surface-container border-t-4 border-surface-variant">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`font-pixel text-xs uppercase px-3 py-2 ${
              pathname === link.href
                ? 'bg-secondary text-black border-2 border-black'
                : 'text-on-surface-variant'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  )
}