import bcrypt from "bcryptjs";
import Users from "../model/UsersModel.js";

export const register = async (req, res) => {
  const { username, password } = req.body;

  // Mengecek apakah username sudah ada
  const existingUser = await Users.findOne({ where: { username } });
  if (existingUser) {
    return res.status(400).json({ message: "Username sudah digunakan" });
  }

  // Enkripsi password
  const hashed = await bcrypt.hash(password, 10);

  try {
    // Membuat pengguna baru
    await Users.create({ username, password: hashed });
    res.json({ message: "Register berhasil" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal register" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({ where: { username } });

  if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Password salah" });

  req.session.userId = user.id;
  res.json({ message: "Login berhasil", userId: user.id });
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Gagal logout" });
    }
    res.clearCookie("connect.sid"); // Hapus cookie session
    return res.json({ message: "Logout berhasil" });
  });
};