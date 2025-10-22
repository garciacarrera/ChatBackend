import { EntitySchema } from "typeorm";

export const ChatEntity = new EntitySchema({
  name: "Chat",
  tableName: "chat",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    name: {
      type: "varchar",
      nullable: true
    }
  },
  relations: {
    mensajes: {
      type: "one-to-many",
      target: "Mensaje",
      inverseSide: "chat"
    },
    participaciones: {
      type: "one-to-many",
      target: "Participa",
      inverseSide: "chat"
    }
  }
});