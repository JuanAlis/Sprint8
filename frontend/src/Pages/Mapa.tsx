import React from "react";
import Mapa from "../componentes/Mapa"; 

const MapaPage: React.FC = () => {
    return (
        <div className="container mt-4">
            <h2>Ubicación con Mapbox</h2>
            <Mapa />
        </div>
    );
};

export default MapaPage;
