const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User",
  tableName: "user",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    username: {
      type: "varchar",
      nullable: true
    },
    password: {
      type: "varchar",
      nullable: true
    }
  },
  relations: {
    mensajes: {
      type: "one-to-many",
      target: "Mensaje",
      inverseSide: "user"
    },
    participaciones: {
      type: "one-to-many",
      target: "Participa",
      inverseSide: "user"
    }
  }
});
