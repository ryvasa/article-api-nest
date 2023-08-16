import * as fs from 'fs';

export class ImageHandler {
  uploadImage(req, file) {
    const fileName = `avatar/${Date.now()}${file.originalname}`;
    const address = `${req.protocol}://${req.get('host')}/${fileName}`;

    const ws = fs.createWriteStream(`public/${fileName}`);
    ws.write(file.buffer);
    return address;
  }
  deleteImage(image) {
    const imageName = image.split('/')[4];
    const imagePath = image.split('/')[3];
    const filepath = `./public/${imagePath}/${imageName}`;
    fs.unlinkSync(filepath);
    return 'deleted';
  }
}
