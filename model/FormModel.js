import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Form = db.define("form", {
  namaPengirim: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lokasiPengirim: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  waktuPengiriman: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  phonenumberPengirim: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  berat: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  namaPenerima: {
  type: DataTypes.STRING,
   allowNull: true,
  },
  lokasiPenerima: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phonenumberPenerima: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   userId: {
  type: DataTypes.INTEGER,
  allowNull: false
  }
}, {
  freezeTableName: true,
});

export default Form;
