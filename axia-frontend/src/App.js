import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tareas, setTareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(null);

  useEffect(() => {
    // Obtener todas las tareas
    axios.get('http://localhost:5000/api/tareas')
      .then(response => setTareas(response.data))
      .catch(error => console.error('Error al obtener tareas:', error));

    // Obtener todos los usuarios
    axios.get('http://localhost:5000/api/usuarios')
      .then(response => setUsuarios(response.data))
      .catch(error => console.error('Error al obtener usuarios:', error));

    // Usuario actual (puede ser el primero para pruebas)
    axios.get('http://localhost:5000/api/usuarios/1')
      .then(response => setUsuarioActual(response.data))
      .catch(error => console.error('Error al obtener usuario actual:', error));
  }, []);

  // Función para mapear los usuarios asignados a cada tarea
  const getUsuariosAsignados = (ids) => {
    if (!ids) return [];
    return ids.map(id => usuarios.find(u => u.id === id)).filter(Boolean);
  };

  // Columnas del tablero estilo Trello
  const columnas = ['Backlog', 'Task', 'Model', 'Answer', 'In Process', 'Done'];

  // Agrupar tareas por columna
  const groupedTareas = columnas.reduce((acc, col) => {
    acc[col] = tareas.filter(t => t.columna === col);
    return acc;
  }, {});

  return (
    <div className="app">
      {/* Barra lateral */}
      <aside className="sidebar">
        {usuarioActual && (
          <div className="profile">
            <img src={`usuario_${usuarioActual.id}.jpg`} alt={usuarioActual.nombre} />
            <div className="meta">
              <div className="name">{usuarioActual.nombre}</div>
              <div className="role">{`usuario_${usuarioActual.id}`}</div>
            </div>
          </div>
        )}
      </aside>

      {/* Contenido principal */}
      <main className="content">
        <div className="header">
          <h1>Task Boards</h1>
          <div className="avatars">
            {usuarios.map(u => (
              <img key={u.id} src={`usuario_${u.id}.jpg`} alt={u.nombre} />
            ))}
          </div>
        </div>

        <div className="boards">
          {columnas.map(col => (
            <div key={col} className="column">
              <h3>{col} <span className="count">{groupedTareas[col]?.length || 0}</span></h3>
              {groupedTareas[col]?.map(tarea => (
                <div key={tarea.id} className="card">
                  <div className="title">{tarea.titulo}</div>
                  <div className="id">#{tarea.id.toString().padStart(3,'0')}</div>
                  <div className="tags">
                    <div className="tag">{tarea.columna}</div>
                  </div>
                  <div className="users">
                    {getUsuariosAsignados(tarea.responsable_id ? [tarea.responsable_id] : []).map(u => (
                      <img key={u.id} src={`usuario_${u.id}.jpg`} alt={u.nombre} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
