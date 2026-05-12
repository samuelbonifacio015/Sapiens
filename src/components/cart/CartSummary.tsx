interface CartSummaryProps {
  subtotal: number;
  onCheckout?: () => void;
}

export default function CartSummary({ subtotal, onCheckout }: CartSummaryProps) {
  return (
    <div className="bg-surface border border-border rounded p-6 flex flex-col gap-5 sticky top-24">
      <h2 className="font-playfair font-bold text-xl text-text">Resumen</h2>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-inter text-sm text-text-muted">Subtotal</span>
          <span className="font-inter text-sm text-text">S/ {subtotal.toFixed(2)}</span>
        </div>
        <p className="font-inter text-xs leading-5 text-text-muted">
          El costo de entrega se coordina al confirmar el pedido.
        </p>
      </div>

      <div className="border-t border-border pt-4 flex items-center justify-between">
        <span className="font-inter font-semibold text-text">Total</span>
        <span className="font-inter font-bold text-2xl text-text">S/ {subtotal.toFixed(2)}</span>
      </div>

      <a
        href="/checkout"
        onClick={onCheckout}
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
        Seguir comprando
      </a>
    </div>
  );
}
