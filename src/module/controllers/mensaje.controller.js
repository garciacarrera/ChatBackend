import { request, response } from 'express';
import AppDatasource from '../../provider/datasource-provider.js';
import { mensajeSchema } from '../schemas/Validator_enchema.js';

const send = async (req = request, res = response) => {
  const { content, userId, chatId } = req.body;

  // Validate input
  if (!content || !userId || !chatId) {
    return res.status(400).json({ 
      ok: false, 
      message: 'content, userId, and chatId are required' 
    });
  }

  try {
    const mensajeRepo = AppDatasource.getRepository('Mensaje');
    const ChatRepo = AppDatasource.getRepository('Participa');
    
    // Check participation
    const participation = await ChatRepo.findOne({ 
      where: { chatId, userId } 
    });
    
    if (!participation) {
      return res.status(403).json({ 
        ok: false, 
        message: 'User not participant of chat' 
      });
    }

    // Create message
    const message = await mensajeRepo.save({
      content,
      userId,
      chatId
    });

    return res.status(201).json({ ok: true, data: message });
  } catch (err) {
    console.error('send message error', err);
    return res.status(500).json({ 
      ok: false, 
      message: 'Error sending message' 
    });
  }
};


const findByChat = async (req = request, res = response) => {
  const { chatId } = req.params;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
  const order = (req.query.order === 'desc') ? 'DESC' : 'ASC';
  const skip = (page - 1) * limit;

  try {
    const mensajeRepo = AppDatasource.getRepository('Mensaje');
    const [messages, total] = await mensajeRepo.findAndCount({
      where: { chatId },
      skip,
      take: limit
    });

    return res.status(200).json({ ok: true, data: messages, meta: { page, limit, total } });
  } catch (err) {
    console.error('get messages error', err);
    return res.status(500).json({ ok: false, message: err.message || 'Error getting messages' });
  }
};


const remove = async (req = request, res = response) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ ok: false, message: 'userId required in body to delete message' });

  try {
    const mensajeRepo = AppDatasource.getRepository('Mensaje');
    const message = await mensajeRepo.findOne({ where: { id } });
    if (!message) return res.status(404).json({ ok: false, message: 'Message not found' });

    const isAuthor = String(message.authorId) === String(userId);
    

    if (!isAuthor) return res.status(403).json({ ok: false, message: 'Not allowed to delete this message' });

    await mensajeRepo.delete({ id });
    return res.status(200).json({ ok: true, message: 'Message deleted' });
  } catch (err) {
    console.error('delete message error', err);
    return res.status(500).json({ ok: false, message: err.message || 'Error deleting message' });
  }
};

export const mensajeController = { send, findByChat, remove };