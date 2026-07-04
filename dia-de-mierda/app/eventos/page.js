'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Eventos() {
  const [usuario, setUsuario] = useState(null)
  const [eventos, setEventos] = useState([])
  const [cargando, setCargando] = useState(true)

  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fecha, setFecha] = useState('')

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    const { data: { user } } = await supabase.auth.getUser()
    setUsuario(user)

    if (user) {
      await cargarEventos()
    }

    setCargando(false)
  }

  async function cargarEventos() {
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .order('fecha', { ascending: true })

    if (error) {
      console.error('Error trayendo eventos:', error)
    } else {
      setEventos(data)
    }
  }

  async function handleCrearEvento(e) {
    e.preventDefault()

    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('eventos')
      .insert({
        titulo: titulo,
        descripcion: descripcion,
        fecha: fecha,
        user_id: user.id,
      })

    if (error) {
      console.error('Error creando evento:', error)
    } else {
      setTitulo('')
      setDescripcion('')
      setFecha('')
      await cargarEventos()
    }
  }

  async function handleEliminarEvento(id) {
    const { error } = await supabase
      .from('eventos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error eliminando evento:', error)
    } else {
      await cargarEventos()
    }
  }

  function calcularDiasFaltantes(fechaEvento) {
    const hoy = new Date()
    const fechaEventoDate = new Date(fechaEvento)
    hoy.setHours(0, 0, 0, 0)
    fechaEventoDate.setHours(0, 0, 0, 0)
    const diferenciaMs = fechaEventoDate - hoy
    return Math.round(diferenciaMs / (1000 * 60 * 60 * 24))
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
    <div className="min-h-screen bg-background text-on-background md:ml-64 md:pt-24 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-12">

        <section>
          <h2 className="font-pixel text-3xl text-primary flicker-text uppercase">PROXIMOS EVENTOS</h2>
          <p className="text-on-surface-variant mt-2 border-l-4 border-tertiary pl-4">
            No olvides las fechas importantes, despues te demandan.
          </p>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface-container-high border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <form id="form-evento" onSubmit={handleCrearEvento} className="space-y-4">
              <div className="space-y-2">
                <label className="block font-pixel text-xs text-secondary uppercase tracking-widest">Titulo del evento</label>
                <input
                  type="text"
                  placeholder="EJ. CENA DE BOSS FINAL"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full bg-black border-2 border-secondary text-secondary p-3 focus:outline-none focus:border-tertiary uppercase font-pixel text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block font-pixel text-xs text-secondary uppercase tracking-widest">Descripcion</label>
                <textarea
                  placeholder="DETALLES DE LA MISION..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows="2"
                  className="w-full bg-black border-2 border-secondary text-secondary p-3 focus:outline-none focus:border-tertiary uppercase font-pixel text-sm"
                />
              </div>
            </form>
          </div>

          <div className="bg-surface-container-high border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <div className="space-y-2">
              <label className="block font-pixel text-xs text-secondary uppercase tracking-widest">Fecha limite</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                form="form-evento"
                className="w-full bg-black border-2 border-secondary text-secondary p-3 focus:outline-none focus:border-tertiary font-pixel text-sm"
                required
              />
            </div>
            <button
              onClick={handleCrearEvento}
              className="mt-4 w-full bg-primary text-black py-4 px-6 font-pixel uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
            >
              Añadir evento
            </button>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-pixel text-xl text-tertiary uppercase">INVENTARIO DE FECHAS</h3>
            <span className="font-pixel text-xs bg-secondary text-black px-3 py-1">{eventos.length} ACTIVOS</span>
          </div>

          {eventos.length === 0 && (
            <div className="border-2 border-dashed border-outline-variant p-6 text-center font-pixel text-xs uppercase opacity-50">
              No hay eventos todavia
            </div>
          )}

          <div className="space-y-4">
            {eventos.map((evento) => {
              const dias = calcularDiasFaltantes(evento.fecha)
              const critico = dias <= 1

              return (
                <div
                  key={evento.id}
                  className={`bg-surface-container border-4 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                    critico ? 'border-error' : 'border-black'
                  }`}
                >
                  <div>
                    <h4 className={`font-pixel uppercase ${critico ? 'text-error' : 'text-on-surface'}`}>
                      {evento.titulo}
                    </h4>
                    {evento.descripcion && (
                      <p className="text-sm text-on-surface-variant mt-1">{evento.descripcion}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t-2 border-dashed border-surface-variant md:border-0 pt-4 md:pt-0">
                    <div className="text-right">
                      <p className="font-pixel text-xs text-outline uppercase">Expira en:</p>
                      <p className="font-pixel text-yellow-400 uppercase">
                        {dias > 0 && `FALTAN ${dias} DIAS`}
                        {dias === 0 && '¡ES HOY!'}
                        {dias < 0 && `PASO HACE ${Math.abs(dias)} DIAS`}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEliminarEvento(evento.id)}
                      className="bg-error text-black px-3 py-2 border-2 border-black font-pixel text-xs uppercase"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}