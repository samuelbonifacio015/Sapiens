import { useMemo, useState } from 'react';

type AuthMode = 'login' | 'register';
type AuthRole = 'USER' | 'ADMIN';

interface AuthFormProps {
  mode: AuthMode;
  next?: string;
}

interface AuthResponse {
  id?: number;
  rol?: AuthRole;
  error?: string;
  issues?: Array<{ path?: Array<string | number>; message?: string }>;
}

const fieldClass =
  'w-full px-4 py-3 bg-surface border border-border text-text font-inter text-sm rounded placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary transition-colors';
const labelClass = 'text-sm font-medium font-inter text-text';

const getSafeNext = (next?: string) => {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.includes('\\')) return null;
  const path = next.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  if (path === '/iniciar-sesion' || path === '/registro') return null;
  return next;
};

const getFriendlyError = (status: number, data: AuthResponse) => {
  if (status === 401) return 'Correo o contrasena incorrectos.';
  if (status === 409) return 'Ese correo ya esta registrado. Inicia sesion o usa otro correo.';
  if (status === 400) {
    const firstIssue = data.issues?.[0];
    if (firstIssue?.path?.[0] === 'password') return 'La contrasena debe tener al menos 8 caracteres.';
    if (firstIssue?.path?.[0] === 'correo') return 'Ingresa un correo valido.';
    if (firstIssue?.path?.[0] === 'nombre_cliente') return 'Ingresa tu nombre completo.';
    return 'Revisa los datos ingresados e intentalo nuevamente.';
  }
  return data.error || 'No pudimos procesar la solicitud. Intentalo nuevamente.';
};

const getCsrfToken = async () => {
  const res = await fetch('/api/auth/csrf');
  if (!res.ok) throw new Error('csrf');
  const data = (await res.json()) as { csrfToken?: string };
  if (!data.csrfToken) throw new Error('csrf');
  return data.csrfToken;
};

export default function AuthForm({ mode, next }: AuthFormProps) {
  const isRegister = mode === 'register';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const safeNext = getSafeNext(next);

  const copy = useMemo(
    () =>
      isRegister
        ? {
            title: 'Crear cuenta',
            lead: 'Registra una cuenta de cliente para comprar y revisar tus pedidos.',
            submit: 'Crear cuenta',
            loading: 'Creando cuenta...',
            switchText: 'Ya tienes una cuenta?',
            switchLabel: 'Inicia sesion',
            switchHref: safeNext ? `/iniciar-sesion?next=${encodeURIComponent(safeNext)}` : '/iniciar-sesion',
          }
        : {
            title: 'Iniciar sesion',
            lead: 'Accede con tu correo para continuar tus compras en Sapiens.',
            submit: 'Iniciar sesion',
            loading: 'Ingresando...',
            switchText: 'Aun no tienes cuenta?',
            switchLabel: 'Registrate',
            switchHref: safeNext ? `/registro?next=${encodeURIComponent(safeNext)}` : '/registro',
          },
    [isRegister, safeNext],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = isRegister
      ? {
          nombre_cliente: String(form.get('nombre_cliente') ?? '').trim(),
          correo: String(form.get('correo') ?? '').trim(),
          password: String(form.get('password') ?? ''),
          telefono: String(form.get('telefono') ?? '').trim() || undefined,
          direccion: String(form.get('direccion') ?? '').trim() || undefined,
        }
      : {
          correo: String(form.get('correo') ?? '').trim(),
          password: String(form.get('password') ?? ''),
        };

    try {
      const csrfToken = await getCsrfToken();
      const res = await fetch(isRegister ? '/api/auth/register' : '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as AuthResponse;
      if (!res.ok) {
        setError(getFriendlyError(res.status, data));
        return;
      }

      if (data.rol === 'ADMIN') {
        window.location.assign('/admin');
        return;
      }
      window.location.assign(safeNext ?? '/mi-cuenta');
    } catch {
      setError('No pudimos conectar con el servidor. Revisa tu conexion e intentalo otra vez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-md bg-surface border border-border rounded p-6 sm:p-8">
      <div className="mb-8">
        <p className="font-inter text-xs font-semibold uppercase tracking-[0.2em] text-text-muted mb-3">
          Sapiens
        </p>
        <h1 className="font-playfair font-bold text-3xl text-text">{copy.title}</h1>
        <p className="font-inter text-sm text-text-muted mt-3 leading-6">{copy.lead}</p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {isRegister && (
          <div className="flex flex-col gap-1">
            <label className={labelClass} htmlFor="nombre_cliente">
              Nombre completo
            </label>
            <input
              className={fieldClass}
              id="nombre_cliente"
              name="nombre_cliente"
              type="text"
              autoComplete="name"
              required
            />
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className={labelClass} htmlFor="correo">
            Correo
          </label>
          <input
            className={fieldClass}
            id="correo"
            name="correo"
            type="email"
            autoComplete="email"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClass} htmlFor="password">
            Contrasena
          </label>
          <input
            className={fieldClass}
            id="password"
            name="password"
            type="password"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            minLength={isRegister ? 8 : 1}
            required
          />
          {isRegister && <p className="font-inter text-xs text-text-muted">Minimo 8 caracteres.</p>}
        </div>

        {isRegister && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="telefono">
                Telefono
              </label>
              <input className={fieldClass} id="telefono" name="telefono" type="tel" autoComplete="tel" />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="direccion">
                Direccion
              </label>
              <input
                className={fieldClass}
                id="direccion"
                name="direccion"
                type="text"
                autoComplete="street-address"
              />
            </div>
          </div>
        )}

        {error && (
          <p className="rounded border border-error/40 bg-error/10 px-4 py-3 font-inter text-sm text-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex min-h-12 items-center justify-center rounded border border-primary bg-primary px-6 py-3 font-inter text-sm font-semibold text-bg transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? copy.loading : copy.submit}
        </button>
      </form>

      <p className="mt-6 font-inter text-sm text-text-muted">
        {copy.switchText}{' '}
        <a className="font-semibold text-text underline underline-offset-4 hover:text-text-muted" href={copy.switchHref}>
          {copy.switchLabel}
        </a>
      </p>
    </section>
  );
}
