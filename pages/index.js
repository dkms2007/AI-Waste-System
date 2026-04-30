import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  // 🧠 Waste Info Database (FAST, NO API DELAY)
  const wasteInfo = {
    paper: "📄 Paper Waste\n\nRecyclable material made from wood pulp.\n\n♻️ Dispose: Put in dry recycling bin. Keep it clean and dry.",
    plastic: "🧴 Plastic Waste\n\nNon-biodegradable synthetic material.\n\n♻️ Dispose: Recycle if possible. Avoid burning. Use plastic collection centers.",
    metal: "🔩 Metal Waste\n\nIncludes aluminum, steel etc.\n\n♻️ Dispose: Send to scrap dealer or recycling facility.",
    glass: "🍾 Glass Waste\n\n100% recyclable material.\n\n♻️ Dispose: Place in glass recycling bins. Do not mix with regular waste.",
    organic: "🍃 Organic Waste\n\nBiodegradable food/natural waste.\n\n♻️ Dispose: Compost it for eco-friendly use.",
    e_waste: "💻 E-Waste\n\nElectronic waste like phones, batteries.\n\n♻️ Dispose: Take to authorized e-waste centers.",
    cardboard: "📦 Cardboard\n\nRecyclable packaging material.\n\n♻️ Dispose: Flatten and put in dry waste recycling.",
    trash: "🚮 General Waste\n\nNon-recyclable material.\n\n♻️ Dispose: Use landfill bin responsibly.",
  };

  // ⚡ Image Resize (SPEED BOOST)
  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      img.onload = () => {
        const size = 224;
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);

        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg", 0.7);
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
    setConfidence(0);
    setInfo("");

    try {
      const compressed = await resizeImage(file);

      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Image = reader.result.split(",")[1];

        const controller = new AbortController();
        setTimeout(() => controller.abort(), 15000);

        const res = await fetch(
          "https://serverless.roboflow.com/waste-classification-lde94/2?api_key=NAKbDpcpDDmC5zBEczfN",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: base64Image,
            signal: controller.signal,
          }
        );

        const data = await res.json();

        if (data.top) {
          const clean = data.top.toLowerCase();
          setResult("♻️ " + clean.replace("_", " ").toUpperCase());
          setConfidence((data.confidence * 100).toFixed(2));

          // 🧠 Instant info load (NO delay)
          setInfo(wasteInfo[clean] || "No info available");
        } else {
          setResult("Unable to classify");
        }

        setLoading(false);
      };

      reader.readAsDataURL(compressed);
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
          50% { transform: translateY(-10px) }
          100% { transform: translateY(0px) }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowPulse {
          0% { box-shadow: 0 0 10px #00ffcc }
          50% { box-shadow: 0 0 25px #00ffcc }
          100% { box-shadow: 0 0 10px #00ffcc }
        }
      `}</style>

      <div style={styles.page}>
        <div style={styles.bg}></div>

        <div style={styles.wrapper}>
          {/* LEFT CARD */}
          <div style={styles.card}>
            <h1 style={styles.title}>♻️ Waste Classifier AI</h1>
            <p style={styles.subtitle}>Smart Vision • Clean Future</p>

            <label style={styles.upload}>
              <input type="file" hidden onChange={handleUpload} />
              ⬆ Upload Waste Image
            </label>

            {image && (
              <div style={styles.previewBox}>
                <img src={image} style={styles.image} />
              </div>
            )}

            {loading && (
              <div style={styles.loaderBox}>
                <div style={styles.spinner}></div>
                <p>Analyzing with AI...</p>
              </div>
            )}

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

          {/* RIGHT PANEL */}
          {info && !loading && (
            <div style={styles.infoCard}>
              <h2>♻️ Disposal Guide</h2>
              <p style={{ whiteSpace: "pre-line" }}>{info}</p>
            </div>
          )}
        </div>

        <footer style={styles.footer}>
          ⚡ Built by Aarush • Denisha • Dhairya • Gayatri • Zeel
        </footer>
      </div>
    </>
  );
}

const styles = {
  page: { height: "100vh", color: "white", position: "relative" },

  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "30px",
    height: "100%",
  },

  bg: {
    position: "absolute",
    width: "200%",
    height: "200%",
    background:
      "radial-gradient(circle at 20% 20%, #00ffcc33, transparent), linear-gradient(-45deg, #0f2027, #203a43, #2c5364)",
    animation: "gradientMove 18s infinite",
    filter: "blur(80px)",
  },

  card: {
    width: "400px",
    padding: "35px",
    borderRadius: "25px",
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(20px)",
    textAlign: "center",
  },

  infoCard: {
    width: "300px",
    padding: "25px",
    borderRadius: "20px",
    background: "rgba(0,255,200,0.08)",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(0,255,200,0.3)",
  },

  upload: {
    padding: "12px 20px",
    background: "#00ffcc",
    color: "#000",
    borderRadius: "10px",
    cursor: "pointer",
  },

  image: {
    width: "100%",
    borderRadius: "15px",
    animation: "float 4s infinite",
  },

  fill: {
    height: "100%",
    background: "#00ffcc",
  },

  footer: {
    position: "absolute",
    bottom: "10px",
    width: "100%",
    textAlign: "center",
    opacity: 0.5,
  },
};
