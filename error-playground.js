const sum = (a,b) => {
  if(a && b) {
    return a + b;
  }
 throw new Error("Invalid Argument");
};


try {
  sum(2);
}catch(err){
  console.log('Error occured');
  console.log(err);
}
