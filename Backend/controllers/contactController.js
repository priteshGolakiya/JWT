const Contact = require("../models/contectModel");
const asyncHandler = require("express-async-handler");

const getAllContacts = asyncHandler(async (req, res) => {
  try {
    const { user } = req;
    console.log("User ID:", user.id);

    // Find all contacts where user_id matches the current user's ID
    const contacts = await Contact.find({ user_id: user.id });

    console.log("Contacts:", contacts);

    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching contacts" });
  }
});

const getContact = asyncHandler(async (req, res, next) => {
  try {
    const { user } = req;
    console.log(user);
    const contact = await Contact.findOne({
      _id: req.params.id,
      user_id: user.id,
    });
    if (!contact) {
      return res
        .status(404)
        .json({ message: "Contact not found or you are not authorized" });
    }
    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
});

const createContact = asyncHandler(async (req, res, next) => {
  try {
    const { user } = req;
    console.log(user);
    const { name, phone, email } = req.body;

    const newContact = new Contact({
      user_id: user.id,
      name,
      phone,
      email,
    });

    await newContact.save();
    res
      .status(201)
      .json({ success: true, message: "Contact created successfully" });
  } catch (error) {
    next(error);
  }
});

const updateContact = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    console.log("Contact ID:", id);
    console.log("User ID:", user.id);

    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id, user_id: user.id },
      req.body,
      { new: true }
    );

    if (!updatedContact) {
      return res
        .status(404)
        .json({ message: "Contact not found or you are not authorized" });
    }

    res.status(200).json({ success: true, data: updatedContact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const deleteContact = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const deletedContact = await Contact.findOneAndDelete({
      _id: id,
      user_id: user.id,
    });

    if (!deletedContact) {
      return res
        .status(404)
        .json({ message: "Contact not found or you are not authorized" });
    }

    res
      .status(200)
      .json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = {
  getAllContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
};
