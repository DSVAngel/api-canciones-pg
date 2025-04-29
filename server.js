require('dotenv').config();
const app = require('./app');
const { postgresConnection, testPostgresConnection } = require('./config/database');

const PORT = process.env.PORT || 8081;

const startServer = async () => {
    try {
        const postgresConnected = await testPostgresConnection();

        if (!postgresConnected) {
            console.error('No se pudo conectar a ninguna base de datos. Verifique la configuración.');
            process.exit(1);
        }

        if (postgresConnected) {
            await postgresConnection.sync();
            console.log('Modelos de PostgreSQL sincronizados correctamente');
        }

        app.listen(PORT, () => {
            console.log(`Servidor iniciado en el puerto ${PORT}`);
            console.log(`- API PostgreSQL: ${postgresConnected ? 'Disponible' : 'No disponible'}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();