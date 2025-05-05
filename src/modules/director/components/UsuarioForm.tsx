import { useState } from 'react';

type Usuario = {
  id?: string;
  nombre: string;
  apellido: string;
  correo: string;
  rol: 'director' | 'profesor' | 'estudiante' | 'psicologo';
};

type Props = {
  initialData?: Usuario;
  onSubmit: (usuario: Usuario) => void;
};

const UsuarioForm = ({ initialData, onSubmit }: Props) => {
  const [nombre, setNombre] = useState(initialData?.nombre || '');
  const [apellido, setApellido] = useState(initialData?.apellido || '');
  const [correo, setCorreo] = useState(initialData?.correo || '');
  const [rol, setRol] = useState<Usuario['rol']>(initialData?.rol || 'profesor');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !apellido || !correo || !rol) {
      setError('Todos los campos son obligatorios');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      setError('Correo inválido');
      return;
    }
    setError(null);
    onSubmit({ nombre, apellido, correo, rol });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-lg font-semibold">{initialData ? 'Editar Usuario' : 'Crear Usuario'}</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label className="block font-medium">Nombre</label>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Ingrese el nombre"
        />
      </div>
      <div>
        <label className="block font-medium">Apellido</label>
        <input
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Ingrese el apellido"
        />
      </div>
      <div>
        <label className="block font-medium">Correo</label>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Ingrese el correo"
        />
      </div>
      <div>
        <label className="block font-medium">Rol</label>
        <select
          value={rol}
          onChange={(e) => setRol(e.target.value as Usuario['rol'])}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="director">Director</option>
          <option value="profesor">Profesor</option>
          <option value="estudiante">Estudiante</option>
          <option value="psicologo">Psicólogo</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {initialData ? 'Actualizar' : 'Crear'}
      </button>
    </form>
  );
};

export default UsuarioForm;