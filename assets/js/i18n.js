/* Language plumbing shared by every page. Load it before any other script.
   English pages live in /en/ with <html lang="en" dir="ltr" data-root="../">.
   Scripts read text through L("عربي", "English") and prefix asset paths with DAR_ROOT. */
(function () {
  const html = document.documentElement;
  const lang = html.lang === "en" ? "en" : "ar";
  window.DAR_LANG = lang;
  window.DAR_ROOT = html.dataset.root || "";
  window.L = (ar, en) => (lang === "en" && en != null ? en : ar);
  // The same page in the other language (pages without an English version fall back to the home page)
  const EN_PAGES = ["index", "shop", "product", "cart", "checkout", "track", "about", "contact", "corporate", "help", "policies", "motifs", "login", "account", "404", "design-system"];
  window.DAR_ALT = () => {
    const file = location.pathname.split("/").pop() || "index.html";
    const name = file.replace(/\.html$/, "");
    const target = EN_PAGES.includes(name) ? file : "index.html";
    const tail = target === file ? location.search + location.hash : "";
    return (lang === "en" ? "../" : "en/") + target + tail;
  };
})();
