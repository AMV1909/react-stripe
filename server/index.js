const express = require('express');
const Stripe = require("stripe");
const cors = require('cors');

const app = express();

const stripe = new Stripe("sk_test_51M2m6uDLYESPPfVdOnkAwHTKUQXQaGTHLD1NTheUWm92t2cKtNe8sbvUBvzkB509VbfIT8rBWzcwnFsgptY8q1qZ00rDhC8gPB");

app.use(cors(({
    origin: '*'
})));
app.use(express.json());

app.post('/api/checkout', async (req, res) => {
    const { id, amount } = req.body;

    await stripe.paymentIntents.create({
        amount,
        currency: 'USD',
        description: 'Teclado Mecánico',
        payment_method: id,
        confirm: true
    }).then((payment) => {
        console.log(payment);
        res.send({
            message: 'Payment Successful',
            success: true
        });
    }).catch((error) => {
        console.log(error);
        res.send({
            message: 'Payment Failed',
            success: false
        });
    });
});

app.listen(4000, () => {
    console.log('Server on port 4000');
});