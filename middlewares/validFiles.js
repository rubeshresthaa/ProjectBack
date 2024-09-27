// import path from 'path';

// const supportType=['.jpeg','.jpg','.gif','.png']

// export const validFile=(req,res,next)=>{

//   const imageFile=req.file?.image

//   if(!imageFile) return res.status(400).json({message:'Please provide valid image file'})

//     const imageType=path.extname(imageFile.name)

//     if(supportType.includes(imageType)){
//       imageFile.mv(`./uploads/${imageFile.name}`),(err)=>{
//         if(err) return res.status(400).json({message:err})
//           req.imagePath=`/uploads/${imageFile.name}`;
//         next();
//       }
//     }else{
//       return res.status(400).json({ message: 'please provide valid image' });
//     }
// }
import path from 'path';

const supportType = ['.jpeg', '.jpg', '.gif', '.png'];

export const validFile = (req, res, next) => {
  const imageFile = req.files?.image;  // Assuming express-fileupload, or use req.file for multer

  if (!imageFile) {
    return res.status(400).json({ message: 'Please provide a valid image file' });
  }

  const imageType = path.extname(imageFile.name).toLowerCase();  // Convert to lowercase for comparison

  if (supportType.includes(imageType)) {
    imageFile.mv(`./uploads/${imageFile.name}`, (err) => {  
      if (err) return res.status(400).json({ message: err.message });
      req.imagePath = `/uploads/${imageFile.name}`;
      next();
    });
  } else {
    return res.status(400).json({ message: 'Unsupported file type' });
  }
};
