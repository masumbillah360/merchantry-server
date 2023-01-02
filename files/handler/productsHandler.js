app.get("/products", async (req, res) => {
  const query = { paid: { $ne: true } };
  const sellersProductQuery = {
    paid: { $ne: true },
    advertised: { $ne: true },
  };
  const homeProdcuts = await productsCollection.find(query).toArray();
  const sellersProduct = await sellersProductsCollection
    .find(sellersProductQuery)
    .toArray();
  const results = [...homeProdcuts, ...sellersProduct];
  // console.log(sellersProduct);
  res.send(results);
});
app.get("/buy-product/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = { _id: ObjectId(id), paid: { $ne: true } };
  const homeProdcuts = await productsCollection.findOne(query);
  if (homeProdcuts) {
    res.send(homeProdcuts);
  } else {
    const sellersProduct = await sellersProductsCollection.findOne(query);
    res.send(sellersProduct);
  }
});
app.get("/products/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await productsCollection.findOne(query);
  if (result) {
    res.send(result);
  } else {
    const sellersProduct = await sellersProductsCollection.findOne(query);
    res.send(sellersProduct);
  }
});
