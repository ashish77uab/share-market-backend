import mongoose from "mongoose";
import PrizePyramid from "../models/PrizePyramid.js";
export const createPrizePyramid = async (req, res) => {
    try {

        let prize = new PrizePyramid({
            ...req?.body
        });
        prize = await prize.save();

        if (!prize)
            return res.status(400).json({ message: "the prize pyramid cannot be created!" });
        res.status(201).json(prize);
    } catch (error) {
        console.log(error,'error')
        return res.status(500).json({ message: 'Internal server error' });
    }
};
export const getPrizePyramid = async (req, res) => {
    try {
        const prizeId = req.params.id;
        const prize = await PrizePyramid.findById(prizeId);
        res.status(200).json(prize); // Return the first and only match
    } catch (error) {
        console.log(error, 'error')
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export const getAllPrizePyramid = async (req, res) => {
    try {
        const prizeList = await PrizePyramid.find();
        res.status(200).json(prizeList);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const updtePrizePyramid = async (req, res) => {
    try {

        const prize = await PrizePyramid.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body
            },
            { new: true }
        );

        if (!prize)
            return res.status(400).json({ message: "the prize cannot be updated!" });
        res.status(201).json(prize);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};
export const deletePrizePyramid = async (req, res) => {
    try {
        const  prize = await PrizePyramid.findById(req.params.id);
        if (prize) {
            PrizePyramid.findByIdAndRemove(req.params.id)
                .then((prize) => {
                    if (prize) {
                        return res
                            .status(200)
                            .json({ success: true, message: "This prize is deleted!" });
                    } else {
                        return res
                            .status(404)
                            .json({ success: false, message: "prize not found!" });
                    }
                })
                .catch((err) => {
                    return res.status(500).json({ success: false, error: err });
                });

        } else {
            res
                .status(500)
                .json({ message: "Not found any prize" });

        }

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });

    }
};
