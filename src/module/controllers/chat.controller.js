import { ChatEntity } from './entity/Chat_entity.js';

export const crearChat = async (req, res) => {
  try {
    const { nombre } = req.body;
    const chat = ChatEntity.create({ nombre });
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el chat', error });
  }
};

export const obtenerChats = async (req, res) => {
  try {
    const chats = await ChatEntity.find();
    res.json(chats);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los chats', error });
  }
};
