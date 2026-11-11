/* Pineapple i18n: Thai (original) / English / Lao.
   Translates the DOM by looking up the original Thai text, so game.js needs no changes. */
(function () {
  "use strict";
  const D = {
    "Pineapple Lego — เกมต่อดอกไม้ 3 มิติจากบล็อกเลโก้ 5 ด่าน": ["Pineapple Lego — a 3D flower-building game with LEGO-style bricks, 5 levels", "Pineapple Lego — ເກມຕໍ່ດອກໄມ້ 3 ມິຕິຈາກບລັອກເລໂກ້ 5 ດ່ານ"],
    "Pineapple Lego — เกมต่อดอกไม้ 3D": ["Pineapple Lego — 3D Flower Builder", "Pineapple Lego — ເກມຕໍ່ດອກໄມ້ 3D"],
    "Pineapple Lego หน้าหลัก": ["Pineapple Lego home", "ໜ້າຫຼັກ Pineapple Lego"],
    "บิลด์แล็บ": ["Build Lab", "ບິວແລັບ"],
    "เลือกด่าน": ["Choose level", "ເລືອກດ່ານ"],
    "ทานตะวัน": ["Sunflower", "ດອກຕາເວັນ"],
    "ทิวลิป": ["Tulip", "ທິວລິບ"],
    "เดซี่": ["Daisy", "ເດຊີ່"],
    "กุหลาบ": ["Rose", "ກຸຫຼາບ"],
    "เริ่มต้น": ["Beginner", "ເລີ່ມຕົ້ນ"],
    "ง่าย": ["Easy", "ງ່າຍ"],
    "ท้าทาย": ["Challenging", "ທ້າທາຍ"],
    "ปิดเสียง": ["Mute", "ປິດສຽງ"],
    "เปิดเสียง": ["Unmute", "ເປີດສຽງ"],
    "เปิด/ปิดเสียง": ["Sound on/off", "ເປີດ/ປິດສຽງ"],
    "โหมดถ่ายรูป": ["Photo mode", "ໂໝດຖ່າຍຮູບ"],
    "โหมดถ่ายรูป (หลังต่อเสร็จ)": ["Photo mode (after building)", "ໂໝດຖ່າຍຮູບ (ຫຼັງຕໍ່ແລ້ວ)"],
    "วิธีเล่น": ["How to play", "ວິທີຫຼິ້ນ"],
    "เริ่มใหม่": ["Restart", "ເລີ່ມໃໝ່"],
    "พื้นที่ต่อดอกไม้ 3 มิติ ลากเพื่อหมุน แตะจุดเรืองแสงเพื่อวางชิ้นส่วน": ["3D building area. Drag to rotate, tap the glowing spot to place a piece", "ພື້ນທີ່ຕໍ່ດອກໄມ້ 3 ມິຕິ ລາກເພື່ອໝູນ ແຕະຈຸດເຮືອງແສງເພື່ອວາງຊິ້ນສ່ວນ"],
    "กำลังเตรียมบล็อก…": ["Preparing bricks…", "ກຳລັງກຽມບລັອກ…"],
    "เบราว์เซอร์นี้ยังไม่รองรับ WebGL": ["This browser doesn't support WebGL", "ບຼາວເຊີນີ້ຍັງບໍ່ຮອງຮັບ WebGL"],
    "ลองเปิดด้วย Chrome, Safari หรือ Edge เวอร์ชันใหม่เพื่อเล่นฉาก 3 มิติ": ["Try a recent Chrome, Safari or Edge to play the 3D scene", "ລອງເປີດດ້ວຍ Chrome, Safari ຫຼື Edge ເວີຊັນໃໝ່ເພື່ອຫຼິ້ນສາກ 3 ມິຕິ"],
    "ลำดับการต่อ": ["Build steps", "ລຳດັບການຕໍ່"],
    "ต่อทีละชิ้น ให้ดอกบาน": ["Build piece by piece to make it bloom", "ຕໍ່ເທື່ອລະຊິ້ນ ໃຫ້ດອກໄມ້ບານ"],
    "ดอกของคุณ": ["Your flower", "ດອກໄມ້ຂອງເຈົ້າ"],
    "เวลา": ["Time", "ເວລາ"],
    "ยังไม่มีสถิติ": ["No record yet", "ຍັງບໍ່ມີສະຖິຕິ"],
    "ลากเพื่อหมุน · สกรอลล์เพื่อซูม": ["Drag to rotate · scroll to zoom", "ລາກເພື່ອໝູນ · ເລື່ອນເພື່ອຊູມ"],
    "ความคืบหน้าและเลือกด่าน": ["Progress and level select", "ຄວາມຄືບໜ້າ ແລະ ເລືອກດ່ານ"],
    "ครบ": ["Done", "ຄົບ"],
    "แล้วแตะจุดเรืองแสงบนฐาน": ["then tap the glowing spot on the base", "ແລ້ວແຕະຈຸດເຮືອງແສງເທິງຖານ"],
    "แล้วแตะจุดเรืองแสงบนโมเดล": ["then tap the glowing spot on the model", "ແລ້ວແຕະຈຸດເຮືອງແສງເທິງໂມເດວ"],
    "ชิ้นส่วน": ["Pieces", "ຊິ້ນສ່ວນ"],
    "ออกจากโหมดถ่ายรูป": ["Exit photo mode", "ອອກຈາກໂໝດຖ່າຍຮູບ"],
    "บันทึกรูป": ["Save photo", "ບັນທຶກຮູບ"],
    "ปิดวิธีเล่น": ["Close how to play", "ປິດວິທີຫຼິ້ນ"],
    "ต่อดอกไม้ 3 มิติ": ["Build a 3D flower", "ຕໍ່ດອກໄມ້ 3 ມິຕິ"],
    "หยิบบล็อกไปวางให้ตรงจุด แล้วดูดอกไม้แต่ละด่านค่อย ๆ บานทีละกลีบ": ["Place each brick on its spot and watch every flower bloom petal by petal", "ເອົາບລັອກໄປວາງໃຫ້ຖືກຈຸດ ແລ້ວເບິ່ງດອກໄມ້ແຕ່ລະດ່ານຄ່ອຍໆບານເທື່ອລະກີບ"],
    "เลือกชิ้นส่วน": ["Pick a piece", "ເລືອກຊິ້ນສ່ວນ"],
    "กดชิ้นส่วนที่สว่างอยู่ในถาดด้านล่าง": ["Tap the lit piece in the tray below", "ກົດຊິ້ນສ່ວນທີ່ສະຫວ່າງຢູ່ໃນຖາດດ້ານລຸ່ມ"],
    "แตะจุดเรืองแสง": ["Tap the glowing spot", "ແຕະຈຸດເຮືອງແສງ"],
    "วางบล็อกให้เข้าล็อก แล้วชิ้นถัดไปจะปลดล็อก": ["Snap the brick in and the next piece unlocks", "ວາງບລັອກໃຫ້ເຂົ້າລັອກ ແລ້ວຊິ້ນຕໍ່ໄປຈະປົດລັອກ"],
    "หมุนดูรอบ ๆ": ["Look around", "ໝູນເບິ່ງອ້ອມໆ"],
    "ลากฉากเพื่อหมุน ม้วนหรือหุบนิ้วเพื่อซูม": ["Drag the scene to rotate; scroll or pinch to zoom", "ລາກສາກເພື່ອໝູນ ເລື່ອນ ຫຼື ຫຍິກນິ້ວເພື່ອຊູມ"],
    "เริ่มสร้างเลย": ["Start building", "ເລີ່ມສ້າງເລີຍ"],
    "ปิดหน้าเลือกด่าน": ["Close level select", "ປິດໜ້າເລືອກດ່ານ"],
    "สี่ดอก สี่บรรยากาศ ต่อให้ครบแล้วเก็บสถิติที่ดีที่สุดของแต่ละด่าน": ["Four flowers, four moods. Finish them all and keep your best record for each level", "ສີ່ດອກ ສີ່ບັນຍາກາດ ຕໍ່ໃຫ້ຄົບ ແລ້ວເກັບສະຖິຕິທີ່ດີທີ່ສຸດຂອງແຕ່ລະດ່ານ"],
    "ต่อครบทุกชิ้นแล้ว เก็บภาพดอกไม้ของคุณไว้ดูได้เลย": ["All pieces placed. Save a picture of your flower!", "ຕໍ່ຄົບທຸກຊິ້ນແລ້ວ ເກັບຮູບດອກໄມ້ຂອງເຈົ້າໄວ້ເບິ່ງໄດ້ເລີຍ"],
    "ด่านถัดไป": ["Next level", "ດ່ານຕໍ່ໄປ"],
    "สร้างอีกครั้ง": ["Build again", "ສ້າງອີກຄັ້ງ"],
    "บันทึกรูปดอกไม้": ["Save flower photo", "ບັນທຶກຮູບດອກໄມ້"],
    "เกมนี้ต้องเปิดใช้งาน JavaScript": ["This game needs JavaScript enabled", "ເກມນີ້ຕ້ອງເປີດໃຊ້ JavaScript"],
    "ก้าน": ["Stem", "ກ້ານ"],
    "ใบอ่อน": ["Young leaves", "ໃບອ່ອນ"],
    "กลีบเลี้ยง": ["Sepals", "ກີບລ້ຽງ"],
    "กลีบใน": ["Inner petals", "ກີບໃນ"],
    "กลีบนอก": ["Outer petals", "ກີບນອກ"],
    "หนีบใบใหญ่ใบแรกเข้ากับก้าน": ["Clip the first big leaf onto the stem", "ໜີບໃບໃຫຍ່ໃບທຳອິດເຂົ້າກັບກ້ານ"],
    "เพิ่มใบใหญ่อีกข้าง": ["Add the other big leaf", "ເພີ່ມໃບໃຫຍ່ອີກຂ້າງ"],
    "ติดใบอ่อนคู่ใต้ดอก": ["Attach the young leaf pair under the flower", "ຕິດໃບອ່ອນຄູ່ກ້ອງດອກ"],
    "เพิ่มใบอ่อนคู่บนก้าน": ["Add the young leaf pair on the stem", "ເພີ່ມໃບອ່ອນຄູ່ເທິງກ້ານ"],
    "วางกลีบเลี้ยงสีเขียวรองดอก": ["Place the green sepals behind the flower", "ວາງກີບລ້ຽງສີຂຽວຮອງດອກ"],
    "ใบครบแล้ว วางกลีบเลี้ยงรองดอก": ["Leaves done, place the sepals", "ໃບຄົບແລ້ວ ວາງກີບລ້ຽງຮອງດອກ"],
    "ประกอบเกสรหลายชั้น": ["Build the layered core", "ປະກອບເກສອນຫຼາຍຊັ້ນ"],
    "เติมกลีบสีส้มชั้นใน": ["Add the orange inner petals", "ເຕີມກີບສີສົ້ມຊັ້ນໃນ"],
    "เกสรพร้อม เติมกลีบชั้นใน": ["Core ready, add the inner petals", "ເກສອນພ້ອມ ເຕີມກີບຊັ້ນໃນ"],
    "เปิดกลีบชั้นนอกให้บาน": ["Open the outer petals to bloom", "ເປີດກີບຊັ້ນນອກໃຫ້ບານ"],
    "เกือบเสร็จ เปิดกลีบนอกให้บาน": ["Almost done, open the outer petals", "ເກືອບແລ້ວ ເປີດກີບນອກໃຫ້ບານ"],
    "ใบหน้า": ["Front leaf", "ໃບໜ້າ"],
    "ฐานดอก": ["Flower base", "ຖານດອກ"],
    "หนีบใบยาวโค้งใบแรก": ["Clip on the first long arching leaf", "ໜີບໃບຍາວໂຄ້ງໃບທຳອິດ"],
    "เพิ่มใบยาวอีกข้าง": ["Add the other long leaf", "ເພີ່ມໃບຍາວອີກຂ້າງ"],
    "ติดใบสั้นด้านหน้า": ["Attach the short front leaf", "ຕິດໃບສັ້ນດ້ານໜ້າ"],
    "เพิ่มใบสั้นด้านหน้า": ["Add the short front leaf", "ເພີ່ມໃບສັ້ນດ້ານໜ້າ"],
    "วางฐานรองดอกสีเขียว": ["Place the green flower base", "ວາງຖານຮອງດອກສີຂຽວ"],
    "ใบครบแล้ว วางฐานรองดอก": ["Leaves done, place the flower base", "ໃບຄົບແລ້ວ ວາງຖານຮອງດອກ"],
    "วางเกสรกับก้านเกสร": ["Place the pistil and stamens", "ວາງເກສອນ ແລະ ກ້ານເກສອນ"],
    "ประกบกลีบชั้นในสามกลีบ": ["Fit the three inner petals", "ປະກົບກີບຊັ້ນໃນສາມກີບ"],
    "เกสรพร้อม ประกบกลีบใน": ["Core ready, fit the inner petals", "ເກສອນພ້ອມ ປະກົບກີບໃນ"],
    "ห่อกลีบนอกให้เป็นถ้วย": ["Wrap the outer petals into a cup", "ຫໍ່ກີບນອກໃຫ້ເປັນຖ້ວຍ"],
    "เกือบเสร็จ ห่อกลีบนอก": ["Almost done, wrap the outer petals", "ເກືອບແລ້ວ ຫໍ່ກີບນອກ"],
    "ดอกตูม": ["Bud", "ດອກຕູມ"],
    "หนีบใบหยักใบแรก": ["Clip on the first toothed leaf", "ໜີບໃບຢັກໃບທຳອິດ"],
    "เพิ่มใบหยักอีกข้าง": ["Add the other toothed leaf", "ເພີ່ມໃບຢັກອີກຂ້າງ"],
    "ต่อกิ่งดอกตูมด้านข้าง": ["Attach the side branch with a bud", "ຕໍ່ກິ່ງດອກຕູມດ້ານຂ້າງ"],
    "เพิ่มกิ่งดอกตูม": ["Add the bud branch", "ເພີ່ມກິ່ງດອກຕູມ"],
    "วางเกสรเหลืองทรงโดม": ["Place the domed yellow core", "ວາງເກສອນເຫຼືອງຊົງໂດມ"],
    "เติมกลีบขาวชั้นใน": ["Add the white inner petals", "ເຕີມກີບຂາວຊັ້ນໃນ"],
    "เปิดกลีบขาวชั้นนอก": ["Open the white outer petals", "ເປີດກີບຂາວຊັ້ນນອກ"],
    "หนีบใบสามแฉกใบแรก": ["Clip on the first three-leaflet leaf", "ໜີບໃບສາມແສກໃບທຳອິດ"],
    "เพิ่มใบสามแฉกอีกข้าง": ["Add the other three-leaflet leaf", "ເພີ່ມໃບສາມແສກອີກຂ້າງ"],
    "ติดใบอ่อนใต้ดอก": ["Attach the young leaf under the bloom", "ຕິດໃບອ່ອນກ້ອງດອກ"],
    "เพิ่มใบอ่อนใต้ดอก": ["Add the young leaf under the bloom", "ເພີ່ມໃບອ່ອນກ້ອງດອກ"],
    "วางฐานดอกกับกลีบเลี้ยง": ["Place the flower base and sepals", "ວາງຖານດອກ ແລະ ກີບລ້ຽງ"],
    "ห่อกลีบชั้นในรอบแกน": ["Wrap the inner petals around the bud", "ຫໍ່ກີບຊັ້ນໃນຮອບແກນ"],
    "แกนพร้อม ห่อกลีบชั้นใน": ["Bud ready, wrap the inner petals", "ແກນພ້ອມ ຫໍ່ກີບຊັ້ນໃນ"],
    "เกือบเสร็จ คลี่กลีบนอกให้บาน": ["Almost done, unfurl the outer petals", "ເກືອບແລ້ວ ຄີ່ກີບນອກໃຫ້ບານ"],
    "ช่อดอกไม้": ["Bouquet", "ຊໍ່ດອກໄມ້"],
    "มาสเตอร์": ["Master", "ມາສເຕີ"],
    "แจกัน": ["Vase", "ແຈກັນ"],
    "ใบประดับ": ["Greenery", "ໃບປະດັບ"],
    "ลาเวนเดอร์": ["Lavender", "ລາເວັນເດີ"],
    "ดอกยิปโซ": ["Baby's breath", "ດອກຍິບໂຊ"],
    "ตั้งแจกันกลางฐาน": ["Stand the vase in the middle of the base", "ຕັ້ງແຈກັນກາງຖານ"],
    "เริ่มจากตั้งแจกันผูกโบว์": ["Start with the vase and its bow", "ເລີ່ມຈາກຕັ້ງແຈກັນຜູກໂບ"],
    "ปักใบประดับรอบปากแจกัน": ["Arrange greenery around the vase rim", "ປັກໃບປະດັບອ້ອມປາກແຈກັນ"],
    "เพิ่มใบเขียวรองช่อ": ["Add green leaves under the bouquet", "ເພີ່ມໃບຂຽວຮອງຊໍ່"],
    "ปักกุหลาบตรงกลางด้านหน้า": ["Place the rose front and centre", "ປັກກຸຫຼາບກາງດ້ານໜ້າ"],
    "ปักกุหลาบเป็นดอกหลัก": ["Place the rose as the main flower", "ປັກກຸຫຼາບເປັນດອກຫຼັກ"],
    "ปักทานตะวันด้านซ้าย": ["Place the sunflower on the left", "ປັກດອກຕາເວັນດ້ານຊ້າຍ"],
    "เพิ่มทานตะวันด้านซ้าย": ["Add the sunflower on the left", "ເພີ່ມດອກຕາເວັນດ້ານຊ້າຍ"],
    "ปักทิวลิปตรงกลางด้านหลัง": ["Place the tulip at the back centre", "ປັກທິວລິບກາງດ້ານຫຼັງ"],
    "เพิ่มทิวลิปให้ช่อสูงขึ้น": ["Add the tulip for height", "ເພີ່ມທິວລິບໃຫ້ຊໍ່ສູງຂຶ້ນ"],
    "ปักเดซี่ด้านขวา": ["Place the daisy on the right", "ປັກເດຊີ່ດ້ານຂວາ"],
    "เพิ่มเดซี่ด้านขวา": ["Add the daisy on the right", "ເພີ່ມເດຊີ່ດ້ານຂວາ"],
    "แซมช่อลาเวนเดอร์สีม่วง": ["Tuck in the purple lavender", "ແຊມລາເວັນເດີສີມ່ວງ"],
    "แซมลาเวนเดอร์ให้ช่อมีมิติ": ["Add lavender for depth", "ແຊມລາເວັນເດີໃຫ້ຊໍ່ມີມິຕິ"],
    "โปรยดอกยิปโซให้ช่อเต็ม": ["Scatter baby's breath to fill the bouquet", "ໂປຍດອກຍິບໂຊໃຫ້ຊໍ່ເຕັມ"],
    "เกือบเสร็จ โปรยดอกยิปโซ": ["Almost done, add the baby's breath", "ເກືອບແລ້ວ ໂປຍດອກຍິບໂຊ"],
    "กลับ": ["Back", "ກັບ"],
    "ถ่ายรูป": ["Photo", "ຖ່າຍຮູບ"],
    "เล่นอีกครั้ง": ["Play again", "ຫຼິ້ນອີກຄັ້ງ"],
    "ลากเพื่อหมุนดูรอบ ๆ · ถ่างนิ้วเพื่อซูม": ["Drag to look around · pinch to zoom", "ລາກເພື່ອໝູນເບິ່ງອ້ອມ · ຖ່າງນິ້ວເພື່ອຊູມ"],
    "ลากเพื่อหมุนดูรอบ ๆ · เลื่อนลูกกลิ้งเพื่อซูม": ["Drag to look around · scroll to zoom", "ລາກເພື່ອໝູນເບິ່ງອ້ອມ · ເລື່ອນລໍ້ເມົາເພື່ອຊູມ"],
    "โหมดกลางคืน": ["Night mode", "ໂໝດກາງຄືນ"],
    "โหมดกลางวัน": ["Day mode", "ໂໝດກາງເວັນ"],
    "สลับกลางวัน / กลางคืน": ["Switch day / night", "ສະຫຼັບກາງເວັນ / ກາງຄືນ"],
    "รูปของคุณพร้อมแล้ว": ["Your photo is ready", "ຮູບຂອງເຈົ້າພ້ອມແລ້ວ"],
    "รูปดอกไม้ที่ต่อเสร็จ": ["Your finished flower", "ຮູບດອກໄມ້ທີ່ຕໍ່ແລ້ວ"],
    "กดค้างที่รูป แล้วเลือก \"บันทึกรูปภาพ\" เพื่อเก็บลงในโทรศัพท์": ["Press and hold the photo, then choose \"Save Image\" to keep it on your phone", "ກົດຄ້າງທີ່ຮູບ ແລ້ວເລືອກ \"ບັນທຶກຮູບພາບ\" ເພື່ອເກັບໄວ້ໃນໂທລະສັບ"],
    "เสร็จแล้ว": ["Done", "ສຳເລັດ"],
    "เกมต่อบล็อกสไตล์เลโก้": ["LEGO-style brick building game", "ເກມຕໍ່ບລັອກສະໄຕລ໌ເລໂກ້"],
    "เริ่มเล่น": ["Play", "ເລີ່ມຫຼິ້ນ"],
    "กำลังโหลดภาพใหม่…": ["Reloading the 3D view…", "ກຳລັງໂຫຼດພາບໃໝ່…"],
    "ใบซ้าย": ["Left leaf", "ໃບຊ້າຍ"],
    "ใบขวา": ["Right leaf", "ໃບຂວາ"],
    "เกสร": ["Core", "ເກສອນ"],
    "กลีบดอก": ["Petals", "ກີບດອກ"],
    "กลีบขาว": ["White petals", "ກີບຂາວ"],
    "เกล็ดกลาง": ["Bud", "ແກນກາງ"],
    "กลีบกุหลาบ": ["Rose petals", "ກີບກຸຫຼາບ"],
    "ปักก้านลงบนฐาน": ["Plant the stem on the base", "ປັກກ້ານລົງເທິງຖານ"],
    "เริ่มจากการปักก้านก่อน": ["Start by planting the stem", "ເລີ່ມຈາກການປັກກ້ານກ່ອນ"],
    "ติดใบไม้ใบแรก": ["Attach the first leaf", "ຕິດໃບທຳອິດ"],
    "ก้านพร้อมแล้ว เพิ่มใบแรก": ["Stem ready. Add the first leaf", "ກ້ານພ້ອມແລ້ວ ເພີ່ມໃບທຳອິດ"],
    "เพิ่มอีกใบให้สมดุล": ["Add another leaf for balance", "ເພີ່ມອີກໃບໃຫ້ສົມດຸນ"],
    "เพิ่มอีกใบให้ดูสมดุล": ["Add another leaf to balance it", "ເພີ່ມອີກໃບໃຫ້ເບິ່ງສົມດຸນ"],
    "ประกอบเกสรตรงกลาง": ["Assemble the center core", "ປະກອບເກສອນຢູ່ກາງ"],
    "ใบครบแล้ว ประกอบเกสร": ["Leaves done. Assemble the core", "ໃບຄົບແລ້ວ ປະກອບເກສອນ"],
    "เปิดกลีบดอกให้บาน": ["Open the petals", "ເປີດກີບດອກໃຫ້ບານ"],
    "เกสรพร้อม เปิดกลีบให้บาน": ["Core ready. Open the petals", "ເກສອນພ້ອມ ເປີດກີບໃຫ້ບານ"],
    "ปักก้านให้ตรง": ["Plant the stem straight", "ປັກກ້ານໃຫ້ຊື່"],
    "เริ่มจากก้านทิวลิป": ["Start with the tulip stem", "ເລີ່ມຈາກກ້ານທິວລິບ"],
    "ติดใบยาวใบแรก": ["Attach the first long leaf", "ຕິດໃບຍາວໃບທຳອິດ"],
    "เพิ่มใบยาวด้านซ้าย": ["Add the long leaf on the left", "ເພີ່ມໃບຍາວດ້ານຊ້າຍ"],
    "เพิ่มใบอีกข้าง": ["Add a leaf on the other side", "ເພີ່ມໃບອີກຂ້າງ"],
    "เพิ่มใบยาวด้านขวา": ["Add the long leaf on the right", "ເພີ່ມໃບຍາວດ້ານຂວາ"],
    "วางเกสรกลางดอก": ["Place the core in the middle", "ວາງເກສອນໄວ້ກາງດອກ"],
    "ก้านและใบพร้อม วางเกสร": ["Stem and leaves ready. Place the core", "ກ້ານແລະໃບພ້ອມ ວາງເກສອນ"],
    "ประกบกลีบทิวลิป": ["Close the tulip petals", "ປະກົບກີບທິວລິບ"],
    "เกสรพร้อม ประกบกลีบ": ["Core ready. Close the petals", "ເກສອນພ້ອມ ປະກົບກີບ"],
    "ปักก้านเดซี่": ["Plant the daisy stem", "ປັກກ້ານເດຊີ່"],
    "เริ่มจากก้านเล็ก ๆ": ["Start with a small stem", "ເລີ່ມຈາກກ້ານນ້ອຍໆ"],
    "ติดใบเล็กซ้าย": ["Attach the small left leaf", "ຕິດໃບນ້ອຍຊ້າຍ"],
    "เพิ่มใบเล็กด้านซ้าย": ["Add a small leaf on the left", "ເພີ່ມໃບນ້ອຍດ້ານຊ້າຍ"],
    "ติดใบเล็กขวา": ["Attach the small right leaf", "ຕິດໃບນ້ອຍຂວາ"],
    "เพิ่มใบเล็กด้านขวา": ["Add a small leaf on the right", "ເພີ່ມໃບນ້ອຍດ້ານຂວາ"],
    "วางเกสรเหลือง": ["Place the yellow core", "ວາງເກສອນສີເຫຼືອງ"],
    "เปิดกลีบขาวรอบเกสร": ["Open the white petals around the core", "ເປີດກີບຂາວອ້ອມເກສອນ"],
    "เกสรพร้อม เปิดกลีบขาว": ["Core ready. Open the white petals", "ເກສອນພ້ອມ ເປີດກີບຂາວ"],
    "ปักก้านกุหลาบ": ["Plant the rose stem", "ປັກກ້ານກຸຫຼາບ"],
    "เริ่มจากก้านกุหลาบ": ["Start with the rose stem", "ເລີ່ມຈາກກ້ານກຸຫຼາບ"],
    "ติดใบกุหลาบใบแรก": ["Attach the first rose leaf", "ຕິດໃບກຸຫຼາບໃບທຳອິດ"],
    "เพิ่มใบด้านซ้าย": ["Add a leaf on the left", "ເພີ່ມໃບດ້ານຊ້າຍ"],
    "เพิ่มใบด้านขวา": ["Add a leaf on the right", "ເພີ່ມໃບດ້ານຂວາ"],
    "ประกอบแกนกลางกุหลาบ": ["Assemble the rose center", "ປະກອບແກນກາງກຸຫຼາບ"],
    "วางแกนกลางกุหลาบ": ["Place the rose center", "ວາງແກນກາງກຸຫຼາບ"],
    "คลี่กลีบกุหลาบ": ["Unfurl the rose petals", "ຄີ່ກີບກຸຫຼາບອອກ"],
    "เกสรพร้อม คลี่กลีบกุหลาบ": ["Center ready. Unfurl the rose petals", "ແກນກາງພ້ອມ ຄີ່ກີບກຸຫຼາບອອກ"],
    "ต่อครบทุกชิ้นแล้ว": ["All pieces placed", "ຕໍ່ຄົບທຸກຊິ້ນແລ້ວ"],
    "ต่อครบแล้ว!": ["Complete!", "ຕໍ່ຄົບແລ້ວ!"],
    "ลากฉากเพื่อชื่นชมดอกไม้": ["Drag the scene to admire your flower", "ລາກສາກເພື່ອຊົມດອກໄມ້"],
    "ดอกทานตะวันพร้อมแล้ว": ["The sunflower is ready", "ດອກຕາເວັນພ້ອມແລ້ວ"],
    "ดอกทานตะวันบานเต็มที่แล้ว": ["The sunflower is in full bloom", "ດອກຕາເວັນບານເຕັມທີ່ແລ້ວ"],
    "กำลังเล่นด่านนี้อยู่": ["You're already on this level", "ກຳລັງຫຼິ້ນດ່ານນີ້ຢູ່"],
    "หยิบชิ้นส่วนจากถาดก่อนนะ": ["Pick a piece from the tray first", "ເອົາຊິ້ນສ່ວນຈາກຖາດກ່ອນນະ"],
    "ออกจากโหมดถ่ายรูปแล้ว": ["Left photo mode", "ອອກຈາກໂໝດຖ່າຍຮູບແລ້ວ"],
    "สถิติใหม่! นี่คือครั้งแรกของด่านนี้": ["New record! First clear of this level", "ສະຖິຕິໃໝ່! ນີ້ແມ່ນຄັ້ງທຳອິດຂອງດ່ານນີ້"],
    "เริ่มใหม่แล้ว — ค่อย ๆ ต่อทีละชิ้น": ["Restarted — build one piece at a time", "ເລີ່ມໃໝ່ແລ້ວ — ຄ່ອຍໆຕໍ່ເທື່ອລະຊິ້ນ"],
    "เลือกชิ้นส่วนจากถาด แล้วแตะจุดเรืองแสง": ["Pick a piece from the tray, then tap the glowing spot", "ເລືອກຊິ້ນສ່ວນຈາກຖາດ ແລ້ວແຕະຈຸດເຮືອງແສງ"],
    "เลือกก้านจากถาด แล้วแตะจุดเรืองแสง": ["Pick the stem from the tray, then tap the glowing spot", "ເລືອກກ້ານຈາກຖາດ ແລ້ວແຕະຈຸດເຮືອງແສງ"],
    "บันทึกรูปแล้ว ✓": ["Photo saved ✓", "ບັນທຶກຮູບແລ້ວ ✓"],
    "เปิดเสียงแล้ว": ["Sound on", "ເປີດສຽງແລ້ວ"],
    "ปิดเสียงแล้ว": ["Sound off", "ປິດສຽງແລ້ວ"]
  };
  const R = [
    [/^(?:ดอก)?(.+)บานแล้ว!$/, ["$1 in bloom!", "$1ບານແລ້ວ!"]],
    [/^พร้อมต่อ (\d+) จาก (\d+)$/, ["Ready: piece $1 of $2", "ພ້ອມຕໍ່ $1 ຈາກ $2"]],
    [/^ขั้น (\d+) \/ (\d+)$/, ["Step $1 / $2", "ຂັ້ນ $1 / $2"]],
    [/^(.+) — ต่อแล้ว$/, ["$1 — placed", "$1 — ຕໍ່ແລ້ວ"]],
    [/^(.+) — กด Enter เพื่อวาง$/, ["$1 — press Enter to place", "$1 — ກົດ Enter ເພື່ອວາງ"]],
    [/^(.+) — เลือกชิ้นนี้$/, ["$1 — select this piece", "$1 — ເລືອກຊິ້ນນີ້"]],
    [/^(.+) — ล็อกอยู่$/, ["$1 — locked", "$1 — ລັອກຢູ່"]],
    [/^วาง(.+)ให้เข้าล็อก$/, ["Snap in: $1", "ວາງ $1 ໃຫ້ເຂົ້າລັອກ"]],
    [/^หยิบ(.+)จากถาด$/, ["Pick $1 from the tray", "ເອົາ $1 ຈາກຖາດ"]],
    [/^Pineapple Lego — (.+)$/, ["Pineapple Lego — $1", "Pineapple Lego — $1"]], // browser tab title, e.g. the level name
    [/^เลือก(.+)จากถาด แล้วแตะจุดเรืองแสง$/, ["Pick $1 from the tray, then tap the glowing spot", "ເລືອກ $1 ຈາກຖາດ ແລ້ວແຕະຈຸດເຮືອງແສງ"]],
    [/^เลือกด่าน — ปัจจุบัน (.+)$/, ["Choose level — current: $1", "ເລືອກດ່ານ — ປັດຈຸບັນ $1"]],
    [/^ด่าน (\d+): (.+)$/, ["Level $1: $2", "ດ່ານ $1: $2"]],
    [/^ด่านถัดไป: (.+)$/, ["Next level: $1", "ດ່ານຕໍ່ໄປ: $1"]],
    [/^สถิติที่ดีที่สุด (.+)$/, ["Best record $1", "ສະຖິຕິທີ່ດີທີ່ສຸດ $1"]],
    [/^สถิติใหม่! เร็วกว่าเดิม (.+)$/, ["New record! $1 faster", "ສະຖິຕິໃໝ່! ໄວກວ່າເດີມ $1"]],
    [/^สถิติ (.+)$/, ["Best $1", "ສະຖິຕິ $1"]],
    [/^คะแนน (\d+) ดาว$/, ["Score: $1 stars", "ຄະແນນ $1 ດາວ"]]
  ];
  const THAI = /[\u0E00-\u0E7F]/;
  const IDX = { en: 0, lo: 1 };
  const NAMES = { th: "TH", en: "EN", lo: "ລາວ" };
  const ORDER = ["th", "en", "lo"];
  let lang = "lo"; // default for new players; a saved choice (bb-lang) wins
  try { const v = localStorage.getItem("bb-lang"); if (ORDER.includes(v)) lang = v; } catch (e) { /* storage unavailable */ }

  function T(s) {
    if (lang === "th" || !THAI.test(s)) return s;
    const k = IDX[lang];
    const t = s.trim();
    const d = D[t];
    if (d) return s.replace(t, () => d[k]);
    for (let i = 0; i < R.length; i += 1) {
      const m = t.match(R[i][0]);
      if (m) return s.replace(t, () => R[i][1][k].replace(/\$(\d)/g, (_, n) => T(m[n])));
    }
    return s;
  }

  const ATTRS = ["aria-label", "title", "content"];
  function tText(n) {
    if (n.__out !== n.data) n.__th = n.data;
    const o = T(n.__th);
    n.__out = o;
    if (n.data !== o) n.data = o;
  }
  function tAttrs(e) {
    for (const a of ATTRS) {
      if (!e.hasAttribute(a)) continue;
      const cur = e.getAttribute(a);
      e.__a = e.__a || {}; e.__o = e.__o || {};
      if (e.__o[a] !== cur) e.__a[a] = cur;
      const o = T(e.__a[a]);
      e.__o[a] = o;
      if (cur !== o) e.setAttribute(a, o);
    }
  }
  function walk(n) {
    if (n.nodeType === 3) { tText(n); return; }
    if (n.nodeType !== 1 || n.tagName === "SCRIPT" || n.tagName === "STYLE") return;
    tAttrs(n);
    for (let c = n.firstChild; c; c = c.nextSibling) walk(c);
  }
  const mo = new MutationObserver((ms) => {
    for (const m of ms) {
      if (m.type === "childList") m.addedNodes.forEach(walk);
      else if (m.type === "characterData") tText(m.target);
      else if (m.type === "attributes") tAttrs(m.target);
    }
  });

  const css = document.createElement("style");
  css.textContent = '#langBtn{font:700 12px/1 system-ui,sans-serif;min-width:44px;padding:0 8px}' +
    'html[lang="lo"] *{font-family:"Noto Sans Lao","Phetsarath OT","Lao UI","Leelawadee UI",sans-serif !important}' +
    // The game name is Latin text: keep its rounded display font in Lao mode too.
    // Handwritten signature keeps its script font in Lao mode.
    'html[lang="lo"] .photo-watermark{font-family:"Snell Roundhand","Apple Chancery","Segoe Script","Brush Script MT","Dancing Script",cursive !important}' +
    'html[lang="lo"] .intro__title,html[lang="lo"] .intro__title *,html[lang="lo"] .intro__by,html[lang="lo"] .brand__copy strong{font-family:"Fredoka","Avenir Next Rounded",sans-serif !important}' +
    // "Now playing" badge on the level card is CSS text, so translate it here too.
    'html[lang="en"] .level-card.is-active::after{content:"Playing"}' +
    'html[lang="lo"] .level-card.is-active::after{content:"ກຳລັງຫຼິ້ນ"}';
  document.head.appendChild(css);

  const btn = document.createElement("button");
  btn.id = "langBtn"; btn.type = "button"; btn.className = "icon-btn";
  btn.setAttribute("aria-label", "Language: ไทย / English / ລາວ");
  btn.title = "ไทย / English / ລາວ";
  const sound = document.getElementById("soundBtn");
  if (sound && sound.parentNode) sound.parentNode.insertBefore(btn, sound);
  else document.body.appendChild(btn);

  function apply() {
    document.documentElement.lang = lang;
    btn.textContent = NAMES[lang];
    walk(document.documentElement);
  }
  btn.addEventListener("click", () => {
    lang = ORDER[(ORDER.indexOf(lang) + 1) % ORDER.length];
    try { localStorage.setItem("bb-lang", lang); } catch (e) { /* ignore */ }
    apply();
  });
  apply();
  mo.observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
})();
