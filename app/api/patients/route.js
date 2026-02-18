import { NextResponse } from 'next/server';
import { getConnection } from '../../../lib/db';

export async function GET() {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query('SELECT * FROM patients ORDER BY id DESC');
    await conn.end();
    return NextResponse.json(rows); // must return JSON
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const conn = await getConnection();

    const { name, age, gender, address, dob, contact, email, status } = data;

    const [result] = await conn.query(
      'INSERT INTO patients (name, age, gender, address, dob, contact, email, status, last_visit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE())',
      [name, age, gender, address, dob, contact, email, status]
    );

    await conn.end();

    // Fetch inserted patient including patient_code
    const conn2 = await getConnection();
    const [rows] = await conn2.query('SELECT * FROM patients WHERE id = ?', [result.insertId]);
    await conn2.end();

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add patient' }, { status: 500 });
  }
}
