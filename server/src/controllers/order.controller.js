const Order = require("../models/Order"); // Assuming path to Order model
const OrderItem = require("../models/OrderItem"); // Assuming path to OrderItem model
const Product = require("../models/Product"); // Assuming path to Product model
const Address = require("../models/Address"); // Assuming path to Address model
const User = require("../models/User"); // Assuming path to User model
const mongoose = require("mongoose");
const Cart = require('../models/Cart');
const Offer = require('../models/Offer');
// Check stock availability based on userId
exports.checkStockAvailability = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty or not found." });
    }

    for (const item of cart.items) {
      const product = item.productId;
      if (!product || (product.stock || 0) < item.quantity) {
        return res.status(400).json({
          message: `${product.productName}'s ${item.quantity} quantity is not available in stock.`,
        });
      }
    }

    res.status(200).json({ message: "All products are available in sufficient quantity." });

  } catch (error) {
    console.error("Stock check error:", error);
    res.status(500).json({ message: "Server error while checking stock." });
  }
};

const isActive = (start, end) => {
  const now = new Date();
  return new Date(start) <= now && now <= new Date(end);
};
exports.checkout = async (req, res) => {
  const { userId, addressId, promoCodeId,razorpayOrderId ,razorpayPaymentId} = req.body;

  try {
    // 1. Get cart by userId
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty or not found." });
    }

    // 2. Calculate subtotal
    let subtotal = 0;
    cart.items.forEach(item => {
      subtotal += (item.productId.salePrice-item.productId.salePrice*item.productId.discount/100) * item.quantity;
    });

    // 3. Get offer and apply discount if applicable
    let discountAmount = 0;
    let discountPerProduct = {};
    if (promoCodeId) {
      const offer = await Offer.findById(promoCodeId);
      if (!offer || !isActive(offer.startDate, offer.endDate)) {
        return res.status(400).json({ message: "Invalid or inactive promo code." });
      }

      if (subtotal >= offer.minimumOrder) {
        const rawDiscount = subtotal * (offer.discount / 100);
        discountAmount = Math.min(rawDiscount, offer.maxDiscount);

        // Distribute discount proportionally
        let totalBase = subtotal;
        cart.items.forEach(item => {
          const productTotal = (item.productId.salePrice - item.productId.salePrice * item.productId.discount / 100) * item.quantity;
          const productDiscount = (productTotal / totalBase) * discountAmount;
          discountPerProduct[item.productId._id.toString()] = productDiscount;
        });
      }
    }

    // 4. Create order
    const shippingCharge = 50;
    const totalAmount = subtotal - discountAmount + shippingCharge;

    const newOrder = new Order({
      userId,
      delAddressId: addressId,
      orderDate: new Date(),
      orderStatus: "Pending",
      shippingCharge,
      total: totalAmount,
      paymentMode: "Online",
      paymentStatus: "Completed",
      razorpayOrderId:razorpayOrderId,
      razorpayPaymentId:razorpayPaymentId,
      offerId: promoCodeId,
    });

    const savedOrder = await newOrder.save();

    // 5. Create OrderItems
    const orderItems = cart.items.map(item => {
      const productId = item.productId._id;
      const quantity = item.quantity;
      const price = (item.productId.salePrice-item.productId.salePrice*item.productId.discount/100);
      const discount = discountPerProduct[productId.toString()] || 0;

      return {
        orderId: savedOrder._id,
        productId,
        quantity,
        price,
        discount,
      };
    });

    await OrderItem.insertMany(orderItems);
for (const item of cart.items) {
      const product = item.productId;
      product.stock = Math.max(0, (product.stock || 0) - item.quantity);
      await product.save();
    }
    // Optional: Clear cart after checkout
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Checkout completed successfully.",
      order: savedOrder,
    });

  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ message: "Server error during checkout." });
  }
};

// userid, addressId, promocodeId
// Add a new order with multiple products
exports.addOrder = async (req, res) => {
  const { userId, orderDate, orderStatus, delAddressId, shippingCharge, products, paymentMode } = req.body;

  try {
    // Validate if products are provided
    if (!products || products.length === 0) {
      return res.status(400).json({ message: "At least one product is required." });
    }

    // Calculate the total order price
    let totalAmount = 0;
    for (let product of products) {
      const { productId, quantity } = product;
      const foundProduct = await Product.findById(productId);

      if (!foundProduct) {
        return res.status(400).json({ message: `Product with id ${productId} not found.` });
      }

      totalAmount += (foundProduct.salePrice - (foundProduct.salePrice * foundProduct.discount/100))  * quantity;
    }

    // Create the order
    const newOrder = new Order({
      userId,
      orderDate,
      orderStatus: orderStatus || "Pending",
      delAddressId,
      shippingCharge,
      total: totalAmount + parseFloat(shippingCharge),
      paymentMode: paymentMode || "Cash on Delivery",
      paymentStatus: "Pending",
    });

    // Save the order
    const savedOrder = await newOrder.save();
    console.log(products);
    // Create order items for each product
    const orderItems = await Promise.all(
    products.map(async (product) => {
        const foundProduct = await Product.findById(product.productId);
        return {
        orderId: savedOrder._id,
        productId: product.productId,
        quantity: product.quantity,
        price: foundProduct.salePrice,
        };
    })
    );

    // Save order items
    await OrderItem.insertMany(orderItems);

    res.status(201).json({
      message: "Order created successfully.",
      order: savedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.updateOrder = async (req, res) => {
  const { userId, orderDate, orderStatus, delAddressId, shippingCharge, products, paymentMode } = req.body;
  const { orderId } = req.params;

  try {
    // Validate order existence
    const existingOrder = await Order.findById(orderId);
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Validate products
    if (!products || products.length === 0) {
      return res.status(400).json({ message: "At least one product is required." });
    }

    // Calculate new total amount
    let totalAmount = 0;
    for (let product of products) {
      const { productId, quantity } = product;
      const foundProduct = await Product.findById(productId);
      if (!foundProduct) {
        return res.status(400).json({ message: `Product with id ${productId} not found.` });
      }

      totalAmount += (foundProduct.salePrice - (foundProduct.salePrice * foundProduct.discount / 100)) * quantity;
    }

    // Update order details
    existingOrder.userId = userId;
    existingOrder.orderDate = orderDate;
    existingOrder.orderStatus = orderStatus || existingOrder.orderStatus;
    existingOrder.delAddressId = delAddressId;
    existingOrder.shippingCharge = shippingCharge;
    existingOrder.total = totalAmount + parseFloat(shippingCharge);
    existingOrder.paymentMode = paymentMode || existingOrder.paymentMode;

    const updatedOrder = await existingOrder.save();

    // Delete old order items
    await OrderItem.deleteMany({ orderId });

    // Create new order items
    const orderItems = await Promise.all(
      products.map(async (product) => {
        const foundProduct = await Product.findById(product.productId);
        return {
          orderId: updatedOrder._id,
          productId: product.productId,
          quantity: product.quantity,
          price: foundProduct.salePrice,
          discount: foundProduct.discount || 0,
        };
      })
    );

    await OrderItem.insertMany(orderItems);

    res.status(200).json({
      message: "Order updated successfully.",
      order: updatedOrder,
    });

  } catch (error) {
    console.error("Update Order Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch multiple orders (supporting filtering by deleted status)
exports.getOrders = async (req, res) => {
  const { includeDeleted = "false" } = req.query; // Exclude deleted orders by default
  const deletedFilter = includeDeleted === "true" ? {} : { isDeleted: false };

  try {
    const orders = await Order.find(deletedFilter)
      .populate("userId", "name email") // Populate user info if needed
      .populate("delAddressId", "street city state zipCode") // Populate address info if needed
      .populate({
        path: "products",
        populate: {
          path: "productId",
          select: "name price",
        },
      })
      .exec();

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark an order as deleted (soft delete)
exports.markOrderAsDeleted = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    order.isDeleted = true;
    await order.save();

    res.status(200).json({ message: "Order marked as deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch only non-deleted orders
exports.getActiveOrders = async (req, res) => {
  try {
    const activeOrders = await Order.find({ isDeleted: false })
      .populate("userId")
      .populate("delAddressId", "street city state zipCode")
      .exec();

    res.status(200).json({ orders: activeOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch a single order by ID (include products and address)
exports.getOrderById = async (req, res) => {
    const { orderId } = req.params;
  
    try {
      // Fetch the order and populate necessary fields
      const order = await Order.findById(orderId)
        .populate("userId")  // Populate user details (including name, email, etc.)
        .populate("delAddressId")  // Populate delivery address (including street, city, state, etc.)
        .populate("offerId")  // Offer applied to the order
        .exec();
  
      // If the order is not found, return 404
      if (!order) {
        return res.status(404).json({ message: "Order not found." });
      }
  
      // Fetch all OrderItems related to this order and populate productId for each item
      const orderItems = await OrderItem.find({ orderId: orderId })
        .populate("productId","productName productImage") 
        .select("-orderId -_id") // Populate product details (including name, price, salePrice, etc.)
        .exec();
  
      // Check if no order items are found
      if (!orderItems || orderItems.length === 0) {
        return res.status(404).json({ message: "No order items found." });
      }
  
      // Return the populated order with all related data
      res.status(200).json({ order,orderItems });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  
exports.hasUserPurchasedProduct = async (req, res) => {
    const { userId, productId } = req.params;
  
    try {
      // Step 1: Find all non-deleted orders by the user
      const userOrders = await Order.find({ userId, isDeleted: false }).select("_id");
  
      const orderIds = userOrders.map(order => order._id);
  
      if (orderIds.length === 0) {
        return res.status(200).json({ purchased: false });
      }
  
      // Step 2: Check if any order items match the productId and belong to those orders
      const orderItem = await OrderItem.findOne({
        orderId: { $in: orderIds },
        productId: productId,
      });
  
      const hasPurchased = !!orderItem;
  
      res.status(200).json({ purchased: hasPurchased });
    } catch (error) {
      console.error("Error checking product purchase:", error);
      res.status(500).json({ message: "Server error" });
    }
};

exports.getOrdersByUserId = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const orders = await Order.find({ userId, isDeleted: false })
        .populate("delAddressId")
        .sort({ orderDate: -1 });
  
      res.status(200).json({ orders });
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  