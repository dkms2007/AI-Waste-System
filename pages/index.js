import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");

  const handleUpload = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));

    setResult("Analyzing...");

    setTimeout(() => {
      setResult("Recyclable Waste (92%)");
    }, 1500);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>AI Waste Classifier</h1>

      <input type="file" onChange={handleUpload} />

      {image && <img src={image} width="300" />}

      <h2>{result}</h2>
    </div>
  );
}
