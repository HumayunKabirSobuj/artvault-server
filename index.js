const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://artvault404.netlify.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.DB_URI;
 
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    
    const database = client.db("ArtVault");

    const usersCollection = database.collection("UsersCollection");
    const ProductCollection = database.collection("ProductsCollection");

  
    
  
    app.post("/users", async (req, res) => {
      const userInfo = req.body;
      console.log(userInfo);
      const result = await usersCollection.insertOne(userInfo);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });


    app.post("/products", async (req, res) => {
      const productInfo = req.body;
      // console.log(productInfo);
      const result = await ProductCollection.insertOne(productInfo);
      res.send(result);
    })

    app.get("/products", async (req, res) => {
      const result = await ProductCollection.find().toArray();
      res.send(result);
    })

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ProductCollection.findOne(query);
      res.send(result);
    });

    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const product = req.body;
      console.log(product)
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status:"Active"
        },
      };
      const result = await ProductCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })

    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });


    app.delete("/userdelete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("ArtVault server is running");
});

app.listen(port, () => {
  console.log(`ArtVault server running on port ${port}`);
});
