'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function Registro() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')

  async function handleRegistro(e) {
    e.preventDefault()
    setMensaje('')

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) {
      setMensaje('Error: ' + error.message)
    } else {
      setMensaje('Cuenta creada! Revisa tu email para confirmar.')
    }
  }

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-surface-container border-4 border-on-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12 relative overflow-hidden">

        <div className="absolute top-0 left-0 w-full h-2 bg-secondary"></div>

        <div className="mb-10 text-center">
          <h1 className="font-pixel text-3xl text-primary mb-2 uppercase tracking-tighter flicker-text">
            NUEVA PARTIDA
          </h1>
          <p className="font-pixel text-xs text-on-surface-variant opacity-70">
            CREA TU PERFIL PARA EMPEZAR
          </p>
        </div>

        <form onSubmit={handleRegistro} className="space-y-8">
          <div className="space-y-2">
            <label className="font-pixel text-xs text-secondary uppercase">
              Email de usuario
            </label>
            <input
              type="email"
              placeholder="PLAYER@CONSOLE.EXE"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border-2 border-secondary p-4 text-secondary font-pixel text-sm focus:outline-none focus:ring-0 focus:border-tertiary transition-colors placeholder:opacity-30"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="font-pixel text-xs text-secondary uppercase">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border-2 border-secondary p-4 text-secondary font-pixel text-sm focus:outline-none focus:ring-0 focus:border-tertiary transition-colors placeholder:opacity-30"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-secondary text-black py-4 px-6 font-pixel text-lg uppercase border-2 border-black arcade-btn-shadow transition-all"
          >
            REGISTRARME
          </button>

          {mensaje ? (
            <p className="text-center font-pixel text-xs text-tertiary">{mensaje}</p>
          ) : null}
        </form>

        <div className="mt-12 text-center">
          <Link
            href="/login"
            className="block font-pixel text-xs text-tertiary hover:text-primary transition-colors underline decoration-2 underline-offset-4 uppercase"
          >
            Ya tengo cuenta: volver al login
          </Link>
        </div>

        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-secondary opacity-50"></div>
        <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-secondary opacity-50"></div>
      </div>
    </div>
  )
}