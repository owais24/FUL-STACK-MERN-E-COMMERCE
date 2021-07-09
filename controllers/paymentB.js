const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "zhrjrp5w89scgzwn",
  publicKey: "g95fck7nw42c95yf",
  privateKey: "5d0b21dbacbf845f9e41e8742cd828c5"
});


exports.getToken= (req,res) => {
    gateway.clientToken.generate({},function (err, response)  {
        // pass clientToken to your front-end
            if (err) {
                res.status(500).send(err)
            } else {
                res.send(response)
            }
      });
}

exports.processPayment= (req, res) => {
    let nounceFromTheClient= req.body.paymentMethodNonce

    let amountFromTheClient= req.body.amount


    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        deviceData: deviceDataFromTheClient,
        options: {
          submitForSettlement: true
        }
      },
      function (err, result)  {
          if (err) {
              res.status(500).json(err)
          } else {
              res.json(result)
          }
      });
}