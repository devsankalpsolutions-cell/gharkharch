import { NextResponse } from 'next/server';
import { query, testConnection } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const status = await testConnection();
  if (!status.success) {
    return NextResponse.json({
      success: false,
      message: status.message,
      hint: 'Please check your MySQL host, port, user, password, and database in .env.local',
    }, { status: 500 });
  }

  try {
    const schemaPath = path.join(process.cwd(), 'lib', 'schema.sql');
    const sqlContent = fs.readFileSync(schemaPath, 'utf8');

    // Split SQL statements by semicolon and execute
    const statements = sqlContent
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      await query(statement);
    }

    return NextResponse.json({
      success: true,
      message: 'Database schema successfully initialized! All tables verified/created.',
    });
  } catch (error: any) {
    console.error('Failed to initialize database schema:', error);
    return NextResponse.json({
      success: false,
      message: 'Error executing DB schema SQL statements',
      error: error?.message || String(error),
    }, { status: 500 });
  }
}
