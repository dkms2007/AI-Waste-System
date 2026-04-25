import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);

  const wasteInfo = {
    paper: {
      desc: "Paper waste includes newspapers, magazines, cardboard, and office paper.",
      disposal: "Recycle in dry waste bin. Avoid contamination with food or liquids."
    },
    plastic: {
      desc: "Plastic waste includes bottles, wrappers, and packaging materials.",
      disposal: "Clean and recycle. Avoid single-use plastics whenever possible."
    },
    metal: {
      desc: "Metal waste includes cans, tins, and aluminum products.",
      disposal: "Recycle through scrap collection or recycling centers."
    },
    glass: {
      desc: "Glass includes bottles, jars, and broken glass items.",
      disposal: "Recycle separately. Handle broken glass carefully."
    },
    organic: {
      desc: "Organic waste includes food scraps, leaves, and biodegradable materials.",
      disposal: "Compost at home or dispose in green waste bins."
    },
    e_waste: {
      desc: "Electronic waste includes old devices, batteries, and wires.",
      disposal: "Dispose at certified e-waste recycling centers only."
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/classify", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    setResult(data.class);
    setConfidence(data.confidence);
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>♻️ Waste Classifier AI</h1>
        <p style={styles.subtitle}>Smart Waste Detection System</p>

        <input type="file" onChange={handleUpload} style={styles.upload} />

        {preview && (
          <div style={styles.content}>
            
            {/* LEFT SIDE */}
            <div style={styles.left}>
              <img src={preview} style={styles.image} />

              {loading && <p style={styles.loading}>Analyzing...</p>}

              {result && (
                <>
                  <h2 style={styles.result}>♻️ {result.toUpperCase()}</h2>
                  <p style={styles.confidence}>
                    Confidence: {(confidence * 100).toFixed(2)}%
                  </p>
                  <div style={styles.bar}>
                    <div
                      style={{
                        ...styles.fill,
                        width: `${confidence * 100}%`
                      }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* RIGHT SIDE INFO PANEL */}
            {result && (
              <div style={styles.right}>
                <h3 style={styles.infoTitle}>📘 About</h3>
                <p style={styles.infoText}>
                  {wasteInfo[result?.toLowerCase()]?.desc || "General waste material."}
                </p>

                <h3 style={styles.infoTitle}>♻️ Disposal Method</h3>
                <p style={styles.infoText}>
                  {wasteInfo[result?.toLowerCase()]?.disposal || "Dispose responsibly."}
                </p>
              </div>
            )}

          </div>
        )}

        <p style={styles.footer}>
          Built by Aarush • Denisha • Dhairya • Gayatri • Zeel
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #0f2027, #203a43, #2c5364)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "sans-serif"
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    padding: "30px",
    borderRadius: "20px",
    backdropFilter: "blur(20px)",
    boxShadow: "0 0 40px rgba(0,255,200,0.3)",
    width: "900px",
    textAlign: "center"
  },
  title: {
    fontSize: "2rem",
    color: "#00ffd5"
  },
  subtitle: {
    color: "#ccc",
    marginBottom: "20px"
  },
  upload: {
    marginBottom: "20px"
  },
  content: {
    display: "flex",
    gap: "20px",
    marginTop: "20px"
  },
  left: {
    flex: 1
  },
  right: {
    flex: 1,
    textAlign: "left",
    background: "rgba(0,255,200,0.08)",
    padding: "20px",
    borderRadius: "15px",
    animation: "fadeIn 0.6s ease"
  },
  image: {
    width: "100%",
    borderRadius: "15px",
    boxShadow: "0 0 20px rgba(0,255,200,0.4)"
  },
  result: {
    color: "#00ffd5",
    marginTop: "10px"
  },
  confidence: {
    color: "#ccc"
  },
  bar: {
    height: "8px",
    background: "#333",
    borderRadius: "10px",
    marginTop: "10px"
  },
  fill: {
    height: "100%",
    background: "#00ffd5",
    borderRadius: "10px"
  },
  infoTitle: {
    color: "#00ffd5",
    marginTop: "10px"
  },
  infoText: {
    color: "#ddd",
    fontSize: "14px",
    marginBottom: "10px"
  },
  loading: {
    color: "#00ffd5"
  },
  footer: {
    marginTop: "20px",
    fontSize: "12px",
    color: "#aaa"
  }
};
