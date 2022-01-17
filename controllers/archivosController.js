const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Enlaces = require('../models/Enlace');

exports.subirArchivo = async (req, res, next) => {
  const configuracionMulter = {
    limits: { fileSize: req.usuario ? 1024 * 1024 * 10 : 1024 * 1024 }, // un usuario autenticado puede subir achivo mas pesado
    storage: (fileStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, __dirname + '/../uploads');
      },
      filename: (req, file, cb) => {
        const extension = file.originalname.substring(
          file.originalname.lastIndexOf('.'),
          file.originalname.length
        );
        cb(null, `${shortid.generate()}${extension}`);
      },
    })),
  };

  const upload = multer(configuracionMulter).single('archivo');
  upload(req, res, async (error) => {
    if (!error) {
      res.json({ archivo: req.file.filename });
    } else {
      return next();
    }
  });
};

exports.eliminarArchivo = async (req, res) => {
  try {
    fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
  } catch (error) {
    error;
  }
};

// descarga un archivo
exports.descargarArchivo = async (req, res, next) => {
  //obtiene el enlace

  const { archivo } = req.params;
  const enlace = await Enlaces.findOne({ url: archivo });
  const archivoDescarga = __dirname + '/../uploads/' + enlace.nombre;
  res.download(archivoDescarga);

  // Eliminar el archivo y la entrada de la bd
  // si las descargas son iguales a 1 - Borrar entrada y borrar archivo
  const { descargas, nombre } = enlace;
  if (descargas === 1) {
    //eliminar el archivo
    req.archivo = nombre;

    //eliminar la entrada de la base de dato
    await Enlaces.findOneAndRemove(enlace.id);
    next();
  } else {
    // si las descargas son mayores a 1 - Restar 1
    enlace.descargas--;
    await enlace.save();
  }
};
