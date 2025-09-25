const Response = require("../models/Response");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
exports.createResponse = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const newResponse = new Response({ name, email, phone, message });
    await newResponse.save();
    res.status(201).json(newResponse);
  } catch (error) {
    res.status(500).json({ message: "Error creating response", error: error.message });
  }
};

exports.getAllResponses = async (req, res) => {
  try {
    const responses = await Response.find().sort({ createdAt: -1 });
    res.status(200).json(responses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching responses", error: error.message });
  }
};

exports.getResponseById = async (req, res) => {
  try {
    const response = await Response.findById(req.params.id);
    if (!response) {
      return res.status(404).json({ message: "Response not found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error fetching response", error: error.message });
  }
};

exports.updateReply = async (req, res) => {
  try {
    const { reply } = req.body;
    const response = await Response.findByIdAndUpdate(
      req.params.id,
      { reply },
      { new: true, runValidators: true }
    );
    if (!response) {
      return res.status(404).json({ message: "Response not found" });
    }
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: response.email,
      subject: "Response to your query",
      text: `Hi ${response.name},\n\nYour Query: ${response.message}\nReply: ${reply}`
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error updating reply", error: error.message });
  }
};

exports.deleteResponse = async (req, res) => {
  try {
    const response = await Response.findByIdAndDelete(req.params.id);
    if (!response) {
      return res.status(404).json({ message: "Response not found" });
    }
    res.status(200).json({ message: "Response deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting response", error: error.message });
  }
};
