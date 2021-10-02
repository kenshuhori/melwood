const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.readAll = async function (tablename) {
  let { data: results, error } = await supabase
    .from(tablename)
    .select('*')
  return results
};
exports.read = async function (tablename, eq) {
  let { data: results, error } = await supabase
    .from(tablename)
    .select('*')
    .eq(eq.column, eq.value)
  return results
};
exports.insertRow = async function (tablename, values) {
  const { data, error } = await supabase
    .from(tablename)
    .insert([values])
  return data
};
