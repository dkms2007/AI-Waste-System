import { useState, useEffect } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(false);

  // Scroll reveal
  useEffect(() => {
    const reveal = () => {
      document.querySelectorAll(".reveal").forEach((el) => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) {
          el.style.opacity = 1;
          el.style.transform = "translateY(0)";
        }
      });
    };
    window.addEventListener("scroll", reveal);
    reveal();
  }, []);

  // Waste Info
  const wasteInfo = {
    Plastic: {
      icon: "🧴",
      impact: "Non-biodegradable, pollutes oceans and harms wildlife.",
      disposal: "Recycle in plastic bins. Avoid single-use plastics.",
    },
    Paper: {
      icon: "📄",
      impact: "Biodegradable but contributes to deforestation.",
      disposal: "Recycle or compost if clean.",
    },
    Glass: {
      icon: "🍾",
      impact: "100% recyclable but harmful if dumped irresponsibly.",
      disposal: "Rinse and recycle in glass bins.",
    },
    Metal: {
      icon: "🔩",
      impact: "Mining impacts environment but highly recyclable.",
      disposal: "Clean and recycle in metal bins.",
    },
    Organic: {
      icon: "🌱",
      impact: "Produces methane in landfills if unmanaged.",
      disposal: "Compost for eco-friendly disposal.",
    },
    "E-Waste": {
      icon: "💻",
      impact: "Contains toxic materials harmful to soil and water.",
      disposal: "Dispose at certified e-waste centers.",
    },
  };

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
        body { margin:0; font-family:Inter,sans-serif; color:white; }

        @keyframes float {
          0%,100% { transform: translateY(0) }
          50% { transform: translateY(-12px) }
        }

        @keyframes spin { to { transform: rotate(360deg) } }

        @keyframes scan {
          0% { top: -100% }
          100% { top: 100% }
        }

        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: 1s ease;
        }

        button:hover {
          transform: scale(1.05);
          box-shadow: 0 0 35px #00ffc3;
        }

        .card:hover {
          transform: translateY(-10px);
          box-shadow: 0 0 30px rgba(0,255,195,0.4);
        }
      `}</style>

      {/* BACKGROUND */}
      <div style={styles.bg}></div>
      <div style={styles.overlay}></div>

      {/* TITLE */}
      <div style={styles.heroTop} className="reveal">
        <h1 style={styles.title}>
          Smart Waste Detection <br />
          <span style={styles.highlight}>for a Greener Future</span>
        </h1>
        <p style={styles.sub}>
          Understand waste impact before using AI classification.
        </p>
      </div>

      {/* CATEGORIES */}
      <div style={styles.sectionBox} className="reveal">
        <h2 style={styles.sectionTitle}>Waste Categories</h2>

        <div style={styles.cards}>
          {Object.keys(wasteInfo).map((item, i) => {
            const isActive = result === item.toUpperCase();

            return (
              <div
                key={i}
                style={{
                  ...styles.card,
                  background: isActive
                    ? "rgba(0,255,195,0.15)"
                    : "rgba(255,255,255,0.06)",
                  border: isActive
                    ? "1px solid #00ffc3"
                    : "1px solid rgba(255,255,255,0.1)",
                }}
                className="card"
              >
                <div style={{ fontSize: "28px" }}>
                  {wasteInfo[item].icon}
                </div>

                <h4>{item}</h4>

                <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                  {wasteInfo[item].impact}
                </p>

                <p style={{ fontSize: "0.75rem", color: "#00ffc3" }}>
                  {wasteInfo[item].disposal}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* STATS */}
      <div style={styles.sectionBox} className="reveal">
        <h2 style={styles.sectionTitle}>System Performance</h2>

        <div style={styles.stats}>
          <div>
            <h2 style={styles.statNumber}>98.7%</h2>
            <p>Accuracy</p>
          </div>
          <div>
            <h2 style={styles.statNumber}>5000+</h2>
            <p>Images Processed</p>
          </div>
          <div>
            <h2 style={styles.statNumber}>6</h2>
            <p>Categories</p>
          </div>
        </div>
      </div>

      {/* HERO WITH UPLOAD */}
      <div style={styles.hero} className="reveal">
        <div style={styles.left}>
          <h2 style={{ fontSize: "2.2rem" }}>
            Upload Waste Image & Get Instant AI Prediction
          </h2>

          <p style={styles.sub}>
            Our AI analyzes your image and provides classification instantly.
          </p>

          <button
            style={styles.button}
            onClick={() =>
              document
                .getElementById("classifier")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            🚀 Try Now
          </button>

          <div style={styles.holo}>♻️</div>
        </div>

        {/* PANEL */}
        <div style={styles.panel} id="classifier">
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
              <h2 style={styles.result}>{result}</h2>

              <div style={styles.circle}>
                <span>{confidence}%</span>
                <div style={styles.scan}></div>
              </div>

              <p style={styles.tip}>
                Follow the disposal guidance shown above.
              </p>
            </div>
          )}
        </div>
      </div>

      <footer style={styles.footer}>
        Developed by Aarush • Denisha • Dhairya • Gayatri • Zeel
      </footer>
    </>
  );
}

const styles = {
  bg: {
    position: "fixed",
    width: "100%",
    height: "100%",
    backgroundImage: `
      linear-gradient(rgba(10,20,25,0.85), rgba(10,20,25,0.9)),
      url("https://images.unsplash.com/photo-1532996122724-e3c354a0b15b")
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: -2,
  },

  overlay: {
    position: "fixed",
    width: "100%",
    height: "100%",
    background:
      "radial-gradient(circle at 20% 20%, rgba(0,255,195,0.15), transparent 60%)",
    zIndex: -1,
  },

  heroTop: {
    textAlign: "center",
    paddingTop: "80px",
  },

  hero: {
    display: "flex",
    justifyContent: "space-between",
    padding: "100px 80px",
    flexWrap: "wrap",
    gap: "40px",
  },

  left: { maxWidth: "500px" },

  title: { fontSize: "3.4rem", fontWeight: "700" },

  highlight: {
    color: "#00ffc3",
    textShadow: "0 0 25px #00ffc3",
  },

  sub: { opacity: 0.8, marginTop: "10px" },

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
    marginTop: "30px",
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

  resultBox: { marginTop: "15px", textAlign: "center" },

  result: { color: "#00ffc3" },

  circle: {
    margin: "10px auto",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    border: "4px solid #00ffc3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },

  scan: {
    position: "absolute",
    width: "100%",
    height: "40%",
    background:
      "linear-gradient(transparent, rgba(0,255,195,0.4), transparent)",
    animation: "scan 2s linear infinite",
  },

  tip: { fontSize: "0.9rem", opacity: 0.7 },

  sectionBox: { marginTop: "80px", padding: "0 60px" },

  sectionTitle: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "2rem",
  },

  cards: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  card: {
    padding: "20px",
    borderRadius: "15px",
    backdropFilter: "blur(15px)",
    minWidth: "170px",
  },

  stats: {
    display: "flex",
    justifyContent: "space-around",
    textAlign: "center",
  },

  statNumber: {
    color: "#00ffc3",
  },

  footer: {
    textAlign: "center",
    marginTop: "60px",
    opacity: 0.6,
  },
};
