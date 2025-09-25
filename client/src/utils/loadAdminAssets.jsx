
export const loadAdminAssets = () => {
    const publicPath = window.location.origin; // Automatically detects the correct base URL
  
    // Function to load CSS dynamically
    const loadCSS = (href) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
      }
    };
  
    // Function to load JS dynamically
    const loadJS = (src) => {
      if (!document.querySelector(`script[src="${src}"]`)) {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        document.body.appendChild(script);
      }
    };
  
    // Load CSS files
    loadCSS(`${publicPath}/admin/css/styles.css`);
    loadCSS(`${publicPath}/admin/css/form-validation.css`);
  
    // Load JS files
    loadJS("https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js");
  };
  