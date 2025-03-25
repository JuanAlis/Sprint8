import React from "react";
import UserList from "../componentes/user.List"; // Asegúrate de que la ruta es correcta

const Home: React.FC = () => {
    return (
        <div className="container my-5">
            {/* Aquí se renderiza UserList */}
            <UserList />
        </div>
    );
};

export default Home;
