export default function Header() {
    return (
      <header className="w-full h-16 bg-white border-b flex justify-between items-center px-6 shadow">
        <h1 className="text-xl font-semibold text-gray-800">Dashboard Profesor</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Bienvenido, Prof. Gabriel</span>
          <img src="https://i.pravatar.cc/40" alt="avatar" className="rounded-full w-10 h-10" />
        </div>
      </header>
    );
  }
  