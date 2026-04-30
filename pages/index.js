import { useState, useRef } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(false);

  const classifyRef = useRef(null);
  const descRef = useRef(null);

  const wasteTypes = [
    {
      name: "Plastic",
      img: "https://images.unsplash.com/photo-1581579188871-45ea61f2a5a8",
      desc: "Non-biodegradable material. Takes hundreds of years to decompose.",
    },
    {
      name: "Paper",
      img: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0",
      desc: "Biodegradable and recyclable material made from wood pulp.",
    },
    {
      name: "Glass",
      img: "https://images.unsplash.com/photo-1604908176997-43195d99d36d",
      desc: "100% recyclable material that can be reused indefinitely.",
    },
    {
      name: "Metal",
      img: "https://images.unsplash.com/photo-1581092919534-7c4c6b28c13d",
      desc: "Highly recyclable materials like aluminum and steel.",
    },
    {
      name: "Organic",
      img: "https://images.unsplash.com/photo-1587049352851-8d4e89133924",
      desc: "Biodegradable waste like food scraps and plant matter.",
    },
    {
      name: "E-Waste",
      img: "https://images.unsplash.com/photo-1581091870622-1e7d3d3b2f4d",
      desc: "Electronic waste that requires specialized disposal.",
    },
  ];

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
        setResult(data.top.toUpperCase());
        setConfidence((data.confidence * 100).toFixed(2));
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
        body { margin:0; font-family:Inter, sans-serif; scroll-behavior:smooth; }

        @keyframes fadeUp {
          from {opacity:0; transform:translateY(40px);}
          to {opacity:1; transform:translateY(0);}
        }

        @keyframes gradientMove {
          0% {background-position:0% 50%}
          50% {background-position:100% 50%}
          100% {background-position:0% 50%}
        }
      `}</style>

      {/* BACKGROUND */}
      <div style={styles.bg}></div>

      {/* HERO */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>♻️ Waste Classifier AI</h1>
        <p style={styles.heroSub}>
          Smart Waste Detection & Sustainable Future
        </p>

        <div style={styles.buttons}>
          <button onClick={() => descRef.current.scrollIntoView()}>
            📘 Description
          </button>
          <button onClick={() => classifyRef.current.scrollIntoView()}>
            🚀 Classification
          </button>
        </div>
      </div>

      {/* DESCRIPTION SECTION */}
      <div ref={descRef} style={styles.section}>
        <h2>📘 Project Description</h2>
        <p style={styles.text}>
          This AI system uses a trained deep learning model to classify waste
          into categories such as plastic, paper, metal, glass, and more. The
          model is trained on thousands of labeled images and achieves high
          accuracy in real-world scenarios.
        </p>

        <h3>Waste Categories</h3>

        <div style={styles.grid}>
          {wasteTypes.map((item, i) => (
            <div key={i} style={styles.card}>
              <img src={item.img} style={styles.cardImg} />
              <h4>{item.name}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>

        <button
          style={styles.bottomBtn}
          onClick={() => classifyRef.current.scrollIntoView()}
        >
          🚀 Go to Classification
        </button>
      </div>

      {/* CLASSIFICATION SECTION */}
      <div ref={classifyRef} style={styles.section}>
        <h2>🔍 Classification Model</h2>

        <label style={styles.upload}>
          <input type="file" hidden onChange={handleUpload} />
          Upload Image
        </label>

        {image && <img src={image} style={styles.image} />}

        {loading && <p>Analyzing...</p>}

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
      "linear-gradient(-45deg,#0f2027,#203a43,#2c5364,#00c9ff)",
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
    color: "white",
    textAlign: "center",
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

  buttons: {
    display: "flex",
    gap: "20px",
  },

  section: {
    padding: "60px 10%",
    color: "white",
    textAlign: "center",
  },

  text: {
    maxWidth: "700px",
    margin: "auto",
    opacity: 0.8,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
    gap: "20px",
    marginTop: "30px",
  },

  card: {
    background: "rgba(255,255,255,0.08)",
    padding: "15px",
    borderRadius: "15px",
    backdropFilter: "blur(10px)",
  },

  cardImg: {
    width: "100%",
    borderRadius: "10px",
  },

  bottomBtn: {
    marginTop: "30px",
    padding: "12px 25px",
    background: "#00ffcc",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
  },

  upload: {
    padding: "10px 20px",
    background: "#00ffcc",
    borderRadius: "10px",
    cursor: "pointer",
  },

  image: {
    width: "300px",
    marginTop: "20px",
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

  footer: {
    textAlign: "center",
    padding: "20px",
    color: "white",
    opacity: 0.5,
  },
};
