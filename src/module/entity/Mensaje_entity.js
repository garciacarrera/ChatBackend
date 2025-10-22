const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
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
    }
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "userId" },
      nullable: false,
      onDelete: "CASCADE",
      inverseSide: "mensajes"
    },
    chat: {
      type: "many-to-one",
      target: "Chat",
      joinColumn: { name: "chatId" },
      nullable: false,
      onDelete: "CASCADE",
      inverseSide: "mensajes"
    }
  }
});