import axios from "axios";

export default (req, res) => {
  console.log(req);

  axios({
    method: "POST",
    url: "http://localhost:4000",
    data: { file },
    config: {
      headers: {
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
      },
    },
  }).then((response) => {
    response.json();
  });
};
