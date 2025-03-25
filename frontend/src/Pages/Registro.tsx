import React from "react";
import Login from "../componentes/Login";

const Registro: React.FC = () => {
    return (
        <div className="container my-5">
            {/* Aquí se renderiza UserList */}
            <Login/> 
        </div>
    );
};

export default Registro;
