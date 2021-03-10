const { model, Schema } = require("mongoose");

const fournisseurSchema = new Schema({
  body: String,
  company: String,
  companyEmail: String,
  address: String,
  phone: String,
  description: String,
  username: String,
  email: String,
  createdAt: String,
  admin: {
    type: Schema.Types.ObjectId,
    ref: "admins",
  },
});

module.exports = model("Fournisseur", fournisseurSchema);
