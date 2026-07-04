'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Perfil() {
  const [usuario, setUsuario] = useState(null)
  const [tareasCompletadas, setTareasCompletadas] = useState(0)
  const [diasSobrevividos, setDiasSobrevividos] = useState(0)
  const [cargando, setCargando] = useState(true)
  const router = useRouter()

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    const { data: { user } } = await supabase.auth.getUser()
    setUsuario(user)

    if (user) {
      const { count } = await supabase
        .from('tareas')
        .select('*', { count: 'exact', head: true })
        .eq('hecha', true)

      setTareasCompletadas(count || 0)

      const fechaCreacion = new Date(user.created_at)
      const hoy = new Date()
      const dias = Math.floor((hoy - fechaCreacion) / (1000 * 60 * 60 * 24))
      setDiasSobrevividos(dias)
    }

    setCargando(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-background text-on-background flex items-center justify-center font-pixel">
        Cargando...
      </div>
    )
  }

  if (!usuario) {
    return (
      <div className="min-h-screen bg-background text-on-background flex items-center justify-center font-pixel">
        Tenes que iniciar sesion. <a href="/login" className="underline ml-2">Ir a login</a>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-on-background md:ml-64 md:pt-16 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container-high border-4 border-surface-variant shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 flex flex-col items-center">

        <div className="relative mb-8 group">
          <div className="w-32 h-32 bg-black border-4 border-secondary flex items-center justify-center relative overflow-hidden text-6xl">
            👾
            <div className="absolute inset-0 border-4 border-transparent group-hover:border-primary transition-all duration-300"></div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-secondary text-on-secondary px-2 py-1 font-pixel text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            LVL {Math.min(99, Math.floor(diasSobrevividos / 2) + 1)}
          </div>
        </div>

        <div className="text-center w-full mb-10">
          <h2 className="font-pixel text-2xl text-on-background mb-2 tracking-widest uppercase">
            {usuario.email.split('@')[0]}
          </h2>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black border-2 border-primary">
            <span className="font-pixel text-xs text-primary tracking-tighter">
              EMAIL: {usuario.email}
            </span>
            <span className="w-2 h-4 bg-primary animate-pulse"></span>
          </div>
        </div>

        <div className="w-full space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-surface-container border-2 border-surface-variant">
              <span className="block font-pixel text-xs text-on-surface-variant uppercase mb-1">Tareas OK</span>
              <span className="block font-pixel text-2xl text-secondary">{tareasCompletadas}</span>
            </div>
            <div className="p-4 bg-surface-container border-2 border-surface-variant">
              <span className="block font-pixel text-xs text-on-surface-variant uppercase mb-1">Dias Sobrevividos</span>
              <span className="block font-pixel text-2xl text-tertiary">{diasSobrevividos}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-5 bg-tertiary text-black font-pixel text-lg uppercase arcade-btn-shadow border-4 border-black active:translate-y-1.5 transition-all"
          >
            CERRAR SESION
          </button>
        </div>
      </div>

      <div className="mt-8 text-on-surface-variant font-pixel text-xs opacity-50 uppercase tracking-[0.2em] text-center">
        System Version: 0.9.4-BETA // Connection: SECURE
      </div>
    </div>
  )
}