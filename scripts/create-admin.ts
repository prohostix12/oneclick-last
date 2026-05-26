import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';
import { join } from 'path';

// Read .env file manually
const envPath = join(process.cwd(), '.env');
const envContent = readFileSync(envPath, 'utf-8');
const envLines = envContent.split('\n');
let uri = '';

for (const line of envLines) {
    if (line.startsWith('DATABASE_URL=')) {
        // Extract the value and remove quotes
        const value = line.substring('DATABASE_URL='.length).trim();
        uri = value.replace(/^["']|["']$/g, '');
        break;
    }
}

async function createAdminUser() {
    if (!uri) {
        console.error('DATABASE_URL is not set in .env file');
        process.exit(1);
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('advertisement');
        const collection = db.collection('admin_users');

        // Check if admin user already exists
        const existingAdmin = await collection.findOne({ email: 'admin@oneclickadv.ae' });

        if (existingAdmin) {
            console.log('Admin user already exists!');
            console.log('Email:', existingAdmin.email);
            return;
        }

        // Create admin user
        const adminUser = {
            email: 'admin@oneclickadv.ae',
            password: 'admin123', // In production, use hashed passwords!
            name: 'Admin',
            role: 'admin',
            createdAt: new Date()
        };

        const result = await collection.insertOne(adminUser);
        console.log('✅ Admin user created successfully!');
        console.log('Email: admin@oneclickadv.ae');
        console.log('Password: admin123');
        console.log('User ID:', result.insertedId);

    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}

createAdminUser();
