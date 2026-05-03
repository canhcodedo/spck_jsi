const { MongoClient, ObjectId } = require("mongodb");

async function read(collectionName) {
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(process.env.CONNECT_MONGODB_URL);
    try {
        await client.connect();

        const database = client.db(process.env.MONGODB_DATABASE_NAME);
        const collection = database.collection(collectionName); 

        const items = await collection.find({}).toArray();

        return items;
    } catch (error) {
        return [];
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

async function search(collectionName, field, value) {
    const client = new MongoClient(process.env.CONNECT_MONGODB_URL);
    try {
        await client.connect();

        const database = client.db(process.env.MONGODB_DATABASE_NAME);

        const items = await database.collection(collectionName).find({
            [field]: { $regex: value, $options: "i" }
        }).toArray();

        console.log(items);

        return items;
    } catch (error) {
        console.error("Search error:", error);
        return [];
    } finally {
        await client.close();
    }
}

async function create(collectionName, document) {
    const client = new MongoClient(process.env.CONNECT_MONGODB_URL);
    try {
        await client.connect();

        const database = client.db(process.env.MONGODB_DATABASE_NAME);
        
        console.log(document, "on server");

        const result = await database.collection(collectionName).insertOne(document);

        console.log(result);

        return result;
    } catch (error) {
        console.error("Insert error:", error);
        return [];
    } finally {
        await client.close();
    }
}


async function update(collectionName, document) {
    const client = new MongoClient(process.env.CONNECT_MONGODB_URL);
    try {
        await client.connect();

        const database = client.db(process.env.MONGODB_DATABASE_NAME);

        const result = await database.collection(collectionName).updateOne(
            { _id: new ObjectId(document.id) },
            { $set: document }
        );

        console.log(result);

        return result;
    } catch (error) {
        console.error("Update error:", error);
        return [];
    } finally {
        await client.close();
    }
}

async function remove(collectionName, documentId) {
    const client = new MongoClient(process.env.CONNECT_MONGODB_URL);
    try {   
        await client.connect();

        const database = client.db(process.env.MONGODB_DATABASE_NAME);


        console.log("Removing document with ID:", documentId);

        const result = await database.collection(collectionName).deleteOne({ _id: new ObjectId(documentId) });

        console.log(result);

        return result;
    } catch (error) {
        console.error("Remove error:", error);
        return [];
    } finally {
        await client.close();
    }
}

module.exports = { read, search, create, update, remove };
