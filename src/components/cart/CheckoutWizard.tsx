import { useEffect, useState } from 'react';
import { useCart } from '../../lib/cart-store.js';

interface ClienteProfile {
  id_cliente: number;
  nombre_cliente: string;
  correo: string;
  telefono?: string | null;
  direccion?: string | null;
}

interface ProfileForm {
  nombre_cliente: string;
  correo: string;
  telefono: string;
  direccion: string;
}

const STEPS = ['Contacto', 'Confirmar'];

const fieldClass =
  'w-full px-4 py-3 bg-surface border border-border text-text font-inter text-sm rounded placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-[#0D0D0D] transition-colors';
const labelClass = 'text-sm font-medium font-inter text-text';

const getCsrfToken = async () => {
  const csrfRes = await fetch('/api/auth/csrf');
  if (!csrfRes.ok) throw new Error('No se pudo preparar la sesion de compra');
  const data = (await csrfRes.json()) as { csrfToken?: string };
  if (!data.csrfToken) throw new Error('No se pudo preparar la sesion de compra');
  return data.csrfToken;
};

const redirectToLogin = () => {
  window.location.href = '/iniciar-sesion?next=/checkout';
};

export default function CheckoutWizard() {
  const { items, total, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileForm>({
    nombre_cliente: '',
    correo: '',
    telefono: '',
    direccion: '',
  });

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const res = await fetch('/api/clientes/me');
        if (res.status === 401) {
          redirectToLogin();
          return;
        }
        if (!res.ok) throw new Error('No se pudo cargar tu perfil');
        const data = (await res.json()) as ClienteProfile;
        if (!active) return;
        setProfile({
          nombre_cliente: data.nombre_cliente ?? '',
          correo: data.correo ?? '',
          telefono: data.telefono ?? '',
          direccion: data.direccion ?? '',
        });
      } catch (e: any) {
        if (active) setSubmitError(e.message ?? 'No se pudo cargar tu perfil');
      } finally {
        if (active) setLoadingProfile(false);
      }
    };

    loadProfile();
    return () => {
      active = false;
    };
  }, []);

  const updateProfile = (patch: Partial<ProfileForm>) => {
    setProfile(current => ({ ...current, ...patch }));
  };

  const handleConfirm = async () => {
    if (items.length === 0) {
      setSubmitError('Tu carrito esta vacio.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const csrfToken = await getCsrfToken();
      const profileRes = await fetch('/api/clientes/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        body: JSON.stringify({
          nombre_cliente: profile.nombre_cliente.trim(),
          telefono: profile.telefono.trim() || null,
          direccion: profile.direccion.trim() || null,
        }),
      });
      if (profileRes.status === 401) {
        redirectToLogin();
        return;
      }
      if (!profileRes.ok) {
        const j = await profileRes.json().catch(() => ({}));
        throw new Error(j.error || 'No se pudieron guardar tus datos');
      }

      const payload = {
        items: items.map(i => ({
          tipo_producto: i.tipo === 'libro' ? 'Libro' : 'Revista',
          id_producto: i.tipo === 'libro'
            ? (i.producto as any).id_libro
            : (i.producto as any).id_revista,
          cantidad: i.cantidad,
        })),
      };

      const orderRes = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        body: JSON.stringify(payload),
      });
      if (orderRes.status === 401) {
        redirectToLogin();
        return;
      }
      if (!orderRes.ok) {
        const j = await orderRes.json().catch(() => ({}));
        throw new Error(j.error || 'No se pudo procesar el pedido');
      }
      const { id_pedido } = await orderRes.json();
      clearCart();
      window.location.href = `/pedido-confirmado?pedido=${id_pedido}`;
    } catch (e: any) {
      setSubmitError(e.message ?? 'Error');
      setSubmitting(false);
    }
  };

  const canContinue = Boolean(profile.nombre_cliente.trim() && profile.correo.trim());

  if (loadingProfile) {
    return (
      <div className="max-w-2xl mx-auto bg-surface border border-border rounded p-8">
        <p className="font-inter text-sm text-text-muted">Cargando tus datos...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto bg-surface border border-border rounded p-8 text-center">
        <h2 className="font-playfair font-bold text-2xl text-text">Tu carrito esta vacio</h2>
        <p className="font-inter text-sm text-text-muted mt-2">Agrega productos antes de finalizar la compra.</p>
        <a
          href="/catalogo"
          className="mt-6 inline-flex px-8 py-3 bg-[#0D0D0D] text-[#F8F8F5] font-inter font-medium text-sm rounded hover:bg-[#1A1A1A] transition-colors"
        >
          Explorar catalogo
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
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
              <span className={`text-xs font-inter hidden sm:block ${i === step ? 'text-text font-medium' : 'text-text-muted'}`}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-3 ${i < step ? 'bg-[#0D0D0D]' : 'bg-border'}`} aria-hidden="true" />
            )}
          </div>
        ))}
      </nav>

      {step === 0 && (
        <div className="flex flex-col gap-5">
          <h2 className="font-playfair font-bold text-2xl text-text">Datos de contacto</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className={labelClass} htmlFor="nombre_cliente">Nombre completo *</label>
              <input
                id="nombre_cliente"
                type="text"
                value={profile.nombre_cliente}
                onChange={e => updateProfile({ nombre_cliente: e.target.value })}
                className={fieldClass}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="correo">Correo</label>
              <input
                id="correo"
                type="email"
                value={profile.correo}
                className={`${fieldClass} opacity-70`}
                disabled
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="telefono">Telefono</label>
              <input
                id="telefono"
                type="tel"
                value={profile.telefono}
                onChange={e => updateProfile({ telefono: e.target.value })}
                className={fieldClass}
                placeholder="987 654 321"
              />
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className={labelClass} htmlFor="direccion">Direccion</label>
              <input
                id="direccion"
                type="text"
                value={profile.direccion}
                onChange={e => updateProfile({ direccion: e.target.value })}
                className={fieldClass}
                placeholder="Av. Larco 123, Miraflores, Lima"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={!canContinue}
              className="px-8 py-3 bg-[#0D0D0D] text-[#F8F8F5] font-inter font-medium text-sm rounded hover:bg-[#1A1A1A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-6">
          <h2 className="font-playfair font-bold text-2xl text-text">Confirmar pedido</h2>

          <div className="bg-surface border border-border rounded p-5">
            <h3 className="font-inter font-semibold text-text text-sm mb-4">Productos ({items.length})</h3>
            <div className="flex flex-col gap-3">
              {items.map(item => (
                <div key={`${item.tipo}-${(item.producto as any).id_libro ?? (item.producto as any).id_revista}`} className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-inter text-sm text-text line-clamp-1">{item.producto.titulo}</p>
                    <p className="font-inter text-xs text-text-muted">x{item.cantidad}</p>
                  </div>
                  <span className="font-inter text-sm font-medium text-text">S/ {(item.producto.precio * item.cantidad).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-border rounded p-5">
            <h3 className="font-inter font-semibold text-text text-sm mb-2">Contacto</h3>
            <p className="font-inter text-sm text-text">{profile.nombre_cliente}</p>
            <p className="font-inter text-sm text-text-muted">{profile.correo}</p>
            {profile.telefono && <p className="font-inter text-sm text-text-muted">{profile.telefono}</p>}
            {profile.direccion && <p className="font-inter text-sm text-text-muted">{profile.direccion}</p>}
          </div>

          <div className="flex items-center justify-between py-4 border-t border-border">
            <span className="font-inter font-semibold text-text">Total</span>
            <span className="font-inter font-bold text-3xl text-text">S/ {total.toFixed(2)}</span>
          </div>

          <p className="font-inter text-xs text-text-muted text-center">
            Pago contraentrega o transferencia bancaria. Te contactaremos para coordinar la entrega.
          </p>

          <div className="flex justify-between pt-2">
            <button type="button" onClick={() => setStep(0)} className="px-6 py-3 border border-border text-text font-inter text-sm rounded hover:bg-bg transition-colors">
              Atras
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={submitting}
              className="px-8 py-4 bg-[#0D0D0D] text-[#F8F8F5] font-inter font-medium text-sm rounded hover:bg-[#1A1A1A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Confirmar y enviar pedido"
            >
              {submitting ? 'Procesando...' : 'Confirmar pedido'}
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
