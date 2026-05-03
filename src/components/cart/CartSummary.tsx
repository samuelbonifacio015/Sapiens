import { useState } from 'react';

interface CartSummaryProps {
  subtotal: number;
  onCheckout?: () => void;
}

export default function CartSummary({ subtotal, onCheckout }: CartSummaryProps) {
  const [departamento, setDepartamento] = useState('');
  const shipping = departamento === 'Lima' ? 0 : departamento ? 15 : null;
  const total = subtotal + (shipping ?? 0);

  return (
    <div className="bg-surface border border-border rounded p-6 flex flex-col gap-5 sticky top-24">
      <h2 className="font-playfair font-bold text-xl text-text">Resumen</h2>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-inter text-sm text-text-muted">Subtotal</span>
          <span className="font-inter text-sm text-text">S/ {subtotal.toFixed(2)}</span>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="font-inter text-sm text-text-muted">Envío</span>
            <span className="font-inter text-sm text-text-muted">
              {shipping === null ? 'Calcular' : shipping === 0 ? 'Gratis' : `S/ ${shipping.toFixed(2)}`}
            </span>
          </div>
          <div className="mt-2">
            <select
              value={departamento}
              onChange={e => setDepartamento(e.target.value)}
              aria-label="Seleccionar departamento para calcular envío"
              className="w-full px-3 py-2 border border-border text-sm font-inter text-text bg-surface rounded focus:outline-none focus:ring-1 focus:ring-[#0D0D0D]"
            >
              <option value="">Seleccionar departamento</option>
              <option value="Lima">Lima (envío gratis)</option>
              <option value="Arequipa">Arequipa</option>
              <option value="Cusco">Cusco</option>
              <option value="Trujillo">La Libertad</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-4 flex items-center justify-between">
        <span className="font-inter font-semibold text-text">Total</span>
        <span className="font-inter font-bold text-2xl text-text">S/ {total.toFixed(2)}</span>
      </div>

      <a
        href="/checkout"
        className="w-full py-4 bg-[#0D0D0D] text-[#F8F8F5] font-inter font-medium text-sm rounded hover:bg-[#1A1A1A] transition-colors text-center block"
        aria-label="Proceder al checkout"
      >
        Proceder al checkout
      </a>

      <a
        href="/catalogo"
        className="text-center text-sm font-inter text-text-muted hover:text-text transition-colors"
        aria-label="Seguir comprando"
      >
        ← Seguir comprando
      </a>
    </div>
  );
}
