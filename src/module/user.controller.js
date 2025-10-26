import { request, response } from "express";
import AppDatasource from "../provider/datasource-provider.js"
import { UserEntity } from "../module/entity/User-entity.js";
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { envs } from "../configuration/envs.js";


const repo = AppDatasource.getRepository('User');

const register = async (req = request, res = response) => {
  const { password, ...user } = req.body;

  const hashPassword = await bcrypt.hash(password, 12);

  try {
    const newUser = await repo.save({ ...user, password: hashPassword });
    res.status(201).json({
      ok: true,
      user: { ...newUser, password: '***' },
      message: 'Usuario creado',
    });
  } catch (error) {
    res
      .status(400)
      .json({ ok: false, error, message: "Usuario no fue creado" });
  }
};

const login = async (req = request, res = response) => {
  const { username, password } = req.body;
  const user = await repo.findOne({ where: { username } });

  if (!user) {
    res.status(404).json('Usuario no encontrado');
    return;
  }
  
  const isPassword = await bcrypt.compare(password, user.password);

  if (!isPassword) {
    res.status(401).json('error de contraseña');
    return;
  }

  
  const payload = { id: user.id, username: user.username };

  const token = jwt.sign(payload,  envs.JWT_SECRET, {
     expiresIn: '1h',
  });

  res.status(200).json({
    ok: true,
    message: 'Login',
    metadata: { user: { ...user, password: '***' }, token }, 
  });
};

const findAll = async (req = request, res = response) => {
  const users = await repo.find();


  console.log(req.user)

  res.status(200).json({ ok: true, message: 'Aprovado', data: users });
};

export const userController = { register, login, findAll };
