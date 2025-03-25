import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser, logout } from "../redux/authSlice";
import { RootState } from "../redux/store";

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const { user, token, loading, error } = useSelector((state: RootState) => state.auth);

    const [isRegistering, setIsRegistering] = useState(false);
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [tipo, setTipo] = useState<"alumno" | "profesor">("alumno");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isRegistering) {
            dispatch(registerUser({ nombre, email, password, tipo }) as any)
                .then((res: any) => {
                    if (!res.error) {
                        alert("✅ Usuario registrado correctamente");
                    }
                });
        } else {
            dispatch(loginUser({ email, password }) as any);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        alert("Has cerrado sesión");
    };

    // 👉 Si hay usuario logueado, mostramos el perfil
    if (user && token) {
        return (
            <div className="container">
                <h2>Perfil de Usuario</h2>
                <p><strong>Nombre:</strong> {user.nombre}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Tipo:</strong> {user.tipo}</p>
                <button className="btn btn-danger mt-2" onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </div>
        );
    }

    // 👉 Si no hay usuario logueado, mostramos el formulario
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
