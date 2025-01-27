let jsonbin_API_KEY = "geheim";
let bin_id = "67800cb0acd3cb34a8c6e8a4";
let baseUrl = "https://api.jsonbin.io/v3/b/" + bin_id;

let parameter = {
   method: "GET",
   url: baseUrl,
   headers: 
     {
       "Content-Type": "application/json",
       "X-Master-key" : jsonbin_API_KEY 
     }
};

Shelly.call(
      "HTTP.Request", parameter,
      function(result, error_code, error_message) {
        if (error_code != 0) {
          print(error_message);
        } else {
          let body = result.body;
          let json = JSON.parse(body);
          print(json.record.apower);
        }
      }
);