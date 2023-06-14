const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const uploadImage = async (filePath, id_usuario) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: `images_geohabit/${id_usuario}`
  })
}

const deleteImage = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId)
}
module.exports = {
  uploadImage,
  deleteImage
};



  
