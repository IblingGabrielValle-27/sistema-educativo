import { ReactNode } from "react";
import Sidebar from "../components/Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function LayoutProfesor({ children }: LayoutProps) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 bg-gray-100 min-h-screen p-6">{children}</main>
    </div>
  );
}
