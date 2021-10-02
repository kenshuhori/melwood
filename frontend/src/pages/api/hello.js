import nextConnect from 'next-connect';
import multer from 'multer';
import { getData } from "../../modules/pdf";
import { readAll, read, insertRow } from "../../modules/supabase";

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('IRStatementPDF'));

apiRoute.post(async (req, res) => {
  let obj = await getData(req.file.path);
  let company = obj["company"]
  let company_exist = await read("companies", {column: "code", value: company["code"]})
  if(!company_exist) {
    let company_inserted = await insertRow("companies", {
      name: company["name"],
      code: company["code"]
    })
  }
  res.status(200).json(obj);
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
