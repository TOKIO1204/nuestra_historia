import { neon } from '@neondatabase/serverless';


const sql = neon(process.env.DATABASE_URL);

async function init() {
  try {
    console.log('Creando tabla memories...');
    await sql`
      CREATE TABLE IF NOT EXISTS memories (
        id SERIAL PRIMARY KEY,
        image_url TEXT NOT NULL,
        date TEXT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        accent TEXT DEFAULT '#fed7aa',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Tabla memories creada correctamente.');
  } catch (error) {
    console.error('Error creando tabla:', error);
  }
}

init();
