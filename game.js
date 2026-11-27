/* =========================================================
   Pineapple — 3D sunflower building game
   ========================================================= */

(() => {
  "use strict";

  // Signature drawn on every saved photo (top-left) and shown in photo mode.
  const WATERMARK_TEXT = "for Nuttaya ♡";
  const WATERMARK_FONT = '"Snell Roundhand", "Apple Chancery", "Segoe Script", "Brush Script MT", "Dancing Script", cursive';

  /* ---------------------------------------------------------
     Data
     --------------------------------------------------------- */

  /* ---------------------------------------------------------
     Levels + goal illustrations
     --------------------------------------------------------- */

  function goalShell(inner, background) {
    return `<svg viewBox="0 0 180 180" fill="none">
      <circle cx="90" cy="90" r="74" fill="${background}"/>
      <circle cx="90" cy="90" r="73.2" stroke="#3A3328" stroke-opacity=".12"/>
      ${inner}
    </svg>`;
  }

  function ringPetalsSvg(count, cx, cy, distance, rx, ry, colors, offset = 0) {
    return Array.from({ length: count }, (_, index) => {
      const fill = colors[index % colors.length];
      const angle = offset + (index / count) * 360;
      return `<ellipse cx="${cx}" cy="${cy - distance}" rx="${rx}" ry="${ry}" fill="${fill}" transform="rotate(${angle.toFixed(2)} ${cx} ${cy})"/>`;
    }).join("");
  }

  function fullGoalSvg(level) {
    return level.goalSvg.replaceAll('class="goal-piece"', 'class="goal-piece is-built"');
  }

  /* Bouquet layout: where each finished flower leans out of the vase.
     x = lean toward/away from viewer, z = lean left(+)/right(-), s = size. */
  const VASE_NECK_Y = 1.25;
  const BOUQUET_SINK = 0.8; // how far each stem goes down into the vase
  const BOUQUET = {
    rose: { x: 0.75, z: 0.0, s: 0.66, headY: 2.95, dx: -0.05, dz: 0.12 },     // low, front centre
    sunflower: { x: -0.05, z: 0.4, s: 0.68, headY: 3.0, dx: -0.12, dz: -0.05 }, // left
    tulip: { x: -0.25, z: 0.0, s: 0.74, headY: 3.1, dx: 0.08, dz: -0.1 },      // tall, back centre
    daisy: { x: 0.1, z: -0.45, s: 0.66, headY: 3.0, dx: 0.12, dz: 0.1 },       // right
  };

  // World position of a bouquet flower's head (used for the glowing markers).
  function bouquetHead(key, forward = 0.35) {
    const b = BOUQUET[key];
    const h = (b.headY - BOUQUET_SINK) * b.s;
    const x = -h * Math.sin(b.z) + b.dx;
    const y = VASE_NECK_Y + h * Math.cos(b.z) * Math.cos(b.x);
    const z = h * Math.cos(b.z) * Math.sin(b.x) + b.dz + forward;
    return [Number(x.toFixed(2)), Number(y.toFixed(2)), Number(z.toFixed(2))];
  }

  const LEVELS = [
    {
      id: "sunflower",
      th: "ทานตะวัน",
      en: "Sunflower",
      difficulty: "เริ่มต้น",
      accent: "#FFC72C",
      cardBg: "#FFF3CB",
      build: buildSunflowerModel,
      goalSvg: goalSunflowerPremiumSvg(),
      steps: [
        { id: "stem", th: "ก้าน", en: "Stem", icon: "stem", color: 0x4f9b50, css: "#4f9b50", hint: "ปักก้านลงบนฐาน", goal: "เริ่มจากการปักก้านก่อน", target: [0, 0.72, 0], markerScale: 1.35, hitRadius: 0.9, studs: 2 },
        { id: "leafLeft", th: "ใบซ้าย", en: "Leaf L", icon: "leaf", color: 0x6cc95d, css: "#6cc95d", hint: "หนีบใบใหญ่ใบแรกเข้ากับก้าน", goal: "ก้านพร้อมแล้ว เพิ่มใบแรก", target: [-0.62, 1.12, 0.36], markerScale: 1.15, hitRadius: 0.7, studs: 3 },
        { id: "leafRight", th: "ใบขวา", en: "Leaf R", icon: "leaf", color: 0x65bd58, css: "#65bd58", hint: "เพิ่มใบใหญ่อีกข้าง", goal: "เพิ่มอีกใบให้ดูสมดุล", target: [0.62, 1.62, 0.36], markerScale: 1.15, hitRadius: 0.7, studs: 3 },
        { id: "leafTop", th: "ใบอ่อน", en: "Bud leaf", icon: "leaf", color: 0x56a952, css: "#56a952", hint: "ติดใบอ่อนคู่ใต้ดอก", goal: "เพิ่มใบอ่อนคู่บนก้าน", target: [0, 2.05, 0.15], markerScale: 1.1, hitRadius: 0.7, studs: 2 },
        { id: "calyx", th: "กลีบเลี้ยง", en: "Sepals", icon: "petals", color: 0x2f6637, css: "#2f6637", hint: "วางกลีบเลี้ยงสีเขียวรองดอก", goal: "ใบครบแล้ว วางกลีบเลี้ยงรองดอก", target: [0, 3.0, 0.2], markerScale: 1.9, hitRadius: 1.0, studs: 4 },
        { id: "core", th: "เกสร", en: "Core", icon: "core", color: 0x7a4b2c, css: "#7a4b2c", hint: "ประกอบเกสรตรงกลาง", goal: "ประกอบเกสรหลายชั้น", target: [0, 3.0, 0.5], markerScale: 1.4, hitRadius: 0.8, studs: 4 },
        { id: "petalsInner", th: "กลีบใน", en: "Inner", icon: "petals", color: 0xff8a1f, css: "#ff8a1f", hint: "เติมกลีบสีส้มชั้นใน", goal: "เกสรพร้อม เติมกลีบชั้นใน", target: [0, 3.0, 0.55], markerScale: 2.1, hitRadius: 1.1, studs: 4 },
        { id: "petals", th: "กลีบนอก", en: "Outer", icon: "petals", color: 0xffc72c, css: "#ffc72c", hint: "เปิดกลีบชั้นนอกให้บาน", goal: "เกือบเสร็จ เปิดกลีบนอกให้บาน", target: [0, 3.0, 0.6], markerScale: 2.9, hitRadius: 1.4, studs: 5 },
      ],
    },
    {
      id: "rose",
      th: "กุหลาบ",
      en: "Rose",
      difficulty: "ท้าทาย",
      accent: "#E45454",
      cardBg: "#FFE5E2",
      build: buildRoseModel,
      goalSvg: goalRosePremiumSvg(),
      steps: [
        { id: "stem", th: "ก้าน", en: "Stem", icon: "stem", color: 0x4a9449, css: "#4a9449", hint: "ปักก้านกุหลาบ", goal: "เริ่มจากก้านกุหลาบ", target: [0, 0.72, 0], markerScale: 1.35, hitRadius: 0.9, studs: 2 },
        { id: "leafLeft", th: "ใบซ้าย", en: "Leaf L", icon: "leaf", color: 0x65bd58, css: "#65bd58", hint: "หนีบใบสามแฉกใบแรก", goal: "เพิ่มใบด้านซ้าย", target: [-0.52, 1.2, 0.3], markerScale: 1.12, hitRadius: 0.68, studs: 3 },
        { id: "leafRight", th: "ใบขวา", en: "Leaf R", icon: "leaf", color: 0x6cc95d, css: "#6cc95d", hint: "เพิ่มใบสามแฉกอีกข้าง", goal: "เพิ่มใบด้านขวา", target: [0.52, 1.75, 0.3], markerScale: 1.12, hitRadius: 0.68, studs: 3 },
        { id: "leafYoung", th: "ใบอ่อน", en: "Bud leaf", icon: "leaf", color: 0x8fd070, css: "#8fd070", hint: "ติดใบอ่อนใต้ดอก", goal: "เพิ่มใบอ่อนใต้ดอก", target: [-0.15, 2.25, 0.3], markerScale: 1.0, hitRadius: 0.62, studs: 2 },
        { id: "calyx", th: "กลีบเลี้ยง", en: "Sepals", icon: "petals", color: 0x2f6637, css: "#2f6637", hint: "วางฐานดอกกับกลีบเลี้ยง", goal: "ใบครบแล้ว วางกลีบเลี้ยงรองดอก", target: [0, 2.95, 0.35], markerScale: 1.3, hitRadius: 0.8, studs: 4 },
        { id: "core", th: "เกล็ดกลาง", en: "Bud", icon: "core", color: 0xb83245, css: "#b83245", hint: "ประกอบแกนกลางกุหลาบ", goal: "วางแกนกลางกุหลาบ", target: [0, 3.4, 0.35], markerScale: 1.25, hitRadius: 0.78, studs: 4 },
        { id: "petalsInner", th: "กลีบใน", en: "Inner", icon: "petals", color: 0xd94a4a, css: "#d94a4a", hint: "ห่อกลีบชั้นในรอบแกน", goal: "แกนพร้อม ห่อกลีบชั้นใน", target: [0, 3.45, 0.5], markerScale: 1.8, hitRadius: 1.0, studs: 4 },
        { id: "petals", th: "กลีบนอก", en: "Outer", icon: "petals", color: 0xe45454, css: "#e45454", hint: "คลี่กลีบกุหลาบ", goal: "เกือบเสร็จ คลี่กลีบนอกให้บาน", target: [0, 3.45, 0.65], markerScale: 2.5, hitRadius: 1.32, studs: 5 },
      ],
    },
    {
      id: "bouquet",
      th: "ช่อดอกไม้",
      bare: true, // the vase stands on the bare wooden base
      en: "Bouquet",
      difficulty: "มาสเตอร์",
      accent: "#B97CD9",
      cardBg: "#F3E6FA",
      build: buildBouquetModel,
      goalSvg: goalBouquetSvg(),
      steps: [
        { id: "vase", th: "แจกัน", en: "Vase", icon: "core", color: 0xf3ead8, css: "#e9dcc2", hint: "ตั้งแจกันกลางฐาน", goal: "เริ่มจากตั้งแจกันผูกโบว์", target: [0, 0.75, 0.6], markerScale: 1.4, hitRadius: 0.9, studs: 4 },
        { id: "greenery", th: "ใบประดับ", en: "Greenery", icon: "leaf", color: 0x6f9e6a, css: "#6f9e6a", hint: "ปักใบประดับรอบปากแจกัน", goal: "เพิ่มใบเขียวรองช่อ", target: [0.55, 1.75, 0.35], markerScale: 1.3, hitRadius: 0.8, studs: 3 },
        { id: "rose", th: "กุหลาบ", en: "Rose", icon: "petals", color: 0xd62f38, css: "#d62f38", hint: "ปักกุหลาบตรงกลางด้านหน้า", goal: "ปักกุหลาบเป็นดอกหลัก", target: bouquetHead("rose"), markerScale: 1.4, hitRadius: 0.8, studs: 4 },
        { id: "sunflower", th: "ทานตะวัน", en: "Sunflower", icon: "petals", color: 0xffb300, css: "#ffb300", hint: "ปักทานตะวันด้านซ้าย", goal: "เพิ่มทานตะวันด้านซ้าย", target: bouquetHead("sunflower"), markerScale: 1.5, hitRadius: 0.85, studs: 4 },
        { id: "tulip", th: "ทิวลิป", en: "Tulip", icon: "petals", color: 0xf268a5, css: "#f268a5", hint: "ปักทิวลิปตรงกลางด้านหลัง", goal: "เพิ่มทิวลิปให้ช่อสูงขึ้น", target: bouquetHead("tulip", 0.35), markerScale: 1.3, hitRadius: 0.8, studs: 4 },
        { id: "daisy", th: "เดซี่", en: "Daisy", icon: "petals", color: 0xfdfbf1, css: "#f4efe2", hint: "ปักเดซี่ด้านขวา", goal: "เพิ่มเดซี่ด้านขวา", target: bouquetHead("daisy"), markerScale: 1.4, hitRadius: 0.8, studs: 4 },
        { id: "lavender", th: "ลาเวนเดอร์", en: "Lavender", icon: "stem", color: 0x9a7bd0, css: "#9a7bd0", hint: "แซมช่อลาเวนเดอร์สีม่วง", goal: "แซมลาเวนเดอร์ให้ช่อมีมิติ", target: [-0.25, 3.15, -0.25], markerScale: 1.3, hitRadius: 0.8, studs: 3 },
        { id: "babysBreath", th: "ดอกยิปโซ", en: "Baby's breath", icon: "petals", color: 0xffffff, css: "#ffffff", hint: "โปรยดอกยิปโซให้ช่อเต็ม", goal: "เกือบเสร็จ โปรยดอกยิปโซ", target: [0, 2.5, 0.8], markerScale: 2.4, hitRadius: 1.2, studs: 5 },
      ],
    },
    {
      id: "snowman",
      th: "สโนว์แมน",
      en: "Snowman",
      difficulty: "ง่าย",
      accent: "#D62F38",
      cardBg: "#E8F1F8",
      build: buildSnowmanModel,
      goalSvg: goalSnowmanSvg(),
      bare: true, // stands on snow, no soil bed
      noBee: true,
      winTh: "สโนว์แมนเสร็จแล้ว!",
      doneSub: "ลากฉากเพื่อชื่นชมสโนว์แมน",
      doneGoal: "สโนว์แมนพร้อมฉลองคริสต์มาสแล้ว",
      steps: [
        { id: "snowBase", th: "กองหิมะ", en: "Snow", icon: "petals", color: 0xeef4f8, css: "#dfe9f1", hint: "วางกองหิมะบนฐาน", goal: "เริ่มจากกองหิมะก่อน", target: [0, 0.12, 0.95], markerScale: 1.6, hitRadius: 1.0, studs: 5 },
        { id: "body", th: "ตัวล่าง", en: "Body", icon: "core", color: 0xffffff, css: "#f4f7fa", hint: "วางก้อนหิมะใหญ่เป็นตัว", goal: "ปั้นตัวสโนว์แมน", target: [0, 1.05, 1.0], markerScale: 1.8, hitRadius: 1.1, studs: 4 },
        { id: "head", th: "หัว", en: "Head", icon: "core", color: 0xffffff, css: "#f4f7fa", hint: "วางก้อนหิมะเล็กเป็นหัว", goal: "ตัวพร้อมแล้ว วางหัว", target: [0, 2.55, 0.75], markerScale: 1.5, hitRadius: 0.95, studs: 3 },
        { id: "armLeft", th: "แขนซ้าย", en: "Arm L", icon: "leaf", color: 0x6b3f22, css: "#6b3f22", hint: "ปักแขนกิ่งไม้ด้านซ้าย", goal: "เพิ่มแขนกิ่งไม้ข้างแรก", target: [-1.25, 1.95, 0.25], markerScale: 1.05, hitRadius: 0.75, studs: 2 },
        { id: "armRight", th: "แขนขวา", en: "Arm R", icon: "leaf", color: 0x6b3f22, css: "#6b3f22", hint: "ปักแขนกิ่งไม้ด้านขวา", goal: "เพิ่มแขนอีกข้าง", target: [1.25, 1.95, 0.25], markerScale: 1.05, hitRadius: 0.75, studs: 2 },
        { id: "face", th: "หน้า", en: "Face", icon: "stem", color: 0xff8a1f, css: "#ff8a1f", hint: "ติดตา จมูกแครอท และปาก", goal: "แต่งหน้าให้สโนว์แมน", target: [0, 2.6, 0.85], markerScale: 1.1, hitRadius: 0.75, studs: 2 },
        { id: "scarf", th: "ผ้าพันคอ", en: "Scarf", icon: "petals", color: 0x2e8b57, css: "#2e8b57", hint: "พันผ้าพันคอสีเขียว", goal: "พันผ้าพันคอให้อุ่น", target: [0, 1.98, 0.8], markerScale: 1.4, hitRadius: 0.85, studs: 4 },
        { id: "hat", th: "หมวกซานต้า", en: "Santa hat", icon: "stem", color: 0xd62f38, css: "#d62f38", hint: "สวมหมวกซานต้าสีแดง", goal: "เกือบเสร็จ สวมหมวกซานต้า", target: [0, 3.5, 0.35], markerScale: 1.4, hitRadius: 0.9, studs: 3 },
      ],
    },
    {
      id: "xmasTree",
      th: "ต้นคริสต์มาส",
      en: "Christmas tree",
      difficulty: "ท้าทาย",
      accent: "#2E8B57",
      cardBg: "#E6F3EA",
      build: buildXmasTreeModel,
      goalSvg: goalXmasTreeSvg(),
      bare: true,
      noBee: true,
      winTh: "ต้นคริสต์มาสเสร็จแล้ว!",
      doneSub: "ลากฉากเพื่อชื่นชมต้นคริสต์มาส",
      doneGoal: "ต้นคริสต์มาสพร้อมฉลองแล้ว",
      steps: [
        { id: "pot", th: "กระถาง", en: "Pot", icon: "core", color: 0xc8202b, css: "#c8202b", hint: "ตั้งกระถางสีแดงกลางฐาน", goal: "เริ่มจากตั้งกระถาง", target: [0, 0.35, 0.85], markerScale: 1.4, hitRadius: 0.9, studs: 4 },
        { id: "trunk", th: "ลำต้น", en: "Trunk", icon: "stem", color: 0x6b3f22, css: "#6b3f22", hint: "ปักลำต้นลงในกระถาง", goal: "กระถางพร้อม ปักลำต้น", target: [0, 0.85, 0.5], markerScale: 1.0, hitRadius: 0.7, studs: 2 },
        { id: "tierBottom", th: "ใบชั้นล่าง", en: "Bottom tier", icon: "petals", color: 0x2e8b57, css: "#2e8b57", hint: "วางใบสนชั้นใหญ่สุด", goal: "วางใบสนชั้นล่าง", target: [0, 1.35, 1.15], markerScale: 1.8, hitRadius: 1.1, studs: 5 },
        { id: "tierMid", th: "ใบชั้นกลาง", en: "Middle tier", icon: "petals", color: 0x3a9d5d, css: "#3a9d5d", hint: "ซ้อนใบสนชั้นกลาง", goal: "ซ้อนใบสนชั้นกลาง", target: [0, 2.25, 0.9], markerScale: 1.6, hitRadius: 1.0, studs: 4 },
        { id: "tierTop", th: "ใบชั้นบน", en: "Top tier", icon: "petals", color: 0x48b06a, css: "#48b06a", hint: "วางใบสนชั้นยอด", goal: "วางใบสนชั้นบนสุด", target: [0, 3.0, 0.6], markerScale: 1.3, hitRadius: 0.9, studs: 3 },
        { id: "ornaments", th: "ลูกบอลประดับ", en: "Baubles", icon: "core", color: 0xffc72c, css: "#ffc72c", hint: "แขวนลูกบอลประดับรอบต้น", goal: "แต่งลูกบอลหลากสี", target: [0, 2.0, 1.05], markerScale: 1.7, hitRadius: 1.1, studs: 4 },
        { id: "garland", th: "สายไฟประดับ", en: "Lights", icon: "stem", color: 0xfff3b0, css: "#fff3b0", hint: "พันสายไฟวนรอบต้น", goal: "พันสายไฟให้ต้นเป็นประกาย", target: [0, 2.6, 0.95], markerScale: 1.7, hitRadius: 1.1, studs: 3 },
        { id: "star", th: "ดาวบนยอด", en: "Star", icon: "core", color: 0xffd34d, css: "#ffd34d", hint: "ติดดาวสีทองบนยอด", goal: "เกือบเสร็จ ติดดาวบนยอด", target: [0, 3.85, 0.3], markerScale: 1.2, hitRadius: 0.8, studs: 2 },
      ],
    },
    {
      id: "reindeer",
      th: "กวางเรนเดียร์",
      en: "Reindeer",
      difficulty: "ท้าทาย",
      accent: "#9A6234",
      cardBg: "#F3E7DA",
      build: buildReindeerModel,
      goalSvg: goalReindeerSvg(),
      bare: true,
      lift: 0.4 /* red pedestal height */,
      noBee: true,
      winTh: "กวางเรนเดียร์เสร็จแล้ว!",
      doneSub: "ลากฉากเพื่อชื่นชมกวางเรนเดียร์",
      doneGoal: "กวางเรนเดียร์พร้อมลากเลื่อนซานต้าแล้ว",
      steps: [
        { id: "snowBase", th: "กองหิมะ", en: "Snow", icon: "petals", color: 0xeef4f8, css: "#dfe9f1", hint: "วางกองหิมะบนฐาน", goal: "เริ่มจากกองหิมะก่อน", target: [0, 0.12, 0.95], markerScale: 1.6, hitRadius: 1.0, studs: 5 },
        { id: "legs", th: "ขา", en: "Legs", icon: "stem", color: 0x9a6234, css: "#9a6234", hint: "วางขาหน้าและขาหลัง", goal: "ต่อขากวางก่อน", target: [0, 0.45, 0.75], markerScale: 1.4, hitRadius: 0.9, studs: 3 },
        { id: "body", th: "ลำตัว", en: "Body", icon: "core", color: 0x9a6234, css: "#9a6234", hint: "วางลำตัวสีน้ำตาล", goal: "ต่อลำตัวกวาง", target: [0, 0.95, 0.75], markerScale: 1.7, hitRadius: 1.05, studs: 4 },
        { id: "head", th: "หัว", en: "Head", icon: "core", color: 0xf1dcb8, css: "#c99a6a", hint: "วางหัวบนลำตัว", goal: "ตัวพร้อมแล้ว วางหัว", target: [0, 1.75, 0.8], markerScale: 1.4, hitRadius: 0.9, studs: 3 },
        { id: "face", th: "ตาและจมูกแดง", en: "Eyes & red nose", icon: "core", color: 0xe0262f, css: "#e0262f", hint: "ติดตากับจมูกแดง", goal: "แต่งหน้าให้กวาง", target: [0, 1.7, 0.85], markerScale: 1.0, hitRadius: 0.7, studs: 2 },
        { id: "ears", th: "หู", en: "Ears", icon: "leaf", color: 0x9a6234, css: "#9a6234", hint: "ติดหูสองข้าง", goal: "เพิ่มหูสองข้าง", target: [0, 1.9, 0.55], markerScale: 1.3, hitRadius: 0.85, studs: 2 },
        { id: "antlers", th: "เขากวาง", en: "Antlers", icon: "stem", color: 0x6b3f22, css: "#6b3f22", hint: "ปักเขากวางสองข้าง", goal: "ปักเขากวางให้สวย", target: [0, 2.45, 0.3], markerScale: 1.5, hitRadius: 0.95, studs: 3 },
        { id: "hat", th: "หมวกซานต้า", en: "Santa hat", icon: "stem", color: 0xd62f38, css: "#d62f38", hint: "สวมหมวกซานต้าสีแดง", goal: "เกือบเสร็จ สวมหมวกซานต้า", target: [0, 2.3, 0.5], markerScale: 1.2, hitRadius: 0.85, studs: 3 },
      ],
    },
    {
      id: "santa",
      th: "ซานต้าบนปล่องไฟ",
      en: "Santa's chimney",
      difficulty: "มาสเตอร์",
      accent: "#D42A35",
      cardBg: "#FBE3E3",
      build: buildSantaModel,
      goalSvg: goalSantaSvg(),
      bare: true,
      lift: 0.4 /* red pedestal height */,
      noBee: true,
      winTh: "ซานต้ามาถึงแล้ว!",
      doneSub: "ลากฉากเพื่อชื่นชมซานต้า",
      doneGoal: "ซานต้าพร้อมแจกของขวัญแล้ว",
      steps: [
        { id: "base", th: "ฐานหิมะ", en: "Snowy base", icon: "petals", color: 0xf7f4ee, css: "#e9e4da", hint: "วางฐานหิมะกับพรมแดง", goal: "เริ่มจากฐานหิมะ", target: [0, 0.18, 0.95], markerScale: 1.8, hitRadius: 1.1, studs: 5 },
        { id: "chimneyLow", th: "ปล่องไฟชั้นล่าง", en: "Chimney (low)", icon: "core", color: 0xb8714a, css: "#b8714a", hint: "ก่ออิฐชั้นล่างของปล่องไฟ", goal: "ก่อปล่องไฟอิฐ", target: [0, 0.55, 0.75], markerScale: 1.6, hitRadius: 1.0, studs: 4 },
        { id: "chimneyHigh", th: "ปล่องไฟชั้นบน", en: "Chimney (top)", icon: "core", color: 0xa45f3d, css: "#a45f3d", hint: "ก่ออิฐให้ปล่องไฟสูงขึ้น", goal: "ก่ออิฐชั้นบน", target: [0, 1.28, 0.75], markerScale: 1.6, hitRadius: 1.0, studs: 4 },
        { id: "ledge", th: "ขอบปล่องไฟ", en: "Ledge", icon: "petals", color: 0x9c8466, css: "#9c8466", hint: "วางขอบบนปล่องไฟ", goal: "ปิดขอบปล่องไฟ", target: [0, 1.74, 0.8], markerScale: 1.7, hitRadius: 1.0, studs: 5 },
        { id: "body", th: "ตัวซานต้า", en: "Santa's body", icon: "core", color: 0xd42a35, css: "#d42a35", hint: "ให้ซานต้าโผล่จากปล่องไฟ", goal: "ซานต้าโผล่ออกมาแล้ว", target: [0, 2.2, 0.72], markerScale: 1.5, hitRadius: 0.95, studs: 4 },
        { id: "armRest", th: "แขนซ้าย", en: "Left arm", icon: "leaf", color: 0xd42a35, css: "#d42a35", hint: "วางแขนซ้ายเกาะขอบปล่องไฟ", goal: "เพิ่มแขนซ้าย", target: [-0.68, 1.9, 0.9], markerScale: 1.1, hitRadius: 0.75, studs: 3 },
        { id: "armWave", th: "แขนขวาโบกมือ", en: "Waving arm", icon: "leaf", color: 0x1f1d22, css: "#1f1d22", hint: "ยกแขนขวาโบกมือทักทาย", goal: "ซานต้าโบกมือทักทาย", target: [0.85, 2.75, 0.5], markerScale: 1.1, hitRadius: 0.75, studs: 3 },
        { id: "head", th: "หัว", en: "Head", icon: "core", color: 0xf2c9a8, css: "#f2c9a8", hint: "วางหัวซานต้า", goal: "ตัวพร้อม วางหัว", target: [0, 3.0, 0.65], markerScale: 1.4, hitRadius: 0.9, studs: 3 },
        { id: "beard", th: "เครายาว", en: "Beard", icon: "petals", color: 0xf7f4ee, css: "#ece6da", hint: "ติดเคราขาวฟู", goal: "ติดเคราขาว", target: [0, 2.55, 0.68], markerScale: 1.2, hitRadius: 0.8, studs: 4 },
        { id: "face", th: "ตาและจมูก", en: "Eyes & nose", icon: "stem", color: 0xe9898f, css: "#e9898f", hint: "ติดตากับจมูกชมพู", goal: "แต่งหน้าซานต้า", target: [0, 3.05, 0.66], markerScale: 0.95, hitRadius: 0.65, studs: 2 },
        { id: "hat", th: "หมวกซานต้า", en: "Santa hat", icon: "stem", color: 0xd42a35, css: "#d42a35", hint: "สวมหมวกซานต้าสีแดง", goal: "สวมหมวกให้ซานต้า", target: [0, 3.45, 0.5], markerScale: 1.3, hitRadius: 0.85, studs: 3 },
        { id: "wreath", th: "พวงหรีด", en: "Wreath", icon: "leaf", color: 0x2e8b57, css: "#2e8b57", hint: "แขวนพวงหรีดหน้าปล่องไฟ", goal: "แขวนพวงหรีด", target: [0, 0.95, 0.78], markerScale: 1.3, hitRadius: 0.85, studs: 3 },
        { id: "sack", th: "ถุงของขวัญ", en: "Gift sack", icon: "core", color: 0x8a5a32, css: "#8a5a32", hint: "วางถุงของขวัญข้างปล่องไฟ", goal: "เกือบเสร็จ วางถุงของขวัญ", target: [1.0, 0.65, 0.1], markerScale: 1.2, hitRadius: 0.8, studs: 3 },
      ],
    },
    {
      id: "globe",
      th: "ของขวัญ",
      en: "Gifts",
      difficulty: "มาสเตอร์",
      accent: "#C8202B",
      cardBg: "#FBE3E3",
      build: buildGlobeModel,
      goalSvg: goalGlobeSvg(),
      bare: true,
      noBee: true,
      winTh: "สุขสันต์วันคริสต์มาส!",
      doneSub: "ลากฉากเพื่อชื่นชมของขวัญ",
      doneGoal: "ลูกแก้วหิมะพร้อมมอบเป็นของขวัญแล้ว",
      steps: [
        { id: "base", th: "ฐานสีแดง", en: "Red base", icon: "core", color: 0xc8202b, css: "#c8202b", hint: "ตั้งฐานสีแดงกลางเวที", goal: "เริ่มจากฐานลูกแก้ว", target: [0, 0.55, 1.15], markerScale: 1.8, hitRadius: 1.1, studs: 5 },
        { id: "trims", th: "ขอบทอง", en: "Gold trims", icon: "petals", color: 0xd9b04c, css: "#d9b04c", hint: "ใส่ขอบทองและขาทอง", goal: "แต่งขอบสีทอง", target: [0, 0.99, 0.98], markerScale: 1.6, hitRadius: 1.0, studs: 4 },
        { id: "bow", th: "โบว์และใบฮอลลี่", en: "Bow & holly", icon: "leaf", color: 0xe0263f, css: "#e0263f", hint: "ติดโบว์แดงด้านหน้า", goal: "ผูกโบว์ให้สวย", target: [0, 0.55, 1.25], markerScale: 1.1, hitRadius: 0.75, studs: 3 },
        { id: "floor", th: "พื้นหิมะ", en: "Snow floor", icon: "petals", color: 0xeef4f8, css: "#dfe9f1", hint: "โรยพื้นหิมะบนฐาน", goal: "ปูพื้นหิมะในลูกแก้ว", target: [0, 1.1, 0.78], markerScale: 1.4, hitRadius: 0.9, studs: 4 },
        { id: "tree", th: "ต้นคริสต์มาส", en: "Christmas tree", icon: "leaf", color: 0x2a7047, css: "#2a7047", hint: "ตั้งต้นคริสต์มาสด้านซ้าย", goal: "ตั้งต้นคริสต์มาสน้อย", target: [-0.38, 1.6, 0.35], markerScale: 1.0, hitRadius: 0.7, studs: 3 },
        { id: "house", th: "บ้านขนมปังขิง", en: "Gingerbread house", icon: "core", color: 0xb5713f, css: "#b5713f", hint: "วางบ้านหลังเล็กด้านหลัง", goal: "สร้างบ้านหลังน้อย", target: [0.36, 1.3, 0.2], markerScale: 1.0, hitRadius: 0.7, studs: 3 },
        { id: "santa", th: "ซานต้า", en: "Santa", icon: "core", color: 0xd42a35, css: "#d42a35", hint: "วางซานต้าตรงกลาง", goal: "ซานต้ามาแล้ว", target: [0.06, 1.45, 0.66], markerScale: 1.0, hitRadius: 0.65, studs: 2 },
        { id: "snowman", th: "สโนว์แมน", en: "Snowman", icon: "core", color: 0xffffff, css: "#f4f7fa", hint: "วางสโนว์แมนตัวจิ๋ว", goal: "เพิ่มสโนว์แมน", target: [-0.36, 1.38, 0.72], markerScale: 1.0, hitRadius: 0.65, studs: 2 },
        { id: "gifts", th: "กองของขวัญ", en: "Gift pile", icon: "core", color: 0x2e8b57, css: "#2e8b57", hint: "วางกล่องของขวัญจิ๋ว", goal: "เพิ่มของขวัญ", target: [0.44, 1.18, 0.62], markerScale: 0.8, hitRadius: 0.6, studs: 2 },
        { id: "glass", th: "ลูกแก้ว", en: "Glass globe", icon: "petals", color: 0xdff3ff, css: "#bfe3f5", hint: "ครอบลูกแก้วใส", goal: "ครอบลูกแก้ว", target: [0, 2.3, 0.95], markerScale: 1.8, hitRadius: 1.1, studs: 5 },
        { id: "flakes", th: "เกล็ดหิมะ", en: "Snowflakes", icon: "petals", color: 0xffffff, css: "#ffffff", hint: "เติมเกล็ดหิมะในลูกแก้ว", goal: "ใส่เกล็ดหิมะ", target: [0, 1.9, 1.05], markerScale: 1.3, hitRadius: 0.9, studs: 3 },
        { id: "lights", th: "ไฟและกุญแจไขลาน", en: "Lights & key", icon: "stem", color: 0xffd34d, css: "#ffd34d", hint: "เปิดไฟและติดกุญแจไขลาน", goal: "เกือบเสร็จ เปิดไฟประดับ", target: [0.85, 0.9, 0.6], markerScale: 1.1, hitRadius: 0.75, studs: 3 },
      ],
    },
  ];

  // Levels standing on a red pedestal are raised by `lift`; move their glowing spots up too.
  LEVELS.forEach((level) => {
    if (!level.lift) return;
    level.steps.forEach((step) => { step.target = [step.target[0], step.target[1] + level.lift, step.target[2]]; });
  });

  let activeLevelIndex = 0;
  let STEPS = LEVELS[0].steps;

  const COLORS = {
    green: 0x4a9449,
    greenLight: 0x65bd58,
    leaf: 0x6cc95d,
    greenDark: 0x387a3e,
    greenDeep: 0x2f6637,
    yellow: 0xffb300,
    yellowLight: 0xffd23f,
    yellowDeep: 0xe99a00,
    brown: 0x6b3f22,
    brownLight: 0x91582f,
    brownDark: 0x4b2a15,
    pink: 0xf268a5,
    pinkLight: 0xff88b8,
    pinkDeep: 0xd94c91,
    white: 0xfffdf4,
    cream: 0xf2ebdd,
    red: 0xe45454,
    redLight: 0xf07a7a,
    redDeep: 0xb83245,
    redDark: 0x8e233a,
    base: 0x438a46,
    baseTop: 0x56a755,
    ground: 0xf1dda9,
    mat: 0xf8e8c2,
    matRim: 0xe4c68d,
    dark: 0x332e25,
    black: 0x29251f,
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (selector) => document.querySelector(selector);

  const app = $("#app");
  const stage = $("#stage");
  const canvas = $("#scene");
  const loader = $("#loader");
  const fallback = $("#fallback");
  const stepList = $("#stepList");
  const stepCount = $("#stepCount");
  const progressFill = $("#progressFill");
  const panelNote = $("#panelNote");
  const timerEl = $("#timer");
  const goalCopy = $("#goalCopy");
  const mobileStep = $("#mobileStep");
  const mobileFill = $("#mobileFill");
  const mobileTimer = $("#mobileTimer");
  const mobileLevelBtn = $("#mobileLevelBtn");
  const mobileLevelName = $("#mobileLevelName");
  const instruction = $("#instruction");
  const instructionBadge = $("#instructionBadge");
  const instructionTitle = $("#instructionTitle");
  const instructionSub = $("#instructionSub");
  const tray = $("#tray");
  const trayStatus = $("#trayStatus");
  const toast = $("#toast");
  const helpModal = $("#helpModal");
  const victoryModal = $("#victoryModal");
  const winTime = $("#winTime");
  const winStars = $("#winStars");
  const confetti = $("#confetti");
  const soundBtn = $("#soundBtn");
  const photoBtn = $("#photoBtn");
  const photoBar = $("#photoBar");
  const photoSave = $("#photoSave");
  const photoExit = $("#photoExit");
  const photoStatus = $("#photoStatus");
  const bestText = $("#bestText");
  const winBest = $("#winBest");
  const winTitle = $("#winTitle");
  const winBadge = $("#winBadge");
  const levelBtn = $("#levelBtn");
  const levelLabel = $("#levelLabel");
  const levelName = $("#levelName");
  const levelDot = $("#levelDot");
  const goalArt = $("#goalArt");
  const levelsModal = $("#levelsModal");
  const levelGrid = $("#levelGrid");
  const nextLevel = $("#nextLevel");

  const STORAGE_KEY = "brickbloom.save.v1";
  const DEFAULT_SAVE = {
    levels: {},
    tutorialSeen: false,
    soundOn: true,
    currentLevel: "sunflower",
  };

  function loadSave() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_SAVE, levels: {} };
      const parsed = JSON.parse(raw);
      const result = {
        ...DEFAULT_SAVE,
        ...parsed,
        levels: { ...(parsed.levels || {}) },
      };

      // Migrate the original single-level save.
      if (!result.levels.sunflower && Number.isFinite(parsed.bestMs)) {
        result.levels.sunflower = {
          bestMs: parsed.bestMs,
          bestStars: Number.isFinite(parsed.bestStars) ? parsed.bestStars : 0,
          blooms: Number.isFinite(parsed.blooms) ? parsed.blooms : 1,
        };
      }

      if (!LEVELS.some((level) => level.id === result.currentLevel)) {
        result.currentLevel = "sunflower";
      }
      return result;
    } catch (error) {
      return { ...DEFAULT_SAVE, levels: {} };
    }
  }

  function persistSave() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
    } catch (error) {
      // Storage can be unavailable in private/file contexts — the game still works.
    }
  }

  const save = loadSave();

  function getLevelProgress(levelId) {
    const stored = save.levels[levelId];
    return {
      bestMs: stored && Number.isFinite(stored.bestMs) ? stored.bestMs : null,
      bestStars: stored && Number.isFinite(stored.bestStars) ? stored.bestStars : 0,
      blooms: stored && Number.isFinite(stored.blooms) ? stored.blooms : 0,
    };
  }

  const state = {
    current: 0,
    selected: false,
    transitioning: false,
    won: false,
    started: false,
    startedAt: 0,
    elapsed: 0,
    soundOn: save.soundOn,
    lastInstruction: "",
    winTimer: 0,
    nextTimer: 0,
  };

  let toastTimer = 0;
  let timerInterval = 0;
  let photoStatusTimer = 0;

  function haptic(pattern) {
    if (typeof navigator.vibrate !== "function") return;
    try { navigator.vibrate(pattern); } catch (error) { /* optional */ }
  }

  /* ---------------------------------------------------------
     UI rendering
     --------------------------------------------------------- */

  function checkIcon() {
    return `<svg viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="m3 7.2 2.4 2.4L11 4.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  function arrowIcon() {
    return `<svg viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  function renderStepList() {
    stepList.innerHTML = STEPS.map((step, index) => `
      <li class="step" data-step="${index}">
        <span class="step__num">${String(index + 1).padStart(2, "0")}</span>
        <span class="step__dot" style="--dot:${step.css}"></span>
        <span class="step__name">${step.th}<small>${step.en}</small></span>
        <span class="step__status"></span>
      </li>
    `).join("");
  }

  function studMarkup(count) {
    return Array.from({ length: count }, (_, i) => {
      const left = ((i + 1) / (count + 1)) * 100;
      return `<i style="left:calc(${left.toFixed(2)}% - 4px)"></i>`;
    }).join("");
  }

  function renderTray() {
    tray.style.setProperty("--steps", STEPS.length);
    tray.classList.toggle("tray--many", STEPS.length > 5);
    // Very long levels (12 pieces): tray scrolls sideways, step list gets compact.
    tray.classList.toggle("tray--scroll", STEPS.length > 8);
    stepList.classList.toggle("step-list--compact", STEPS.length > 8);
    tray.innerHTML = STEPS.map((step, index) => `
      <button class="piece" type="button" data-index="${index}" aria-pressed="false">
        <span class="brick-icon brick-icon--${step.icon}" style="--brick:${step.css}" aria-hidden="true">${studMarkup(step.studs)}</span>
        <span class="piece__copy">
          <span class="piece__en">${step.en}</span>
          <span class="piece__th">${step.th}</span>
        </span>
        <span class="piece__num">0${index + 1}</span>
        <span class="piece__check" aria-hidden="true">${checkIcon()}</span>
      </button>
    `).join("");

    tray.querySelectorAll(".piece").forEach((button) => {
      button.addEventListener("click", () => selectPiece(Number(button.dataset.index)));
    });
  }

  function setPopAnimation(el) {
    el.classList.remove("is-pop");
    // restart the tiny pop animation when the instruction changes
    void el.offsetWidth;
    el.classList.add("is-pop");
  }

  function updateHUD({ pop = true } = {}) {
    const current = state.current;
    const complete = current >= STEPS.length;

    stepCount.textContent = `${current} / ${STEPS.length}`;
    progressFill.style.width = `${(current / STEPS.length) * 100}%`;
    mobileFill.style.width = `${(current / STEPS.length) * 100}%`;
    mobileStep.textContent = complete ? "ครบ" : `${current + 1}/${STEPS.length}`;

    stepList.querySelectorAll(".step").forEach((element, index) => {
      const isDone = index < current;
      const isCurrent = index === current && !complete && !state.won;
      const isLocked = index > current;
      const status = element.querySelector(".step__status");

      element.classList.toggle("is-done", isDone);
      element.classList.toggle("is-current", isCurrent);
      element.classList.toggle("is-locked", isLocked);
      if (isCurrent) element.setAttribute("aria-current", "step");
      else element.removeAttribute("aria-current");

      if (isDone) status.innerHTML = checkIcon();
      else if (isCurrent) status.innerHTML = arrowIcon();
      else if (isLocked) status.textContent = "·";
      else status.textContent = "";
    });

    goalArt.querySelectorAll(".goal-piece").forEach((element) => {
      const stepIndex = Number(element.dataset.step);
      element.classList.toggle("is-built", Number.isFinite(stepIndex) && stepIndex < current);
    });

    tray.querySelectorAll(".piece").forEach((button, index) => {
      const isDone = index < current;
      const isNext = index === current && !complete && !state.won;
      const isSelected = state.selected && index === current;

      button.classList.toggle("is-done", isDone);
      button.classList.toggle("is-next", isNext && !isSelected);
      if (isNext && tray.scrollWidth > tray.clientWidth) {
        tray.scrollTo({ left: button.offsetLeft - tray.clientWidth / 2 + button.offsetWidth / 2, behavior: "smooth" });
      }
      button.classList.toggle("is-selected", isSelected);
      button.classList.toggle("is-locked", index > current);
      button.disabled = !isNext || state.transitioning;
      button.setAttribute("aria-pressed", String(isSelected));
      button.setAttribute(
        "aria-label",
        isDone
          ? `${STEPS[index].th} — ต่อแล้ว`
          : isSelected
            ? `${STEPS[index].th} — กด Enter เพื่อวาง`
            : isNext
              ? `${STEPS[index].th} — เลือกชิ้นนี้`
              : `${STEPS[index].th} — ล็อกอยู่`
      );
    });

    trayStatus.textContent = complete
      ? "ต่อครบทุกชิ้นแล้ว"
      : `พร้อมต่อ ${current + 1} จาก ${STEPS.length}`;

    if (complete || state.won) {
      instructionBadge.textContent = "✓";
      instructionTitle.textContent = "ต่อครบแล้ว!";
      instructionSub.textContent = LEVELS[activeLevelIndex].doneSub || "ลากฉากเพื่อชื่นชมดอกไม้";
      panelNote.textContent = "ดอกทานตะวันพร้อมแล้ว";
      goalCopy.textContent = LEVELS[activeLevelIndex].doneGoal || "ดอกทานตะวันบานเต็มที่แล้ว";
    } else {
      const step = STEPS[current];
      instructionBadge.textContent = String(current + 1);
      if (state.selected) {
        instructionTitle.textContent = "แตะจุดเรืองแสง";
        instructionSub.textContent = `วาง${step.th}ให้เข้าล็อก`;
      } else {
        instructionTitle.textContent = `หยิบ${step.th}จากถาด`;
        instructionSub.textContent = "แล้วแตะจุดเรืองแสงบนโมเดล";
      }
      panelNote.textContent = step.hint;
      goalCopy.textContent = step.goal;
    }

    const textKey = `${instructionTitle.textContent}|${instructionSub.textContent}`;
    if (pop && textKey !== state.lastInstruction) {
      setPopAnimation(instruction);
      state.lastInstruction = textKey;
    }
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  /* ---------------------------------------------------------
     Timer
     --------------------------------------------------------- */

  function formatTime(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function startTimer() {
    if (state.started || state.won) return;
    state.started = true;
    state.startedAt = performance.now();
    state.elapsed = 0;
    timerEl.textContent = "00:00";
    if (mobileTimer) mobileTimer.textContent = "00:00";

    window.clearInterval(timerInterval);
    timerInterval = window.setInterval(() => {
      if (!state.started || state.won) return;
      state.elapsed = performance.now() - state.startedAt;
      timerEl.textContent = formatTime(state.elapsed);
      if (mobileTimer) mobileTimer.textContent = formatTime(state.elapsed);
    }, 250);
  }

  function stopTimer() {
    if (state.started) state.elapsed = performance.now() - state.startedAt;
    state.started = false;
    window.clearInterval(timerInterval);
    timerInterval = 0;
  }

  function resetTimer() {
    window.clearInterval(timerInterval);
    timerInterval = 0;
    state.started = false;
    state.startedAt = 0;
    state.elapsed = 0;
    timerEl.textContent = "00:00";
    if (mobileTimer) mobileTimer.textContent = "00:00";
    winTime.textContent = "00:00";
  }

  /* ---------------------------------------------------------
     Audio — tiny synthesized plastic clicks
     --------------------------------------------------------- */

  let audioCtx = null;
  let masterGain = null;

  function ensureAudio() {
    if (!state.soundOn) return null;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;

    if (!audioCtx) {
      audioCtx = new AudioContext();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.46;
      masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
    return audioCtx;
  }

  function tone(freq, duration, type = "sine", volume = 0.04, when = 0, slideTo = null) {
    const ctx = ensureAudio();
    if (!ctx || !masterGain) return;
    const start = ctx.currentTime + when;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, start);
    if (slideTo) oscillator.frequency.exponentialRampToValueAtTime(slideTo, start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(masterGain);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  function sfxSelect() {
    tone(520, 0.07, "triangle", 0.025);
    tone(780, 0.06, "sine", 0.018, 0.035);
  }

  function sfxPlace() {
    tone(190, 0.1, "square", 0.03, 0, 95);
    tone(460, 0.09, "triangle", 0.026);
    tone(700, 0.1, "sine", 0.018, 0.055);
  }

  function sfxBloom() {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      tone(freq, 0.18, "sine", 0.024, i * 0.085);
      tone(freq / 2, 0.16, "triangle", 0.012, i * 0.085);
    });
  }

  function sfxWin() {
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((freq, i) => {
      tone(freq, 0.32, "triangle", 0.026, i * 0.1);
    });
    tone(261.63, 0.7, "sine", 0.018, 0.1);
  }

  /* ---------------------------------------------------------
     Three.js scene
     --------------------------------------------------------- */

  let renderer = null;
  let scene = null;
  let camera = null;
  let clock = null;
  let baseplate = null;
  let domeGroup = null;
  let soilGroup = null;
  // Day / night
  let hemiLight = null;
  let keyLight = null;
  let fillLight = null;
  let rimLight = null;
  let lanternLight = null;
  let fairyLights = null;
  const groundMats = {};
  let isNight = false;
  try { isNight = localStorage.getItem("bb-theme") === "night"; } catch (error) { /* storage unavailable */ }
  // Christmas theme: on/off is saved; with no saved choice it turns on by itself from 1 Dec to 6 Jan.
  let isXmas = (() => {
    const now = new Date();
    return now.getMonth() === 11 || (now.getMonth() === 0 && now.getDate() <= 6);
  })();
  try {
    const saved = localStorage.getItem("bb-xmas");
    if (saved) isXmas = saved === "on";
  } catch (error) { /* storage unavailable */ }
  let startupStep = ""; // "help" -> "levels" -> "" while the opening screens show
  const DOME_RADIUS = 1.9;
  const DOME_HEIGHT = 3.15;
  let stemGroup = null;
  let leafLeftGroup = null;
  let leafRightGroup = null;
  let centerGroup = null;
  let petalGroup = null;
  let beeGroup = null;
  let particleSystem = null;
  let particleData = null;
  let particleLife = 0;
  let particleOrigin = null;
  let ambientPollen = null;
  let ambientPollenData = null;
  let blueprintGroup = null;
  let blueprintMaterial = null;

  let pieceGroups = [];
  let ghostGroups = [];
  let markers = [];
  let hitMeshes = [];
  let petalRoots = [];
  const tweens = [];
  let headSwayGroups = [];
  let leafSway = [];
  const levelRuntimes = [];
  let activeRuntime = null;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const cameraTarget = new THREE.Vector3(0, 1.7, 0);
  const cameraState = {
    theta: 0.42,
    phi: 1.24,
    radius: 14.3,
    desiredTheta: 0.42,
    desiredPhi: 1.24,
    desiredRadius: 14.3,
    userZoomed: false,
  };

  const materialCache = new Map();
  let studioEnv = null; // reflection map used only by the plastic bricks
  const glowTexture = makeGlowTexture();
  const markerTexture = makeMarkerTexture();
  const particleTexture = makeParticleTexture();

  /* ---------------------------------------------------------
     Texture factories
     --------------------------------------------------------- */

  function makeGlowTexture() {
    const size = 256;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,255,255,0.85)");
    gradient.addColorStop(0.26, "rgba(255,235,143,0.42)");
    gradient.addColorStop(0.58, "rgba(255,205,56,0.12)");
    gradient.addColorStop(1, "rgba(255,190,20,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(c);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  function makeMarkerTexture() {
    const size = 256;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    const center = size / 2;

    const glow = ctx.createRadialGradient(center, center, 18, center, center, 124);
    glow.addColorStop(0, "rgba(255,255,255,0.08)");
    glow.addColorStop(0.53, "rgba(255,231,130,0.13)");
    glow.addColorStop(0.72, "rgba(255,199,44,0.05)");
    glow.addColorStop(1, "rgba(255,199,44,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = "rgba(255,255,255,0.95)";
    ctx.lineWidth = 8;
    ctx.setLineDash([18, 13]);
    ctx.lineDashOffset = 4;
    ctx.beginPath();
    ctx.arc(center, center, 86, 0, Math.PI * 2);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(center, center, 104, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.94)";
    ctx.beginPath();
    ctx.arc(center, center, 12, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(c);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  function makeNumberTexture(number) {
    const size = 128;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    const x = 24;
    const y = 18;
    const w = 80;
    const h = 80;
    const radius = 24;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
    ctx.fillStyle = "#332e25";
    ctx.fill();
    ctx.strokeStyle = "#fff5d8";
    ctx.lineWidth = 7;
    ctx.stroke();
    ctx.fillStyle = "#ffc72c";
    ctx.font = "800 48px Avenir Next, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(number), size / 2, size / 2 + 3);
    const texture = new THREE.CanvasTexture(c);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  function makeParticleTexture() {
    const size = 64;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.3, "rgba(255,250,191,0.9)");
    gradient.addColorStop(0.65, "rgba(255,208,48,0.28)");
    gradient.addColorStop(1, "rgba(255,199,44,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(c);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  /* ---------------------------------------------------------
     Materials and geometry helpers
     --------------------------------------------------------- */

  function plastic(color, options = {}) {
    const key = `${color}-${JSON.stringify(options)}`;
    if (materialCache.has(key)) return materialCache.get(key);
    const material = new THREE.MeshPhysicalMaterial({
      color,
      roughness: 0.36,
      metalness: 0.015,
      clearcoat: 0.52,
      clearcoatRoughness: 0.3,
      envMap: studioEnv,
      envMapIntensity: 0.4,
      ...options,
    });
    materialCache.set(key, material);
    return material;
  }

  function mesh(geometry, material, position = [0, 0, 0], rotation = [0, 0, 0]) {
    const item = new THREE.Mesh(geometry, material);
    item.position.set(position[0], position[1], position[2]);
    item.rotation.set(rotation[0], rotation[1], rotation[2]);
    item.castShadow = true;
    item.receiveShadow = true;
    return item;
  }

  function makeStudGeometry(radius = 0.14, height = 0.1) {
    return new THREE.CylinderGeometry(radius, radius, height, 18);
  }

  function addStud(parent, x, y, z, color, radius = 0.14, height = 0.1, rotationX = 0) {
    const stud = mesh(makeStudGeometry(radius, height), plastic(color), [x, y, z], [rotationX, 0, 0]);
    parent.add(stud);
    return stud;
  }

  function addBox(parent, size, position, color, rotation = [0, 0, 0]) {
    const item = mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), plastic(color), position, rotation);
    parent.add(item);
    return item;
  }

  /* ---------------------------------------------------------
     Scene setup
     --------------------------------------------------------- */

  function initScene() {
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: true,
      });
    } catch (error) {
      showFallback();
      return false;
    }

    renderer.setPixelRatio(sharpPixelRatio(stage.clientWidth, stage.clientHeight));
    renderer.setSize(stage.clientWidth, stage.clientHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf3dfb5, 26, 52); // starts behind the model at every zoom level (max camera distance is 18)

    camera = new THREE.PerspectiveCamera(
      window.innerWidth < 760 ? 49 : window.innerWidth < 1100 ? 42 : 38,
      stage.clientWidth / Math.max(1, stage.clientHeight),
      0.1,
      80
    );
    camera.position.set(5.4, 7.4, 12.3);

    studioEnv = createStudioEnvironment();

    hemiLight = new THREE.HemisphereLight(0xfff8e4, 0x668a55, 0.58);
    scene.add(hemiLight);

    keyLight = new THREE.DirectionalLight(0xfff0ca, 2.02);
    keyLight.position.set(6.5, 11, 7.5);
    keyLight.target.position.set(0, 1.6, 0);
    keyLight.castShadow = true;
    const shadowSize = window.innerWidth < 760 ? 1024 : 2048;
    keyLight.shadow.mapSize.set(shadowSize, shadowSize);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 32;
    keyLight.shadow.camera.left = -7;
    keyLight.shadow.camera.right = 7;
    keyLight.shadow.camera.top = 10;
    keyLight.shadow.camera.bottom = -6;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.022;
    scene.add(keyLight);
    scene.add(keyLight.target);

    fillLight = new THREE.DirectionalLight(0xc5e9ff, 0.38);
    fillLight.position.set(-7, 5, -4);
    scene.add(fillLight);

    rimLight = new THREE.DirectionalLight(0xffd999, 0.7);
    rimLight.position.set(-1, 4, 9);
    scene.add(rimLight);

    createGround();
    createBaseplate();
    createNightLights();
    buildAllLevels();
    createParticles();
    createAmbientPollen();
    createBee();

    resizeRenderer();
    applyTheme({ animate: false });
    clock = new THREE.Clock();
    activateLevel(getInitialLevelIndex(), { silent: true, boot: true });

    window.addEventListener("resize", resizeRenderer);
    animate();
    window.requestAnimationFrame(() => app.classList.add("is-ready"));
    return true;
  }

  // Soft "photo studio" reflections so the bricks look like glossy LEGO plastic.
  // Built from a few glowing panels; no image files needed.
  function createStudioEnvironment() {
    try {
      const envScene = new THREE.Scene();
      envScene.background = new THREE.Color(0x2a241c); // dark room: only the panels make highlights
      const panel = (color, intensity, size, pos) => {
        const m = new THREE.Mesh(
          new THREE.PlaneGeometry(size[0], size[1]),
          new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide })
        );
        m.position.set(pos[0], pos[1], pos[2]);
        m.lookAt(0, 0, 0);
        envScene.add(m);
      };
      panel(0xffffff, 3.2, [6, 3], [4, 7, 5]);    // big soft key window
      panel(0xfff0d0, 1.8, [4, 4], [-6, 3, 2]);   // warm side fill
      panel(0xd8efff, 1.4, [8, 2], [0, 4, -7]);   // cool back strip
      panel(0x9fc98a, 0.6, [14, 14], [0, -6, 0]); // green bounce from below
      const pmrem = new THREE.PMREMGenerator(renderer);
      const target = pmrem.fromScene(envScene, 0.04);
      pmrem.dispose();
      return target.texture;
    } catch (error) {
      return null;
    }
  }

  /* ---------------------------------------------------------
     Day / night mode
     --------------------------------------------------------- */

  // A warm glow inside the dome and a ring of fairy lights round the base.
  // Both are only switched on at night.
  function createNightLights() {
    lanternLight = new THREE.PointLight(0xffc27a, 0, 7, 1.6);
    lanternLight.position.set(0, 3.4, 0.9);
    scene.add(lanternLight);

    fairyLights = new THREE.Group();
    const bulbGeo = new THREE.SphereGeometry(0.045, 10, 8);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffd98a });
    const glowMat = new THREE.SpriteMaterial({ map: glowTexture, color: 0xffc86b, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending });
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x3a2a1a });
    const count = 22;
    const r = 2.5;
    fairyLights.add(new THREE.Mesh(new THREE.TorusGeometry(r, 0.008, 4, 96), wireMat));
    fairyLights.children[0].rotation.x = Math.PI / 2;
    for (let i = 0; i < count; i += 1) {
      const a = (i / count) * Math.PI * 2;
      const sag = Math.abs(Math.sin(a * 11)) * 0.02;
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(Math.cos(a) * r, -sag, Math.sin(a) * r);
      const glow = new THREE.Sprite(glowMat.clone());
      glow.scale.setScalar(0.42);
      glow.position.copy(bulb.position);
      glow.userData.phase = i * 0.7;
      fairyLights.add(bulb, glow);
    }
    fairyLights.position.y = -0.2;
    fairyLights.visible = false;
    scene.add(fairyLights);
  }

  const DAY = {
    hemiSky: 0xfff8e4, hemiGround: 0x668a55, hemi: 0.58,
    key: 0xfff0ca, keyI: 2.02, fill: 0xc5e9ff, fillI: 0.38, rim: 0xffd999, rimI: 0.7,
    fog: 0xf3dfb5, ground: COLORS.ground, mat: COLORS.mat, matRim: COLORS.matRim,
    exposure: 0.92, lantern: 0, pollen: 0xfff0b0, pollenSize: 0.065, pollenOpacity: 0.58,
  };
  const NIGHT = {
    hemiSky: 0x8fa6ff, hemiGround: 0x2a2f4a, hemi: 0.5,
    key: 0xbccaff, keyI: 0.95, fill: 0x6f7fd8, fillI: 0.35, rim: 0xffb36b, rimI: 0.45,
    fog: 0x262c55, ground: 0x3b4068, mat: 0x4a4f78, matRim: 0x6c6a92,
    exposure: 1.05, lantern: 2.2, pollen: 0xffe27a, pollenSize: 0.11, pollenOpacity: 0.95,
  };

  // Snowy ground and falling snow, layered over the day or night palette.
  const XMAS_DAY = {
    hemiSky: 0xf2f7ff, fog: 0xe4edf5, ground: 0xe9f0f5, mat: 0xf6f9fb, matRim: 0xc9d7e2,
    pollen: 0xffffff, pollenSize: 0.1, pollenOpacity: 0.92,
  };
  const XMAS_NIGHT = {
    fog: 0x2a3560, ground: 0x7d88b3, mat: 0x9aa4c8, matRim: 0x6f789e,
    pollen: 0xffffff, pollenSize: 0.11, pollenOpacity: 0.9,
  };

  // Bees stay away at night, in winter and on non-flower levels.
  function beeAllowed() {
    return !isNight && !isXmas && !LEVELS[activeLevelIndex].noBee;
  }

  let themeToken = 0;

  function applyTheme({ animate = true } = {}) {
    app.classList.toggle("is-night", isNight);
    app.classList.toggle("is-xmas", isXmas);
    document.documentElement.classList.toggle("is-xmas", isXmas);
    document.getElementById("introNight")?.setAttribute("aria-pressed", String(isNight));
    document.getElementById("introXmas")?.setAttribute("aria-pressed", String(isXmas));
    document.getElementById("xmasBtn")?.setAttribute("aria-pressed", String(isXmas));
    document.getElementById("themeBtn")?.setAttribute("aria-pressed", String(isNight));
    if (!hemiLight) return;
    const from = {
      hemiSky: hemiLight.color.clone(), hemiGround: hemiLight.groundColor.clone(), hemi: hemiLight.intensity,
      key: keyLight.color.clone(), keyI: keyLight.intensity, fill: fillLight.color.clone(), fillI: fillLight.intensity,
      rim: rimLight.color.clone(), rimI: rimLight.intensity, fog: scene.fog.color.clone(),
      ground: groundMats.ground.color.clone(), mat: groundMats.mat.color.clone(), matRim: groundMats.rim.color.clone(),
      exposure: renderer.toneMappingExposure, lantern: lanternLight.intensity,
      pollen: ambientPollen ? ambientPollen.material.color.clone() : new THREE.Color(),
      pollenSize: ambientPollen ? ambientPollen.material.size : 0.065,
      pollenOpacity: ambientPollen ? ambientPollen.material.opacity : 0.58,
    };
    const base = isNight ? NIGHT : DAY;
    const to = isXmas ? { ...base, ...(isNight ? XMAS_NIGHT : XMAS_DAY) } : base;
    const c = new THREE.Color();
    const mix = (a, hex, p) => a.clone().lerp(c.setHex(hex), p);
    // Only the newest theme change may paint, so two quick taps can't fight.
    const token = ++themeToken;
    const step = (p) => {
      if (token !== themeToken) return;
      hemiLight.color.copy(mix(from.hemiSky, to.hemiSky, p));
      hemiLight.groundColor.copy(mix(from.hemiGround, to.hemiGround, p));
      hemiLight.intensity = THREE.MathUtils.lerp(from.hemi, to.hemi, p);
      keyLight.color.copy(mix(from.key, to.key, p));
      keyLight.intensity = THREE.MathUtils.lerp(from.keyI, to.keyI, p);
      fillLight.color.copy(mix(from.fill, to.fill, p));
      fillLight.intensity = THREE.MathUtils.lerp(from.fillI, to.fillI, p);
      rimLight.color.copy(mix(from.rim, to.rim, p));
      rimLight.intensity = THREE.MathUtils.lerp(from.rimI, to.rimI, p);
      scene.fog.color.copy(mix(from.fog, to.fog, p));
      groundMats.ground.color.copy(mix(from.ground, to.ground, p));
      groundMats.mat.color.copy(mix(from.mat, to.mat, p));
      groundMats.rim.color.copy(mix(from.matRim, to.matRim, p));
      renderer.toneMappingExposure = THREE.MathUtils.lerp(from.exposure, to.exposure, p);
      lanternLight.intensity = THREE.MathUtils.lerp(from.lantern, to.lantern, p);
      if (ambientPollen) {
        // Pollen by day, fireflies by night.
        ambientPollen.material.color.copy(mix(from.pollen, to.pollen, p));
        ambientPollen.material.size = THREE.MathUtils.lerp(from.pollenSize, to.pollenSize, p);
        ambientPollen.material.opacity = THREE.MathUtils.lerp(from.pollenOpacity, to.pollenOpacity, p);
      }
    };
    ambientPollen && (ambientPollen.material.blending = isNight && !isXmas ? THREE.AdditiveBlending : THREE.NormalBlending);
    ambientPollen && (ambientPollen.material.needsUpdate = true);
    fairyLights.visible = isNight || isXmas;
    // Red / green / gold bulbs for Christmas, warm white otherwise.
    let bulb = 0;
    fairyLights.children.forEach((child) => {
      if (!child.isSprite) return;
      child.material.color.setHex(isXmas ? [0xff4040, 0x3fd46a, 0xffd34d][bulb % 3] : 0xffc86b);
      bulb += 1;
    });
    // Bees sleep at night.
    if (beeGroup && state.won) beeGroup.visible = beeAllowed();
    if (animate && !reducedMotion) tween(0.9, 0, step);
    else step(1);
  }

  function toggleTheme() {
    isNight = !isNight;
    try { localStorage.setItem("bb-theme", isNight ? "night" : "day"); } catch (error) { /* ignore */ }
    applyTheme();
    showToast(isNight ? "โหมดกลางคืน" : "โหมดกลางวัน");
  }

  function toggleXmas() {
    isXmas = !isXmas;
    try { localStorage.setItem("bb-xmas", isXmas ? "on" : "off"); } catch (error) { /* ignore */ }
    applyTheme();
    showToast(isXmas ? "ธีมคริสต์มาส" : "ธีมดอกไม้");
  }

  function updateNightLights(time) {
    if (!fairyLights || !fairyLights.visible) return;
    fairyLights.children.forEach((child) => {
      if (child.isSprite) child.material.opacity = 0.65 + Math.sin(time * 2.2 + child.userData.phase) * 0.25;
    });
    if (lanternLight && isNight) lanternLight.intensity = NIGHT.lantern * (0.92 + Math.sin(time * 1.7) * 0.06);
  }

  function createGround() {
    groundMats.ground = new THREE.MeshStandardMaterial({ color: COLORS.ground, roughness: 1, metalness: 0 });
    const ground = mesh(
      new THREE.PlaneGeometry(120, 120),
      groundMats.ground,
      [0, -0.42, 0],
      [-Math.PI / 2, 0, 0]
    );
    ground.receiveShadow = true;
    ground.castShadow = false;
    scene.add(ground);

    groundMats.mat = new THREE.MeshStandardMaterial({ color: COLORS.mat, roughness: 1, metalness: 0 });
    const mat = mesh(
      new THREE.CircleGeometry(4.02, 80),
      groundMats.mat,
      [0, -0.365, 0],
      [-Math.PI / 2, 0, 0]
    );
    mat.receiveShadow = true;
    mat.castShadow = false;
    scene.add(mat);

    groundMats.rim = new THREE.MeshStandardMaterial({ color: COLORS.matRim, roughness: 1 });
    const rim = mesh(
      new THREE.RingGeometry(3.98, 4.12, 80),
      groundMats.rim,
      [0, -0.355, 0],
      [-Math.PI / 2, 0, 0]
    );
    rim.receiveShadow = true;
    rim.castShadow = false;
    scene.add(rim);
  }

  // Wood grain drawn on a canvas, so no image files are needed.
  function woodTexture(repeatX = 6) {
    const c = document.createElement("canvas");
    c.width = 512; c.height = 64;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#c98a4b";
    ctx.fillRect(0, 0, c.width, c.height);
    for (let i = 0; i < 46; i += 1) {
      const y = Math.random() * c.height;
      ctx.strokeStyle = `rgba(${Math.random() < 0.5 ? "120,70,30" : "235,180,120"},${0.12 + Math.random() * 0.22})`;
      ctx.lineWidth = 0.6 + Math.random() * 2.2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= c.width; x += 32) ctx.lineTo(x, y + Math.sin(x * 0.02 + i) * 2.2);
      ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(c);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(repeatX, 1);
    return texture;
  }

  function woodRingTexture() {
    const size = 256;
    const c = document.createElement("canvas");
    c.width = size; c.height = size;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#d39a5c";
    ctx.fillRect(0, 0, size, size);
    for (let r = 4; r < size * 0.72; r += 5 + Math.random() * 7) {
      ctx.strokeStyle = `rgba(130,78,36,${0.1 + Math.random() * 0.16})`;
      ctx.lineWidth = 1 + Math.random() * 1.6;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(c);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // Round wooden display base with a small round brick plate on top
  // (like the gift-style nano-brick flower sets).
  function createBaseplate() {
    baseplate = new THREE.Group();

    const woodSide = new THREE.MeshStandardMaterial({ map: woodTexture(), roughness: 0.62, metalness: 0 });
    const woodTop = new THREE.MeshStandardMaterial({ map: woodRingTexture(), roughness: 0.58, metalness: 0 });

    // Lower wide disc + upper narrower disc = classic turned-wood stand.
    const lower = mesh(new THREE.CylinderGeometry(2.45, 2.55, 0.26, 72), [woodSide, woodTop, woodTop], [0, -0.32, 0]);
    const upper = mesh(new THREE.CylinderGeometry(2.2, 2.3, 0.2, 72), [woodSide, woodTop, woodTop], [0, -0.1, 0]);
    baseplate.add(lower, upper);

    // Darker groove where the glass dome sits.
    const groove = mesh(
      new THREE.RingGeometry(DOME_RADIUS - 0.03, DOME_RADIUS + 0.07, 72),
      new THREE.MeshStandardMaterial({ color: 0x7a4a24, roughness: 0.8 }),
      [0, 0.004, 0],
      [-Math.PI / 2, 0, 0]
    );
    groove.castShadow = false;
    baseplate.add(groove);

    // Soil bed made of brick pieces: a dark brown disc covered in lumpy
    // 1x1 round plates in mixed earth tones, with pebbles and grass tufts.
    soilGroup = new THREE.Group();
    const plateR = 1.55;
    const disc = mesh(new THREE.CylinderGeometry(plateR, plateR, 0.09, 56), plastic(0x3e2614, { roughness: 0.8, clearcoat: 0.1 }), [0, 0.045, 0]);
    disc.castShadow = false;
    soilGroup.add(disc);
    soilGroup.add(mesh(new THREE.TorusGeometry(plateR, 0.04, 8, 64), plastic(0x2e1c0e, { roughness: 0.7 }), [0, 0.09, 0], [Math.PI / 2, 0, 0]));

    // One "round 1x1 plate with stud" shape, reused for every soil bump.
    const joinGeos = (list) => {
      const parts = list.map((g) => (g.index ? g.toNonIndexed() : g));
      const count = parts.reduce((n, g) => n + g.attributes.position.count, 0);
      const pos = new Float32Array(count * 3);
      const nor = new Float32Array(count * 3);
      let o = 0;
      parts.forEach((g) => {
        pos.set(g.attributes.position.array, o * 3);
        nor.set(g.attributes.normal.array, o * 3);
        o += g.attributes.position.count;
      });
      const out = new THREE.BufferGeometry();
      out.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      out.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
      return out;
    };
    const body = new THREE.CylinderGeometry(0.11, 0.11, 0.08, 14);
    const knob = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 12);
    knob.translate(0, 0.06, 0);
    const bumpGeo = joinGeos([body, knob]);

    const earth = [0x6b4226, 0x5a3820, 0x7a4e2c, 0x4a2e1a, 0x845634];
    const spots = [];
    const step = 0.23;
    for (let row = 0, z = -plateR; z <= plateR; z += step * 0.87, row += 1) {
      for (let x = -plateR + (row % 2) * step * 0.5; x <= plateR; x += step) {
        const r = Math.hypot(x, z);
        if (r < plateR - 0.12 && r > 0.48) spots.push([x, z]);
      }
    }
    const bumps = new THREE.InstancedMesh(bumpGeo, plastic(0xffffff, { roughness: 0.75, clearcoat: 0.15 }), spots.length);
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    let seed = 7;
    const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    spots.forEach(([x, z], i) => {
      const r = Math.hypot(x, z);
      const mound = 0.05 * Math.max(0, 1 - (r - 0.48) / 1.0); // a little higher near the stem
      dummy.position.set(x + (rand() - 0.5) * 0.04, 0.13 + mound + rand() * 0.04, z + (rand() - 0.5) * 0.04);
      dummy.rotation.set((rand() - 0.5) * 0.25, rand() * Math.PI, (rand() - 0.5) * 0.25);
      dummy.updateMatrix();
      bumps.setMatrixAt(i, dummy.matrix);
      bumps.setColorAt(i, color.setHex(earth[Math.floor(rand() * earth.length)]));
    });
    bumps.instanceMatrix.needsUpdate = true;
    if (bumps.instanceColor) bumps.instanceColor.needsUpdate = true;
    bumps.castShadow = true;
    bumps.receiveShadow = true;
    soilGroup.add(bumps);

    // Pebbles.
    [[0.9, 0.55], [-1.05, 0.3], [0.35, -1.1], [-0.6, -0.95], [1.15, -0.4], [-0.25, 1.15]].forEach(([x, z], i) => {
      const pebble = mesh(new THREE.SphereGeometry(0.09 + (i % 3) * 0.02, 12, 8), plastic(i % 2 ? 0xa59d92 : 0x8c857b, { roughness: 0.6 }), [x, 0.2, z]);
      pebble.scale.set(1.3, 0.6, 1);
      soilGroup.add(pebble);
    });

    // Little grass tufts near the edge.
    [[1.2, 0.15], [-0.95, 0.85], [0.55, 1.05], [-1.15, -0.55], [0.85, -0.95]].forEach(([x, z], i) => {
      const tuft = new THREE.Group();
      tuft.position.set(x, 0.18, z);
      tuft.rotation.y = i;
      [-0.25, 0, 0.25].forEach((lean, k) => {
        tuft.add(mesh(new THREE.ConeGeometry(0.025, 0.22 + k * 0.04, 6), plastic(k % 2 ? COLORS.greenLight : COLORS.green), [lean * 0.15, 0.1, 0], [0, 0, lean]));
      });
      soilGroup.add(tuft);
    });

    baseplate.add(soilGroup);

    scene.add(baseplate);
    createDome();
  }

  // Glass dome that drops over the finished flower.
  function createDome() {
    domeGroup = new THREE.Group();
    const h = DOME_HEIGHT;

    // Glass that is clear when you look straight through it and only shows
    // at grazing angles (the rim), like real glass. The old version tinted
    // the whole dome white, which made the flower look hazy.
    const glassMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(0xffffff) },
        uEdge: { value: 0.5 },   // opacity at the silhouette
        uCenter: { value: 0.0 }, // opacity when looking straight through
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vView;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vView = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uEdge;
        uniform float uCenter;
        varying vec3 vNormal;
        varying vec3 vView;
        void main() {
          float facing = abs(dot(normalize(vNormal), normalize(vView)));
          float rim = pow(1.0 - facing, 3.5);
          gl_FragColor = vec4(uColor, mix(uCenter, uEdge, rim));
        }`,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    domeGroup.userData.glass = glassMaterial;

    const body = new THREE.Mesh(new THREE.CylinderGeometry(DOME_RADIUS, DOME_RADIUS, h, 72, 1, true), glassMaterial);
    body.position.y = h / 2;
    const cap = new THREE.Mesh(
      new THREE.SphereGeometry(DOME_RADIUS, 72, 28, 0, Math.PI * 2, 0, Math.PI / 2),
      glassMaterial
    );
    cap.position.y = h;
    [body, cap].forEach((m) => { m.renderOrder = 6; m.castShadow = false; m.receiveShadow = false; });
    domeGroup.add(body, cap);

    // Small knob on top and a thin bright ring at the bottom edge.
    const knob = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 20, 14),
      new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, roughness: 0.05, envMap: studioEnv, envMapIntensity: 1.2 })
    );
    knob.position.y = h + DOME_RADIUS + 0.08;
    knob.renderOrder = 7;
    domeGroup.add(knob);

    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(DOME_RADIUS, 0.035, 8, 72),
      new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, roughness: 0.1, envMap: studioEnv })
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.03;
    rim.renderOrder = 7;
    domeGroup.add(rim);

    domeGroup.visible = false;
    scene.add(domeGroup);
  }


  function hideDome() {
    if (domeGroup) domeGroup.visible = false;
  }

  function dropDome() {
    if (!domeGroup) return;
    domeGroup.visible = true;
    if (reducedMotion) { domeGroup.position.y = 0; return; }
    domeGroup.position.y = 6;
    tween(1.1, 0.35, (p) => {
      // Ease out with a tiny settle bounce at the end.
      const e = 1 - Math.pow(1 - p, 3);
      const bounce = p > 0.8 ? Math.sin((p - 0.8) / 0.2 * Math.PI) * 0.06 : 0;
      domeGroup.position.y = 6 * (1 - e) + bounce;
    }, () => { domeGroup.position.y = 0; sfxSelect?.(); });
  }

  /* ---------------------------------------------------------
     Performance: merge the many small meshes of each piece into a few
     (one per material). Looks identical, but phones draw far fewer objects.
     Groups listed in `keepSeparate` (petals that pop in one by one) are
     merged on their own so their animation still works.
     --------------------------------------------------------- */

  function mergePieceMeshes(root, keepSeparate = new Set()) {
    root.updateMatrixWorld(true);
    const inverseRoot = new THREE.Matrix4().copy(root.matrixWorld).invert();
    const buckets = new Map();
    const toRemove = [];

    const visit = (node) => {
      node.children.forEach((child) => {
        if (keepSeparate.has(child)) {
          mergePieceMeshes(child, keepSeparate);
          return;
        }
        if (child.isMesh && !child.isInstancedMesh && !Array.isArray(child.material)) {
          const rel = new THREE.Matrix4().multiplyMatrices(inverseRoot, child.matrixWorld);
          let geo = child.geometry.index ? child.geometry.toNonIndexed() : child.geometry.clone();
          Object.keys(geo.attributes).forEach((name) => {
            if (name !== "position" && name !== "normal") geo.deleteAttribute(name);
          });
          geo.applyMatrix4(rel);
          const key = child.material.uuid;
          if (!buckets.has(key)) buckets.set(key, { material: child.material, geos: [] });
          buckets.get(key).geos.push(geo);
          toRemove.push(child);
        }
        visit(child);
      });
    };
    visit(root);

    toRemove.forEach((m) => m.parent && m.parent.remove(m));
    buckets.forEach(({ material, geos }) => {
      const total = geos.reduce((n, g) => n + g.attributes.position.count, 0);
      const positions = new Float32Array(total * 3);
      const normals = new Float32Array(total * 3);
      let offset = 0;
      geos.forEach((g) => {
        positions.set(g.attributes.position.array, offset * 3);
        if (g.attributes.normal) normals.set(g.attributes.normal.array, offset * 3);
        offset += g.attributes.position.count;
        g.dispose();
      });
      const merged = new THREE.BufferGeometry();
      merged.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      merged.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
      merged.computeBoundingSphere();
      const m = new THREE.Mesh(merged, material);
      m.castShadow = true;
      m.receiveShadow = true;
      root.add(m);
    });
  }

  function buildAllLevels() {
    levelRuntimes.length = 0;

    LEVELS.forEach((level) => {
      STEPS = level.steps;
      pieceGroups = [];
      ghostGroups = [];
      markers = [];
      hitMeshes = [];
      petalRoots = [];
      headSwayGroups = [];
      leafSway = [];

      const model = level.build();
      if (level.lift) model.groups.forEach((group) => { group.position.y += level.lift; });
      const separate = new Set(model.petalRoots || []);
      model.groups.forEach((group) => mergePieceMeshes(group, separate));
      pieceGroups.push(...model.groups);
      pieceGroups.forEach((group) => {
        group.visible = false;
        scene.add(group);
      });

      petalRoots = model.petalRoots || [];
      headSwayGroups = model.headSwayGroups || [model.centerGroup, model.petalGroup];
      leafSway = model.leafSway || [];
      stemGroup = model.stemGroup;
      leafLeftGroup = model.leafLeftGroup;
      leafRightGroup = model.leafRightGroup;
      centerGroup = model.centerGroup;
      petalGroup = model.petalGroup;

      createGhosts();
      createBlueprint();
      createTargets();

      pieceGroups.forEach((group) => { group.visible = false; });
      ghostGroups.forEach((ghost) => { ghost.visible = false; });
      markers.forEach((marker) => { marker.visible = false; });
      if (blueprintGroup) blueprintGroup.visible = false;

      const runtime = {
        level,
        steps: level.steps,
        pieceGroups,
        ghostGroups,
        markers,
        hitMeshes,
        petalRoots,
        headSwayGroups,
        leafSway,
        stemGroup,
        leafLeftGroup,
        leafRightGroup,
        centerGroup,
        petalGroup,
        blueprintGroup,
        blueprintMaterial,
      };
      levelRuntimes.push(runtime);
    });

    STEPS = LEVELS[0].steps;
  }

  function getInitialLevelIndex() {
    const index = LEVELS.findIndex((level) => level.id === save.currentLevel);
    return index >= 0 ? index : 0;
  }

  function hideRuntime(runtime) {
    if (!runtime) return;
    runtime.pieceGroups.forEach((group) => { group.visible = false; });
    runtime.ghostGroups.forEach((ghost) => { ghost.visible = false; });
    runtime.markers.forEach((marker) => { marker.visible = false; });
    if (runtime.blueprintGroup) runtime.blueprintGroup.visible = false;
  }

  function assignRuntime(runtime) {
    activeRuntime = runtime;
    STEPS = runtime.steps;
    pieceGroups = runtime.pieceGroups;
    ghostGroups = runtime.ghostGroups;
    markers = runtime.markers;
    hitMeshes = runtime.hitMeshes;
    petalRoots = runtime.petalRoots;
    headSwayGroups = runtime.headSwayGroups;
    leafSway = runtime.leafSway;
    stemGroup = runtime.stemGroup;
    leafLeftGroup = runtime.leafLeftGroup;
    leafRightGroup = runtime.leafRightGroup;
    centerGroup = runtime.centerGroup;
    petalGroup = runtime.petalGroup;
    blueprintGroup = runtime.blueprintGroup;
    blueprintMaterial = runtime.blueprintMaterial;
  }

  function resetActivePieces() {
    pieceGroups.forEach((group) => {
      group.visible = false;
      group.scale.setScalar(group.userData.baseScale || 1);
      group.rotation.z = 0;
    });
    ghostGroups.forEach((ghost) => { ghost.visible = false; });
    markers.forEach((marker) => { marker.visible = false; });
    petalRoots.forEach((petal) => petal.scale.set(1, 1, 1));
    stemGroup.scale.set(1, 1, 1);
    if (leafLeftGroup) leafLeftGroup.rotation.z = leafSway[0]?.baseZ ?? 0.4;
    if (leafRightGroup) leafRightGroup.rotation.z = leafSway[1]?.baseZ ?? 0.42;
    if (centerGroup) centerGroup.rotation.z = 0;
    if (petalGroup) petalGroup.rotation.z = 0;
    if (blueprintGroup && blueprintMaterial) {
      blueprintGroup.visible = false;
      blueprintMaterial.opacity = 0.24;
    }
  }

  function updateLevelUI() {
    const level = LEVELS[activeLevelIndex];
    if (!level) return;
    levelLabel.textContent = `LEVEL ${String(activeLevelIndex + 1).padStart(2, "0")}`;
    levelName.textContent = level.th;
    mobileLevelName.textContent = level.th;
    levelDot.style.background = level.accent;
    levelDot.style.boxShadow = `0 0 0 3px ${level.accent}33`;
    levelBtn.setAttribute("aria-label", `เลือกด่าน — ปัจจุบัน ${level.th}`);
    goalArt.innerHTML = level.goalSvg;
    winTitle.textContent = level.winTh || `${level.th}บานแล้ว!`;
    winBadge.innerHTML = fullGoalSvg(level);
    nextLevel.hidden = activeLevelIndex >= LEVELS.length - 1;
    if (!nextLevel.hidden) {
      const next = LEVELS[activeLevelIndex + 1];
      nextLevel.textContent = `ด่านถัดไป: ${next.th}`;
    }
    const playAgain = $("#playAgain");
    playAgain.classList.toggle("btn--primary", nextLevel.hidden);
    playAgain.classList.toggle("btn--secondary", !nextLevel.hidden);
    document.title = `Pineapple Lego — ${level.th}`;
  }

  function updateLevelCards() {
    if (!levelGrid) return;
    levelGrid.innerHTML = LEVELS.map((level, index) => {
      const progress = getLevelProgress(level.id);
      const isActive = index === activeLevelIndex;
      const isDone = progress.bestMs !== null;
      const stars = progress.bestStars
        ? "★".repeat(Math.max(0, Math.min(3, progress.bestStars)))
        : "";
      const best = progress.bestMs !== null
        ? `${formatTime(progress.bestMs)} ${stars}`
        : "ยังไม่มีสถิติ";
      return `<button class="level-card${isActive ? " is-active" : ""}${isDone ? " is-done" : ""}" type="button" data-level="${index}" ${isActive ? 'aria-current="true"' : ""}>
        <span class="level-card__art" aria-hidden="true">${fullGoalSvg(level)}</span>
        <span class="level-card__body">
          <span class="level-card__top"><span class="level-card__num">LEVEL ${String(index + 1).padStart(2, "0")}</span><span class="level-card__diff">${level.difficulty}</span></span>
          <strong class="level-card__name">${level.th}</strong>
          <span class="level-card__en">${level.en}</span>
          <span class="level-card__best"><span>${isDone ? "★" : "☆"}</span> ${best}</span>
        </span>
        <span class="level-card__chevron" aria-hidden="true">↗</span>
      </button>`;
    }).join("");

    levelGrid.querySelectorAll(".level-card").forEach((card) => {
      card.addEventListener("click", () => {
        const index = Number(card.dataset.level);
        if (index === activeLevelIndex) {
          const opening = startupStep === "levels";
          closeModal("levels");
          if (!opening) showToast("กำลังเล่นด่านนี้อยู่");
          return;
        }
        activateLevel(index);
      });
    });
  }

  function activateLevel(index, { boot = false, silent = false } = {}) {
    if (index < 0 || index >= LEVELS.length) index = 0;
    if (!boot && index === activeLevelIndex) {
      closeModal("levels");
      return;
    }

    if (activeRuntime) hideRuntime(activeRuntime);
    activeLevelIndex = index;
    // The bouquet's vase stands on the bare wooden base; flowers grow in soil.
    if (soilGroup) soilGroup.visible = !LEVELS[index].bare;
    assignRuntime(levelRuntimes[index]);

    window.clearTimeout(state.winTimer);
    window.clearTimeout(state.nextTimer);
    tweens.length = 0;
    state.current = 0;
    state.selected = false;
    state.transitioning = false;
    state.won = false;
    state.lastInstruction = "";
    resetTimer();

    exitPhotoMode({ silent: true });
    closeModal("victory", false);
    closeModal("levels", false);
    app.classList.remove("is-victory", "is-photo", "is-done");
    hideDragHint();
    photoBtn.disabled = true;
    photoBtn.setAttribute("aria-pressed", "false");
    if (beeGroup) beeGroup.visible = false;
    hideDome();
    if (particleSystem) {
      particleLife = 0;
      particleSystem.visible = false;
      particleSystem.geometry.setDrawRange(0, 0);
    }
    confetti.innerHTML = "";
    winBest.textContent = "";
    winBest.classList.remove("is-new");
    winStars.querySelectorAll(".win-star").forEach((star) => {
      star.classList.remove("is-on");
      star.style.color = "";
      const path = star.querySelector("path");
      if (path) path.style.fill = "";
    });

    resetActivePieces();
    updateLevelUI();
    renderStepList();
    renderTray();
    updateBestLine();
    updateHUD({ pop: false });
    resetCamera();
    if (blueprintGroup && blueprintMaterial) {
      blueprintGroup.visible = true;
      blueprintMaterial.opacity = 0.24;
    }
    activateStep();

    save.currentLevel = LEVELS[index].id;
    persistSave();
    updateLevelCards();
    levelBtn.setAttribute("aria-expanded", "false");

    if (!boot && !silent) {
      showToast(`ด่าน ${index + 1}: ${LEVELS[index].th}`);
      window.setTimeout(() => {
        const target = window.innerWidth < 760 ? mobileLevelBtn : levelBtn;
        target?.focus({ preventScroll: true });
      }, 120);
    }
  }

  /* ---------------------------------------------------------
     Premium sunflower: many small parts, like a botanical brick set
     --------------------------------------------------------- */

  const SUN_HEAD_Y = 3.0;

  // Broad serrated leaf blade lying flat along +x.
  function serratedLeafGeometry(length = 1.25, width = 0.42) {
    const shape = new THREE.Shape();
    const n = 14;
    shape.moveTo(0, 0);
    for (let i = 1; i <= n; i += 1) {
      const t = i / n;
      const w = width * Math.sin(Math.PI * Math.pow(t, 0.75)) * (1 - t * 0.15);
      shape.lineTo(t * length, w + (i % 2 ? 0.028 : 0));
    }
    for (let i = n - 1; i >= 1; i -= 1) {
      const t = i / n;
      const w = width * Math.sin(Math.PI * Math.pow(t, 0.75)) * (1 - t * 0.15);
      shape.lineTo(t * length, -w - (i % 2 ? 0.028 : 0));
    }
    shape.lineTo(0, 0);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.07,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.018,
      bevelThickness: 0.018,
    });
    geometry.rotateX(-Math.PI / 2);
    return geometry;
  }

  // One leaf "element": clip ring on the stem, short arm, blade, ribs and studs.
  function premiumLeaf(y, angle, { length = 1.25, width = 0.42, tilt = 0.28, color = COLORS.leaf } = {}) {
    const group = new THREE.Group();
    const at = stemAt(y);
    group.position.set(at.x, y, at.z);
    group.rotation.y = angle;
    group.rotation.z = tilt;

    const clip = mesh(new THREE.TorusGeometry(0.12, 0.035, 8, 20), plastic(COLORS.greenDark), [0, 0, 0], [Math.PI / 2, 0, 0]);
    group.add(clip);
    group.add(mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.22, 10), plastic(COLORS.greenDark), [0.2, 0, 0], [0, 0, Math.PI / 2]));

    const blade = new THREE.Group();
    blade.position.set(0.28, 0, 0);
    blade.add(mesh(serratedLeafGeometry(length, width), plastic(color, { roughness: 0.38 }), [0, 0, 0.035]));

    // Mid-rib and three pairs of side veins.
    const rib = mesh(new THREE.BoxGeometry(length * 0.86, 0.025, 0.032), plastic(COLORS.greenDark), [length * 0.45, 0.06, 0]);
    rib.castShadow = false;
    blade.add(rib);
    [0.25, 0.47, 0.68].forEach((t) => {
      [-1, 1].forEach((s) => {
        const vein = mesh(new THREE.BoxGeometry(width * 0.62, 0.02, 0.022), plastic(COLORS.greenDark), [t * length + width * 0.2, 0.058, s * width * 0.24], [0, s * 0.75, 0]);
        vein.castShadow = false;
        blade.add(vein);
      });
    });
    // Two connector studs, like on real brick leaves.
    addStud(blade, length * 0.16, 0.09, 0, COLORS.greenLight, 0.07, 0.05);
    addStud(blade, length * 0.84, 0.09, 0, COLORS.greenLight, 0.06, 0.05);
    group.add(blade);
    return group;
  }

  function premiumTopLeaves() {
    const group = new THREE.Group();
    const a = premiumLeaf(0, Math.PI - 0.5, { length: 0.8, width: 0.28, tilt: 0.3, color: COLORS.greenLight });
    const b = premiumLeaf(0.22, 0.45, { length: 0.75, width: 0.26, tilt: 0.32, color: COLORS.leaf });
    group.add(a, b);
    const at = stemAt(1.95);
    group.position.set(at.x, 1.95, at.z);
    return group;
  }

  function headGroup(y = SUN_HEAD_Y) {
    const group = new THREE.Group();
    group.position.set(0, y, 0.05);
    group.rotation.x = -0.12; // face tilts up a little, toward the viewer
    return group;
  }

  // Pointed green bracts behind the flower head.
  function premiumCalyx(headY = SUN_HEAD_Y, { count = 14, scale = 1 } = {}) {
    const group = headGroup(headY);
    group.scale.setScalar(scale);
    group.userData.baseScale = scale;
    group.add(mesh(new THREE.CylinderGeometry(0.42, 0.3, 0.26, 28), plastic(COLORS.greenDark), [0, 0, -0.2], [Math.PI / 2, 0, 0]));
    const shape = new THREE.Shape();
    shape.moveTo(-0.11, 0);
    shape.quadraticCurveTo(-0.1, 0.42, 0, 0.72);
    shape.quadraticCurveTo(0.1, 0.42, 0.11, 0);
    shape.lineTo(-0.11, 0);
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.04, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 1 });
    for (let i = 0; i < count; i += 1) {
      const root = new THREE.Group();
      root.rotation.z = (i / count) * Math.PI * 2 + 0.11;
      root.add(mesh(geo, plastic(i % 2 ? COLORS.green : COLORS.greenDeep), [0, 0.28, -0.16], [-0.25, 0, 0]));
      group.add(root);
    }
    return group;
  }

  // Layered seed head: base dish, rim, and three rings of round 1x1 studs.
  function premiumCore() {
    const group = headGroup();
    group.add(mesh(new THREE.CylinderGeometry(0.6, 0.62, 0.18, 44), plastic(COLORS.brownDark), [0, 0, 0], [Math.PI / 2, 0, 0]));
    group.add(mesh(new THREE.CylinderGeometry(0.5, 0.56, 0.1, 40), plastic(0x8a4a1f), [0, 0, 0.12], [Math.PI / 2, 0, 0]));
    group.add(mesh(new THREE.TorusGeometry(0.6, 0.035, 10, 48), plastic(0x5a3218), [0, 0, 0.08]));

    const roundPlate = (x, y, z, r, color) => {
      group.add(mesh(new THREE.CylinderGeometry(r, r, 0.07, 14), plastic(color), [x, y, z], [Math.PI / 2, 0, 0]));
      group.add(mesh(new THREE.CylinderGeometry(r * 0.55, r * 0.55, 0.05, 12), plastic(color), [x, y, z + 0.055], [Math.PI / 2, 0, 0]));
    };
    const ring = (count, radius, r, z, colors, offset = 0) => {
      for (let i = 0; i < count; i += 1) {
        const a = offset + (i / count) * Math.PI * 2;
        roundPlate(Math.cos(a) * radius, Math.sin(a) * radius, z, r, colors[i % colors.length]);
      }
    };
    ring(20, 0.46, 0.062, 0.19, [0xb4612a, 0x9c5222]);
    ring(13, 0.31, 0.068, 0.22, [0x6b3f22, 0x5a3218], 0.2);
    ring(7, 0.16, 0.07, 0.25, [0x4b2a15, 0x3e2210]);
    roundPlate(0, 0, 0.27, 0.08, 0x2f1a0c);
    return group;
  }

  // Petal element: pointed blade with a centre crease and a tiny base connector.
  function premiumPetalGeometry(length, width, round = false) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    const tipX = round ? width * 0.85 : width * 0.32;
    shape.bezierCurveTo(-width * 0.9, length * 0.2, -width, length * 0.62, -tipX, length * 0.92);
    shape.quadraticCurveTo(0, length * (round ? 1.06 : 1.04), tipX, length * 0.92);
    shape.bezierCurveTo(width, length * 0.62, width * 0.9, length * 0.2, 0, 0);
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.06,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.018,
      bevelThickness: 0.018,
      curveSegments: 10,
    });
  }

  function premiumPetalRing(count, { length, width, radius, z, cup, colors, crease, roots, offset = 0, headY = SUN_HEAD_Y, round = false }) {
    const group = headGroup(headY);
    const geo = premiumPetalGeometry(length, width, round);
    const creaseGeo = new THREE.BoxGeometry(0.022, length * 0.7, 0.02);
    for (let i = 0; i < count; i += 1) {
      const root = new THREE.Group();
      root.rotation.z = offset + (i / count) * Math.PI * 2;
      const petal = new THREE.Group();
      petal.position.set(0, radius, z);
      petal.rotation.set(cup + (i % 2) * 0.05, (i % 2 ? 1 : -1) * 0.07, 0);
      petal.scale.setScalar(1 + ((i * 7) % 5) * 0.02);
      petal.add(mesh(geo, plastic(colors[i % colors.length], { roughness: 0.42, clearcoat: 0.3 })));
      const c = mesh(creaseGeo, plastic(crease), [0, length * 0.45, 0.085]);
      c.castShadow = false;
      petal.add(c);
      petal.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.05, 10), plastic(crease), [0, 0.06, 0.09], [Math.PI / 2, 0, 0]));
      root.add(petal);
      if (roots) petalRoots.push(root);
      group.add(root);
    }
    return group;
  }

  function buildSunflowerModel() {
    petalRoots = [];
    const stem = buildStem({ neckY: SUN_HEAD_Y - 0.3, rBottom: 0.12, rTop: 0.08, sway: 0.08, bricks: 6, color: 0x3f8a3e, light: 0x4a9846, dark: 0x2f6a32, neck: "flare" });
    const leafL = premiumLeaf(0.95, Math.PI + 0.52, { color: COLORS.leaf });
    const leafR = premiumLeaf(1.45, -0.52, { color: COLORS.greenLight });
    const leafTop = premiumTopLeaves();
    const calyx = premiumCalyx();
    const core = premiumCore();
    const inner = premiumPetalRing(14, {
      length: 0.62, width: 0.15, radius: 0.5, z: 0.06, cup: 0.42,
      colors: [0xff8a1f, 0xffa230], crease: 0xe56f12, offset: 0.12,
    });
    const outer = premiumPetalRing(18, {
      length: 1.0, width: 0.19, radius: 0.56, z: -0.02, cup: 0.2,
      colors: [COLORS.yellow, COLORS.yellowLight], crease: COLORS.yellowDeep, roots: true,
    });
    return {
      groups: [stem, leafL, leafR, leafTop, calyx, core, inner, outer],
      stemGroup: stem,
      leafLeftGroup: leafL,
      leafRightGroup: leafR,
      centerGroup: core,
      petalGroup: outer,
      petalRoots,
      headSwayGroups: [calyx, core, inner, outer],
      leafSway: [
        { group: leafL, baseZ: leafL.rotation.z, amp: 0.02, phase: 0.4 },
        { group: leafR, baseZ: leafR.rotation.z, amp: 0.024, phase: 2.1 },
        { group: leafTop, baseZ: 0, amp: 0.015, phase: 1.2 },
      ],
    };
  }

  function goalSunflowerPremiumSvg() {
    return goalShell(`
      <g class="goal-piece" data-step="0">
        <rect x="87.5" y="92" width="5" height="54" rx="2.5" fill="#4F9B50"/>
        <rect x="82.5" y="139" width="15" height="7" rx="2.5" fill="#3D7C42"/>
      </g>
      <g class="goal-piece" data-step="1"><ellipse cx="68" cy="128" rx="20" ry="9" fill="#6CC95D" transform="rotate(-24 68 128)"/></g>
      <g class="goal-piece" data-step="2"><ellipse cx="112" cy="118" rx="20" ry="9" fill="#65BD58" transform="rotate(24 112 118)"/></g>
      <g class="goal-piece" data-step="3">
        <ellipse cx="77" cy="105" rx="12" ry="5" fill="#65BD58" transform="rotate(-30 77 105)"/>
        <ellipse cx="103" cy="101" rx="11" ry="5" fill="#6CC95D" transform="rotate(30 103 101)"/>
      </g>
      <g class="goal-piece" data-step="7">${ringPetalsSvg(18, 90, 72, 34, 6.5, 15, ["#FFB300", "#FFD23F"])}</g>
      <g class="goal-piece" data-step="4">${ringPetalsSvg(14, 90, 72, 22, 4, 9, ["#2F6637", "#4A9449"], 6)}</g>
      <g class="goal-piece" data-step="6">${ringPetalsSvg(14, 90, 72, 24, 5, 10, ["#FF8A1F", "#FFA230"], 6)}</g>
      <g class="goal-piece" data-step="5">
        <circle cx="90" cy="72" r="19" fill="#4B2A15"/>
        <circle cx="90" cy="72" r="15" fill="#9C5222"/>
        <circle cx="90" cy="72" r="10" fill="#6B3F22"/>
        <circle cx="90" cy="72" r="5" fill="#3E2210"/>
      </g>
    `, "#FFF3CB");
  }

  // The most recent stem's centre line. Leaves and buds read it (stemAt) so
  // their clips sit exactly on the curved stem.
  let currentStemCurve = null;

  function stemAt(y) {
    if (!currentStemCurve) return new THREE.Vector3(0, y, 0);
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 18; i += 1) {
      const mid = (lo + hi) / 2;
      if (currentStemCurve.getPointAt(mid).y < y) lo = mid;
      else hi = mid;
    }
    return currentStemCurve.getPointAt((lo + hi) / 2);
  }

  // Tapered, gently curved stem built from snapped-together sections.
  // Each flower passes its own look: thickness, colour, curve and collars.
  function buildStem({
    bricks = 6,
    color = COLORS.green,
    light = COLORS.greenLight,
    dark = COLORS.greenDark,
    neckY = 2.72,
    rBottom = 0.09,
    rTop = 0.07,
    sway = 0.06,
    neck = "cup",
  } = {}) {
    const group = new THREE.Group();

    // Small 2x2 base plate in soil brown, so it blends into the soil bed.
    addBox(group, [0.7, 0.12, 0.7], [0, 0.07, 0], 0x4a2e1a);
    [[-0.2, -0.2], [-0.2, 0.2], [0.2, -0.2], [0.2, 0.2]].forEach(([x, z]) => {
      addStud(group, x, 0.16, z, 0x5a3820, 0.1, 0.08);
    });
    // Collar where the stem plugs into the plate.
    group.add(mesh(new THREE.CylinderGeometry(rBottom + 0.05, rBottom + 0.07, 0.1, 18), plastic(dark), [0, 0.18, 0]));

    // Gentle S-curve that starts and ends on the centre line.
    const bottom = 0.13;
    const top = neckY;
    const pts = [];
    for (let i = 0; i <= 8; i += 1) {
      const t = i / 8;
      pts.push(new THREE.Vector3(
        sway * Math.sin(Math.PI * t) * (1 - 0.35 * t),
        bottom + (top - bottom) * t,
        sway * 0.45 * Math.sin(2 * Math.PI * t)
      ));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    currentStemCurve = curve;

    // Sections: each is a tapered tube; alternate two close greens so the
    // stem reads as several bar pieces, with darker collars between them.
    const sections = Math.max(2, bricks - 2);
    for (let s = 0; s < sections; s += 1) {
      const t0 = s / sections;
      const t1 = (s + 1) / sections;
      const sub = new THREE.CatmullRomCurve3(
        Array.from({ length: 7 }, (_, k) => curve.getPointAt(t0 + ((t1 - t0) * k) / 6))
      );
      const segs = 12;
      const radial = 14;
      const tube = new THREE.TubeGeometry(sub, segs, 1, radial, false);
      const pos = tube.attributes.position;
      for (let i = 0; i < pos.count; i += 1) {
        const ring = Math.floor(i / (radial + 1));
        const t = t0 + ((t1 - t0) * ring) / segs;
        const c = sub.getPointAt(ring / segs);
        const r = rBottom + (rTop - rBottom) * t;
        pos.setXYZ(i, c.x + (pos.getX(i) - c.x) * r, c.y + (pos.getY(i) - c.y) * r, c.z + (pos.getZ(i) - c.z) * r);
      }
      tube.computeVertexNormals();
      group.add(mesh(tube, plastic(s % 2 ? light : color, { roughness: 0.4 })));
      if (s > 0) {
        const p = curve.getPointAt(t0);
        const r = rBottom + (rTop - rBottom) * t0;
        const collar = mesh(new THREE.CylinderGeometry(r + 0.022, r + 0.022, 0.05, 16), plastic(dark), [p.x, p.y, p.z]);
        group.add(collar);
      }
    }

    // Neck under the flower head, shaped per flower.
    if (neck === "flare") {
      group.add(mesh(new THREE.CylinderGeometry(0.2, rTop + 0.02, 0.24, 20), plastic(dark), [0, neckY + 0.02, 0]));
    } else if (neck === "smooth") {
      group.add(mesh(new THREE.CylinderGeometry(rTop + 0.03, rTop + 0.01, 0.16, 16), plastic(color), [0, neckY, 0]));
    } else {
      group.add(mesh(new THREE.CylinderGeometry(0.11, 0.14, 0.16, 14), plastic(dark), [0, neckY, 0]));
    }
    return group;
  }


  /* ---------------------------------------------------------
     Premium daisy: domed studded centre, two petal rings, side bud
     --------------------------------------------------------- */

  const DAISY_HEAD_Y = 3.0;

  // Side branch with a closed bud peeking white at the tip.
  function daisyBud() {
    const group = new THREE.Group();
    const at = stemAt(0.75);
    group.position.set(at.x, 0.75, at.z);
    group.rotation.y = -0.75; // right and toward the viewer
    group.add(mesh(new THREE.TorusGeometry(0.12, 0.035, 8, 20), plastic(COLORS.greenDark), [0, 0, 0], [Math.PI / 2, 0, 0]));

    const arm = new THREE.Group();
    arm.rotation.z = -1.1;
    arm.add(mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.9, 10), plastic(COLORS.green), [0, 0.45, 0]));
    const elbow = new THREE.Group();
    elbow.position.set(0, 0.9, 0);
    elbow.rotation.z = 1.0;
    elbow.add(mesh(new THREE.SphereGeometry(0.06, 10, 8), plastic(COLORS.greenDark)));
    elbow.add(mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.35, 10), plastic(COLORS.green), [0, 0.17, 0]));

    const bud = new THREE.Group();
    bud.position.set(0, 0.38, 0);
    bud.scale.setScalar(1.4);
    bud.add(mesh(new THREE.CylinderGeometry(0.13, 0.06, 0.12, 14), plastic(COLORS.greenDark), [0, 0, 0]));
    for (let i = 0; i < 5; i += 1) {
      const a = (i / 5) * Math.PI * 2;
      bud.add(mesh(new THREE.BoxGeometry(0.06, 0.16, 0.03), plastic(i % 2 ? COLORS.green : COLORS.greenDeep), [Math.cos(a) * 0.12, 0.1, Math.sin(a) * 0.12], [Math.sin(a) * 0.35, -a, -Math.cos(a) * 0.35]));
    }
    const tip = mesh(new THREE.SphereGeometry(0.13, 16, 12), plastic(COLORS.white), [0, 0.15, 0]);
    tip.scale.set(1, 1.35, 1);
    bud.add(tip);
    addStud(bud, 0, 0.33, 0, COLORS.yellowLight, 0.035, 0.03);
    elbow.add(bud);
    arm.add(elbow);
    group.add(arm);
    return group;
  }

  function daisyCore() {
    const group = headGroup(DAISY_HEAD_Y);
    group.add(mesh(new THREE.CylinderGeometry(0.42, 0.44, 0.14, 40), plastic(COLORS.yellowDeep), [0, 0, 0], [Math.PI / 2, 0, 0]));
    const dome = mesh(new THREE.SphereGeometry(0.38, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), plastic(COLORS.yellow, { roughness: 0.45 }), [0, 0, 0.07], [Math.PI / 2, 0, 0]);
    dome.scale.set(1, 0.42, 1);
    group.add(dome);
    const domeZ = (r) => 0.07 + 0.16 * Math.sqrt(Math.max(0, 1 - (r / 0.38) ** 2));
    const dot = (x, y, r, color) => {
      const z = domeZ(Math.hypot(x, y));
      group.add(mesh(new THREE.CylinderGeometry(r, r, 0.05, 10), plastic(color), [x, y, z + 0.015], [Math.PI / 2, 0, 0]));
    };
    const ring = (count, radius, r, colors, offset = 0) => {
      for (let i = 0; i < count; i += 1) {
        const a = offset + (i / count) * Math.PI * 2;
        dot(Math.cos(a) * radius, Math.sin(a) * radius, r, colors[i % colors.length]);
      }
    };
    ring(18, 0.33, 0.04, [0xffa31a, 0xf08c00]);
    ring(12, 0.23, 0.045, [0xffc21a, 0xffb000], 0.15);
    ring(6, 0.12, 0.048, [0xffd23f, 0xffc72c]);
    dot(0, 0, 0.05, 0xffe27a);
    return group;
  }

  function buildDaisyModel() {
    petalRoots = [];
    const stem = buildStem({ neckY: DAISY_HEAD_Y - 0.28, rBottom: 0.07, rTop: 0.052, sway: 0.11, bricks: 7, color: 0x5aa64e, light: 0x66b257, dark: 0x3f8a3e });
    const leafL = premiumLeaf(0.9, Math.PI + 0.52, { length: 1.0, width: 0.26, color: COLORS.greenLight });
    const leafR = premiumLeaf(1.4, 0.45, { length: 0.95, width: 0.25, color: COLORS.leaf });
    const bud = daisyBud();
    const calyx = premiumCalyx(DAISY_HEAD_Y, { count: 12, scale: 0.8 });
    const core = daisyCore();
    const inner = premiumPetalRing(16, {
      headY: DAISY_HEAD_Y, length: 0.55, width: 0.1, radius: 0.4, z: 0.07, cup: 0.38, round: true,
      colors: [0xfff6dc, COLORS.cream], crease: 0xe8dfc8, offset: 0.1,
    });
    const outer = premiumPetalRing(22, {
      headY: DAISY_HEAD_Y, length: 0.88, width: 0.12, radius: 0.44, z: -0.02, cup: 0.16, round: true,
      colors: [COLORS.white, 0xf7f2e6], crease: 0xe8dfc8, roots: true,
    });
    return {
      groups: [stem, leafL, leafR, bud, calyx, core, inner, outer],
      stemGroup: stem,
      leafLeftGroup: leafL,
      leafRightGroup: leafR,
      centerGroup: core,
      petalGroup: outer,
      petalRoots,
      headSwayGroups: [calyx, core, inner, outer],
      leafSway: [
        { group: leafL, baseZ: leafL.rotation.z, amp: 0.02, phase: 0.4 },
        { group: leafR, baseZ: leafR.rotation.z, amp: 0.024, phase: 2.1 },
        { group: bud, baseZ: 0, amp: 0.03, phase: 1.2 },
      ],
    };
  }





  /* ---------------------------------------------------------
     Premium tulip: arching sword leaves, cupped curved petals
     --------------------------------------------------------- */

  const TULIP_HEAD_Y = 3.1;

  // Narrow pointed blade along +x (flat), used for tulip leaves.
  function swordBladeGeometry(length, width) {
    const shape = new THREE.Shape();
    shape.moveTo(0, -width * 0.7);
    shape.quadraticCurveTo(length * 0.55, -width * 1.05, length, 0);
    shape.quadraticCurveTo(length * 0.55, width * 1.05, 0, width * 0.7);
    shape.lineTo(0, -width * 0.7);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.06, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.016, bevelThickness: 0.016, curveSegments: 12,
    });
    geometry.rotateX(-Math.PI / 2);
    return geometry;
  }

  // Two-piece arching leaf: a steep lower blade and a flared upper blade, joined by a hinge.
  function swordLeaf(y, angle, { len1 = 1.0, len2 = 0.9, width = 0.3, tilt1 = 0.95, tilt2 = -0.5, color = COLORS.leaf } = {}) {
    const group = new THREE.Group();
    const at = stemAt(y);
    group.position.set(at.x, y, at.z);
    group.rotation.y = angle;
    group.rotation.z = tilt1;

    group.add(mesh(new THREE.TorusGeometry(0.12, 0.035, 8, 20), plastic(COLORS.greenDark), [0, 0, 0], [Math.PI / 2, 0, 0]));
    const lower = mesh(swordBladeGeometry(len1 + 0.15, width), plastic(color, { roughness: 0.38 }), [0.1, 0, 0.03]);
    group.add(lower);
    const rib1 = mesh(new THREE.BoxGeometry(len1 * 0.9, 0.022, 0.03), plastic(COLORS.greenDark), [0.1 + len1 * 0.5, 0.055, 0]);
    rib1.castShadow = false;
    group.add(rib1);
    addStud(group, 0.35, 0.08, 0, COLORS.greenLight, 0.06, 0.045);

    const hinge = new THREE.Group();
    hinge.position.set(0.1 + len1, 0, 0);
    hinge.rotation.z = tilt2;
    hinge.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, width * 1.4, 12), plastic(COLORS.greenDark), [0, 0.02, 0], [Math.PI / 2, 0, 0]));
    hinge.add(mesh(swordBladeGeometry(len2, width * 0.9), plastic(color, { roughness: 0.38 }), [-0.04, 0, 0.03]));
    const rib2 = mesh(new THREE.BoxGeometry(len2 * 0.75, 0.02, 0.026), plastic(COLORS.greenDark), [len2 * 0.4, 0.05, 0]);
    rib2.castShadow = false;
    hinge.add(rib2);
    addStud(hinge, len2 * 0.3, 0.075, 0, COLORS.greenLight, 0.05, 0.04);
    group.add(hinge);
    return group;
  }

  // Petal blade bent into a cup: edges curl in, belly bulges out, tip tucks in.
  function cuppedPetalGeometry(length, halfWidth, cup = 0.9, bulge = 0.08, tipCurl = -0.12) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(-halfWidth * 0.9, length * 0.12, -halfWidth * 1.05, length * 0.55, -halfWidth * 0.7, length * 0.86);
    shape.quadraticCurveTo(0, length * 1.08, halfWidth * 0.7, length * 0.86);
    shape.bezierCurveTo(halfWidth * 1.05, length * 0.55, halfWidth * 0.9, length * 0.12, 0, 0);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.045, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.014, bevelThickness: 0.014, curveSegments: 14,
    });
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i += 1) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const t = Math.max(0, Math.min(1, y / length));
      const z = pos.getZ(i) - cup * x * x + bulge * Math.sin(Math.PI * t) + tipCurl * Math.pow(t, 4);
      pos.setZ(i, z);
    }
    geometry.computeVertexNormals();
    return geometry;
  }

  function tulipHead() {
    const group = new THREE.Group();
    group.position.set(0, TULIP_HEAD_Y, 0);
    group.scale.setScalar(1.3);
    group.userData.baseScale = 1.3;
    return group;
  }

  function tulipCalyx() {
    const group = tulipHead();
    group.add(mesh(new THREE.CylinderGeometry(0.24, 0.13, 0.22, 20), plastic(COLORS.greenDark), [0, -0.02, 0]));
    group.add(mesh(new THREE.TorusGeometry(0.23, 0.04, 10, 28), plastic(COLORS.green), [0, 0.09, 0], [Math.PI / 2, 0, 0]));
    for (let i = 0; i < 6; i += 1) {
      const a = (i / 6) * Math.PI * 2;
      group.add(mesh(new THREE.BoxGeometry(0.1, 0.05, 0.12), plastic(i % 2 ? COLORS.greenDeep : COLORS.green), [Math.cos(a) * 0.25, 0.05, Math.sin(a) * 0.25], [0, -a, 0]));
    }
    return group;
  }

  function tulipCore() {
    const group = tulipHead();
    // Yellow star base inside the cup.
    for (let i = 0; i < 6; i += 1) {
      const a = (i / 6) * Math.PI * 2;
      group.add(mesh(new THREE.BoxGeometry(0.2, 0.035, 0.08), plastic(COLORS.yellowLight), [Math.cos(a) * 0.1, 0.13, Math.sin(a) * 0.1], [0, -a, 0]));
    }
    group.add(mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.4, 12), plastic(0x9cc95a), [0, 0.32, 0]));
    group.add(mesh(new THREE.SphereGeometry(0.085, 14, 10), plastic(0xc9e07a), [0, 0.55, 0]));
    // Six stamens with dark anthers.
    for (let i = 0; i < 6; i += 1) {
      const a = (i / 6) * Math.PI * 2 + 0.3;
      const x = Math.cos(a) * 0.15;
      const z = Math.sin(a) * 0.15;
      group.add(mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.28, 6), plastic(COLORS.yellow), [x, 0.27, z]));
      group.add(mesh(new THREE.CapsuleGeometry(0.03, 0.07, 4, 8), plastic(0x3b2440), [x, 0.43, z]));
    }
    return group;
  }

  function tulipPetalRing({ count, length, halfWidth, radius, lean, offset, colors, tip, roots }) {
    const group = tulipHead();
    const geo = cuppedPetalGeometry(length, halfWidth);
    for (let i = 0; i < count; i += 1) {
      const root = new THREE.Group();
      root.rotation.y = offset + (i / count) * Math.PI * 2;
      const petal = new THREE.Group();
      petal.position.set(0, 0.08, radius);
      petal.rotation.x = lean;
      petal.add(mesh(geo, plastic(colors[i % colors.length], { roughness: 0.4, clearcoat: 0.35 })));
      // Lighter centre stripe and two base studs on the outside.
      const stripe = mesh(new THREE.BoxGeometry(0.05, length * 0.55, 0.02), plastic(tip), [0, length * 0.42, 0.075]);
      stripe.castShadow = false;
      petal.add(stripe);
      addStud(petal, -halfWidth * 0.35, 0.16, 0.06, colors[0], 0.045, 0.04, Math.PI / 2);
      addStud(petal, halfWidth * 0.35, 0.16, 0.06, colors[0], 0.045, 0.04, Math.PI / 2);
      root.add(petal);
      if (roots) petalRoots.push(root);
      group.add(root);
    }
    return group;
  }

  function buildTulipModel() {
    petalRoots = [];
    const stem = buildStem({ neckY: TULIP_HEAD_Y - 0.12, rBottom: 0.1, rTop: 0.082, sway: 0.04, bricks: 4, color: 0x7cbf5c, light: 0x86c765, dark: 0x5e9e47, neck: "smooth" });
    const leafL = swordLeaf(0.38, Math.PI - 0.45, { color: COLORS.leaf });
    const leafR = swordLeaf(0.62, 0.35, { color: COLORS.greenLight, len1: 1.15, tilt2: -0.45 });
    const leafFront = swordLeaf(0.26, -Math.PI / 2 - 0.2, { color: COLORS.green, len1: 0.6, len2: 0.55, width: 0.22, tilt1: 0.8, tilt2: -0.45 });
    const calyx = tulipCalyx();
    const core = tulipCore();
    const inner = tulipPetalRing({
      count: 3, length: 0.92, halfWidth: 0.24, radius: 0.1, lean: 0.06, offset: Math.PI / 3,
      colors: [COLORS.pinkDeep, 0xc93f84], tip: COLORS.pink,
    });
    const outer = tulipPetalRing({
      count: 3, length: 1.0, halfWidth: 0.28, radius: 0.17, lean: 0.17, offset: 0,
      colors: [COLORS.pink, COLORS.pinkLight], tip: 0xffc2dc, roots: true,
    });
    return {
      groups: [stem, leafL, leafR, leafFront, calyx, core, inner, outer],
      stemGroup: stem,
      leafLeftGroup: leafL,
      leafRightGroup: leafR,
      centerGroup: core,
      petalGroup: outer,
      petalRoots,
      headSwayGroups: [calyx, core, inner, outer],
      leafSway: [
        { group: leafL, baseZ: leafL.rotation.z, amp: 0.02, phase: 0.4 },
        { group: leafR, baseZ: leafR.rotation.z, amp: 0.024, phase: 2.1 },
        { group: leafFront, baseZ: leafFront.rotation.z, amp: 0.015, phase: 1.2 },
      ],
    };
  }



  /* ---------------------------------------------------------
     Premium rose: upright spiral bloom, three-leaflet leaves, thorns
     --------------------------------------------------------- */

  const ROSE_HEAD_Y = 2.95;
  const ROSE_SCALE = 1.25;

  // Compound leaf: clip, stalk, one end leaflet and two side leaflets.
  function roseLeaf(y, angle, { tilt = 0.3, color = COLORS.leaf, scale = 1 } = {}) {
    const group = new THREE.Group();
    const at = stemAt(y);
    group.position.set(at.x, y, at.z);
    group.rotation.x = 0.42; // tip the leaf face toward the viewer so the leaflets read clearly
    group.rotation.y = angle;
    group.rotation.z = tilt;
    group.scale.setScalar(scale);
    group.userData.baseScale = scale;

    group.add(mesh(new THREE.TorusGeometry(0.12, 0.035, 8, 20), plastic(COLORS.greenDark), [0, 0, 0], [Math.PI / 2, 0, 0]));
    group.add(mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.58, 10), plastic(COLORS.greenDark), [0.38, 0, 0], [0, 0, Math.PI / 2]));

    const leaflet = (x, turn, length, width) => {
      const holder = new THREE.Group();
      holder.position.set(x, 0, 0);
      holder.rotation.y = turn;
      holder.add(mesh(serratedLeafGeometry(length, width), plastic(color, { roughness: 0.38 }), [0.03, -0.02, 0.035]));
      const rib = mesh(new THREE.BoxGeometry(length * 0.8, 0.022, 0.028), plastic(COLORS.greenDark), [length * 0.45, 0.045, 0]);
      rib.castShadow = false;
      holder.add(rib);
      addStud(holder, length * 0.22, 0.07, 0, COLORS.greenLight, 0.05, 0.04);
      group.add(holder);
    };
    leaflet(0.62, 0, 0.62, 0.2);
    leaflet(0.36, 0.95, 0.46, 0.16);
    leaflet(0.36, -0.95, 0.46, 0.16);
    return group;
  }

  function roseHead() {
    const group = new THREE.Group();
    group.position.set(0, ROSE_HEAD_Y, 0);
    group.rotation.x = 0.3; // bloom opens toward the viewer so the spiral shows
    group.scale.setScalar(ROSE_SCALE);
    group.userData.baseScale = ROSE_SCALE;
    return group;
  }

  // Adds one ring of upright cupped petals to a head group.
  function addRosePetalRing(group, { count, length, halfWidth, radius, lean, offset = 0, colors, cup = 1.1, tipCurl = -0.08, roots = false, y = 0.08 }) {
    const geo = cuppedPetalGeometry(length, halfWidth, cup, 0.07, tipCurl);
    for (let i = 0; i < count; i += 1) {
      const root = new THREE.Group();
      root.rotation.y = offset + (i / count) * Math.PI * 2;
      const petal = new THREE.Group();
      petal.position.set(0, y, radius);
      petal.rotation.x = lean;
      petal.add(mesh(geo, plastic(colors[i % colors.length], { roughness: 0.42, clearcoat: 0.32 })));
      addStud(petal, 0, 0.12, 0.05, colors[0], 0.04, 0.035, Math.PI / 2);
      root.add(petal);
      if (roots) petalRoots.push(root);
      group.add(root);
    }
  }

  // Green hip under the bloom with five long drooping sepals.
  function roseCalyx() {
    const group = roseHead();
    group.add(mesh(new THREE.CylinderGeometry(0.2, 0.1, 0.2, 18), plastic(COLORS.greenDark), [0, -0.04, 0]));
    group.add(mesh(new THREE.TorusGeometry(0.2, 0.035, 8, 24), plastic(COLORS.green), [0, 0.06, 0], [Math.PI / 2, 0, 0]));
    const blade = swordBladeGeometry(0.5, 0.08);
    for (let i = 0; i < 5; i += 1) {
      const root = new THREE.Group();
      root.rotation.y = (i / 5) * Math.PI * 2 + 0.3;
      const sepal = mesh(blade, plastic(i % 2 ? COLORS.green : COLORS.greenDeep), [0.14, 0.02, 0], [0, 0, -0.4]);
      root.add(sepal);
      group.add(root);
    }
    return group;
  }

  // Tight spiral bud at the heart of the rose.
  function roseBud() {
    const group = roseHead();
    group.add(mesh(new THREE.CylinderGeometry(0.1, 0.16, 0.6, 14), plastic(0x8e1626), [0, 0.38, 0]));
    group.add(mesh(new THREE.TorusGeometry(0.07, 0.025, 8, 18, Math.PI * 1.6), plastic(0x6d1020), [0, 0.7, 0], [Math.PI / 2, 0, 0.4]));
    addRosePetalRing(group, { count: 3, length: 0.6, halfWidth: 0.2, radius: 0.05, lean: -0.04, colors: [0x9c1828, 0x86142a], cup: 2.4, tipCurl: -0.12, y: 0.24 });
    addRosePetalRing(group, { count: 5, length: 0.66, halfWidth: 0.26, radius: 0.12, lean: 0.08, offset: 0.5, colors: [0xb01c2c, 0xa01a2a], cup: 1.7, y: 0.17 });
    return group;
  }

  function roseInnerPetals() {
    const group = roseHead();
    addRosePetalRing(group, { count: 5, length: 0.74, halfWidth: 0.33, radius: 0.2, lean: 0.2, offset: 0.15, colors: [0xc8242f, 0xb82030], cup: 1.2, tipCurl: 0.04, y: 0.11 });
    return group;
  }

  function roseOuterPetals() {
    const group = roseHead();
    addRosePetalRing(group, { count: 6, length: 0.8, halfWidth: 0.38, radius: 0.27, lean: 0.3, offset: 0.6, colors: [0xd62f38, 0xdc3a42], cup: 0.95, tipCurl: 0.12, roots: true });
    addRosePetalRing(group, { count: 6, length: 0.76, halfWidth: 0.4, radius: 0.32, lean: 0.48, offset: 0.08, colors: [0xe2434a, 0xd9363f], cup: 0.8, tipCurl: 0.2, roots: true });
    return group;
  }

  function buildRoseModel() {
    petalRoots = [];
    const stem = buildStem({ neckY: ROSE_HEAD_Y - 0.14, rBottom: 0.085, rTop: 0.066, sway: 0.06, bricks: 7, color: 0x2f6e38, light: 0x377a40, dark: 0x24552b });
    [0.6, 1.0, 1.3, 1.7, 1.9, 2.4].forEach((y, index) => {
      const side = index % 2 === 0 ? 1 : -1;
      const p = stemAt(y);
      stem.add(mesh(
        new THREE.ConeGeometry(0.04, 0.15, 6),
        plastic(index % 3 ? 0x7a3b2c : 0x5d2e22),
        [p.x + side * 0.1, y, p.z + (index % 3 === 1 ? 0.04 : 0)],
        [0, 0, -side * Math.PI / 2 + side * 0.35]
      ));
    });
    const leafL = roseLeaf(1.0, Math.PI + 0.52, { color: COLORS.greenLight });
    const leafR = roseLeaf(1.55, -0.52, { color: COLORS.leaf });
    const leafYoung = roseLeaf(2.1, -Math.PI / 2 - 0.5, { color: 0x8fd070, scale: 0.6, tilt: 0.5 });
    const calyx = roseCalyx();
    const bud = roseBud();
    const inner = roseInnerPetals();
    const outer = roseOuterPetals();
    return {
      groups: [stem, leafL, leafR, leafYoung, calyx, bud, inner, outer],
      stemGroup: stem,
      leafLeftGroup: leafL,
      leafRightGroup: leafR,
      centerGroup: bud,
      petalGroup: outer,
      petalRoots,
      headSwayGroups: [calyx, bud, inner, outer],
      leafSway: [
        { group: leafL, baseZ: leafL.rotation.z, amp: 0.02, phase: 0.4 },
        { group: leafR, baseZ: leafR.rotation.z, amp: 0.024, phase: 2.1 },
        { group: leafYoung, baseZ: leafYoung.rotation.z, amp: 0.02, phase: 1.2 },
      ],
    };
  }

  function goalRosePremiumSvg() {
    const leaf3 = (cx, cy, rot, fill) => `
        <g transform="rotate(${rot} ${cx} ${cy})">
          <ellipse cx="${cx + 16}" cy="${cy}" rx="10" ry="5" fill="${fill}"/>
          <ellipse cx="${cx + 6}" cy="${cy - 7}" rx="7" ry="4" fill="${fill}" transform="rotate(-40 ${cx + 6} ${cy - 7})"/>
          <ellipse cx="${cx + 6}" cy="${cy + 7}" rx="7" ry="4" fill="${fill}" transform="rotate(40 ${cx + 6} ${cy + 7})"/>
        </g>`;
    return goalShell(`
      <g class="goal-piece" data-step="0">
        <rect x="87.5" y="84" width="5" height="62" rx="2.5" fill="#4F9B50"/>
        <rect x="82.5" y="139" width="15" height="7" rx="2.5" fill="#3D7C42"/>
        <path d="M92 126 l6 -2 l-6 -3Z M88 110 l-6 -2 l6 -3Z" fill="#387A3E"/>
      </g>
      <g class="goal-piece" data-step="1">${leaf3(88, 128, 200, "#65BD58")}</g>
      <g class="goal-piece" data-step="2">${leaf3(92, 114, -20, "#6CC95D")}</g>
      <g class="goal-piece" data-step="3">${leaf3(91, 98, -50, "#8FD070").replaceAll('rx="10"', 'rx="7"').replaceAll('rx="7" ry="4"', 'rx="5" ry="3"')}</g>
      <g class="goal-piece" data-step="4">
        <path d="M78 84 L90 78 L102 84 L96 90 L84 90Z" fill="#387A3E"/>
        <path d="M80 84 L68 92 M100 84 L112 92" stroke="#2F6637" stroke-width="3" stroke-linecap="round"/>
      </g>
      <g class="goal-piece" data-step="7">
        <path d="M90 84 C64 84 52 66 58 48 C70 54 78 66 90 84Z" fill="#F07A7A"/>
        <path d="M90 84 C116 84 128 66 122 48 C110 54 102 66 90 84Z" fill="#E45454"/>
        <path d="M62 78 C70 86 110 86 118 78 C108 84 72 84 62 78Z" fill="#F07A7A"/>
      </g>
      <g class="goal-piece" data-step="6">
        <path d="M90 84 C70 80 64 58 70 42 C80 50 86 66 90 84Z" fill="#E45454"/>
        <path d="M90 84 C110 80 116 58 110 42 C100 50 94 66 90 84Z" fill="#B83245"/>
      </g>
      <g class="goal-piece" data-step="5">
        <path d="M90 84 C78 76 76 52 82 38 C90 34 98 34 98 38 C104 52 102 76 90 84Z" fill="#8E233A"/>
        <path d="M84 46 C88 40 94 40 96 46" stroke="#6D1A2D" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </g>
    `, "#FFE5E2");
  }

  /* ---------------------------------------------------------
     Bouquet level: fluted vase with a bow, greenery, four flowers,
     lavender and baby's breath
     --------------------------------------------------------- */

  // Fluted ceramic vase, floral foam on top, and a satin bow round the neck.
  function bouquetVase() {
    const group = new THREE.Group();
    group.position.y = -0.09; // stands directly on the wooden base (no soil in this level)
    const profile = [
      [0.0, 0.0], [0.4, 0.0], [0.48, 0.08], [0.57, 0.4], [0.55, 0.75],
      [0.42, 1.0], [0.35, 1.1], [0.39, 1.2], [0.43, 1.25],
    ].map(([r, y]) => new THREE.Vector2(r, y));
    const geo = new THREE.LatheGeometry(profile, 72);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i += 1) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = pos.getY(i);
      const r = Math.hypot(x, z);
      if (r < 0.01) continue;
      const a = Math.atan2(z, x);
      const band = y > 0.06 && y < 1.08 ? 1 : 0; // flutes only on the body
      const k = 1 + band * 0.035 * Math.cos(a * 18);
      pos.setX(i, x * k);
      pos.setZ(i, z * k);
    }
    geo.computeVertexNormals();
    const vase = mesh(geo, plastic(0xf3ead8, { roughness: 0.28, clearcoat: 0.8, clearcoatRoughness: 0.15 }), [0, 0.09, 0]);
    group.add(vase);
    group.add(mesh(new THREE.TorusGeometry(0.43, 0.035, 10, 48), plastic(0xe6d9bf), [0, 1.34, 0], [Math.PI / 2, 0, 0]));
    group.add(mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.04, 32), plastic(0x3f5e33, { roughness: 0.9, clearcoat: 0 }), [0, 1.3, 0]));
    group.add(mesh(new THREE.CylinderGeometry(0.42, 0.44, 0.06, 40), plastic(0xd8c8a8), [0, 0.12, 0]));

    // Bow: band round the neck, two loops and two tails at the front.
    const ribbon = 0xf48fb1;
    group.add(mesh(new THREE.TorusGeometry(0.37, 0.04, 8, 40), plastic(ribbon), [0, 1.06, 0], [Math.PI / 2, 0, 0]));
    const knot = new THREE.Group();
    knot.position.set(0, 1.06, 0.4);
    knot.add(mesh(new THREE.SphereGeometry(0.06, 12, 10), plastic(0xe0709a)));
    [-1, 1].forEach((side) => {
      const loop = mesh(new THREE.TorusGeometry(0.11, 0.035, 8, 24), plastic(ribbon), [side * 0.13, 0.03, 0], [0, 0, side * 0.35]);
      loop.scale.set(1, 0.65, 1);
      knot.add(loop);
      knot.add(mesh(new THREE.BoxGeometry(0.06, 0.32, 0.02), plastic(ribbon), [side * 0.07, -0.17, 0.01], [0, 0, side * 0.25]));
    });
    group.add(knot);
    return group;
  }

  // One finished flower leaning out of the vase. Only stem + head parts are used;
  // its own leaves would poke through the vase wall.
  function bouquetFlower(key, buildFn) {
    const b = BOUQUET[key];
    const model = buildFn();
    const outer = new THREE.Group();
    outer.position.set(b.dx, VASE_NECK_Y, b.dz);
    const tilt = new THREE.Group();
    tilt.rotation.set(b.x, 0, b.z);
    tilt.scale.setScalar(b.s);
    const content = new THREE.Group();
    content.position.y = -BOUQUET_SINK;
    [0, 4, 5, 6, 7].forEach((i) => { if (model.groups[i]) content.add(model.groups[i]); });
    tilt.add(content);
    outer.add(tilt);
    return outer;
  }

  function leanGroup(x, z, yaw = 0) {
    const g = new THREE.Group();
    g.rotation.set(x, yaw, z);
    return g;
  }

  // Eucalyptus-style sprigs with paired round leaves, plus broad leaves over the rim.
  function bouquetGreenery() {
    const group = new THREE.Group();
    group.position.set(0, VASE_NECK_Y, 0);
    const sprigs = [
      [-0.15, 0.75, 1.5], [0.2, -0.8, 1.45], [-0.45, 0.2, 1.6],
      [0.5, -0.15, 1.4], [0.35, 0.55, 1.3], [-0.3, -0.5, 1.35],
    ];
    const leafGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.025, 14);
    sprigs.forEach(([x, z, len], si) => {
      const sprig = leanGroup(x, z);
      sprig.add(mesh(new THREE.CylinderGeometry(0.022, 0.028, len, 8), plastic(0x5d7f55), [0, len / 2 - 0.15, 0]));
      for (let y = 0.25; y < len - 0.15; y += 0.17) {
        const r = 0.7 + 0.3 * (1 - y / len);
        [-1, 1].forEach((side) => {
          const leaf = mesh(leafGeo, plastic(si % 2 ? 0x8fb3a0 : 0x7aa38c, { roughness: 0.5 }), [side * 0.09 * r, y, 0], [Math.PI / 2 - 0.3, 0, side * 0.5]);
          leaf.scale.setScalar(r);
          sprig.add(leaf);
        });
      }
      group.add(sprig);
    });
    [[Math.PI - 0.5, 0.4], [0.5, 0.35], [Math.PI / 2, 0.3]].forEach(([yaw, droop], i) => { // sides and back, so the bow stays visible
      const holder = leanGroup(0, 0, yaw);
      const leaf = mesh(serratedLeafGeometry(0.85, 0.28), plastic(i % 2 ? COLORS.leaf : COLORS.green, { roughness: 0.38 }), [0.2, 0.02, 0], [0, 0, -droop]);
      holder.add(leaf);
      group.add(holder);
    });
    return group;
  }

  // Lavender: slim stems topped with stacked purple bead clusters.
  function bouquetLavender() {
    const group = new THREE.Group();
    group.position.set(0, VASE_NECK_Y, 0);
    const spikes = [[-0.42, 0.15, 2.2], [-0.35, -0.12, 2.35], [-0.5, -0.3, 2.1], [-0.25, 0.35, 2.0], [-0.48, 0.5, 1.95]];
    const bead = new THREE.SphereGeometry(0.045, 10, 8);
    spikes.forEach(([x, z, len], si) => {
      const spike = leanGroup(x, z);
      spike.add(mesh(new THREE.CylinderGeometry(0.018, 0.022, len, 8), plastic(0x6f8f5e), [0, len / 2 - 0.2, 0]));
      const top = len - 0.2;
      for (let k = 0; k < 9; k += 1) {
        const y = top - 0.55 + k * 0.07;
        const ringR = 0.06 * (1 - k / 12);
        for (let j = 0; j < 4; j += 1) {
          const a = (j / 4) * Math.PI * 2 + k * 0.6;
          spike.add(mesh(bead, plastic((k + j + si) % 3 ? 0x9a7bd0 : 0x7d5bb8, { roughness: 0.45 }), [Math.cos(a) * ringR, y, Math.sin(a) * ringR]));
        }
      }
      group.add(spike);
    });
    return group;
  }

  // Baby's breath: thin branching sprigs ending in tiny white flower clusters.
  // Each sprig is a petal root so they pop in one by one on the last step.
  function bouquetBabysBreath() {
    const group = new THREE.Group();
    group.position.set(0, VASE_NECK_Y, 0);
    const sprigs = [[0.5, 0.55, 1.6], [0.45, -0.6, 1.55], [0.15, 0.95, 1.4], [0.2, -0.95, 1.35], [-0.3, 0.75, 1.7], [-0.3, -0.7, 1.75], [0.6, 0.05, 1.5]];
    const floret = new THREE.SphereGeometry(0.035, 8, 6);
    sprigs.forEach(([x, z, len], si) => {
      const root = leanGroup(x, z);
      root.add(mesh(new THREE.CylinderGeometry(0.014, 0.018, len, 6), plastic(0x7e9a6c), [0, len / 2 - 0.2, 0]));
      const top = len - 0.2;
      for (let b = 0; b < 5; b += 1) {
        const a = (b / 5) * Math.PI * 2 + si;
        const bx = Math.cos(a) * 0.16;
        const bz = Math.sin(a) * 0.16;
        const by = top - 0.1 + (b % 2) * 0.08;
        for (let f = 0; f < 6; f += 1) {
          const fa = (f / 6) * Math.PI * 2;
          root.add(mesh(floret, plastic(f % 3 ? COLORS.white : 0xf4eee0, { roughness: 0.5 }), [bx + Math.cos(fa) * 0.05, by + (f % 2) * 0.03, bz + Math.sin(fa) * 0.05]));
        }
      }
      petalRoots.push(root);
      group.add(root);
    });
    return group;
  }

  function buildBouquetModel() {
    const vase = bouquetVase();
    const greenery = bouquetGreenery();
    // Each flower builder resets petalRoots, so build them before the baby's breath.
    const rose = bouquetFlower("rose", buildRoseModel);
    const sunflower = bouquetFlower("sunflower", buildSunflowerModel);
    const tulip = bouquetFlower("tulip", buildTulipModel);
    const daisy = bouquetFlower("daisy", buildDaisyModel);
    const lavender = bouquetLavender();
    petalRoots = [];
    const babys = bouquetBabysBreath();
    return {
      groups: [vase, greenery, rose, sunflower, tulip, daisy, lavender, babys],
      stemGroup: vase,
      leafLeftGroup: null,
      leafRightGroup: null,
      centerGroup: lavender,
      petalGroup: babys,
      petalRoots,
      headSwayGroups: [],
      leafSway: [],
    };
  }

  function goalBouquetSvg() {
    return goalShell(`
      <g class="goal-piece" data-step="1">
        <ellipse cx="66" cy="84" rx="16" ry="6" fill="#7AA38C" transform="rotate(-35 66 84)"/>
        <ellipse cx="114" cy="84" rx="16" ry="6" fill="#8FB3A0" transform="rotate(35 114 84)"/>
      </g>
      <g class="goal-piece" data-step="6">
        <rect x="64" y="38" width="5" height="26" rx="2.5" fill="#9A7BD0" transform="rotate(-18 66 50)"/>
        <rect x="72" y="32" width="5" height="26" rx="2.5" fill="#7D5BB8" transform="rotate(-8 74 45)"/>
      </g>
      <g class="goal-piece" data-step="4"><path d="M112 34 C102 40 101 54 106 62 L118 62 C123 54 122 40 112 34Z" fill="#F268A5"/></g>
      <g class="goal-piece" data-step="3">${ringPetalsSvg(14, 70, 62, 12, 3.5, 7, ["#FFB300", "#FFD23F"])}<circle cx="70" cy="62" r="7" fill="#6B3F22"/></g>
      <g class="goal-piece" data-step="5">${ringPetalsSvg(14, 112, 74, 10, 3, 6, ["#FFFDF4", "#F2EBDD"])}<circle cx="112" cy="74" r="5" fill="#FFC21A"/></g>
      <g class="goal-piece" data-step="2"><circle cx="88" cy="74" r="13" fill="#D62F38"/><path d="M82 72 C86 66 92 66 94 72 C90 70 86 70 82 72Z" fill="#8E1626"/></g>
      <g class="goal-piece" data-step="7">
        <circle cx="62" cy="78" r="3" fill="#FFF"/><circle cx="58" cy="72" r="2.5" fill="#FFF"/>
        <circle cx="120" cy="58" r="3" fill="#FFF"/><circle cx="125" cy="64" r="2.5" fill="#FFF"/>
        <circle cx="96" cy="54" r="2.5" fill="#FFF"/><circle cx="100" cy="88" r="2.5" fill="#FFF"/>
      </g>
      <g class="goal-piece" data-step="0">
        <path d="M76 92 L104 92 L102 100 C112 108 112 132 104 144 L76 144 C68 132 68 108 78 100Z" fill="#F3EAD8" stroke="#D8C8A8" stroke-width="1.5"/>
        <rect x="76" y="98" width="28" height="4" rx="2" fill="#F48FB1"/>
        <circle cx="90" cy="100" r="3" fill="#E0709A"/>
      </g>
    `, "#F3E6FA");
  }

  function createGhosts() {
    pieceGroups.forEach((group, index) => {
      const ghost = group.clone(true);
      const ghostColor = new THREE.Color(STEPS[index]?.color || 0x9fe8df);
      ghostColor.lerp(new THREE.Color(0x8fe4db), 0.34);
      const material = new THREE.MeshBasicMaterial({
        color: ghostColor,
        transparent: true,
        opacity: 0.24,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      ghost.traverse((child) => {
        if (child.isMesh) {
          child.material = material;
          child.castShadow = false;
          child.receiveShadow = false;
        }
      });
      ghost.visible = false;
      ghostGroups.push(ghost);
      scene.add(ghost);
    });
  }

  function createBlueprint() {
    blueprintMaterial = new THREE.MeshBasicMaterial({
      color: 0xbde9e4,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    blueprintGroup = new THREE.Group();
    pieceGroups.forEach((group) => {
      const ghost = group.clone(true);
      ghost.traverse((child) => {
        if (child.isMesh) {
          child.material = blueprintMaterial;
          child.castShadow = false;
          child.receiveShadow = false;
        }
      });
      ghost.visible = true;
      blueprintGroup.add(ghost);
    });
    blueprintGroup.visible = true;
    scene.add(blueprintGroup);
  }

  function fadeBlueprint() {
    if (!blueprintGroup || !blueprintGroup.visible) return;
    if (reducedMotion) {
      blueprintGroup.visible = false;
      return;
    }
    const start = blueprintMaterial.opacity;
    tween(0.42, 0, (p) => {
      blueprintMaterial.opacity = start * (1 - p);
    }, () => {
      blueprintGroup.visible = false;
    });
  }

  function createTargets() {
    STEPS.forEach((step, index) => {
      const marker = new THREE.Group();
      marker.position.set(step.target[0], step.target[1], step.target[2]);
      marker.visible = false;

      const glow = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTexture,
        color: 0xffd45a,
        transparent: true,
        opacity: 0.34,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }));
      glow.scale.setScalar(step.markerScale * 2.4);
      marker.add(glow);

      const ring = new THREE.Sprite(new THREE.SpriteMaterial({
        map: markerTexture,
        color: 0xffb300,
        transparent: true,
        opacity: 0.98,
        depthWrite: false,
        depthTest: false,
      }));
      ring.scale.setScalar(step.markerScale);
      marker.add(ring);

      const label = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeNumberTexture(index + 1),
        transparent: true,
        depthWrite: false,
        depthTest: false,
      }));
      label.scale.setScalar(Math.max(0.44, step.markerScale * 0.24));
      label.position.set(0, 0, 0.04);
      marker.add(label);

      marker.userData.glow = glow;
      marker.userData.ring = ring;
      marker.userData.label = label;
      marker.userData.labelBaseY = label.position.y;
      marker.userData.baseScale = step.markerScale;
      marker.userData.phase = index * 1.3;
      marker.userData.index = index;
      scene.add(marker);
      markers.push(marker);

      const hit = new THREE.Mesh(
        new THREE.SphereGeometry(step.hitRadius, 16, 16),
        new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 0,
          depthWrite: false,
          colorWrite: false,
        })
      );
      hit.position.copy(marker.position);
      hit.userData.stepIndex = index;
      scene.add(hit);
      hitMeshes.push(hit);
    });
  }

  function createParticles() {
    const count = 64;
    const positions = new Float32Array(count * 3);
    const velocities = [];

    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.7 + Math.random() * 1.5;
      velocities.push(new THREE.Vector3(
        Math.cos(angle) * speed * 0.6,
        0.6 + Math.random() * 1.4,
        Math.sin(angle) * speed * 0.6
      ));
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      size: 0.14,
      map: particleTexture,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: 0xffd45a,
    });
    particleSystem = new THREE.Points(geometry, material);
    particleSystem.frustumCulled = false;
    particleSystem.visible = false;
    scene.add(particleSystem);
    particleData = { positions, velocities, count };
    particleOrigin = new THREE.Vector3();
  }

  function createAmbientPollen() {
    const count = 26;
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 5.2;
      positions[i * 3 + 1] = 0.45 + Math.random() * 4.1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2.8 + 0.3;
      speeds[i] = 0.035 + Math.random() * 0.07;
      phases[i] = Math.random() * Math.PI * 2;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      size: 0.065,
      map: particleTexture,
      color: 0xfff0b0,
      transparent: true,
      opacity: 0.58,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    ambientPollen = new THREE.Points(geometry, material);
    ambientPollen.frustumCulled = false;
    scene.add(ambientPollen);
    ambientPollenData = { positions, speeds, phases, count };
  }

  function updateAmbientPollen(dt, time) {
    if (!ambientPollenData || reducedMotion) return;
    const { positions, speeds, phases, count } = ambientPollenData;
    for (let i = 0; i < count; i += 1) {
      if (isXmas) {
        // Christmas theme: the same particles fall as snow.
        positions[i * 3 + 1] -= (speeds[i] * 1.6 + 0.12) * dt;
        positions[i * 3] += Math.sin(time * 0.8 + phases[i]) * 0.12 * dt;
        if (positions[i * 3 + 1] < 0.1) {
          positions[i * 3 + 1] = 4.7;
          positions[i * 3] = (Math.random() - 0.5) * 5.2;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 2.8 + 0.3;
        }
        continue;
      }
      positions[i * 3 + 1] += speeds[i] * dt;
      positions[i * 3] += Math.sin(time * 0.42 + phases[i]) * 0.06 * dt;
      if (positions[i * 3 + 1] > 4.7) {
        positions[i * 3 + 1] = 0.35;
        positions[i * 3] = (Math.random() - 0.5) * 5.2;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2.8 + 0.3;
      }
    }
    ambientPollen.geometry.attributes.position.needsUpdate = true;
  }

  /* ---------------------------------------------------------
     Christmas snowman: brick-stepped snowballs, twig arms,
     carrot nose, green scarf and a Santa hat
     --------------------------------------------------------- */

  const SNOW_WHITE = 0xffffff;
  const SNOW_SHADE = 0xe6eef5;
  const SNOW_BODY_Y = 1.05;
  const SNOW_BODY_R = 0.95;
  const SNOW_HEAD_Y = 2.55;
  const SNOW_HEAD_R = 0.66;

  // A ball built from stacked round plates, so it reads as bricks.
  function steppedBall(group, cy, r, colors, layerH = 0.13) {
    const count = Math.round((r * 2) / layerH);
    for (let i = 0; i < count; i += 1) {
      const y = cy - r + layerH * (i + 0.5);
      const dy = y - cy;
      const rr = Math.sqrt(Math.max(0, r * r - dy * dy));
      if (rr < 0.12) continue;
      group.add(mesh(new THREE.CylinderGeometry(rr, rr, layerH * 0.96, 28), plastic(colors[i % colors.length], { roughness: 0.42 }), [0, y, 0]));
    }
    // Studs on the top layer.
    const topY = cy + r - layerH * 0.5;
    const topR = Math.sqrt(Math.max(0, r * r - Math.pow(r - layerH, 2)));
    addStud(group, 0, topY + layerH * 0.5 + 0.03, 0, colors[0], Math.min(0.14, topR * 0.6), 0.07);
  }

  // Point on the front of a ball at height y and sideways offset x.
  function ballFront(cy, r, x, y, lift = 0.02) {
    const dy = y - cy;
    return Math.sqrt(Math.max(0, r * r - dy * dy - x * x)) + lift;
  }

  function snowmanBase() {
    const group = new THREE.Group();
    group.add(mesh(new THREE.CylinderGeometry(1.45, 1.52, 0.1, 48), plastic(SNOW_SHADE, { roughness: 0.6 }), [0, 0.05, 0]));
    // Snow lumps around the edge.
    for (let i = 0; i < 14; i += 1) {
      const a = (i / 14) * Math.PI * 2 + 0.2;
      const rad = 1.05 + (i % 3) * 0.12;
      const lump = mesh(new THREE.SphereGeometry(0.16 + (i % 2) * 0.05, 14, 10), plastic(i % 2 ? SNOW_WHITE : SNOW_SHADE, { roughness: 0.5 }), [Math.cos(a) * rad, 0.12, Math.sin(a) * rad]);
      lump.scale.y = 0.55;
      group.add(lump);
    }
    // Two little gift bricks.
    [[0.95, 0.55, 0xd62f38, 0xffd34d], [-1.0, 0.45, 0x2e8b57, 0xd62f38]].forEach(([x, z, box, ribbon]) => {
      const gift = new THREE.Group();
      gift.position.set(x, 0.24, z);
      gift.rotation.y = x > 0 ? -0.4 : 0.35;
      gift.add(mesh(new THREE.BoxGeometry(0.3, 0.28, 0.3), plastic(box)));
      gift.add(mesh(new THREE.BoxGeometry(0.31, 0.29, 0.07), plastic(ribbon)));
      gift.add(mesh(new THREE.BoxGeometry(0.07, 0.29, 0.31), plastic(ribbon)));
      addStud(gift, 0, 0.17, 0, ribbon, 0.07, 0.06);
      group.add(gift);
    });
    return group;
  }

  function snowmanBody() {
    const group = new THREE.Group();
    steppedBall(group, SNOW_BODY_Y, SNOW_BODY_R, [SNOW_WHITE, SNOW_SHADE]);
    // Coal buttons down the front.
    [0.78, 1.08, 1.38].forEach((y) => {
      addStud(group, 0, y, ballFront(SNOW_BODY_Y, SNOW_BODY_R, 0, y), 0x2b2b30, 0.075, 0.07, Math.PI / 2);
    });
    return group;
  }

  function snowmanHead() {
    const group = new THREE.Group();
    steppedBall(group, SNOW_HEAD_Y, SNOW_HEAD_R, [SNOW_WHITE, SNOW_SHADE], 0.12);
    return group;
  }

  function snowmanArm(side) {
    // side: -1 = left, 1 = right. The group pivots at the shoulder.
    const group = new THREE.Group();
    group.position.set(side * 0.74, 1.7, 0);
    group.rotation.z = side * 0.45;
    const wood = plastic(0x6b3f22, { roughness: 0.6 });
    const twig = plastic(0x55301a, { roughness: 0.6 });
    group.add(mesh(new THREE.CylinderGeometry(0.05, 0.065, 0.95, 10), wood, [side * 0.47, 0, 0], [0, 0, Math.PI / 2]));
    group.add(mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.32, 8), twig, [side * 0.92, 0.12, 0], [0, 0, side * -0.6]));
    group.add(mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.28, 8), twig, [side * 0.62, 0.11, 0], [0, 0, side * -0.4]));
    group.add(mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.24, 8), twig, [side * 0.98, -0.06, 0], [0, 0, side * -1.9]));
    addStud(group, side * 0.05, 0, 0, 0x6b3f22, 0.09, 0.08, 0);
    return group;
  }

  function snowmanFace() {
    const group = new THREE.Group();
    const coal = 0x232328;
    [-0.22, 0.22].forEach((x) => {
      addStud(group, x, 2.7, ballFront(SNOW_HEAD_Y, SNOW_HEAD_R, x, 2.7), coal, 0.075, 0.08, Math.PI / 2);
    });
    // Carrot nose.
    const noseZ = ballFront(SNOW_HEAD_Y, SNOW_HEAD_R, 0, 2.56, 0);
    group.add(mesh(new THREE.ConeGeometry(0.08, 0.42, 14), plastic(0xff8a1f), [0, 2.56, noseZ + 0.2], [Math.PI / 2, 0, 0]));
    group.add(mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.04, 14), plastic(0xe06d0c), [0, 2.56, noseZ + 0.01], [Math.PI / 2, 0, 0]));
    // Smile of small studs.
    [-0.2, -0.1, 0, 0.1, 0.2].forEach((x) => {
      const y = 2.36 + Math.abs(x) * 0.35;
      addStud(group, x, y, ballFront(SNOW_HEAD_Y, SNOW_HEAD_R, x, y), coal, 0.04, 0.05, Math.PI / 2);
    });
    return group;
  }

  function snowmanScarf() {
    const group = new THREE.Group();
    const green = plastic(0x2e8b57);
    const red = plastic(0xd62f38);
    group.add(mesh(new THREE.CylinderGeometry(0.6, 0.66, 0.24, 32), green, [0, 1.98, 0]));
    group.add(mesh(new THREE.TorusGeometry(0.63, 0.035, 8, 40), red, [0, 2.05, 0], [Math.PI / 2, 0, 0]));
    group.add(mesh(new THREE.TorusGeometry(0.65, 0.035, 8, 40), red, [0, 1.91, 0], [Math.PI / 2, 0, 0]));
    // Hanging tail at the front right.
    const tail = new THREE.Group();
    tail.position.set(0.32, 1.88, 0.58);
    tail.rotation.set(0.25, 0, 0.12);
    tail.add(mesh(new THREE.BoxGeometry(0.24, 0.62, 0.08), green, [0, -0.3, 0]));
    tail.add(mesh(new THREE.BoxGeometry(0.25, 0.05, 0.09), red, [0, -0.2, 0]));
    tail.add(mesh(new THREE.BoxGeometry(0.25, 0.05, 0.09), red, [0, -0.42, 0]));
    addStud(tail, 0, -0.05, 0.05, 0x2e8b57, 0.05, 0.04, Math.PI / 2);
    group.add(tail);
    for (let i = 0; i < 8; i += 1) {
      const a = (i / 8) * Math.PI * 2;
      addStud(group, Math.cos(a) * 0.5, 2.12, Math.sin(a) * 0.5, 0x2e8b57, 0.06, 0.05);
    }
    return group;
  }

  function snowmanHat(position = [0, 3.02, 0], scale = 1) {
    // Outer group sways; the inner group holds the hat's own tilt.
    const group = new THREE.Group();
    group.position.set(position[0], position[1], position[2]);
    group.scale.setScalar(scale);
    group.userData.baseScale = scale;
    const hat = new THREE.Group();
    hat.rotation.set(-0.12, 0, -0.18);
    group.add(hat);
    const red = plastic(0xd62f38);
    hat.add(mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.18, 32), plastic(SNOW_WHITE, { roughness: 0.7 }), [0, 0.05, 0]));
    // Stepped red cone that bends to one side.
    const layers = 7;
    for (let i = 0; i < layers; i += 1) {
      const t = i / layers;
      const r = 0.46 * (1 - t) + 0.08;
      hat.add(mesh(new THREE.CylinderGeometry(r * 0.92, r, 0.13, 24), red, [Math.pow(t, 2) * 0.35, 0.2 + i * 0.12, 0]));
    }
    hat.add(mesh(new THREE.SphereGeometry(0.13, 16, 12), plastic(SNOW_WHITE, { roughness: 0.7 }), [0.4, 1.05, 0]));
    return group;
  }

  function buildSnowmanModel() {
    petalRoots = [];
    const base = snowmanBase();
    const body = snowmanBody();
    const head = snowmanHead();
    const armL = snowmanArm(-1);
    const armR = snowmanArm(1);
    const face = snowmanFace();
    const scarf = snowmanScarf();
    const hat = snowmanHat();
    return {
      groups: [base, body, head, armL, armR, face, scarf, hat],
      stemGroup: body,
      leafLeftGroup: armL,
      leafRightGroup: armR,
      centerGroup: head,
      petalGroup: hat,
      petalRoots,
      headSwayGroups: [hat],
      leafSway: [
        { group: armL, baseZ: armL.rotation.z, amp: 0.05, phase: 0.3 },
        { group: armR, baseZ: armR.rotation.z, amp: 0.05, phase: 1.9 },
      ],
    };
  }

  function goalSnowmanSvg() {
    return goalShell(`
      <g class="goal-piece" data-step="0"><ellipse cx="90" cy="146" rx="52" ry="8" fill="#DFE9F1"/></g>
      <g class="goal-piece" data-step="1">
        <circle cx="90" cy="116" r="30" fill="#FFFFFF" stroke="#C9D6E2" stroke-width="2"/>
        <circle cx="90" cy="106" r="2.6" fill="#2B2B30"/><circle cx="90" cy="116" r="2.6" fill="#2B2B30"/><circle cx="90" cy="126" r="2.6" fill="#2B2B30"/>
      </g>
      <g class="goal-piece" data-step="2"><circle cx="90" cy="70" r="21" fill="#FFFFFF" stroke="#C9D6E2" stroke-width="2"/></g>
      <g class="goal-piece" data-step="3"><path d="M64 96 L40 82 M48 87 L42 76" stroke="#6B3F22" stroke-width="3.5" stroke-linecap="round"/></g>
      <g class="goal-piece" data-step="4"><path d="M116 96 L140 82 M132 87 L138 76" stroke="#6B3F22" stroke-width="3.5" stroke-linecap="round"/></g>
      <g class="goal-piece" data-step="5">
        <circle cx="83" cy="66" r="2.6" fill="#232328"/><circle cx="97" cy="66" r="2.6" fill="#232328"/>
        <path d="M90 71 L104 74 L90 75 Z" fill="#FF8A1F"/>
        <path d="M83 79 Q90 84 97 79" stroke="#232328" stroke-width="2" stroke-linecap="round"/>
      </g>
      <g class="goal-piece" data-step="6">
        <rect x="70" y="86" width="40" height="8" rx="4" fill="#2E8B57"/>
        <rect x="96" y="90" width="8" height="18" rx="2" fill="#2E8B57"/>
      </g>
      <g class="goal-piece" data-step="7">
        <path d="M70 52 Q86 22 112 34 L108 50 Z" fill="#D62F38"/>
        <rect x="68" y="48" width="44" height="8" rx="4" fill="#FFFFFF" stroke="#C9D6E2" stroke-width="1.5"/>
        <circle cx="113" cy="34" r="5" fill="#FFFFFF" stroke="#C9D6E2" stroke-width="1.5"/>
      </g>
    `, "#E8F1F8");
  }

  /* ---------------------------------------------------------
     Christmas tree: red pot, three stepped green tiers,
     baubles, a spiral of lights and a gold star
     --------------------------------------------------------- */

  // [bottom y, top y, bottom radius, top radius] for each green tier.
  const TREE_TIERS = [
    [1.0, 2.1, 1.18, 0.42],
    [1.9, 2.95, 0.92, 0.3],
    [2.7, 3.66, 0.66, 0.08],
  ];

  function tierRadius(tier, y) {
    const [y0, y1, r0, r1] = tier;
    return r0 + (r1 - r0) * ((y - y0) / (y1 - y0));
  }

  // Outer radius of the whole tree at height y (widest tier there).
  function treeRadius(y) {
    return TREE_TIERS.reduce((best, tier) => (y >= tier[0] && y <= tier[1] ? Math.max(best, tierRadius(tier, y)) : best), 0);
  }

  function treePot() {
    const group = new THREE.Group();
    group.add(mesh(new THREE.CylinderGeometry(0.62, 0.48, 0.62, 32), plastic(0xc8202b), [0, 0.31, 0]));
    group.add(mesh(new THREE.CylinderGeometry(0.67, 0.67, 0.1, 32), plastic(0xa8161f), [0, 0.64, 0]));
    group.add(mesh(new THREE.TorusGeometry(0.585, 0.035, 8, 40), plastic(0xffc72c, { metalness: 0.3 }), [0, 0.42, 0], [Math.PI / 2, 0, 0]));
    group.add(mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.04, 32), plastic(0x3e2614, { roughness: 0.85, clearcoat: 0 }), [0, 0.68, 0]));
    for (let i = 0; i < 10; i += 1) {
      const a = (i / 10) * Math.PI * 2;
      addStud(group, Math.cos(a) * 0.63, 0.72, Math.sin(a) * 0.63, 0xa8161f, 0.05, 0.05);
    }
    return group;
  }

  function treeTrunk() {
    const group = new THREE.Group();
    group.add(mesh(new THREE.CylinderGeometry(0.13, 0.16, 0.55, 14), plastic(0x6b3f22, { roughness: 0.6 }), [0, 0.92, 0]));
    group.add(mesh(new THREE.TorusGeometry(0.16, 0.03, 8, 20), plastic(0x55301a), [0, 0.72, 0], [Math.PI / 2, 0, 0]));
    return group;
  }

  // Small repeatable "random" number from a position, so every load looks the same.
  function hash3(x, y, z) {
    const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
    return s - Math.floor(s);
  }

  // One skirt of fir branches: a cone whose rim is cut into drooping branch
  // tips, with layered ridges up the side and a little jitter like needles.
  function firSkirtGeometry(radius, height, tips, ridges, twist) {
    const geo = new THREE.ConeGeometry(radius, height, tips * 4, ridges * 3, false);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i += 1) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const r = Math.hypot(x, z);
      if (r < 1e-4) continue;
      const a = Math.atan2(z, x) + twist;
      const t = (y + height / 2) / height; // 0 at the rim, 1 at the tip
      const tip = Math.pow(0.5 + 0.5 * Math.cos(a * tips), 1.6); // 1 at a branch tip
      const ridge = 1 - ((t * ridges) % 1); // sawtooth: each ridge is a row of branches
      const jitter = (hash3(x, y, z) - 0.5) * 0.08;
      const k = 1 - 0.2 * (1 - tip) * (1 - t) + 0.07 * ridge * (1 - t) + jitter * (1 - t * 0.6);
      pos.setX(i, x * k);
      pos.setZ(i, z * k);
      // Branch tips hang down, more at the rim.
      pos.setY(i, y - 0.12 * tip * Math.pow(1 - t, 2) - 0.035 * ridge * (1 - t));
    }
    geo.computeVertexNormals();
    return geo;
  }

  function treeTier(index, colors) {
    const group = new THREE.Group();
    const tier = TREE_TIERS[index];
    const [y0, y1] = tier;
    const height = y1 - y0;
    const needles = colors.map((c) => plastic(c, { roughness: 0.78, clearcoat: 0.05, flatShading: true }));
    const snow = plastic(0xf7fbff, { roughness: 0.9, clearcoat: 0 });
    // Three overlapping skirts per tier, darker underneath like a real fir.
    for (let k = 0; k < 3; k += 1) {
      const yb = y0 + k * height * 0.3;
      const rb = tierRadius(tier, yb) + 0.05;
      const top = y1 + 0.04;
      const h = top - yb;
      const tips = 9 + index * -1 + k * 2;
      const twist = (k * 0.9 + index * 0.4);
      const skirt = mesh(firSkirtGeometry(rb, h, tips, 3, twist), needles[k % needles.length], [0, yb + h / 2, 0]);
      group.add(skirt);
      // Dusting of snow on some of the branch tips.
      for (let i = 0; i < tips; i += 1) {
        if (hash3(index, k, i) < 0.45) continue;
        const a = (i / tips) * Math.PI * 2 - twist;
        const rr = rb * 0.8;
        const flake = mesh(new THREE.SphereGeometry(0.09, 8, 6), snow, [Math.cos(a) * rr, yb + h * 0.14 - 0.06, Math.sin(a) * rr], [0, -a, -0.35]);
        flake.scale.set(1.3, 0.35, 0.8);
        flake.castShadow = false;
        group.add(flake);
      }
    }
    return group;
  }

  function treeOrnaments() {
    const group = new THREE.Group();
    const colors = [0xd62f38, 0xffc72c, 0x3b7bd8, 0xd62f38, 0xe8e8ee, 0xffc72c];
    const spots = [
      [1.25, -0.2], [1.3, 0.75], [1.2, 1.7], [1.35, 2.6], [1.3, 3.6], [1.25, 4.6], [1.4, 5.5],
      [2.15, 0.3], [2.2, 1.3], [2.1, 2.4], [2.25, 3.3], [2.15, 4.3], [2.2, 5.3],
      [2.95, 0.9], [3.0, 2.1], [2.95, 3.3], [3.0, 4.5], [3.0, 5.6],
    ];
    spots.forEach(([y, a], i) => {
      // Angle 1.57 (π/2) faces the camera; spread the rest round the tree.
      const r = treeRadius(y) * 0.9 + 0.05;
      const ball = new THREE.Group();
      ball.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
      ball.add(mesh(new THREE.SphereGeometry(0.095, 16, 12), plastic(colors[i % colors.length], { roughness: 0.2, clearcoat: 1, metalness: 0.15 })));
      ball.add(mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.05, 8), plastic(0xc9a227, { metalness: 0.4 }), [0, 0.1, 0]));
      group.add(ball);
    });
    return group;
  }

  function treeGarland() {
    const group = new THREE.Group();
    const bulbColors = [0xfff3b0, 0xffb347, 0xfff3b0, 0x9fe8ff];
    const count = 54;
    const points = [];
    for (let i = 0; i < count; i += 1) {
      const t = i / (count - 1);
      const y = 1.05 + t * 2.35;
      const a = t * Math.PI * 2 * 3.2;
      const r = treeRadius(y) * 0.9 + 0.04;
      points.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
      if (i % 2 === 0) {
        const c = bulbColors[(i / 2) % bulbColors.length];
        group.add(mesh(new THREE.SphereGeometry(0.05, 10, 8), plastic(c, { emissive: c, emissiveIntensity: 1.1 }), [points[i].x, y, points[i].z]));
      }
    }
    const wire = new THREE.CatmullRomCurve3(points);
    const cable = mesh(new THREE.TubeGeometry(wire, 160, 0.012, 5, false), plastic(0x1f4d2e, { roughness: 0.8 }));
    cable.castShadow = false;
    group.add(cable);
    return group;
  }

  function treeStar() {
    const group = new THREE.Group();
    group.position.set(0, 3.82, 0);
    const shape = new THREE.Shape();
    for (let i = 0; i < 10; i += 1) {
      const a = Math.PI / 2 + (i / 10) * Math.PI * 2;
      const r = i % 2 === 0 ? 0.3 : 0.13;
      if (i === 0) shape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else shape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.08, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2 });
    geo.translate(0, 0, -0.04);
    group.add(mesh(geo, plastic(0xffd34d, { metalness: 0.35, roughness: 0.25, emissive: 0xffb300, emissiveIntensity: 0.35 })));
    group.add(mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.2, 10), plastic(0xc9a227), [0, -0.26, 0]));
    addStud(group, 0, 0, 0.07, 0xfff3b0, 0.05, 0.04, Math.PI / 2);
    return group;
  }

  function buildXmasTreeModel() {
    petalRoots = [];
    const pot = treePot();
    const trunk = treeTrunk();
    const bottom = treeTier(0, [0x1b5234, 0x21603c, 0x2a7047]);
    const middle = treeTier(1, [0x1f5a38, 0x266842, 0x2f784c]);
    const top = treeTier(2, [0x236040, 0x2c7049, 0x378255]);
    const ornaments = treeOrnaments();
    const garland = treeGarland();
    const star = treeStar();
    return {
      groups: [pot, trunk, bottom, middle, top, ornaments, garland, star],
      stemGroup: trunk,
      leafLeftGroup: null,
      leafRightGroup: null,
      centerGroup: top,
      petalGroup: star,
      petalRoots,
      headSwayGroups: [star],
      leafSway: [],
    };
  }

  function goalXmasTreeSvg() {
    return goalShell(`
      <g class="goal-piece" data-step="0"><path d="M74 128 H106 L102 148 H78 Z" fill="#C8202B"/><rect x="72" y="125" width="36" height="6" rx="2" fill="#A8161F"/></g>
      <g class="goal-piece" data-step="1"><rect x="86" y="112" width="8" height="15" rx="2" fill="#6B3F22"/></g>
      <g class="goal-piece" data-step="2"><path d="M90 74 L132 114 H48 Z" fill="#2E8B57"/></g>
      <g class="goal-piece" data-step="3"><path d="M90 52 L120 88 H60 Z" fill="#3A9D5D"/></g>
      <g class="goal-piece" data-step="4"><path d="M90 34 L110 64 H70 Z" fill="#48B06A"/></g>
      <g class="goal-piece" data-step="5">
        <circle cx="70" cy="108" r="4" fill="#D62F38"/><circle cx="104" cy="102" r="4" fill="#FFC72C"/>
        <circle cx="84" cy="82" r="4" fill="#3B7BD8"/><circle cx="102" cy="78" r="3.5" fill="#D62F38"/>
        <circle cx="90" cy="60" r="3.5" fill="#FFC72C"/>
      </g>
      <g class="goal-piece" data-step="6"><path d="M58 104 Q90 96 122 88 M66 80 Q90 74 112 66" stroke="#FFF3B0" stroke-width="2.5" stroke-linecap="round"/></g>
      <g class="goal-piece" data-step="7"><path d="M90 20 L93.5 28 L102 28.6 L95.5 34 L97.6 42.4 L90 37.8 L82.4 42.4 L84.5 34 L78 28.6 L86.5 28 Z" fill="#FFD34D" stroke="#C9A227" stroke-width="1"/></g>
    `, "#E6F3EA");
  }

  /* ---------------------------------------------------------
     Mini-brick figures (reindeer, bird): shapes filled with
     small square bricks on one shared grid, studs on top
     --------------------------------------------------------- */

  const VOX = 0.13;
  const voxBoxGeo = new THREE.BoxGeometry(VOX * 0.97, VOX * 0.97, VOX * 0.97);
  const voxStudGeo = makeStudGeometry(VOX * 0.3, 0.045);

  // Fill an ellipsoid (centre c, radii r) with bricks. colorAt(x, y, z) picks each
  // brick's colour; only the outer shell is built. Top-facing bricks get a stud.
  function voxelBlob(group, c, r, colorAt, { studs = true } = {}) {
    const [cx, cy, cz] = c;
    const [rx, ry, rz] = r;
    const inside = (x, y, z) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2 <= 1;
    const range = (center, radius) => [Math.floor((center - radius) / VOX), Math.ceil((center + radius) / VOX)];
    const [i0, i1] = range(cx, rx);
    const [j0, j1] = range(cy, ry);
    const [k0, k1] = range(cz, rz);
    for (let i = i0; i <= i1; i += 1) {
      for (let j = j0; j <= j1; j += 1) {
        for (let k = k0; k <= k1; k += 1) {
          const x = i * VOX;
          const y = j * VOX;
          const z = k * VOX;
          if (!inside(x, y, z)) continue;
          const shell = !inside(x + VOX, y, z) || !inside(x - VOX, y, z) || !inside(x, y + VOX, z)
            || !inside(x, y - VOX, z) || !inside(x, y, z + VOX) || !inside(x, y, z - VOX);
          if (!shell) continue;
          const color = colorAt(x, y, z);
          group.add(mesh(voxBoxGeo, plastic(color, { roughness: 0.38 }), [x, y, z]));
          if (studs && !inside(x, y + VOX, z)) {
            group.add(mesh(voxStudGeo, plastic(color, { roughness: 0.38 }), [x, y + VOX * 0.5 + 0.02, z]));
          }
        }
      }
    }
  }

  // A straight column of bricks from y0 to y1 at (x, z).
  function voxelColumn(group, x, z, y0, y1, colorAt) {
    const gx = Math.round(x / VOX) * VOX;
    const gz = Math.round(z / VOX) * VOX;
    for (let j = Math.round(y0 / VOX); j <= Math.round(y1 / VOX); j += 1) {
      group.add(mesh(voxBoxGeo, plastic(colorAt(j * VOX), { roughness: 0.38 }), [gx, j * VOX, gz]));
    }
  }

  /* ---------- Reindeer (sitting, Christmas) ---------- */

  const DEER_BROWN = 0x9a6234;
  const DEER_DARK = 0x6b3f22;
  const DEER_CREAM = 0xf1dcb8;
  const DEER_HEAD = [0, 1.75, 0.15];

  function deerLegs() {
    const group = new THREE.Group();
    // Front legs standing straight, dark hooves at the bottom.
    [-0.26, 0.26].forEach((x) => voxelColumn(group, x, 0.39, 0.13, 0.78, (y) => (y < 0.3 ? 0x3b2416 : DEER_BROWN)));
    // Folded back legs (haunches) on each side.
    [-0.46, 0.46].forEach((x) => voxelBlob(group, [x, 0.36, -0.2], [0.2, 0.26, 0.42], (px, py, pz) => (pz > 0.12 && py < 0.26 ? 0x3b2416 : DEER_BROWN)));
    return group;
  }

  function deerBody() {
    const group = new THREE.Group();
    voxelBlob(group, [0, 0.86, -0.05], [0.5, 0.56, 0.56], (x, y, z) => (z > 0.28 && Math.abs(x) < 0.26 && y < 1.15 ? DEER_CREAM : DEER_BROWN));
    // Little white tail at the back.
    voxelBlob(group, [0, 0.95, -0.62], [0.1, 0.12, 0.1], () => 0xfaf6ef, { studs: false });
    return group;
  }

  function deerHead() {
    const group = new THREE.Group();
    const [hx, hy, hz] = DEER_HEAD;
    voxelBlob(group, [hx, hy, hz], [0.44, 0.42, 0.42], (x, y, z) => (z > hz + 0.22 && y < hy - 0.02 ? DEER_CREAM : DEER_BROWN));
    return group;
  }

  function deerFace() {
    const group = new THREE.Group();
    const [, hy, hz] = DEER_HEAD;
    const front = hz + 0.42 + 0.04;
    [-0.17, 0.17].forEach((x) => {
      group.add(mesh(new THREE.BoxGeometry(0.1, 0.13, 0.04), plastic(0x1f1a17), [x, hy + 0.1, front - 0.03]));
      group.add(mesh(new THREE.BoxGeometry(0.035, 0.035, 0.02), plastic(0xffffff), [x + 0.02, hy + 0.13, front]));
    });
    // Shiny red nose.
    group.add(mesh(new THREE.SphereGeometry(0.12, 20, 14), plastic(0xe0262f, { roughness: 0.15, clearcoat: 1, emissive: 0x5a0000, emissiveIntensity: 0.3 }), [0, hy - 0.12, front + 0.04]));
    // Rosy cheeks.
    [-0.3, 0.3].forEach((x) => group.add(mesh(new THREE.BoxGeometry(0.09, 0.05, 0.02), plastic(0xf29a9a), [x, hy - 0.04, front - 0.12])));
    return group;
  }

  function deerEars() {
    const group = new THREE.Group();
    const [, hy, hz] = DEER_HEAD;
    [-1, 1].forEach((side) => {
      voxelBlob(group, [side * 0.52, hy + 0.12, hz], [0.2, 0.08, 0.1], (x) => (Math.abs(x) > 0.55 ? DEER_CREAM : DEER_BROWN), { studs: false });
    });
    return group;
  }

  function deerAntlers() {
    const group = new THREE.Group();
    const wood = plastic(DEER_DARK, { roughness: 0.55 });
    const [, hy, hz] = DEER_HEAD;
    [-1, 1].forEach((side) => {
      const antler = new THREE.Group();
      antler.position.set(side * 0.22, hy + 0.38, hz - 0.05);
      antler.rotation.z = side * -0.35;
      antler.add(mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.62, 8), wood, [0, 0.31, 0]));
      // Tines branching outwards.
      [[0.18, 0.5], [0.36, 0.42], [0.52, 0.32]].forEach(([y, len]) => {
        antler.add(mesh(new THREE.CylinderGeometry(0.025, 0.032, len, 8), wood, [side * len * 0.38, y + len * 0.3, 0], [0, 0, side * -0.95]));
      });
      antler.add(mesh(new THREE.SphereGeometry(0.04, 8, 6), wood, [0, 0.62, 0]));
      group.add(antler);
    });
    return group;
  }

  function buildReindeerModel() {
    petalRoots = [];
    const base = snowmanBase();
    base.add(redPedestal());
    const legs = deerLegs();
    const body = deerBody();
    const head = deerHead();
    const face = deerFace();
    const ears = deerEars();
    const antlers = deerAntlers();
    const hat = snowmanHat([0.02, DEER_HEAD[1] + 0.33, DEER_HEAD[2] + 0.05], 0.62);
    return {
      groups: [base, legs, body, head, face, ears, antlers, hat],
      stemGroup: body,
      leafLeftGroup: null,
      leafRightGroup: null,
      centerGroup: head,
      petalGroup: hat,
      petalRoots,
      headSwayGroups: [hat],
      leafSway: [],
    };
  }

  function goalReindeerSvg() {
    return goalShell(`
      <g class="goal-piece" data-step="0"><ellipse cx="90" cy="148" rx="52" ry="8" fill="#DFE9F1"/></g>
      <g class="goal-piece" data-step="1"><rect x="76" y="118" width="8" height="26" fill="#9A6234"/><rect x="96" y="118" width="8" height="26" fill="#9A6234"/><rect x="76" y="138" width="8" height="6" fill="#3B2416"/><rect x="96" y="138" width="8" height="6" fill="#3B2416"/></g>
      <g class="goal-piece" data-step="2"><rect x="66" y="96" width="48" height="36" rx="10" fill="#9A6234"/><rect x="80" y="104" width="20" height="22" rx="6" fill="#F1DCB8"/></g>
      <g class="goal-piece" data-step="3"><rect x="68" y="56" width="44" height="40" rx="12" fill="#9A6234"/><rect x="76" y="76" width="28" height="16" rx="6" fill="#F1DCB8"/></g>
      <g class="goal-piece" data-step="4"><rect x="79" y="66" width="5" height="7" fill="#1F1A17"/><rect x="96" y="66" width="5" height="7" fill="#1F1A17"/><circle cx="90" cy="82" r="6" fill="#E0262F"/></g>
      <g class="goal-piece" data-step="5"><rect x="56" y="62" width="14" height="7" rx="3" fill="#9A6234"/><rect x="110" y="62" width="14" height="7" rx="3" fill="#9A6234"/></g>
      <g class="goal-piece" data-step="6"><path d="M80 56 L70 28 M74 40 L62 34 M72 32 L66 22 M100 56 L110 28 M106 40 L118 34 M108 32 L114 22" stroke="#6B3F22" stroke-width="3.5" stroke-linecap="round"/></g>
      <g class="goal-piece" data-step="7"><path d="M78 56 Q88 34 104 42 L102 56 Z" fill="#D62F38"/><rect x="76" y="53" width="28" height="6" rx="3" fill="#FFFFFF" stroke="#C9D6E2"/><circle cx="105" cy="42" r="4" fill="#FFFFFF" stroke="#C9D6E2"/></g>
    `, "#F3E7DA");
  }

  /* ---------- Santa peeking out of a brick chimney (12 pieces) ---------- */

  const SANTA_RED = 0xd42a35;
  const SANTA_SKIN = 0xf2c9a8;
  const SANTA_WHITE = 0xf7f4ee;
  const CHIMNEY = { w: 1.5, d: 1.0, z: -0.05, top: 1.6 };
  const SANTA_HEAD = { c: [0, 3.0, 0.05], r: [0.46, 0.44, 0.4] };

  // Point on the front surface of an ellipsoid at (x, y).
  function ellFront(c, r, x, y, lift = 0.02) {
    const k = 1 - ((x - c[0]) / r[0]) ** 2 - ((y - c[1]) / r[1]) ** 2;
    return c[2] + r[2] * Math.sqrt(Math.max(0, k)) + lift;
  }

  // Brick-built walls: a mortar core with staggered bricks on all four sides.
  function chimneyBricks(y0, y1) {
    const group = new THREE.Group();
    const { w, d, z } = CHIMNEY;
    group.add(mesh(new THREE.BoxGeometry(w - 0.02, y1 - y0, d - 0.02), plastic(0x8a6a55, { roughness: 0.9, clearcoat: 0 }), [0, (y0 + y1) / 2, z]));
    const rowH = 0.11;
    const brickW = 0.25;
    const colors = [0xb8714a, 0xa45f3d, 0xc98458, 0xae6844];
    const geoCache = new Map();
    const brickGeo = (len, deep) => {
      const key = `${len.toFixed(3)}-${deep}`;
      if (!geoCache.has(key)) geoCache.set(key, deep ? new THREE.BoxGeometry(0.045, rowH * 0.86, len) : new THREE.BoxGeometry(len, rowH * 0.86, 0.045));
      return geoCache.get(key);
    };
    const rows = Math.round((y1 - y0) / rowH);
    for (let r = 0; r < rows; r += 1) {
      const y = y0 + rowH * (r + 0.5);
      const shift = r % 2 ? brickW / 2 : 0;
      // Front and back faces (along x), then left and right faces (along z).
      [[d / 2, false], [-d / 2, false], [w / 2, true], [-w / 2, true]].forEach(([offset, side]) => {
        const span = side ? d : w;
        for (let s = -span / 2 - shift; s < span / 2; s += brickW) {
          const a = Math.max(s, -span / 2);
          const b = Math.min(s + brickW, span / 2);
          if (b - a < 0.05) continue;
          const len = b - a - 0.02;
          const mid = (a + b) / 2;
          const color = colors[Math.floor(hash3(r, s * 7, offset * 3) * colors.length)];
          const pos = side ? [offset + Math.sign(offset) * 0.012, y, z + mid] : [mid, y, z + offset + Math.sign(offset) * 0.012];
          group.add(mesh(brickGeo(len, side), plastic(color, { roughness: 0.7, clearcoat: 0.1 }), pos));
        }
      });
    }
    return group;
  }

  function santaBase() {
    const group = new THREE.Group();
    const snow = plastic(SANTA_WHITE, { roughness: 0.55 });
    group.add(mesh(new THREE.BoxGeometry(2.5, 0.16, 1.7), snow, [0, 0.08, 0]));
    // Rounded snow edges.
    [[0, 0.85, 2.5, 0], [0, -0.85, 2.5, 0], [1.25, 0, 1.7, Math.PI / 2], [-1.25, 0, 1.7, Math.PI / 2]].forEach(([x, z, len, ry]) => {
      group.add(mesh(new THREE.CapsuleGeometry(0.09, len - 0.18, 6, 12), snow, [x, 0.12, z], [0, ry, Math.PI / 2]));
    });
    // Red carpet in front of the chimney.
    group.add(mesh(new THREE.BoxGeometry(1.7, 0.03, 0.42), plastic(0x9e1a24, { roughness: 0.8, clearcoat: 0 }), [0, 0.175, 0.62]));
    // Snow drifts at the back corner.
    [[-0.95, -0.55, 0.22], [-0.7, -0.65, 0.16], [1.05, 0.55, 0.14]].forEach(([x, z, rr]) => {
      const drift = mesh(new THREE.SphereGeometry(rr, 14, 10), snow, [x, 0.16, z]);
      drift.scale.y = 0.6;
      group.add(drift);
    });
    // Warm glowing lights on the base.
    [[-1.05, 0.7], [-0.4, 0.78], [0.45, 0.78], [1.1, 0.68], [-1.1, -0.2]].forEach(([x, z]) => {
      group.add(mesh(new THREE.SphereGeometry(0.07, 14, 10), plastic(0xfff1c2, { emissive: 0xffc66b, emissiveIntensity: 1.2 }), [x, 0.24, z]));
    });
    return group;
  }

  function santaLedge() {
    const group = new THREE.Group();
    const { z, top, d } = CHIMNEY;
    group.add(mesh(new THREE.BoxGeometry(1.74, 0.14, 1.22), plastic(0x9c8466, { roughness: 0.6 }), [0, top + 0.07, z]));
    group.add(mesh(new THREE.BoxGeometry(1.62, 0.08, 1.12), plastic(0x7d6a52, { roughness: 0.7 }), [0, top - 0.01, z]));
    // Snow resting on the ledge corners.
    const snow = plastic(SANTA_WHITE, { roughness: 0.55 });
    [[-0.66, 0.38, 0.2, 0.18], [0.7, -0.4, 0.18, 0.2], [-0.7, -0.42, 0.16, 0.16], [0.78, 0.42, 0.1, 0.12]].forEach(([x, dz, rx, rz]) => {
      const lump = mesh(new THREE.SphereGeometry(1, 16, 10), snow, [x, top + 0.15, z + dz]);
      lump.scale.set(rx, 0.06, rz);
      group.add(lump);
    });
    // Icicles hanging under the front edge.
    const ice = plastic(0xdff3ff, { roughness: 0.1, clearcoat: 1, transparent: true, opacity: 0.85 });
    for (let i = 0; i < 11; i += 1) {
      const x = -0.78 + i * 0.156;
      const len = 0.07 + hash3(i, 3, 7) * 0.12;
      group.add(mesh(new THREE.ConeGeometry(0.022, len, 6), ice, [x, top - len / 2, z + d / 2 + 0.1], [Math.PI, 0, 0]));
    }
    [[-0.75, 0.45], [0.75, -0.55]].forEach(([x, dz]) => addStud(group, x, top + 0.17, z + dz, 0x9c8466, 0.06, 0.05));
    return group;
  }

  function santaBody() {
    const group = new THREE.Group();
    voxelBlob(group, [0, 2.2, 0], [0.6, 0.55, 0.46], () => SANTA_RED);
    // White fur trim down the front and gold buttons.
    for (let y = 1.75; y <= 2.2; y += VOX) {
      group.add(mesh(new THREE.BoxGeometry(0.14, VOX * 0.95, 0.06), plastic(SANTA_WHITE), [0, y, ellFront([0, 2.2, 0], [0.6, 0.55, 0.46], 0, y, 0.01)]));
    }
    [2.0, 1.86].forEach((y) => addStud(group, 0.13, y, ellFront([0, 2.2, 0], [0.6, 0.55, 0.46], 0.13, y, 0.04), 0xd9b04c, 0.05, 0.05, Math.PI / 2));
    return group;
  }

  // Left arm rests on the chimney ledge.
  function santaArmRest() {
    const group = new THREE.Group();
    // Upper arm hangs from the shoulder, forearm lies forward along the ledge.
    voxelBlob(group, [-0.7, 2.14, 0.06], [0.2, 0.32, 0.22], () => SANTA_RED);
    voxelBlob(group, [-0.68, 1.88, 0.32], [0.18, 0.13, 0.3], () => SANTA_RED);
    // White fur cuff at the wrist.
    voxelBlob(group, [-0.68, 1.88, 0.58], [0.2, 0.14, 0.07], () => SANTA_WHITE, { studs: false });
    // Mitten gripping the front edge, fingers curled over it.
    voxelBlob(group, [-0.68, 1.85, 0.7], [0.15, 0.11, 0.1], () => 0x1f1d22);
    voxelBlob(group, [-0.68, 1.72, 0.7], [0.13, 0.09, 0.07], () => 0x1f1d22, { studs: false });
    group.add(mesh(new THREE.CapsuleGeometry(0.045, 0.08, 4, 8), plastic(0x1f1d22), [-0.52, 1.88, 0.7], [0, 0, -1.1]));
    return group;
  }

  // Right arm raised, waving hello. The group pivots at the shoulder so it can sway.
  function santaArmWave() {
    const group = new THREE.Group();
    group.position.set(0.5, 2.38, 0.08);
    group.rotation.z = -0.38;
    const arm = new THREE.Group();
    voxelBlob(arm, [0.12, 0.3, 0], [0.18, 0.36, 0.2], () => SANTA_RED);
    voxelBlob(arm, [0.12, 0.66, 0], [0.18, 0.07, 0.18], () => SANTA_WHITE, { studs: false });
    voxelBlob(arm, [0.12, 0.84, 0.02], [0.15, 0.15, 0.13], () => 0x1f1d22);
    // Thumb sticking out.
    arm.add(mesh(new THREE.CapsuleGeometry(0.045, 0.08, 4, 8), plastic(0x1f1d22), [-0.04, 0.82, 0.08], [0, 0, 0.6]));
    group.add(arm);
    return group;
  }

  function santaHead() {
    const group = new THREE.Group();
    voxelBlob(group, SANTA_HEAD.c, SANTA_HEAD.r, () => SANTA_SKIN, { studs: false });
    // Ears peeking out at the sides.
    [-1, 1].forEach((side) => group.add(mesh(new THREE.SphereGeometry(0.08, 12, 10), plastic(SANTA_SKIN), [side * 0.45, 3.0, 0.02])));
    return group;
  }

  function santaBeard() {
    const group = new THREE.Group();
    const front = (c, r, x, y) => ellFront(c, r, x, y, 0.0);
    // Main beard: starts under the nose, wide at the cheeks, rounded tip.
    const main = { c: [0, 2.52, 0.3], r: [0.44, 0.38, 0.24] };
    voxelBlob(group, main.c, main.r, () => SANTA_WHITE, { studs: false });
    voxelBlob(group, [0, 2.2, 0.36], [0.26, 0.16, 0.16], () => SANTA_WHITE, { studs: false });
    [-1, 1].forEach((side) => voxelBlob(group, [side * 0.38, 2.82, 0.16], [0.12, 0.26, 0.18], () => SANTA_WHITE, { studs: false }));
    // Fluffy curls: round 1x1 studs scattered over the beard.
    const curl = plastic(0xffffff, { roughness: 0.5 });
    for (let row = 0; row < 4; row += 1) {
      const y = 2.75 - row * 0.15;
      const n = 5 - Math.floor(row / 2);
      for (let i = 0; i < n; i += 1) {
        const x = (i - (n - 1) / 2) * 0.16 + (row % 2) * 0.05;
        if (Math.abs(x) > main.r[0] * 0.85) continue;
        group.add(mesh(new THREE.SphereGeometry(0.065, 10, 8), curl, [x, y, front(main.c, main.r, x, y) - 0.01]));
      }
    }
    // Curly moustache.
    const mz = ellFront(SANTA_HEAD.c, SANTA_HEAD.r, 0, 2.87, 0.06);
    [-1, 1].forEach((side) => {
      const m = mesh(new THREE.CapsuleGeometry(0.06, 0.18, 6, 10), curl, [side * 0.13, 2.87, mz], [0, 0, side * 1.25]);
      group.add(m);
      group.add(mesh(new THREE.SphereGeometry(0.055, 10, 8), curl, [side * 0.27, 2.93, mz - 0.04]));
    });
    return group;
  }

  function santaFace() {
    const group = new THREE.Group();
    const { c, r } = SANTA_HEAD;
    [-0.16, 0.16].forEach((x) => {
      const zf = ellFront(c, r, x, 3.06, 0.015);
      group.add(mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.03, 20), plastic(0xffffff), [x, 3.06, zf], [Math.PI / 2, 0, 0]));
      group.add(mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.03, 16), plastic(0x1f1a17), [x + 0.015, 3.05, zf + 0.012], [Math.PI / 2, 0, 0]));
      group.add(mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.02, 8), plastic(0xffffff), [x + 0.035, 3.075, zf + 0.025], [Math.PI / 2, 0, 0]));
      // Bushy white eyebrow.
      const brow = mesh(new THREE.CapsuleGeometry(0.035, 0.12, 4, 8), plastic(0xffffff, { roughness: 0.6 }), [x, 3.18, ellFront(c, r, x, 3.18, 0.02)], [0, 0, Math.PI / 2 + Math.sign(x) * -0.2]);
      group.add(brow);
    });
    group.add(mesh(new THREE.SphereGeometry(0.1, 18, 14), plastic(0xec8f97, { roughness: 0.25, clearcoat: 1 }), [0, 2.96, ellFront(c, r, 0, 2.96, 0.05)]));
    [-0.29, 0.29].forEach((x) => group.add(mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.02, 14), plastic(0xf5a3a8), [x, 2.96, ellFront(c, r, x, 2.96, 0.005)], [Math.PI / 2, 0, 0])));
    return group;
  }

  function santaHat() {
    // Outer group sits on the head so it can sway a little.
    const group = new THREE.Group();
    group.position.set(0, 3.3, 0);
    const hat = new THREE.Group();
    group.add(hat);
    voxelBlob(hat, [0, 0.12, -0.03], [0.48, 0.24, 0.43], () => SANTA_RED);
    voxelBlob(hat, [0.18, 0.36, -0.14], [0.32, 0.2, 0.3], () => SANTA_RED);
    voxelBlob(hat, [0.42, 0.44, -0.28], [0.2, 0.15, 0.18], () => SANTA_RED);
    voxelBlob(hat, [0.6, 0.3, -0.32], [0.12, 0.15, 0.12], () => SANTA_RED, { studs: false });
    voxelBlob(hat, [0, -0.02, 0.02], [0.52, 0.1, 0.47], () => SANTA_WHITE, { studs: false });
    hat.add(mesh(new THREE.SphereGeometry(0.14, 18, 14), plastic(0xfff3d0, { emissive: 0xffcf6b, emissiveIntensity: 0.9 }), [0.66, 0.1, -0.32]));
    return group;
  }

  function santaWreath() {
    const group = new THREE.Group();
    const cx = 0;
    const cy = 0.95;
    const cz = CHIMNEY.z + CHIMNEY.d / 2 + 0.08;
    const leafColors = [0x2e8b57, 0x3fa968, 0x267a4b];
    for (let i = 0; i < 16; i += 1) {
      const a = (i / 16) * Math.PI * 2;
      const leaf = mesh(new THREE.SphereGeometry(0.1, 10, 8), plastic(leafColors[i % 3], { roughness: 0.4 }), [cx + Math.cos(a) * 0.32, cy + Math.sin(a) * 0.32, cz], [0, 0, a + 0.6]);
      leaf.scale.set(1.5, 0.75, 0.6);
      group.add(leaf);
    }
    for (let i = 0; i < 7; i += 1) {
      const a = (i / 7) * Math.PI * 2 + 0.25;
      group.add(mesh(new THREE.SphereGeometry(0.05, 12, 10), plastic(0xe0262f, { roughness: 0.2, clearcoat: 1, emissive: 0x600000, emissiveIntensity: 0.4 }), [cx + Math.cos(a) * 0.36, cy + Math.sin(a) * 0.36, cz + 0.07]));
    }
    // Red bow at the top.
    const red = plastic(0xd42a35, { roughness: 0.35 });
    [-1, 1].forEach((side) => {
      const loop = mesh(new THREE.TorusGeometry(0.08, 0.03, 8, 18), red, [cx + side * 0.1, cy + 0.34, cz + 0.06]);
      loop.scale.set(1.3, 0.8, 0.6);
      group.add(loop);
      group.add(mesh(new THREE.BoxGeometry(0.05, 0.18, 0.03), red, [cx + side * 0.06, cy + 0.2, cz + 0.07], [0, 0, side * 0.3]));
    });
    group.add(mesh(new THREE.BoxGeometry(0.07, 0.07, 0.06), red, [cx, cy + 0.34, cz + 0.07]));
    // Warm lantern glowing in the middle of the wreath.
    group.add(mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.04, 28), plastic(0xffe3a3, { emissive: 0xffb347, emissiveIntensity: 1.1 }), [cx, cy, cz - 0.03], [Math.PI / 2, 0, 0]));
    group.add(mesh(new THREE.TorusGeometry(0.18, 0.025, 8, 28), plastic(0xc9a227, { metalness: 0.4 }), [cx, cy, cz - 0.01]));
    return group;
  }

  function santaSack() {
    const group = new THREE.Group();
    voxelBlob(group, [0.98, 0.55, -0.42], [0.3, 0.38, 0.3], (x, y) => (y > 0.78 ? 0x6b3f22 : 0x8a5a32), { studs: false });
    group.add(mesh(new THREE.TorusGeometry(0.1, 0.025, 8, 16), plastic(0xd9b04c), [0.98, 0.9, -0.42], [Math.PI / 2, 0, 0]));
    // Presents peeking out of the sack.
    [[0.9, 1.02, -0.45, 0x2e8b57, 0xffd34d, 0.22], [1.08, 1.06, -0.36, 0x3b7bd8, 0xffffff, 0.16]].forEach(([x, y, z, box, ribbon, size]) => {
      const gift = new THREE.Group();
      gift.position.set(x, y, z);
      gift.rotation.y = 0.4;
      gift.add(mesh(new THREE.BoxGeometry(size, size, size), plastic(box)));
      gift.add(mesh(new THREE.BoxGeometry(size + 0.01, size + 0.01, 0.04), plastic(ribbon)));
      group.add(gift);
    });
    // A candy cane leaning on the chimney.
    const cane = new THREE.Group();
    cane.position.set(0.82, 0.2, 0.32);
    cane.rotation.z = -0.15;
    for (let i = 0; i < 6; i += 1) {
      cane.add(mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.08, 10), plastic(i % 2 ? 0xffffff : 0xd42a35), [0, 0.04 + i * 0.08, 0]));
    }
    cane.add(mesh(new THREE.TorusGeometry(0.07, 0.035, 8, 14, Math.PI), plastic(0xd42a35), [-0.07, 0.48, 0]));
    group.add(cane);
    return group;
  }

  function buildSantaModel() {
    petalRoots = [];
    const base = santaBase();
    base.add(redPedestal());
    const low = chimneyBricks(0.16, 0.93);
    const high = chimneyBricks(0.93, CHIMNEY.top);
    const ledge = santaLedge();
    const body = santaBody();
    const armRest = santaArmRest();
    const armWave = santaArmWave();
    const head = santaHead();
    const beard = santaBeard();
    const face = santaFace();
    const hat = santaHat();
    const wreath = santaWreath();
    const sack = santaSack();
    return {
      groups: [base, low, high, ledge, body, armRest, armWave, head, beard, face, hat, wreath, sack],
      stemGroup: body,
      leafLeftGroup: null,
      leafRightGroup: null,
      centerGroup: head,
      petalGroup: hat,
      petalRoots,
      headSwayGroups: [hat],
      // The raised arm waves hello.
      leafSway: [{ group: armWave, baseZ: armWave.rotation.z, amp: 0.22, phase: 0 }],
    };
  }

  function goalSantaSvg() {
    return goalShell(`
      <g class="goal-piece" data-step="0"><rect x="34" y="140" width="112" height="10" rx="5" fill="#F7F4EE" stroke="#C9D6E2"/><rect x="52" y="138" width="76" height="4" fill="#9E1A24"/></g>
      <g class="goal-piece" data-step="1"><rect x="56" y="112" width="68" height="28" fill="#B8714A"/><path d="M56 121H124M56 130H124" stroke="#8A6A55" stroke-width="1.5"/></g>
      <g class="goal-piece" data-step="2"><rect x="56" y="90" width="68" height="22" fill="#A45F3D"/><path d="M56 99H124M56 106H124" stroke="#8A6A55" stroke-width="1.5"/></g>
      <g class="goal-piece" data-step="3"><rect x="50" y="84" width="80" height="8" rx="2" fill="#9C8466"/></g>
      <g class="goal-piece" data-step="4"><path d="M64 84 Q64 58 90 58 Q116 58 116 84 Z" fill="#D42A35"/></g>
      <g class="goal-piece" data-step="5"><rect x="52" y="70" width="14" height="16" rx="5" fill="#D42A35"/><rect x="52" y="80" width="14" height="7" rx="3" fill="#1F1D22"/></g>
      <g class="goal-piece" data-step="6"><rect x="114" y="40" width="13" height="30" rx="5" fill="#D42A35" transform="rotate(20 120 70)"/><rect x="118" y="30" width="13" height="10" rx="4" fill="#1F1D22" transform="rotate(20 120 70)"/></g>
      <g class="goal-piece" data-step="7"><rect x="72" y="34" width="36" height="30" rx="10" fill="#F2C9A8"/></g>
      <g class="goal-piece" data-step="8"><path d="M72 52 Q72 82 90 84 Q108 82 108 52 Q90 60 72 52 Z" fill="#F7F4EE" stroke="#D8D2C6"/></g>
      <g class="goal-piece" data-step="9"><circle cx="83" cy="45" r="3" fill="#1F1A17"/><circle cx="97" cy="45" r="3" fill="#1F1A17"/><circle cx="90" cy="51" r="3.5" fill="#E9898F"/></g>
      <g class="goal-piece" data-step="10"><path d="M70 36 Q78 14 104 20 L112 34 Z" fill="#D42A35"/><rect x="68" y="32" width="44" height="6" rx="3" fill="#F7F4EE"/><circle cx="114" cy="28" r="4" fill="#FFE9B0"/></g>
      <g class="goal-piece" data-step="11"><circle cx="90" cy="118" r="11" fill="none" stroke="#2E8B57" stroke-width="5"/><circle cx="82" cy="113" r="2" fill="#E0262F"/><circle cx="99" cy="122" r="2" fill="#E0262F"/><path d="M86 106 L90 109 L94 106" stroke="#D42A35" stroke-width="3"/></g>
      <g class="goal-piece" data-step="12"><ellipse cx="136" cy="124" rx="10" ry="14" fill="#8A5A32"/><rect x="130" y="104" width="10" height="9" fill="#2E8B57"/></g>
    `, "#FBE3E3");
  }

  /* ---------- Christmas snow globe gift (12 pieces) ---------- */

  const GLOBE = { cy: 1.55, r: 1.0, floor: 1.02 };
  const GOLD = 0xd9b04c;

  // Low red display pedestal with gold rims, sitting under a whole scene.
  // Built from y = -lift up to 0, so it ends up on the wooden base once the scene is lifted.
  const PEDESTAL_LIFT = 0.4;
  function redPedestal(radius = 1.56) {
    const group = new THREE.Group();
    const h = PEDESTAL_LIFT;
    const profile = [[0, -h], [radius + 0.08, -h], [radius + 0.1, -h + 0.06], [radius + 0.03, -h + 0.16], [radius, -0.05], [radius - 0.02, 0], [0, 0]]
      .map(([r, y]) => new THREE.Vector2(r, y));
    group.add(mesh(new THREE.LatheGeometry(profile, 72), plastic(0xc8202b, { roughness: 0.32, clearcoat: 0.8 })));
    const gold = plastic(GOLD, { metalness: 0.45, roughness: 0.25 });
    group.add(mesh(new THREE.TorusGeometry(radius + 0.09, 0.035, 10, 72), gold, [0, -h + 0.05, 0], [Math.PI / 2, 0, 0]));
    group.add(mesh(new THREE.TorusGeometry(radius - 0.01, 0.035, 10, 72), gold, [0, -0.02, 0], [Math.PI / 2, 0, 0]));
    // Little snowy dots around the band.
    for (let i = 0; i < 28; i += 1) {
      const a = (i / 28) * Math.PI * 2;
      group.add(mesh(new THREE.SphereGeometry(0.03, 8, 6), plastic(0xffffff), [Math.cos(a) * (radius + 0.05), -h * 0.55, Math.sin(a) * (radius + 0.05)]));
    }
    return group;
  }

  function globeBase() {
    const group = new THREE.Group();
    const red = plastic(0xc8202b, { roughness: 0.32, clearcoat: 0.8 });
    // Rounded pedestal: wide at the bottom, narrowing to the globe.
    const profile = [[0, 0.1], [1.12, 0.1], [1.16, 0.18], [1.1, 0.32], [1.0, 0.62], [0.95, 0.86], [0.92, 0.96], [0.86, 1.0], [0, 1.0]]
      .map(([r, y]) => new THREE.Vector2(r, y));
    group.add(mesh(new THREE.LatheGeometry(profile, 64), red));
    return group;
  }

  function globeTrims() {
    const group = new THREE.Group();
    const gold = plastic(GOLD, { metalness: 0.45, roughness: 0.25 });
    group.add(mesh(new THREE.TorusGeometry(1.15, 0.045, 10, 64), gold, [0, 0.16, 0], [Math.PI / 2, 0, 0]));
    group.add(mesh(new THREE.TorusGeometry(0.98, 0.03, 10, 64), gold, [0, 0.66, 0], [Math.PI / 2, 0, 0]));
    group.add(mesh(new THREE.TorusGeometry(0.9, 0.05, 10, 64), gold, [0, 0.99, 0], [Math.PI / 2, 0, 0]));
    // Four little gold feet.
    for (let i = 0; i < 4; i += 1) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      group.add(mesh(new THREE.SphereGeometry(0.11, 16, 12), gold, [Math.cos(a) * 0.98, 0.1, Math.sin(a) * 0.98]));
    }
    // White snowy dots around the middle band.
    for (let i = 0; i < 18; i += 1) {
      const a = (i / 18) * Math.PI * 2;
      group.add(mesh(new THREE.SphereGeometry(0.035, 8, 6), plastic(0xffffff), [Math.cos(a) * 1.04, 0.45, Math.sin(a) * 1.04]));
    }
    return group;
  }

  function globeBow() {
    const group = new THREE.Group();
    const z = 1.08;
    const ribbon = plastic(0xe0263f, { roughness: 0.3, clearcoat: 1 });
    [-1, 1].forEach((side) => {
      const loop = mesh(new THREE.TorusGeometry(0.15, 0.05, 10, 22), ribbon, [side * 0.17, 0.58, z], [0, 0, side * 0.35]);
      loop.scale.set(1.25, 0.8, 0.55);
      group.add(loop);
      group.add(mesh(new THREE.BoxGeometry(0.09, 0.3, 0.04), ribbon, [side * 0.1, 0.36, z - 0.02], [0, 0, side * 0.35]));
    });
    group.add(mesh(new THREE.SphereGeometry(0.075, 14, 12), ribbon, [0, 0.58, z + 0.02]));
    // Holly leaves and berries behind the bow.
    const holly = plastic(0x2e8b57, { roughness: 0.4 });
    [[-0.42, 0.62, 0.4], [-0.38, 0.5, -0.3], [0.42, 0.62, -0.4], [0.38, 0.5, 0.3]].forEach(([x, y, rz]) => {
      const leaf = mesh(new THREE.SphereGeometry(0.1, 10, 8), holly, [x, y, z - 0.06], [0, 0, rz]);
      leaf.scale.set(1.7, 0.7, 0.4);
      group.add(leaf);
    });
    [[-0.3, 0.58], [-0.27, 0.65], [0.3, 0.58], [0.27, 0.65]].forEach(([x, y]) => group.add(mesh(new THREE.SphereGeometry(0.035, 10, 8), plastic(0xff2a3a, { roughness: 0.15, clearcoat: 1 }), [x, y, z])));
    return group;
  }

  function globeSnowFloor() {
    const group = new THREE.Group();
    const snow = plastic(SNOW_WHITE, { roughness: 0.6 });
    group.add(mesh(new THREE.CylinderGeometry(0.84, 0.84, 0.08, 48), snow, [0, GLOBE.floor + 0.04, 0]));
    for (let i = 0; i < 12; i += 1) {
      const a = (i / 12) * Math.PI * 2;
      const r = 0.55 + (i % 3) * 0.08;
      const lump = mesh(new THREE.SphereGeometry(0.12 + (i % 2) * 0.04, 12, 9), plastic(i % 2 ? SNOW_WHITE : SNOW_SHADE, { roughness: 0.55 }), [Math.cos(a) * r, GLOBE.floor + 0.08, Math.sin(a) * r]);
      lump.scale.y = 0.45;
      group.add(lump);
    }
    return group;
  }

  function globeTree() {
    const group = new THREE.Group();
    group.position.set(-0.38, GLOBE.floor + 0.02, -0.22);
    group.scale.setScalar(0.3);
    group.userData.baseScale = 0.3;
    group.add(treeTrunk(), treeTier(0, [0x1b5234, 0x21603c, 0x2a7047]), treeTier(1, [0x1f5a38, 0x266842, 0x2f784c]), treeTier(2, [0x236040, 0x2c7049, 0x378255]), treeOrnaments(), treeStar());
    return group;
  }

  function globeHouse() {
    const group = new THREE.Group();
    group.position.set(0.36, GLOBE.floor + 0.08, -0.3);
    group.rotation.y = -0.45;
    group.add(mesh(new THREE.BoxGeometry(0.42, 0.3, 0.34), plastic(0xb5713f, { roughness: 0.5 }), [0, 0.15, 0]));
    // Snowy pitched roof.
    [-1, 1].forEach((side) => {
      group.add(mesh(new THREE.BoxGeometry(0.5, 0.05, 0.26), plastic(0xc8202b), [0, 0.38, side * 0.1], [side * 0.75, 0, 0]));
      group.add(mesh(new THREE.BoxGeometry(0.52, 0.035, 0.24), plastic(0xffffff, { roughness: 0.6 }), [0, 0.41, side * 0.1], [side * 0.75, 0, 0]));
    });
    group.add(mesh(new THREE.BoxGeometry(0.06, 0.12, 0.06), plastic(0x8a5a32), [0.12, 0.47, -0.05]));
    // Glowing windows and a door.
    const glow = plastic(0xffe3a3, { emissive: 0xffb347, emissiveIntensity: 1.1 });
    [-0.12, 0.12].forEach((x) => group.add(mesh(new THREE.BoxGeometry(0.08, 0.08, 0.01), glow, [x, 0.18, 0.175])));
    group.add(mesh(new THREE.BoxGeometry(0.08, 0.14, 0.01), plastic(0x6b3f22), [0, 0.07, 0.175]));
    // Icing trim along the eaves.
    for (let i = 0; i < 6; i += 1) group.add(mesh(new THREE.SphereGeometry(0.02, 6, 5), plastic(0xffffff), [-0.2 + i * 0.08, 0.3, 0.18]));
    return group;
  }

  function globeSanta() {
    const group = new THREE.Group();
    const x = 0.06;
    const z = 0.24;
    const ground = GLOBE.floor + 0.08;
    const y = ground + 0.14; // body sits on top of the legs
    const red = plastic(0xd42a35, { roughness: 0.35 });
    const white = plastic(0xffffff, { roughness: 0.5 });
    // Legs: red trousers and black boots with the toes pointing forward.
    [-1, 1].forEach((side) => {
      const lx = x + side * 0.065;
      group.add(mesh(new THREE.CylinderGeometry(0.048, 0.052, 0.12, 12), red, [lx, ground + 0.09, z]));
      group.add(mesh(new THREE.TorusGeometry(0.05, 0.014, 6, 14), white, [lx, ground + 0.05, z], [Math.PI / 2, 0, 0]));
      group.add(mesh(new THREE.BoxGeometry(0.09, 0.05, 0.13), plastic(0x1f1d22, { roughness: 0.3, clearcoat: 1 }), [lx, ground + 0.025, z + 0.025]));
    });
    group.add(mesh(new THREE.CylinderGeometry(0.11, 0.17, 0.3, 18), red, [x, y + 0.15, z]));
    group.add(mesh(new THREE.TorusGeometry(0.16, 0.03, 8, 20), white, [x, y + 0.02, z], [Math.PI / 2, 0, 0]));
    group.add(mesh(new THREE.BoxGeometry(0.3, 0.04, 0.27), plastic(0x232328), [x, y + 0.14, z]));
    group.add(mesh(new THREE.BoxGeometry(0.06, 0.05, 0.02), plastic(GOLD, { metalness: 0.4 }), [x, y + 0.14, z + 0.14]));
    group.add(mesh(new THREE.SphereGeometry(0.1, 16, 12), plastic(SANTA_SKIN), [x, y + 0.38, z]));
    const beard = mesh(new THREE.SphereGeometry(0.1, 14, 10), white, [x, y + 0.31, z + 0.05]);
    beard.scale.set(1, 1.1, 0.7);
    group.add(beard);
    [-0.035, 0.035].forEach((ex) => group.add(mesh(new THREE.SphereGeometry(0.014, 6, 5), plastic(0x1f1a17), [x + ex, y + 0.41, z + 0.09])));
    group.add(mesh(new THREE.SphereGeometry(0.02, 8, 6), plastic(0xec8f97), [x, y + 0.38, z + 0.1]));
    group.add(mesh(new THREE.ConeGeometry(0.1, 0.2, 16), red, [x + 0.02, y + 0.54, z], [0, 0, -0.3]));
    group.add(mesh(new THREE.TorusGeometry(0.095, 0.025, 8, 18), white, [x, y + 0.45, z], [Math.PI / 2, 0, 0]));
    group.add(mesh(new THREE.SphereGeometry(0.035, 10, 8), white, [x + 0.08, y + 0.63, z]));
    // Waving arms.
    [-1, 1].forEach((side) => group.add(mesh(new THREE.CapsuleGeometry(0.035, 0.12, 4, 8), red, [x + side * 0.15, y + 0.26 + (side > 0 ? 0.06 : 0), z], [0, 0, side * (side > 0 ? 2.3 : 0.5)])));
    // Gift sack on his back.
    const sack = mesh(new THREE.SphereGeometry(0.11, 12, 10), plastic(0x8a5a32), [x - 0.12, y + 0.22, z - 0.12]);
    sack.scale.y = 1.2;
    group.add(sack);
    return group;
  }

  function globeSnowman() {
    const group = new THREE.Group();
    const x = -0.36;
    const z = 0.3;
    const y = GLOBE.floor + 0.06;
    const snow = plastic(SNOW_WHITE, { roughness: 0.5 });
    group.add(mesh(new THREE.SphereGeometry(0.13, 16, 12), snow, [x, y + 0.12, z]));
    group.add(mesh(new THREE.SphereGeometry(0.095, 16, 12), snow, [x, y + 0.31, z]));
    [-0.03, 0.03].forEach((ex) => group.add(mesh(new THREE.SphereGeometry(0.012, 6, 5), plastic(0x232328), [x + ex, y + 0.33, z + 0.085])));
    group.add(mesh(new THREE.ConeGeometry(0.016, 0.07, 8), plastic(0xff8a1f), [x, y + 0.31, z + 0.12], [Math.PI / 2, 0, 0]));
    group.add(mesh(new THREE.TorusGeometry(0.085, 0.022, 6, 16), plastic(0x2e8b57), [x, y + 0.23, z], [Math.PI / 2, 0, 0]));
    group.add(mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.015, 14), plastic(0x232328), [x, y + 0.395, z]));
    group.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 14), plastic(0x232328), [x, y + 0.44, z]));
    return group;
  }

  function globeGifts() {
    const group = new THREE.Group();
    [[0.42, 0.28, 0.12, 0x2e8b57, 0xffc72c, 0.4], [0.55, 0.12, 0.09, 0x3b7bd8, 0xffffff, -0.3], [0.32, 0.46, 0.08, 0xff9db5, 0xe0263f, 0.2]].forEach(([x, z, s, box, ribbon, ry]) => {
      const gift = new THREE.Group();
      gift.position.set(x, GLOBE.floor + 0.08 + s / 2, z);
      gift.rotation.y = ry;
      gift.add(mesh(new THREE.BoxGeometry(s, s, s), plastic(box)));
      gift.add(mesh(new THREE.BoxGeometry(s + 0.006, s + 0.006, s * 0.22), plastic(ribbon)));
      gift.add(mesh(new THREE.BoxGeometry(s * 0.22, s + 0.006, s + 0.006), plastic(ribbon)));
      group.add(gift);
    });
    return group;
  }

  function globeGlass() {
    const group = new THREE.Group();
    const glass = plastic(0xffffff, { transparent: true, opacity: 0.16, roughness: 0.02, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 1.4, depthWrite: false });
    // Sphere cut off where it meets the base.
    const cut = Math.acos((GLOBE.floor - GLOBE.cy) / GLOBE.r);
    const sphere = mesh(new THREE.SphereGeometry(GLOBE.r, 64, 40, 0, Math.PI * 2, 0, cut), glass, [0, GLOBE.cy, 0]);
    sphere.renderOrder = 5;
    sphere.castShadow = false;
    group.add(sphere);
    // A soft highlight streak on the glass.
    const shine = mesh(new THREE.SphereGeometry(GLOBE.r + 0.005, 32, 16, -0.9, 0.35, 0.5, 0.7), plastic(0xffffff, { transparent: true, opacity: 0.35, depthWrite: false }), [0, GLOBE.cy, 0]);
    shine.renderOrder = 6;
    shine.castShadow = false;
    group.add(shine);
    return group;
  }

  function globeSnowflakes() {
    const group = new THREE.Group();
    const flake = plastic(0xffffff, { emissive: 0xffffff, emissiveIntensity: 0.25 });
    let placed = 0;
    for (let i = 0; placed < 70 && i < 400; i += 1) {
      const x = (hash3(i, 1, 2) - 0.5) * 1.7;
      const y = GLOBE.floor + 0.25 + hash3(i, 3, 4) * 1.15;
      const z = (hash3(i, 5, 6) - 0.5) * 1.7;
      if (Math.hypot(x, y - GLOBE.cy, z) > GLOBE.r - 0.08) continue;
      group.add(mesh(new THREE.SphereGeometry(0.018 + hash3(i, 7, 8) * 0.02, 6, 5), flake, [x, y, z]));
      placed += 1;
    }
    return group;
  }

  function globeKeyLights() {
    const group = new THREE.Group();
    // Ring of coloured lights around the top of the base.
    const colors = [0xff6b6b, 0xffd34d, 0x7fd99a, 0x9fd8ff, 0xff9db5];
    for (let i = 0; i < 20; i += 1) {
      const a = (i / 20) * Math.PI * 2;
      const c = colors[i % colors.length];
      group.add(mesh(new THREE.SphereGeometry(0.045, 10, 8), plastic(c, { emissive: c, emissiveIntensity: 1.1 }), [Math.cos(a) * 0.97, 0.86, Math.sin(a) * 0.97]));
    }
    // Gold wind-up key for the music box, at the back.
    const gold = plastic(GOLD, { metalness: 0.5, roughness: 0.25 });
    const key = new THREE.Group();
    key.position.set(0, 0.5, -1.06);
    key.add(mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.22, 10), gold, [0, 0, -0.08], [Math.PI / 2, 0, 0]));
    [-1, 1].forEach((side) => {
      const wing = mesh(new THREE.TorusGeometry(0.09, 0.03, 8, 16), gold, [side * 0.1, 0, -0.2]);
      wing.scale.set(1.1, 0.8, 1);
      key.add(wing);
    });
    group.add(key);
    return group;
  }

  // Scale a group by k around the point (x, y, z), so it grows in place.
  function scaleAbout(group, k, x, y, z) {
    group.scale.setScalar(k);
    group.userData.baseScale = k;
    group.position.set(x - k * x, y - k * y, z - k * z);
    return group;
  }

  function buildGlobeModel() {
    petalRoots = [];
    const base = globeBase();
    const trims = globeTrims();
    const bow = globeBow();
    const floor = globeSnowFloor();
    const tree = globeTree();
    const house = globeHouse();
    const santa = scaleAbout(globeSanta(), 1.45, 0.06, GLOBE.floor + 0.08, 0.24);
    const snowman = scaleAbout(globeSnowman(), 1.4, -0.36, GLOBE.floor + 0.06, 0.3);
    const gifts = scaleAbout(globeGifts(), 1.3, 0.42, GLOBE.floor + 0.08, 0.3);
    const glass = globeGlass();
    const flakes = globeSnowflakes();
    const lights = globeKeyLights();
    return {
      groups: [base, trims, bow, floor, tree, house, santa, snowman, gifts, glass, flakes, lights],
      stemGroup: base,
      leafLeftGroup: null,
      leafRightGroup: null,
      centerGroup: santa,
      petalGroup: flakes,
      petalRoots,
      headSwayGroups: [],
      leafSway: [],
    };
  }

  function goalGlobeSvg() {
    return goalShell(`
      <g class="goal-piece" data-step="0"><path d="M52 146 H128 L122 112 H58 Z" fill="#C8202B"/></g>
      <g class="goal-piece" data-step="1"><rect x="50" y="143" width="80" height="4" rx="2" fill="#D9B04C"/><rect x="56" y="110" width="68" height="4" rx="2" fill="#D9B04C"/></g>
      <g class="goal-piece" data-step="2"><ellipse cx="82" cy="128" rx="7" ry="5" fill="#E0263F"/><ellipse cx="98" cy="128" rx="7" ry="5" fill="#E0263F"/><circle cx="90" cy="128" r="3" fill="#E0263F"/><ellipse cx="70" cy="128" rx="6" ry="3" fill="#2E8B57"/><ellipse cx="110" cy="128" rx="6" ry="3" fill="#2E8B57"/></g>
      <g class="goal-piece" data-step="3"><ellipse cx="90" cy="108" rx="34" ry="5" fill="#F4F7FA"/></g>
      <g class="goal-piece" data-step="4"><path d="M76 74 L86 104 H66 Z" fill="#2A7047"/><circle cx="76" cy="72" r="2.5" fill="#FFD34D"/></g>
      <g class="goal-piece" data-step="5"><rect x="98" y="90" width="16" height="14" fill="#B5713F"/><path d="M96 91 L106 82 L116 91 Z" fill="#C8202B"/><rect x="102" y="94" width="4" height="4" fill="#FFE3A3"/></g>
      <g class="goal-piece" data-step="6"><path d="M86 106 L90 88 L94 106 Z" fill="#D42A35"/><circle cx="90" cy="86" r="4" fill="#F2C9A8"/><path d="M86 84 L90 76 L94 84 Z" fill="#D42A35"/></g>
      <g class="goal-piece" data-step="7"><circle cx="76" cy="104" r="4" fill="#fff" stroke="#C9D6E2"/><circle cx="76" cy="97" r="3" fill="#fff" stroke="#C9D6E2"/></g>
      <g class="goal-piece" data-step="8"><rect x="100" y="100" width="6" height="6" fill="#2E8B57"/><rect x="107" y="102" width="5" height="5" fill="#3B7BD8"/></g>
      <g class="goal-piece" data-step="9"><circle cx="90" cy="76" r="38" fill="#DFF3FF" fill-opacity=".35" stroke="#C9D6E2" stroke-width="2"/></g>
      <g class="goal-piece" data-step="10"><circle cx="74" cy="60" r="1.6" fill="#fff"/><circle cx="104" cy="54" r="1.6" fill="#fff"/><circle cx="90" cy="46" r="1.4" fill="#fff"/><circle cx="66" cy="78" r="1.4" fill="#fff"/><circle cx="112" cy="74" r="1.6" fill="#fff"/></g>
      <g class="goal-piece" data-step="11"><circle cx="62" cy="113" r="2" fill="#FF6B6B"/><circle cx="76" cy="113" r="2" fill="#FFD34D"/><circle cx="104" cy="113" r="2" fill="#7FD99A"/><circle cx="118" cy="113" r="2" fill="#9FD8FF"/></g>
    `, "#FBE3E3");
  }

  function createBee() {
    beeGroup = new THREE.Group();

    const abdomen = mesh(
      new THREE.SphereGeometry(0.15, 16, 12),
      plastic(COLORS.yellow, { roughness: 0.3 }),
      [0.05, 0, 0]
    );
    abdomen.scale.set(1.45, 1, 0.9);
    beeGroup.add(abdomen);

    const stripe = mesh(
      new THREE.CylinderGeometry(0.145, 0.145, 0.055, 18),
      plastic(COLORS.black, { roughness: 0.45 }),
      [0.02, 0, 0],
      [0, 0, Math.PI / 2]
    );
    stripe.scale.set(1, 1, 0.9);
    beeGroup.add(stripe);

    const head = mesh(
      new THREE.SphereGeometry(0.095, 14, 10),
      plastic(COLORS.black, { roughness: 0.45 }),
      [-0.23, 0, 0]
    );
    beeGroup.add(head);

    const wingMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.48,
      roughness: 0.16,
      metalness: 0,
      clearcoat: 0.8,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const wingA = mesh(new THREE.SphereGeometry(0.13, 12, 8), wingMaterial, [-0.01, 0.14, 0.03]);
    wingA.scale.set(1.5, 0.14, 0.72);
    wingA.rotation.z = -0.36;
    wingA.castShadow = false;
    beeGroup.add(wingA);

    const wingB = mesh(new THREE.SphereGeometry(0.13, 12, 8), wingMaterial, [-0.01, 0.13, -0.04]);
    wingB.scale.set(1.45, 0.13, 0.68);
    wingB.rotation.z = -0.28;
    wingB.castShadow = false;
    beeGroup.add(wingB);

    beeGroup.userData.wings = [wingA, wingB];
    beeGroup.visible = false;
    beeGroup.position.set(2, 3.5, 1);
    scene.add(beeGroup);
  }

  /* ---------------------------------------------------------
     Camera control
     --------------------------------------------------------- */

  // How many real pixels to draw per CSS pixel. Phones with 3x screens get the
  // full 3x (2x looked soft there); 1x screens get 1.5x for cleaner edges.
  // A pixel budget keeps very large windows from slowing down.
  function sharpPixelRatio(width, height) {
    const dpr = window.devicePixelRatio || 1;
    let ratio = dpr < 1.5 ? 1.5 : Math.min(dpr, 3);
    const budget = 6000000;
    const pixels = Math.max(1, width * height) * ratio * ratio;
    if (pixels > budget) ratio = Math.max(1, Math.sqrt(budget / Math.max(1, width * height)));
    return ratio;
  }

  function defaultRadius() {
    return window.innerWidth < 760 ? 16.8 : window.innerWidth < 1100 ? 15.6 : 14.3;
  }

  function resetCamera() {
    cameraTarget.y = 1.7;
    cameraState.theta = 0.42;
    cameraState.phi = 1.24;
    cameraState.radius = defaultRadius() + 1.2;
    cameraState.desiredTheta = 0.42;
    cameraState.desiredPhi = 1.24;
    cameraState.desiredRadius = defaultRadius();
    cameraState.userZoomed = false;
  }

  function updateCamera(dt) {
    const ease = 1 - Math.exp(-7.2 * dt);
    cameraState.theta += (cameraState.desiredTheta - cameraState.theta) * ease;
    cameraState.phi += (cameraState.desiredPhi - cameraState.phi) * ease;
    cameraState.radius += (cameraState.desiredRadius - cameraState.radius) * ease;

    const sinPhi = Math.sin(cameraState.phi);
    camera.position.set(
      cameraTarget.x + cameraState.radius * sinPhi * Math.sin(cameraState.theta),
      cameraTarget.y + cameraState.radius * Math.cos(cameraState.phi),
      cameraTarget.z + cameraState.radius * sinPhi * Math.cos(cameraState.theta)
    );
    camera.lookAt(cameraTarget);
  }

  function resizeRenderer() {
    if (!renderer || !camera) return;
    const width = stage.clientWidth;
    const height = Math.max(1, stage.clientHeight);
    renderer.setPixelRatio(sharpPixelRatio(width, height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = width < 760 ? 49 : width < 1100 ? 42 : 38;
    camera.updateProjectionMatrix();
    if (!cameraState.userZoomed) {
      cameraState.desiredRadius = defaultRadius();
    }
  }

  function screenToPointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  const drag = {
    active: false,
    moved: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    pointers: new Map(),
    pinchDistance: 0,
  };

  function onPointerDown(event) {
    if (event.button !== undefined && event.button !== 0) return;
    hideDragHint();
    ensureAudio();
    drag.active = true;
    drag.moved = false;
    drag.pointerId = event.pointerId;
    drag.startX = event.clientX;
    drag.startY = event.clientY;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    drag.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    try { canvas.setPointerCapture?.(event.pointerId); } catch (error) { /* pointer capture is optional */ }
    canvas.classList.add("is-grabbing");
    if (drag.pointers.size === 2) {
      const points = [...drag.pointers.values()];
      drag.pinchDistance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
    }
  }

  function onPointerMove(event) {
    if (!drag.active) return;
    if (!drag.pointers.has(event.pointerId)) return;
    drag.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (drag.pointers.size === 2) {
      const points = [...drag.pointers.values()];
      const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      if (drag.pinchDistance > 0) {
        const delta = (drag.pinchDistance - distance) * 0.012;
        cameraState.desiredRadius = THREE.MathUtils.clamp(cameraState.desiredRadius + delta, 7.2, 17);
        cameraState.userZoomed = true;
      }
      drag.pinchDistance = distance;
      drag.moved = true;
      return;
    }

    const dx = event.clientX - drag.lastX;
    const dy = event.clientY - drag.lastY;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;

    if (Math.abs(event.clientX - drag.startX) + Math.abs(event.clientY - drag.startY) > 5) {
      drag.moved = true;
    }

    if (drag.moved) {
      cameraState.desiredTheta -= dx * 0.0062;
      cameraState.desiredPhi = THREE.MathUtils.clamp(cameraState.desiredPhi + dy * 0.0044, 0.86, 1.42);
    }
  }

  function onPointerUp(event) {
    if (!drag.active) return;
    if (drag.pointerId !== event.pointerId && !drag.pointers.has(event.pointerId)) return;

    const wasMoved = drag.moved;
    drag.pointers.delete(event.pointerId);
    try { canvas.releasePointerCapture?.(event.pointerId); } catch (error) { /* already released */ }
    if (drag.pointers.size === 0) {
      drag.active = false;
      drag.pointerId = null;
      drag.pinchDistance = 0;
      canvas.classList.remove("is-grabbing");
      if (!wasMoved) handleCanvasClick(event);
    }
  }

  function onPointerCancel(event) {
    drag.pointers.delete(event.pointerId);
    if (drag.pointers.size === 0) {
      drag.active = false;
      drag.pointerId = null;
      drag.pinchDistance = 0;
      canvas.classList.remove("is-grabbing");
    }
  }

  function handleCanvasClick(event) {
    if (!camera) return;
    screenToPointer(event);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(hitMeshes, false);
    const activeHit = hits.find((hit) => hit.object.userData.stepIndex === state.current);
    if (!activeHit) return;

    if (state.selected) {
      placeCurrentPiece();
    } else {
      showToast("หยิบชิ้นส่วนจากถาดก่อนนะ");
      const next = tray.querySelector(`.piece[data-index="${state.current}"]`);
      if (next) {
        next.animate(
          [
            { transform: "translateY(0)" },
            { transform: "translateY(-4px)" },
            { transform: "translateY(0)" },
          ],
          { duration: 380, easing: "ease-out" }
        );
      }
    }
  }

  function onWheel(event) {
    event.preventDefault();
    ensureAudio();
    cameraState.desiredRadius = THREE.MathUtils.clamp(
      cameraState.desiredRadius + event.deltaY * 0.0048,
      7.2,
      17
    );
    cameraState.userZoomed = true;
  }

  function onCanvasKeyDown(event) {
    const key = event.key;
    if (key === "ArrowLeft") {
      cameraState.desiredTheta -= 0.14;
      event.preventDefault();
    } else if (key === "ArrowRight") {
      cameraState.desiredTheta += 0.14;
      event.preventDefault();
    } else if (key === "ArrowUp") {
      cameraState.desiredPhi = THREE.MathUtils.clamp(cameraState.desiredPhi - 0.08, 0.86, 1.42);
      event.preventDefault();
    } else if (key === "ArrowDown") {
      cameraState.desiredPhi = THREE.MathUtils.clamp(cameraState.desiredPhi + 0.08, 0.86, 1.42);
      event.preventDefault();
    } else if (key === "+" || key === "=") {
      cameraState.desiredRadius = THREE.MathUtils.clamp(cameraState.desiredRadius - 0.7, 7.2, 17);
      cameraState.userZoomed = true;
      event.preventDefault();
    } else if (key === "-" || key === "_") {
      cameraState.desiredRadius = THREE.MathUtils.clamp(cameraState.desiredRadius + 0.7, 7.2, 17);
      cameraState.userZoomed = true;
      event.preventDefault();
    } else if (key === "Enter" || key === " ") {
      if (state.selected) {
        placeCurrentPiece();
        event.preventDefault();
      }
    } else if (key === "Escape") {
      deselectPiece();
    }
  }

  /* ---------------------------------------------------------
     Game flow
     --------------------------------------------------------- */

  function activateStep() {
    markers.forEach((marker, index) => {
      marker.visible = index === state.current && !state.won;
    });
    ghostGroups.forEach((ghost) => {
      ghost.visible = false;
    });
  }

  function selectPiece(index) {
    if (state.won || state.transitioning) return;
    if (index !== state.current) return;
    if (state.selected) return;

    ensureAudio();
    startTimer();
    state.selected = true;
    markers.forEach((marker, markerIndex) => {
      marker.visible = markerIndex === state.current;
    });
    ghostGroups.forEach((ghost, ghostIndex) => {
      ghost.visible = ghostIndex === state.current;
    });
    updateHUD();
    sfxSelect();
    haptic(8);
  }

  function deselectPiece() {
    if (!state.selected) return;
    state.selected = false;
    ghostGroups.forEach((ghost) => { ghost.visible = false; });
    updateHUD();
  }

  function placeCurrentPiece() {
    if (!state.selected || state.transitioning || state.won) return;
    const index = state.current;
    const step = STEPS[index];
    state.selected = false;
    state.transitioning = true;

    const ghost = ghostGroups[index];
    if (ghost) ghost.visible = false;
    markers.forEach((marker) => { marker.visible = false; });
    if (index === 0) fadeBlueprint();

    burstAt(step.target, index === STEPS.length - 1 ? 52 : 28, index === STEPS.length - 1 ? 0xffe06a : step.color);
    if (index === STEPS.length - 1) sfxBloom();
    else sfxPlace();
    haptic(index === STEPS.length - 1 ? [18, 35, 18] : 16);

    revealPiece(index);

    state.current += 1;
    updateHUD();

    if (state.current >= STEPS.length) {
      stopTimer();
      window.clearTimeout(state.winTimer);
      state.winTimer = window.setTimeout(winGame, reducedMotion ? 350 : 2050);
      return;
    }

    window.clearTimeout(state.nextTimer);
    state.nextTimer = window.setTimeout(() => {
      state.transitioning = false;
      activateStep();
      updateHUD();
    }, reducedMotion ? 80 : 650);
  }

  function revealPiece(index) {
    const group = pieceGroups[index];
    group.visible = true;

    if (index === 0) {
      group.scale.set(1, 0.001, 1);
      tween(reducedMotion ? 0.01 : 0.72, 0, (p) => {
        const eased = easeOutBack(p);
        group.scale.y = Math.max(0.001, eased);
      });
    } else if (index === STEPS.length - 1) {
      petalRoots.forEach((petal) => petal.scale.set(0.001, 0.001, 0.001));
      const count = petalRoots.length;
      petalRoots.forEach((petal, petalIndex) => {
        const delay = reducedMotion ? 0 : 0.1 + (petalIndex / count) * 0.75;
        tween(0.5, delay, (p) => {
          const scale = easeOutBack(p);
          petal.scale.set(scale, scale, scale);
        });
      });
    } else {
      const base = group.userData.baseScale || 1;
      group.scale.setScalar(0.72 * base);
      tween(reducedMotion ? 0.01 : 0.5, 0, (p) => {
        group.scale.setScalar((0.72 + easeOutBack(p) * 0.28) * base);
      });
    }
  }

  function setVictoryCamera() {
    if (window.innerWidth < 1280) return;
    cameraTarget.y = 2.08;
    cameraState.desiredTheta = 0.3;
    cameraState.desiredPhi = 1.19;
    cameraState.desiredRadius = 12.1;
    cameraState.userZoomed = true;
  }

  function updateBestLine() {
    if (!bestText) return;
    const level = LEVELS[activeLevelIndex];
    const progress = getLevelProgress(level.id);
    if (progress.bestMs !== null) {
      const filled = Math.max(0, Math.min(3, progress.bestStars || 0));
      const stars = "★".repeat(filled) + "☆".repeat(3 - filled);
      bestText.textContent = `สถิติ ${formatTime(progress.bestMs)} · ${stars}`;
    } else {
      bestText.textContent = "ยังไม่มีสถิติ";
    }
  }

  function syncSoundButton() {
    soundBtn.classList.toggle("is-muted", !state.soundOn);
    soundBtn.setAttribute("aria-pressed", String(state.soundOn));
  }

  function showPhotoStatus(message) {
    if (!photoStatus) return;
    photoStatus.textContent = message;
    photoStatus.classList.add("is-visible");
    window.clearTimeout(photoStatusTimer);
    photoStatusTimer = window.setTimeout(() => {
      photoStatus.classList.remove("is-visible");
      photoStatusTimer = 0;
    }, 2200);
  }

  function enterPhotoMode() {
    if (!state.won || !photoBar) return;
    closeModal("victory", false);
    app.classList.add("is-photo");
    photoBar.classList.add("is-visible");
    photoBar.setAttribute("aria-hidden", "false");
    window.setTimeout(showDragHint, 450);
    photoBtn.setAttribute("aria-pressed", "true");
    showPhotoStatus("");
    haptic(10);
    window.setTimeout(() => photoExit?.focus({ preventScroll: true }), 120);
  }

  function exitPhotoMode({ silent = false } = {}) {
    if (!app.classList.contains("is-photo")) return;
    app.classList.remove("is-photo");
    photoBar?.classList.remove("is-visible");
    photoBar?.setAttribute("aria-hidden", "true");
    photoBtn.setAttribute("aria-pressed", "false");
    photoBtn.disabled = !state.won;
    if (!silent) {
      showToast("ออกจากโหมดถ่ายรูปแล้ว");
      photoBtn.focus({ preventScroll: true });
    }
  }

  function winGame() {
    if (state.won) return;
    state.won = true;
    state.transitioning = false;
    state.selected = false;
    setVictoryCamera();
    app.classList.add("is-victory", "is-done");
    const doneNext = document.getElementById("doneNext");
    if (doneNext) doneNext.textContent = activeLevelIndex < LEVELS.length - 1 ? "ด่านถัดไป" : "เลือกด่าน";
    if (blueprintGroup) blueprintGroup.visible = false;
    markers.forEach((marker) => { marker.visible = false; });
    ghostGroups.forEach((ghost) => { ghost.visible = false; });
    beeGroup.visible = beeAllowed();
    dropDome();
    updateHUD({ pop: false });
    sfxWin();

    const elapsed = state.elapsed || (state.startedAt ? performance.now() - state.startedAt : 0);
    winTime.textContent = formatTime(elapsed);
    const winPieces = document.getElementById("winPieces");
    if (winPieces) winPieces.textContent = `${STEPS.length} / ${STEPS.length}`;
    timerEl.textContent = formatTime(elapsed);
    if (mobileTimer) mobileTimer.textContent = formatTime(elapsed);

    const stars = elapsed <= 90000 ? 3 : elapsed <= 180000 ? 2 : 1;
    const level = LEVELS[activeLevelIndex];
    const progress = getLevelProgress(level.id);
    const previousBest = progress.bestMs;
    const isNewBest = previousBest === null || elapsed < previousBest;
    if (isNewBest) progress.bestMs = elapsed;
    if (stars > progress.bestStars) progress.bestStars = stars;
    progress.blooms += 1;
    save.levels[level.id] = progress;
    persistSave();
    updateBestLine();
    photoBtn.disabled = false;
    winBest.classList.toggle("is-new", isNewBest);
    if (isNewBest) {
      winBest.textContent = previousBest === null
        ? "สถิติใหม่! นี่คือครั้งแรกของด่านนี้"
        : `สถิติใหม่! เร็วกว่าเดิม ${formatTime(Math.max(0, previousBest - elapsed))}`;
    } else {
      winBest.textContent = `สถิติที่ดีที่สุด ${formatTime(progress.bestMs)} · ${"★".repeat(progress.bestStars)}`;
    }
    updateLevelCards();
    haptic([25, 45, 25, 45, 35]);

    winStars.setAttribute("aria-label", `คะแนน ${stars} ดาว`);
    winStars.querySelectorAll(".win-star").forEach((star, index) => {
      star.classList.remove("is-on");
      if (index < stars) {
        window.setTimeout(() => {
          star.classList.add("is-on");
          star.style.color = "#ffc72c";
          const path = star.querySelector("path");
          if (path) path.style.fill = "#ffc72c";
        }, 180 + index * 140);
      }
    });

    spawnConfetti();
    window.setTimeout(() => openModal("victory"), reducedMotion ? 60 : 420);
  }

  function resetGame() {
    window.clearTimeout(state.winTimer);
    window.clearTimeout(state.nextTimer);
    tweens.length = 0;
    exitPhotoMode({ silent: true });
    closeModal("victory", false);
    app.classList.remove("is-victory", "is-done");
    state.current = 0;
    state.selected = false;
    state.transitioning = false;
    state.won = false;
    state.lastInstruction = "";
    resetTimer();

    pieceGroups.forEach((group) => {
      group.visible = false;
      group.scale.setScalar(group.userData.baseScale || 1);
      group.rotation.z = 0;
    });
    ghostGroups.forEach((ghost) => { ghost.visible = false; });
    markers.forEach((marker) => { marker.visible = false; });
    if (blueprintGroup && blueprintMaterial) {
      blueprintGroup.visible = true;
      blueprintMaterial.opacity = 0.24;
    }
    petalRoots.forEach((petal) => petal.scale.set(1, 1, 1));
    stemGroup.scale.set(1, 1, 1);
    leafSway.forEach(({ group, baseZ }) => { group.rotation.z = baseZ; });
    centerGroup.rotation.z = 0;
    petalGroup.rotation.z = 0;
    beeGroup.visible = false;
    hideDome();
    particleLife = 0;
    particleSystem.visible = false;
    particleSystem.geometry.setDrawRange(0, 0);
    confetti.innerHTML = "";
    winBest.textContent = "";
    winBest.classList.remove("is-new");
    photoBtn.disabled = true;
    photoBtn.setAttribute("aria-pressed", "false");
    winStars.querySelectorAll(".win-star").forEach((star) => {
      star.classList.remove("is-on");
      star.style.color = "";
      const path = star.querySelector("path");
      if (path) path.style.fill = "";
    });
    resetCamera();
    activateStep();
    updateHUD({ pop: false });
    showToast("เริ่มใหม่แล้ว — ค่อย ๆ ต่อทีละชิ้น");
  }

  /* ---------------------------------------------------------
     Pieces animation / particles / modal
     --------------------------------------------------------- */

  function easeOutBack(p) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
  }

  function tween(duration, delay, update, complete) {
    tweens.push({ elapsed: -delay, duration, update, complete });
  }

  function updateTweens(dt) {
    for (let i = tweens.length - 1; i >= 0; i -= 1) {
      const item = tweens[i];
      item.elapsed += dt;
      if (item.elapsed < 0) continue;
      const p = Math.min(item.elapsed / Math.max(item.duration, 0.0001), 1);
      item.update(p);
      if (p >= 1) {
        item.complete?.();
        tweens.splice(i, 1);
      }
    }
  }

  function burstAt(target, count = 28, color = 0xffd45a) {
    if (!particleSystem || reducedMotion) return;
    const { positions, velocities } = particleData;
    particleSystem.material.color.setHex(color);
    particleSystem.material.opacity = 1;
    particleSystem.visible = true;
    particleOrigin.set(target[0], target[1], target[2]);

    for (let i = 0; i < particleData.count; i += 1) {
      const active = i < count;
      positions[i * 3] = target[0];
      positions[i * 3 + 1] = target[1];
      positions[i * 3 + 2] = target[2];
      if (active) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.55 + Math.random() * 1.25;
        velocities[i].set(
          Math.cos(angle) * speed * 0.65,
          0.55 + Math.random() * 1.5,
          Math.sin(angle) * speed * 0.65
        );
      } else {
        velocities[i].set(0, 0, 0);
      }
    }
    particleData.activeCount = count;
    particleSystem.geometry.setDrawRange(0, count);
    particleSystem.geometry.attributes.position.needsUpdate = true;
    particleLife = 1.35;
  }

  function updateParticles(dt) {
    if (!particleSystem || particleLife <= 0) return;
    particleLife -= dt;
    const { positions, velocities, count } = particleData;
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] += velocities[i].x * dt;
      positions[i * 3 + 1] += velocities[i].y * dt;
      positions[i * 3 + 2] += velocities[i].z * dt;
      velocities[i].y -= 1.4 * dt;
      velocities[i].multiplyScalar(0.986);
    }
    particleSystem.geometry.attributes.position.needsUpdate = true;
    particleSystem.material.opacity = Math.max(0, particleLife / 1.35);
    if (particleLife <= 0) particleSystem.visible = false;
    void particleOrigin;
  }

  function spawnConfetti() {
    if (!confetti) return;
    confetti.innerHTML = "";
    if (reducedMotion) return;
    const palette = ["#ffc72c", "#ffd45a", "#f29b1f", "#63b45c", "#f7e5b9", "#7a4b2c"];
    for (let i = 0; i < 42; i += 1) {
      const piece = document.createElement("i");
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.setProperty("--c", palette[i % palette.length]);
      piece.style.setProperty("--dur", `${2.6 + Math.random() * 2.4}s`);
      piece.style.setProperty("--delay", `${Math.random() * 0.8}s`);
      piece.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
      piece.style.width = `${6 + Math.random() * 7}px`;
      piece.style.height = `${8 + Math.random() * 9}px`;
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      confetti.appendChild(piece);
    }
  }

  function openModal(name) {
    const modal = name === "help" ? helpModal : name === "levels" ? levelsModal : victoryModal;
    if (!modal) return;
    if (name === "levels") {
      updateLevelCards();
      levelBtn.setAttribute("aria-expanded", "true");
    }
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    if (name === "victory") app.classList.add("is-victory");
    app.inert = true;
    const focusTarget = name === "levels"
      ? modal.querySelector(".level-card.is-active") || modal.querySelector(".modal__close")
      : modal.querySelector(".modal__close, .btn, .save-link");
    window.setTimeout(() => focusTarget?.focus({ preventScroll: true }), 80);
  }

  function closeModal(name, restoreFocus = true) {
    const modal = name === "help" ? helpModal : name === "levels" ? levelsModal : victoryModal;
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    if (name === "victory") app.classList.remove("is-victory");
    if (name === "victory" && state.won && restoreFocus) window.setTimeout(showDragHint, 300);
    if (name === "levels") levelBtn.setAttribute("aria-expanded", "false");

    let firstHelp = false;
    if (name === "help" && !save.tutorialSeen) {
      save.tutorialSeen = true;
      persistSave();
      firstHelp = true;
    }
    // Opening flow: How to play -> Choose level -> hint to pick the first piece.
    if (name === "help" && startupStep === "help") {
      startupStep = "levels";
      firstHelp = false;
      window.setTimeout(() => openModal("levels"), 220);
    } else if (name === "levels" && startupStep === "levels") {
      startupStep = "";
      window.setTimeout(() => {
        if (!state.won && !state.selected) showToast(`เลือก${STEPS[0].th}จากถาด แล้วแตะจุดเรืองแสง`);
      }, 400);
    }

    app.inert = false;
    if (restoreFocus) {
      const target = name === "help"
        ? $("#helpBtn")
        : name === "levels"
          ? (window.innerWidth < 760 ? mobileLevelBtn : levelBtn)
          : $("#resetBtn");
      target?.focus({ preventScroll: true });
    }
    if (firstHelp) {
      window.setTimeout(() => {
        if (!state.won && !state.selected) showToast("เลือกชิ้นส่วนจากถาด แล้วแตะจุดเรืองแสง");
      }, 260);
    }
  }

  function drawWatermark(ctx, width, height) {
    const size = Math.round(Math.max(16, Math.min(width, height) * 0.032));
    ctx.save();
    ctx.font = `italic ${size}px ${WATERMARK_FONT}`;
    ctx.textBaseline = "top";
    const x = Math.round(width * 0.035);
    const y = Math.round(height * 0.035);
    if (isNight) {
      ctx.shadowColor = "rgba(255, 196, 120, 0.9)";
      ctx.shadowBlur = size * 0.45;
      ctx.fillStyle = "#fff3d6";
    } else {
      ctx.shadowColor = "rgba(255, 252, 240, 0.95)";
      ctx.shadowBlur = size * 0.35;
      ctx.fillStyle = "#5a3a1e";
    }
    ctx.fillText(WATERMARK_TEXT, x, y);
    ctx.shadowBlur = 0;
    ctx.fillText(WATERMARK_TEXT, x, y);
    ctx.restore();
  }

  function saveBloom() {
    if (!renderer || !scene || !camera) return;
    const previousBackground = scene.background;

    const sky = document.createElement("canvas");
    sky.width = 16;
    sky.height = 512;
    const ctx = sky.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, sky.height);
    const stops = isNight
      ? ["#0d1736", "#1b2a5a", "#3a3b72", "#5d4a78"]
      : ["#a6dce8", "#d5ebe0", "#f5e6bd", "#f2d69b"];
    gradient.addColorStop(0, stops[0]);
    gradient.addColorStop(0.45, stops[1]);
    gradient.addColorStop(0.7, stops[2]);
    gradient.addColorStop(1, stops[3]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, sky.width, sky.height);
    const texture = new THREE.CanvasTexture(sky);
    texture.colorSpace = THREE.SRGBColorSpace;
    scene.background = texture;
    renderer.render(scene, camera);

    // Copy the 3D picture onto a 2D canvas and sign it in the top-left corner.
    const shot = document.createElement("canvas");
    shot.width = renderer.domElement.width;
    shot.height = renderer.domElement.height;
    const sctx = shot.getContext("2d");
    sctx.drawImage(renderer.domElement, 0, 0);
    drawWatermark(sctx, shot.width, shot.height);
    const dataURL = shot.toDataURL("image/png");
    const fileName = `pineapple-${LEVELS[activeLevelIndex].id}${isNight ? "-night" : ""}-${Date.now()}.png`;

    scene.background = previousBackground;
    texture.dispose();

    // Phones: a plain download goes to Files/Downloads (or is blocked in LINE /
    // Facebook browsers). Use the share menu ("Save image" -> Photos) when the
    // browser supports it, otherwise show the photo to long-press and save.
    const isPhone = window.matchMedia("(pointer: coarse)").matches;
    if (isPhone) {
      const file = dataURLToFile(dataURL, fileName);
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: "Pineapple Lego" })
          .then(() => showPhotoStatus("บันทึกรูปแล้ว ✓"))
          .catch((error) => { if (error && error.name !== "AbortError") openSaveSheet(dataURL); });
        return "share";
      }
      openSaveSheet(dataURL);
      return "preview";
    }

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    return "download";
  }

  function dataURLToFile(dataURL, name) {
    try {
      const [head, body] = dataURL.split(",");
      const mime = (head.match(/data:(.*?);/) || [])[1] || "image/png";
      const bin = atob(body);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
      return new File([bytes], name, { type: mime });
    } catch (error) {
      return null;
    }
  }

  function openSaveSheet(dataURL) {
    const sheet = document.getElementById("saveSheet");
    const img = document.getElementById("saveSheetImg");
    if (!sheet || !img) return;
    img.src = dataURL;
    sheet.classList.add("is-open");
    sheet.setAttribute("aria-hidden", "false");
    window.setTimeout(() => document.getElementById("saveSheetClose")?.focus({ preventScroll: true }), 80);
  }

  function closeSaveSheet() {
    const sheet = document.getElementById("saveSheet");
    if (!sheet) return;
    sheet.classList.remove("is-open");
    sheet.setAttribute("aria-hidden", "true");
  }

  /* ---------------------------------------------------------
     Render loop
     --------------------------------------------------------- */

  function animate() {
    window.requestAnimationFrame(animate);
    if (!renderer || !scene || !camera) return;

    const dt = Math.min(clock?.getDelta() || 0.016, 0.05);
    const time = performance.now() * 0.001;

    updateCamera(dt);
    updateTweens(dt);
    updateParticles(dt);
    updateAmbientPollen(dt, time);
    updateNightLights(time);

    // Gentle marker pulse — it keeps the next placement legible.
    markers.forEach((marker) => {
      if (!marker.visible) return;
      const ring = marker.userData.ring;
      const glow = marker.userData.glow;
      const pulse = 1 + Math.sin(time * 2.6 + marker.userData.phase) * 0.065;
      ring.scale.setScalar(marker.userData.baseScale * pulse);
      glow.scale.setScalar(marker.userData.baseScale * 2.4 * (1 + Math.sin(time * 2.6 + marker.userData.phase) * 0.08));
      ring.material.opacity = 0.78 + Math.sin(time * 2.6 + marker.userData.phase) * 0.14;
      glow.material.opacity = 0.26 + Math.sin(time * 2.6 + marker.userData.phase) * 0.07;
      const label = marker.userData.label;
      if (label) {
        const bob = Math.sin(time * 2.1 + marker.userData.phase) * 0.022;
        label.position.y = bob;
        label.position.z = 0.04;
      }
    });

    if (state.won && !reducedMotion) {
      const sway = Math.sin(time * 0.72) * 0.018;
      headSwayGroups.forEach((group) => { group.rotation.z = sway; });
      leafSway.forEach(({ group, baseZ, amp, phase }) => {
        group.rotation.z = baseZ + Math.sin(time * 0.62 + phase) * amp;
      });
    }

    if (beeGroup?.visible) {
      const angle = time * 0.62;
      const radius = 2.55;
      beeGroup.position.set(
        Math.cos(angle) * radius,
        3.52 + Math.sin(time * 1.7) * 0.18,
        Math.sin(angle) * radius
      );
      beeGroup.rotation.y = -angle + Math.PI / 2;
      beeGroup.rotation.z = Math.sin(time * 7.4) * 0.06;
      const wings = beeGroup.userData.wings || [];
      wings.forEach((wing, index) => {
        wing.rotation.y = Math.sin(time * 25 + index * Math.PI) * 0.65;
      });
    }

    renderer.render(scene, camera);
  }

  /* ---------------------------------------------------------
     Fallback / events / boot
     --------------------------------------------------------- */

  function showFallback() {
    if (fallback) fallback.hidden = false;
    if (loader) loader.style.display = "none";
    if (renderer) renderer.dispose();
  }

  /* ---------------------------------------------------------
     Drag hint (shown after finishing a flower)
     --------------------------------------------------------- */

  // `var` so these exist even if a level change calls hideDragHint() before this line runs.
  var dragHint = document.getElementById("dragHint");
  var dragHintTimer = 0;
  function showDragHint() {
    if (!dragHint) return;
    const text = dragHint.querySelector(".drag-hint__text");
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (text) text.textContent = touch ? "ลากเพื่อหมุนดูรอบ ๆ · ถ่างนิ้วเพื่อซูม" : "ลากเพื่อหมุนดูรอบ ๆ · เลื่อนลูกกลิ้งเพื่อซูม";
    dragHint.classList.add("is-visible");
    window.clearTimeout(dragHintTimer);
    dragHintTimer = window.setTimeout(hideDragHint, 4200);
  }
  function hideDragHint() {
    window.clearTimeout(dragHintTimer);
    dragHint?.classList.remove("is-visible");
  }

  $("#helpBtn").addEventListener("click", () => openModal("help"));
  $("#themeBtn").addEventListener("click", toggleTheme);
  $("#xmasBtn").addEventListener("click", toggleXmas);
  $("#introNight").addEventListener("click", toggleTheme);

  // Settings menu (gear button): night, Christmas, sound and language switches.
  const settingsBtn = $("#settingsBtn");
  const settingsMenu = $("#settingsMenu");
  function setSettingsOpen(open) {
    settingsMenu.hidden = !open;
    settingsBtn.setAttribute("aria-expanded", String(open));
  }
  settingsBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    setSettingsOpen(settingsMenu.hidden);
  });
  document.addEventListener("click", (event) => {
    if (!settingsMenu.hidden && !event.target.closest(".settings")) setSettingsOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !settingsMenu.hidden) {
      setSettingsOpen(false);
      settingsBtn.focus();
    }
  });
  $("#introXmas").addEventListener("click", toggleXmas);

  // Title screen
  const intro = document.getElementById("intro");
  const introArt = document.getElementById("introArt");
  // Home screen shows the game logo (with a Santa hat in the Christmas theme).
  if (introArt) {
    introArt.innerHTML = `<img src="logo.svg" alt="">${document.querySelector(".brand__hat")?.outerHTML || ""}`;
  }
  $("#introStart").addEventListener("click", () => {
    ensureAudio();
    intro.classList.add("is-leaving");
    window.setTimeout(() => intro.classList.add("is-hidden"), 460);
    // Go straight to choosing a level; "How to play" only opens from the ? button.
    startupStep = "levels";
    window.setTimeout(() => {
      if (!levelsModal.classList.contains("is-open")) openModal("levels");
    }, 260);
  });
  window.setTimeout(() => $("#introStart")?.focus({ preventScroll: true }), 120);

  // Brand button (top left) goes back to the title screen.
  function showIntro() {
    startupStep = "intro"; // set first, so closing a dialog doesn't continue the opening flow
    ["help", "levels", "victory"].forEach((name) => {
      const modal = name === "help" ? helpModal : name === "levels" ? levelsModal : victoryModal;
      if (modal?.classList.contains("is-open")) closeModal(name, false);
    });
    exitPhotoMode({ silent: true });
    intro.classList.remove("is-hidden");
    void intro.offsetWidth; // let the fade-in play from hidden
    intro.classList.remove("is-leaving");
    window.setTimeout(() => $("#introStart")?.focus({ preventScroll: true }), 120);
  }
  $(".brand").addEventListener("click", (event) => {
    event.preventDefault();
    showIntro();
  });
  $("#photoTheme").addEventListener("click", toggleTheme);
  const photoWatermark = document.getElementById("photoWatermark");
  if (photoWatermark) photoWatermark.textContent = WATERMARK_TEXT;
  app.classList.toggle("is-night", isNight); // set before WebGL is ready, so the sky is right immediately
  levelBtn.addEventListener("click", () => openModal("levels"));
  mobileLevelBtn.addEventListener("click", () => openModal("levels"));
  nextLevel.addEventListener("click", () => {
    activateLevel(activeLevelIndex + 1);
  });
  $("#resetBtn").addEventListener("click", () => {
    ensureAudio();
    resetGame();
  });
  $("#playAgain").addEventListener("click", () => {
    resetGame();
  });
  $("#keepLooking").addEventListener("click", enterPhotoMode);
  $("#doneNext").addEventListener("click", () => {
    if (activeLevelIndex < LEVELS.length - 1) activateLevel(activeLevelIndex + 1);
    else openModal("levels");
  });
  $("#donePhoto").addEventListener("click", enterPhotoMode);
  $("#doneReplay").addEventListener("click", () => resetGame());
  $("#saveBtn").addEventListener("click", saveBloom);
  photoBtn.addEventListener("click", enterPhotoMode);
  photoExit.addEventListener("click", () => exitPhotoMode());
  photoSave.addEventListener("click", () => {
    const mode = saveBloom();
    if (mode === "download") showPhotoStatus("บันทึกรูปแล้ว ✓");
    haptic(12);
  });
  $("#saveSheetClose").addEventListener("click", closeSaveSheet);
  $("#saveSheet").addEventListener("click", (event) => {
    if (event.target.id === "saveSheet") closeSaveSheet();
  });

  soundBtn.addEventListener("click", () => {
    state.soundOn = !state.soundOn;
    save.soundOn = state.soundOn;
    persistSave();
    syncSoundButton();
    if (state.soundOn) {
      ensureAudio();
      sfxSelect();
      showToast("เปิดเสียงแล้ว");
    } else {
      showToast("ปิดเสียงแล้ว");
    }
  });

  document.querySelectorAll("[data-close]").forEach((element) => {
    element.addEventListener("click", () => closeModal(element.dataset.close));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (app.classList.contains("is-photo")) {
      exitPhotoMode();
    } else if (victoryModal.classList.contains("is-open")) {
      closeModal("victory");
    } else if (levelsModal.classList.contains("is-open")) {
      closeModal("levels");
    } else if (helpModal.classList.contains("is-open")) {
      closeModal("help");
    }
  });

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || drag.active || !camera) return;
    screenToPointer(event);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(hitMeshes, false);
    const overTarget = hits.some((hit) => hit.object.userData.stepIndex === state.current);
    canvas.classList.toggle("is-target-hover", overTarget);
  }, { passive: true });
  canvas.addEventListener("pointerleave", () => canvas.classList.remove("is-target-hover"));
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerCancel);
  canvas.addEventListener("wheel", onWheel, { passive: false });
  canvas.addEventListener("keydown", onCanvasKeyDown);
  canvas.addEventListener("contextmenu", (event) => event.preventDefault());

  tray.addEventListener("keydown", (event) => {
    if (!state.selected || (event.key !== "Enter" && event.key !== " ")) return;
    const piece = event.target.closest(".piece");
    if (piece && Number(piece.dataset.index) === state.current) {
      event.preventDefault();
      placeCurrentPiece();
    }
  });

  /* ---------------------------------------------------------
     Drag a piece from the tray straight onto its glowing spot.
     Tap piece -> tap spot still works the same as before.
     --------------------------------------------------------- */
  const pieceDrag = { index: -1, pointerId: null, startX: 0, startY: 0, active: false, ghost: null, source: null };

  // True when (clientX, clientY) is on the current glowing spot, or close enough to it.
  function isOverCurrentTarget(clientX, clientY) {
    if (!camera || state.current >= STEPS.length) return false;
    const rect = canvas.getBoundingClientRect();
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return false;
    screenToPointer({ clientX, clientY });
    raycaster.setFromCamera(pointer, camera);
    if (raycaster.intersectObjects(hitMeshes, false).some((hit) => hit.object.userData.stepIndex === state.current)) return true;
    // Forgiving drop: near the spot on screen counts too (small fingers, small screens).
    const p = new THREE.Vector3(...STEPS[state.current].target).project(camera);
    const sx = rect.left + ((p.x + 1) / 2) * rect.width;
    const sy = rect.top + ((1 - p.y) / 2) * rect.height;
    return Math.hypot(clientX - sx, clientY - sy) < Math.max(52, rect.width * 0.05);
  }

  function endPieceDrag() {
    if (pieceDrag.ghost) pieceDrag.ghost.remove();
    app.classList.remove("is-dragging-piece");
    canvas.classList.remove("is-target-hover");
    pieceDrag.index = -1;
    pieceDrag.pointerId = null;
    pieceDrag.active = false;
    pieceDrag.ghost = null;
    pieceDrag.source = null;
  }

  tray.addEventListener("pointerdown", (event) => {
    const piece = event.target.closest(".piece");
    if (!piece || piece.disabled || event.button > 0) return;
    const index = Number(piece.dataset.index);
    if (index !== state.current || state.won || state.transitioning) return;
    pieceDrag.index = index;
    pieceDrag.pointerId = event.pointerId;
    pieceDrag.startX = event.clientX;
    pieceDrag.startY = event.clientY;
    pieceDrag.source = piece;
  });

  window.addEventListener("pointermove", (event) => {
    if (pieceDrag.index < 0 || event.pointerId !== pieceDrag.pointerId) return;
    if (!pieceDrag.active) {
      if (Math.hypot(event.clientX - pieceDrag.startX, event.clientY - pieceDrag.startY) < 10) return;
      pieceDrag.active = true;
      selectPiece(pieceDrag.index); // shows the glowing spot and the ghost preview
      const ghost = document.createElement("div");
      ghost.className = "drag-ghost";
      const icon = pieceDrag.source.querySelector(".brick-icon");
      if (icon) ghost.appendChild(icon.cloneNode(true));
      document.body.appendChild(ghost);
      pieceDrag.ghost = ghost;
      app.classList.add("is-dragging-piece");
    }
    pieceDrag.ghost.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    const over = isOverCurrentTarget(event.clientX, event.clientY);
    pieceDrag.ghost.classList.toggle("is-over", over);
    canvas.classList.toggle("is-target-hover", over);
  });

  window.addEventListener("pointerup", (event) => {
    if (pieceDrag.index < 0 || event.pointerId !== pieceDrag.pointerId) return;
    const dropped = pieceDrag.active;
    const over = dropped && isOverCurrentTarget(event.clientX, event.clientY);
    endPieceDrag();
    if (!dropped) return; // a plain tap: the click handler selects the piece as before
    if (over) placeCurrentPiece();
    else showToast("ลากไปวางที่จุดเรืองแสงนะ"); // piece stays picked, so a tap on the spot still works
  });
  window.addEventListener("pointercancel", (event) => {
    if (event.pointerId === pieceDrag.pointerId) endPieceDrag();
  });

  renderStepList();
  renderTray();
  syncSoundButton();
  updateBestLine();
  updateHUD({ pop: false });
  resetTimer();
  resetCamera();

  const initialized = initScene();
  if (initialized) {
    // Every time the game opens: title screen -> Choose level (How to play is on the ? button).
    startupStep = "intro";
  }

  // While developing (this computer or a phone on the same Wi-Fi), skip the offline cache so edits show up on refresh.
  const isLocalDev = /^(localhost|127\.0\.0\.1|\[::1\]|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)$/.test(window.location.hostname);
  if ("serviceWorker" in navigator && isLocalDev) {
    navigator.serviceWorker.getRegistrations().then((list) => list.forEach((r) => r.unregister())).catch(() => {});
  }

  if ("serviceWorker" in navigator && !isLocalDev && /^https?:$/.test(window.location.protocol)) {
    const registerServiceWorker = () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    };
    if (document.readyState === "complete") registerServiceWorker();
    else window.addEventListener("load", registerServiceWorker, { once: true });
  }

})();
