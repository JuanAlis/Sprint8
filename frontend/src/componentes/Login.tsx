import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../redux/authSlice";
import { RootState } from "../redux/store";

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const [isRegistering, setIsRegistering] = useState(false);
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [tipo, setTipo] = useState<"alumno" | "profesor">("alumno");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isRegistering) {
            dispatch(registerUser({ nombre, email, password, tipo }) as any);
        } else {
            dispatch(loginUser({ email, password }) as any);
        }
    };

    return (
        <div className="container">
            <h2>{isRegistering ? "Registrarse" : "Iniciar Sesión"}</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                {isRegistering && (
                    <>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                        <select
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value as "alumno" | "profesor")}
                            className="form-select mb-2"
                        >
                            <option value="alumno">Alumno</option>
                            <option value="profesor">Profesor</option>
                        </select>
                    </>
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Cargando..." : isRegistering ? "Registrarse" : "Iniciar Sesión"}
                </button>
            </form>

            <p className="mt-3">
                {isRegistering ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
                <button className="btn btn-link p-0" type="button" onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? "Inicia sesión" : "Regístrate"}
                </button>
            </p>
        </div>
    );
};

export default Login;
