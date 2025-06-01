import Form from "../model/FormModel.js";
import { encrypt, decrypt } from "../utils/encrypt.js";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import bucket from "../config/gcs.js";

// Gunakan memory storage (sama seperti createForm)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Maks 5MB
});

// Middleware upload
export const uploadBukti = upload.single("bukti_pengiriman");

// Create form (ini sudah ada)
export const createForm = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Harus login" });
  }

  try {
    const {
      phonenumberPengirim,
      phonenumberPenerima,
      ...formData
    } = req.body;

    const encryptedPhonePengirim = encrypt(phonenumberPengirim.toString());
    const encryptedPhonePenerima = encrypt(phonenumberPenerima.toString());

    let imageUrl = null;

    if (req.file) {
      const gcsFileName = `bukti/${uuidv4()}-${req.file.originalname}`;
      const file = bucket.file(gcsFileName);

      await file.save(req.file.buffer, {
        metadata: { contentType: req.file.mimetype },
        resumable: false,
        public: true,
      });

      imageUrl = `https://storage.googleapis.com/${bucket.name}/${gcsFileName}`;
    }

    const form = await Form.create({
      ...formData,
      phonenumberPengirim: encryptedPhonePengirim,
      phonenumberPenerima: encryptedPhonePenerima,
      bukti_pengiriman: imageUrl,
      userId: req.session.userId,
    });

    res.json({ message: "Form berhasil disimpan", data: form });
  } catch (err) {
    console.error("Form Error:", err);
    res.status(500).json({ message: "Gagal simpan form" });
  }
};

// Ambil data dan dekripsi (sudah ada)
export const getForms = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Harus login" });
  }

  try {
    const forms = await Form.findAll({ where: { userId: req.session.userId } });

    const decryptedForms = forms.map((form) => {
      const data = form.toJSON();
      return {
        ...data,
        phonenumberPengirim: decrypt(data.phonenumberPengirim),
        phonenumberPenerima: decrypt(data.phonenumberPenerima),
      };
    });

    res.json(decryptedForms);
  } catch (err) {
    console.error("GetForms Error:", err);
    res.status(500).json({ message: "Gagal ambil data form" });
  }
};

// ===== Fungsi baru: Update form =====
export const updateForm = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Harus login" });
  }

  const { id } = req.params; // id form yang akan diedit

  try {
    // Cari form milik user ini
    const existing = await Form.findOne({
      where: { id, userId: req.session.userId },
    });
    if (!existing) {
      return res.status(404).json({ message: "Form tidak ditemukan" });
    }

    // Ambil data yang diizinkan untuk diupdate
    const {
      phonenumberPengirim,
      phonenumberPenerima,
      ...restData
    } = req.body;

    // Objek update
    const updateData = { ...restData };

    // Jika ada angka HP baru, enkripsi dulu
    if (phonenumberPengirim) {
      updateData.phonenumberPengirim = encrypt(phonenumberPengirim.toString());
    }
    if (phonenumberPenerima) {
      updateData.phonenumberPenerima = encrypt(phonenumberPenerima.toString());
    }

    // Jika ada file baru, upload ke GCS dan perbarui URL
    if (req.file) {
      const gcsFileName = `bukti/${uuidv4()}-${req.file.originalname}`;
      const file = bucket.file(gcsFileName);
      await file.save(req.file.buffer, {
        metadata: { contentType: req.file.mimetype },
        resumable: false,
        public: true,
      });
      updateData.bukti_pengiriman = `https://storage.googleapis.com/${bucket.name}/${gcsFileName}`;
      // (opsional) tidak menghapus file GCS lama, atau implementasi cleanup jika mau
    }

    // Lakukan update
    await Form.update(updateData, { where: { id } });

    // Ambil kembali data terbaru
    const updated = await Form.findOne({ where: { id } });
    const data = updated.toJSON();
    const decrypted = {
      ...data,
      phonenumberPengirim: decrypt(data.phonenumberPengirim),
      phonenumberPenerima: decrypt(data.phonenumberPenerima),
    };

    res.json({ message: "Form berhasil diperbarui", data: decrypted });
  } catch (err) {
    console.error("UpdateForm Error:", err);
    res.status(500).json({ message: "Gagal update form" });
  }
};
