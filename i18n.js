/* Pineapple i18n: Lao / English. Thai is no longer offered to players.
   game.js and index.html are still written in Thai: this file translates the DOM
   by looking up that original Thai text, so every new Thai string needs an entry in D. */
(function () {
  "use strict";
  const D = {
    "Pineapple Lego หน้าหลัก": ["Pineapple Lego home", "ໜ້າຫຼັກ Pineapple Lego"],
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
    "โหมดถ่ายรูป": ["Photo mode", "ໂໝດຖ່າຍຮູບ"],
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
    "หมุนดูรอบ ๆ": ["Look around", "ໝູນເບິ່ງອ້ອມໆ"],
    "ลากฉากเพื่อหมุน ม้วนหรือหุบนิ้วเพื่อซูม": ["Drag the scene to rotate; scroll or pinch to zoom", "ລາກສາກເພື່ອໝູນ ເລື່ອນ ຫຼື ຫຍິກນິ້ວເພື່ອຊູມ"],
    "ต่อทีละชิ้นตามลำดับ": ["Build in order", "ຕໍ່ເທື່ອລະຊິ້ນຕາມລຳດັບ"],
    "ชิ้นที่ยังไม่ถึงคิวจะล็อกอยู่ ต่อชิ้นที่สว่างให้เสร็จ ชิ้นถัดไปจะปลดล็อกเอง": ["Pieces that aren't up yet stay locked. Finish the lit one and the next unlocks by itself", "ຊິ້ນທີ່ຍັງບໍ່ເຖິງຄິວຈະຖືກລັອກໄວ້ ຕໍ່ຊິ້ນທີ່ສະຫວ່າງໃຫ້ແລ້ວ ຊິ້ນຕໍ່ໄປຈະປົດລັອກເອງ"],
    "ต่อเร็ว ได้ดาวเยอะ": ["Faster means more stars", "ຕໍ່ໄວ ໄດ້ດາວຫຼາຍ"],
    "เวลาเริ่มนับตอนเลือกชิ้นแรก ต่อครบใน 1 นาที 30 วินาที ได้ 3 ดาว ภายใน 3 นาที ได้ 2 ดาว": ["The clock starts when you pick the first piece. Finish in 1 min 30 s for 3 stars, within 3 min for 2 stars", "ເວລາເລີ່ມນັບຕອນເລືອກຊິ້ນທຳອິດ ຕໍ່ຄົບພາຍໃນ 1 ນາທີ 30 ວິນາທີ ໄດ້ 3 ດາວ ພາຍໃນ 3 ນາທີ ໄດ້ 2 ດາວ"],
    "ถ่ายรูปเก็บไว้": ["Save a photo", "ຖ່າຍຮູບເກັບໄວ້"],
    "ต่อครบแล้วกดปุ่มถ่ายรูปที่ขึ้นมาด้านล่าง เพื่อบันทึกรูปลงเครื่อง": ["When you finish, tap the Photo button that appears at the bottom to save a picture to your device", "ຕໍ່ຄົບແລ້ວກົດປຸ່ມຖ່າຍຮູບທີ່ຂຶ້ນມາດ້ານລຸ່ມ ເພື່ອບັນທຶກຮູບລົງເຄື່ອງ"],
    "เลือกด่านและตั้งค่า": ["Levels and settings", "ເລືອກດ່ານ ແລະ ຕັ້ງຄ່າ"],
    "กดชื่อด่านหรือไอคอนเลือกด่านด้านบนเพื่อเปลี่ยนด่าน กดปุ่มฟันเฟืองเพื่อเปิดโหมดกลางคืน ธีมคริสต์มาส เสียง และเปลี่ยนภาษา": ["Tap the level name or the level icon at the top to switch levels. Tap the gear for night mode, the Christmas theme, sound and language", "ກົດຊື່ດ່ານ ຫຼື ໄອຄອນເລືອກດ່ານທາງເທິງເພື່ອປ່ຽນດ່ານ ກົດປຸ່ມຮູບເຟືອງເພື່ອເປີດໂໝດກາງຄືນ ທີມຄຣິສມາສ ສຽງ ແລະ ປ່ຽນພາສາ"],
    "เริ่มสร้างเลย": ["Start building", "ເລີ່ມສ້າງເລີຍ"],
    "ปิดหน้าเลือกด่าน": ["Close level select", "ປິດໜ້າເລືອກດ່ານ"],
    "สี่ดอก สี่บรรยากาศ ต่อให้ครบแล้วเก็บสถิติที่ดีที่สุดของแต่ละด่าน": ["Four flowers, four moods. Finish them all and keep your best record for each level", "ສີ່ດອກ ສີ່ບັນຍາກາດ ຕໍ່ໃຫ້ຄົບ ແລ້ວເກັບສະຖິຕິທີ່ດີທີ່ສຸດຂອງແຕ່ລະດ່ານ"],
    "ต่อครบทุกชิ้นแล้ว เก็บภาพดอกไม้ของคุณไว้ดูได้เลย": ["All pieces placed. Save a picture of your flower!", "ຕໍ່ຄົບທຸກຊິ້ນແລ້ວ ເກັບຮູບດອກໄມ້ຂອງເຈົ້າໄວ້ເບິ່ງໄດ້ເລີຍ"],
    "ด่านถัดไป": ["Next level", "ດ່ານຕໍ່ໄປ"],
    "สร้างอีกครั้ง": ["Build again", "ສ້າງອີກຄັ້ງ"],
    "บันทึกรูปดอกไม้": ["Save flower photo", "ບັນທຶກຮູບດອກໄມ້"],
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
    "ฐานดอก": ["Flower base", "ຖານດອກ"],
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
    "ใบซ้าย": ["Left leaf", "ໃບຊ້າຍ"],
    "ใบขวา": ["Right leaf", "ໃບຂວາ"],
    "เกสร": ["Core", "ເກສອນ"],
    "เกล็ดกลาง": ["Bud", "ແກນກາງ"],
    "กลีบกุหลาบ": ["Rose petals", "ກີບກຸຫຼາບ"],
    "ปักก้านลงบนฐาน": ["Plant the stem on the base", "ປັກກ້ານລົງເທິງຖານ"],
    "เริ่มจากการปักก้านก่อน": ["Start by planting the stem", "ເລີ່ມຈາກການປັກກ້ານກ່ອນ"],
    "ก้านพร้อมแล้ว เพิ่มใบแรก": ["Stem ready. Add the first leaf", "ກ້ານພ້ອມແລ້ວ ເພີ່ມໃບທຳອິດ"],
    "เพิ่มอีกใบให้ดูสมดุล": ["Add another leaf to balance it", "ເພີ່ມອີກໃບໃຫ້ເບິ່ງສົມດຸນ"],
    "ประกอบเกสรตรงกลาง": ["Assemble the center core", "ປະກອບເກສອນຢູ່ກາງ"],
    "ปักก้านกุหลาบ": ["Plant the rose stem", "ປັກກ້ານກຸຫຼາບ"],
    "เริ่มจากก้านกุหลาบ": ["Start with the rose stem", "ເລີ່ມຈາກກ້ານກຸຫຼາບ"],
    "เพิ่มใบด้านซ้าย": ["Add a leaf on the left", "ເພີ່ມໃບດ້ານຊ້າຍ"],
    "เพิ่มใบด้านขวา": ["Add a leaf on the right", "ເພີ່ມໃບດ້ານຂວາ"],
    "ประกอบแกนกลางกุหลาบ": ["Assemble the rose center", "ປະກອບແກນກາງກຸຫຼາບ"],
    "วางแกนกลางกุหลาบ": ["Place the rose center", "ວາງແກນກາງກຸຫຼາບ"],
    "คลี่กลีบกุหลาบ": ["Unfurl the rose petals", "ຄີ່ກີບກຸຫຼາບອອກ"],
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
    "ปิดเสียงแล้ว": ["Sound off", "ປິດສຽງແລ້ວ"],
    // Christmas theme + snowman level
    "ธีมคริสต์มาส": ["Christmas theme", "ທີມຄຣິສມາສ"],
    "ธีมดอกไม้": ["Flower theme", "ທີມດອກໄມ້"],
    "กลางคืน": ["Night", "ກາງຄືນ"],
    "ตั้งค่า": ["Settings", "ຕັ້ງຄ່າ"],
    "เสียง": ["Sound", "ສຽງ"],
    "ภาษา": ["Language", "ພາສາ"],
    "ลากไปวางที่จุดเรืองแสงนะ": ["Drop it on the glowing spot", "ລາກໄປວາງທີ່ຈຸດເຮືອງແສງເດີ້"],
    "หรือลากชิ้นส่วนไปวางที่จุดเรืองแสงก็ได้": ["Or drag the piece onto the glowing spot", "ຫຼື ລາກຊິ້ນສ່ວນໄປວາງທີ່ຈຸດເຮືອງແສງກໍໄດ້"],
    "คริสต์มาส": ["Christmas", "ຄຣິສມາສ"],
    "สโนว์แมน": ["Snowman", "ຕຸ໊ກກະຕາຫິມະ"],
    "สโนว์แมนเสร็จแล้ว!": ["Snowman complete!", "ຕຸ໊ກກະຕາຫິມະສຳເລັດແລ້ວ!"],
    "ลากฉากเพื่อชื่นชมสโนว์แมน": ["Drag the scene to admire your snowman", "ລາກສາກເພື່ອຊົມຕຸ໊ກກະຕາຫິມະ"],
    "สโนว์แมนพร้อมฉลองคริสต์มาสแล้ว": ["Your snowman is ready for Christmas", "ຕຸ໊ກກະຕາຫິມະພ້ອມສະຫຼອງຄຣິສມາສແລ້ວ"],
    "กองหิมะ": ["Snow", "ກອງຫິມະ"],
    "ตัวล่าง": ["Body", "ໂຕລຸ່ມ"],
    "หัว": ["Head", "ຫົວ"],
    "แขนซ้าย": ["Left arm", "ແຂນຊ້າຍ"],
    "แขนขวา": ["Right arm", "ແຂນຂວາ"],
    "หน้า": ["Face", "ໜ້າ"],
    "ผ้าพันคอ": ["Scarf", "ຜ້າພັນຄໍ"],
    "หมวกซานต้า": ["Santa hat", "ໝວກຊານຕາ"],
    "วางกองหิมะบนฐาน": ["Put the snow on the base", "ວາງກອງຫິມະເທິງຖານ"],
    "เริ่มจากกองหิมะก่อน": ["Start with the snow", "ເລີ່ມຈາກກອງຫິມະກ່ອນ"],
    "วางก้อนหิมะใหญ่เป็นตัว": ["Place the big snowball as the body", "ວາງກ້ອນຫິມະໃຫຍ່ເປັນໂຕ"],
    "ปั้นตัวสโนว์แมน": ["Build the snowman's body", "ປັ້ນໂຕຕຸ໊ກກະຕາຫິມະ"],
    "วางก้อนหิมะเล็กเป็นหัว": ["Place the small snowball as the head", "ວາງກ້ອນຫິມະນ້ອຍເປັນຫົວ"],
    "ตัวพร้อมแล้ว วางหัว": ["Body ready, add the head", "ໂຕພ້ອມແລ້ວ ວາງຫົວ"],
    "ปักแขนกิ่งไม้ด้านซ้าย": ["Stick in the left twig arm", "ປັກແຂນກິ່ງໄມ້ດ້ານຊ້າຍ"],
    "เพิ่มแขนกิ่งไม้ข้างแรก": ["Add the first twig arm", "ເພີ່ມແຂນກິ່ງໄມ້ຂ້າງທຳອິດ"],
    "ปักแขนกิ่งไม้ด้านขวา": ["Stick in the right twig arm", "ປັກແຂນກິ່ງໄມ້ດ້ານຂວາ"],
    "เพิ่มแขนอีกข้าง": ["Add the other arm", "ເພີ່ມແຂນອີກຂ້າງ"],
    "ติดตา จมูกแครอท และปาก": ["Add the eyes, carrot nose and smile", "ຕິດຕາ ດັງແຄລອດ ແລະ ປາກ"],
    "แต่งหน้าให้สโนว์แมน": ["Give the snowman a face", "ແຕ່ງໜ້າໃຫ້ຕຸ໊ກກະຕາຫິມະ"],
    "พันผ้าพันคอสีเขียว": ["Wrap the green scarf", "ພັນຜ້າພັນຄໍສີຂຽວ"],
    "พันผ้าพันคอให้อุ่น": ["Wrap a scarf to keep warm", "ພັນຜ້າພັນຄໍໃຫ້ອົບອຸ່ນ"],
    "สวมหมวกซานต้าสีแดง": ["Put on the red Santa hat", "ໃສ່ໝວກຊານຕາສີແດງ"],
    "เกือบเสร็จ สวมหมวกซานต้า": ["Almost done, put on the Santa hat", "ເກືອບແລ້ວ ໃສ່ໝວກຊານຕາ"],
    // Christmas tree level
    "ต้นคริสต์มาส": ["Christmas tree", "ຕົ້ນຄຣິສມາສ"],
    "ต้นคริสต์มาสเสร็จแล้ว!": ["Christmas tree complete!", "ຕົ້ນຄຣິສມາສສຳເລັດແລ້ວ!"],
    "ลากฉากเพื่อชื่นชมต้นคริสต์มาส": ["Drag the scene to admire your tree", "ລາກສາກເພື່ອຊົມຕົ້ນຄຣິສມາສ"],
    "ต้นคริสต์มาสพร้อมฉลองแล้ว": ["Your tree is ready to celebrate", "ຕົ້ນຄຣິສມາສພ້ອມສະຫຼອງແລ້ວ"],
    "กระถาง": ["Pot", "ກະຖາງ"],
    "ลำต้น": ["Trunk", "ລຳຕົ້ນ"],
    "ใบชั้นล่าง": ["Bottom tier", "ໃບຊັ້ນລຸ່ມ"],
    "ใบชั้นกลาง": ["Middle tier", "ໃບຊັ້ນກາງ"],
    "ใบชั้นบน": ["Top tier", "ໃບຊັ້ນເທິງ"],
    "ลูกบอลประดับ": ["Baubles", "ໝາກບານປະດັບ"],
    "สายไฟประดับ": ["Lights", "ສາຍໄຟປະດັບ"],
    "ดาวบนยอด": ["Star", "ດາວເທິງຍອດ"],
    "ตั้งกระถางสีแดงกลางฐาน": ["Stand the red pot in the middle of the base", "ຕັ້ງກະຖາງສີແດງກາງຖານ"],
    "เริ่มจากตั้งกระถาง": ["Start with the pot", "ເລີ່ມຈາກຕັ້ງກະຖາງ"],
    "ปักลำต้นลงในกระถาง": ["Plant the trunk in the pot", "ປັກລຳຕົ້ນລົງໃນກະຖາງ"],
    "กระถางพร้อม ปักลำต้น": ["Pot ready, add the trunk", "ກະຖາງພ້ອມ ປັກລຳຕົ້ນ"],
    "วางใบสนชั้นใหญ่สุด": ["Place the biggest pine tier", "ວາງໃບແປກຊັ້ນໃຫຍ່ສຸດ"],
    "วางใบสนชั้นล่าง": ["Place the bottom pine tier", "ວາງໃບແປກຊັ້ນລຸ່ມ"],
    "ซ้อนใบสนชั้นกลาง": ["Stack the middle pine tier", "ຊ້ອນໃບແປກຊັ້ນກາງ"],
    "วางใบสนชั้นยอด": ["Place the top pine tier", "ວາງໃບແປກຊັ້ນຍອດ"],
    "วางใบสนชั้นบนสุด": ["Add the very top tier", "ວາງໃບແປກຊັ້ນເທິງສຸດ"],
    "แขวนลูกบอลประดับรอบต้น": ["Hang baubles all around", "ແຂວນໝາກບານປະດັບອ້ອມຕົ້ນ"],
    "แต่งลูกบอลหลากสี": ["Decorate with colorful baubles", "ແຕ່ງໝາກບານຫຼາກສີ"],
    "พันสายไฟวนรอบต้น": ["Wind the lights around the tree", "ພັນສາຍໄຟວົນອ້ອມຕົ້ນ"],
    "พันสายไฟให้ต้นเป็นประกาย": ["Add lights to make it sparkle", "ພັນສາຍໄຟໃຫ້ຕົ້ນເຫຼື້ອມ"],
    "ติดดาวสีทองบนยอด": ["Put the gold star on top", "ຕິດດາວສີຄຳເທິງຍອດ"],
    "เกือบเสร็จ ติดดาวบนยอด": ["Almost done, add the star", "ເກືອບແລ້ວ ຕິດດາວເທິງຍອດ"],
    "ขา": ["Legs", "ຂາ"],
    "ลำตัว": ["Body", "ລຳໂຕ"],
    // Reindeer level
    "กวางเรนเดียร์": ["Reindeer", "ກວາງເຣນເດຍ"],
    "กวางเรนเดียร์เสร็จแล้ว!": ["Reindeer complete!", "ກວາງເຣນເດຍສຳເລັດແລ້ວ!"],
    "ลากฉากเพื่อชื่นชมกวางเรนเดียร์": ["Drag the scene to admire your reindeer", "ລາກສາກເພື່ອຊົມກວາງເຣນເດຍ"],
    "กวางเรนเดียร์พร้อมลากเลื่อนซานต้าแล้ว": ["Your reindeer is ready to pull Santa's sleigh", "ກວາງເຣນເດຍພ້ອມລາກລໍ້ເລື່ອນຊານຕາແລ້ວ"],
    "หู": ["Ears", "ຫູ"],
    "ตาและจมูกแดง": ["Eyes & red nose", "ຕາ ແລະ ດັງແດງ"],
    "เขากวาง": ["Antlers", "ເຂົາກວາງ"],
    "วางขาหน้าและขาหลัง": ["Place the front and back legs", "ວາງຂາໜ້າ ແລະ ຂາຫຼັງ"],
    "ต่อขากวางก่อน": ["Start with the legs", "ຕໍ່ຂາກວາງກ່ອນ"],
    "วางลำตัวสีน้ำตาล": ["Place the brown body", "ວາງລຳໂຕສີນ້ຳຕານ"],
    "ต่อลำตัวกวาง": ["Build the reindeer's body", "ຕໍ່ລຳໂຕກວາງ"],
    "วางหัวบนลำตัว": ["Put the head on the body", "ວາງຫົວເທິງລຳໂຕ"],
    "ติดตากับจมูกแดง": ["Add the eyes and red nose", "ຕິດຕາ ກັບດັງແດງ"],
    "แต่งหน้าให้กวาง": ["Give the reindeer a face", "ແຕ່ງໜ້າໃຫ້ກວາງ"],
    "ติดหูสองข้าง": ["Add both ears", "ຕິດຫູສອງຂ້າງ"],
    "เพิ่มหูสองข้าง": ["Add the two ears", "ເພີ່ມຫູສອງຂ້າງ"],
    "ปักเขากวางสองข้าง": ["Add both antlers", "ປັກເຂົາກວາງສອງຂ້າງ"],
    "ปักเขากวางให้สวย": ["Antlers on top", "ປັກເຂົາກວາງໃຫ້ງາມ"],
    // Santa's chimney level
    "ซานต้าบนปล่องไฟ": ["Santa's chimney", "ຊານຕາເທິງປ່ອງໄຟ"],
    "ซานต้ามาถึงแล้ว!": ["Santa is here!", "ຊານຕາມາຮອດແລ້ວ!"],
    "ลากฉากเพื่อชื่นชมซานต้า": ["Drag the scene to admire Santa", "ລາກສາກເພື່ອຊົມຊານຕາ"],
    "ซานต้าพร้อมแจกของขวัญแล้ว": ["Santa is ready to hand out presents", "ຊານຕາພ້ອມແຈກຂອງຂວັນແລ້ວ"],
    "ฐานหิมะ": ["Snowy base", "ຖານຫິມະ"],
    "ปล่องไฟชั้นล่าง": ["Chimney (low)", "ປ່ອງໄຟຊັ້ນລຸ່ມ"],
    "ปล่องไฟชั้นบน": ["Chimney (top)", "ປ່ອງໄຟຊັ້ນເທິງ"],
    "ขอบปล่องไฟ": ["Ledge", "ຂອບປ່ອງໄຟ"],
    "ตัวซานต้า": ["Santa's body", "ໂຕຊານຕາ"],
    "เครายาว": ["Beard", "ໜວດຍາວ"],
    "ตาและจมูก": ["Eyes & nose", "ຕາ ແລະ ດັງ"],
    "พวงหรีด": ["Wreath", "ພວງຫຼີດ"],
    "แขนขวาโบกมือ": ["Waving arm", "ແຂນຂວາໂບກມື"],
    "วางแขนซ้ายเกาะขอบปล่องไฟ": ["Rest the left arm on the ledge", "ວາງແຂນຊ້າຍເກາະຂອບປ່ອງໄຟ"],
    "เพิ่มแขนซ้าย": ["Add the left arm", "ເພີ່ມແຂນຊ້າຍ"],
    "ยกแขนขวาโบกมือทักทาย": ["Raise the right arm to wave", "ຍົກແຂນຂວາໂບກມືທັກທາຍ"],
    "ซานต้าโบกมือทักทาย": ["Santa waves hello", "ຊານຕາໂບກມືທັກທາຍ"],
    "ถุงของขวัญ": ["Gift sack", "ຖົງຂອງຂວັນ"],
    "วางฐานหิมะกับพรมแดง": ["Lay the snowy base and red carpet", "ວາງຖານຫິມະ ກັບພົມແດງ"],
    "เริ่มจากฐานหิมะ": ["Start with the snowy base", "ເລີ່ມຈາກຖານຫິມະ"],
    "ก่ออิฐชั้นล่างของปล่องไฟ": ["Lay the chimney's lower bricks", "ກໍ່ດິນຈີ່ຊັ້ນລຸ່ມຂອງປ່ອງໄຟ"],
    "ก่อปล่องไฟอิฐ": ["Build the brick chimney", "ກໍ່ປ່ອງໄຟດິນຈີ່"],
    "ก่ออิฐให้ปล่องไฟสูงขึ้น": ["Build the chimney higher", "ກໍ່ດິນຈີ່ໃຫ້ປ່ອງໄຟສູງຂຶ້ນ"],
    "ก่ออิฐชั้นบน": ["Lay the upper bricks", "ກໍ່ດິນຈີ່ຊັ້ນເທິງ"],
    "วางขอบบนปล่องไฟ": ["Put the ledge on top", "ວາງຂອບເທິງປ່ອງໄຟ"],
    "ปิดขอบปล่องไฟ": ["Cap the chimney", "ປິດຂອບປ່ອງໄຟ"],
    "ให้ซานต้าโผล่จากปล่องไฟ": ["Santa pops out of the chimney", "ໃຫ້ຊານຕາໂຜ່ອອກຈາກປ່ອງໄຟ"],
    "ซานต้าโผล่ออกมาแล้ว": ["Santa is popping out", "ຊານຕາໂຜ່ອອກມາແລ້ວ"],
    "วางหัวซานต้า": ["Place Santa's head", "ວາງຫົວຊານຕາ"],
    "ตัวพร้อม วางหัว": ["Body ready, add the head", "ໂຕພ້ອມ ວາງຫົວ"],
    "ติดเคราขาวฟู": ["Add the fluffy white beard", "ຕິດໜວດຂາວຟູ"],
    "ติดเคราขาว": ["Add the white beard", "ຕິດໜວດຂາວ"],
    "ติดตากับจมูกชมพู": ["Add the eyes and pink nose", "ຕິດຕາ ກັບດັງສີບົວ"],
    "แต่งหน้าซานต้า": ["Give Santa a face", "ແຕ່ງໜ້າຊານຕາ"],
    "สวมหมวกให้ซานต้า": ["Put Santa's hat on", "ໃສ່ໝວກໃຫ້ຊານຕາ"],
    "แขวนพวงหรีดหน้าปล่องไฟ": ["Hang the wreath on the chimney", "ແຂວນພວງຫຼີດໜ້າປ່ອງໄຟ"],
    "แขวนพวงหรีด": ["Hang the wreath", "ແຂວນພວງຫຼີດ"],
    "วางถุงของขวัญข้างปล่องไฟ": ["Put the gift sack by the chimney", "ວາງຖົງຂອງຂວັນຂ້າງປ່ອງໄຟ"],
    "เกือบเสร็จ วางถุงของขวัญ": ["Almost done, add the gift sack", "ເກືອບແລ້ວ ວາງຖົງຂອງຂວັນ"],
    // Snow globe gift level
    "ของขวัญ": ["Gifts", "ຂອງຂວັນ"],
    "สุขสันต์วันคริสต์มาส!": ["Merry Christmas!", "ສຸກສັນວັນຄຣິສມາສ!"],
    "ลากฉากเพื่อชื่นชมของขวัญ": ["Drag the scene to admire your gift", "ລາກສາກເພື່ອຊົມຂອງຂວັນ"],
    "ลูกแก้วหิมะพร้อมมอบเป็นของขวัญแล้ว": ["Your snow globe is ready to give", "ລູກແກ້ວຫິມະພ້ອມມອບເປັນຂອງຂວັນແລ້ວ"],
    "ฐานสีแดง": ["Red base", "ຖານສີແດງ"],
    "ขอบทอง": ["Gold trims", "ຂອບຄຳ"],
    "โบว์และใบฮอลลี่": ["Bow & holly", "ໂບ ແລະ ໃບຮອລລີ້"],
    "พื้นหิมะ": ["Snow floor", "ພື້ນຫິມະ"],
    "บ้านขนมปังขิง": ["Gingerbread house", "ເຮືອນເຂົ້າໜົມຂີງ"],
    "ซานต้า": ["Santa", "ຊານຕາ"],
    "กองของขวัญ": ["Gift pile", "ກອງຂອງຂວັນ"],
    "ลูกแก้ว": ["Glass globe", "ລູກແກ້ວ"],
    "เกล็ดหิมะ": ["Snowflakes", "ເກັດຫິມະ"],
    "ไฟและกุญแจไขลาน": ["Lights & key", "ໄຟ ແລະ ກະແຈໄຂລານ"],
    "ตั้งฐานสีแดงกลางเวที": ["Stand the red base in the middle", "ຕັ້ງຖານສີແດງກາງເວທີ"],
    "เริ่มจากฐานลูกแก้ว": ["Start with the globe's base", "ເລີ່ມຈາກຖານລູກແກ້ວ"],
    "ใส่ขอบทองและขาทอง": ["Add the gold rims and feet", "ໃສ່ຂອບຄຳ ແລະ ຂາຄຳ"],
    "แต่งขอบสีทอง": ["Gold trim", "ແຕ່ງຂອບສີຄຳ"],
    "ติดโบว์แดงด้านหน้า": ["Tie the red bow on the front", "ຕິດໂບແດງດ້ານໜ້າ"],
    "ผูกโบว์ให้สวย": ["Tie a pretty bow", "ຜູກໂບໃຫ້ງາມ"],
    "โรยพื้นหิมะบนฐาน": ["Spread snow on the base", "ໂຮຍພື້ນຫິມະເທິງຖານ"],
    "ปูพื้นหิมะในลูกแก้ว": ["Snow inside the globe", "ປູພື້ນຫິມະໃນລູກແກ້ວ"],
    "ตั้งต้นคริสต์มาสด้านซ้าย": ["Stand the tree on the left", "ຕັ້ງຕົ້ນຄຣິສມາສດ້ານຊ້າຍ"],
    "ตั้งต้นคริสต์มาสน้อย": ["A little Christmas tree", "ຕັ້ງຕົ້ນຄຣິສມາສນ້ອຍ"],
    "วางบ้านหลังเล็กด้านหลัง": ["Put the little house at the back", "ວາງເຮືອນຫຼັງນ້ອຍດ້ານຫຼັງ"],
    "สร้างบ้านหลังน้อย": ["Build a little house", "ສ້າງເຮືອນຫຼັງນ້ອຍ"],
    "วางซานต้าตรงกลาง": ["Put Santa in the middle", "ວາງຊານຕາກາງ"],
    "ซานต้ามาแล้ว": ["Santa is here", "ຊານຕາມາແລ້ວ"],
    "วางสโนว์แมนตัวจิ๋ว": ["Add the tiny snowman", "ວາງຕຸ໊ກກະຕາຫິມະນ້ອຍ"],
    "เพิ่มสโนว์แมน": ["Add a snowman", "ເພີ່ມຕຸ໊ກກະຕາຫິມະ"],
    "วางกล่องของขวัญจิ๋ว": ["Add the tiny presents", "ວາງກ່ອງຂອງຂວັນນ້ອຍ"],
    "เพิ่มของขวัญ": ["Add presents", "ເພີ່ມຂອງຂວັນ"],
    "ครอบลูกแก้วใส": ["Put the clear glass globe on", "ຄອບລູກແກ້ວໃສ"],
    "ครอบลูกแก้ว": ["Cover with glass", "ຄອບລູກແກ້ວ"],
    "เติมเกล็ดหิมะในลูกแก้ว": ["Fill the globe with snowflakes", "ເຕີມເກັດຫິມະໃນລູກແກ້ວ"],
    "ใส่เกล็ดหิมะ": ["Add snowflakes", "ໃສ່ເກັດຫິມະ"],
    "เปิดไฟและติดกุญแจไขลาน": ["Turn on the lights and add the key", "ເປີດໄຟ ແລະ ຕິດກະແຈໄຂລານ"],
    "เกือบเสร็จ เปิดไฟประดับ": ["Almost done, lights on", "ເກືອບແລ້ວ ເປີດໄຟປະດັບ"]
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
  const NAMES = { en: "EN", lo: "ລາວ" };
  const ORDER = ["lo", "en"]; // a saved "th" from older versions falls back to Lao
  let lang = "lo"; // default for new players; a saved choice (bb-lang) wins
  try { const v = localStorage.getItem("bb-lang"); if (ORDER.includes(v)) lang = v; } catch (e) { /* storage unavailable */ }

  function T(s) {
    if (!THAI.test(s)) return s;
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

  const ATTRS = ["aria-label", "title"];
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
  css.textContent = '' +
    'html[lang="lo"] *{font-family:"Fredoka","Noto Sans Lao Looped","Noto Sans Lao","Phetsarath OT","Lao UI",sans-serif !important}' +
    // The game name is Latin text: keep its rounded display font in Lao mode too.
    // Lao script has no capitals: drop the wide tracking meant for English labels.
    'html[lang="lo"] *:not(.level-badge__label):not(.piece__en):not(.modal__kicker):not(.level-card__en){letter-spacing:normal !important}' +
    // Handwritten signature keeps its script font in Lao mode.
    'html[lang="lo"] .photo-watermark{font-family:"Snell Roundhand","Apple Chancery","Segoe Script","Brush Script MT","Dancing Script",cursive !important}' +
    'html[lang="lo"] .intro__title,html[lang="lo"] .intro__title *,html[lang="lo"] .brand__copy strong{font-family:"Fredoka","Avenir Next Rounded",sans-serif !important}' +
    // "Now playing" badge on the level card is CSS text, so translate it here too.
    'html[lang="en"] .level-card.is-active::after{content:"Playing"}' +
    'html[lang="lo"] .level-card.is-active::after{content:"ກຳລັງຫຼິ້ນ"}';
  document.head.appendChild(css);

  const btn = document.createElement("button");
  btn.id = "langBtn"; btn.type = "button"; btn.className = "settings__lang";
  btn.setAttribute("aria-label", "Language: ລາວ / English");
  btn.title = "ລາວ / English";
  const slot = document.getElementById("langSlot"); // row in the settings menu
  if (slot) slot.appendChild(btn);
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
