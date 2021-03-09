let inStock = false;

for (i = 1; i <= 5; i++) {
  if (inStock === false) {
    console.log('Not in Stock');
  } else {
    console.log('Available');
  }
}

inStock = true;

for (i = 1; i <= 5; i++) {
  if (inStock === false) {
    console.log('Not in Stock');
  } else {
    return console.log('Available');
  }
}
