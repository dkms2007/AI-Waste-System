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

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64Image = reader.result.split(",")[1];

      try {
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
          setResult(data.top.toUpperCase());
          setConfidence((data.confidence * 100).toFixed(2));
        } else {
          setResult("UNABLE TO CLASSIFY");
        }
      } catch {
        setResult("ERROR");
      }

      setLoading(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
          background: #0b0f1a;
          font-family: 'Inter', sans-serif;
        }

        @keyframes gradientMove {
          0% {background-position: 0% 50%}
          50% {background-position: 100% 50%}
          100% {background-position: 0% 50%}
        }

        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes glow {
          0% { box-shadow: 0 0 10px #00ffcc; }
          50% { box-shadow: 0 0 25px #00ffcc; }
          100% { box-shadow: 0 0 10px #00ffcc; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* PARTICLES */
        .particles span {
          position: absolute;
          display: block;
          width: 4px;
          height: 4px;
          background: #00ffcc;
          border-radius: 50%;
          animation: float 6s infinite;
          opacity: 0.4;
        }

        .particles span:nth-child(1){ top:20%; left:10%; animation-delay:0s;}
        .particles span:nth-child(2){ top:40%; left:80%; animation-delay:1s;}
        .particles span:nth-child(3){ top:70%; left:30%; animation-delay:2s;}
        .particles span:nth-child(4){ top:60%; left:60%; animation-delay:3s;}
        .particles span:nth-child(5){ top:30%; left:50%; animation-delay:4s;}

      `}</style>

      <div style={styles.page}>

        {/* BACKGROUND */}
        <div style={styles.bg}></div>

        {/* PARTICLES */}
        <div className="particles">
          <span></span><span></span><span></span><span></span><span></span>
        </div>

        {/* HERO */}
        <div style={styles.hero}>
          <h1 style={styles.title}>
            Smart Waste Detection <br />
            <span style={{ color: "#00ffcc" }}>for a Greener Future</span>
          </h1>
          <p style={styles.subtitle}>
            AI-powered waste classification for smarter recycling decisions
          </p>
        </div>

        {/* MAIN CARD */}
        <div style={styles.card}>
          <h2 style={styles.heading}>Upload Waste Image</h2>

          <label style={styles.upload}>
            <input type="file" hidden onChange={handleUpload} />
            Drag & Drop or Click
          </label>

          {image && <img src={image} style={styles.image} />}

          <button style={styles.analyzeBtn}>Analyze Waste</button>

          {loading && (
            <div style={styles.loaderBox}>
              <div style={styles.spinner}></div>
              <p>Analyzing...</p>
            </div>
          )}

          {result && !loading && (
            <div style={styles.resultBox}>
              <h2 style={styles.result}>{result}</h2>
              <p>Confidence: {confidence}%</p>

              <div style={styles.circle}>
                {confidence}%
              </div>

              <p style={styles.tip}>
                Dispose responsibly for a cleaner environment 🌍
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <footer style={styles.footer}>
          ⚡ Built by Aarush • Denisha • Dhairya • Gayatri • Zeel
        </footer>

      </div>
    </>
  );
}

const styles = {
  page: {
    height: "100vh",
    color: "white",
    position: "relative",
    overflow: "hidden",
  },

  bg: {
    position: "absolute",
    width: "200%",
    height: "200%",
    background:
      "linear-gradient(-45deg, #0f2027, #203a43, #2c5364)",
    backgroundSize: "400% 400%",
    animation: "gradientMove 20s ease infinite",
    filter: "blur(80px)",
    zIndex: 0,
  },

  hero: {
    position: "relative",
    textAlign: "center",
    marginTop: "60px",
    zIndex: 2,
    animation: "fadeIn 1s ease",
  },

  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
  },

  subtitle: {
    opacity: 0.7,
    marginTop: "10px",
  },

  card: {
    position: "relative",
    margin: "40px auto",
    width: "350px",
    padding: "30px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)",
    textAlign: "center",
    zIndex: 2,
    animation: "fadeIn 1.2s ease",
  },

  heading: {
    marginBottom: "15px",
  },

  upload: {
    display: "block",
    padding: "12px",
    borderRadius: "10px",
    background: "#00ffcc",
    color: "#000",
    cursor: "pointer",
    marginBottom: "15px",
    transition: "0.3s",
  },

  image: {
    width: "100%",
    borderRadius: "10px",
    marginBottom: "15px",
    animation: "float 4s ease-in-out infinite",
  },

  analyzeBtn: {
    padding: "10px",
    borderRadius: "10px",
    background: "#00ffcc",
    border: "none",
    cursor: "pointer",
    width: "100%",
    fontWeight: "bold",
    animation: "glow 2s infinite",
  },

  loaderBox: {
    marginTop: "15px",
  },

  spinner: {
    width: "30px",
    height: "30px",
    border: "3px solid rgba(255,255,255,0.3)",
    borderTop: "3px solid #00ffcc",
    borderRadius: "50%",
    margin: "auto",
    animation: "spin 1s linear infinite",
  },

  resultBox: {
    marginTop: "20px",
  },

  result: {
    fontSize: "1.5rem",
    color: "#00ffcc",
  },

  circle: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    border: "3px solid #00ffcc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "10px auto",
    animation: "glow 2s infinite",
  },

  tip: {
    fontSize: "0.9rem",
    opacity: 0.8,
  },

  footer: {
    position: "absolute",
    bottom: "10px",
    width: "100%",
    textAlign: "center",
    fontSize: "0.8rem",
    opacity: 0.5,
  },
};
