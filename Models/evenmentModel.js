const mongoose = require('mongoose');

const evenmentSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  type_de_evenment: { type: String, enum: ['sport', 'culture', 'social'], required: true },
  hackathon: { type: Boolean, default: false },
  date: { type: Date, required: true },
  heure: { type: String, required: true },
  lieu: { type: String, required: true },
  type: { type: String, enum: ['gratuit', 'payant'], required: true },
  responsable: { type: String, required: true },
});

const Evenment = mongoose.model('Evenment', evenmentSchema);

module.exports = Evenment;
