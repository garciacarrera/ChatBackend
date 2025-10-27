import { EntitySchema } from "typeorm";

export const PartiEntity = new EntitySchema({
  name: "Participa",
  tableName: "participa",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    }
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "userId" },
      nullable: false,
      onDelete: "CASCADE",
      inverseSide: "participaciones"
    },
    chat: {
      type: "many-to-one",
      target: "Chat",
      joinColumn: { name: "chatId" },
      nullable: false,
      onDelete: "CASCADE",
      inverseSide: "participaciones"
    }
  }
});