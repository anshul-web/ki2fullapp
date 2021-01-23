const Address = require("../../model/address");
const Order = require("../../model/order");

exports.updateOrder = (req, res) => {
  Order.updateOne({ _id: req.body.orderId, "orderStatus.type": req.body.type }, {
    $set: {
      "orderStatus.$": [{ type: req.body.type, date: new Date(), isCompleted: true }]
    }
  }).exec((error, order) => {
    if (error) return res.status(400).json({ error });
    if (order) {
      res.status(201).json({ order });
    }
  });
};

exports.getCustomerOrders = async (req, res) => {
  const orders = await Order.find({}).populate("items.productId", "name").exec();
  res.status(200).json({ orders });
};

exports.getOrder = (req, res) => {
  Order.findOne({ _id: req.body.orderId }).populate("items.productId", "_id name productPictures").lean().exec((error, order) => {
    // console.log(order.user);
    if (error) return res.status(400).json({ error });
    if (order) {
      Address.findOne({
        user: order.user
      }).exec((error, address) => {
        // console.log(address);
        if (error) return res.status(400).json({ error });
        order.address = address.address.find(adr => adr._id.toString() == order.addressId.toString());
        res.status(200).json({
          order
        });
      });

      // .exec((error, address) => {
      //   if (error) return res.status(400).json({ error });
      //   order.address = address.address.find(
      //     (adr) => adr._id.toString() == order.addressId.toString()
      //   );
      //   res.status(200).json({
      //     order,
      //   });
      // });
    }
  });
};