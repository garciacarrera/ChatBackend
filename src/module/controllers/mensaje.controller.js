import { MensajeEntity } from './entity/Mensaje_entity.js';
import { UserEntity } from './entity/User-entity.js';
import { ChatEntity } from './entity/Chat_entity.js';

export const enviarMensaje = async (req, res) => {
  try {
    const { contenido, chatId } = req.body;
    const usuarioId = req.user.id;

    const chat = await ChatEntity.findOne({ where: { id: chatId } });
    const usuario = await UserEntity.findOne({ where: { id: usuarioId } });

    if (!chat || !usuario)
      return res.status(404).json({ mensaje: 'Chat o usuario no encontrado' });

    const mensaje = MensajeEntity.create({ contenido, usuario, chat });
    await mensaje.save();

    res.status(201).json(mensaje);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al enviar el mensaje', error });
  }
};

export const obtenerMensajes = async (req, res) => {
  try {
    const { chatId } = req.params;
    const mensajes = await MensajeEntity.find({
      where: { chat: { id: chatId } },
      relations: ['usuario'],
    });
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los mensajes', error });
  }
};
