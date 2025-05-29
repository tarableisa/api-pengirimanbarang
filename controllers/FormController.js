import Form from "../model/FormModel.js";
import { encrypt, decrypt } from "../utils/encrypt.js";

// Create and encrypt new form entries
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

    const form = await Form.create({
      ...formData,
      phonenumberPengirim: encryptedPhonePengirim,
      phonenumberPenerima: encryptedPhonePenerima,
      userId: req.session.userId,
    });

    res.json({ message: "Form berhasil disimpan", data: form });
  } catch (err) {
    console.error("Form Error:", err);
    res.status(500).json({ message: "Gagal simpan form" });
  }
};

// Retrieve and decrypt form entries
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