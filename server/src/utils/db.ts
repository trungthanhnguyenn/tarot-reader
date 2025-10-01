import sqlite3 from 'sqlite3';
import path from 'path';
import { DatabaseReading } from '../types';

const DB_PATH = path.join(__dirname, '../../tarot.db');

class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('Connected to SQLite database');
        this.initTables();
      }
    });
  }

  private initTables(): void {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS readings (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        dob TEXT NOT NULL,
        date TEXT NOT NULL,
        cards TEXT NOT NULL,
        reading TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(createTableQuery, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Database table initialized');
      }
    });
  }

  public async getReading(id: string): Promise<DatabaseReading | null> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM readings WHERE id = ?';
      this.db.get(query, [id], (err, row: DatabaseReading) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  public async saveReading(reading: DatabaseReading): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO readings (id, name, dob, date, cards, reading)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      this.db.run(
        query,
        [reading.id, reading.name, reading.dob, reading.date, reading.cards, reading.reading],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  public close(): void {
    this.db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed');
      }
    });
  }
}

export default Database;
