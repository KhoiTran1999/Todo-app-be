const Label = require("./Label");
const Todo = require("./Todo");
const Todo_Label = require("./Todo_Label");
const User = require("./User");

//User - Todo
User.hasMany(Todo, { foreignKey: "userId" });
Todo.belongsTo(User, { foreignKey: "userId" });

//Todo - Label
Todo.belongsToMany(Label, {
  through: Todo_Label,
  foreignKey: "todoId",
});
Label.belongsToMany(Todo, {
  through: Todo_Label,
  foreignKey: "labelId",
});

//Todo_Label - User
Todo_Label.belongsTo(Todo, { foreignKey: "todoId" });
Todo_Label.belongsTo(Label, { foreignKey: "labelId" });

User.hasMany(Todo_Label, { foreignKey: "userId" });
Todo_Label.belongsTo(User, { foreignKey: "userId" });
