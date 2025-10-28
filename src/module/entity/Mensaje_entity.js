import { EntitySchema } from "typeorm";

export const MensajeEntity = new EntitySchema({
  name: "Mensaje",
  tableName: "mensaje",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    content: {
      type: "varchar",
      nullable: true
    },
    userId: {
      type: "int",
      nullable: false
    },
    chatId: {
      type: "int",
      nullable: false
    },
   
  },
  relations: {
    author: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "authorId" },
      nullable: false,
      onDelete: "CASCADE"
    },
    chat: {
      type: "many-to-one",
      target: "Chat",
      joinColumn: { name: "chatId" },
      nullable: false,
      onDelete: "CASCADE"
    }
  }
});