import { Pool } from 'pg';

// Configuration de la connexion à PostgreSQL
const pool = new Pool({
    user: process.env.VITE_PG_USER,
    host: process.env.VITE_PG_HOST,
    database: process.env.VITE_PG_DATABASE,
    password: process.env.VITE_PG_PASSWORD,
    port: parseInt(process.env.VITE_PG_PORT || '5432'),
    ssl: process.env.VITE_PG_SSL === 'true' ? true : false
  });

// Fonction pour exécuter des requêtes
export const query = async (text: string, params?: any[]) => {
  try {
    const result = await pool.query(text, params);
    return {
      data: result.rows,
      error: null
    };
  } catch (error) {
    console.error('Erreur dans la requête :', error);
    return {
      data: null,
      error
    };
  }
};

// Pour la compatibilité avec le code existant utilisant Supabase
export default {
  from: (table: string) => ({
    select: async (columns = '*') => {
      try {
        const result = await pool.query(`SELECT ${columns} FROM ${table}`);
        return { data: result.rows, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    insert: async (values: any, options = { returning: 'representation' }) => {
      try {
        const keys = Object.keys(values);
        const valuesArray = Object.values(values);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

        let query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;

        if (options.returning) {
          query += ' RETURNING *';
        }

        const result = await pool.query(query, valuesArray);
        return { data: result.rows, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    update: async (values: any) => {
      try {
        // Implémentation simplifiée, à adapter selon vos besoins
        const entries = Object.entries(values);
        const setClause = entries
          .filter(([key]) => key !== 'id')
          .map(([key], i) => `${key} = $${i + 1}`)
          .join(', ');

        const valuesArray = entries
          .filter(([key]) => key !== 'id')
          .map(([_, value]) => value);

        const idValue = values.id;
        valuesArray.push(idValue);

        const query = `UPDATE ${table} SET ${setClause} WHERE id = $${valuesArray.length} RETURNING *`;

        const result = await pool.query(query, valuesArray);
        return { data: result.rows, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    delete: async (condition: { column: string, value: any }) => {
      try {
        const query = `DELETE FROM ${table} WHERE ${condition.column} = $1 RETURNING *`;
        const result = await pool.query(query, [condition.value]);
        return { data: result.rows, error: null };
      } catch (error) {
        return { data: null, error };
      }
    }
  })
};
