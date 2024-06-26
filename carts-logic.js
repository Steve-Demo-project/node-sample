const httpStatus = require('http-status')
const CartsModel = require('../models/carts')

exports.getCarts = async (req, res) => {
  try {
    const reqQuery = req.query
    const instanceId = !!(reqQuery.instanceId) ? reqQuery.instanceId : (!!(reqQuery.storeInstance) ? reqQuery.storeInstance : 0);
    const query = [{
      $unwind: "$cart"
    }]

    if (instanceId && instanceId !== 'All') {
      query.push({ $match: {'instanceid': instanceId} })
    }
    if (reqQuery.searchTxt) {
      query.push({ $match: {
        'cart.shipping.address.fullName': {
        $regex: reqQuery.searchTxt,
        $options: 'i'
      }}});
      query.push({ $match: {'cart.email': {
        $regex: reqQuery.searchTxt,
        $options: 'i'
      }}});
    }

    if (reqQuery.createStartDate) {
      query.push({$match: {'cart.createdAt': {
        $gte: new Date(reqQuery.createStartDate)
      }}});
    }

    if (reqQuery.createEndDate) {
      query.push({$match: {'cart.createdAt': {
        $lte: new Date(reqQuery.createEndDate)
      }}});
    }
    const carts = await CartsModel.aggregate(query).cursor()
        .exec().toArray()
    return res.status(httpStatus.OK).send({message: 'carts items', items: carts})
  } catch (error) {
    throw new Error(error)
  }
}

exports.addCarts = async (req, res) => {
  try {
    const result = await (new CartsModel(req.body)).save()
    return res.status(httpStatus.OK).send({message: 'carts items added', result})
  } catch (error) {
    throw new Error(error)
  }
}

exports.addQueueCart = async (body, callBack) => {
  try {
    if(!!body && typeof body === "string") {
      const cartData = JSON.parse(body);
      await (new CartsModel(cartData)).save();
      callBack(null);
    }
  } catch (error) {
    callBack(error);
    throw new Error(error)
  }
}

exports.getCartDetail = async (req, res) => {
  try {
    const cartId = req.params.cartId
    let query = [{
      $unwind: '$cart'
    }];
    query.push({
      $match: {'cart._id': cartId}
    })
    const carts = await CartsModel.aggregate(query).cursor().exec().toArray();
    if(carts.length>0){
      return res.status(httpStatus.OK).send({message: 'cart detail', detail: carts[0].cart})
    } else {
      return res.status(httpStatus.OK).send({message: 'cart detail', detail: {}})
    }
  } catch (error) {
    throw new Error(error)
  }
}

exports.getDashboardStats = async (req, res) => {
  try {
    const reqQuery = req.query
    const instanceId = !!(reqQuery.instanceId) ? reqQuery.instanceId : (!!(reqQuery.storeInstance) ? reqQuery.storeInstance : 0);
    let query= [{
      $unwind: "$cart"
    }];
    if (instanceId && instanceId !== 'All') {
      query.push({ $match: {'instanceid': instanceId} })
    }
    if (reqQuery.fromDate) {
      query.push({ $match: {'cart.createdAt': {
        $gte: new Date(reqQuery.fromDate)
      }}});
    }
    if (reqQuery.toDate) {
      query.push({ $match: {'cart.createdAt': {
        $lte: new Date(reqQuery.toDate)
      }}});
    }
    query.push({
      $project: {
        _id: 0,
        total: "$cart.items.subtotal.amount"
      }},{
        $unwind: "$total"
      },{
      $group: {
        _id: 0,
        total: {$sum: 1},
        amount: { $sum: "$total" }
    }});
    const cart = await CartsModel.aggregate(query).cursor().exec().toArray();
    let resData = {
      total: 0,
      amount: 0
    }
    if(cart.length>0) {
      resData = cart[0]
    }
    return res.status(httpStatus.OK).send({message: 'dashboard stats', data: resData })
  } catch (error) {
    throw new Error(error)
  }
}
