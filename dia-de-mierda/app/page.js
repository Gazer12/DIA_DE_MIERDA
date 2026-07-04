'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  const [usuario, setUsuario] = useState(null)
  const [tareas, setTareas] = useState([])
  const [cargando, setCargando] = useState(true)
  const router = useRouter()

  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState('')
  const [fechaVencimiento, setFechaVencimiento] = useState('')

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    const { data: { user } } = await supabase.auth.getUser()
    setUsuario(user)

    if (user) {
      await cargarTareas()
    }

    setCargando(false)
  }

  async function cargarTareas() {
    const { data, error } = await supabase
      .from('tareas')
      .select('*')
      .order('fecha_vencimiento', { ascending: true })

    if (error) {
      console.error('Error trayendo tareas:', error)
    } else {
      setTareas(data)
    }
  }

  async function handleCrearTarea(e) {
    e.preventDefault()

    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('tareas')
      .insert({
        nombre: nombre,
        tipo: tipo,
        fecha_vencimiento: fechaVencimiento,
        user_id: user.id,
      })

    if (error) {
      console.error('Error creando tarea:', error)
    } else {
      setNombre('')
      setTipo('')
      setFechaVencimiento('')
      await cargarTareas()
    }
  }

  async function handleMarcarHecha(tarea) {
    const { error } = await supabase
      .from('tareas')
      .update({ hecha: !tarea.hecha })
      .eq('id', tarea.id)

    if (error) {
      console.error('Error actualizando tarea:', error)
    } else {
      await cargarTareas()
    }
  }

  async function handleEliminarTarea(id) {
    const { error } = await supabase
      .from('tareas')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error eliminando tarea:', error)
    } else {
      await cargarTareas()
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUsuario(null)
    setTareas([])
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
      <div className="min-h-screen bg-background text-on-background flex flex-col items-center justify-center gap-4">
        <h1 className="font-pixel text-2xl">Bienvenido a Dia de Mierda</h1>
        <div className="flex gap-3">
          <a href="/login" className="font-pixel text-sm bg-secondary text-black px-4 py-2 border-2 border-black">Iniciar sesion</a>
          <a href="/registro" className="font-pixel text-sm border-2 border-on-background px-4 py-2">Crear cuenta</a>
        </div>
      </div>
    )
  }

  const pendientes = tareas.filter((t) => !t.hecha).length
  const completadas = tareas.filter((t) => t.hecha).length

  return (
    <div className="min-h-screen bg-background text-on-background">
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8 md:ml-64 md:pt-24">

        <section className="relative p-6 bg-surface-container-high border-4 border-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="font-pixel text-2xl text-primary uppercase mb-2">Tareas pendientes</h2>
          <p className="text-sm text-on-surface-variant">
            Completa tus tareas diarias para ganar experiencia. No dejes que el backlog te destruya.
          </p>
        </section>

        <section className="bg-surface-container-low border-4 border-surface-variant p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="font-pixel text-lg text-secondary mb-6">+ AÑADIR TAREA</h3>
          <form onSubmit={handleCrearTarea} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block font-pixel text-xs text-outline mb-2 uppercase">Nombre de la tarea</label>
              <input
                type="text"
                placeholder="Ej: Comprar cafe..."
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-black border-2 border-secondary text-on-surface px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/50"
                required
              />
            </div>
            <div>
              <label className="block font-pixel text-xs text-outline mb-2 uppercase">Tipo</label>
              <input
                type="text"
                placeholder="Facultad, hogar..."
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full bg-black border-2 border-secondary text-on-surface px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/50"
              />
            </div>
            <div className="flex flex-col">
              <label className="block font-pixel text-xs text-outline mb-2 uppercase">Fecha</label>
              <input
                type="date"
                value={fechaVencimiento}
                onChange={(e) => setFechaVencimiento(e.target.value)}
                className="w-full bg-black border-2 border-secondary text-on-surface px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/50"
                required
              />
            </div>
            <button
              type="submit"
              className="md:col-span-4 h-[52px] bg-primary text-black font-pixel uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
            >
              Agregar tarea
            </button>
          </form>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-pixel text-lg text-tertiary">MISIONES EN CURSO</h3>
            <span className="font-pixel text-xs bg-surface-container-highest px-3 py-1">
              {pendientes} PENDIENTES
            </span>
          </div>

          {tareas.length === 0 && (
            <div className="border-2 border-dashed border-outline-variant p-6 text-center font-pixel text-xs uppercase opacity-50">
              No hay tareas todavia
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {tareas.map((tarea) => (
              <div
                key={tarea.id}
                className={`flex items-center gap-4 bg-surface-container border-2 border-on-background p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                  tarea.hecha ? 'opacity-60' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={tarea.hecha}
                  onChange={() => handleMarcarHecha(tarea)}
                  className="w-8 h-8 bg-black border-2 border-secondary checked:bg-secondary flex-shrink-0 cursor-pointer"
                />
                <div className="flex-grow">
                  <div className={`font-pixel text-base leading-none mb-2 ${tarea.hecha ? 'line-through' : ''}`}>
                    {tarea.nombre}
                  </div>
                  <div className="flex gap-3 items-center flex-wrap">
                    {tarea.tipo && (
                      <span className="font-pixel text-xs bg-secondary text-black px-2 py-0.5 uppercase">
                        {tarea.tipo}
                      </span>
                    )}
                    <span className="font-pixel text-xs text-outline uppercase">
                      {tarea.hecha ? 'Completado' : `Vence ${tarea.fecha_vencimiento}`}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleEliminarTarea(tarea.id)}
                  className="text-on-surface-variant hover:text-error px-2 py-1 font-pixel text-xs"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container p-4 border-2 border-surface-variant shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-tertiary font-pixel text-xs uppercase">Completadas</div>
            <div className="font-pixel text-2xl mt-1">{completadas}</div>
          </div>
          <div className="bg-surface-container p-4 border-2 border-surface-variant shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-error font-pixel text-xs uppercase">Pendientes</div>
            <div className="font-pixel text-2xl mt-1">{pendientes}</div>
          </div>
        </section>

        <button
          onClick={handleLogout}
          className="font-pixel text-xs text-on-surface-variant hover:text-error underline"
        >
          Cerrar sesion
        </button>

      </main>
    </div>
  )
}