import { useState } from 'react';
import { useCart } from '../../lib/cart-store.js';

type TipoEntrega = 'delivery' | 'recojo';

interface ClienteData {
  nombre: string;
  email: string;
  telefono: string;
  dni: string;
  tipoEntrega: TipoEntrega;
}

interface DireccionData {
  departamento: string;
  provincia: string;
  distrito: string;
  direccion: string;
  referencia: string;
  destinatario: string;
}

const STEPS = ['Datos', 'Entrega', 'Confirmar'];

export default function CheckoutWizard() {
  const { items, total, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [cliente, setCliente] = useState<ClienteData>({
    nombre: '', email: '', telefono: '', dni: '', tipoEntrega: 'delivery',
  });
  const [direccion, setDireccion] = useState<DireccionData>({
    departamento: '', provincia: '', distrito: '', direccion: '', referencia: '', destinatario: '',
  });

  const handleConfirm = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        items: items.map(i => ({
          tipo_producto: i.tipo === 'libro' ? 'Libro' : 'Revista',
          id_producto: i.tipo === 'libro'
            ? (i.producto as any).id_libro
            : (i.producto as any).id_revista,
          cantidad: i.cantidad,
        })),
      };
      const csrfRes = await fetch('/api/auth/csrf');
      if (!csrfRes.ok) throw new Error('No se pudo preparar la sesion de compra');
      const { csrfToken } = await csrfRes.json();
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        window.location.href = '/iniciar-sesion?next=/checkout';
        return;
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'No se pudo procesar el pedido');
      }
      const { id_pedido } = await res.json();
      clearCart();
      window.location.href = `/pedido-confirmado?pedido=${id_pedido}`;
    } catch (e: any) {
      setSubmitError(e.message ?? 'Error');
      setSubmitting(false);
    }
  };

  const fieldClass = 'w-full px-4 py-3 bg-surface border border-border text-text font-inter text-sm rounded placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-[#0D0D0D] transition-colors';
  const labelClass = 'text-sm font-medium font-inter text-text';

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicators */}
      <nav className="flex items-center mb-10" aria-label="Pasos del checkout">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-inter font-medium text-sm ${
                  i <= step ? 'bg-[#0D0D0D] text-[#F8F8F5]' : 'bg-border text-text-muted'
                }`}
                aria-current={i === step ? 'step' : undefined}
              >
                {i + 1}
              </div>
              <span className={`text-xs font-inter hidden sm:block ${i === step ? 'text-text font-medium' : 'text-text-muted'}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-3 ${i < step ? 'bg-[#0D0D0D]' : 'bg-border'}`} aria-hidden="true" />
            )}
          </div>
        ))}
      </nav>

      {/* Step 1: Client data */}
      {step === 0 && (
        <div className="flex flex-col gap-5">
          <h2 className="font-playfair font-bold text-2xl text-text">Datos del cliente</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className={labelClass} htmlFor="nombre">Nombre completo *</label>
              <input id="nombre" type="text" value={cliente.nombre} onChange={e => setCliente(p => ({...p, nombre: e.target.value}))} className={fieldClass} placeholder="Juan Pérez García" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="email">Email *</label>
              <input id="email" type="email" value={cliente.email} onChange={e => setCliente(p => ({...p, email: e.target.value}))} className={fieldClass} placeholder="juan@email.com" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="telefono">Teléfono</label>
              <input id="telefono" type="tel" value={cliente.telefono} onChange={e => setCliente(p => ({...p, telefono: e.target.value}))} className={fieldClass} placeholder="987 654 321" />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="dni">DNI *</label>
              <input id="dni" type="text" value={cliente.dni} onChange={e => setCliente(p => ({...p, dni: e.target.value}))} className={fieldClass} placeholder="12345678" maxLength={8} required />
            </div>
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className={labelClass}>Tipo de entrega *</legend>
            <div className="flex flex-col sm:flex-row gap-3 mt-1">
              {(['delivery', 'recojo'] as TipoEntrega[]).map(t => (
                <label key={t} className={`flex items-center gap-3 p-4 border rounded cursor-pointer flex-1 ${cliente.tipoEntrega === t ? 'border-[#0D0D0D]' : 'border-border'}`}>
                  <input type="radio" name="tipoEntrega" value={t} checked={cliente.tipoEntrega === t} onChange={() => setCliente(p => ({...p, tipoEntrega: t}))} className="accent-[#0D0D0D]" />
                  <div>
                    <p className="font-inter font-medium text-text text-sm capitalize">{t === 'delivery' ? 'Delivery' : 'Recojo en tienda'}</p>
                    <p className="font-inter text-text-muted text-xs">{t === 'delivery' ? 'Lima y provincias' : 'Sin costo de envío'}</p>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setStep(cliente.tipoEntrega === 'recojo' ? 2 : 1)}
              disabled={!cliente.nombre || !cliente.email || !cliente.dni}
              className="px-8 py-3 bg-[#0D0D0D] text-[#F8F8F5] font-inter font-medium text-sm rounded hover:bg-[#1A1A1A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuar →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Shipping address */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <h2 className="font-playfair font-bold text-2xl text-text">Dirección de envío</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="departamento">Departamento *</label>
              <input id="departamento" type="text" value={direccion.departamento} onChange={e => setDireccion(p => ({...p, departamento: e.target.value}))} className={fieldClass} placeholder="Lima" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="provincia">Provincia *</label>
              <input id="provincia" type="text" value={direccion.provincia} onChange={e => setDireccion(p => ({...p, provincia: e.target.value}))} className={fieldClass} placeholder="Lima" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="distrito">Distrito *</label>
              <input id="distrito" type="text" value={direccion.distrito} onChange={e => setDireccion(p => ({...p, distrito: e.target.value}))} className={fieldClass} placeholder="Miraflores" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="destinatario">Nombre del destinatario</label>
              <input id="destinatario" type="text" value={direccion.destinatario} onChange={e => setDireccion(p => ({...p, destinatario: e.target.value}))} className={fieldClass} placeholder="Si es diferente al titular" />
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className={labelClass} htmlFor="direcAddress">Dirección *</label>
              <input id="direcAddress" type="text" value={direccion.direccion} onChange={e => setDireccion(p => ({...p, direccion: e.target.value}))} className={fieldClass} placeholder="Av. Larco 123, Dpto 4B" required />
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className={labelClass} htmlFor="referencia">Referencia</label>
              <input id="referencia" type="text" value={direccion.referencia} onChange={e => setDireccion(p => ({...p, referencia: e.target.value}))} className={fieldClass} placeholder="Frente al parque, edificio rojo..." />
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button type="button" onClick={() => setStep(0)} className="px-6 py-3 border border-border text-text font-inter text-sm rounded hover:bg-bg transition-colors">
              ← Atrás
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!direccion.departamento || !direccion.provincia || !direccion.distrito || !direccion.direccion}
              className="px-8 py-3 bg-[#0D0D0D] text-[#F8F8F5] font-inter font-medium text-sm rounded hover:bg-[#1A1A1A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuar →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Summary */}
      {step === 2 && (
        <div className="flex flex-col gap-6">
          <h2 className="font-playfair font-bold text-2xl text-text">Confirmar pedido</h2>

          {/* Products */}
          <div className="bg-surface border border-border rounded p-5">
            <h3 className="font-inter font-semibold text-text text-sm mb-4">Productos ({items.length})</h3>
            <div className="flex flex-col gap-3">
              {items.map(item => (
                <div key={`${item.tipo}-${(item.producto as any).id_libro ?? (item.producto as any).id_revista}`} className="flex items-center justify-between">
                  <div>
                    <p className="font-inter text-sm text-text line-clamp-1">{item.producto.titulo}</p>
                    <p className="font-inter text-xs text-text-muted">x{item.cantidad}</p>
                  </div>
                  <span className="font-inter text-sm font-medium text-text">S/ {(item.producto.precio * item.cantidad).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery info */}
          {cliente.tipoEntrega === 'delivery' && (
            <div className="bg-surface border border-border rounded p-5">
              <h3 className="font-inter font-semibold text-text text-sm mb-2">Dirección de entrega</h3>
              <p className="font-inter text-sm text-text-muted">{direccion.direccion}, {direccion.distrito}, {direccion.provincia}</p>
              {direccion.referencia && <p className="font-inter text-xs text-text-muted mt-1">Ref: {direccion.referencia}</p>}
            </div>
          )}

          {/* Total */}
          <div className="flex items-center justify-between py-4 border-t border-border">
            <span className="font-inter font-semibold text-text">Total</span>
            <span className="font-inter font-bold text-3xl text-text">S/ {total.toFixed(2)}</span>
          </div>

          <p className="font-inter text-xs text-text-muted text-center">
            Pago contraentrega o transferencia bancaria. Se enviará confirmación a {cliente.email || 'tu correo'}.
          </p>

          <div className="flex justify-between pt-2">
            <button type="button" onClick={() => setStep(cliente.tipoEntrega === 'recojo' ? 0 : 1)} className="px-6 py-3 border border-border text-text font-inter text-sm rounded hover:bg-bg transition-colors">
              ← Atrás
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={submitting || items.length === 0}
              className="px-8 py-4 bg-[#0D0D0D] text-[#F8F8F5] font-inter font-medium text-sm rounded hover:bg-[#1A1A1A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Confirmar y enviar pedido"
            >
              {submitting ? 'Procesando…' : 'Confirmar pedido'}
            </button>
          </div>
          {submitError && (
            <p className="font-inter text-sm text-red-600 text-center" role="alert">{submitError}</p>
          )}
        </div>
      )}
    </div>
  );
}
