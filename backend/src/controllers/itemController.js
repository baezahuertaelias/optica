const { Item } = require('../models');

module.exports = {
  async index(req, res) {
    try {
      const items = await Item.findAll({
        where: { userId: req.userId },
        order: [['createdAt', 'DESC']]
      });
      
      return res.json(items);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  
  async show(req, res) {
    try {
      const item = await Item.findOne({
        where: { 
          id: req.params.id,
          userId: req.userId
        }
      });
      
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      
      return res.json(item);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  
  async store(req, res) {
    try {
      const { name, description, price, quantity } = req.body;
      
      const item = await Item.create({
        name,
        description,
        price,
        quantity,
        userId: req.userId
      });
      
      return res.status(201).json(item);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  
  async update(req, res) {
    try {
      const { name, description, price, quantity } = req.body;
      
      const item = await Item.findOne({
        where: { 
          id: req.params.id,
          userId: req.userId
        }
      });
      
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      
      await item.update({
        name: name || item.name,
        description: description !== undefined ? description : item.description,
        price: price || item.price,
        quantity: quantity !== undefined ? quantity : item.quantity
      });
      
      return res.json(item);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  
  async destroy(req, res) {
    try {
      const item = await Item.findOne({
        where: { 
          id: req.params.id,
          userId: req.userId
        }
      });
      
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      
      await item.destroy();
      
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
};