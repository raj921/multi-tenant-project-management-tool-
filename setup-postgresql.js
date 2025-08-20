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

This script will help you set up a PostgreSQL database for your project.

Choose one of the following options:

1. ElephantSQL (Free tier available)
2. Supabase (Free tier available)
3. Render (Free tier available)
4. Neon (Free tier available)
5. Enter custom PostgreSQL connection string
`);

rl.question('Enter your choice (1-5): ', (choice) => {
  let connectionString = '';
  
  switch (choice) {
    case '1':
      console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                              ElephantSQL Setup                               ║
╚══════════════════════════════════════════════════════════════════════════════╝

1. Go to https://www.elephantsql.com/
2. Sign up for a free account
3. Create a new database instance
4. Copy the connection string from the dashboard
5. Paste it below

The connection string should look like:
postgresql://user:password@host.db.elephantsql.com:5432/database
`);
      rl.question('Enter your ElephantSQL connection string: ', (url) => {
        updateEnvFile(url);
      });
      break;
      
    case '2':
      console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                                Supabase Setup                                ║
╚══════════════════════════════════════════════════════════════════════════════╝

1. Go to https://supabase.com/
2. Sign up for a free account
3. Create a new project
4. Go to Project Settings > Database
5. Copy the connection string
6. Paste it below

The connection string should look like:
postgresql://postgres.project.supabase.co:5432/postgres
`);
      rl.question('Enter your Supabase connection string: ', (url) => {
        updateEnvFile(url);
      });
      break;
      
    case '3':
      console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                                 Render Setup                                 ║
╚══════════════════════════════════════════════════════════════════════════════╝

1. Go to https://render.com/
2. Sign up for a free account
3. Create a new PostgreSQL database
4. Copy the connection string
5. Paste it below

The connection string should look like:
postgresql://user:password@host:port/database
`);
      rl.question('Enter your Render connection string: ', (url) => {
        updateEnvFile(url);
      });
      break;
      
    case '4':
      console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                                  Neon Setup                                  ║
╚══════════════════════════════════════════════════════════════════════════════╝

1. Go to https://neon.tech/
2. Sign up for a free account
3. Create a new project
4. Copy the connection string
5. Paste it below

The connection string should look like:
postgresql://user:password@host:port/database
`);
      rl.question('Enter your Neon connection string: ', (url) => {
        updateEnvFile(url);
      });
      break;
      
    case '5':
      rl.question('Enter your custom PostgreSQL connection string: ', (url) => {
        updateEnvFile(url);
      });
      break;
      
    default:
      console.log('Invalid choice. Please run the script again.');
      rl.close();
      process.exit(1);
  }
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
}