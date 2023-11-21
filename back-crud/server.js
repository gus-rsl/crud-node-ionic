// server.js
const express = require('express');
const cors = require('cors');
const mssql = require('mssql');
require('dotenv').config();
const sql = require('mssql');


const app = express();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const PORT = process.env.PORT || 3000;

app.use(cors());

// Configurar la conexión a la base de datos
const dbConfig = {
    server: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    options: {
      encrypt: true,
      enableArithAbort: true,
      trustServerCertificate: true, // Agrega esta línea
    },
  };
  

// Conectar a SQL Server
mssql.connect(dbConfig, (err) => {
  if (err) {
    console.error('Error de conexión a SQL Server:', err);
  } else {
    console.log('Conectado a SQL Server');
  }
});

// Cerrar la conexión cuando el servidor se apague
process.on('SIGINT', () => {
    mssql.close();
    process.exit();
  });
  
  // Iniciar el servidor
  app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
  });


// -------------RUTAS DE PETICIONES CRUD---------------------------------------------------

app.use(express.json()); // Habilita el uso de JSON en las solicitudes

app.post('/crear', (req, res) => {
  const { nombre, edad, email } = req.body;

  const query = `
    INSERT INTO empleados (Nombre, Edad, Email)
    VALUES ('${nombre}', ${edad}, '${email}')
  `;

  executeQuery(query)
    .then(() => res.send('Registro creado exitosamente'))
    .catch((error) => res.status(500).send(`Error al crear el registro: ${error.message}`));
});

app.get('/usuarios', (req, res) => {
    const query = 'SELECT * FROM empleados';
  
    executeQuery(query)
      .then((result) => res.json(result.recordset))
      .catch((error) => res.status(500).send(`Error al obtener los usuarios: ${error.message}`));
  });

  app.get('/usuarios/email/:email', (req, res) => {
    const email = req.params.email;
  
    const query = `
      SELECT *
      FROM empleados
      WHERE Email = '${email}'
    `;
  
    executeQuery(query)
      .then((result) => {
        if (result.recordset.length > 0) {
          res.send(result.recordset[0]);
        } else {
          res.status(404).send('Usuario no encontrado');
        }
      })
      .catch((error) => res.status(500).send(`Error al buscar usuario: ${error.message}`));
  });

  app.put('/actualizar/:email', (req, res) => {
    const { nombre, edad, email } = req.body;
    const emailParam = req.params.email;
  
    const query = `
      UPDATE empleados
      SET Nombre = '${nombre}', Edad = ${edad}, Email = '${email}'
      WHERE Email = '${emailParam}'
    `;
  
    executeQuery(query)
      .then(() => res.json({ mensaje: `Registro con Email ${email} actualizado exitosamente` }))
      .catch((error) => res.status(500).json({ error: `Error al actualizar el registro: ${error.message}` }));
  });


  app.delete('/eliminar/:email', (req, res) => {
    const email = req.params.email;
  
    const query = `
      DELETE FROM empleados
      WHERE Email = '${email}'
    `;
  
    executeQuery(query)
      .then(() => res.send(`Registro con Email ${email} eliminado exitosamente`))
      .catch((error) => res.status(500).send(`Error al eliminar el registro: ${error.message}`));
  });


async function executeQuery(query) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request().query(query);
      return result;
    } catch (error) {
      throw error;
    }
  }