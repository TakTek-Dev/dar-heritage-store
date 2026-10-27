/* DAR product data, taken from "Dar Katalog 1.2" (2026).
   Names are Arabic translations of the Turkish catalogue names and need DAR's review.
   Codes appear only where the catalogue ties a code to that exact item.
   price: null until the dashboard provides it.
   English pages read name_en / desc_en (products, categories, variants, colours) and DAR_CRAFT_EN through L(). */
window.DAR_CATS = [
  { id: "wear",  name: "أثواب وأزياء", name_en: "Thobs and clothing" },
  { id: "bags",  name: "حقائب ومحافظ", name_en: "Bags and purses" },
  { id: "kufiya", name: "كوفيات وسجاد", name_en: "Keffiyehs and rugs" },
  { id: "wall",  name: "تطريز وديكور", name_en: "Embroidery and decor" },
  { id: "jewel", name: "إكسسوارات", name_en: "Accessories" },
  { id: "home",  name: "فناجين وهدايا", name_en: "Cups and gifts" }
];

window.DAR_PRODUCTS = [
  // Wear
  { id: "jacket-blue", cat: "wear", name: "جاكيت أسود بتطريز أزرق", name_en: "Black jacket with blue embroidery", img: "jacket-blue", pos: "50% 30%", craft: "embroidered", colors: ["blue"],
    desc: "جاكيت أسود مستوحى من الثوب الفلسطيني، بتطريز أزرق على الصدر والأكمام. من مجموعة الأزياء المعاصرة في دار.", desc_en: "A black jacket inspired by the Palestinian thob, with blue embroidery on the chest and sleeves. From DAR's contemporary clothing collection.",
    gallery: ["jacket-blue", "jacket-red", "jacket-green"] },
  { id: "jacket-red", cat: "wear", name: "جاكيت أسود بتطريز أحمر", name_en: "Black jacket with red embroidery", img: "jacket-red", pos: "50% 30%", craft: "embroidered", colors: ["red"],
    desc: "جاكيت أسود بتطريز أحمر مستوحى من نقوش الثوب، يلبس فوق العباءة أو مع ملابس اليوم.", desc_en: "A black jacket with red embroidery inspired by thob motifs. Wear it over an abaya or with everyday clothes.",
    gallery: ["jacket-red", "jacket-blue", "jacket-green"] },
  { id: "jacket-green", cat: "wear", name: "جاكيت أسود مطرز", name_en: "Embroidered black jacket", img: "jacket-green", pos: "50% 30%", craft: "embroidered", colors: ["green"],
    desc: "جاكيت أسود مطرز من مجموعة الأزياء التي تحفظ روح الثوب الفلسطيني بقصات معاصرة.", desc_en: "An embroidered black jacket from a collection that keeps the spirit of the Palestinian thob in modern cuts." },
  { id: "jacket-teal", cat: "wear", name: "جاكيت فيروزي مطرز", name_en: "Embroidered turquoise jacket", img: "jacket-teal", pos: "50% 30%", craft: "embroidered", colors: ["blue"],
    desc: "جاكيت بلون فيروزي بتطريز كامل، من أزياء دار المستوحاة من الثوب التقليدي.", desc_en: "A turquoise jacket, fully embroidered, from DAR's clothing inspired by the traditional thob." },
  { id: "thob-red", cat: "wear", name: "ثوب أسود بتطريز أحمر", name_en: "Black thob with red embroidery", img: "thob-red", pos: "50% 25%", craft: "embroidered", colors: ["red", "black"],
    desc: "ثوب فلسطيني أسود بقبة وأكمام مطرزة بالأحمر وألوان متعددة، مع زنار عند الخصر.", desc_en: "A black Palestinian thob with its chest panel and sleeves embroidered in red and many colours, and a sash at the waist." },
  { id: "thob-white", cat: "wear", name: "ثوب أبيض مطرز", name_en: "Embroidered white thob", img: "thob-white", pos: "50% 30%", craft: "embroidered", colors: ["red"],
    desc: "ثوب أبيض بتطريز أحمر على الصدر والجوانب، من مجموعة الأثواب المعاصرة.", desc_en: "A white thob with red embroidery on the chest and sides, from the contemporary thob collection." },
  { id: "thob-green", cat: "wear", name: "ثوب أسود بتطريز أخضر", name_en: "Black thob with green embroidery", img: "thob-green", pos: "50% 30%", craft: "embroidered", colors: ["green", "black"],
    desc: "ثوب أسود بتطريز أخضر، قصة معاصرة تحفظ روح الثوب الفلسطيني.", desc_en: "A black thob with green embroidery: a modern cut that keeps the spirit of the Palestinian thob." },
  { id: "thob-girl", cat: "wear", name: "ثوب بنات مطرز", name_en: "Embroidered girls' thob", img: "thob-girl", pos: "50% 30%", craft: "embroidered", colors: ["red", "black"],
    desc: "ثوب أسود للبنات بتطريز أحمر على الصدر والأطراف.", desc_en: "A black thob for girls, with red embroidery on the chest and hems." },

  // Bags
  { id: "minibag", cat: "bags", code: "14010", name: "حقيبة صغيرة مطرزة بنقش فلسطيني", name_en: "Small bag with Palestinian embroidery", img: "minibag-red", pos: "50% 55%", craft: "embroidered", colors: ["red", "green", "blue"],
    desc: "حقيبة صغيرة بحزام كتف طويل، مطرزة بنقش فلسطيني. متوفرة بثلاثة ألوان للتطريز.", desc_en: "A small bag with a long shoulder strap, embroidered with a Palestinian motif. Comes in three embroidery colours.",
    variants: [ { name: "أحمر", name_en: "Red", color: "red", img: "minibag-red" }, { name: "أخضر", name_en: "Green", color: "green", img: "minibag-green" }, { name: "أزرق", name_en: "Blue", color: "blue", img: "minibag-blue" } ] },
  { id: "shoulder-miras", cat: "bags", name: "حقيبة كتف مطرزة، ميراث", name_en: "Embroidered shoulder bag, Miras", img: "bags-shoulder", dark: true, craft: "embroidered", colors: ["red", "green", "blue"],
    desc: "حقيبة كتف بتطريز فلسطيني، من تصميم ميراث. متوفرة بالأحمر والأخضر والأزرق.", desc_en: "A shoulder bag with Palestinian embroidery, from the Miras design. Comes in red, green and blue.",
    gallery: ["bags-shoulder", "bags-vatan"] },
  { id: "shoulder-vatan", cat: "bags", name: "حقيبة كتف مطرزة، وطن", name_en: "Embroidered shoulder bag, Vatan", img: "bags-vatan", dark: true, craft: "embroidered", colors: ["red", "green", "blue"],
    desc: "حقيبة كتف بتطريز فلسطيني، من تصميم وطن. متوفرة بالأحمر والأخضر والأزرق.", desc_en: "A shoulder bag with Palestinian embroidery, from the Vatan design. Comes in red, green and blue.",
    gallery: ["bags-vatan", "bags-shoulder"] },
  { id: "velvet-wallet", cat: "bags", code: "14027", name: "محفظة مخمل مطرزة يدويا", name_en: "Hand-embroidered velvet purse", img: "wallet-velvet", dark: true, craft: "hand", colors: ["gold", "red", "black"],
    desc: "محفظة صغيرة من المخمل، مطرزة يدويا بنقوش فلسطينية، مع شرابة.", desc_en: "A small velvet purse, hand embroidered with Palestinian motifs and finished with a tassel.",
    variants: [ { name: "ذهبي", name_en: "Gold", color: "gold", img: "wallet-velvet" }, { name: "أحمر", name_en: "Red", color: "red", img: "wallet-red" }, { name: "كوفية", name_en: "Keffiyeh", color: "black", img: "wallet-kufiya" } ] },
  { id: "kufiya-bag", cat: "bags", name: "حقيبة كتف بنقش الكوفية", name_en: "Keffiyeh-pattern shoulder bag", img: "bag-arch", pos: "50% 45%", craft: "embroidered", colors: ["black"],
    desc: "حقيبة كتف كبيرة بنقش الكوفية الفلسطينية.", desc_en: "A large shoulder bag in the pattern of the Palestinian keffiyeh." },
  { id: "embroidered-handbag", cat: "bags", name: "حقيبة يد مطرزة", name_en: "Embroidered handbag", img: "bag-woman", pos: "50% 45%", craft: "embroidered", colors: ["red", "black"],
    desc: "حقيبة يد سوداء بتطريز أحمر بنقوش فلسطينية.", desc_en: "A black handbag with red embroidery in Palestinian motifs." },

  // Keffiyeh and rugs
  { id: "kufiya", cat: "kufiya", name: "كوفية فلسطينية تقليدية", name_en: "Traditional Palestinian keffiyeh", img: "kufiya", dark: true, colors: ["black"],
    desc: "الكوفية الفلسطينية بنقشها التقليدي بالأبيض والأسود، مع شراشيب.", desc_en: "The Palestinian keffiyeh in its traditional black and white pattern, with tassels." },
  { id: "rug-kufiya", cat: "kufiya", code: "19007", name: "سجادة صلاة بنقش الكوفية", name_en: "Keffiyeh-pattern prayer rug", img: "rug-kufiya", dark: true, colors: ["black"],
    desc: "سجادة صلاة بنقش الكوفية وشراشيب بيضاء.", desc_en: "A prayer rug in the keffiyeh pattern, with white tassels." },
  { id: "rug-mosques", cat: "kufiya", code: "19009", name: "سجادة صلاة بنقش المساجد الثلاثة", name_en: "Three Mosques prayer rug", img: "rug-mosques", dark: true, colors: ["green"],
    desc: "سجادة صلاة مزينة بنقش المساجد الثلاثة.", desc_en: "A prayer rug decorated with the Three Mosques design." },
  { id: "rug-kids", cat: "kufiya", code: "19010", name: "سجادة صلاة للأطفال بنقش المساجد الثلاثة", name_en: "Children's Three Mosques prayer rug", img: "rug-kids", colors: ["green"],
    desc: "سجادة صلاة صغيرة للأطفال، بنقش المساجد الثلاثة.", desc_en: "A small prayer rug for children, with the Three Mosques design." },

  // Wall and decor
  { id: "hoop-hand", cat: "wall", code: "20012", name: "طارة مطرزة يدويا", name_en: "Hand-embroidered hoop", img: "hoop-hand", craft: "hand", colors: ["blue", "black"],
    desc: "لوحة تطريز يدوي مشدودة على طارة خشبية، جاهزة للتعليق.", desc_en: "A hand-embroidered piece stretched on a wooden hoop, ready to hang." },
  { id: "hoop-machine", cat: "wall", code: "20013", name: "طارة تطريز بالثوب الفلسطيني", name_en: "Embroidered hoop with a Palestinian thob", img: "hoop-thob", pos: "50% 40%", craft: "machine", colors: ["red", "black"],
    desc: "لوحة تطريز آلي على طارة، تحمل صورة الثوب الفلسطيني.", desc_en: "A machine-embroidered piece on a hoop, showing a Palestinian thob." },
  { id: "key-return", cat: "wall", code: "16022", name: "مفتاح العودة، دار", name_en: "Key of Return, DAR", img: "key-return", colors: ["gold"],
    desc: "مجسم مفتاح العودة من دار.", desc_en: "A model of the Key of Return, from DAR." },
  { id: "puzzle-map", cat: "wall", name: "بازل خشبي لخريطة فلسطين بالمدن", name_en: "Wooden map puzzle of Palestine's cities", img: "puzzle-map", colors: ["gold"],
    desc: "بازل خشبي لخريطة فلسطين، كل قطعة فيه مدينة. متوفر بحجمين.", desc_en: "A wooden puzzle of the map of Palestine, where every piece is a city. Comes in two sizes." },
  { id: "tray-aqsa", cat: "wall", code: "16059", name: "صينية خشب المسجد الأقصى", name_en: "Al-Aqsa Mosque wooden tray", img: "tray-aqsa", colors: ["gold"],
    desc: "صينية خشبية مزينة بصورة المسجد الأقصى.", desc_en: "A wooden tray decorated with a picture of Al-Aqsa Mosque." },

  // Jewellery
  { id: "earrings-map", cat: "jewel", code: "13032", name: "أقراط خريطة فلسطين", name_en: "Map of Palestine earrings", img: "earrings-map", pos: "50% 45%", colors: ["gold"],
    desc: "أقراط ذهبية اللون بشكل خريطة فلسطين.", desc_en: "Gold-tone earrings in the shape of the map of Palestine." },
  { id: "pandora-gaza", cat: "jewel", code: "13027", name: "سوار غزة", name_en: "Gaza bracelet", img: "bracelet-gaza", colors: ["red", "gold"],
    desc: "سوار بتعليقات من رموز فلسطين، في علبة هدايا.", desc_en: "A charm bracelet with Palestinian symbols, in a gift box." },
  { id: "ring-gold", cat: "jewel", name: "خاتم ذهبي اللون", name_en: "Gold-tone ring", img: "ring-gold", pos: "50% 45%", colors: ["gold"],
    desc: "خاتم ذهبي اللون من مجموعة خواتم دار المستوحاة من فلسطين.", desc_en: "A gold-tone ring from DAR's collection of rings inspired by Palestine." },
  { id: "bracelet-strap", cat: "jewel", name: "سوار جلدي بالخريطة", name_en: "Leather map bracelet", img: "bracelet-wrist", colors: ["black"],
    desc: "سوار بحزام جلدي تتوسطه خريطة فلسطين.", desc_en: "A leather strap bracelet with the map of Palestine at its centre." },
  { id: "bracelet-kids", cat: "jewel", name: "سوار كريستال بألوان العلم", name_en: "Crystal bracelet in the flag colours", img: "bracelet-kids", colors: ["red", "green"],
    desc: "سوار من خرز الكريستال بألوان العلم الفلسطيني، متوفر للكبار والصغار.", desc_en: "A bracelet of crystal beads in the colours of the Palestinian flag, for adults and children." },
  { id: "necklace-map", cat: "jewel", name: "قلادة خريطة فلسطين", name_en: "Map of Palestine necklace", img: "necklace-woman", pos: "50% 55%", colors: ["gold"],
    desc: "قلادة بتعليقة على شكل خريطة فلسطين، متوفرة بالذهبي والفضي.", desc_en: "A necklace with a pendant in the shape of the map of Palestine, in gold or silver tone.", gallery: ["necklace-woman", "necklaces-cloth"] },
  { id: "pin-map", cat: "jewel", name: "دبوس خريطة فلسطين", name_en: "Map of Palestine pin", img: "pin-map", pos: "60% 40%", colors: ["gold"],
    desc: "دبوس للياقة بشكل خريطة فلسطين.", desc_en: "A lapel pin in the shape of the map of Palestine." },

  // Home and gifts
  { id: "cups-olive", cat: "home", name: "طقم فنجانين الزيتون والكوفية", name_en: "Olive and keffiyeh cups, set of two", img: "cups-olive", craft: "handmade", colors: ["green", "black"],
    desc: "طقم فنجانين مصنوع يدويا، بزخارف مفتاح العودة والكوفية والزيتون.", desc_en: "A handmade set of two cups, decorated with the Key of Return, the keffiyeh and the olive tree." },
  { id: "cups-red", cat: "home", name: "فناجين بنقش التطريز", name_en: "Embroidery-pattern cups", img: "cups-red", craft: "handmade", colors: ["red"],
    desc: "فناجين مصنوعة يدويا بزخارف من نقوش التطريز الفلسطيني.", desc_en: "Handmade cups decorated with patterns from Palestinian embroidery." },
  { id: "thermos", cat: "home", name: "ترمس فلسطين", name_en: "Palestine thermos", img: "thermos", colors: ["red", "green"],
    desc: "ترمس مزين برموز فلسطينية، متوفر بالأحمر والأخضر.", desc_en: "A thermos decorated with Palestinian symbols, in red or green." },
  { id: "watch-flag", cat: "home", code: "19020", name: "ساعة بعلم فلسطين", name_en: "Palestine flag watch", img: "watch-flag", colors: ["black"],
    desc: "ساعة يد مزينة بعلم فلسطين.", desc_en: "A wristwatch decorated with the Palestinian flag." },
  { id: "notebook", cat: "home", code: "19003", name: "أجندة لك", name_en: "A planner for you", img: "notebook", colors: ["blue"],
    desc: "أجندة ودفتر ملاحظات من دار.", desc_en: "A planner and notebook from DAR." }
];

window.DAR_CRAFT = { hand: "تطريز يدوي", machine: "تطريز آلي", embroidered: "مطرز", handmade: "صنع يدوي" };
window.DAR_CRAFT_EN = { hand: "Hand embroidery", machine: "Machine embroidery", embroidered: "Embroidered", handmade: "Handmade" };
window.DAR_COLORS = {
  red: { name: "أحمر", name_en: "Red", hex: "#B23A2A" }, green: { name: "أخضر", name_en: "Green", hex: "#3F6B45" }, blue: { name: "أزرق", name_en: "Blue", hex: "#2F5C8A" },
  black: { name: "أسود", name_en: "Black", hex: "#1C1C1C" }, gold: { name: "ذهبي", name_en: "Gold", hex: "#C9A24B" }
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
