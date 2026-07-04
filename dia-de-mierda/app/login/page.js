'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    setMensaje('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      setMensaje('Error: ' + error.message)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-background text-on-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <main className="bg-surface-container border-4 border-on-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12">

          <header className="text-center mb-10">
            <h1 className="font-pixel text-4xl text-tertiary uppercase tracking-tighter mb-2 flicker-text">
              DIA DE MIERDA
            </h1>
            <p className="font-pixel text-sm text-secondary uppercase tracking-widest">
              LOGUEATE PARA COMENZAR
            </p>
          </header>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label className="block font-pixel text-xs text-on-surface-variant uppercase mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="PLAYER@EXAMPLE.COM"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black text-secondary border-2 border-outline-variant focus:border-secondary focus:ring-0 focus:outline-none px-4 py-3 font-pixel text-sm pixel-border-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-pixel text-xs text-on-surface-variant uppercase mb-2">
                  Contrasena
                </label>
                <input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black text-secondary border-2 border-outline-variant focus:border-secondary focus:ring-0 focus:outline-none px-4 py-3 font-pixel text-sm pixel-border-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#facc15] hover:bg-[#eab308] text-black font-pixel text-xl uppercase py-4 transition-all arcade-btn-shadow border-4 border-black active:translate-y-1.5"
            >
              ENTRAR
            </button>

            {mensaje ? (
              <p className="text-center font-pixel text-sm text-error">{mensaje}</p>
            ) : null}
          </form>

          <footer className="mt-10 text-center">
            <Link
              href="/registro"
              className="block font-pixel text-xs text-secondary hover:text-tertiary transition-colors uppercase"
            >
              No tenes cuenta? REGISTRATE AQUI
            </Link>
          </footer>
        </main>
      </div>
    </div>
  )
}