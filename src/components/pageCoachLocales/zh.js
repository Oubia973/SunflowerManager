const locale = {
  "code": "zh",
  "ui": {
    "localeName": "中文",
    "languageLabel": "语言",
    "baseMode": "根据",
    "currentPageMode": "当前页面",
    "step": "步",
    "helpTitle": "帮助",
    "nextHint": "转到下一步。",
    "missingZone": "此屏幕上未找到区域。转到下一步。",
    "previous": "以前的",
    "next": "下一个",
    "finish": "结束",
    "close": "关闭",
    "currentPageFallback": "当前页面",
    "columnPrefix": "柱子",
    "groupTitle": "列组",
    "groupText": "这些专栏应该一起阅读。",
    "pageSummaryPrefix": "该区域总结了页面",
    "pageSummarySuffix": "加载视图数据以获取完整的详细信息。"
  },
  "pageLabels": {
    "home": "家",
    "inv": "农场",
    "cook": "厨师",
    "fish": "鱼",
    "flower": "花朵",
    "bounty": "挖",
    "animal": "动物",
    "pet": "宠物",
    "craft": "工艺",
    "cropmachine": "农作物机械",
    "map": "地图",
    "expand": "扩张",
    "buynodes": "购买节点",
    "factions": "派系",
    "market": "市场",
    "chapter": "章",
    "auctions": "拍卖",
    "toplists": "列表",
    "activity": "活动"
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
    "home": "该区域可帮助您了解农场的日常状态：已完成的例程、正在进行的收获、冷却时间和优先区块。",
    "inv": "此栏帮助比较农场视图中的对象，主要通过库存、时间、成本、市场价值和产量。",
    "cook": "本专栏有助于比较 Cook 中的菜谱，尤其是 XP、时间和实际成本。",
    "fish": "本专栏有助于比较鱼类的捕获量、成本、稀有性和回报。",
    "flower": "此栏有助于跟踪花卉的科系、品种、库存和生长情况。",
    "bounty": "本专栏有助于根据工具成本和日常模式判断挖掘价值。",
    "animal": "本专栏有助于比较动物周期、食物和产品的单位成本。",
    "pet": "此栏有助于读取宠物、神社或获取组件的价值。",
    "craft": "此栏有助于检查库存、组件和制作成本。",
    "cropmachine": "本专栏有助于模拟作物机械批次的成本、利润和每日预测。",
    "map": "该区域可帮助您直接直观地看到岛上正在生长、运行或等待行动的植物。",
    "expand": "本专栏有助于规划时间、资源和成本的扩展。",
    "buynodes": "此列有助于根据当前和下一个价格确定节点购买的优先级。",
    "factions": "该区域有助于读取派系进度、每周宠物和请求成本。",
    "market": "此栏有助于比较与农场相关的真实报价和交易。",
    "chapter": "本专栏帮助项目门票和成本来完成本章。",
    "auctions": "此栏有助于通过其进入、结束时间和奖励来监控拍卖或抽奖。",
    "toplists": "此列有助于比较合并排名中的玩家。",
    "activity": "本专栏有助于了解农场在一段时间内的真实流量：生产、燃烧、门票、鲜花和硬币。"
  },
  "commonExplanations": {
    "rank": "在显示的排名中的位置。",
    "id": "Identifier of the player or farm, useful for matching the same entry elsewhere.",
    "lvl": "农场、宠物或比较对象的等级。",
    "name": "表中显示的对象的名称。",
    "item": "表中显示的对象的名称。",
    "fish": "表中显示的对象的名称。",
    "pet": "相关宠物或物体的名称。",
    "component": "相关组件的名称。",
    "shrine": "相关神社的名称。",
    "source": "该收益的来源、成本或计数器。",
    "qty": "该对象的显示数量。",
    "quantity": "该对象的显示数量。",
    "stock": "该对象的当前可用库存。",
    "supply": "该对象的可用或分配数量。",
    "cost": "该对象在活动计算模式下的估计成本。",
    "prod": "对象的生产价值，与市场价值或成本进行比较。",
    "betty": "如果您将此物品出售给贝蒂，则获得的价值。",
    "market": "对象的估计市场价值。",
    "offer": "此市场报价的询问价格。",
    "ratio": "该对象的比较比率。较高的值通常意味着比其他对象更好的转换或更好的返回。",
    "time": "该物体所需的生长、工艺或周期时间。",
    "ready": "对象准备就绪的时刻，或准备就绪之前的剩余时间。",
    "when": "对象准备就绪的时间。",
    "grow": "对象的生长时间或生长进度。",
    "end": "该对象、事件或周期的结束时间。",
    "since": "此优惠或活动的年龄。",
    "date": "链接到此对象或事件的日期。",
    "xp": "XP 获得或链接到该对象。",
    "profit": "去除成本后该对象的预计净利润。",
    "profitpercent": "对象与其生产成本相比的盈利百分比。",
    "diff": "该对象的两个比较值之间的差距。",
    "coef": "该对象的两个值之间的比较系数。",
    "withdraw": "提现规则后真正可以收回的金额。",
    "dailymax": "该对象的最大每日投影。",
    "dailymaxaverage": "如果对象在最佳条件下运行，则平均最大每日投影。",
    "dailyflower": "?????? farm ??????????? restock ???????????? Flower ???",
    "daily": "该对象的平均每日投影。",
    "gainh": "该对象的平均每小时增益。",
    "chng": "该对象在选定时间段内的最新值变化。",
    "chngpercent": "所选期间内对象的最近价格变化。",
    "yield": "使用活动设置的对象的平均产量。",
    "harvest": "您可以为此物品收获的平均数量。",
    "harvestaverage": "您可以为此对象收获的平均数量。",
    "toharvest": "该物品的数量已经在增长，很快就可以收获了。",
    "toharvestgrowing": "该对象的数量已在农场中增长。",
    "done": "显示为此目标已经完成的工作。",
    "left": "显示还需要做什么或要获得什么。",
    "total": "该对象的预计或累计总数。",
    "notification": "允许您为此对象启用警报。",
    "notifications": "允许您为此对象启用警报。",
    "season": "显示该对象在哪个季节可用，并允许您过滤显示的季节。",
    "buy": "显示该对象是否是直接购买而不是生产。"
  },
  "pageColumnExplanations": {
    "inv": {
      "season": "此过滤器将表格限制为所选季节中可用的对象。",
      "item": "农场中被跟踪对象的名称。它是所有成本、市场和收益计算所使用的基础对象。",
      "hrvmax": "根据设置、节点和活跃增益，该物体白天的最大可收获量。",
      "hrv": "每日模式使用的收获值。您可以调整它以模拟真实的一天而不是理论最大值。",
      "quantity": "此选择器更改页面上所有计算中使用的数量。农场 = 农场现有库存。每日=您每天可以生产的数量。补货 = 产量加上一次补货。自定义=您自己的模拟的手动值。",
      "time": "生产该对象所需的增长或周期时间。",
      "cost": "此选择器更改成本的读取方式。 / 单位 = 生产一单位的成本。 x 数量 = 在数量中选择的数量的总成本。已计算 = 还包括已在其他地方计算的附带成本。",
      "buy": "将对象标记为已购买而不是已生产的复选框。这改变了链接配方和比较所使用的成本。",
      "betty": "通过将物品卖给贝蒂而获得的价值。有助于将保证价格与市场价值进行比较。",
      "ratio": "花费或承诺的每朵花获得的金币数量。值越高意味着商店到金币的转换越有利。",
      "market": "对象的估计市场价值。",
      "profit": "市场价值与生产成本之间的相对利润。它表明自己生产该物品是否仍然具有经济优势。",
      "withdraw": "提款规则和税后的可提款价值。有助于将原始价值与实际可恢复的价值分开。",
      "diff": "两个参考价格之间的差距。这可以帮助您快速了解市场何时与另一个比较值不同。",
      "coef": "生产成本与销售价格之间的系数。它显示了市场与实际成本的差距。",
      "chng": "所选期间的最近价格变化。有助于发现快速上升或下降的物体。",
      "yield": "根据活动设置或 tryset 生成节点的原始数据。",
      "harvest": "您可以为此物品收获的平均数量。",
      "toharvest": "农场里的数量已经增长，很快就可以收获。这是您的实际成果，而不仅仅是理论成果。",
      "ready": "显示对象准备就绪之前的准备时间或剩余时间，具体取决于所选模式。",
      "when": "就绪栏模式显示可用的确切时间。",
      "remain": "就绪栏模式显示剩余时间。",
      "1restock": "单次补货的产量预测。可用于衡量一次补充的最小​​影响，而无需查看一整天。",
      "dailyflower": "?????? farm ??????????? restock ???????????? Flower ???",
      "daily": "对象生成的平均每日花卉预测，通常来自其市场价值。",
      "gainh": "对象的平均每小时增益。",
      "dailymax": "如果对象全速运行，则平均每日最大投影。"
    },
    "cook": {
      "building": "构建或生产配方系列。",
      "food": "比较菜肴的名称。",
      "cook": "当前计算中保留的菜品数量。",
      "quantity": "当前模式下使用的餐具数量。",
      "xp": "从配方或选定数量中获得的总 XP。",
      "time": "食谱的原始烹饪时间。",
      "timecomp": "延长烹饪时间，包括成分所需的时间，以比较食谱的实际重量。",
      "xph": "每小时烹饪可获得 XP。",
      "xphwithcomponentstime": "每小时 XP，包括组件准备时间。",
      "xpflower": "每花费一朵花即可获得 XP。",
      "oil": "当 oilFood 选项处于活动状态时，配方会消耗油。",
      "cost": "配方的生产成本。",
      "prod": "这道菜的市场价值与其成本进行比较。"
    },
    "fish": {
      "category": "鱼族或稀有度等级。",
      "location": "该渔获所需的捕鱼区域或环境。",
      "fish": "比较鱼的名称。",
      "crustacean": "比较甲壳类动物的名称。",
      "bait": "此捕获所需或推荐的诱饵。",
      "quantity": "成本和 XP 计算中使用的数量。",
      "stock": "当前库存。",
      "caught": "农场已捕获的数量。",
      "chum": "密友用于提高或瞄准渔获量。其成本可以加回到计算中。",
      "time": "与对象相关的周期时间或步速。",
      "grow": "直到甲壳类动物再次准备好为止。",
      "ready": "对象再次可用的时刻。",
      "cost": "渔获物或周期的生产成本。",
      "prod": "市场上或生产中的对象价值，与成本进行比较。",
      "xpsfl": "每花费一朵花即可获得 XP。",
      "tool": "捕获所需的工具。",
      "map": "与该渔获的地图碎片或稀有地图链接掉落相关的信息。"
    },
    "animal": {
      "lvl": "动物级别。循环输出直接取决于它。",
      "prod1": "每个周期主要产品的平均产量。",
      "prod2": "每个周期副产品的平均产量。",
      "food": "一个周期消耗的食物。",
      "foodcost": "周期所需食品的生产成本。",
      "prodmarket": "从市场上购买组件时的生产成本。",
      "produ": "每单位产品的生产成本。",
      "costu": "动物产生的产品的实际单位成本。"
    },
    "pet": {
      "pet": "宠物的名字。",
      "fetch": "该宠物类别可以获取的物品。",
      "supply": "此类别中拥有或可用的宠物数量。",
      "lvl": "宠物当前等级。",
      "aura": "宠物提供的被动奖励。",
      "bib": "宠物装备的效果。",
      "currentenergy": "在需要根据请求重新填充之前，宠物当前可用的能量。",
      "requests": "用于给宠物补充能量的选定食物请求。",
      "energy": "所选请求提供的总能量。",
      "cost": "所选请求的鲜花费用。",
      "prodmarket": "当所有组件都是在市场上购买时所选请求的成本。",
      "energyflower": "每朵花用来喂养宠物所获得的能量量。值越高意味着请求越有效。",
      "energymarket": "喂养宠物所花费的每市场价值所获得的能量。对于将请求与基于市场的成本进行比较很有用。",
      "shrine": "神社的名称。",
      "components": "神社所需的组件。",
      "boost": "神社赋予的效果。",
      "component": "获取或神社组件的名称。",
      "yield": "宠物产生的数量。",
      "fetchedby": "哪些宠物可以获取此组件。",
      "usedinshrines": "哪些神殿消耗该组件。"
    },
    "craft": {
      "name": "可制作物体的名称。",
      "stock": "当前可用库存。",
      "time": "一个单位的制作时间。",
      "compos": "配方所需的成分。",
      "cost": "工艺品的生产成本。",
      "prod": "参考市场或转售价值与成本的比较。"
    },
    "cropmachine": {
      "name": "由作物机器加工的作物。",
      "time": "整批所需时间。",
      "seeds": "使用的种子数量取决于库存、最大或自定义模式。",
      "harvestaverage": "加工批次的平均产量。",
      "harvestcost": "该批次的种子成本。",
      "oil": "消耗的油量。",
      "oilcost": "消耗石油的成本。",
      "totalcost": "批次总成本：种子加油。",
      "profit": "该批次的预计净利润。",
      "gainh": "该批次的平均每小时利润。",
      "dailysfl": "如果该作物在该模式下使用机器，则每日花卉投影。"
    },
    "expand": {
      "lvl": "扩展阶段或水平。",
      "bumpkin": "所需乡巴佬等级。",
      "farm": "现阶段当前农场状态。",
      "from": "起始级别。",
      "to": "目标水平。",
      "time": "需要时间。",
      "costsfl": "阶段的估计总成本。"
    },
    "buynodes": {
      "node": "跟踪的节点类型。",
      "basesunstone": "节点的 Sunstone 基本价格。",
      "increaseprice": "每次额外购买都会增加价格。",
      "nodesonfarm": "农场中已有数量。",
      "bought": "当前计划中已购买的数量。",
      "buy": "模拟中购买的数量。",
      "nodesafter": "模拟购买后的总数。",
      "nextprice": "如果您继续在同一节点上，则下次购买的价格。",
      "totalsunstone": "模拟的日光石总成本。",
      "totalobsidian": "模拟中目标或所需的黑曜石总数。",
      "totaltimeobsidianfromstock": "达到黑曜石目标的预计时间，有或没有当前库存取决于选项。",
      "buytoreachtotalobsidianprice": "帮助估算在给定成本下需要购买多少才能达到全球黑曜石目标。"
    },
    "market": {
      "seller": "玩家在交易中出售。",
      "buyer": "玩家在交易中买入。",
      "type": "观察到的贸易的性质或来源。",
      "name": "交易对象。",
      "qty": "交易数量。",
      "sfl": "花卉的实际交易价格。",
      "market": "用于比较交易的参考市场价值。",
      "prod": "同一物体的估计生产成本。",
      "date": "交易日期。",
      "since": "上市年龄。",
      "offer": "询问报价的价格。"
    },
    "chapter": {
      "source": "门票来源：送货、杂务、赏金、奖金或 VIP。",
      "done": "显示已完成的内容和仍可用的内容。",
      "daily": "此来源提供的每日门票。",
      "week": "该来源的每周投影。",
      "left": "在章节结束之前还需要收集什么。",
      "total": "剩余章节的总投影。"
    },
    "auctions": {
      "item": "拍卖或抽奖中提供的奖励或批次。",
      "type": "机械师类型。有助于区分抽奖和其他拍卖形式。",
      "cur": "进入时消耗的货币或门票。",
      "supply": "分配的批次或获奖者的数量。",
      "end": "结束日期。这是最重要的跟踪列。",
      "notifications": "让您在结束前启用警报。",
      "rank": "在结果中排​​名。",
      "username": "结果中的玩家姓名。",
      "xp": "玩家或入门 XP 取决于显示的排行榜。"
    },
    "toplists": {
      "rank": "在参考排名中的位置。",
      "id": "Player or farm identifier, useful to cross-check several rankings.",
      "lvl": "显示排名中的玩家等级。"
    },
    "activity": {
      "item": "在选定时间段内跟踪的对象。",
      "description": "任务或活动描述。",
      "reward": "从任务或活动中获得的奖励。",
      "cost": "期间的生产成本。",
      "market": "在此期间观察到的市场价值。",
      "delivery": "与交付相关的流动或烧伤。",
      "season": "用于读数窗口的季节过滤器。"
    },
    "home": {
      "item": "在主页中跟踪的对象或子块。",
      "nodes": "涉及的图或节点的数量。",
      "seeds": "提交的种子数量。",
      "cycles": "期间可能的循环数。",
      "harvest": "预计收获量。",
      "oil": "该对象消耗的油。",
      "cost": "区块的总成本。",
      "market": "该区块的估计市场价值。",
      "profit": "该区块的预计净利润。"
    },
    "flower": {
      "seed": "花所属的种子科。帮助按组阅读品种。",
      "name": "确切的花名。",
      "breed": "与该花相关的品种或杂交。",
      "time": "花的生长时间。",
      "quant": "当前库存。",
      "hrvst": "农场已收获的数量。",
      "grow": "目前在花坛中生长的数量。"
    },
    "bounty": {
      "name": "通过挖掘获得的资源名称。",
      "stock": "库存中该资源的当前库存量。",
      "value": "以所选货币表示的资源价值。",
      "today": "该物品今天的预期数量或价值。",
      "toolcost": "获取该资源所消耗的工具成本。",
      "ratio": "获得的价值与工具成本之间的比率。这是最快的盈利读数。",
      "patternstoday": "今天的模式预测。",
      "patternsvalue": "价值与今天的模式相关。",
      "patternstoolcost": "当今模式的工具成本。"
    },
    "factions": {
      "item": "派系宠物或厨房要求的对象。",
      "cost": "满足要求所需的生产成本。"
    }
  },
  "pageIntroSteps": {
    "home": [
      {
        "id": "home-summary",
        "selector": ".home-left-panel",
        "title": "快速总结",
        "text": "该区域集中了重要的农场信息：VIP、每日宝箱、交付、赏金、保护和有用的冷却时间。"
      },
      {
        "id": "home-harvests",
        "selector": ".home-collapsible-wrap",
        "title": "收获块",
        "text": "每个块将一系列对象分组。打开一个区块即可查看详细的对象和总成本、市场和利润。"
      }
    ],
    "inv": [
      {
        "id": "inv-columns-picker",
        "selector": ".table-container",
        "title": "农场景观",
        "text": "此页面比较库存、时间、成本、市场价格和产量。它是决定生产什么或销售什么的主要观点。"
      }
    ],
    "cook": [
      {
        "id": "cook-table",
        "selector": ".table-container",
        "title": "配方视图",
        "text": "在这里您可以通过库存、XP、时间和成本来比较菜肴。成分栏显示了每个配方的阻碍因素。"
      }
    ],
    "fish": [
      {
        "id": "fish-table",
        "selector": ".table-container",
        "title": "钓鱼观",
        "text": "钓鱼会根据您的活动设置或尝试设置来比较产量、实际成本、鱼饵/密友和 XP 增益。"
      }
    ],
    "flower": [
      {
        "id": "flower-table",
        "selector": ".flower-table",
        "title": "花追踪",
        "text": "该页面有助于跟踪有用的品种、品种以及已经储存、收获或仍在生长的品种。"
      }
    ],
    "bounty": [
      {
        "id": "dig-table",
        "selector": ".table-container",
        "title": "挖掘盈利能力",
        "text": "本页将发现的价值与工具成本进行比较。该比率有助于显示当天或今天的模式是否值得付出努力。"
      }
    ],
    "animal": [
      {
        "id": "animal-table",
        "selector": ".animal-table, .table-container table",
        "title": "动物生产",
        "text": "您可以在这里按水平、食品成本和每种产品的实际单位成本来比较动物产量。"
      }
    ],
    "pet": [
      {
        "id": "pet-table",
        "selector": ".table-container",
        "title": "宠物视图",
        "text": "根据显示的子表，您可以跟踪宠物、神社或获取组件及其成本和产量。"
      }
    ],
    "craft": [
      {
        "id": "craft-table",
        "selector": ".table-container",
        "title": "工艺食谱",
        "text": "此页面可快速检查库存、所需组件以及与市场价值相比的制作成本。"
      }
    ],
    "cropmachine": [
      {
        "id": "cropmachine-table",
        "selector": ".crop-machine-table",
        "title": "作物机械模拟",
        "text": "此页面模拟作物机器批次：时间、使用的种子、消耗的石油、总成本、利润和日收益。"
      }
    ],
    "map": [
      {
        "id": "map-grid",
        "selector": ".table-container, table",
        "title": "岛屿地图",
        "text": "该地图可帮助您直接在岛上直观地看到农作物、机器和正在运行的流程。"
      }
    ],
    "expand": [
      {
        "id": "expand-table",
        "selector": ".table-container",
        "title": "计划扩建",
        "text": "本页估算了购买或准备扩展之前所需的岛屿、资源、时间和成本。"
      }
    ],
    "buynodes": [
      {
        "id": "buynodes-table",
        "selector": ".table-container",
        "title": "购买节点",
        "text": "此视图有助于根据价格、已购买的内容和下一个预期成本确定节点购买的优先级。"
      }
    ],
    "market": [
      {
        "id": "market-offers",
        "selector": ".table",
        "title": "报价和交易",
        "text": "市场页面总结了与您的农场相关的报价和交易，以比较实际价格、生产成本和花卉流量。"
      }
    ],
    "factions": [
      {
        "id": "factions-grid",
        "selector": ".factions-grid",
        "title": "派系卡牌",
        "text": "每张卡片都会显示派系宠物、进度、连胜以及厨房或宠物请求成本。"
      }
    ],
    "chapter": [
      {
        "id": "chapter-table",
        "selector": ".chapter-table",
        "title": "章节投影",
        "text": "该表从交付、赏金、杂务、奖金和成本选项中预测季节性门票。"
      },
      {
        "id": "chapter-cost-mode",
        "selector": ".chapter-cost-mode-picker",
        "title": "成本模式",
        "text": "您可以在生产成本和市场成本之间切换，以比较有利可图的路线和更快的路线。"
      },
      {
        "id": "chapter-total",
        "selector": ".chapter-total-row",
        "title": "总行数",
        "text": "总金额浓缩了整个选择的门票和费用。"
      }
    ],
    "auctions": [
      {
        "id": "auctions-range",
        "selector": "#auctions-start-date",
        "title": "日期范围",
        "text": "过滤特定日期窗口内的拍卖。"
      },
      {
        "id": "auctions-list",
        "selector": ".table-container table",
        "title": "拍卖清单",
        "text": "单击一个对象可加载其详细视图。"
      }
    ],
    "toplists": [
      {
        "id": "toplists-toolbar",
        "selector": ".toplists-toolbar",
        "title": "选择排名",
        "text": "选择类别或对象，然后刷新以构建合并的热门列表表。"
      },
      {
        "id": "toplists-table",
        "selector": ".toplists-table",
        "title": "多排名比较",
        "text": "该表合并了同一球员的多个排名。"
      }
    ],
    "activity": [
      {
        "id": "activity-table",
        "selector": ".table-container",
        "title": "活动阅读",
        "text": "此页面分析一段时间内生产、燃烧或转换的内容。"
      }
    ]
  },
  "baseSteps": [
    {
      "id": "options",
      "selector": "button[title=\"Options\"]",
      "title": "1. 配置计算",
      "text": "您可以在此处调整可更改应用程序中显示结果的选项。"
    },
    {
      "id": "autorefresh",
      "selector": ".coach-search-refresh-target",
      "title": "2. 搜索和自动刷新",
      "text": "搜索按钮、手动刷新和自动刷新环。"
    },
    {
      "id": "trades",
      "selector": ".tabletrades",
      "title": "3. 近期交易",
      "text": "该对象总结了农场最近的列表或交易。单击它可打开更多详细信息。"
    },
    {
      "id": "page-select",
      "selector": ".header-page-select .cd-btn, .header-market-select .cd-btn",
      "title": "4. 更改页面",
      "text": "此选择器可在“家庭”、“农场”、“厨师”、“鱼”、“章节”、“市场”、“列表”和其他视图之间导航。"
    },
    {
      "id": "boosts-shortcut",
      "selector": ".top-frame .coach-boosts-btn",
      "title": "5. Boost/NFT",
      "text": "此按钮可打开“增强”视图以配置活动或测试组合。"
    },
    {
      "id": "deliveries-shortcut",
      "selector": "button[title=\"Deliveries\"]",
      "title": "6. 交货",
      "text": "此快捷方式可打开与广场相关的送货、杂务和赏金内容。"
    },
    {
      "id": "tryset-switch",
      "selector": ".top-frame .coach-tryset-switch",
      "title": "7. 活动集/Tryset",
      "text": "活动集读取当前场。 Tryset 模拟另一个 NFT 或技能设置来比较结果。"
    },
    {
      "id": "help",
      "selector": ".top-frame .coach-help-btn",
      "title": "8. 重播游览",
      "text": "只要您需要，此按钮即可再次启动导游。"
    }
  ]
};

export default locale;
