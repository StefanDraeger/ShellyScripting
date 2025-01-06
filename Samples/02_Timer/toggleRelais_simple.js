function toggleRelais(){
  let result = Shelly.getComponentStatus("Switch:0");
  
  if(result){
    if(result.output === true){
      print("Relais war AN!");
    } else {
      print("Relais war AUS!");
    }
    Shelly.call("Switch.Set", {id:0, on:!result.output});
  }
}

Timer.set(1000, true, toggleRelais);