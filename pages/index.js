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
          setResult("♻️ " + data.top.replace("_", " ").toUpperCase());
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
    <>
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }

        @keyframes float {
          0% { transform: translateY(0px) }
          50% { transform: translateY(-15px) }
          100% { transform: translateY(0px) }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

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
    </>
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
      "linear-gradient(-45deg, #0f2027, #203a43, #2c5364, #00c9ff, #00ffcc)",
    backgroundSize: "500% 500%",
    animation: "gradientMove 15s ease infinite",
    filter: "blur(60px)",
    opacity: 0.7,
    zIndex: 0,
  },

  card: {
    position: "relative",
    zIndex: 2,
    width: "420px",
    margin: "auto",
    top: "50%",
    transform: "translateY(-50%)",
    padding: "35px",
    borderRadius: "25px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(25px)",
    boxShadow: "0 0 60px rgba(0,255,200,0.25)",
    textAlign: "center",
    animation: "fadeIn 0.8s ease",
  },

  title: {
    fontSize: "2rem",
    marginBottom: "10px",
    textShadow: "0 0 20px rgba(0,255,200,0.8)",
  },

  subtitle: {
    opacity: 0.7,
    marginBottom: "20px",
  },

  upload: {
    display: "inline-block",
    padding: "14px 25px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #00ffcc, #00c9ff)",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
    boxShadow: "0 0 20px rgba(0,255,200,0.6)",
  },

  previewBox: {
    marginTop: "20px",
  },

  image: {
    width: "100%",
    borderRadius: "15px",
    boxShadow: "0 0 30px rgba(0,255,200,0.7)",
    animation: "float 4s ease-in-out infinite",
  },

  loading: {
    marginTop: "15px",
  },

  resultBox: {
    marginTop: "20px",
  },

  result: {
    fontSize: "1.6rem",
    textShadow: "0 0 20px #00ffcc",
    animation: "fadeIn 0.6s ease",
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
    background: "linear-gradient(90deg, #00ffcc, #00c9ff)",
    borderRadius: "5px",
    boxShadow: "0 0 15px #00ffcc",
    transition: "width 1s ease-in-out",
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
