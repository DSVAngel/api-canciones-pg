require('dotenv').config();
const Sequelize = require('sequelize');

const postgresConnection = new Sequelize(
    process.env.PG_DATABASE,
    process.env.PG_USER,
    process.env.PG_PASSWORD,
    {
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        dialect: 'postgres',
        logging: false,
        define: {
            timestamps: true
        }
    }
);


const testPostgresConnection = async () => {
    try {
        await postgresConnection.authenticate();
        console.log('Conexión con PostgreSQL establecida correctamente.');
        return true;
    } catch (error) {
        console.error('Error al conectar con PostgreSQL:', error);
        return false;
    }
};

module.exports = {
    postgresConnection,
    testPostgresConnection
};