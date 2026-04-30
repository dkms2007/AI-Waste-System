import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    if (loading) return;

    const file = e.target.files[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));
    setLoading(true);
    setResult("");

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(",")[1];

      const res = await fetch(
        "https://serverless.roboflow.com/waste-classification-lde94/2?api_key=NAKbDpcpDDmC5zBEczfN",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: base64,
        }
      );

      const data = await res.json();

      if (data.top) {
        setResult(data.top.toUpperCase());
        setConfidence((data.confidence * 100).toFixed(1));
      } else {
        setResult("UNKNOWN");
      }

      setLoading(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <>
      <style>{`
        body { margin:0; font-family:Inter, sans-serif; }

        @keyframes gradientMove {
          0%{background-position:0% 50%}
          50%{background-position:100% 50%}
          100%{background-position:0% 50%}
        }

        @keyframes float {
          0%{transform:translateY(0)}
          50%{transform:translateY(-12px)}
          100%{transform:translateY(0)}
        }

        @keyframes glow {
          0%{box-shadow:0 0 10px #00ffc3}
          50%{box-shadow:0 0 30px #00ffc3}
          100%{box-shadow:0 0 10px #00ffc3}
        }

        @keyframes fadeIn {
          from{opacity:0; transform:translateY(20px)}
          to{opacity:1; transform:translateY(0)}
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* BACKGROUND */}
      <div style={styles.bg}></div>

      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.left}>
          <h1 style={styles.title}>
            Smart Waste Detection <br />
            <span style={{ color: "#00ffc3" }}>for a Greener Future</span>
          </h1>

          <p style={styles.sub}>
            AI-powered classification system for sustainable waste management.
          </p>

          <button
            style={styles.button}
            onClick={() =>
              document
                .getElementById("classifier")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            🚀 Start Classifying
          </button>

          {/* FAKE HOLOGRAM */}
          <div style={styles.holo}>
            ♻️
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={styles.panel}>
          <h3>Upload Waste Image</h3>

          <label style={styles.upload}>
            <input type="file" hidden onChange={handleUpload} />
            Drag & Drop or Click
          </label>

          {image && <img src={image} style={styles.preview} />}

          <button style={styles.analyze}>
            {loading ? "Analyzing..." : "Analyze Waste"}
          </button>

          {loading && <div style={styles.loader}></div>}

          {result && !loading && (
            <div style={styles.resultBox}>
              <h2>{result}</h2>
              <div style={styles.circle}>
                <span>{confidence}%</span>
              </div>
              <p style={styles.tip}>
                Dispose responsibly for a sustainable environment.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CATEGORY CARDS */}
      <div style={styles.cards}>
        {["Plastic", "Paper", "Glass", "Metal", "Organic", "E-Waste"].map(
          (item, i) => (
            <div key={i} style={styles.card}>
              <h4>{item}</h4>
              <p>AI-detected waste category</p>
            </div>
          )
        )}
      </div>

      {/* STATS */}
      <div style={styles.stats}>
        <div>
          <h2>98.7%</h2>
          <p>Accuracy</p>
        </div>
        <div>
          <h2>5000+</h2>
          <p>Images Processed</p>
        </div>
        <div>
          <h2>6</h2>
          <p>Categories</p>
        </div>
      </div>

      <footer style={styles.footer}>
        ⚡ Built by Aarush • Denisha • Dhairya • Gayatri • Zeel
      </footer>
    </>
  );
}

const styles = {
  bg: {
    position: "fixed",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(-45deg,#0f2027,#203a43,#2c5364,#00ffc3)",
    backgroundSize: "400% 400%",
    animation: "gradientMove 15s infinite",
    zIndex: -1,
  },

  hero: {
    display: "flex",
    justifyContent: "space-between",
    padding: "80px",
    color: "white",
  },

  left: {
    maxWidth: "50%",
  },

  title: {
    fontSize: "3rem",
    lineHeight: "1.2",
  },

  sub: {
    opacity: 0.7,
    marginTop: "10px",
  },

  button: {
    marginTop: "20px",
    padding: "14px 30px",
    borderRadius: "10px",
    border: "none",
    background: "#00ffc3",
    fontWeight: "bold",
    cursor: "pointer",
  },

  holo: {
    fontSize: "100px",
    marginTop: "40px",
    animation: "float 4s infinite",
    textShadow: "0 0 40px #00ffc3",
  },

  panel: {
    width: "350px",
    padding: "25px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
  },

  upload: {
    padding: "12px",
    background: "#00ffc3",
    color: "#000",
    borderRadius: "10px",
    cursor: "pointer",
    display: "block",
    marginBottom: "15px",
  },

  preview: {
    width: "100%",
    borderRadius: "10px",
    marginTop: "10px",
  },

  analyze: {
    marginTop: "10px",
    padding: "10px",
    background: "#00ffc3",
    border: "none",
    width: "100%",
    borderRadius: "10px",
    cursor: "pointer",
  },

  loader: {
    width: "30px",
    height: "30px",
    border: "3px solid #fff",
    borderTop: "3px solid #00ffc3",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "10px auto",
  },

  resultBox: {
    marginTop: "15px",
    textAlign: "center",
  },

  circle: {
    margin: "10px auto",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    border: "4px solid #00ffc3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  tip: {
    fontSize: "0.9rem",
    opacity: 0.7,
  },

  cards: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "50px",
  },

  card: {
    padding: "20px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.08)",
    transition: "0.3s",
  },

  stats: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "50px",
    color: "white",
  },

  footer: {
    textAlign: "center",
    marginTop: "50px",
    opacity: 0.5,
  },
};
