const fs = require('fs');
const path = require('path');

const createCancionController = (Cancion) => {
    return {
        createCancion: async (req, res) => {
            try {
                const { nombre, artistas, fecha, album } = req.body;

                if (!nombre || !artistas || !fecha) {
                    return res.status(400).json({ error: 'Nombre, artistas y fecha son campos obligatorios' });
                }

                let artistasArray;
                try {
                    artistasArray = typeof artistas === 'string' ? JSON.parse(artistas) : artistas;
                } catch (e) {
                    artistasArray = [artistas];
                }

                const nuevaCancion = {
                    nombre,
                    artistas: artistasArray,
                    fecha,
                    album: album || null
                };
                if (req.file) {
                    nuevaCancion.caratula = req.file.path;
                }
                const cancion = await Cancion.create(nuevaCancion);
                res.status(201).json(cancion);
            } catch (error) {
                console.error('Error al crear canción:', error);
                res.status(500).json({ error: 'Error al crear la canción' });
            }
        },

        getAllCanciones: async (req, res) => {
            try {
                const canciones = await Cancion.findAll();
                res.status(200).json(canciones);
            } catch (error) {
                console.error('Error al obtener canciones:', error);
                res.status(500).json({ error: 'Error al obtener las canciones' });
            }
        },

        getCancionById: async (req, res) => {
            try {
                const { id } = req.params;
                const cancion = await Cancion.findByPk(id);

                if (!cancion) {
                    return res.status(404).json({ error: 'Canción no encontrada' });
                }
                res.status(200).json(cancion);
            } catch (error) {
                console.error('Error al obtener canción por ID:', error);
                res.status(500).json({ error: 'Error al obtener la canción' });
            }
        },

        updateCancion: async (req, res) => {
            try {
                const { id } = req.params;
                const { nombre, artistas, fecha, album } = req.body;

                const cancion = await Cancion.findByPk(id);

                if (!cancion) {
                    return res.status(404).json({ error: 'Canción no encontrada' });
                }
                let artistasArray;
                if (artistas) {
                    try {
                        artistasArray = typeof artistas === 'string' ? JSON.parse(artistas) : artistas;
                    } catch (e) {
                        artistasArray = [artistas];
                    }
                }

                const datosActualizados = {
                    nombre: nombre || cancion.nombre,
                    artistas: artistasArray || cancion.artistas,
                    fecha: fecha || cancion.fecha,
                    album: album !== undefined ? album : cancion.album
                };
                if (req.file) {
                    if (cancion.caratula) {
                        try {
                            fs.unlinkSync(cancion.caratula);
                        } catch (err) {
                            console.error('Error al eliminar archivo:', err);
                        }
                    }
                    datosActualizados.caratula = req.file.path;
                }
                await cancion.update(datosActualizados);
                const cancionActualizada = await Cancion.findByPk(id);
                res.status(200).json(cancionActualizada);
            } catch (error) {
                console.error('Error al actualizar canción:', error);
                res.status(500).json({ error: 'Error al actualizar la canción' });
            }
        },

        deleteCancion: async (req, res) => {
            try {
                const { id } = req.params;
                const cancion = await Cancion.findByPk(id);
                if (!cancion) {
                    return res.status(404).json({ error: 'Canción no encontrada' });
                }
                if (cancion.caratula) {
                    try {
                        fs.unlinkSync(cancion.caratula);
                    } catch (err) {
                        console.error('Error al eliminar archivo:', err);
                    }
                }
                await cancion.destroy();
                res.status(200).json({ message: 'Canción eliminada correctamente' });
            } catch (error) {
                console.error('Error al eliminar canción:', error);
                res.status(500).json({ error: 'Error al eliminar la canción' });
            }
        }
    };
};

module.exports = createCancionController;