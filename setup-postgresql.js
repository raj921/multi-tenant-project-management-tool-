#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                    PostgreSQL Setup for Project Management                    ║
╚══════════════════════════════════════════════════════════════════════════════╝

This script will help you set up your PostgreSQL database connection.

Please provide your PostgreSQL connection string in the following format:
postgresql://username:password@localhost:5432/your_database_name

If you're using a cloud provider, make sure to include all required parameters.
`);

rl.question('Enter your PostgreSQL connection string: ', (url) => {
  updateEnvFile(url);
});


function updateEnvFile(connectionString) {
  if (!connectionString.trim()) {
    console.log('Error: Connection string cannot be empty.');
    rl.close();
    process.exit(1);
  }
  
  // Validate connection string format
  if (!connectionString.startsWith('postgresql://')) {
    console.log('Error: Connection string must start with "postgresql://"');
    rl.close();
    process.exit(1);
  }
  
  const envPath = path.join(__dirname, '.env');
  
  // Read current .env file
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Replace DATABASE_URL line
  const lines = envContent.split('\n');
  const newLines = lines.map(line => {
    if (line.startsWith('DATABASE_URL=')) {
      return `DATABASE_URL="${connectionString}"`;
    }
    return line;
  });
  
  // Write back to .env file
  fs.writeFileSync(envPath, newLines.join('\n'));
  
  console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                          PostgreSQL Setup Complete!                          ║
╚══════════════════════════════════════════════════════════════════════════════╝

Your PostgreSQL connection has been configured successfully!

Next steps:
1. Run: npm run db:push
2. Run: npm run db:generate
3. Run: npm run db:seed

This will create the database schema and populate it with sample data.
`);
  
  rl.close();
}.close();
}
