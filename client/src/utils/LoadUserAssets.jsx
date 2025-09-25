export const loadUserAssets = () => {
      // Get the public path dynamically
  const publicPath = window.location.origin; // Gets "http://localhost:3000" or your production URL

  // Function to load CSS files dynamically
  const loadCSS = (href) => {
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }
  };

  // Function to load JS files dynamically
  const loadJS = (src) => {
    if (!document.querySelector(`script[src="${src}"]`)) {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    }
  };

  // Load CSS files
  loadCSS(`${publicPath}/css/bootstrap/bootstrap.css`);
  loadCSS(`${publicPath}/css/style.css`);

  // Load JS files
  loadJS(`${publicPath}/js/bootstrap/bootstrap.js`);
  };
  