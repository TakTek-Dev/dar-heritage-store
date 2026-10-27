/* Language plumbing shared by every page. Load it before any other script.
   Arabic pages sit at the root; English pages in /en/ and Turkish pages in /tr/,
   each with <html lang="en|tr" dir="ltr" data-root="../">.
   Scripts read text through L("عربي", "English", "Türkçe") and prefix asset paths with DAR_ROOT. */
(function () {
  const html = document.documentElement;
  const lang = html.lang === "en" || html.lang === "tr" ? html.lang : "ar";
  window.DAR_LANG = lang;
  window.DAR_LTR = lang !== "ar";
  window.DAR_ROOT = html.dataset.root || "";
  window.DAR_LOCALE = { ar: "ar", en: "en-GB", tr: "tr-TR" }[lang];
  // Turkish falls back to English, English to Arabic; gaps are collected so checks can list them
  window.DAR_MISSING = new Set();
  window.L = (ar, en, tr) => {
    if (lang === "tr") { if (tr != null) return tr; DAR_MISSING.add(en ?? ar); }
    if (lang !== "ar" && en != null) return en;
    return ar;
  };
  // The same page in another language (pages without a translation fall back to that language's home page)
  const PAGES = ["index", "shop", "product", "cart", "checkout", "track", "about", "contact", "corporate", "help", "policies", "motifs", "login", "account", "404", "design-system"];
  const DIR = { ar: "", en: "en/", tr: "tr/" };
  window.DAR_ALT = (to = lang === "ar" ? "en" : "ar") => {
    const file = location.pathname.split("/").pop() || "index.html";
    const name = file.replace(/\.html$/, "");
    const target = PAGES.includes(name) ? file : "index.html";
    const tail = target === file ? location.search + location.hash : "";
    return window.DAR_ROOT + DIR[to] + target + tail;
  };
})();
