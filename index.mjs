import express from 'express';
import { Client } from 'pg';

const {
    PGHOST = 'localhost',
    PGPORT = '5432',
    PGUSER = 'postgres',
    PGPASSWORD = 'postgres',
    PGDATABASE = 'test',
    PORT = '3000'
} = process.env;

const dbClient = new Client({
    host:     PGHOST,
    port:     PGPORT,
    user:     PGUSER,
    password: PGPASSWORD,
    database: PGDATABASE
});

async function init() {
    try {
        await dbClient.connect();
        console.log('✅ Connected to Postgres');
    } catch (err) {
        console.error('❌ Postgres connection failed:', err.message);
        process.exit(1);
    }

    const app = express();

    app.get('/health', async (req, res) => {
        try {
            await dbClient.query('SELECT 1');
            res.json({ status: 'ok' });
        } catch (err) {
            res.status(500).json({ status: 'error', error: err.message });
        }
    });

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

init();
