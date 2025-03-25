import React from "react";
import UserList from "../componentes/user.List"; 

const Home: React.FC = () => {
    return (
        <div className="container my-5">
            <UserList />
        </div>
    );
};

export default Home;
