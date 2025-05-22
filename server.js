const express = require("express");
const Stripe = require("stripe");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // ⚠️ Define esta variable en Render

app.use(cors());
app.use(bodyParser.json());

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency = "usd" } = req.body;

    console.log("➡️ Body recibido:", req.body);

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.status(400).send({ error: "Monto inválido. Debe ser un número mayor a 0." });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    console.log("✅ clientSecret generado:", paymentIntent.client_secret);

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("❌ Stripe error:", error);
    res.status(400).send({
      error: error.message || "Error desconocido al crear el PaymentIntent",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
