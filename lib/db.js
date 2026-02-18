import mysql from 'mysql2/promise';

export async function getConnection() {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',       // your MySQL username
    password: '',       // your MySQL password
    database: 'db_visioncare',
  });
}
