app.get("/categories", async (req, res) => {
  const query = {};
  const result = await categoryCollection.find(query).toArray();
  res.send(result);
});
app.get("/categories/:category", async (req, res) => {
  const category = req.params.category;
  console.log(category);
  const query = { cat_id: category, paid: { $ne: true } };

  const globalProducts = await productsCollection.find(query).toArray();
  const sellersProduct = await sellersProductsCollection.find(query).toArray();
  const result = [...globalProducts, ...sellersProduct];
  // console.log(sellersProduct);

  res.send(result);
});
