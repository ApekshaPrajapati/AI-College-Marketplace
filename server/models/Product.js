const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title:         { type: String, required: true },
  description:   { type: String, required: true },
  price:         { type: Number, required: true },
  category:      { type: String, enum: ['books','notes','gadgets','other'] },
  productType:   { type: String, enum: ['physical','digital'], default: 'physical' },
  imageUrl:      { type: String },   // for physical products
  fileUrl:       { type: String },   // for digital products (pdf, ppt)
  fileFormat:    { type: String },   // 'pdf', 'ppt', 'docx'
  subject:       { type: String },   // 'Data Structures', 'DBMS'
  semester:      { type: String },   // 'Sem 3'
  seller:        { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);