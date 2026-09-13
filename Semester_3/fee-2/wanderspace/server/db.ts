import fs from "node:fs/promises";
import path from "node:path";
import mysql, { ResultSetHeader, RowDataPacket } from "mysql2/promise";

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
});

export async function initDatabase(): Promise<void> {
    await runSqlFile("schema.sql");

    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT COUNT(*) AS count FROM listings",
    );
    const listingCount = Number(rows[0]?.count ?? 0);

    if (listingCount === 0) {
        await seedDatabase();
    }
}

export async function seedDatabase(): Promise<void> {
    await runSqlFile("seeds.sql");
}

async function runSqlFile(fileName: string): Promise<void> {
    const filePath = path.join(process.cwd(), fileName);
    const sql = await fs.readFile(filePath, "utf8");
    await pool.query(sql);
}

export async function query<T extends RowDataPacket = RowDataPacket>(
    sql: string,
    params: unknown[] = [],
): Promise<T[]> {
    const [rows] = await pool.query<T[]>(sql, params);
    return rows;
}

export async function queryOne<T extends RowDataPacket = RowDataPacket>(
    sql: string,
    params: unknown[] = [],
): Promise<T | null> {
    const rows = await query<T>(sql, params);
    return rows[0] ?? null;
}

export async function run(
    sql: string,
    params: any[] = [],
): Promise<ResultSetHeader> {
    const [result] = await pool.execute<ResultSetHeader>(sql, params);
    return result;
}
