const locale = {
  "code": "id",
  "ui": {
    "localeName": "Bahasa Indonesia",
    "languageLabel": "Bahasa",
    "baseMode": "Basis",
    "currentPageMode": "Halaman saat ini",
    "step": "Melangkah",
    "helpTitle": "Membantu",
    "nextHint": "Lanjutkan ke langkah berikutnya.",
    "missingZone": "Zona tidak ditemukan di layar ini. Lanjutkan ke langkah berikutnya.",
    "previous": "Sebelumnya",
    "next": "Berikutnya",
    "finish": "Menyelesaikan",
    "close": "Menutup",
    "currentPageFallback": "Halaman saat ini",
    "columnPrefix": "Kolom",
    "groupTitle": "Grup kolom",
    "groupText": "Kolom-kolom ini harus dibaca bersama-sama.",
    "pageSummaryPrefix": "Area ini merangkum halaman tersebut",
    "pageSummarySuffix": "Muat data tampilan untuk mendapatkan detail lengkap."
  },
  "pageLabels": {
    "home": "Rumah",
    "inv": "Peternakan",
    "cook": "Memasak",
    "fish": "Ikan",
    "flower": "Bunga",
    "bounty": "Menggali",
    "animal": "Hewan",
    "pet": "Hewan peliharaan",
    "craft": "Keahlian",
    "cropmachine": "Mesin Pangkas",
    "map": "Peta",
    "expand": "Memperluas",
    "buynodes": "Beli node",
    "factions": "Fraksi",
    "market": "Pasar",
    "chapter": "Bab",
    "auctions": "Lelang",
    "toplists": "Daftar",
    "activity": "Aktivitas"
  },
  "pageColumnStepOrder": {
    "flower": [
      "Seed",
      "Name",
      "Breed",
      "Time",
      "Quant",
      "Hrvst",
      "Grow"
    ],
    "bounty": [
      "Name",
      "Stock",
      "Value",
      "Today",
      "Tool cost",
      "Ratio",
      {
        "names": [
          "Patterns Today",
          "Patterns Value",
          "Patterns Tool cost"
        ],
        "title": "Patterns",
        "text": "The Patterns block isolates the daily reward variant. Compare it with the standard block to choose the best return."
      }
    ],
    "animal": [
      "LVL",
      "Prod1",
      "Prod2",
      "Food",
      "Food cost",
      "Prod market",
      "Cost/u"
    ],
    "pet": [
      "Pet",
      "Fetch",
      "Supply",
      "Lvl",
      "Aura",
      "Bib",
      "Current Energy",
      "Requests",
      "Cost",
      "Prod market",
      "Energy/Flower",
      "Energy/Market"
    ],
    "craft": [
      "Name",
      "Stock",
      "Time",
      "Compos",
      "Cost",
      "Prod"
    ],
    "cropmachine": [
      "Name",
      "Time",
      "Seeds",
      "Harvest Average",
      "Harvest Cost",
      "Oil",
      "Oil Cost",
      "Total Cost",
      "Profit",
      "Gain/h",
      "Daily Flower"
    ],
    "cook": [
      "Food",
      "Quantity",
      "XP",
      "XP/H",
      "XP/Flower",
      "Cost",
      "Prod",
      {
        "fromName": "Prod",
        "toEnd": true,
        "excludeFrom": true,
        "title": "Components",
        "text": "These columns show the components required for each recipe."
      }
    ],
    "expand": [
      "Lvl",
      "Bumpkin",
      "Farm",
      "From",
      "To",
      "Time",
      "CostSFL"
    ],
    "buynodes": [
      "Node",
      "BaseSunstone",
      "IncreasePrice",
      "NodesOnFarm",
      "Bought",
      "Buy",
      "NodesAfter",
      "NextPrice",
      "TotalSunstone",
      "TotalObsidian",
      "TotalTimeObsidianFromStock",
      "BuyToReachTotalObsidianPrice"
    ],
    "chapter": [
      "Source",
      "Done",
      "Daily",
      "Week",
      "Left",
      "Total"
    ],
    "auctions": [
      "Item",
      "Type",
      "cur",
      "Supply",
      "End",
      "Notifications"
    ],
    "market": [
      "Seller",
      "Buyer",
      "Type",
      "Name",
      "Qty",
      "Flower",
      "Market",
      "Prod",
      "Date"
    ],
    "toplists": [
      "rank",
      "ID",
      "LVL"
    ]
  },
  "pageGenericExplanations": {
    "home": "Area ini membantu Anda membaca status harian pertanian: rutinitas yang telah selesai, panen yang sedang berlangsung, cooldown, dan blok prioritas.",
    "inv": "Kolom ini membantu membandingkan objek dalam tampilan Peternakan, terutama melalui stok, waktu, biaya, nilai pasar, dan hasil.",
    "cook": "Kolom ini membantu membandingkan resep di Cook, terutama dengan XP, waktu, dan biaya sebenarnya.",
    "fish": "Kolom ini membantu membandingkan hasil tangkapan, harga, kelangkaan, dan keuntungan Ikan.",
    "flower": "Kolom ini membantu melacak bunga berdasarkan keluarga, ras, stok, dan pertumbuhan.",
    "bounty": "Kolom ini membantu menilai nilai penggalian berdasarkan biaya alat dan pola harian.",
    "animal": "Kolom ini membantu membandingkan siklus hewan, makanannya, dan harga satuan produk.",
    "pet": "Kolom ini membantu membaca nilai komponen hewan peliharaan, kuil, atau pengambilan.",
    "craft": "Kolom ini membantu memeriksa stok, komponen, dan biaya pembuatan.",
    "cropmachine": "Kolom ini membantu mensimulasikan batch Mesin Pangkas dalam hal biaya, laba, dan proyeksi harian.",
    "map": "Area ini membantu Anda memvisualisasikan secara langsung apa yang sedang tumbuh, berjalan, atau menunggu tindakan di pulau tersebut.",
    "expand": "Kolom ini membantu merencanakan perluasan waktu, sumber daya, dan biaya.",
    "buynodes": "Kolom ini membantu memprioritaskan pembelian node berdasarkan harga saat ini dan selanjutnya.",
    "factions": "Area ini membantu membaca kemajuan faksi, hewan peliharaan mingguan, dan biaya permintaan.",
    "market": "Kolom ini membantu membandingkan penawaran dan perdagangan nyata yang terkait dengan pertanian.",
    "chapter": "Kolom ini membantu memproyeksikan tiket dan biaya untuk menyelesaikan bab ini.",
    "auctions": "Kolom ini membantu memantau lelang atau undian melalui entri, waktu berakhir, dan hadiahnya.",
    "toplists": "Kolom ini membantu membandingkan pemain di seluruh peringkat gabungan.",
    "activity": "Kolom ini membantu membaca arus nyata pertanian selama suatu periode: produksi, pembakaran, tiket, Bunga, dan koin."
  },
  "commonExplanations": {
    "rank": "Posisi di peringkat yang ditampilkan.",
    "id": "Identifier of the player or farm, useful for matching the same entry elsewhere.",
    "lvl": "Tingkat peternakan, hewan peliharaan, atau objek yang dibandingkan.",
    "name": "Nama objek yang ditampilkan dalam tabel.",
    "item": "Nama objek yang ditampilkan dalam tabel.",
    "fish": "Nama objek yang ditampilkan dalam tabel.",
    "pet": "Nama hewan peliharaan atau objek terkait.",
    "component": "Nama komponen terkait.",
    "shrine": "Nama kuil terkait.",
    "source": "Sumber keuntungan ini, biaya atau counter.",
    "qty": "Kuantitas yang ditampilkan untuk objek ini.",
    "quantity": "Kuantitas yang ditampilkan untuk objek ini.",
    "stock": "Stok saat ini tersedia untuk objek ini.",
    "supply": "Jumlah yang tersedia atau dialokasikan untuk objek ini.",
    "cost": "Perkiraan biaya untuk objek ini dalam mode perhitungan aktif.",
    "prod": "Nilai produksi benda tersebut, untuk dibandingkan dengan nilai pasar atau biaya.",
    "betty": "Nilai yang diperoleh jika Anda menjual benda ini kepada Betty.",
    "market": "Perkiraan nilai pasar benda tersebut.",
    "offer": "Harga yang diminta untuk penawaran pasar ini.",
    "ratio": "Rasio perbandingan untuk objek ini. Nilai yang lebih tinggi umumnya berarti konversi yang lebih baik atau pengembalian yang lebih baik dibandingkan objek lainnya.",
    "time": "Pertumbuhan, kerajinan, atau waktu siklus yang diperlukan untuk objek ini.",
    "ready": "Momen ketika suatu benda akan siap, atau sisa waktu sebelum benda itu siap.",
    "when": "Waktu ketika objek akan siap.",
    "grow": "Waktu pertumbuhan atau kemajuan pertumbuhan objek.",
    "end": "Waktu berakhirnya objek, peristiwa, atau siklus ini.",
    "since": "Usia penawaran atau acara ini.",
    "date": "Tanggal ditautkan ke objek atau peristiwa ini.",
    "xp": "XP diperoleh atau ditautkan ke objek ini.",
    "profit": "Estimasi laba bersih untuk objek ini setelah biaya dihilangkan.",
    "profitpercent": "Persentase profitabilitas suatu objek dibandingkan dengan biaya produksinya.",
    "diff": "Kesenjangan antara dua nilai perbandingan untuk objek ini.",
    "coef": "Koefisien perbandingan antara dua nilai untuk objek ini.",
    "withdraw": "Jumlah yang benar-benar dapat dipulihkan setelah aturan penarikan.",
    "dailymax": "Proyeksi harian maksimum untuk objek ini.",
    "dailymaxaverage": "Rata-rata proyeksi harian maksimum jika objek berjalan dalam kondisi terbaik.",
    "dailyflower": "Rata-rata proyeksi Flower harian yang dihasilkan objek sesuai waktu farm harianmu dan jumlah restock yang dikonfigurasi di opsi.",
    "daily": "Proyeksi harian rata-rata untuk objek ini.",
    "gainh": "Keuntungan rata-rata per jam untuk objek ini.",
    "chng": "Perubahan nilai terkini untuk objek ini selama periode yang dipilih.",
    "chngpercent": "Perubahan harga terkini untuk objek selama periode yang dipilih.",
    "yield": "Rata-rata produksi objek dengan pengaturan aktif.",
    "harvest": "Jumlah rata-rata yang dapat Anda panen untuk objek ini.",
    "harvestaverage": "Jumlah rata-rata yang dapat Anda panen untuk objek ini.",
    "toharvest": "Jumlah objek ini sudah bertambah dan segera siap dipanen.",
    "toharvestgrowing": "Jumlah objek ini sudah bertambah di pertanian.",
    "done": "Menunjukkan apa yang telah diselesaikan untuk tujuan ini.",
    "left": "Menunjukkan apa yang masih harus dilakukan atau diperoleh.",
    "total": "Total yang diproyeksikan atau diakumulasikan untuk objek ini.",
    "notification": "Memungkinkan Anda mengaktifkan peringatan untuk objek ini.",
    "notifications": "Memungkinkan Anda mengaktifkan peringatan untuk objek ini.",
    "season": "Menunjukkan pada musim apa objek ini tersedia dan memungkinkan Anda memfilter musim yang ditampilkan.",
    "buy": "Menunjukkan apakah benda tersebut dibeli secara langsung, bukan diproduksi."
  },
  "pageColumnExplanations": {
    "inv": {
      "season": "Filter ini membatasi tabel pada objek yang tersedia pada musim yang dipilih.",
      "item": "Nama objek yang dilacak di peternakan. Ini adalah objek dasar yang digunakan oleh semua perhitungan biaya, pasar dan hasil.",
      "hrvmax": "Jumlah maksimum yang dapat dipanen pada siang hari untuk objek ini berdasarkan pengaturan, node, dan peningkatan aktif.",
      "hrv": "Nilai panen yang digunakan oleh mode Harian. Anda dapat menyesuaikannya untuk mensimulasikan hari nyata, bukan maksimum teoretis.",
      "quantity": "Pemilih ini mengubah kuantitas yang digunakan dalam semua penghitungan di halaman. Peternakan = stok saat ini di peternakan. Harian = jumlah yang dapat Anda hasilkan per hari. Restock = produksi ditambah satu kali restock. Custom = nilai manual untuk simulasi Anda sendiri.",
      "time": "Pertumbuhan atau waktu siklus yang diperlukan untuk menghasilkan benda tersebut.",
      "cost": "Pemilih ini mengubah cara pembacaan biaya. / Unit = biaya produksi satu unit. x Kuantitas = total biaya untuk kuantitas yang dipilih di Kuantitas. dihitung = juga termasuk biaya sampingan yang sudah dihitung di tempat lain.",
      "buy": "Kotak centang yang menandai objek sebagai dibeli, bukan diproduksi. Hal ini mengubah biaya yang digunakan oleh resep dan perbandingan berantai.",
      "betty": "Nilai yang Anda peroleh dengan menjual objek tersebut kepada Betty. Berguna untuk membandingkan harga jaminan dengan nilai pasar.",
      "ratio": "Jumlah Koin yang diperoleh per Bunga yang dibelanjakan atau dilakukan. Nilai yang lebih tinggi berarti konversi belanja ke koin lebih menguntungkan.",
      "market": "Perkiraan nilai pasar benda tersebut.",
      "profit": "Margin relatif antara nilai pasar dan biaya produksi. Hal ini menunjukkan apakah memproduksi objek sendiri masih memiliki keunggulan ekonomi.",
      "withdraw": "Nilai yang dapat ditarik setelah aturan penarikan dan pajak. Berguna untuk memisahkan nilai mentah dari apa yang sebenarnya dapat Anda pulihkan.",
      "diff": "Kesenjangan antara dua referensi harga. Ini membantu Anda dengan cepat melihat kapan pasar berbeda dari nilai perbandingan lainnya.",
      "coef": "Koefisien antara biaya produksi dan harga jual. Ini menunjukkan seberapa jauh pasar dari biaya sebenarnya.",
      "chng": "Perubahan harga terkini selama periode yang dipilih. Bermanfaat untuk melihat objek yang naik atau turun dengan cepat.",
      "yield": "Produksi mentah sebuah node sesuai dengan pengaturan aktif atau tryset.",
      "harvest": "Jumlah rata-rata yang dapat Anda panen untuk objek ini.",
      "toharvest": "Jumlahnya sudah bertambah di lahan pertanian dan segera dapat dipanen. Ini adalah produksi Anda yang sebenarnya, bukan hanya produksi teoritis.",
      "ready": "Menampilkan waktu siap atau waktu tersisa hingga objek siap, bergantung pada mode yang dipilih.",
      "when": "Mode kolom siap yang menunjukkan waktu ketersediaan yang tepat.",
      "remain": "Mode kolom siap yang menunjukkan sisa waktu.",
      "1restock": "Proyeksi produksi untuk sekali restock. Berguna untuk mengukur dampak minimum dari satu isi ulang tanpa melihat sepanjang hari.",
      "dailyflower": "Rata-rata proyeksi Flower harian yang dihasilkan objek sesuai waktu farm harianmu dan jumlah restock yang dikonfigurasi di opsi.",
      "daily": "Rata-rata proyeksi Bunga harian yang dihasilkan oleh suatu objek, biasanya dari nilai pasarnya.",
      "gainh": "Perolehan rata-rata per jam dari objek tersebut.",
      "dailymax": "Rata-rata proyeksi harian maksimum jika objek berjalan dengan kecepatan penuh."
    },
    "cook": {
      "building": "Keluarga bangunan atau produksi untuk resepnya.",
      "food": "Nama hidangan yang dibandingkan.",
      "cook": "Jumlah hidangan yang dipertahankan dalam penghitungan saat ini.",
      "quantity": "Jumlah piringan yang digunakan dalam mode saat ini.",
      "xp": "Total XP yang diperoleh dari resep atau jumlah yang dipilih.",
      "time": "Waktu memasak mentah dari resep.",
      "timecomp": "Perpanjangan waktu memasak termasuk waktu yang dibutuhkan komponen, untuk membandingkan berat sebenarnya dari resep.",
      "xph": "XP diperoleh per jam memasak.",
      "xphwithcomponentstime": "XP per jam termasuk waktu persiapan komponen.",
      "xpflower": "XP diperoleh per Bunga yang dibelanjakan.",
      "oil": "Minyak yang dikonsumsi sesuai resep saat opsi minyakMakanan aktif.",
      "cost": "Biaya produksi resep.",
      "prod": "Nilai pasar hidangan tersebut, untuk dibandingkan dengan biayanya."
    },
    "fish": {
      "category": "Keluarga ikan atau tingkat kelangkaan.",
      "location": "Area atau lingkungan penangkapan ikan diperlukan untuk tangkapan ini.",
      "fish": "Nama ikan yang dibandingkan.",
      "crustacean": "Nama krustasea yang dibandingkan.",
      "bait": "Umpan wajib atau direkomendasikan untuk tangkapan ini.",
      "quantity": "Kuantitas yang digunakan dalam perhitungan biaya dan XP.",
      "stock": "Stok persediaan saat ini.",
      "caught": "Jumlah yang sudah ditangkap di peternakan.",
      "chum": "Chum digunakan untuk meningkatkan atau menargetkan hasil tangkapan. Biayanya dapat ditambahkan kembali ke perhitungan.",
      "time": "Waktu siklus atau kecepatan terkait dengan objek.",
      "grow": "Waktunya sampai krustasea siap kembali.",
      "ready": "Momen ketika objek tersedia kembali.",
      "cost": "Biaya produksi hasil tangkapan atau siklus.",
      "prod": "Nilai suatu objek di pasar atau dalam produksi, untuk dibandingkan dengan biaya.",
      "xpsfl": "XP diperoleh per Bunga yang dibelanjakan.",
      "tool": "Alat yang dibutuhkan untuk menangkap.",
      "map": "Informasi terkait fragmen peta atau penurunan langka yang terkait dengan peta untuk tangkapan ini."
    },
    "animal": {
      "lvl": "Tingkat hewan. Output siklus bergantung langsung padanya.",
      "prod1": "Rata-rata produksi produk utama per siklus.",
      "prod2": "Rata-rata produksi produk sekunder per siklus.",
      "food": "Makanan yang dikonsumsi untuk satu siklus.",
      "foodcost": "Biaya produksi makanan yang dibutuhkan untuk siklus tersebut.",
      "prodmarket": "Biaya produksi bila komponen dibeli di pasaran.",
      "produ": "Biaya produksi produk per unit.",
      "costu": "Biaya unit nyata dari produk yang dihasilkan oleh hewan."
    },
    "pet": {
      "pet": "Nama hewan peliharaan.",
      "fetch": "Item yang dapat diambil oleh kategori hewan peliharaan ini.",
      "supply": "Jumlah hewan peliharaan yang dimiliki atau tersedia dalam kategori ini.",
      "lvl": "Level hewan peliharaan saat ini.",
      "aura": "Bonus pasif yang diberikan oleh hewan peliharaan.",
      "bib": "Pengaruh perlengkapan hewan peliharaan.",
      "currentenergy": "Energi saat ini tersedia pada hewan peliharaan sebelum perlu diisi ulang berdasarkan permintaan.",
      "requests": "Permintaan makanan yang dipilih digunakan untuk mengisi ulang hewan peliharaan.",
      "energy": "Total energi yang disediakan oleh permintaan yang dipilih.",
      "cost": "Biaya bunga dari permintaan yang dipilih.",
      "prodmarket": "Biaya permintaan yang dipilih ketika semua komponennya dibeli di pasar.",
      "energyflower": "Jumlah energi yang diperoleh per Bunga yang dihabiskan untuk memberi makan hewan peliharaan. Nilai yang lebih tinggi berarti permintaan yang lebih efisien.",
      "energymarket": "Jumlah energi yang diperoleh per nilai pasar yang dikeluarkan untuk memberi makan hewan peliharaan. Berguna untuk membandingkan permintaan dengan biaya berbasis pasar.",
      "shrine": "Nama kuil.",
      "components": "Komponen yang dibutuhkan oleh kuil.",
      "boost": "Efek yang diberikan oleh kuil.",
      "component": "Nama komponen pengambilan atau kuil.",
      "yield": "Jumlah yang dihasilkan oleh hewan peliharaan.",
      "fetchedby": "Hewan peliharaan mana yang dapat mengambil komponen ini.",
      "usedinshrines": "Kuil mana yang menggunakan komponen ini."
    },
    "craft": {
      "name": "Nama objek yang bisa dibuat.",
      "stock": "Stok yang tersedia saat ini.",
      "time": "Waktu kerajinan untuk satu unit.",
      "compos": "Komponen yang dibutuhkan oleh resep.",
      "cost": "Biaya produksi benda yang dibuat.",
      "prod": "Pasar referensi atau nilai jual kembali dibandingkan dengan biaya."
    },
    "cropmachine": {
      "name": "Pangkas diproses oleh Mesin Pangkas.",
      "time": "Waktu yang dibutuhkan untuk batch penuh.",
      "seeds": "Jumlah benih yang digunakan tergantung pada mode Stock, Max atau Custom.",
      "harvestaverage": "Hasil rata-rata dari batch yang diproses.",
      "harvestcost": "Biaya benih per batch.",
      "oil": "Jumlah minyak yang dikonsumsi.",
      "oilcost": "Biaya minyak yang dikonsumsi.",
      "totalcost": "Total biaya batch: benih ditambah minyak.",
      "profit": "Perkiraan laba bersih batch.",
      "gainh": "Keuntungan rata-rata per jam dari batch tersebut.",
      "dailysfl": "Proyeksi Bunga Harian jika tanaman ini menggunakan mesin dalam mode ini."
    },
    "expand": {
      "lvl": "Tahap atau level ekspansi.",
      "bumpkin": "Level Bumpkin yang diperlukan.",
      "farm": "Status peternakan saat ini pada tahap ini.",
      "from": "Tingkat awal.",
      "to": "Tingkat sasaran.",
      "time": "Waktu yang dibutuhkan.",
      "costsfl": "Perkiraan total biaya panggung."
    },
    "buynodes": {
      "node": "Jenis node yang dilacak.",
      "basesunstone": "Harga dasar Sunstone untuk node tersebut.",
      "increaseprice": "Kenaikan harga berlaku untuk setiap pembelian tambahan.",
      "nodesonfarm": "Nomor sudah ada di peternakan.",
      "bought": "Nomor sudah dibeli dalam paket saat ini.",
      "buy": "Jumlah yang akan dibeli dalam simulasi.",
      "nodesafter": "Jumlah total setelah simulasi pembelian.",
      "nextprice": "Harga pembelian selanjutnya jika melanjutkan di node yang sama.",
      "totalsunstone": "Total biaya simulasi Sunstone.",
      "totalobsidian": "Total Obsidian yang ditargetkan atau dibutuhkan dalam simulasi.",
      "totaltimeobsidianfromstock": "Perkiraan waktu untuk mencapai target Obsidian, dengan atau tanpa stok saat ini tergantung pilihan.",
      "buytoreachtotalobsidianprice": "Membantu memperkirakan berapa banyak yang harus dibeli untuk mencapai target Obsidian global dengan biaya tertentu."
    },
    "market": {
      "seller": "Pemain menjual dalam perdagangan.",
      "buyer": "Pembelian pemain dalam perdagangan.",
      "type": "Sifat atau sumber perdagangan yang diamati.",
      "name": "Objek yang diperdagangkan.",
      "qty": "Kuantitas yang diperdagangkan.",
      "sfl": "Harga perdagangan nyata di Bunga.",
      "market": "Referensi nilai pasar digunakan untuk membandingkan perdagangan.",
      "prod": "Perkiraan biaya produksi objek yang sama.",
      "date": "Tanggal perdagangan.",
      "since": "Usia daftar.",
      "offer": "Harga yang diminta untuk penawaran tersebut."
    },
    "chapter": {
      "source": "Sumber tiket: pengiriman, tugas, bounty, bonus atau VIP.",
      "done": "Menunjukkan apa yang sudah selesai dan apa yang masih tersedia.",
      "daily": "Tiket harian disediakan oleh sumber ini.",
      "week": "Proyeksi mingguan sumber ini.",
      "left": "Apa yang tersisa untuk dikumpulkan sebelum bab berakhir.",
      "total": "Proyeksi total pada bab selanjutnya."
    },
    "auctions": {
      "item": "Hadiah atau lot yang ditawarkan dalam lelang atau undian.",
      "type": "Tipe mekanik. Berguna untuk membedakan undian dengan format lelang lainnya.",
      "cur": "Mata uang atau tiket dikonsumsi untuk masuk.",
      "supply": "Jumlah lot atau pemenang yang dibagikan.",
      "end": "Tanggal akhir. Ini adalah kolom terpenting untuk pelacakan.",
      "notifications": "Memungkinkan Anda mengaktifkan peringatan sebelum akhir.",
      "rank": "Peringkat dalam hasil.",
      "username": "Nama pemain di hasil.",
      "xp": "Pemain atau entri XP tergantung pada papan peringkat yang ditampilkan."
    },
    "toplists": {
      "rank": "Posisi dalam peringkat referensi.",
      "id": "Player or farm identifier, useful to cross-check several rankings.",
      "lvl": "Level pemain dalam peringkat yang ditampilkan."
    },
    "activity": {
      "item": "Objek yang dilacak selama periode yang dipilih.",
      "description": "Deskripsi pencarian atau aktivitas.",
      "reward": "Hadiah yang diperoleh dari pencarian atau aktivitas.",
      "cost": "Biaya produksi selama periode tersebut.",
      "market": "Nilai pasar yang diamati selama periode tersebut.",
      "delivery": "Arus atau luka bakar terkait dengan pengiriman.",
      "season": "Filter musim digunakan untuk jendela membaca."
    },
    "home": {
      "item": "Objek atau sub-blok dilacak di Beranda.",
      "nodes": "Jumlah plot atau node yang terlibat.",
      "seeds": "Jumlah benih yang dikomit.",
      "cycles": "Jumlah kemungkinan siklus selama periode tersebut.",
      "harvest": "Perkiraan volume panen.",
      "oil": "Minyak dikonsumsi untuk objek ini.",
      "cost": "Total biaya blok.",
      "market": "Perkiraan nilai pasar blok tersebut.",
      "profit": "Perkiraan laba bersih blok tersebut."
    },
    "flower": {
      "seed": "Bunga itu termasuk dalam keluarga benih. Membantu membaca variasi berdasarkan kelompok.",
      "name": "Nama bunga yang tepat.",
      "breed": "Keturunan atau persilangan dikaitkan dengan bunga ini.",
      "time": "Waktu pertumbuhan bunga.",
      "quant": "Stok saat ini dalam persediaan.",
      "hrvst": "Jumlah yang sudah dipanen di lahan pertanian.",
      "grow": "Jumlahnya saat ini terus bertambah di hamparan bunga."
    },
    "bounty": {
      "name": "Nama sumber daya yang diperoleh dari penggalian.",
      "stock": "Stok saat ini dari sumber daya ini dalam inventaris.",
      "value": "Nilai sumber daya dalam mata uang yang dipilih.",
      "today": "Kuantitas atau nilai yang diharapkan hari ini untuk objek ini.",
      "toolcost": "Biaya alat yang dikonsumsi untuk mendapatkan sumber daya ini.",
      "ratio": "Rasio antara nilai yang diperoleh dan biaya alat. Ini adalah pembacaan profitabilitas tercepat.",
      "patternstoday": "Proyeksi pola hari ini.",
      "patternsvalue": "Nilai terkait dengan pola masa kini.",
      "patternstoolcost": "Biaya alat untuk pola masa kini."
    },
    "factions": {
      "item": "Objek yang diminta oleh faksi hewan peliharaan atau dapur.",
      "cost": "Biaya produksi diperlukan untuk memenuhi permintaan."
    }
  },
  "pageIntroSteps": {
    "home": [
      {
        "id": "home-summary",
        "selector": ".home-left-panel",
        "title": "Ringkasan cepat",
        "text": "Area ini memusatkan informasi pertanian utama: VIP, peti harian, pengiriman, hadiah, perlindungan, dan cooldown yang berguna."
      },
      {
        "id": "home-harvests",
        "selector": ".home-collapsible-wrap",
        "title": "Panen blok",
        "text": "Setiap blok mengelompokkan sekumpulan objek. Buka blok untuk melihat detail objek dan total biaya, pasar, dan keuntungan."
      }
    ],
    "inv": [
      {
        "id": "inv-columns-picker",
        "selector": ".table-container",
        "title": "Pemandangan pertanian",
        "text": "Halaman ini membandingkan inventaris, waktu, biaya, harga pasar, dan hasil. Ini adalah pandangan utama untuk memutuskan apa yang akan diproduksi atau dijual."
      }
    ],
    "cook": [
      {
        "id": "cook-table",
        "selector": ".table-container",
        "title": "Tampilan resep",
        "text": "Di sini Anda membandingkan hidangan berdasarkan stok, XP, waktu dan biaya. Kolom bahan menunjukkan apa yang menghalangi setiap resep."
      }
    ],
    "fish": [
      {
        "id": "fish-table",
        "selector": ".table-container",
        "title": "Pemandangan memancing",
        "text": "Memancing membandingkan hasil, biaya sebenarnya, umpan/sahabat, dan perolehan XP tergantung pada pengaturan aktif atau percobaan Anda."
      }
    ],
    "flower": [
      {
        "id": "flower-table",
        "selector": ".flower-table",
        "title": "Pelacakan bunga",
        "text": "Halaman ini membantu melacak varietas, ras, dan apa yang sudah ditebar, dipanen, atau masih tumbuh."
      }
    ],
    "bounty": [
      {
        "id": "dig-table",
        "selector": ".table-container",
        "title": "Gali profitabilitas",
        "text": "Halaman ini membandingkan nilai temuan dengan biaya alat. Rasio ini membantu menunjukkan apakah pola hari ini atau hari ini layak untuk dilakukan."
      }
    ],
    "animal": [
      {
        "id": "animal-table",
        "selector": ".animal-table, .table-container table",
        "title": "Produksi hewan",
        "text": "Di sini Anda membandingkan keluaran hewan berdasarkan tingkat, biaya pangan, dan biaya unit riil setiap produk."
      }
    ],
    "pet": [
      {
        "id": "pet-table",
        "selector": ".table-container",
        "title": "Pemandangan hewan peliharaan",
        "text": "Bergantung pada subtabel yang ditampilkan, Anda dapat melacak hewan peliharaan, kuil, atau mengambil komponen beserta biaya dan hasil."
      }
    ],
    "craft": [
      {
        "id": "craft-table",
        "selector": ".table-container",
        "title": "resep kerajinan",
        "text": "Halaman ini dengan cepat memeriksa stok, komponen yang dibutuhkan, dan biaya pembuatan dibandingkan dengan nilai pasar."
      }
    ],
    "cropmachine": [
      {
        "id": "cropmachine-table",
        "selector": ".crop-machine-table",
        "title": "Simulasi Mesin Pangkas",
        "text": "Halaman ini mensimulasikan batch Mesin Tanaman: waktu, benih yang digunakan, minyak yang dikonsumsi, total biaya, keuntungan, dan keuntungan harian."
      }
    ],
    "map": [
      {
        "id": "map-grid",
        "selector": ".table-container, table",
        "title": "Peta pulau",
        "text": "Peta ini membantu Anda memvisualisasikan tanaman, mesin, dan proses yang berjalan langsung di pulau."
      }
    ],
    "expand": [
      {
        "id": "expand-table",
        "selector": ".table-container",
        "title": "Rencanakan perluasan",
        "text": "Halaman ini memperkirakan pulau, sumber daya, waktu dan biaya yang diperlukan sebelum membeli atau mempersiapkan perluasan."
      }
    ],
    "buynodes": [
      {
        "id": "buynodes-table",
        "selector": ".table-container",
        "title": "Beli node",
        "text": "Tampilan ini membantu memprioritaskan pembelian node berdasarkan harga, apa yang sudah dibeli, dan perkiraan biaya berikutnya."
      }
    ],
    "market": [
      {
        "id": "market-offers",
        "selector": ".table",
        "title": "Penawaran dan perdagangan",
        "text": "Halaman pasar merangkum penawaran dan perdagangan yang terkait dengan pertanian Anda untuk membandingkan harga sebenarnya, biaya produksi, dan aliran Bunga."
      }
    ],
    "factions": [
      {
        "id": "factions-grid",
        "selector": ".factions-grid",
        "title": "Kartu faksi",
        "text": "Setiap kartu menunjukkan faksi hewan peliharaan, kemajuan, pukulan, dan biaya dapur atau permintaan hewan peliharaan."
      }
    ],
    "chapter": [
      {
        "id": "chapter-table",
        "selector": ".chapter-table",
        "title": "Proyeksi bab",
        "text": "Tabel ini memproyeksikan tiket musiman mulai dari pengiriman, hadiah, tugas, bonus, dan opsi biaya."
      },
      {
        "id": "chapter-cost-mode",
        "selector": ".chapter-cost-mode-picker",
        "title": "Modus biaya",
        "text": "Anda dapat beralih antara biaya produksi dan biaya pasar untuk membandingkan rute yang menguntungkan dengan rute yang lebih cepat."
      },
      {
        "id": "chapter-total",
        "selector": ".chapter-total-row",
        "title": "Jumlah baris",
        "text": "Totalnya memadatkan tiket dan biaya untuk keseluruhan seleksi."
      }
    ],
    "auctions": [
      {
        "id": "auctions-range",
        "selector": "#auctions-start-date",
        "title": "Rentang tanggal",
        "text": "Memfilter lelang di dalam jendela tanggal tertentu."
      },
      {
        "id": "auctions-list",
        "selector": ".table-container table",
        "title": "Daftar lelang",
        "text": "Klik suatu objek untuk memuat tampilan detailnya."
      }
    ],
    "toplists": [
      {
        "id": "toplists-toolbar",
        "selector": ".toplists-toolbar",
        "title": "Pilih peringkat",
        "text": "Pilih kategori atau objek, lalu segarkan untuk membuat tabel daftar teratas gabungan Anda."
      },
      {
        "id": "toplists-table",
        "selector": ".toplists-table",
        "title": "Perbandingan multi-peringkat",
        "text": "Tabel tersebut menggabungkan beberapa peringkat pada pemain yang sama."
      }
    ],
    "activity": [
      {
        "id": "activity-table",
        "selector": ".table-container",
        "title": "Aktivitas membaca",
        "text": "Halaman ini menganalisis apa yang diproduksi, dibakar, atau dikonversi selama suatu periode."
      }
    ]
  },
  "baseSteps": [
    {
      "id": "options",
      "selector": "button[title=\"Options\"]",
      "title": "1. Konfigurasikan perhitungan",
      "text": "Di sini Anda menyesuaikan opsi yang mengubah hasil yang ditampilkan di seluruh aplikasi."
    },
    {
      "id": "autorefresh",
      "selector": ".coach-search-refresh-target",
      "title": "2. Cari dan segarkan otomatis",
      "text": "Tombol pencarian, penyegaran manual, dan dering penyegaran otomatis."
    },
    {
      "id": "trades",
      "selector": ".tabletrades",
      "title": "3. Perdagangan terkini",
      "text": "Objek ini merangkum listing atau perdagangan terkini untuk pertanian tersebut. Klik untuk membuka detail lebih lanjut."
    },
    {
      "id": "page-select",
      "selector": ".header-page-select .cd-btn, .header-market-select .cd-btn",
      "title": "4. Ganti halaman",
      "text": "Pemilih ini menavigasi antara Beranda, Peternakan, Juru Masak, Ikan, Cabang, Pasar, Daftar, dan tampilan lainnya."
    },
    {
      "id": "boosts-shortcut",
      "selector": ".top-frame .coach-boosts-btn",
      "title": "5. Peningkatan / NFT",
      "text": "Tombol ini membuka tampilan Peningkatan untuk mengonfigurasi kombinasi aktif atau uji."
    },
    {
      "id": "deliveries-shortcut",
      "selector": "button[title=\"Deliveries\"]",
      "title": "6. Pengiriman",
      "text": "Pintasan ini membuka pengiriman, tugas, dan konten hadiah yang ditautkan ke Plaza."
    },
    {
      "id": "tryset-switch",
      "selector": ".top-frame .coach-tryset-switch",
      "title": "7. Set aktif / Tryset",
      "text": "Set aktif membaca peternakan saat ini. Tryset mensimulasikan NFT atau pengaturan keterampilan lain untuk membandingkan hasil."
    },
    {
      "id": "help",
      "selector": ".top-frame .coach-help-btn",
      "title": "8. Putar ulang turnya",
      "text": "Tombol ini memulai kembali tur terpandu kapan pun Anda mau."
    }
  ]
};

export default locale;
