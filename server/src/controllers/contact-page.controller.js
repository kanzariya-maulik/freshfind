const ContactPage = require("../models/ContactPage");

const getContactPage = async (req, res) => {
  try {
    const contactPage = await ContactPage.findOne();
    if (!contactPage) {
      return res.status(200).json({});
    }
    res.status(200).json(contactPage);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateContactPage = async (req, res) => {
  const { contactEmail, contactNumber } = req.body;
  try {
    let contactPage = await ContactPage.findOne();
    if (!contactPage && (!contactEmail || !contactNumber)) {
      return res.status(400).json({ message: "No contact data provided" });
    }
    if (!contactPage) {
      contactPage = new ContactPage({ contactEmail, contactNumber });
    } else {
      if (contactEmail) contactPage.contactEmail = contactEmail;
      if (contactNumber) contactPage.contactNumber = contactNumber;
    }
    await contactPage.save();
    res.status(200).json(contactPage);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getContactPage,
  updateContactPage
};
