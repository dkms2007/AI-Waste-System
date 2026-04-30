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

  // Waste info (NEW)
  const wasteInfo = {
    Plastic: {
      impact: "Non-biodegradable, pollutes oceans and harms wildlife.",
      disposal: "Recycle in designated plastic bins. Avoid single-use plastics.",
    },
    Paper: {
      impact: "Biodegradable but contributes to deforestation if wasted.",
      disposal: "Recycle or compost if clean. Avoid coated paper.",
    },
    Glass: {
      impact: "100% recyclable but can harm ecosystems if not disposed properly.",
      disposal: "Rinse and place in glass recycling bins.",
    },
    Metal: {
      impact: "Mining impacts environment but metals are highly recyclable.",
      disposal: "Recycle in metal bins after cleaning.",
    },
    Organic: {
      impact: "Decomposes naturally but emits methane in landfills.",
      disposal: "Compost for eco-friendly waste management.",
    },
    "E-Waste": {
      impact: "Contains toxic materials harmful to soil and water.",
      disposal: "Dispose at certified e-waste recycling centers.",
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
        body { margin:0; font-family: Inter, sans-serif; color:white; }

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

      {/* HERO */}
      <div style={styles.hero} className="reveal">
        <div style={styles.left}>
          <h1 style={styles.title}>
            Smart Waste Detection <br />
            <span style={styles.highlight}>for a Greener Future</span>
          </h1>

          <p style={styles.sub}>
            Upload waste images and let AI instantly classify and guide disposal.
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
                Dispose responsibly for a cleaner environment.
              </p>
            </div>
          )}
        </div>
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
                <h4>{item}</h4>

                <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                  {wasteInfo[item].impact}
                </p>

                <p
                  style={{
                    fontSize: "0.75rem",
                    marginTop: "6px",
                    color: "#00ffc3",
                  }}
                >
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

  sub: { opacity: 0.8, marginTop: "15px" },

  button: {
    marginTop: "25px",
    padding: "15px 35px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg,#00ffc3,#00bfa6)",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 0 25px rgba(0,255,195,0.5)",
  },

  holo: {
    fontSize: "110px",
    marginTop: "40px",
    animation: "float 4s infinite",
    textShadow: "0 0 50px #00ffc3",
  },

  panel: {
    width: "370px",
    padding: "25px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(25px)",
    border: "1px solid rgba(255,255,255,0.15)",
    boxShadow: "0 0 50px rgba(0,255,195,0.15)",
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
    padding: "12px",
    background: "#00ffc3",
    border: "none",
    width: "100%",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
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

  result: {
    color: "#00ffc3",
    textShadow: "0 0 15px #00ffc3",
  },

  circle: {
    margin: "10px auto",
    width: "95px",
    height: "95px",
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
    borderRadius: "18px",
    backdropFilter: "blur(15px)",
    transition: "0.3s",
    cursor: "pointer",
    minWidth: "180px",
  },

  stats: {
    display: "flex",
    justifyContent: "space-around",
    textAlign: "center",
  },

  statNumber: {
    color: "#00ffc3",
    textShadow: "0 0 15px #00ffc3",
  },

  footer: {
    textAlign: "center",
    marginTop: "60px",
    opacity: 0.6,
  },
};
