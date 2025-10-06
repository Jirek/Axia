const express = require('express');
const { Client } = require('pg');
const app = express();
const port = 5000;

// Middleware para parsear JSON en el cuerpo de las solicitudes
app.use(express.json());

// Conexión a PostgreSQL
const client = new Client({
  user: 'postgres',      // Usuario de PostgreSQL
  host: 'localhost',     // Dirección de la base de datos
  database: 'gestion_tareas', // Nombre de la base de datos
  password: 'yourpassword', // Contraseña de PostgreSQL
  port: 5432,            // Puerto por defecto de PostgreSQL
});

client.connect()
  .then(() => console.log('Conectado a PostgreSQL'))
  .catch(err => console.error('Error de conexión', err.stack));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Servidor backend funcionando!');
});

// Obtener todas las tareas
app.get('/api/tareas', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM tareas_generales');
    res.json(result.rows); // Enviar todas las tareas en formato JSON
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener las tareas');
  }
});

// Crear una nueva tarea
app.post('/api/tareas', async (req, res) => {
  const { titulo, descripcion, responsable_id, fecha_limite, prioridad, estado, proyecto_id } = req.body;

  try {
    const result = await client.query(
      'INSERT INTO tareas_generales (titulo, descripcion, responsable_id, fecha_limite, prioridad, estado, proyecto_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [titulo, descripcion, responsable_id, fecha_limite, prioridad, estado, proyecto_id]
    );
    res.status(201).json(result.rows[0]); // Devolver la tarea recién creada
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear la tarea');
  }
});

// Obtener un usuario por ID
app.get('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await client.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    res.json(result.rows[0]); // Devolver el usuario con el ID solicitado
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el usuario');
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
