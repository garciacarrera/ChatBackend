import { request, response } from 'express';
import AppDatasource from '../providers/datasource.provider.js';
import { chatSchema, participationSchema } from './validation/schemas.js';


const create = async (req = request, res = response) => {
  const { name, ownerId } = req.body;

  try {
    const chatRepo = AppDatasource.getRepository('Chat');
    const chat = await chatRepo.save({ name, ownerId: ownerId || null, createdAt: new Date() });
    return res.status(201).json({ ok: true, data: chat });
  } catch (err) {
    console.error('create chat error', err);
    return res.status(500).json({ ok: false, message: err.message || 'Error creating chat' });
  }
};

const findAll = async (req = request, res = response) => {
  try {
    const chatRepo = AppDatasource.getRepository('Chat');
    const chats = await chatRepo.find();
    return res.status(200).json({ ok: true, data: chats });
  } catch (err) {
    console.error('findAll chats error', err);
    return res.status(500).json({ ok: false, message: err.message || 'Error fetching chats' });
  }
};

const findOne = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const chatRepo = AppDatasource.getRepository('Chat');
    const chat = await chatRepo.findOne({ where: { id } });
    if (!chat) return res.status(404).json({ ok: false, message: 'Chat not found' });
    return res.status(200).json({ ok: true, data: chat });
  } catch (err) {
    console.error('findOne chat error', err);
    return res.status(500).json({ ok: false, message: err.message || 'Error fetching chat' });
  }
};


const join = async (req = request, res = response) => {
  const { id: chatId } = req.params;
  const { userId } = req.body;

  const payload = { userId: Number(userId), chatId: Number(chatId) };
  const { error } = participationSchema.validate(payload, { abortEarly: false });
  if (error) {
    return res.status(400).json({ ok: false, message: 'Validation error', details: error.details.map(d => d.message) });
  }

  try {
    const participaRepo = AppDatasource.getRepository('Participa');
    const existing = await participaRepo.findOne({ where: { chatId: payload.chatId, userId: payload.userId } });
    if (existing) return res.status(200).json({ ok: true, data: existing, message: 'Already joined' });

    const participation = await participaRepo.save({ chatId: payload.chatId, userId: payload.userId, role: 'member', joinedAt: new Date() });
    return res.status(201).json({ ok: true, data: participation });
  } catch (err) {
    console.error('join chat error', err);
    return res.status(500).json({ ok: false, message: err.message || 'Error joining chat' });
  }
};


const leave = async (req = request, res = response) => {
  const { id: chatId } = req.params;
  const { userId } = req.body;

  const payload = { userId: Number(userId), chatId: Number(chatId) };
  const { error } = participationSchema.validate(payload, { abortEarly: false });
  if (error) {
    return res.status(400).json({ ok: false, message: 'Validation error', details: error.details.map(d => d.message) });
  }

  try {
    const participaRepo = AppDatasource.getRepository('Participa');
    await participaRepo.delete({ chatId: payload.chatId, userId: payload.userId });
    return res.status(200).json({ ok: true, message: 'You have left the chat' });
  } catch (err) {
    console.error('leave chat error', err);
    return res.status(500).json({ ok: false, message: err.message || 'Error leaving chat' });
  }
};

export const chatController = { create, findAll, findOne, join, leave };