import mongoose from "mongoose";
import Stock from "../models/Stock.js";
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import StockTransaction from "../models/StockTransaction.js";

export const getUserStocks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.query.userId;
    const searchQuery = req.query.search || ""; // Search query from request
    const actionType = req.query.actionType || ''; // Status filter from request

    const skip = (page - 1) * limit;

    // Build dynamic match condition
    const matchCondition = {
      name: { $regex: searchQuery, $options: "i" }, // Search by transactionId
      userId: mongoose.Types.ObjectId(userId),
    };


    if (actionType) {
      matchCondition.actionType = actionType; // Add status condition only if provided
    }

    // Count total documents
    const totalStocks = await Stock.countDocuments(matchCondition);

    // Fetch transactions with aggregation pipeline
    const allStocks = await Stock.aggregate([
      {
        $match: matchCondition, // Use dynamic match condition
      },
      {
        $sort: {
          createdAt: -1,

        },
      },
      {
        $skip: skip, // Skip for pagination
      },
      {
        $limit: limit, // Limit for pagination
      },
    ]);

    res.status(200).json({
      stocks: allStocks,
      currentPage: page,
      totalPages: Math.ceil(totalStocks / limit),
      totalStocks,
    });
  } catch (error) {
    console.error("Error fetching stocks:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createStock = async (req, res) => {
  try {
    const { quantity, startPrice, userId } = req.body
    // const user = await User.findById(userId)
    // const wallet = await Wallet.findById(user?.wallet)
    const wallet = await Wallet.findOne(
      { user: userId },
    );
    if (wallet?.amount < startPrice) {
      return res.status(400).json({ message: "Insufficient funds in wallet!" });
    }

    let amount = quantity * startPrice;
    let quantityLeft = quantity;
    const stock = await Stock.create({ ...req.body, amount, quantityLeft: quantityLeft });
    await StockTransaction.create({
      amount: amount,
      actionType: 'Buy',
      userId,
      stockId: stock._id,
    });
    await Wallet.findOneAndUpdate(
      { user: userId },
      {
        $inc: {
          amount: -amount
        }
      },
    );
    if (!stock)
      return res.status(400).json({ message: "the stock  cannot be created!" });
    res.status(201).json(stock);
  } catch (error) {
    console.log(error, 'error creating stock')
    res
      .status(500)
      .json({ message: "Internal server error" });
  }
};
export const sellStock = async (req, res) => {
  try {
    const { quantity, endPrice = 0, userId, stockId } = req.body
    const oldStock = await Stock.findById(stockId);
    let priceDiff = endPrice - oldStock?.startPrice;
    let diffAmount = quantity * priceDiff;
    let quantityLeft = oldStock?.quantityLeft - quantity;
    const newAmount = oldStock?.amount + diffAmount
    const stock = await Stock.create({
      name: oldStock?.name,
      quantity: oldStock?.quantity,
      quantityLeft: quantityLeft,
      amount: newAmount,
      startPrice: oldStock?.startPrice,
      endPrice: req?.body?.endPrice,
      diffAmount: diffAmount,
      actionType: req?.body?.actionType,
      userId: oldStock?.userId,
      isSettled: quantityLeft === 0 ? true : false
    });
    if (quantityLeft === 0) {
      await Wallet.findOneAndUpdate(
        { user: userId },
        {
          $inc: {
            amount: newAmount
          }
        },
      );
    }
    if (!stock)
      return res.status(400).json({ message: "the stock  cannot be created!" });
    res.status(201).json(stock);
  } catch (error) {
    console.log(error, 'error creating stock')
    res
      .status(500)
      .json({ message: "Internal server error" });
  }
};
export const makeSettle = async (req, res) => {
  try {
    const stockId = req.params.id
    const { quantityLeft, amount, diffAmount, userId } = req.body
    const oldStock = await Stock.findById(stockId);
    let newAmount = amount - diffAmount
    console.log(newAmount, req.body, 'newAmount')
    const stock = await Stock.create({
      name: oldStock?.name,
      quantity: oldStock?.quantity,
      quantityLeft: quantityLeft,
      amount: newAmount,
      startPrice: oldStock?.startPrice,
      endPrice: req?.body?.endPrice,
      diffAmount: diffAmount,
      actionType: 'Settled',
      userId: oldStock?.userId,
      isSettled: true

    });
    await StockTransaction.create({
      amount: newAmount,
      actionType: 'Settled',
      userId,
      stockId: stockId,
    });
    await Wallet.findOneAndUpdate(
      { user: userId },
      {
        $inc: {
          amount: diffAmount
        }
      },
    );
    if (!stock)
      return res.status(400).json({ message: "the stock  cannot be created!" });
    res.status(201).json(stock);
  } catch (error) {
    console.log(error, 'error making settle stock')
    res
      .status(500)
      .json({ message: "Internal server error" });
  }
};
export const deleteStock = async (req, res) => {
  try {
    const stockId = req.params.id
    const stock = await Stock.findByIdAndDelete(
      stockId
    );
    if (!stock)
      return res.status(400).json({ message: "the stock cannot be deleted!" })
    res.status(200).json(stock);
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Internal server error" });
  }
};
export const updateStock = async (req, res) => {
  try {
    const stockId = req.params.id
    const { quantity, endPrice, userId } = req.body
    const oldStock = await Stock.findById(stockId);
    let priceDiff = endPrice - oldStock?.startPrice;
    let diffAmount = quantity * priceDiff;
    const newAmount = oldStock?.amount + diffAmount
    const stock = await Stock.findByIdAndUpdate(
      stockId,
      {
        ...req.body,
        diffAmount: diffAmount,
        // amount: newAmount
      },
      { new: true }
    );
    if (!stock)
      return res.status(400).json({ message: "the stock cannot be updated!" })
    res.status(200).json(stock);
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Internal server error" });
  }
};

