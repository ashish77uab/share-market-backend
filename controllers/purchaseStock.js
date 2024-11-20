import PurchaseStock from "../models/PurchaseStock.js";
import Transaction from "../models/Transaction.js";
import Wallet from "../models/Wallet.js";

export const getUserStocks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search || ""; // Search query from request
    const actionType = req.query.actionType; // Status filter from request

    const skip = (page - 1) * limit;

    // Build dynamic match condition
    const matchCondition = {
      name: { $regex: searchQuery, $options: "i" }, // Search by transactionId
    };

   
    if (actionType) {
      matchCondition.actionType = actionType; // Add status condition only if provided
    }

    // Count total documents
    const totalStocks = await PurchaseStock.countDocuments(matchCondition);

    // Fetch transactions with aggregation pipeline
    const allStocks = await PurchaseStock.aggregate([
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
      totalPages: Math.ceil(allStocks / limit),
      totalStocks,
    });
  } catch (error) {
    console.error("Error fetching stocks:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createStock = async (req, res) => {
  try {
    const stock = await PurchaseStock.create({...req.body});
    if (!stock)
      return res.status(400).json({ message: "the stock  cannot be created!" });
    res.status(201).json(stock);
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Internal server error" });
  }
};
export const deleteStock = async (req, res) => {
  try {
    const stockId=req.params.id
 
    const stock = await PurchaseStock.findOneAndDelete(
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
    const stockId=req.params.id
 
    const stock = await PurchaseStock.findByIdAndUpdate(
      stockId,
      {
        ...req.body,
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

