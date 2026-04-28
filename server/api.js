const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ========== CONEXIÓN ==========
async function conectarDB() {
  try {
    console.log("Conectando a MongoDB...");
    
    await mongoose.connect("mongodb://so411240_db_user:root@ac-836xpua-shard-00-00.wyi6cke.mongodb.net:27017,ac-836xpua-shard-00-01.wyi6cke.mongodb.net:27017,ac-836xpua-shard-00-02.wyi6cke.mongodb.net:27017/?ssl=true&replicaSet=atlas-j0w302-shard-0&authSource=admin&appName=Cluster0");

    console.log("Conectado a MongoDB");
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
    process.exit(1);
  }
}

conectarDB();

// ========== MODELO ==========
const juegoSchema = new mongoose.Schema({
  juego: { type: String, required: true },
  sistema: { type: String, required: true },
  emulador: { type: String, required: true },
  dispositivo: { type: String, required: true },
  rendimiento: { type: String, required: true }
}, { timestamps: true });

const Juego = mongoose.model('Juego', juegoSchema);

// ========== ENDPOINTS ==========

// GET - Obtener todos los juegos
app.get('/api/juegos', async (req, res) => {
  try {
    const juegos = await Juego.find({});
    res.json(juegos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Crear juego
app.post('/api/juegos', async (req, res) => {
  try {
    const { juego, sistema, emulador, dispositivo, rendimiento } = req.body;

    if (!juego || !sistema || !emulador || !dispositivo || !rendimiento) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const nuevoJuego = new Juego({ juego, sistema, emulador, dispositivo, rendimiento });
    await nuevoJuego.save();

    res.status(201).json(nuevoJuego);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT - Actualizar juego
app.put('/api/juegos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { juego, sistema, emulador, dispositivo, rendimiento } = req.body;

    const juegoActualizado = await Juego.findByIdAndUpdate(
      id,
      { juego, sistema, emulador, dispositivo, rendimiento },
      { new: true, runValidators: true }
    );

    if (!juegoActualizado) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }

    res.json(juegoActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Eliminar juego
app.delete('/api/juegos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const juegoEliminado = await Juego.findByIdAndDelete(id);

    if (!juegoEliminado) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }

    res.json({ message: 'Juego eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// HOME
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


// ============ LIKES ===========

const likeSchema = new mongoose.Schema({
  consola: { type: String, required: true, unique: true },
  likes: { type: Number, default: 0 }
});

const Like = mongoose.model('Like', likeSchema);

app.post('/api/likes/:consola', async (req, res) => {
  try {
    const { consola } = req.params;

    let like = await Like.findOne({ consola });

    if (!like) {
      like = new Like({ consola, likes: 1 });
    } else {
      like.likes++;
    }

    await like.save();

    res.json(like);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/likes', async (req, res) => {
  try {
    const likes = await Like.find({});
    res.json(likes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// =================== FORMULARIO =================
const contactoSchema = new mongoose.Schema({
  nombre: String,
  telefono: String,
  correo: String,
  nivel: String,
  comentario: String,
  experiencia: String,
  promo: Boolean,
  juegosSugeridos: [String]
}, { timestamps: true });

const Contacto = mongoose.model('Contacto', contactoSchema);
app.post('/api/contacto', async (req, res) => {
    try {
      const {
        nombre,
        telefono,
        correo,
        nivel,
        comentario,
        experiencia,
        promo,
        juegosSugeridos
      } = req.body;

      const nuevo = new Contacto({
        nombre,
        telefono,
        correo,
        nivel,
        comentario,
        experiencia,
        promo,
        juegosSugeridos
      });

      await nuevo.save();

      res.status(201).json({ message: "Formulario guardado" });

    } catch (error) {
      console.error("ERROR REAL:", error);
      document.getElementById("mensaje").textContent = "Error al enviar";
    }
  }
);

app.get('/api/contacto', async (req, res) => {
  const datos = await Contacto.find();
  res.json(datos);
});