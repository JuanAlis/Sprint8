import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Datos de ejemplo
const datosPorDefecto = [
  { mes: "Enero", cantidad: 24 },
  { mes: "Febrero", cantidad: 30 },
  { mes: "Marzo", cantidad: 18 },
  { mes: "Abril", cantidad: 36 },
  { mes: "Mayo", cantidad: 22 },
  { mes: "Junio", cantidad: 28 },
];

const Charts: React.FC = () => {
  const [datos, setDatos] = useState(datosPorDefecto);

  useEffect(() => {
    const guardados = localStorage.getItem("datosEstadisticos");
    if (guardados) {
      setDatos(JSON.parse(guardados));
    } else {
      localStorage.setItem("datosEstadisticos", JSON.stringify(datosPorDefecto));
      setDatos(datosPorDefecto);
    }
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Estadísticas</h2>

      <div style={{ width: "100%", height: 300, marginBottom: "3rem" }}>
        <h4>📊 Gráfico de Barras</h4>
        <ResponsiveContainer>
          <BarChart data={datos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: "100%", height: 300 }}>
        <h4>📈 Gráfico Lineal</h4>
        <ResponsiveContainer>
          <LineChart data={datos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cantidad" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
