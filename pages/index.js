import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const [started, setStarted] = useState(false);

  const wasteInfo = {
    paper: "📄 Paper Waste\n\nRecyclable material.\n\n♻️ Dispose: Dry recycling bin.",
    plastic: "🧴 Plastic Waste\n\nNon-biodegradable.\n\n♻️ Dispose: Recycling center.",
    metal: "🔩 Metal Waste\n\nHighly recyclable.\n\n♻️ Dispose: Scrap dealer.",
    glass: "🍾 Glass Waste\n\n100% recyclable.\n\n♻️ Dispose: Glass bin.",
    organic: "🍃 Organic Waste\n\nBiodegradable.\n\n♻️ Dispose: Compost.",
    e_waste: "💻 E-Waste\n\nHazardous electronics.\n\n♻️ Dispose: Authorized center.",
    cardboard: "📦 Cardboard\n\nRecyclable.\n\n♻️ Dispose: Flatten + recycle.",
    trash: "🚮 General Waste\n\nNon-recyclable.\n\n♻️ Dispose: Landfill bin.",
  };

  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      img.onload = () => {
        canvas.width = 224;
        canvas.height = 224;
        ctx.drawImage(img, 0, 0, 224, 224);
        canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.7);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleUpload = async (e) => {
    if (loading) return;

    const file = e.target.files[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));
    setLoading(true);
    setResult("");
    setInfo("");

    const compressed = await resizeImage(file);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result.split(",")[1];

      const res = await fetch(
        "https://serverless.roboflow.com/waste-classification-lde94/2?api_key=NAKbDpcpDDmC5zBEczfN",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: base64Image,
        }
      );

      const data = await res.json();

      if (data.top) {
        const clean = data.top.toLowerCase();
        setResult("♻️ " + clean.replace("_", " ").toUpperCase());
        setConfidence((data.confidence * 100).toFixed(2));
        setInfo(wasteInfo[clean]);
      } else {
        setResult("Unable to classify");
      }

      setLoading(false);
    };

    reader.readAsDataURL(compressed);
  };

  return (
    <>
      <style>{`
        body { margin: 0; font-family: Inter, sans-serif; }

        @keyframes gradientMove {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={styles.bg}></div>

      {/* HERO */}
      {!started && (
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>♻️ Waste Classifier AI</h1>
          <p style={styles.heroSub}>
            Intelligent Waste Detection & Sustainable Disposal Guidance
          </p>

          <button style={styles.startBtn} onClick={() => setStarted(true)}>
            🚀 Start Classifying
          </button>
        </div>
      )}

      {/* MAIN APP */}
      {started && (
        <div style={styles.container}>
          {/* LEFT */}
          <div style={styles.card}>
            <h2>Upload Waste Image</h2>

            <label style={styles.upload}>
              <input type="file" hidden onChange={handleUpload} />
              ⬆ Upload
            </label>

            {image && <img src={image} style={styles.image} />}

            {loading && <p>🔄 Analyzing...</p>}

            {result && !loading && (
              <>
                <h2>{result}</h2>
                <p>Confidence: {confidence}%</p>

                <div style={styles.bar}>
                  <div
                    style={{ ...styles.fill, width: `${confidence}%` }}
                  ></div>
                </div>
              </>
            )}
          </div>

          {/* RIGHT */}
          {info && (
            <div style={styles.info}>
              <h3>🌱 Disposal Guide</h3>
              <p style={{ whiteSpace: "pre-line" }}>{info}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

const styles = {
  bg: {
    position: "fixed",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(-45deg, #0f2027, #203a43, #2c5364, #00c9ff)",
    backgroundSize: "400% 400%",
    animation: "gradientMove 15s infinite",
    zIndex: -1,
  },

  hero: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "white",
    animation: "fadeUp 1s ease",
  },

  heroTitle: {
    fontSize: "3rem",
    textShadow: "0 0 30px #00ffcc",
  },

  heroSub: {
    opacity: 0.7,
    marginBottom: "20px",
  },

  startBtn: {
    padding: "14px 30px",
    borderRadius: "10px",
    border: "none",
    background: "#00ffcc",
    fontWeight: "bold",
    cursor: "pointer",
  },

  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "30px",
    height: "100vh",
    color: "white",
  },

  card: {
    padding: "30px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    width: "350px",
    textAlign: "center",
  },

  info: {
    width: "280px",
    padding: "25px",
    borderRadius: "20px",
    background: "rgba(0,255,200,0.1)",
    backdropFilter: "blur(15px)",
  },

  upload: {
    padding: "10px 20px",
    background: "#00ffcc",
    color: "#000",
    borderRadius: "8px",
    cursor: "pointer",
  },

  image: {
    width: "100%",
    marginTop: "15px",
    borderRadius: "15px",
  },

  bar: {
    height: "8px",
    background: "#333",
    borderRadius: "5px",
    marginTop: "10px",
  },

  fill: {
    height: "100%",
    background: "#00ffcc",
  },
};
