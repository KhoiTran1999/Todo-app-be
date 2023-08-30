const Todo = require("./Todo");
const User = require("./User");

//User - Todo
User.hasMany(Todo, { foreignKey: "userId" });
Todo.belongsTo(User, { foreignKey: "userId" });
