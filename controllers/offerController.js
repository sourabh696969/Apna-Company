const asyncHandler = require("express-async-handler");
const Offer = require("../model/offerModel");

const createOffer = asyncHandler(async (req, res) => {
  const { offerName } = req.body;

  const offerImg = req.files["offerImg"] ? req.files["offerImg"][0].path : null;
  if (!offerImg) {
    res.status(404);
    throw new Error("image is required!");
  }
  const offer = await Offer.create({
    offerName,
    offerImg,
  });

  res.status(201).json({ message: "Offer created successfully!", offer });
});

const updateOffer = asyncHandler(async (req, res) => {
  const { offerName } = req.body;
  const offerId = req.params.id;

  const offerImg = req.files["offerImg"] ? req.files["offerImg"][0].path : null;
  if (!offerImg) {
    res.status(404);
    throw new Error("image is required!");
  }
  const offer = await Offer.findByIdAndUpdate(offerId, {
    offerName,
    offerImg: offerImg == null ? offer.offerImg : offerImg,
  });

  if (!offer) {
    res.status(404);
    throw new Error("offer not found!");
  }

  res.status(201).json({ message: "Offer Updated successfully!" });
});

const getOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.find();
  if (!offer) {
    res.status(404);
    throw new Error("Offer not found!");
  }

  res.status(200).json(offer);
});
const getOfferById = asyncHandler(async (req, res) => {
  const offerId = req.params.id;

  const offer = await Offer.findById(offerId);
  if (!offer) {
    res.status(404);
    throw new Error("Offer not found!");
  }

  res.status(200).json(offer);
});
const deleteOffer = asyncHandler(async (req, res) => {
  const offerId = req.params.id;

  const offer = await Offer.findByIdAndDelete(offerId);
  if (!offer) {
    res.status(404);
    throw new Error("Offer not found!");
  }

  res.status(200).json({ message: "Offer deleted succesfully!" });
});

module.exports = {
  createOffer,
  getOffer,
  getOfferById,
  updateOffer,
  deleteOffer,
};
