var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "50mb" }));
  app.use((req, res, next) => {
    if (req.method === "GET" && req.path.endsWith(".html") && req.path !== "/index.html") {
      const cleanPath = req.path.slice(0, -5);
      const query = req.url.slice(req.path.length);
      return res.redirect(301, cleanPath + query);
    }
    next();
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    const indexHtmlPath = import_path.default.join(distPath, "index.html");
    const fs = require("fs");
    app.use(import_express.default.static(distPath, {
      maxAge: "1y",
      index: false,
      // Don't serve index.html automatically, so we can intercept it
      setHeaders: (res, filePath) => {
        if (filePath.endsWith(".mjs")) {
          res.setHeader("Content-Type", "application/javascript");
        }
        if (filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
        }
      }
    }));
    app.get("*", (req, res) => {
      try {
        let html = fs.readFileSync(indexHtmlPath, "utf-8");
        let title = "";
        let description = "";
        let keywords = "";
        const compressSizeMatch = req.path.match(/^\/compress-pdf-to-(\d+)(kb|mb)$/i);
        const formatMatch = req.path.match(/^\/(jpg|png|word)-to-pdf$/i);
        const langMatch = req.path.match(/^\/(es|fr|hi|pt)\/(compress|comprimir-pdf)$/i);
        if (compressSizeMatch) {
          const size = compressSizeMatch[1] + compressSizeMatch[2].toUpperCase();
          title = `Compress PDF to ${size} Online Free | EasyAsPDF`;
          description = `Reduce and compress your PDF file size to exactly ${size} online without losing quality.`;
          keywords = `compress pdf to ${size}, reduce pdf to ${size}, resize pdf ${size}`;
        } else if (formatMatch) {
          const format = formatMatch[1].toUpperCase();
          title = `Convert ${format} to PDF Online Free | EasyAsPDF`;
          description = `Easily convert ${format} images and documents to PDF format online securely.`;
          keywords = `${format} to pdf, convert ${format} to pdf, online ${format} to pdf`;
        } else if (langMatch) {
          const lang = langMatch[1];
          if (lang === "hi") {
            title = "PDF Compress Karein Online Free | EasyAsPDF";
            description = "Apne PDF file ka size kam karein bina quality loose kiye. Best free online PDF compressor.";
          } else if (lang === "es" || lang === "pt") {
            title = "Comprimir PDF Online Gratis | EasyAsPDF";
            description = "Reduzca el tama\xF1o de su archivo PDF en l\xEDnea sin perder calidad.";
          } else if (lang === "fr") {
            title = "Compresser PDF en ligne gratuit | EasyAsPDF";
            description = "R\xE9duisez la taille de votre fichier PDF en ligne sans perdre de qualit\xE9.";
          }
        }
        if (title) {
          html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
          if (html.includes('<meta name="description"')) {
            html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${description}">`);
          } else {
            html = html.replace("</head>", `  <meta name="description" content="${description}">
</head>`);
          }
        }
        res.send(html);
      } catch (err) {
        console.error("Error serving index.html:", err);
        res.status(500).send("Server Error");
      }
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
