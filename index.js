const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const SigninRoute = require("./routes/Signup");
const cors = require('cors');
const auth = require("./middleware/auth");
const uploader = require("./middleware/multer");
const fileController = require("./routes/File");
const path = require('path');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/signin", require("./routes/signin"));
app.use("/signup", SigninRoute);
app.use('/validate', require('./routes/validate'));

require('./startup/db');

app.post(
  "/upload",
  auth,
  uploader.single("myfile"),
  fileController.uploadFile
);
app.get("/files", auth, fileController.getAllFiles);
app.get("/file/:filename", fileController.getIndividualFile);
if(process.env.NODE_ENV === 'production')
{
  app.use(express.static('client/build'))
  app.get('*',(req,res) => res.sendFile(path.resolve(__dirname,'client','build','index.html')));
}
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
