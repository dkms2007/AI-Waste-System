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
    setConfidence(0);

    try {
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

      if (data.predictions && data.predictions.length > 0) {
        const top = data.predictions[0];
        setResult(top.class.toUpperCase());
        setConfidence((top.confidence * 100).toFixed(2));
      } else {
        setResult("Unable to classify");
      }
    } catch (error) {
      console.error(error);
      setResult("Error occurred. Try again.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}></div>

      <div style={styles.container}>
        <h1 style={styles.title}>♻️ AI Waste Classifier</h1>
        <p style={styles.subtitle}>
          Smart Waste Segregation using Artificial Intelligence
        </p>

        <label style={styles.uploadBox}>
          <input type="file" onChange={handleUpload} hidden />
          Upload Image
        </label>

        {image && <img src={image} style={styles.image} />}

        {loading && <p style={styles.loading}>Analyzing...</p>}

        {result && !loading && (
          <div style={styles.resultBox}>
            <h2>{result}</h2>
            <p>Confidence: {confidence}%</p>

            <div style={styles.bar}>
              <div
                style={{
                  ...styles.fill,
                  width: `${confidence}%`,
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <footer style={styles.footer}>
        Built by Aarush • Denisha • Dhairya • Gayatri • Zeel
      </footer>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    background: "linear-gradient(270deg, #0f2027, #203a43, #2c5364)",
    backgroundSize: "600% 600%",
    animation: "gradient 15s ease infinite",
    color: "white",
    fontFamily: "sans-serif",
    position: "relative",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backdropFilter: "blur(30px)",
  },
  container: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    paddingTop: "50px",
  },
  title: {
    fontSize: "3rem",
    marginBottom: "10px",
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: "30px",
  },
  uploadBox: {
    display: "inline-block",
    padding: "12px 25px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.1)",
    cursor: "pointer",
    marginBottom: "20px",
  },
  image: {
    width: "300px",
    borderRadius: "15px",
    marginTop: "20px",
  },
  loading: {
    marginTop: "20px",
    fontSize: "1.2rem",
  },
  resultBox: {
    marginTop: "20px",
  },
  bar: {
    width: "300px",
    height: "10px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "5px",
    margin: "10px auto",
  },
  fill: {
    height: "100%",
    background: "#00ffcc",
    borderRadius: "5px",
  },
  footer: {
    position: "absolute",
    bottom: "10px",
    width: "100%",
    textAlign: "center",
    fontSize: "0.9rem",
    opacity: 0.6,
  },
};
