import { useState, useEffect } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(false);

  // Particle animation
  useEffect(() => {
    const canvas = document.getElementById("particles");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2,
      dx: Math.random() - 0.5,
      dy: Math.random() - 0.5,
    }));

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,255,200,0.6)";
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }

    animate();
  }, []);

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
    } catch (error) {
      console.error(error);
      setResult("Error connecting to model");
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <canvas id="particles" style={styles.canvas}></canvas>

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
            <h2 style={styles.glow}>{result}</h2>
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
    overflow: "hidden",
    background:
      "linear-gradient(-45deg, #0f2027, #203a43, #2c5364, #00c9ff)",
    backgroundSize: "400% 400%",
    animation: "gradientMove 12s ease infinite",
    color: "white",
    fontFamily: "sans-serif",
    position: "relative",
  },
  canvas: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  container: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    paddingTop: "60px",
    backdropFilter: "blur(10px)",
  },
  title: {
    fontSize: "3rem",
    textShadow: "0 0 20px rgba(0,255,200,0.8)",
  },
  subtitle: {
    opacity: 0.8,
    marginBottom: "30px",
  },
  uploadBox: {
    display: "inline-block",
    padding: "12px 25px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    cursor: "pointer",
    boxShadow: "0 0 15px rgba(0,255,200,0.3)",
    transition: "0.3s",
  },
  image: {
    width: "300px",
    borderRadius: "15px",
    marginTop: "20px",
    boxShadow: "0 0 25px rgba(0,255,200,0.5)",
  },
  loading: {
    marginTop: "20px",
    fontSize: "1.2rem",
  },
  resultBox: {
    marginTop: "20px",
  },
  glow: {
    textShadow: "0 0 15px #00ffcc",
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
    boxShadow: "0 0 10px #00ffcc",
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
