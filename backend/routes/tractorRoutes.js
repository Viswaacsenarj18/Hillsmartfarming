import express from "express";
import mongoose from "mongoose";
import Tractor from "../models/Tractor.js";
import {
  sendRegistrationEmail,
  sendRentalConfirmationEmail,
} from "../utils/emailService.js";

const router = express.Router();

/* ======================================================
   POST /api/tractors/register
   Register tractor + send confirmation email
====================================================== */
router.post("/register", async (req, res) => {
  try {
    const {
      ownerName,
      email,
      phone,
      location,
      model,
      tractorNumber,
      horsepower,
      fuelType,
      rentPerHour,
      rentPerDay,
      isAvailable = true,
    } = req.body;

    // ✅ Required field validation
    if (
      !ownerName ||
      !email ||
      !phone ||
      !location ||
      !model ||
      !tractorNumber ||
      !horsepower ||
      !fuelType ||
      !rentPerHour ||
      !rentPerDay
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // ✅ Save tractor
    const tractor = new Tractor({
      ownerName,
      email,
      phone,
      location,
      model,
      tractorNumber,
      horsepower,
      fuelType,
      rentPerHour,
      rentPerDay,
      isAvailable,
    });

    const savedTractor = await tractor.save();

    // ✅ Send email (non-blocking)
    sendRegistrationEmail({
      ownerName: savedTractor.ownerName,
      email: savedTractor.email,
      model: savedTractor.model,
      tractorNumber: savedTractor.tractorNumber,
      horsepower: savedTractor.horsepower,
      fuelType: savedTractor.fuelType,
    }).catch((err) =>
      console.error("⚠️ Email failed:", err.message)
    );

    return res.status(201).json({
      success: true,
      message: "Tractor registered successfully",
      data: savedTractor,
    });
  } catch (error) {
    // ✅ Duplicate key handling
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to register tractor",
      error: error.message,
    });
  }
});

/* ======================================================
   GET /api/tractors
   Fetch all tractors
====================================================== */
router.get("/", async (req, res) => {
  try {
    const tractors = await Tractor.find().sort({ createdAt: -1 });
    return res.status(200).json(tractors);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tractors",
    });
  }
});

/* ======================================================
   GET /api/tractors/:id
   Fetch tractor by ID (SAFE)
====================================================== */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Prevent ObjectId crash
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tractor ID",
      });
    }

    const tractor = await Tractor.findById(id);



    if (!tractor) {
      return res.status(404).json({
        success: false,
        message: "Tractor not found",
      });
    }

    return res.status(200).json(tractor);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tractor",
    });
  }
});

/* ======================================================
   POST /api/tractors/confirm-rental
   Confirm rental + send emails
====================================================== */
router.post("/confirm-rental", async (req, res) => {
  try {
    const {
      tractorId,
      renterEmail,
      renterName,
      startDate,
      rentalType,
      duration,
      totalCost,
    } = req.body;

    if (!tractorId || !renterEmail || !renterName) {
      return res.status(400).json({
        success: false,
        message: "Missing required rental details",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(tractorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tractor ID",
      });
    }

    const tractor = await Tractor.findById(tractorId);
    if (!tractor) {
      return res.status(404).json({
        success: false,
        message: "Tractor not found",
      });
    }

    // ✅ Send rental emails
    sendRentalConfirmationEmail({
      renterEmail,
      renterName,
      ownerEmail: tractor.email,
      ownerName: tractor.ownerName,
      model: tractor.model,
      tractorNumber: tractor.tractorNumber,
      startDate,
      rentalType,
      duration,
      totalCost,
      ownerPhone: tractor.phone,
    }).catch((err) =>
      console.error("⚠️ Rental email failed:", err.message)
    );

    return res.status(200).json({
      success: true,
      message: "Rental confirmed and emails sent",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to confirm rental",
      error: error.message,
    });
  }
});

export default router;
