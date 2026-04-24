import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));
    setLoading(true);
    setResult("");

    try {
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Image = reader.result.split(",")[1];

        const res = await fetch(
          "https://serverless.roboflow.com/waste-classification-lde94/2?api_key=NAKbDpcpDDmC5zBEczfN",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: base64Image,
          }
        );

        const data = await res.json();
        console.log(data);

        if (data.top) {
          setResult(data.top.toUpperCase());
          setConfidence((data.confidence * 100).toFixed(2));
        } else {
          setResult("Unable to classify");
        }

        setLoading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      setResult("Error occurred");
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px", color: "white", background: "#111", height: "100vh" }}>
      <h1>♻️ Waste Classifier AI</h1>

      <input type="file" onChange={handleUpload} />

      {image && <img src={image} width="300" style={{ marginTop: "20px" }} />}

      {loading && <p>Analyzing...</p>}

      {result && (
        <div>
          <h2>{result}</h2>
          <p>Confidence: {confidence}%</p>
        </div>
      )}
    </div>
  );
}
