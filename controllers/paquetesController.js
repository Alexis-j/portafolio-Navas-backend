import * as PaqueteModel from '../models/paquetes.js';

export const getPaquetes = async (req, res) => {
  try {
    const paquetes = await PaqueteModel.getAllPaquetes();
    res.json(paquetes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los paquetes' });
  }
};

export const postPaquete = async (req, res) => {
  try {
    const { nombre, descripcion, precio } = req.body;
    if (!nombre || !descripcion || !precio)
      return res.status(400).json({ error: 'Todos los campos son requeridos' });

    const nuevoPaquete = await PaqueteModel.createPaquete(nombre, descripcion, precio);
    res.status(201).json(nuevoPaquete);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear el paquete' });
  }
};
