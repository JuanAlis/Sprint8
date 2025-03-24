import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";
import { RootState } from "../redux/store";

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }) as any);
    };

    return (
        <div className="container">
            <h2>Iniciar Sesión</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" disabled={loading}>{loading ? "Cargando..." : "Iniciar Sesión"}</button>
            </form>
        </div>
    );
};

export default Login;
