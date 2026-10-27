/* DAR product data, taken from "Dar Katalog 1.2" (2026).
   Names are Arabic translations of the Turkish catalogue names and need DAR's review.
   Codes appear only where the catalogue ties a code to that exact item.
   price: null until the dashboard provides it.
   English pages read name_en / desc_en (products, categories, variants, colours) and DAR_CRAFT_EN through L();
   Turkish pages read name_tr / desc_tr and DAR_CRAFT_TR the same way. Turkish names need DAR's review against the catalogue. */
window.DAR_CATS = [
  { id: "wear",  name: "أثواب وأزياء", name_en: "Thobs and clothing", name_tr: "Elbise ve giyim" },
  { id: "bags",  name: "حقائب ومحافظ", name_en: "Bags and purses", name_tr: "Çanta ve cüzdan" },
  { id: "kufiya", name: "كوفيات وسجاد", name_en: "Keffiyehs and rugs", name_tr: "Puşi ve seccade" },
  { id: "wall",  name: "تطريز وديكور", name_en: "Embroidery and decor", name_tr: "Nakış ve dekor" },
  { id: "jewel", name: "إكسسوارات", name_en: "Accessories", name_tr: "Aksesuar" },
  { id: "home",  name: "فناجين وهدايا", name_en: "Cups and gifts", name_tr: "Fincan ve hediye" }
];

window.DAR_PRODUCTS = [
  // Wear
  { id: "jacket-blue", cat: "wear", name: "جاكيت أسود بتطريز أزرق", name_en: "Black jacket with blue embroidery", name_tr: "Mavi Nakışlı Siyah Ceket", img: "jacket-blue", pos: "50% 30%", craft: "embroidered", colors: ["blue"],
    desc: "جاكيت أسود مستوحى من الثوب الفلسطيني، بتطريز أزرق على الصدر والأكمام. من مجموعة الأزياء المعاصرة في دار.", desc_en: "A black jacket inspired by the Palestinian thob, with blue embroidery on the chest and sleeves. From DAR's contemporary clothing collection.",
    desc_tr: "Filistin elbisesinden ilham alan siyah ceket; göğsünde ve kollarında mavi nakış var. DAR'ın çağdaş giyim koleksiyonundan.",
    gallery: ["jacket-blue", "jacket-red", "jacket-green"] },
  { id: "jacket-red", cat: "wear", name: "جاكيت أسود بتطريز أحمر", name_en: "Black jacket with red embroidery", name_tr: "Kırmızı Nakışlı Siyah Ceket", img: "jacket-red", pos: "50% 30%", craft: "embroidered", colors: ["red"],
    desc: "جاكيت أسود بتطريز أحمر مستوحى من نقوش الثوب، يلبس فوق العباءة أو مع ملابس اليوم.", desc_en: "A black jacket with red embroidery inspired by thob motifs. Wear it over an abaya or with everyday clothes.",
    desc_tr: "Elbise motiflerinden ilham alan kırmızı nakışlı siyah ceket. Ferace üzerine ya da günlük kıyafetlerle giyebilirsiniz.",
    gallery: ["jacket-red", "jacket-blue", "jacket-green"] },
  { id: "jacket-green", cat: "wear", name: "جاكيت أسود مطرز", name_en: "Embroidered black jacket", name_tr: "Nakışlı Siyah Ceket", img: "jacket-green", pos: "50% 30%", craft: "embroidered", colors: ["green"],
    desc: "جاكيت أسود مطرز من مجموعة الأزياء التي تحفظ روح الثوب الفلسطيني بقصات معاصرة.", desc_en: "An embroidered black jacket from a collection that keeps the spirit of the Palestinian thob in modern cuts.",
    desc_tr: "Filistin elbisesinin ruhunu modern kesimlerle yaşatan koleksiyondan nakışlı siyah ceket." },
  { id: "jacket-teal", cat: "wear", name: "جاكيت فيروزي مطرز", name_en: "Embroidered turquoise jacket", name_tr: "Nakışlı Turkuaz Ceket", img: "jacket-teal", pos: "50% 30%", craft: "embroidered", colors: ["blue"],
    desc: "جاكيت بلون فيروزي بتطريز كامل، من أزياء دار المستوحاة من الثوب التقليدي.", desc_en: "A turquoise jacket, fully embroidered, from DAR's clothing inspired by the traditional thob.",
    desc_tr: "Baştan sona nakışlı turkuaz ceket. DAR'ın geleneksel elbiseden ilham alan giyim koleksiyonundan." },
  { id: "thob-red", cat: "wear", name: "ثوب أسود بتطريز أحمر", name_en: "Black thob with red embroidery", name_tr: "Kırmızı Nakışlı Siyah Elbise", img: "thob-red", pos: "50% 25%", craft: "embroidered", colors: ["red", "black"],
    desc: "ثوب فلسطيني أسود بقبة وأكمام مطرزة بالأحمر وألوان متعددة، مع زنار عند الخصر.", desc_en: "A black Palestinian thob with its chest panel and sleeves embroidered in red and many colours, and a sash at the waist.",
    desc_tr: "Göğüs parçası ve kolları kırmızı ve rengârenk nakışlarla işlenmiş, belinde kuşağı olan siyah Filistin elbisesi." },
  { id: "thob-white", cat: "wear", name: "ثوب أبيض مطرز", name_en: "Embroidered white thob", name_tr: "Nakışlı Beyaz Elbise", img: "thob-white", pos: "50% 30%", craft: "embroidered", colors: ["red"],
    desc: "ثوب أبيض بتطريز أحمر على الصدر والجوانب، من مجموعة الأثواب المعاصرة.", desc_en: "A white thob with red embroidery on the chest and sides, from the contemporary thob collection.",
    desc_tr: "Göğsünde ve yanlarında kırmızı nakış olan beyaz elbise. Çağdaş elbise koleksiyonundan." },
  { id: "thob-green", cat: "wear", name: "ثوب أسود بتطريز أخضر", name_en: "Black thob with green embroidery", name_tr: "Yeşil Nakışlı Siyah Elbise", img: "thob-green", pos: "50% 30%", craft: "embroidered", colors: ["green", "black"],
    desc: "ثوب أسود بتطريز أخضر، قصة معاصرة تحفظ روح الثوب الفلسطيني.", desc_en: "A black thob with green embroidery: a modern cut that keeps the spirit of the Palestinian thob.",
    desc_tr: "Yeşil nakışlı siyah elbise: Filistin elbisesinin ruhunu yaşatan modern bir kesim." },
  { id: "thob-girl", cat: "wear", name: "ثوب بنات مطرز", name_en: "Embroidered girls' thob", name_tr: "Nakışlı Kız Çocuk Elbisesi", img: "thob-girl", pos: "50% 30%", craft: "embroidered", colors: ["red", "black"],
    desc: "ثوب أسود للبنات بتطريز أحمر على الصدر والأطراف.", desc_en: "A black thob for girls, with red embroidery on the chest and hems.",
    desc_tr: "Kız çocukları için siyah elbise; göğsünde ve eteklerinde kırmızı nakış var." },

  // Bags
  { id: "minibag", cat: "bags", code: "14010", name: "حقيبة صغيرة مطرزة بنقش فلسطيني", name_en: "Small bag with Palestinian embroidery", name_tr: "Filistin Nakışlı Küçük Çanta", img: "minibag-red", pos: "50% 55%", craft: "embroidered", colors: ["red", "green", "blue"],
    desc: "حقيبة صغيرة بحزام كتف طويل، مطرزة بنقش فلسطيني. متوفرة بثلاثة ألوان للتطريز.", desc_en: "A small bag with a long shoulder strap, embroidered with a Palestinian motif. Comes in three embroidery colours.",
    desc_tr: "Uzun omuz askılı, Filistin motifiyle nakışlı küçük çanta. Üç nakış rengiyle sunulur.",
    variants: [ { name: "أحمر", name_en: "Red", name_tr: "Kırmızı", color: "red", img: "minibag-red" }, { name: "أخضر", name_en: "Green", name_tr: "Yeşil", color: "green", img: "minibag-green" }, { name: "أزرق", name_en: "Blue", name_tr: "Mavi", color: "blue", img: "minibag-blue" } ] },
  { id: "shoulder-miras", cat: "bags", name: "حقيبة كتف مطرزة، ميراث", name_en: "Embroidered shoulder bag, Miras", name_tr: "Nakışlı Omuz Çantası, Miras", img: "bags-shoulder", dark: true, craft: "embroidered", colors: ["red", "green", "blue"],
    desc: "حقيبة كتف بتطريز فلسطيني، من تصميم ميراث. متوفرة بالأحمر والأخضر والأزرق.", desc_en: "A shoulder bag with Palestinian embroidery, from the Miras design. Comes in red, green and blue.",
    desc_tr: "Miras desenli, Filistin nakışlı omuz çantası. Kırmızı, yeşil ve mavi renkleri var.",
    gallery: ["bags-shoulder", "bags-vatan"] },
  { id: "shoulder-vatan", cat: "bags", name: "حقيبة كتف مطرزة، وطن", name_en: "Embroidered shoulder bag, Vatan", name_tr: "Nakışlı Omuz Çantası, Vatan", img: "bags-vatan", dark: true, craft: "embroidered", colors: ["red", "green", "blue"],
    desc: "حقيبة كتف بتطريز فلسطيني، من تصميم وطن. متوفرة بالأحمر والأخضر والأزرق.", desc_en: "A shoulder bag with Palestinian embroidery, from the Vatan design. Comes in red, green and blue.",
    desc_tr: "Vatan desenli, Filistin nakışlı omuz çantası. Kırmızı, yeşil ve mavi renkleri var.",
    gallery: ["bags-vatan", "bags-shoulder"] },
  { id: "velvet-wallet", cat: "bags", code: "14027", name: "محفظة مخمل مطرزة يدويا", name_en: "Hand-embroidered velvet purse", name_tr: "El Nakışlı Kadife Cüzdan", img: "wallet-velvet", dark: true, craft: "hand", colors: ["gold", "red", "black"],
    desc: "محفظة صغيرة من المخمل، مطرزة يدويا بنقوش فلسطينية، مع شرابة.", desc_en: "A small velvet purse, hand embroidered with Palestinian motifs and finished with a tassel.",
    desc_tr: "Filistin motifleriyle elde işlenmiş, püsküllü küçük kadife cüzdan.",
    variants: [ { name: "ذهبي", name_en: "Gold", name_tr: "Altın", color: "gold", img: "wallet-velvet" }, { name: "أحمر", name_en: "Red", name_tr: "Kırmızı", color: "red", img: "wallet-red" }, { name: "كوفية", name_en: "Keffiyeh", name_tr: "Puşi", color: "black", img: "wallet-kufiya" } ] },
  { id: "kufiya-bag", cat: "bags", name: "حقيبة كتف بنقش الكوفية", name_en: "Keffiyeh-pattern shoulder bag", name_tr: "Puşi Desenli Omuz Çantası", img: "bag-arch", pos: "50% 45%", craft: "embroidered", colors: ["black"],
    desc: "حقيبة كتف كبيرة بنقش الكوفية الفلسطينية.", desc_en: "A large shoulder bag in the pattern of the Palestinian keffiyeh.",
    desc_tr: "Filistin puşisinin deseniyle büyük omuz çantası." },
  { id: "embroidered-handbag", cat: "bags", name: "حقيبة يد مطرزة", name_en: "Embroidered handbag", name_tr: "Nakışlı El Çantası", img: "bag-woman", pos: "50% 45%", craft: "embroidered", colors: ["red", "black"],
    desc: "حقيبة يد سوداء بتطريز أحمر بنقوش فلسطينية.", desc_en: "A black handbag with red embroidery in Palestinian motifs.",
    desc_tr: "Filistin motifleriyle kırmızı nakış işlenmiş siyah el çantası." },

  // Keffiyeh and rugs
  { id: "kufiya", cat: "kufiya", name: "كوفية فلسطينية تقليدية", name_en: "Traditional Palestinian keffiyeh", name_tr: "Geleneksel Filistin Puşisi", img: "kufiya", dark: true, colors: ["black"],
    desc: "الكوفية الفلسطينية بنقشها التقليدي بالأبيض والأسود، مع شراشيب.", desc_en: "The Palestinian keffiyeh in its traditional black and white pattern, with tassels.",
    desc_tr: "Siyah beyaz geleneksel deseniyle, püsküllü Filistin puşisi." },
  { id: "rug-kufiya", cat: "kufiya", code: "19007", name: "سجادة صلاة بنقش الكوفية", name_en: "Keffiyeh-pattern prayer rug", name_tr: "Puşi Desenli Seccade", img: "rug-kufiya", dark: true, colors: ["black"],
    desc: "سجادة صلاة بنقش الكوفية وشراشيب بيضاء.", desc_en: "A prayer rug in the keffiyeh pattern, with white tassels.",
    desc_tr: "Puşi desenli, beyaz püsküllü seccade." },
  { id: "rug-mosques", cat: "kufiya", code: "19009", name: "سجادة صلاة بنقش المساجد الثلاثة", name_en: "Three Mosques prayer rug", name_tr: "Üç Mescit Desenli Seccade", img: "rug-mosques", dark: true, colors: ["green"],
    desc: "سجادة صلاة مزينة بنقش المساجد الثلاثة.", desc_en: "A prayer rug decorated with the Three Mosques design.",
    desc_tr: "Üç Mescit deseniyle süslenmiş seccade." },
  { id: "rug-kids", cat: "kufiya", code: "19010", name: "سجادة صلاة للأطفال بنقش المساجد الثلاثة", name_en: "Children's Three Mosques prayer rug", name_tr: "Üç Mescit Desenli Çocuk Seccadesi", img: "rug-kids", colors: ["green"],
    desc: "سجادة صلاة صغيرة للأطفال، بنقش المساجد الثلاثة.", desc_en: "A small prayer rug for children, with the Three Mosques design.",
    desc_tr: "Çocuklar için Üç Mescit desenli küçük seccade." },

  // Wall and decor
  { id: "hoop-hand", cat: "wall", code: "20012", name: "طارة مطرزة يدويا", name_en: "Hand-embroidered hoop", name_tr: "El İşi Kasnak Nakışı", img: "hoop-hand", craft: "hand", colors: ["blue", "black"],
    desc: "لوحة تطريز يدوي مشدودة على طارة خشبية، جاهزة للتعليق.", desc_en: "A hand-embroidered piece stretched on a wooden hoop, ready to hang.",
    desc_tr: "Ahşap kasnağa gerilmiş, asmaya hazır el nakışı pano." },
  { id: "hoop-machine", cat: "wall", code: "20013", name: "طارة تطريز بالثوب الفلسطيني", name_en: "Embroidered hoop with a Palestinian thob", name_tr: "Filistin Elbiseli Kasnak Nakışı", img: "hoop-thob", pos: "50% 40%", craft: "machine", colors: ["red", "black"],
    desc: "لوحة تطريز آلي على طارة، تحمل صورة الثوب الفلسطيني.", desc_en: "A machine-embroidered piece on a hoop, showing a Palestinian thob.",
    desc_tr: "Kasnak üzerinde, Filistin elbisesi resmeden makine nakışı pano." },
  { id: "key-return", cat: "wall", code: "16022", name: "مفتاح العودة، دار", name_en: "Key of Return, DAR", name_tr: "Dönüş Anahtarı, DAR", img: "key-return", colors: ["gold"],
    desc: "مجسم مفتاح العودة من دار.", desc_en: "A model of the Key of Return, from DAR.",
    desc_tr: "DAR'dan Dönüş Anahtarı maketi." },
  { id: "puzzle-map", cat: "wall", name: "بازل خشبي لخريطة فلسطين بالمدن", name_en: "Wooden map puzzle of Palestine's cities", name_tr: "Şehirleriyle Filistin Haritası Ahşap Yapboz", img: "puzzle-map", colors: ["gold"],
    desc: "بازل خشبي لخريطة فلسطين، كل قطعة فيه مدينة. متوفر بحجمين.", desc_en: "A wooden puzzle of the map of Palestine, where every piece is a city. Comes in two sizes.",
    desc_tr: "Her parçası bir şehir olan ahşap Filistin haritası yapbozu. İki boyutta sunulur." },
  { id: "tray-aqsa", cat: "wall", code: "16059", name: "صينية خشب المسجد الأقصى", name_en: "Al-Aqsa Mosque wooden tray", name_tr: "Mescid-i Aksa Ahşap Tepsi", img: "tray-aqsa", colors: ["gold"],
    desc: "صينية خشبية مزينة بصورة المسجد الأقصى.", desc_en: "A wooden tray decorated with a picture of Al-Aqsa Mosque.",
    desc_tr: "Mescid-i Aksa resmiyle süslenmiş ahşap tepsi." },

  // Jewellery
  { id: "earrings-map", cat: "jewel", code: "13032", name: "أقراط خريطة فلسطين", name_en: "Map of Palestine earrings", name_tr: "Filistin Haritası Küpe", img: "earrings-map", pos: "50% 45%", colors: ["gold"],
    desc: "أقراط ذهبية اللون بشكل خريطة فلسطين.", desc_en: "Gold-tone earrings in the shape of the map of Palestine.",
    desc_tr: "Filistin haritası şeklinde altın rengi küpe." },
  { id: "pandora-gaza", cat: "jewel", code: "13027", name: "سوار غزة", name_en: "Gaza bracelet", name_tr: "Gazze Bilekliği", img: "bracelet-gaza", colors: ["red", "gold"],
    desc: "سوار بتعليقات من رموز فلسطين، في علبة هدايا.", desc_en: "A charm bracelet with Palestinian symbols, in a gift box.",
    desc_tr: "Filistin sembollerinden süs uçlu bileklik, hediye kutusunda." },
  { id: "ring-gold", cat: "jewel", name: "خاتم ذهبي اللون", name_en: "Gold-tone ring", name_tr: "Altın Rengi Yüzük", img: "ring-gold", pos: "50% 45%", colors: ["gold"],
    desc: "خاتم ذهبي اللون من مجموعة خواتم دار المستوحاة من فلسطين.", desc_en: "A gold-tone ring from DAR's collection of rings inspired by Palestine.",
    desc_tr: "DAR'ın Filistin'den ilham alan yüzük koleksiyonundan altın rengi yüzük." },
  { id: "bracelet-strap", cat: "jewel", name: "سوار جلدي بالخريطة", name_en: "Leather map bracelet", name_tr: "Haritalı Deri Bileklik", img: "bracelet-wrist", colors: ["black"],
    desc: "سوار بحزام جلدي تتوسطه خريطة فلسطين.", desc_en: "A leather strap bracelet with the map of Palestine at its centre.",
    desc_tr: "Ortasında Filistin haritası olan deri kayışlı bileklik." },
  { id: "bracelet-kids", cat: "jewel", name: "سوار كريستال بألوان العلم", name_en: "Crystal bracelet in the flag colours", name_tr: "Bayrak Renklerinde Kristal Bileklik", img: "bracelet-kids", colors: ["red", "green"],
    desc: "سوار من خرز الكريستال بألوان العلم الفلسطيني، متوفر للكبار والصغار.", desc_en: "A bracelet of crystal beads in the colours of the Palestinian flag, for adults and children.",
    desc_tr: "Filistin bayrağının renklerinde kristal boncuklu bileklik; büyükler ve çocuklar için." },
  { id: "necklace-map", cat: "jewel", name: "قلادة خريطة فلسطين", name_en: "Map of Palestine necklace", name_tr: "Filistin Haritası Kolye", img: "necklace-woman", pos: "50% 55%", colors: ["gold"],
    desc: "قلادة بتعليقة على شكل خريطة فلسطين، متوفرة بالذهبي والفضي.", desc_en: "A necklace with a pendant in the shape of the map of Palestine, in gold or silver tone.",
    desc_tr: "Filistin haritası şeklinde uçlu kolye; altın ve gümüş rengi seçenekleriyle.", gallery: ["necklace-woman", "necklaces-cloth"] },
  { id: "pin-map", cat: "jewel", name: "دبوس خريطة فلسطين", name_en: "Map of Palestine pin", name_tr: "Filistin Haritası Rozet", img: "pin-map", pos: "60% 40%", colors: ["gold"],
    desc: "دبوس للياقة بشكل خريطة فلسطين.", desc_en: "A lapel pin in the shape of the map of Palestine.",
    desc_tr: "Filistin haritası şeklinde yaka rozeti." },

  // Home and gifts
  { id: "cups-olive", cat: "home", name: "طقم فنجانين الزيتون والكوفية", name_en: "Olive and keffiyeh cups, set of two", name_tr: "Zeytin ve Puşi Desenli İkili Fincan Takımı", img: "cups-olive", craft: "handmade", colors: ["green", "black"],
    desc: "طقم فنجانين مصنوع يدويا، بزخارف مفتاح العودة والكوفية والزيتون.", desc_en: "A handmade set of two cups, decorated with the Key of Return, the keffiyeh and the olive tree.",
    desc_tr: "Dönüş Anahtarı, puşi ve zeytin ağacı motifleriyle süslenmiş, el yapımı ikili fincan takımı." },
  { id: "cups-red", cat: "home", name: "فناجين بنقش التطريز", name_en: "Embroidery-pattern cups", name_tr: "Nakış Desenli Fincanlar", img: "cups-red", craft: "handmade", colors: ["red"],
    desc: "فناجين مصنوعة يدويا بزخارف من نقوش التطريز الفلسطيني.", desc_en: "Handmade cups decorated with patterns from Palestinian embroidery.",
    desc_tr: "Filistin nakışı motifleriyle süslenmiş el yapımı fincanlar." },
  { id: "thermos", cat: "home", name: "ترمس فلسطين", name_en: "Palestine thermos", name_tr: "Filistin Termosu", img: "thermos", colors: ["red", "green"],
    desc: "ترمس مزين برموز فلسطينية، متوفر بالأحمر والأخضر.", desc_en: "A thermos decorated with Palestinian symbols, in red or green.",
    desc_tr: "Filistin sembolleriyle süslenmiş termos; kırmızı ya da yeşil." },
  { id: "watch-flag", cat: "home", code: "19020", name: "ساعة بعلم فلسطين", name_en: "Palestine flag watch", name_tr: "Filistin Bayraklı Saat", img: "watch-flag", colors: ["black"],
    desc: "ساعة يد مزينة بعلم فلسطين.", desc_en: "A wristwatch decorated with the Palestinian flag.",
    desc_tr: "Filistin bayrağıyla süslenmiş kol saati." },
  { id: "notebook", cat: "home", code: "19003", name: "أجندة لك", name_en: "A planner for you", name_tr: "Sana Bir Ajanda", img: "notebook", colors: ["blue"],
    desc: "أجندة ودفتر ملاحظات من دار.", desc_en: "A planner and notebook from DAR.",
    desc_tr: "DAR'dan ajanda ve not defteri." }
];

window.DAR_CRAFT = { hand: "تطريز يدوي", machine: "تطريز آلي", embroidered: "مطرز", handmade: "صنع يدوي" };
window.DAR_CRAFT_EN = { hand: "Hand embroidery", machine: "Machine embroidery", embroidered: "Embroidered", handmade: "Handmade" };
window.DAR_CRAFT_TR = { hand: "El nakışı", machine: "Makine nakışı", embroidered: "Nakışlı", handmade: "El yapımı" };
window.DAR_COLORS = {
  red: { name: "أحمر", name_en: "Red", name_tr: "Kırmızı", hex: "#B23A2A" }, green: { name: "أخضر", name_en: "Green", name_tr: "Yeşil", hex: "#3F6B45" }, blue: { name: "أزرق", name_en: "Blue", name_tr: "Mavi", hex: "#2F5C8A" },
  black: { name: "أسود", name_en: "Black", name_tr: "Siyah", hex: "#1C1C1C" }, gold: { name: "ذهبي", name_en: "Gold", name_tr: "Altın", hex: "#C9A24B" }
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
