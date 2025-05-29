import Users from "./UsersModel.js";
import Form from "./FormModel.js";

// Relasi: 1 User bisa punya banyak Form
Users.hasMany(Form, { foreignKey: "userId" });
Form.belongsTo(Users, { foreignKey: "userId" });

export { Users, Form };
