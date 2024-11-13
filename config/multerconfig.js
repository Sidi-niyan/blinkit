const multer=require('multer');
let storage=multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload;