const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function main() {
    const uri = "mongodb+srv://LLMO_dbuser:Nihal%401998@llmos.a36fwpo.mongodb.net/llmo-optimizer?appName=LLMOs";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('llmo-optimizer');
        const users = database.collection('User');

        const email = 'admin@example.com';
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await users.updateOne(
            { email: email },
            {
                $set: {
                    email: email,
                    name: 'Admin User',
                    passwordHash: hashedPassword,
                    role: 'admin',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );

        console.log(`User upserted: ${result.upsertedId?._id || 'Updated existing user'}`);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
