const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Product = require("../models/Product");
const { verifyAdmin } = require("../utils/auth");

/* ===============================
   GET ALL PRODUCTS (SAFE)
================================ */
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

    const products = await Product.find(filter);
    res.json(products);
  } catch (e) {
    console.error("❌ PRODUCTS FETCH ERROR:", e);
    res.status(500).json({
      message: "Failed to fetch products",
      error: e.message,
    });
  }
});

/* ===============================
   PURCHASE (MUST BE BEFORE :id)
================================ */
router.post("/purchase", async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "No items to purchase" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const item of items) {
      const product = await Product.findById(item._id).session(session);

      if (!product) {
        throw new Error(`Product ${item._id} not found`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      product.stock -= item.quantity;
      await product.save({ session });
    }

    await session.commitTransaction();
    session.endSession();
    res.json({ success: true, message: "Purchase successful" });
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ PURCHASE ERROR:", e);
    res.status(400).json({ error: "Purchase failed", details: e.message });
  }
});

/* ===============================
   GET PRODUCT BY ID
================================ */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (e) {
    console.error("❌ PRODUCT BY ID ERROR:", e);
    res.status(500).json({
      message: "Invalid product id",
      error: e.message,
    });
  }
});

/* ===============================
   ADMIN ROUTES
================================ */
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (e) {
    res.status(400).json({ error: "Invalid data", details: e.message });
  }
});

router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (e) {
    res.status(400).json({ error: "Invalid data", details: e.message });
  }
});

router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: "Delete failed", details: e.message });
  }
});

module.exports = router;
