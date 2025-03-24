import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { fetchUsers, updateUser, deleteUser } from "../redux/useSlice";

// Tipado del usuario
interface User {
    _id: string;
    nombre: string;
    email: string;
    tipo: "alumno" | "profesor" | "admin";
}

const UserList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { users, loading, error } = useSelector((state: RootState) => state.users);
    const token = useSelector((state: RootState) => state.auth.token); // Obtener el token desde Redux

    const [editingUser, setEditingUser] = useState<User | null>(null);

    useEffect(() => {
        if (token) {
          console.log("✅ useEffect ejecutado con token:", token); // DEBE aparecer
          dispatch(fetchUsers());
        } else {
          console.warn("⛔ No hay token en Redux");
        }
      }, [dispatch, token]);
      

    const handleDelete = (id: string) => {
        if (token) {
            dispatch(deleteUser({ id, token }));
        }
    };

    const handleSave = () => {
        if (editingUser && token) {
            const { _id, ...updatedData } = editingUser;
            dispatch(updateUser({ id: _id, updatedData, token }));
            setEditingUser(null);
        }
    };
    

    if (loading) return <p>Cargando usuarios...</p>;
    if (error) return <p>Error: {error}</p>;

    console.log("Usuarios desde Redux:", users);

    return (
        <div className="container mt-4">
            <h2>CRUD de Usuarios</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Tipo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.nombre}</td>
                            <td>{user.email}</td>
                            <td>{user.tipo}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => setEditingUser(user)}>
                                    Editar
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user._id)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editingUser && (
                <div className="modal show d-block" tabIndex={-1}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Editar Usuario</h5>
                                <button type="button" className="btn-close" onClick={() => setEditingUser(null)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    value={editingUser.nombre}
                                    onChange={(e) => setEditingUser({ ...editingUser, nombre: e.target.value })}
                                />
                                <input
                                    type="email"
                                    className="form-control mb-2"
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                />
                                <select
                                    className="form-control mb-2"
                                    value={editingUser.tipo}
                                    onChange={(e) =>
                                        setEditingUser({
                                            ...editingUser,
                                            tipo: e.target.value as "alumno" | "profesor" | "admin",
                                        })
                                    }
                                >
                                    <option value="alumno">Alumno</option>
                                    <option value="profesor">Profesor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setEditingUser(null)}>
                                    Cancelar
                                </button>
                                <button className="btn btn-primary" onClick={handleSave}>
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;
