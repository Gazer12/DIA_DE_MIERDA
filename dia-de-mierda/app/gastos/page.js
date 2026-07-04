'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Gastos() {
  const [usuario, setUsuario] = useState(null)
  const [gastos, setGastos] = useState([])
  const [cargando, setCargando] = useState(true)

  const [descripcion, setDescripcion] = useState('')
  const [categoria, setCategoria] = useState('EQUIPO')
  const [monto, setMonto] = useState('')

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    const { data: { user } } = await supabase.auth.getUser()
    setUsuario(user)

    if (user) {
      await cargarGastos()
    }

    setCargando(false)
  }

  async function cargarGastos() {
    const { data, error } = await supabase
      .from('gastos')
      .select('*')
      .order('fecha', { ascending: false })

    if (error) {
      console.error('Error trayendo gastos:', error)
    } else {
      setGastos(data)
    }
  }

  async function handleCrearGasto(e) {
    e.preventDefault()

    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('gastos')
      .insert({
        descripcion: descripcion,
        categoria: categoria,
        monto: parseFloat(monto),
        user_id: user.id,
      })

    if (error) {
      console.error('Error creando gasto:', error)
    } else {
      setDescripcion('')
      setCategoria('EQUIPO')
      setMonto('')
      await cargarGastos()
    }
  }

  async function handleEliminarGasto(id) {
    const { error } = await supabase
      .from('gastos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error eliminando gasto:', error)
    } else {
      await cargarGastos()
    }
  }

  function estiloCategoria(categoria) {
    const estilos = {
      COMIDA: { color: 'bg-[#f751a1] text-black', icono: '☕' },
      TRANSPORTE: { color: 'bg-[#03b5d3] text-black', icono: '🚌' },
      OCIO: { color: 'bg-[#b76dff] text-black', icono: '🎮' },
      EQUIPO: { color: 'bg-[#ffb0cd] text-black', icono: '🛠️' },
      OTROS: { color: 'bg-[#39323d] text-[#cfc2d6]', icono: '📦' },
    }
    return estilos[categoria] || estilos.OTROS
  }

  const totalGastado = gastos.reduce((suma, gasto) => suma + Number(gasto.monto), 0)

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
    <div className="min-h-screen bg-background text-on-background md:ml-64 md:pt-24 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        <section className="mb-10">
          <div className="bg-black border-4 border-secondary p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-secondary/30"></div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-secondary font-pixel text-xs tracking-[0.2em] mb-2 uppercase">
                MARCADOR DE RIQUEZA
              </span>
              <div className="text-tertiary font-pixel text-4xl tracking-widest flicker-text">
                TOTAL GASTADO: <span className="text-secondary">${totalGastado.toFixed(2)}</span>
              </div>
            </div>
            <div className="absolute bottom-2 right-4 text-[10px] text-outline font-pixel opacity-50">
              INSERT COIN TO RESET
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <section className="lg:col-span-5">
            <div className="bg-surface-container-high border-4 border-on-background p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-pixel text-lg text-primary mb-6 uppercase">
                + REGISTRAR GASTO
              </h3>
              <form onSubmit={handleCrearGasto} className="space-y-6">
                <div>
                  <label className="block font-pixel text-xs text-on-surface-variant mb-2 uppercase tracking-tighter">
                    Descripcion del item
                  </label>
                  <input
                    type="text"
                    placeholder="POCION DE CAFE..."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full bg-black border-2 border-secondary p-4 text-on-surface focus:outline-none focus:border-tertiary uppercase font-pixel text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-pixel text-xs text-on-surface-variant mb-2 uppercase tracking-tighter">
                      Categoria
                    </label>
                    <select
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      className="w-full bg-black border-2 border-secondary p-4 text-on-surface focus:outline-none focus:border-tertiary font-pixel text-sm"
                    >
                      <option>EQUIPO</option>
                      <option>COMIDA</option>
                      <option>TRANSPORTE</option>
                      <option>OCIO</option>
                      <option>OTROS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-pixel text-xs text-on-surface-variant mb-2 uppercase tracking-tighter">
                      Monto
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary">$</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0000"
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                        className="w-full bg-black border-2 border-secondary p-4 pl-10 text-on-surface focus:outline-none focus:border-tertiary font-pixel text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-tertiary text-black p-4 border-4 border-black font-pixel uppercase tracking-tight flex justify-center items-center gap-2 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  COMPRAR
                </button>
              </form>
            </div>

            <div className="mt-8 relative h-48 border-4 border-outline bg-surface-container-lowest overflow-hidden flex items-center justify-center">
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)',
                  backgroundSize: '16px 16px',
                }}
              ></div>
              <div className="text-center relative">
                <div className="text-5xl mb-2 flicker-text">💰</div>
                <p className="font-pixel text-xs text-outline">
                  EL DINERO NO DA LA FELICIDAD,<br />
                  PERO NUNCA NADIE LLORO TRISTE EN UN YATE.
                </p>
              </div>
            </div>
          </section>

          <section className="lg:col-span-7">
            <div className="bg-surface-container border-4 border-on-background p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] h-full">
              <div className="flex justify-between items-end mb-6">
                <h3 className="font-pixel text-lg text-secondary uppercase">
                  INVENTARIO RECIENTE
                </h3>
                <span className="font-pixel text-xs text-outline">{gastos.length} ITEMS</span>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-surface-variant/50 border-b-2 border-secondary font-pixel text-xs text-tertiary uppercase">
                  <div className="col-span-6">Item</div>
                  <div className="col-span-3 text-center">Cat.</div>
                  <div className="col-span-3 text-right">Monto</div>
                </div>

                {gastos.length === 0 && (
                  <div className="p-6 text-center font-pixel text-xs uppercase opacity-50 border-2 border-dashed border-outline-variant">
                    No hay gastos todavia
                  </div>
                )}

                {gastos.map((gasto) => {
                  const { color, icono } = estiloCategoria(gasto.categoria)

                  return (
                    <div
                      key={gasto.id}
                      className="grid grid-cols-12 gap-4 p-4 border-b-2 border-dashed border-outline items-center hover:bg-white/5 transition-colors"
                    >
                      <div className="col-span-6 flex items-center gap-3">
                        <span className="text-2xl">{icono}</span>
                        <span className="font-pixel text-sm text-on-surface uppercase">
                          {gasto.descripcion}
                        </span>
                      </div>
                      <div className="col-span-3 flex justify-center">
                        <span className={`${color} px-2 py-1 font-pixel text-xs uppercase`}>
                          {gasto.categoria || 'OTROS'}
                        </span>
                      </div>
                      <div className="col-span-3 text-right flex items-center justify-end gap-2">
                        <span className="font-pixel text-secondary">${Number(gasto.monto).toFixed(2)}</span>
                        <button
                          onClick={() => handleEliminarGasto(gasto.id)}
                          className="bg-error text-black p-1.5 font-pixel text-xs"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}