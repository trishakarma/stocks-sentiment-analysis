import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export async function connectSingleStore(
  config: Partial<mysql.ConnectionOptions> = {}
) {
  const baseConfig: mysql.ConnectionOptions = {
    host: process.env.HOST,
    port: Number(process.env.DB_PORT),
    password: process.env.PASSWORD,
    user: "admin",
    database: "sentiments"
  };

  return await mysql.createConnection({
    ...baseConfig,
    ...config,
  });
}

export async function stopSingleStore(conn: mysql.Connection) {
  await conn.end();
}

export async function readData({
  conn,
  database,
  symbol
}: {
  conn?: mysql.Connection;
  database: string;
  symbol: string;
}) {
  try {
    let closeConn = false;
    if (!conn) {
      conn = await connectSingleStore({ database });
      closeConn = true;
    }

    const [rows] = await conn.execute(
      `SELECT text, sentiment FROM tweets
       WHERE text LIKE ? OR text LIKE ? OR text LIKE ?
       ORDER BY RAND() LIMIT 1`,
      [`%${symbol}%`, `%${symbol.toLowerCase()}%`, `%$${symbol}%`]
    ) as [any[], any];

    if (closeConn) {
      await stopSingleStore(conn);
    }

    return rows[0]?.text || 'No similar tweets found';
  } catch (error) {
    console.error('Database error:', error);
    return 'Error retrieving sentiment data';
  }
}

export async function readDataWithEmbedding({
  conn,
  database,
  embedding
}: {
  conn?: mysql.Connection;
  database: string;
  embedding: number[];
}) {
  try {
    let closeConn = false;
    if (!conn) {
      conn = await connectSingleStore({ database });
      closeConn = true;
    }

    const embeddingStr = embedding.join(',');
    const [rows] = await conn.execute(
      `SELECT text, sentiment, DOT_PRODUCT(embedding, JSON_ARRAY_PACK('[${embeddingStr}]')) AS similarity
       FROM tweets ORDER BY similarity DESC LIMIT 1`
    ) as [any[], any];

    if (closeConn) {
      await stopSingleStore(conn);
    }

    return rows[0]?.text || 'No similar tweets found';
  } catch (error) {
    console.error('Database error:', error);
    return 'Error retrieving sentiment data';
  }
}