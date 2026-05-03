const express = require("express");

const { read, search, remove, create, update } = require("../utils/atlas-mongodb.js");
const router = express.Router()

router.get("/", async (req, res) => {
    const products = await read("products");
    res.json(products);
})

router.get("/search", async (req, res) => {
    const { keyword } = req.query;
    const products = await search("products", "title", keyword);
    res.json(products);
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const result = await remove("products", id);
    res.json(result);
})

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, price, description, image } = req.body;
    const result = await update("products", { id, title, price, description, image });
    res.json(result);
})

router.post("/", async (req, res) => {
    const { title, price, description, image } = req.body;

    console.log(req, "req on client");
    console.log({ title, price, description, image }, "fields of body on client");


    const result = await create("products", { title, price, description, image });
    res.json(result);
})

module.exports = router;