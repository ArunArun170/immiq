import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
  console.warn(
    "⚠️ Razorpay keys are not configured. Payment features will not work."
  );
}

const razorpay = new Razorpay({
  key_id: keyId || "",
  key_secret: keySecret || "",
});

export default razorpay;