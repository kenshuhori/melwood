import nextConnect from 'next-connect';
import multer from 'multer';
import { getData } from "../../modules/pdf";
import { readAll, read, upsertRow } from "../../modules/supabase";

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
  let pdf = await getData(req.file.path);
  let company = await read("companies", {column: "code", value: pdf["company"]["code"]})[0]
  if (!company) {
    let company_upserted = await upsertRow("companies", {
      name: pdf["company"]["name"],
      code: pdf["company"]["code"]
    })
    company = company_upserted[0];
  }
  let statement_upserted = await upsertRow("statements", {
    company_id: company.id,
    year: pdf["company"]["year"],
    quarter: pdf["company"]["quarter"],
    amount_current_asset: pdf["balanceSheetObject"]["流動資産合計"],
    amount_fixed_asset: pdf["balanceSheetObject"]["固定資産合計"],
    amount_all_asset: pdf["balanceSheetObject"]["資産合計"],
    amount_current_liability: pdf["balanceSheetObject"]["流動負債合計"],
    amount_fixed_liability: pdf["balanceSheetObject"]["固定負債合計"],
    amount_all_liability: pdf["balanceSheetObject"]["負債合計"],
    amount_net_asset: pdf["balanceSheetObject"]["純資産合計"]
  })
  res.status(200).json(pdf);
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
