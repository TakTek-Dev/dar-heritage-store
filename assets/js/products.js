/* DAR product data, taken from "Dar Katalog 1.2" (2026).
   Names are Arabic translations of the Turkish catalogue names and need DAR's review.
   Codes appear only where the catalogue ties a code to that exact item.
   price: null until the dashboard provides it. */
window.DAR_CATS = [
  { id: "wear",  name: "أثواب وأزياء" },
  { id: "bags",  name: "حقائب ومحافظ" },
  { id: "kufiya", name: "كوفيات وسجاد" },
  { id: "wall",  name: "تطريز وديكور" },
  { id: "jewel", name: "إكسسوارات" },
  { id: "home",  name: "فناجين وهدايا" }
];

window.DAR_PRODUCTS = [
  // Wear
  { id: "jacket-blue", cat: "wear", name: "جاكيت أسود بتطريز أزرق", img: "jacket-blue", pos: "50% 30%", craft: "embroidered", colors: ["blue"],
    desc: "جاكيت أسود مستوحى من الثوب الفلسطيني، بتطريز أزرق على الصدر والأكمام. من مجموعة الأزياء المعاصرة في دار.",
    gallery: ["jacket-blue", "jacket-red", "jacket-green"] },
  { id: "jacket-red", cat: "wear", name: "جاكيت أسود بتطريز أحمر", img: "jacket-red", pos: "50% 30%", craft: "embroidered", colors: ["red"],
    desc: "جاكيت أسود بتطريز أحمر مستوحى من نقوش الثوب، يلبس فوق العباءة أو مع ملابس اليوم.",
    gallery: ["jacket-red", "jacket-blue", "jacket-green"] },
  { id: "jacket-green", cat: "wear", name: "جاكيت أسود مطرز", img: "jacket-green", pos: "50% 30%", craft: "embroidered", colors: ["green"],
    desc: "جاكيت أسود مطرز من مجموعة الأزياء التي تحفظ روح الثوب الفلسطيني بقصات معاصرة." },
  { id: "jacket-teal", cat: "wear", name: "جاكيت فيروزي مطرز", img: "jacket-teal", pos: "50% 30%", craft: "embroidered", colors: ["blue"],
    desc: "جاكيت بلون فيروزي بتطريز كامل، من أزياء دار المستوحاة من الثوب التقليدي." },
  { id: "thob-red", cat: "wear", name: "ثوب أسود بتطريز أحمر", img: "thob-red", pos: "50% 25%", craft: "embroidered", colors: ["red", "black"],
    desc: "ثوب فلسطيني أسود بقبة وأكمام مطرزة بالأحمر وألوان متعددة، مع زنار عند الخصر." },
  { id: "thob-white", cat: "wear", name: "ثوب أبيض مطرز", img: "thob-white", pos: "50% 30%", craft: "embroidered", colors: ["red"],
    desc: "ثوب أبيض بتطريز أحمر على الصدر والجوانب، من مجموعة الأثواب المعاصرة." },
  { id: "thob-green", cat: "wear", name: "ثوب أسود بتطريز أخضر", img: "thob-green", pos: "50% 30%", craft: "embroidered", colors: ["green", "black"],
    desc: "ثوب أسود بتطريز أخضر، قصة معاصرة تحفظ روح الثوب الفلسطيني." },
  { id: "thob-girl", cat: "wear", name: "ثوب بنات مطرز", img: "thob-girl", pos: "50% 30%", craft: "embroidered", colors: ["red", "black"],
    desc: "ثوب أسود للبنات بتطريز أحمر على الصدر والأطراف." },

  // Bags
  { id: "minibag", cat: "bags", code: "14010", name: "حقيبة صغيرة مطرزة بنقش فلسطيني", img: "minibag-red", pos: "50% 55%", craft: "embroidered", colors: ["red", "green", "blue"],
    desc: "حقيبة صغيرة بحزام كتف طويل، مطرزة بنقش فلسطيني. متوفرة بثلاثة ألوان للتطريز.",
    variants: [ { name: "أحمر", color: "red", img: "minibag-red" }, { name: "أخضر", color: "green", img: "minibag-green" }, { name: "أزرق", color: "blue", img: "minibag-blue" } ] },
  { id: "shoulder-miras", cat: "bags", name: "حقيبة كتف مطرزة، ميراث", img: "bags-shoulder", dark: true, craft: "embroidered", colors: ["red", "green", "blue"],
    desc: "حقيبة كتف بتطريز فلسطيني، من تصميم ميراث. متوفرة بالأحمر والأخضر والأزرق.",
    gallery: ["bags-shoulder", "bags-vatan"] },
  { id: "shoulder-vatan", cat: "bags", name: "حقيبة كتف مطرزة، وطن", img: "bags-vatan", dark: true, craft: "embroidered", colors: ["red", "green", "blue"],
    desc: "حقيبة كتف بتطريز فلسطيني، من تصميم وطن. متوفرة بالأحمر والأخضر والأزرق.",
    gallery: ["bags-vatan", "bags-shoulder"] },
  { id: "velvet-wallet", cat: "bags", code: "14027", name: "محفظة مخمل مطرزة يدويا", img: "wallet-velvet", dark: true, craft: "hand", colors: ["gold", "red", "black"],
    desc: "محفظة صغيرة من المخمل، مطرزة يدويا بنقوش فلسطينية، مع شرابة.",
    variants: [ { name: "ذهبي", color: "gold", img: "wallet-velvet" }, { name: "أحمر", color: "red", img: "wallet-red" }, { name: "كوفية", color: "black", img: "wallet-kufiya" } ] },
  { id: "kufiya-bag", cat: "bags", name: "حقيبة كتف بنقش الكوفية", img: "bag-arch", pos: "50% 45%", craft: "embroidered", colors: ["black"],
    desc: "حقيبة كتف كبيرة بنقش الكوفية الفلسطينية." },
  { id: "embroidered-handbag", cat: "bags", name: "حقيبة يد مطرزة", img: "bag-woman", pos: "50% 45%", craft: "embroidered", colors: ["red", "black"],
    desc: "حقيبة يد سوداء بتطريز أحمر بنقوش فلسطينية." },

  // Kufiya and rugs
  { id: "kufiya", cat: "kufiya", name: "كوفية فلسطينية تقليدية", img: "kufiya", dark: true, colors: ["black"],
    desc: "الكوفية الفلسطينية بنقشها التقليدي بالأبيض والأسود، مع شراشيب." },
  { id: "rug-kufiya", cat: "kufiya", code: "19007", name: "سجادة صلاة بنقش الكوفية", img: "rug-kufiya", dark: true, colors: ["black"],
    desc: "سجادة صلاة بنقش الكوفية وشراشيب بيضاء." },
  { id: "rug-mosques", cat: "kufiya", code: "19009", name: "سجادة صلاة بنقش المساجد الثلاثة", img: "rug-mosques", dark: true, colors: ["green"],
    desc: "سجادة صلاة مزينة بنقش المساجد الثلاثة." },
  { id: "rug-kids", cat: "kufiya", code: "19010", name: "سجادة صلاة للأطفال بنقش المساجد الثلاثة", img: "rug-kids", colors: ["green"],
    desc: "سجادة صلاة صغيرة للأطفال، بنقش المساجد الثلاثة." },

  // Wall and decor
  { id: "hoop-hand", cat: "wall", code: "20012", name: "طارة مطرزة يدويا", img: "hoop-hand", craft: "hand", colors: ["blue", "black"],
    desc: "لوحة تطريز يدوي مشدودة على طارة خشبية، جاهزة للتعليق." },
  { id: "hoop-machine", cat: "wall", code: "20013", name: "طارة تطريز بالثوب الفلسطيني", img: "hoop-thob", pos: "50% 40%", craft: "machine", colors: ["red", "black"],
    desc: "لوحة تطريز آلي على طارة، تحمل صورة الثوب الفلسطيني." },
  { id: "key-return", cat: "wall", code: "16022", name: "مفتاح العودة، دار", img: "key-return", colors: ["gold"],
    desc: "مجسم مفتاح العودة من دار." },
  { id: "puzzle-map", cat: "wall", name: "بازل خشبي لخريطة فلسطين بالمدن", img: "puzzle-map", colors: ["gold"],
    desc: "بازل خشبي لخريطة فلسطين، كل قطعة فيه مدينة. متوفر بحجمين." },
  { id: "tray-aqsa", cat: "wall", code: "16059", name: "صينية خشب المسجد الأقصى", img: "tray-aqsa", colors: ["gold"],
    desc: "صينية خشبية مزينة بصورة المسجد الأقصى." },

  // Jewellery
  { id: "earrings-map", cat: "jewel", code: "13032", name: "أقراط خريطة فلسطين", img: "earrings-map", pos: "50% 45%", colors: ["gold"],
    desc: "أقراط ذهبية اللون بشكل خريطة فلسطين." },
  { id: "pandora-gaza", cat: "jewel", code: "13027", name: "سوار غزة", img: "bracelet-gaza", colors: ["red", "gold"],
    desc: "سوار بتعليقات من رموز فلسطين، في علبة هدايا." },
  { id: "ring-gold", cat: "jewel", name: "خاتم ذهبي اللون", img: "ring-gold", pos: "50% 45%", colors: ["gold"],
    desc: "خاتم ذهبي اللون من مجموعة خواتم دار المستوحاة من فلسطين." },
  { id: "bracelet-strap", cat: "jewel", name: "سوار جلدي بالخريطة", img: "bracelet-wrist", colors: ["black"],
    desc: "سوار بحزام جلدي تتوسطه خريطة فلسطين." },
  { id: "bracelet-kids", cat: "jewel", name: "سوار كريستال بألوان العلم", img: "bracelet-kids", colors: ["red", "green"],
    desc: "سوار من خرز الكريستال بألوان العلم الفلسطيني، متوفر للكبار والصغار." },
  { id: "necklace-map", cat: "jewel", name: "قلادة خريطة فلسطين", img: "necklace-woman", pos: "50% 55%", colors: ["gold"],
    desc: "قلادة بتعليقة على شكل خريطة فلسطين، متوفرة بالذهبي والفضي.", gallery: ["necklace-woman", "necklaces-cloth"] },
  { id: "pin-map", cat: "jewel", name: "دبوس خريطة فلسطين", img: "pin-map", pos: "60% 40%", colors: ["gold"],
    desc: "دبوس للياقة بشكل خريطة فلسطين." },

  // Home and gifts
  { id: "cups-olive", cat: "home", name: "طقم فنجانين الزيتون والكوفية", img: "cups-olive", craft: "handmade", colors: ["green", "black"],
    desc: "طقم فنجانين مصنوع يدويا، بزخارف مفتاح العودة والكوفية والزيتون." },
  { id: "cups-red", cat: "home", name: "فناجين بنقش التطريز", img: "cups-red", craft: "handmade", colors: ["red"],
    desc: "فناجين مصنوعة يدويا بزخارف من نقوش التطريز الفلسطيني." },
  { id: "thermos", cat: "home", name: "ترمس فلسطين", img: "thermos", colors: ["red", "green"],
    desc: "ترمس مزين برموز فلسطينية، متوفر بالأحمر والأخضر." },
  { id: "watch-flag", cat: "home", code: "19020", name: "ساعة بعلم فلسطين", img: "watch-flag", colors: ["black"],
    desc: "ساعة يد مزينة بعلم فلسطين." },
  { id: "notebook", cat: "home", code: "19003", name: "أجندة لك", img: "notebook", colors: ["blue"],
    desc: "أجندة ودفتر ملاحظات من دار." }
];

window.DAR_CRAFT = { hand: "تطريز يدوي", machine: "تطريز آلي", embroidered: "مطرز", handmade: "صنع يدوي" };
window.DAR_COLORS = {
  red: { name: "أحمر", hex: "#B23A2A" }, green: { name: "أخضر", hex: "#3F6B45" }, blue: { name: "أزرق", hex: "#2F5C8A" },
  black: { name: "أسود", hex: "#1C1C1C" }, gold: { name: "ذهبي", hex: "#C9A24B" }
};

/* Edits saved from the dashboard preview (admin/) live in this browser until the backend exists.
   They override the catalogue fields above; drafts disappear from the storefront. */
(function () {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem("dar-admin") || "{}"); } catch (e) {}
  const edits = saved.products || {};
  window.DAR_ALL_PRODUCTS = window.DAR_PRODUCTS.map(p => Object.assign({}, p, edits[p.id] || {}));
  window.DAR_PRODUCTS = window.DAR_ALL_PRODUCTS.filter(p => p.status !== "draft");
  window.DAR_SETTINGS = saved.settings || {};
  window.DAR_CONTENT = saved.content || {};
})();
