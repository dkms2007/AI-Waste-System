import { useState, useEffect } from "react";

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

        if (data.top) {
          setResult(data.top.replace("_", " ").toUpperCase());
          setConfidence((data.confidence * 100).toFixed(2));
        } else {
          setResult("Unable to classify");
        }

        setLoading(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setResult("Error");
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.gradient}></div>

      <div style={styles.card}>
        <h1 style={styles.title}>♻️ Waste Classifier AI</h1>
        <p style={styles.subtitle}>
          Intelligent Waste Detection System
        </p>

        <label style={styles.upload}>
          <input type="file" hidden onChange={handleUpload} />
          Upload Image
        </label>

        {image && (
          <div style={styles.previewBox}>
            <img src={image} style={styles.image} />
          </div>
        )}

        {loading && <p style={styles.loading}>Analyzing...</p>}

        {result && !loading && (
          <div style={styles.resultBox}>
            <h2 style={styles.result}>{result}</h2>
            <p style={styles.conf}>Confidence: {confidence}%</p>

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
    fontFamily: "Inter, sans-serif",
    color: "white",
    overflow: "hidden",
    position: "relative",
  },

  gradient: {
    position: "absolute",
    width: "200%",
    height: "200%",
    background:
      "linear-gradient(-45deg, #0f2027, #203a43, #2c5364, #00c9ff)",
    backgroundSize: "400% 400%",
    animation: "move 12s ease infinite",
    zIndex: 0,
  },

  card: {
    position: "relative",
    zIndex: 2,
    width: "400px",
    margin: "auto",
    top: "50%",
    transform: "translateY(-50%)",
    padding: "30px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 0 40px rgba(0,255,200,0.2)",
    textAlign: "center",
    transition: "0.3s",
  },

  title: {
    fontSize: "2rem",
    marginBottom: "10px",
    textShadow: "0 0 15px rgba(0,255,200,0.7)",
  },

  subtitle: {
    opacity: 0.7,
    marginBottom: "20px",
  },

  upload: {
    display: "inline-block",
    padding: "12px 20px",
    borderRadius: "10px",
    background: "rgba(0,255,200,0.2)",
    cursor: "pointer",
    transition: "0.3s",
  },

  previewBox: {
    marginTop: "20px",
  },

  image: {
    width: "100%",
    borderRadius: "15px",
    boxShadow: "0 0 20px rgba(0,255,200,0.5)",
  },

  loading: {
    marginTop: "15px",
  },

  resultBox: {
    marginTop: "20px",
  },

  result: {
    fontSize: "1.5rem",
    textShadow: "0 0 10px #00ffcc",
  },

  conf: {
    opacity: 0.8,
  },

  bar: {
    marginTop: "10px",
    height: "8px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "5px",
  },

  fill: {
    height: "100%",
    background: "#00ffcc",
    borderRadius: "5px",
    boxShadow: "0 0 10px #00ffcc",
  },

  footer: {
    position: "absolute",
    bottom: "10px",
    width: "100%",
    textAlign: "center",
    fontSize: "0.8rem",
    opacity: 0.6,
  },
};
