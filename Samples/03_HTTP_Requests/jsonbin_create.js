let jsonbin_API_KEY = "$2a$10$PVlU/LH4NVxYVAJl0aAqa.Bz8bdkkYQfQ5bXI.MgU8VeETzw4ZyCW";
let baseUrl = "https://api.jsonbin.io/v3/b/";

let bin = "";

let parameter = {
   method: "POST",
   url: baseUrl,
   headers: 
     {
       "Content-Type": "application/json",
       "X-Master-key" : "$2a$10$PVlU/LH4NVxYVAJl0aAqa.Bz8bdkkYQfQ5bXI.MgU8VeETzw4ZyCW"
     },
   body: 
     {
       greeting: "Test123",
       temperatur: 12,
       spannnung: 230,
     }
};

function readBinIDFromResult(result){
  let json = JSON.parse(result);
  return json.metadata.id;
}

function createBin(){
  Shelly.call(
      "HTTP.Request", parameter,
      function(result, error_code, error_message) {
        if (error_code != 0) {
          print(error_message);
          return "";
        } else {
          let bin = readBinIDFromResult(result.body);
          print("BIN-ID:" + bin);
          return bin;
        }
      }
  );  
}

if (bin === ""){
  print("drin!");
  bin = createBin();
}

print(bin);
print("Ende");