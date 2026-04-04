const locale = {
  "code": "vi",
  "ui": {
    "localeName": "Tiếng Việt",
    "languageLabel": "Ngôn ngữ",
    "baseMode": "Căn cứ",
    "currentPageMode": "Trang hiện tại",
    "step": "Bước chân",
    "helpTitle": "Giúp đỡ",
    "nextHint": "Đi tới bước tiếp theo.",
    "missingZone": "Không tìm thấy vùng trên màn hình này. Đi tới bước tiếp theo.",
    "previous": "Trước",
    "next": "Kế tiếp",
    "finish": "Hoàn thành",
    "close": "Đóng",
    "currentPageFallback": "Trang hiện tại",
    "columnPrefix": "Cột",
    "groupTitle": "Nhóm cột",
    "groupText": "Những cột này nên được đọc cùng nhau.",
    "pageSummaryPrefix": "Khu vực này tóm tắt trang",
    "pageSummarySuffix": "Tải dữ liệu xem để có được thông tin chi tiết đầy đủ."
  },
  "pageLabels": {
    "home": "Trang chủ",
    "inv": "Nông trại",
    "cook": "Đầu bếp",
    "fish": "Cá",
    "flower": "hoa",
    "bounty": "đào",
    "animal": "Động vật",
    "pet": "Thú cưng",
    "craft": "thủ công",
    "cropmachine": "Máy cắt cỏ",
    "map": "Bản đồ",
    "expand": "Mở rộng",
    "buynodes": "Mua nút",
    "factions": "Phe phái",
    "market": "Chợ",
    "chapter": "chương",
    "auctions": "Đấu giá",
    "toplists": "Danh sách",
    "activity": "Hoạt động"
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
    "home": "Khu vực này giúp bạn đọc trạng thái hàng ngày của trang trại: các quy trình đã hoàn thành, thu hoạch đang diễn ra, thời gian hồi chiêu và các khối ưu tiên.",
    "inv": "Cột này giúp so sánh các đối tượng trong chế độ xem Trang trại, chủ yếu thông qua tồn kho, thời gian, chi phí, giá trị thị trường và sản lượng.",
    "cook": "Cột này giúp so sánh một công thức nấu ăn trong Cook, đặc biệt là với XP, thời gian và chi phí thực.",
    "fish": "Cột này giúp so sánh sản lượng đánh bắt, chi phí, độ hiếm và lợi nhuận của chúng trong Cá.",
    "flower": "Cột này giúp theo dõi hoa theo họ, giống, số lượng và tốc độ tăng trưởng.",
    "bounty": "Cột này giúp đánh giá giá trị đào dựa trên chi phí công cụ và các mẫu hàng ngày.",
    "animal": "Cột này giúp so sánh chu kỳ sống của động vật, thức ăn của chúng và giá thành đơn vị sản phẩm.",
    "pet": "Cột này giúp đọc giá trị của thành phần thú cưng, đền thờ hoặc tìm nạp.",
    "craft": "Cột này giúp kiểm tra hàng tồn kho, linh kiện và chi phí chế tạo.",
    "cropmachine": "Cột này giúp mô phỏng một lô Máy trồng trọt về chi phí, lợi nhuận và dự báo hàng ngày.",
    "map": "Khu vực này giúp bạn hình dung trực tiếp những gì đang phát triển, đang chạy hoặc đang chờ hành động trên đảo.",
    "expand": "Cột này giúp lập kế hoạch mở rộng về thời gian, nguồn lực và chi phí.",
    "buynodes": "Cột này giúp ưu tiên mua nút dựa trên giá hiện tại và giá tiếp theo.",
    "factions": "Khu vực này giúp đọc tiến độ phe phái, pet hàng tuần và chi phí yêu cầu.",
    "market": "Cột này giúp so sánh các chào hàng thực tế và các giao dịch liên quan đến trang trại.",
    "chapter": "Cột này giúp dự án và chi phí để hoàn thành chương.",
    "auctions": "Cột này giúp theo dõi một cuộc đấu giá hoặc xổ số thông qua việc tham gia, thời gian kết thúc và phần thưởng.",
    "toplists": "Cột này giúp so sánh người chơi trên các bảng xếp hạng hợp nhất.",
    "activity": "Cột này giúp đọc các luồng thực tế của trang trại trong một khoảng thời gian: sản xuất, đốt cháy, vé, Hoa và tiền xu."
  },
  "commonExplanations": {
    "rank": "Vị trí trong bảng xếp hạng hiển thị.",
    "id": "Identifier of the player or farm, useful for matching the same entry elsewhere.",
    "lvl": "Cấp độ của trang trại, thú cưng hoặc đối tượng được so sánh.",
    "name": "Tên của đối tượng được hiển thị trong bảng.",
    "item": "Tên của đối tượng được hiển thị trong bảng.",
    "fish": "Tên của đối tượng được hiển thị trong bảng.",
    "pet": "Tên của vật nuôi hoặc đồ vật liên quan.",
    "component": "Tên của thành phần liên quan.",
    "shrine": "Tên của ngôi đền liên quan.",
    "source": "Nguồn của lợi ích, chi phí hoặc phản ánh này.",
    "qty": "Số lượng hiển thị cho đối tượng này.",
    "quantity": "Số lượng hiển thị cho đối tượng này.",
    "stock": "Hiện tại có sẵn hàng cho đối tượng này.",
    "supply": "Số tiền có sẵn hoặc được phân bổ cho đối tượng này.",
    "cost": "Chi phí ước tính cho đối tượng này ở chế độ tính toán hiện hoạt.",
    "prod": "Giá trị sản xuất của đối tượng, để so sánh với giá trị thị trường hoặc giá thành.",
    "betty": "Giá trị thu được nếu bạn bán đồ vật này cho Betty.",
    "market": "Giá trị thị trường ước tính của đối tượng.",
    "offer": "Giá yêu cầu cho ưu đãi thị trường này.",
    "ratio": "Tỷ lệ so sánh cho đối tượng này. Giá trị cao hơn thường có nghĩa là chuyển đổi tốt hơn hoặc lợi nhuận tốt hơn so với các đối tượng khác.",
    "time": "Thời gian tăng trưởng, thủ công hoặc chu kỳ cần thiết cho đối tượng này.",
    "ready": "Thời điểm đồ vật sẵn sàng hoặc thời gian còn lại trước khi đồ vật sẵn sàng.",
    "when": "Thời điểm mà đối tượng sẽ sẵn sàng.",
    "grow": "Thời gian tăng trưởng hoặc tiến độ tăng trưởng của đối tượng.",
    "end": "Thời gian kết thúc của đối tượng, sự kiện hoặc chu kỳ này.",
    "since": "Tuổi của ưu đãi hoặc sự kiện này.",
    "date": "Ngày liên kết với đối tượng hoặc sự kiện này.",
    "xp": "XP thu được hoặc liên kết với đối tượng này.",
    "profit": "Lợi nhuận ròng ước tính cho đối tượng này sau khi loại bỏ chi phí.",
    "profitpercent": "Tỷ lệ sinh lời của đối tượng so với chi phí sản xuất.",
    "diff": "Khoảng cách giữa hai giá trị so sánh cho đối tượng này.",
    "coef": "Hệ số so sánh giữa hai giá trị cho đối tượng này.",
    "withdraw": "Số tiền thực sự có thể được phục hồi sau các quy tắc rút tiền.",
    "dailymax": "Chiếu tối đa hàng ngày cho đối tượng này.",
    "dailymaxaverage": "Hình chiếu trung bình tối đa hàng ngày nếu đối tượng chạy trong điều kiện tốt nhất.",
    "dailyflower": "M?c d? ph?ng Flower trung b?nh m?i ng?y do ??i t??ng t?o ra theo th?i gian farm h?ng ng?y c?a b?n v? s? restock ?? c?u h?nh trong ph?n t?y ch?n.",
    "daily": "Dự báo trung bình hàng ngày cho đối tượng này.",
    "gainh": "Mức tăng trung bình mỗi giờ cho đối tượng này.",
    "chng": "Thay đổi giá trị gần đây của đối tượng này trong khoảng thời gian đã chọn.",
    "chngpercent": "Thay đổi giá gần đây của đối tượng trong khoảng thời gian đã chọn.",
    "yield": "Sản lượng trung bình của đối tượng với thiết lập đang hoạt động.",
    "harvest": "Số lượng trung bình bạn có thể thu hoạch đối với đối tượng này.",
    "harvestaverage": "Số lượng trung bình bạn có thể thu hoạch cho đối tượng này.",
    "toharvest": "Số lượng đối tượng này đã tăng lên và sắp sẵn sàng cho thu hoạch.",
    "toharvestgrowing": "Số lượng đối tượng này đã được cam kết tăng trưởng tại trang trại.",
    "done": "Hiển thị những gì đã được hoàn thành cho mục tiêu này.",
    "left": "Hiển thị những gì còn lại để làm hoặc có được.",
    "total": "Tổng dự kiến ​​hoặc tích lũy cho đối tượng này.",
    "notification": "Cho phép bạn kích hoạt cảnh báo cho đối tượng này.",
    "notifications": "Cho phép bạn kích hoạt cảnh báo cho đối tượng này.",
    "season": "Hiển thị mùa nào đối tượng này có sẵn và cho phép bạn lọc phần được hiển thị.",
    "buy": "Cho biết liệu đối tượng có được mua trực tiếp thay vì sản xuất hay không."
  },
  "pageColumnExplanations": {
    "inv": {
      "season": "Bộ lọc này giới hạn bảng ở những đối tượng có sẵn trong phần đã chọn.",
      "item": "Tên của đối tượng được theo dõi trong trang trại. Nó là đối tượng cơ sở được sử dụng bởi tất cả các tính toán chi phí, thị trường và lợi nhuận.",
      "hrvmax": "Số lượng thu hoạch tối đa trong ngày đối với đối tượng này tùy theo thiết lập, nút và mức tăng hoạt động.",
      "hrv": "Giá trị thu hoạch được sử dụng bởi chế độ Hàng ngày. Bạn có thể điều chỉnh nó để mô phỏng một ngày thực thay vì mức tối đa theo lý thuyết.",
      "quantity": "Bộ chọn này thay đổi số lượng được sử dụng trong tất cả các phép tính trên trang. Trang trại = số lượng hiện có trong trang trại. Hàng ngày = số lượng bạn có thể sản xuất mỗi ngày. Restock = sản lượng được thêm vào bởi một lần restock. Tùy chỉnh = giá trị thủ công cho mô phỏng của riêng bạn.",
      "time": "Thời gian tăng trưởng hoặc chu kỳ cần thiết để tạo ra đối tượng.",
      "cost": "Bộ chọn này thay đổi cách đọc chi phí. / Đơn vị = chi phí để sản xuất một đơn vị. x Số lượng = tổng chi phí cho số lượng đã chọn trong Số lượng. được tính = cũng bao gồm các chi phí phụ đã được tính ở nơi khác.",
      "buy": "Hộp kiểm đánh dấu đối tượng là đã mua thay vì đã sản xuất. Điều này làm thay đổi chi phí được sử dụng bởi các công thức và so sánh theo chuỗi.",
      "betty": "Giá trị bạn nhận được khi bán đồ vật đó cho Betty. Hữu ích khi so sánh giá được đảm bảo với giá trị thị trường.",
      "ratio": "Số xu kiếm được trên mỗi bông hoa chi tiêu hoặc cam kết. Giá trị cao hơn có nghĩa là việc chuyển đổi từ cửa hàng sang tiền xu sẽ thuận lợi hơn.",
      "market": "Giá trị thị trường ước tính của đối tượng.",
      "profit": "Biên độ tương đối giữa giá trị thị trường và chi phí sản xuất. Nó cho thấy liệu việc tự mình sản xuất đồ vật đó có còn mang lại lợi thế kinh tế hay không.",
      "withdraw": "Giá trị có thể rút sau các quy tắc rút tiền và thuế. Hữu ích để tách giá trị thô khỏi những gì bạn thực sự có thể phục hồi.",
      "diff": "Khoảng cách giữa hai tham chiếu giá. Điều này giúp bạn nhanh chóng nhận ra khi nào thị trường khác với một giá trị so sánh khác.",
      "coef": "Hệ số giữa chi phí sản xuất và giá bán. Nó cho thấy thị trường cách xa giá thực tế đến mức nào.",
      "chng": "Thay đổi giá gần đây trong khoảng thời gian đã chọn. Hữu ích để phát hiện các vật thể đang tăng hoặc giảm nhanh chóng.",
      "yield": "Sản xuất thô một nút theo thiết lập hoặc bộ thử đang hoạt động.",
      "harvest": "Số lượng trung bình bạn có thể thu hoạch đối với đối tượng này.",
      "toharvest": "Số lượng đã tăng lên ở trang trại và sẽ sớm được thu hoạch. Đây là sản phẩm thực sự của bạn, không chỉ là sản phẩm lý thuyết.",
      "ready": "Hiển thị thời gian sẵn sàng hoặc thời gian còn lại cho đến khi đối tượng sẵn sàng, tùy thuộc vào chế độ đã chọn.",
      "when": "Chế độ cột sẵn sàng hiển thị thời gian sẵn sàng chính xác.",
      "remain": "Chế độ cột sẵn sàng hiển thị thời gian còn lại.",
      "1restock": "Dự báo sản lượng cho một lần bổ sung hàng lại. Hữu ích để đo lường tác động tối thiểu của một lần nạp mà không cần xem xét cả ngày.",
      "dailyflower": "M?c d? ph?ng Flower trung b?nh m?i ng?y do ??i t??ng t?o ra theo th?i gian farm h?ng ng?y c?a b?n v? s? restock ?? c?u h?nh trong ph?n t?y ch?n.",
      "daily": "Phép chiếu hoa trung bình hàng ngày do đối tượng tạo ra, thường là từ giá trị thị trường của nó.",
      "gainh": "Mức tăng trung bình mỗi giờ của đối tượng.",
      "dailymax": "Hình chiếu tối đa trung bình hàng ngày nếu đối tượng chạy ở tốc độ tối đa."
    },
    "cook": {
      "building": "Xây dựng hoặc sản xuất dòng sản phẩm cho công thức.",
      "food": "Tên món ăn được so sánh",
      "cook": "Số lượng đĩa được giữ lại trong tính toán hiện tại.",
      "quantity": "Số lượng món ăn được sử dụng ở chế độ hiện tại.",
      "xp": "Tổng XP thu được từ công thức hoặc số lượng đã chọn.",
      "time": "Thời gian nấu thô của công thức.",
      "timecomp": "Thời gian nấu kéo dài bao gồm cả thời gian cần thiết cho các thành phần, để so sánh trọng lượng thực của công thức.",
      "xph": "XP đạt được mỗi giờ nấu ăn.",
      "xphwithcomponentstime": "XP mỗi giờ bao gồm cả thời gian chuẩn bị thành phần.",
      "xpflower": "XP nhận được trên mỗi bông hoa chi tiêu.",
      "oil": "Dầu được công thức tiêu thụ khi tùy chọn oilFood được kích hoạt.",
      "cost": "Chi phí sản xuất công thức.",
      "prod": "Giá trị thị trường của món ăn, để so sánh với giá thành của nó."
    },
    "fish": {
      "category": "Họ cá hoặc cấp độ hiếm.",
      "location": "Khu vực hoặc môi trường đánh bắt cần thiết cho hoạt động đánh bắt này.",
      "fish": "Tên của loài cá được so sánh",
      "crustacean": "Tên loài giáp xác so sánh.",
      "bait": "Mồi cần thiết hoặc được đề nghị cho lần đánh bắt này.",
      "quantity": "Số lượng được sử dụng trong tính toán chi phí và XP.",
      "stock": "Hàng tồn kho hiện tại.",
      "caught": "Số lượng đã được đánh bắt tại trang trại.",
      "chum": "Chum dùng để cải thiện hoặc nhắm mục tiêu đánh bắt. Chi phí của nó có thể được cộng lại vào tính toán.",
      "time": "Thời gian hoặc tốc độ của chu kỳ được liên kết với đối tượng.",
      "grow": "Thời gian cho đến khi loài giáp xác sẵn sàng trở lại.",
      "ready": "Thời điểm đối tượng trở lại khả dụng.",
      "cost": "Chi phí sản xuất của mẻ đánh bắt hoặc chu trình.",
      "prod": "Giá trị đối tượng trên thị trường hoặc trong sản xuất để so sánh với giá thành.",
      "xpsfl": "XP nhận được trên mỗi bông hoa chi tiêu.",
      "tool": "Công cụ cần thiết để đánh bắt.",
      "map": "Thông tin liên quan đến các mảnh bản đồ hoặc những phần hiếm có liên quan đến bản đồ cho lần đánh bắt này."
    },
    "animal": {
      "lvl": "Cấp độ động vật. Đầu ra chu kỳ phụ thuộc trực tiếp vào nó.",
      "prod1": "Sản lượng trung bình của sản phẩm chính trong mỗi chu kỳ.",
      "prod2": "Sản lượng trung bình của sản phẩm thứ cấp trong mỗi chu kỳ.",
      "food": "Thực phẩm tiêu thụ trong một chu kỳ.",
      "foodcost": "Chi phí sản xuất thực phẩm cần thiết cho chu kỳ.",
      "prodmarket": "Chi phí sản xuất khi linh kiện được mua trên thị trường.",
      "produ": "Giá thành sản xuất một đơn vị sản phẩm.",
      "costu": "Giá thành đơn vị thực tế của sản phẩm do động vật tạo ra."
    },
    "pet": {
      "pet": "Tên của thú cưng.",
      "fetch": "Các vật phẩm thuộc loại thú cưng này có thể lấy được.",
      "supply": "Số vật nuôi được sở hữu hoặc có sẵn trong danh mục này.",
      "lvl": "Cấp độ hiện tại của thú cưng.",
      "aura": "Phần thưởng thụ động do thú cưng cung cấp.",
      "bib": "Tác dụng của thiết bị thú cưng.",
      "currentenergy": "Năng lượng hiện có sẵn trên thú cưng trước khi nó cần được nạp lại theo yêu cầu.",
      "requests": "Yêu cầu thực phẩm được lựa chọn được sử dụng để nạp năng lượng cho thú cưng.",
      "energy": "Tổng năng lượng được cung cấp bởi các yêu cầu đã chọn.",
      "cost": "Giá hoa của các yêu cầu đã chọn.",
      "prodmarket": "Chi phí của các yêu cầu đã chọn khi tất cả các thành phần của chúng được mua trên thị trường.",
      "energyflower": "Lượng năng lượng thu được trên mỗi bông hoa dùng để nuôi thú cưng. Giá trị cao hơn có nghĩa là yêu cầu hiệu quả hơn.",
      "energymarket": "Lượng năng lượng thu được trên mỗi giá trị thị trường dành cho việc nuôi thú cưng. Hữu ích cho việc so sánh các yêu cầu với chi phí dựa trên thị trường.",
      "shrine": "Tên của ngôi đền.",
      "components": "Các thành phần theo yêu cầu của đền thờ.",
      "boost": "Hiệu ứng do đền thờ ban tặng.",
      "component": "Tên của thành phần tìm nạp hoặc điện thờ.",
      "yield": "Số lượng được sản xuất bởi vật nuôi.",
      "fetchedby": "Những vật nuôi nào có thể lấy thành phần này.",
      "usedinshrines": "Những ngôi đền tiêu thụ thành phần này."
    },
    "craft": {
      "name": "Tên của đối tượng có thể chế tạo được.",
      "stock": "Hàng có sẵn hiện tại.",
      "time": "Thời gian chế tạo cho một đơn vị.",
      "compos": "Các thành phần theo yêu cầu của công thức.",
      "cost": "Chi phí sản xuất của đối tượng được chế tạo.",
      "prod": "Thị trường tham khảo hoặc giá trị bán lại so với giá thành."
    },
    "cropmachine": {
      "name": "Cắt được xử lý bằng Máy cắt.",
      "time": "Thời gian cần thiết cho toàn bộ đợt.",
      "seeds": "Số lượng hạt giống được sử dụng tùy thuộc vào chế độ Stock, Max hoặc Custom.",
      "harvestaverage": "Năng suất trung bình của lô chế biến.",
      "harvestcost": "Chi phí hạt giống của lô.",
      "oil": "Lượng dầu tiêu thụ.",
      "oilcost": "Chi phí dầu tiêu thụ.",
      "totalcost": "Tổng chi phí lô: hạt cộng với dầu.",
      "profit": "Lợi nhuận ròng ước tính của lô.",
      "gainh": "Lợi nhuận trung bình mỗi giờ của lô.",
      "dailysfl": "Chiếu hoa hàng ngày nếu cây trồng này sử dụng máy ở chế độ này."
    },
    "expand": {
      "lvl": "Giai đoạn hoặc cấp độ mở rộng.",
      "bumpkin": "Yêu cầu cấp độ Pumpkin.",
      "farm": "Trạng thái trang trại hiện tại ở giai đoạn này.",
      "from": "Mức độ bắt đầu.",
      "to": "Cấp độ mục tiêu.",
      "time": "Thời gian cần thiết.",
      "costsfl": "Ước tính tổng chi phí của giai đoạn."
    },
    "buynodes": {
      "node": "Loại nút được theo dõi.",
      "basesunstone": "Giá Sunstone cơ bản cho nút.",
      "increaseprice": "Tăng giá áp dụng cho mỗi lần mua thêm.",
      "nodesonfarm": "Số lượng đã có mặt trên trang trại.",
      "bought": "Số đã mua trong gói hiện tại.",
      "buy": "Số lượng cần mua trong mô phỏng.",
      "nodesafter": "Tổng số sau khi mua mô phỏng.",
      "nextprice": "Giá của lần mua tiếp theo nếu bạn tiếp tục trên cùng một nút.",
      "totalsunstone": "Tổng chi phí Sunstone của mô phỏng.",
      "totalobsidian": "Tổng Obsidian được nhắm mục tiêu hoặc được yêu cầu trong mô phỏng.",
      "totaltimeobsidianfromstock": "Thời gian ước tính để đạt mục tiêu Obsidian, có hoặc không có hàng hiện tại tùy theo lựa chọn.",
      "buytoreachtotalobsidianprice": "Giúp ước tính số lượng cần mua để đạt được mục tiêu Obsidian toàn cầu với mức chi phí nhất định."
    },
    "market": {
      "seller": "Người chơi bán trong giao dịch.",
      "buyer": "Người chơi mua trong giao dịch.",
      "type": "Bản chất hoặc nguồn gốc của giao dịch được quan sát.",
      "name": "Đối tượng được giao dịch.",
      "qty": "Số lượng đã giao dịch.",
      "sfl": "Giá giao dịch thực tế ở Hoa.",
      "market": "Giá trị thị trường tham chiếu được sử dụng để so sánh giao dịch.",
      "prod": "Ước tính chi phí sản xuất của cùng một đối tượng.",
      "date": "Ngày giao dịch.",
      "since": "Tuổi của danh sách.",
      "offer": "Giá yêu cầu cho lời đề nghị."
    },
    "chapter": {
      "source": "Nguồn vé: giao hàng, công việc, tiền thưởng, tiền thưởng hoặc VIP.",
      "done": "Hiển thị những gì đã hoàn thành và những gì vẫn còn.",
      "daily": "Vé hàng ngày được cung cấp bởi nguồn này.",
      "week": "Dự báo hàng tuần của nguồn này.",
      "left": "Những gì còn lại để thu thập trước khi kết thúc chương.",
      "total": "Tổng dự kiến ​​cho chương còn lại."
    },
    "auctions": {
      "item": "Phần thưởng hoặc lô được đưa ra trong cuộc đấu giá hoặc xổ số.",
      "type": "Loại thợ cơ khí. Hữu ích để phân biệt xổ số với hình thức đấu giá khác.",
      "cur": "Tiền tệ hoặc vé tiêu thụ để vào.",
      "supply": "Số lô hoặc số người chiến thắng được phân phối.",
      "end": "Ngày kết thúc. Đây là cột quan trọng nhất để theo dõi.",
      "notifications": "Cho phép bạn kích hoạt cảnh báo trước khi kết thúc.",
      "rank": "Xếp hạng trong kết quả.",
      "username": "Tên người chơi trong kết quả.",
      "xp": "Người chơi hoặc mục XP tùy thuộc vào bảng xếp hạng được hiển thị."
    },
    "toplists": {
      "rank": "Vị trí trong bảng xếp hạng tham khảo.",
      "id": "Player or farm identifier, useful to cross-check several rankings.",
      "lvl": "Cấp độ người chơi trong bảng xếp hạng hiển thị."
    },
    "activity": {
      "item": "Đối tượng được theo dõi trong khoảng thời gian đã chọn.",
      "description": "Mô tả nhiệm vụ hoặc hoạt động.",
      "reward": "Phần thưởng nhận được từ nhiệm vụ hoặc hoạt động.",
      "cost": "Chi phí sản xuất trong kỳ.",
      "market": "Giá trị thị trường được quan sát trong kỳ.",
      "delivery": "Chảy hoặc bỏng liên quan đến việc giao hàng.",
      "season": "Bộ lọc theo mùa được sử dụng cho cửa sổ đọc."
    },
    "home": {
      "item": "Đối tượng hoặc khối phụ được theo dõi trong Trang chủ.",
      "nodes": "Số lượng ô hoặc nút liên quan.",
      "seeds": "Số lượng hạt giống được cam kết.",
      "cycles": "Số chu kỳ có thể xảy ra trong kỳ.",
      "harvest": "Khối lượng thu hoạch ước tính",
      "oil": "Dầu tiêu hao cho đối tượng này.",
      "cost": "Tổng chi phí của khối.",
      "market": "Giá trị thị trường ước tính của khối.",
      "profit": "Lợi nhuận ròng ước tính của khối."
    },
    "flower": {
      "seed": "Họ hạt giống của hoa. Giúp đọc giống theo nhóm.",
      "name": "Tên hoa chính xác.",
      "breed": "Các giống hoặc cây lai liên kết với loài hoa này.",
      "time": "Thời gian phát triển của hoa.",
      "quant": "Hàng tồn kho hiện tại.",
      "hrvst": "Số lượng đã được thu hoạch tại trang trại.",
      "grow": "Số lượng hiện đang tăng trong các luống hoa."
    },
    "bounty": {
      "name": "Tên tài nguyên thu được từ việc đào.",
      "stock": "Hiện tại nguồn tài nguyên này đang còn trong kho.",
      "value": "Giá trị của tài nguyên bằng loại tiền đã chọn.",
      "today": "Số lượng hoặc giá trị dự kiến ​​hôm nay cho đối tượng này.",
      "toolcost": "Chi phí công cụ tiêu thụ để có được tài nguyên này.",
      "ratio": "Tỷ lệ giữa giá trị thu được và chi phí công cụ. Đây là cách đọc lợi nhuận nhanh nhất.",
      "patternstoday": "Phép chiếu hôm nay cho các mẫu.",
      "patternsvalue": "Giá trị được liên kết với các mẫu ngày nay.",
      "patternstoolcost": "Chi phí công cụ cho các mẫu ngày nay."
    },
    "factions": {
      "item": "Đối tượng được yêu cầu bởi thú cưng của phe hoặc nhà bếp.",
      "cost": "Chi phí sản xuất cần thiết để đáp ứng yêu cầu."
    }
  },
  "pageIntroSteps": {
    "home": [
      {
        "id": "home-summary",
        "selector": ".home-left-panel",
        "title": "Tóm tắt nhanh",
        "text": "Khu vực này tập trung thông tin quan trọng của trang trại: VIP, rương hàng ngày, giao hàng, tiền thưởng, biện pháp bảo vệ và thời gian hồi chiêu hữu ích."
      },
      {
        "id": "home-harvests",
        "selector": ".home-collapsible-wrap",
        "title": "khối thu hoạch",
        "text": "Mỗi khối nhóm một nhóm đối tượng. Mở một khối để xem các đối tượng chi tiết và tổng chi phí, thị trường và lợi nhuận."
      }
    ],
    "inv": [
      {
        "id": "inv-columns-picker",
        "selector": ".table-container",
        "title": "Chế độ xem trang trại",
        "text": "Trang này so sánh hàng tồn kho, thời gian, chi phí, giá thị trường và sản lượng. Quan điểm chính là quyết định sản xuất hoặc bán cái gì."
      }
    ],
    "cook": [
      {
        "id": "cook-table",
        "selector": ".table-container",
        "title": "Chế độ xem công thức",
        "text": "Tại đây bạn so sánh các món ăn thông qua kho, XP, thời gian và chi phí. Các cột thành phần hiển thị những gì cản trở mỗi công thức."
      }
    ],
    "fish": [
      {
        "id": "fish-table",
        "selector": ".table-container",
        "title": "Chế độ xem câu cá",
        "text": "Câu cá so sánh sản lượng, chi phí thực, mồi/chum và mức tăng XP tùy thuộc vào thiết lập hoặc số lần thử đang hoạt động của bạn."
      }
    ],
    "flower": [
      {
        "id": "flower-table",
        "selector": ".flower-table",
        "title": "Theo dõi hoa",
        "text": "Trang này giúp theo dõi các giống, giống hữu ích và những gì đã được thả giống, thu hoạch hoặc vẫn đang phát triển."
      }
    ],
    "bounty": [
      {
        "id": "dig-table",
        "selector": ".table-container",
        "title": "Đào lợi nhuận",
        "text": "Trang này so sánh giá trị tìm thấy với chi phí công cụ. Tỷ lệ này giúp cho biết liệu các mô hình trong ngày hay hôm nay có đáng nỗ lực hay không."
      }
    ],
    "animal": [
      {
        "id": "animal-table",
        "selector": ".animal-table, .table-container table",
        "title": "Sản xuất động vật",
        "text": "Tại đây bạn so sánh sản lượng vật nuôi theo cấp độ, chi phí thức ăn và đơn giá thực tế của từng sản phẩm."
      }
    ],
    "pet": [
      {
        "id": "pet-table",
        "selector": ".table-container",
        "title": "Chế độ xem thú cưng",
        "text": "Tùy thuộc vào bảng phụ được hiển thị, bạn có thể theo dõi vật nuôi, đền thờ hoặc lấy các thành phần cùng với chi phí và sản lượng của chúng."
      }
    ],
    "craft": [
      {
        "id": "craft-table",
        "selector": ".table-container",
        "title": "công thức nấu ăn thủ công",
        "text": "Trang này nhanh chóng kiểm tra lượng hàng tồn kho, các thành phần cần thiết và chi phí chế tạo so với giá trị thị trường."
      }
    ],
    "cropmachine": [
      {
        "id": "cropmachine-table",
        "selector": ".crop-machine-table",
        "title": "Mô phỏng máy cắt",
        "text": "Trang này mô phỏng các lô Máy trồng trọt: thời gian, hạt giống được sử dụng, lượng dầu tiêu thụ, tổng chi phí, lợi nhuận và thu nhập hàng ngày."
      }
    ],
    "map": [
      {
        "id": "map-grid",
        "selector": ".table-container, table",
        "title": "Bản đồ đảo",
        "text": "Bản đồ giúp bạn hình dung trực tiếp cây trồng, máy móc và quy trình đang chạy trên đảo."
      }
    ],
    "expand": [
      {
        "id": "expand-table",
        "selector": ".table-container",
        "title": "Kế hoạch mở rộng",
        "text": "Trang này ước tính các đảo, tài nguyên, thời gian và chi phí cần thiết trước khi mua hoặc chuẩn bị mở rộng."
      }
    ],
    "buynodes": [
      {
        "id": "buynodes-table",
        "selector": ".table-container",
        "title": "Mua nút",
        "text": "Chế độ xem này giúp ưu tiên mua nút theo giá, những gì đã mua và chi phí dự kiến ​​tiếp theo."
      }
    ],
    "market": [
      {
        "id": "market-offers",
        "selector": ".table",
        "title": "Ưu đãi và giao dịch",
        "text": "Trang thị trường tóm tắt các ưu đãi và giao dịch liên quan đến trang trại của bạn để so sánh giá thực, chi phí sản xuất và dòng hoa."
      }
    ],
    "factions": [
      {
        "id": "factions-grid",
        "selector": ".factions-grid",
        "title": "Thẻ phe phái",
        "text": "Mỗi thẻ hiển thị thú cưng phe phái, tiến trình, chuỗi và chi phí yêu cầu nhà bếp hoặc thú cưng."
      }
    ],
    "chapter": [
      {
        "id": "chapter-table",
        "selector": ".chapter-table",
        "title": "Chiếu chương",
        "text": "Bảng này dự đoán các vé theo mùa từ việc giao hàng, tiền thưởng, công việc nhà, tiền thưởng và các tùy chọn chi phí."
      },
      {
        "id": "chapter-cost-mode",
        "selector": ".chapter-cost-mode-picker",
        "title": "Chế độ chi phí",
        "text": "Bạn có thể chuyển đổi giữa chi phí sản xuất và chi phí thị trường để so sánh tuyến đường có lợi nhuận với tuyến đường nhanh hơn."
      },
      {
        "id": "chapter-total",
        "selector": ".chapter-total-row",
        "title": "Tổng số hàng",
        "text": "Tổng số vé ngưng tụ và chi phí cho toàn bộ lựa chọn."
      }
    ],
    "auctions": [
      {
        "id": "auctions-range",
        "selector": "#auctions-start-date",
        "title": "Phạm vi ngày",
        "text": "Lọc các cuộc đấu giá bên trong một cửa sổ ngày cụ thể."
      },
      {
        "id": "auctions-list",
        "selector": ".table-container table",
        "title": "Danh sách đấu giá",
        "text": "Nhấp vào một đối tượng để tải chế độ xem chi tiết của nó."
      }
    ],
    "toplists": [
      {
        "id": "toplists-toolbar",
        "selector": ".toplists-toolbar",
        "title": "Chọn thứ hạng",
        "text": "Chọn danh mục hoặc đối tượng, sau đó làm mới để tạo bảng danh sách hàng đầu đã hợp nhất của bạn."
      },
      {
        "id": "toplists-table",
        "selector": ".toplists-table",
        "title": "So sánh nhiều thứ hạng",
        "text": "Bảng hợp nhất một số thứ hạng trên cùng một người chơi."
      }
    ],
    "activity": [
      {
        "id": "activity-table",
        "selector": ".table-container",
        "title": "Đọc hoạt động",
        "text": "Trang này phân tích những gì được sản xuất, đốt cháy hoặc chuyển đổi trong một khoảng thời gian."
      }
    ]
  },
  "baseSteps": [
    {
      "id": "options",
      "selector": "button[title=\"Options\"]",
      "title": "1. Cấu hình tính toán",
      "text": "Tại đây bạn điều chỉnh các tùy chọn thay đổi kết quả được hiển thị trên ứng dụng."
    },
    {
      "id": "autorefresh",
      "selector": ".coach-search-refresh-target",
      "title": "2. Tìm kiếm và tự động làm mới",
      "text": "Nút tìm kiếm, làm mới thủ công và tự động làm mới."
    },
    {
      "id": "trades",
      "selector": ".tabletrades",
      "title": "3. Giao dịch gần đây",
      "text": "Đối tượng này tóm tắt các danh sách hoặc giao dịch gần đây của trang trại. Nhấp vào nó để mở thêm chi tiết."
    },
    {
      "id": "page-select",
      "selector": ".header-page-select .cd-btn, .header-market-select .cd-btn",
      "title": "4. Thay đổi trang",
      "text": "Bộ chọn này điều hướng giữa Trang chủ, Trang trại, Nấu ăn, Cá, Chương, Chợ, Danh sách và các chế độ xem khác."
    },
    {
      "id": "boosts-shortcut",
      "selector": ".top-frame .coach-boosts-btn",
      "title": "5. Tăng cường / NFT",
      "text": "Nút này mở chế độ xem Tăng cường để định cấu hình các kết hợp hoạt động hoặc thử nghiệm."
    },
    {
      "id": "deliveries-shortcut",
      "selector": "button[title=\"Deliveries\"]",
      "title": "6. Giao hàng",
      "text": "Phím tắt này mở ra việc giao hàng, công việc và nội dung tiền thưởng được liên kết với Plaza."
    },
    {
      "id": "tryset-switch",
      "selector": ".top-frame .coach-tryset-switch",
      "title": "7. Bộ hoạt động / Bộ thử",
      "text": "Bộ hoạt động đọc trang trại hiện tại. Tryset mô phỏng NFT hoặc thiết lập kỹ năng khác để so sánh kết quả."
    },
    {
      "id": "help",
      "selector": ".top-frame .coach-help-btn",
      "title": "8. Xem lại chuyến tham quan",
      "text": "Nút này sẽ bắt đầu lại chuyến tham quan có hướng dẫn bất cứ khi nào bạn muốn."
    }
  ]
};

export default locale;
