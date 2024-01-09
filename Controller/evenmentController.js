const Evenment = require(`${__dirname}/../Models/evenmentModel`);

exports.getAllEvenments = async (req, res) => {
  try {
    const evenments = await Evenment.find();
    res.json(evenments);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des événements.' });
  }
};

exports.createEvenment = async (req, res) => {
  try {
    const evenment = new Evenment(req.body);
    const savedEvenment = await evenment.save();
    res.status(201).json(savedEvenment);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'événement.' });
  }
};