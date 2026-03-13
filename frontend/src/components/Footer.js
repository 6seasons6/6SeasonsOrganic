import React from "react";

const Footer = () => {
  const [visitorCount, setVisitorCount] = React.useState(11098);
  const [animatedCount, setAnimatedCount] = React.useState(1);

  React.useEffect(() => {
    // Increment visitor count on page load
    fetch("http://localhost:5000/api/visitor/increment", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.count) setVisitorCount(data.count);
      });
  }, []);

  React.useEffect(() => {
    if (visitorCount > 1) {
      let start = 1;
      const duration = 1200; // ms
      const frameRate = 30; // ms
      const totalFrames = Math.ceil(duration / frameRate);
      const increment = (visitorCount - start) / totalFrames;
      let current = start;
      let frame = 0;
      const timer = setInterval(() => {
        frame++;
        current += increment;
        if (frame >= totalFrames) {
          setAnimatedCount(visitorCount);
          clearInterval(timer);
        } else {
          setAnimatedCount(Math.floor(current));
        }
      }, frameRate);
      return () => clearInterval(timer);
    } else {
      setAnimatedCount(visitorCount);
    }
  }, [visitorCount]);

  React.useEffect(() => {
    // Increment visitor count on page load
    fetch("http://localhost:5000/api/visitor/increment", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.count) setVisitorCount(data.count);
      });
  }, []);
  const [newsletterEmail, setNewsletterEmail] = React.useState("");
  const [newsletterStatus, setNewsletterStatus] = React.useState("");

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterStatus("");
    if (!newsletterEmail) {
      setNewsletterStatus("Please enter your email.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewsletterStatus("Subscribed successfully!");
        setNewsletterEmail("");
      } else {
        setNewsletterStatus(data.error || "Subscription failed.");
      }
    } catch {
      setNewsletterStatus("Server error. Please try again later.");
    }
  };

  return (
    <footer
      style={{
        background: "linear-gradient(90deg, #f7faf5 70%, #eaffd0 100%)",
        color: "#222",
        padding: "3.5rem 0 2rem 0",
        marginTop: 40,
        borderTop: "3px solid #6cb33f",
        fontFamily: "inherit",
        boxShadow: "0 -2px 24px 0 rgba(108,179,63,0.13)",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 1rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr 1fr",
            gap: 48,
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          {/* Left: 6Seasons Organic + description */}
          <div style={{ minWidth: 240, textAlign: "left" }}>
            <h3
              style={{
                color: "#388e3c",
                fontWeight: 900,
                fontSize: 32,
                letterSpacing: 1.5,
                marginBottom: 10,
              }}
            >
              6Seasons Organic
            </h3>
            <p
              style={{
                fontSize: 19,
                color: "#333",
                margin: "0 0 18px 0",
                lineHeight: 1.8,
                fontWeight: 500,
                maxWidth: 340,
              }}
            >
              At 6seasonsorganic, we bring you the finest organic products,
              cultivated with care and packed with goodness. Experience the
              essence of nature in every bite and transform your lifestyle with
              our wholesome offerings.
            </p>
          </div>
          {/* Middle: Newsletter + business timings */}
          <div style={{ textAlign: "center" }}>
            <h4
              style={{
                color: "#388e3c",
                fontWeight: 900,
                fontSize: 24,
                marginBottom: 12,
              }}
            >
              Subscribe to Our Newsletter
            </h4>
            <form
              onSubmit={handleNewsletterSubmit}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 12,
                marginBottom: 10,
              }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                style={{
                  padding: "10px 18px",
                  fontSize: 17,
                  borderRadius: 8,
                  border: "1.5px solid #6cb33f",
                  outline: "none",
                  width: 220,
                }}
              />
              <button
                type="submit"
                style={{
                  background:
                    "linear-gradient(90deg, #6cb33f 60%, #ffe066 100%)",
                  color: "#222",
                  fontWeight: 900,
                  fontSize: 17,
                  borderRadius: 8,
                  border: "none",
                  padding: "10px 28px",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(108,179,63,0.10)",
                }}
              >
                Subscribe
              </button>
            </form>
            {newsletterStatus && (
              <div
                style={{
                  fontSize: 15,
                  color: newsletterStatus.includes("success")
                    ? "#388e3c"
                    : "#d32f2f",
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                {newsletterStatus}
              </div>
            )}
            <div
              style={{
                fontSize: 15,
                color: "#388e3c",
                fontWeight: 600,
                marginBottom: 18,
              }}
            >
              Get updates on new products, offers, and organic tips!
            </div>
            <div
              style={{
                fontSize: 17,
                color: "#6cb33f",
                fontWeight: 600,
                marginTop: 10,
              }}
            >
              <b>Business Time:</b>
              <br />
              Mon-Fri: 08.00am to 05.00pm
              <br />
              Saturday: 10.00am to 08.00pm
              <br />
              Sunday: Closed
            </div>
          </div>
          {/* Right: Contact Us + Information */}
          <div style={{ minWidth: 220 }}>
            <h4
              style={{
                color: "#388e3c",
                fontWeight: 900,
                fontSize: 24,
                marginBottom: 12,
              }}
            >
              Contact Us
            </h4>
            <div
              style={{
                fontSize: 18,
                color: "#333",
                marginBottom: 12,
                fontWeight: 500,
              }}
            >
              <b>Address:</b> Devarayamjal, Medchal, Telangana 500078
              <br />
              <b>Phone:</b>{" "}
              <a
                href="tel:+919100066659"
                style={{ color: "#6cb33f", textDecoration: "none" }}
              >
                +91-9100066659
              </a>
              <br />
              <b>Email:</b>{" "}
              <a
                href="mailto:info@6seasonsorganic.com"
                style={{ color: "#6cb33f", textDecoration: "none" }}
              >
                info@6seasonsorganic.com
              </a>
            </div>
            <div
              style={{
                marginTop: 14,
                marginBottom: 18,
                display: "flex",
                gap: 18,
              }}
            >
              <a
                href="https://www.instagram.com/6_seasons_organic/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#388e3c", fontSize: 28 }}
                title="Instagram"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ verticalAlign: "middle" }}
                >
                  <defs>
                    <linearGradient
                      id="insta-square-gradient"
                      x1="0"
                      y1="0"
                      x2="32"
                      y2="32"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#f9ce34" />
                      <stop offset="50%" stopColor="#ee2a7b" />
                      <stop offset="100%" stopColor="#6228d7" />
                    </linearGradient>
                  </defs>
                  <rect
                    x="2"
                    y="2"
                    width="28"
                    height="28"
                    rx="6"
                    fill="url(#insta-square-gradient)"
                  />
                  <rect
                    x="7.5"
                    y="7.5"
                    width="17"
                    height="17"
                    rx="5"
                    stroke="#fff"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="5"
                    stroke="#fff"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <circle cx="21.5" cy="10.5" r="1.2" fill="#fff" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/people/6-seasons/61552154805127/?sfnsn=wiwspmo&mibextid=vk8aRt"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#388e3c", fontSize: 28 }}
                title="Facebook"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ verticalAlign: "middle" }}
                >
                  <path
                    d="M20.5 16h-2v8h-3v-8h-1.5v-3h1.5v-1.5c0-2.07 1.18-3.5 3.5-3.5h2v3h-2c-.28 0-.5.22-.5.5V13h2.5l-.5 3z"
                    fill="#1877F3"
                  />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@6seasonsorganics"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#388e3c", fontSize: 28 }}
                title="YouTube"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ verticalAlign: "middle" }}
                >
                  <path
                    d="M25.5 13.5c-.17-1.13-.67-2.02-1.8-2.18C22.07 11 16 11 16 11s-6.07 0-7.7.32c-1.13.16-1.63 1.05-1.8 2.18C6 14.93 6 16 6 16s0 1.07.5 2.5c.17 1.13.67 2.02 1.8 2.18C9.93 21 16 21 16 21s6.07 0 7.7-.32c1.13-.16 1.63-1.05 1.8-2.18.5-1.43.5-2.5.5-2.5s0-1.07-.5-2.5zM14 18.5v-5l5 2.5-5 2.5z"
                    fill="#FF0000"
                  />
                </svg>
              </a>
            </div>
            <h4
              style={{
                color: "#388e3c",
                fontWeight: 900,
                fontSize: 22,
                marginBottom: 10,
                marginTop: 10,
              }}
            >
              Information
            </h4>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                fontSize: 16,
                color: "#333",
                lineHeight: 2,
                fontWeight: 500,
              }}
            >
              <li>
                <a
                  href="https://6seasonsorganic.com/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#388e3c",
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="https://6seasonsorganic.com/contact-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#388e3c",
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  Customer Service
                </a>
              </li>
              <li>
                <a
                  href="https://maps.app.goo.gl/WAmF8TErCU9FDNVj9"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#388e3c",
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  Our Sitemap
                </a>
              </li>
              <li>
                <a
                  href="https://6seasonsorganic.com/E-Commerce/terms-and-conditions.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#388e3c",
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="https://6seasonsorganic.com/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#388e3c",
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="https://6seasonsorganic.com/delivery-info"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#388e3c",
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  Delivery Information
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div
          style={{
            marginTop: 44,
            borderTop: "2px solid #388e3c",
            paddingTop: 22,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              color: "#388e3c",
              fontSize: 20,
              fontWeight: 900,
              letterSpacing: 1,
            }}
          >
            All Rights Reserved. © 2025 6SeasonsOrganic
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ color: "#222", fontWeight: 900, fontSize: 20 }}>
              Visitors:
            </span>
            <span
              style={{
                background: "linear-gradient(90deg, #ffe066 60%, #6cb33f 100%)",
                color: "#222",
                fontWeight: 900,
                fontSize: 22,
                borderRadius: 22,
                padding: "10px 32px",
                boxShadow: "0 2px 12px rgba(108,179,63,0.13)",
                border: "2px solid #ffe066",
                letterSpacing: 1.5,
                display: "inline-block",
              }}
            >
              {animatedCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
