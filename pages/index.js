const handleUpload = async (e) => {
  const file = e.target.files[0];
  setImage(URL.createObjectURL(file));

  setResult("Analyzing...");

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    "https://serverless.roboflow.com/waste-yfe9a/1?api_key=NAKbDpcpDDmC5zBEczfN",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  console.log(data);

  // Extract result
  if (data.predictions && data.predictions.length > 0) {
    const top = data.predictions[0];
    setResult(`${top.class} (${(top.confidence * 100).toFixed(2)}%)`);
  } else {
    setResult("Could not classify image");
  }
};
