'use client';

export default function CustomerProfileForm() {
  return (
    <div className="max-w-xl mx-auto mt-12 p-6 rounded-2xl shadow-lg bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">Formulario del Cliente</h1>
      <p className="mb-2">
        Este es un formulario de prueba para usuarios con rol{' '}
        <strong>Customer</strong>.
      </p>

      <form className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nombre de la empresa</label>
          <input
            type="text"
            placeholder="Ej: Acme Corp"
            className="w-full p-2 border rounded-md"
            disabled
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Descripción del problema
          </label>
          <textarea
            rows={4}
            placeholder="Describe tu problema..."
            className="w-full p-2 border rounded-md"
            disabled
          />
        </div>

        <div>
          <label className="inline-flex items-center">
            <input type="checkbox" disabled className="mr-2" />
            Acepto las políticas de privacidad
          </label>
        </div>

        <button
          type="button"
          className="mt-4 px-4 py-2 rounded-md bg-gray-300 text-gray-600 cursor-not-allowed"
          disabled
        >
          Guardar (deshabilitado)
        </button>
      </form>
    </div>
  );
}
