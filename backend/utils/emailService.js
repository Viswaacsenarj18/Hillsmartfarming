import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

console.log("EmailUSER",process.env.EMAIL_USER)
console.log("EmailUSER",process.env.EMAIL_PASSWORD)

/**
 * Tractor owner registration email
 */
const sendRegistrationEmail = async ({
  ownerName,
  email,
  model,
  tractorNumber,
  horsepower,
  fuelType,
}) => {
  await transporter.sendMail({
    from: `"Green Field Hub" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🚜 Tractor Registration Successful",
    html: `
      <h2>Tractor Registered Successfully</h2>
      <p>Hello <b>${ownerName}</b>,</p>
      <ul>
        <li><b>Model:</b> ${model}</li>
        <li><b>Number:</b> ${tractorNumber}</li>
        <li><b>Horsepower:</b> ${horsepower} HP</li>
        <li><b>Fuel:</b> ${fuelType}</li>
      </ul>
    `,
  });
};

/**
 * Rental confirmation → ONLY TO TRACTOR OWNER
 */
const sendRentalConfirmationEmail = async ({
  ownerEmail,
  ownerName,
  renterName,
  renterEmail,
  model,
  tractorNumber,
  startDate,
  rentalType,
  duration,
  totalCost,
}) => {
  await transporter.sendMail({
    from: `"Green Field Hub" <${process.env.EMAIL_USER}>`,
    to: ownerEmail,
    subject: "📢 Your Tractor Has Been Booked!",
    html: `
      <h2>New Tractor Rental</h2>
      <p>Hello <b>${ownerName}</b>,</p>
      <p>Farmer: ${renterName} (${renterEmail})</p>
      <p>Tractor: ${model} (${tractorNumber})</p>
      <p>Total: ₹${totalCost}</p>
    `,
  });
};

export { sendRegistrationEmail, sendRentalConfirmationEmail };
