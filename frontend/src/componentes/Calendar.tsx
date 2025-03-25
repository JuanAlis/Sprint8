import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";

const Calendar: React.FC = () => {
  const eventosFijos: EventInput[] = [
    { title: "Clase de Matemáticas", date: "2025-03-28", color: "#007bff", extendedProps: { tipo: "clases" } },
    { title: "Clase de Física", date: "2025-03-29", color: "#007bff", extendedProps: { tipo: "clases" } },
    { title: "Clase de Programación", date: "2025-04-01", color: "#007bff", extendedProps: { tipo: "clases" } },
  ];

  const [eventos, setEventos] = useState<EventInput[]>([]);

  useEffect(() => {
    const guardados = localStorage.getItem("eventosPersonalizados");
    const eventosGuardados = guardados ? JSON.parse(guardados) : [];
    setEventos([...eventosFijos, ...eventosGuardados]);
  }, []);

  const guardarEnLocalStorage = (eventos: EventInput[]) => {
    const personalizados = eventos.filter(e => e.extendedProps?.tipo !== "clases");
    localStorage.setItem("eventosPersonalizados", JSON.stringify(personalizados));
  };

  const handleDateClick = (arg: any) => {
    const title = prompt("Nombre del evento:");
    if (title) {
      const nuevoEvento = { title, date: arg.dateStr, color: "#28a745" };
      const nuevosEventos = [...eventos, nuevoEvento];
      setEventos(nuevosEventos);
      guardarEnLocalStorage(nuevosEventos);
    }
  };

  const handleEventClick = (arg: any) => {
    const esClase = arg.event.extendedProps?.tipo === "clases";
    if (esClase) return;

    const accion = prompt(
      `Editar el evento o escribe "eliminar" para borrarlo:\nEvento actual: ${arg.event.title}`,
      arg.event.title
    );

    if (accion === null) return; 

    let nuevosEventos = [...eventos];

    if (accion.toLowerCase() === "eliminar") {
      nuevosEventos = nuevosEventos.filter((e) => e.title !== arg.event.title || e.date !== arg.event.startStr);
    } else if (accion.trim() !== "") {
      nuevosEventos = nuevosEventos.map((e) => {
        if (e.title === arg.event.title && e.date === arg.event.startStr) {
          return { ...e, title: accion };
        }
        return e;
      });
    }

    setEventos(nuevosEventos);
    guardarEnLocalStorage(nuevosEventos);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Calendario</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        events={eventos}
        height="auto"
        locale="es"
      />
    </div>
  );
};

export default Calendar;
