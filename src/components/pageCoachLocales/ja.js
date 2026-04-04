const locale = {
  "code": "ja",
  "ui": {
    "localeName": "日本語",
    "languageLabel": "言語",
    "baseMode": "ベース",
    "currentPageMode": "現在のページ",
    "step": "ステップ",
    "helpTitle": "ヘルプ",
    "nextHint": "次のステップに進みます。",
    "missingZone": "この画面にはゾーンが見つかりません。次のステップに進みます。",
    "previous": "前の",
    "next": "次",
    "finish": "仕上げる",
    "close": "近い",
    "currentPageFallback": "現在のページ",
    "columnPrefix": "カラム",
    "groupTitle": "列グループ",
    "groupText": "これらのコラムは合わせて読む必要があります。",
    "pageSummaryPrefix": "このエリアはページを要約します",
    "pageSummarySuffix": "ビュー データをロードして完全な詳細を取得します。"
  },
  "pageLabels": {
    "home": "家",
    "inv": "農場",
    "cook": "料理する",
    "fish": "魚",
    "flower": "花",
    "bounty": "掘る",
    "animal": "動物",
    "pet": "ペット",
    "craft": "クラフト",
    "cropmachine": "クロップマシン",
    "map": "地図",
    "expand": "拡大する",
    "buynodes": "ノードを購入する",
    "factions": "派閥",
    "market": "市場",
    "chapter": "章",
    "auctions": "オークション",
    "toplists": "リスト",
    "activity": "活動"
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
    "home": "このエリアは、完了したルーチン、進行中の収穫、クールダウン、優先ブロックなど、農場の毎日の状態を読み取るのに役立ちます。",
    "inv": "この列は、主に在庫、時間、コスト、市場価値、収量を通じてファーム ビュー内のオブジェクトを比較するのに役立ちます。",
    "cook": "このコラムは、Cook のレシピ、特に XP、時間、実際のコストを比較するのに役立ちます。",
    "fish": "この列は、魚の漁獲量、価格、希少性、収益を比較するのに役立ちます。",
    "flower": "この列は、科、品種、株、成長ごとに花を追跡するのに役立ちます。",
    "bounty": "このコラムは、ツールのコストや毎日のパターンに照らして採掘価値を判断するのに役立ちます。",
    "animal": "このコラムは、動物の周期、餌、製品の単価を比較するのに役立ちます。",
    "pet": "この列は、ペット、神社、フェッチ コンポーネントの値を読み取るのに役立ちます。",
    "craft": "この列は、在庫、コンポーネント、製作コストを確認するのに役立ちます。",
    "cropmachine": "この列は、クロップマシンのバッチのコスト、利益、毎日の予測をシミュレートするのに役立ちます。",
    "map": "このエリアは、島で成長しているもの、実行中のもの、またはアクションを待っているものを直接視覚化するのに役立ちます。",
    "expand": "このコラムは、時間、リソース、コストの拡張を計画するのに役立ちます。",
    "buynodes": "この列は、現在および次回の価格に基づいてノード購入の優先順位を付けるのに役立ちます。",
    "factions": "このエリアは、派閥の進行状況、毎週のペット、およびリクエストのコストを読み取るのに役立ちます。",
    "market": "この列は、ファームに関連付けられた実際のオファーと取引を比較するのに役立ちます。",
    "chapter": "このコラムは、プロジェクトのチケットと章を完了するためのコストに役立ちます。",
    "auctions": "この列は、オークションや抽選会の参加、終了時間、報酬を監視するのに役立ちます。",
    "toplists": "この列は、統合されたランキング全体でプレーヤーを比較するのに役立ちます。",
    "activity": "このコラムは、生産、バーン、チケット、フラワー、コインなど、一定期間にわたる農場の実際のフローを読み取るのに役立ちます。"
  },
  "commonExplanations": {
    "rank": "表示されたランキングでの順位。",
    "id": "Identifier of the player or farm, useful for matching the same entry elsewhere.",
    "lvl": "農場、ペット、または比較されるオブジェクトのレベル。",
    "name": "テーブルに表示されるオブジェクトの名前。",
    "item": "テーブルに表示されるオブジェクトの名前。",
    "fish": "テーブルに表示されるオブジェクトの名前。",
    "pet": "関連するペットまたはオブジェクトの名前。",
    "component": "関連するコンポーネントの名前。",
    "shrine": "関係する神社の名前。",
    "source": "このゲイン、コスト、またはカウンターのソース。",
    "qty": "このオブジェクトの表示数量。",
    "quantity": "このオブジェクトの表示数量。",
    "stock": "このオブジェクトの現在の在庫。",
    "supply": "このオブジェクトの利用可能な量または割り当てられた量。",
    "cost": "アクティブな計算モードでのこのオブジェクトの推定コスト。",
    "prod": "オブジェクトの生産価値。市場価値またはコストと比較します。",
    "betty": "このオブジェクトをベティに売った場合に得られる価値。",
    "market": "オブジェクトの推定市場価格。",
    "offer": "この市場オファーの希望価格。",
    "ratio": "このオブジェクトの比較比率。一般に、値が大きいほど、他のオブジェクトよりも変換またはリターンが向上することを意味します。",
    "time": "このオブジェクトに必要な成長、クラフト、またはサイクル時間。",
    "ready": "オブジェクトの準備が整う瞬間、または準備が整うまでの残り時間。",
    "when": "オブジェクトの準備が整う時刻。",
    "grow": "オブジェクトの成長時間または成長の進行状況。",
    "end": "このオブジェクト、イベント、またはサイクルの終了時刻。",
    "since": "このオファーまたはイベントの年齢。",
    "date": "このオブジェクトまたはイベントにリンクされた日付。",
    "xp": "XP が獲得またはこのオブジェクトにリンクされました。",
    "profit": "コストを除いたこのオブジェクトの推定純利益。",
    "profitpercent": "生産コストと比較したオブジェクトの収益率。",
    "diff": "このオブジェクトの 2 つの比較値間のギャップ。",
    "coef": "このオブジェクトの 2 つの値間の比較係数。",
    "withdraw": "出金ルール適用後に実際に回収できる金額。",
    "dailymax": "このオブジェクトの 1 日あたりの最大予測。",
    "dailymaxaverage": "オブジェクトが最良の状態で実行されている場合の、1 日あたりの平均最大予測値。",
    "dailyflower": "????????????? farm ??? restock ??????????????????????? Flower ?????",
    "daily": "このオブジェクトの毎日の平均予測。",
    "gainh": "このオブジェクトの時間当たりの平均増加。",
    "chng": "選択した期間におけるこのオブジェクトの最近の値の変化。",
    "chngpercent": "選択した期間におけるオブジェクトの最近の価格の変化。",
    "yield": "アクティブなセットアップでのオブジェクトの平均生産量。",
    "harvest": "このオブジェクトから収穫できる平均量。",
    "harvestaverage": "このオブジェクトから収穫できる平均量。",
    "toharvest": "このオブジェクトの量はすでに増加しており、間もなく収穫の準備が整います。",
    "toharvestgrowing": "ファーム上ですでに成長にコミットされているこのオブジェクトの量。",
    "done": "この目的に対してすでに完了した内容を示します。",
    "left": "何をすべきか、何を得る必要があるかを示します。",
    "total": "このオブジェクトの予測合計または累積合計。",
    "notification": "このオブジェクトのアラートを有効にできます。",
    "notifications": "このオブジェクトのアラートを有効にできます。",
    "season": "このオブジェクトがどの季節に利用できるかを示し、表示される季節をフィルタリングできます。",
    "buy": "オブジェクトが生産されずに直接購入されたかどうかを示します。"
  },
  "pageColumnExplanations": {
    "inv": {
      "season": "このフィルタは、選択した季節に利用可能なオブジェクトにテーブルを制限します。",
      "item": "ファーム上の追跡対象オブジェクトの名前。これは、すべてのコスト、市場、および利回りの計算で使用される基本オブジェクトです。",
      "hrvmax": "セットアップ、ノード、アクティブなブーストに応じた、このオブジェクトの 1 日中に収穫可能な最大量。",
      "hrv": "Daily モードで使用される収穫値。理論上の最大値ではなく、実際の日をシミュレートするように調整できます。",
      "quantity": "このセレクターは、ページ上のすべての計算で使用される数量を変更します。農場 = 農場の現在の在庫。 Daily = 1 日に生産できる量。在庫 = 再入荷によって生産が追加されます。 Custom = 独自のシミュレーション用の手動値。",
      "time": "オブジェクトの生成に必要な成長時間またはサイクル時間。",
      "cost": "このセレクターはコストの読み取り方法を変更します。 / 単位 = 1 つの単位を生産するのにかかるコスト。 x 数量 = [数量] で選択した数量の合計コスト。 counted = すでに他の場所でカウントされている副次コストも含まれます。",
      "buy": "オブジェクトを製造ではなく購入としてマークするチェックボックス。これにより、連鎖レシピと比較で使用されるコストが変更されます。",
      "betty": "オブジェクトをベティに売ることで得られる価値。保証価格と市場価格を比較するのに役立ちます。",
      "ratio": "費やしたまたはコミットした花ごとに獲得したコインの数。値が高いほど、ショップからコインへの変換がより有利になることを意味します。",
      "market": "オブジェクトの推定市場価格。",
      "profit": "市場価値と生産コストの間の相対的なマージン。それは、物体を自分で生産することに依然として経済的な優位性があるかどうかを示しています。",
      "withdraw": "出金ルールと税金を考慮した後の出金可能額。未加工の値と実際に回復できる値を分離するのに役立ちます。",
      "diff": "2 つの価格参照間のギャップ。これは、市場が別の比較値と異なる場合をすぐに確認するのに役立ちます。",
      "coef": "生産コストと販売価格の間の係数。これは、市場が実際のコストからどれだけ離れているかを示します。",
      "chng": "選択した期間における最近の価格の変化。急速に上昇または下降する物体を見つけるのに役立ちます。",
      "yield": "アクティブなセットアップまたはトライセットに従ったノードの生の生成。",
      "harvest": "このオブジェクトから収穫できる平均量。",
      "toharvest": "農場ではすでに大量に成長しており、間もなく収穫可能です。これは単なる理論上のものではなく、実際の生産物です。",
      "ready": "選択したモードに応じて、オブジェクトの準備完了時間または準備完了までの残り時間が表示されます。",
      "when": "利用可能になる正確な時間を示す準備完了列モード。",
      "remain": "残り時間を表示するレディカラムモード。",
      "1restock": "1 回の再入荷に対する生産予測。 1 日全体を見ずに、1 回の詰め替えによる最小限の効果を測定するのに役立ちます。",
      "dailyflower": "????????????? farm ??? restock ??????????????????????? Flower ?????",
      "daily": "オブジェクトによって生成される毎日の平均的な花の予測。通常はその市場価値に基づいて生成されます。",
      "gainh": "オブジェクトの時間当たりの平均増加。",
      "dailymax": "オブジェクトがフルペースで実行される場合の 1 日あたりの平均最大予測。"
    },
    "cook": {
      "building": "レシピの構築または生産ファミリー。",
      "food": "比較した料理の名前。",
      "cook": "現在の計算で保持されている料理の数。",
      "quantity": "現在のモードで使用されているディッシュの数。",
      "xp": "レシピまたは選択した数量から得られる合計 XP。",
      "time": "レシピの生の調理時間。",
      "timecomp": "レシピの実際の重量を比較するために、コンポーネントに必要な時間を含む調理時間を延長します。",
      "xph": "調理時間ごとに獲得できる XP。",
      "xphwithcomponentstime": "コンポーネントの準備時間を含む 1 時間あたりの XP。",
      "xpflower": "フラワーが費やすごとに XP が獲得できます。",
      "oil": "OilFood オプションがアクティブなときにレシピによって消費されるオイル。",
      "cost": "レシピの制作費です。",
      "prod": "料理の市場価値。そのコストと比較します。"
    },
    "fish": {
      "category": "魚のファミリーまたはレアリティ層。",
      "location": "この獲物に必要な釣り場または環境。",
      "fish": "比較対象の魚の名前。",
      "crustacean": "比較される甲殻類の名前。",
      "bait": "この釣果に必要または推奨される餌。",
      "quantity": "コストと XP の計算に使用される数量。",
      "stock": "現在の在庫状況。",
      "caught": "すでに養殖場で捕獲されている量。",
      "chum": "チャムは釣果を向上させたり目標を定めたりするために使用されていました。そのコストを計算に追加し直すことができます。",
      "time": "オブジェクトにリンクされたサイクルタイムまたはペース。",
      "grow": "甲殻類が再び準備が整うまでの時間。",
      "ready": "オブジェクトが再び利用可能になる瞬間。",
      "cost": "漁獲物またはサイクルの生産コスト。",
      "prod": "コストと比較するための、市場または生産におけるオブジェクトの価値。",
      "xpsfl": "フラワーが費やすごとに XP が獲得できます。",
      "tool": "キャッチに必要な道具。",
      "map": "このキャッチのマップフラグメントまたはレアマップリンクドロップに関する情報。"
    },
    "animal": {
      "lvl": "動物レベル。サイクル出力はそれに直接依存します。",
      "prod1": "サイクルごとの主要製品の平均生産量。",
      "prod2": "サイクルごとの二次製品の平均生産量。",
      "food": "1サイクルで消費される食料。",
      "foodcost": "サイクルに必要な食料の生産コスト。",
      "prodmarket": "コンポーネントを市場で購入した場合の製造コスト。",
      "produ": "製品の単位あたりの生産コスト。",
      "costu": "動物によって生成された製品の実際の単価。"
    },
    "pet": {
      "pet": "ペットの名前。",
      "fetch": "このペット カテゴリが取得できるアイテム。",
      "supply": "このカテゴリで所有または入手可能なペットの数。",
      "lvl": "ペットの現在のレベル。",
      "aura": "ペットによって提供されるパッシブボーナス。",
      "bib": "ペット装備の効果。",
      "currentenergy": "リクエストによって補充する必要がある前に、ペットで現在利用可能なエネルギー。",
      "requests": "ペットの充電に使用される選択された食事リクエスト。",
      "energy": "選択したリクエストによって提供される総エネルギー。",
      "cost": "選択されたリクエストの花のコスト。",
      "prodmarket": "すべてのコンポーネントを市場で購入した場合の、選択したリクエストのコスト。",
      "energyflower": "ペットに餌を与えるために費やした花ごとに得られるエネルギーの量。値が大きいほど、リクエストの効率が高くなります。",
      "energymarket": "ペットの餌付けに費やした市場価値あたりで得られるエネルギー量。リクエストと市場ベースのコストを比較するのに役立ちます。",
      "shrine": "神社の名前。",
      "components": "神社に必要な部品。",
      "boost": "神社から与えられる効果。",
      "component": "フェッチまたは神社コンポーネントの名前。",
      "yield": "ペットが生産する量。",
      "fetchedby": "どのペットがこのコンポーネントを取得できるか。",
      "usedinshrines": "どの神社がこのコンポーネントを消費するか。"
    },
    "craft": {
      "name": "作成可能なオブジェクトの名前。",
      "stock": "現在利用可能な在庫。",
      "time": "1ユニットあたりのクラフト時間。",
      "compos": "レシピに必要なコンポーネント。",
      "cost": "クラフトされたオブジェクトの生産コスト。",
      "prod": "原価と比較した参考市場または再販価値。"
    },
    "cropmachine": {
      "name": "クロップマシンで処理された作物。",
      "time": "バッチ全体に必要な時間。",
      "seeds": "使用されるシードの数は、Stock、Max、または Custom モードに応じて異なります。",
      "harvestaverage": "処理されたバッチの平均収量。",
      "harvestcost": "バッチのシードコスト。",
      "oil": "オイルの消費量。",
      "oilcost": "消費したオイルのコスト。",
      "totalcost": "総バッチコスト: 種子と油。",
      "profit": "バッチの推定純利益。",
      "gainh": "バッチの時間当たりの平均利益。",
      "dailysfl": "この作物がこのモードで機械を使用する場合、毎日の花の投影。"
    },
    "expand": {
      "lvl": "拡張段階またはレベル。",
      "bumpkin": "必要なバンプキンレベル。",
      "farm": "この段階での現在のファームの状態。",
      "from": "開始レベル。",
      "to": "目標レベル。",
      "time": "必要な時間。",
      "costsfl": "ステージの推定総コスト。"
    },
    "buynodes": {
      "node": "追跡されるノードのタイプ。",
      "basesunstone": "ノードのサンストーンの基本価格。",
      "increaseprice": "追加購入ごとに値上げが適用されます。",
      "nodesonfarm": "ファームにすでに存在する番号。",
      "bought": "現在のプランですでに購入されている番号。",
      "buy": "シミュレーションで購入する数量。",
      "nodesafter": "模擬購入後の合計数。",
      "nextprice": "同じノードで継続した場合の次回の購入の価格。",
      "totalsunstone": "シミュレーションのサンストーンの合計コスト。",
      "totalobsidian": "シミュレーションでターゲットまたは必要とされる黒曜石の合計。",
      "totaltimeobsidianfromstock": "オプションに応じて現在の在庫の有無にかかわらず、黒曜石ターゲットに到達するまでの推定時間。",
      "buytoreachtotalobsidianprice": "指定されたコストで世界的な黒曜石目標を達成するためにどれくらい購入するかを見積もるのに役立ちます。"
    },
    "market": {
      "seller": "トレードで販売しているプレイヤー。",
      "buyer": "トレードで購入するプレイヤー。",
      "type": "観察された取引の性質またはソース。",
      "name": "取引されたオブジェクト。",
      "qty": "取引数量。",
      "sfl": "Flowerの実質取引価格。",
      "market": "取引を比較するために使用される参照市場価格。",
      "prod": "同じオブジェクトの推定生産コスト。",
      "date": "取引日。",
      "since": "リストの年齢。",
      "offer": "オファーの要求価格。"
    },
    "chapter": {
      "source": "チケットのソース: 配達、雑用、報奨金、ボーナスまたは VIP。",
      "done": "すでに完了しているものとまだ利用可能なものを示します。",
      "daily": "この情報源から提供される 1 日分のチケット。",
      "week": "この情報源の週次予測。",
      "left": "章が終わるまでに収集すべきもの。",
      "total": "残りの章全体の投影。"
    },
    "auctions": {
      "item": "オークションや抽選会で提供される報酬やロット。",
      "type": "メカニックの種類。抽選と他のオークション形式を区別するのに役立ちます。",
      "cur": "入場に必要な通貨またはチケット。",
      "supply": "配布されたロットまたは当選者の数。",
      "end": "終了日。これは追跡にとって最も重要な列です。",
      "notifications": "終了前にアラートを有効にできます。",
      "rank": "結果のランキングです。",
      "username": "結果にプレイヤー名が表示されます。",
      "xp": "表示されるリーダーボードに応じてプレーヤーまたはエントリー XP。"
    },
    "toplists": {
      "rank": "参考ランキングでの順位。",
      "id": "Player or farm identifier, useful to cross-check several rankings.",
      "lvl": "表示されるランキングのプレイヤーレベル。"
    },
    "activity": {
      "item": "選択した期間中に追跡されたオブジェクト。",
      "description": "クエストまたはアクティビティの説明。",
      "reward": "クエストやアクティビティから得られる報酬。",
      "cost": "期間中の生産コスト。",
      "market": "期間中に観察された市場価値。",
      "delivery": "配達に関連した流出または火傷。",
      "season": "読み取りウィンドウに使用される季節フィルター。"
    },
    "home": {
      "item": "ホームで追跡されるオブジェクトまたはサブブロック。",
      "nodes": "関係するプロットまたはノードの数。",
      "seeds": "コミットされたシードの数。",
      "cycles": "期間中に可能なサイクル数。",
      "harvest": "推定収穫量。",
      "oil": "このオブジェクトのために消費されるオイル。",
      "cost": "ブロックの総コスト。",
      "market": "ブロックの推定市場価格。",
      "profit": "ブロックの推定純利益。"
    },
    "flower": {
      "seed": "その花が属する種子の家族。グループごとに品種を読むのに役立ちます。",
      "name": "まさに花の名前。",
      "breed": "この花に関連する品種または交配。",
      "time": "花の成長時期。",
      "quant": "現在の在庫状況です。",
      "hrvst": "農場ですでに収穫されている量。",
      "grow": "現在花壇で増えている量。"
    },
    "bounty": {
      "name": "掘削で得られる資源の名前。",
      "stock": "インベントリ内のこのリソースの現在の在庫。",
      "value": "選択した通貨でのリソースの価値。",
      "today": "このオブジェクトの今日の予想数量または値。",
      "toolcost": "このリソースを取得するために消費されたツールのコスト。",
      "ratio": "得られた値と工具コストの比率。これは最も早い収益性の測定値です。",
      "patternstoday": "今日のパターンの予測。",
      "patternsvalue": "今日のパターンにリンクした価値。",
      "patternstoolcost": "今日のパターンのツールコスト。"
    },
    "factions": {
      "item": "ファクションペットまたはキッチンからリクエストされたオブジェクト。",
      "cost": "ご要望に応じるために必要な制作費です。"
    }
  },
  "pageIntroSteps": {
    "home": [
      {
        "id": "home-summary",
        "selector": ".home-left-panel",
        "title": "簡単な概要",
        "text": "このエリアには、VIP、毎日のチェスト、配達、報奨金、保護、便利なクールダウンなど、主要なファーム情報が集中しています。"
      },
      {
        "id": "home-harvests",
        "selector": ".home-collapsible-wrap",
        "title": "収穫ブロック",
        "text": "各ブロックはオブジェクトのファミリーをグループ化します。ブロックを開いて、詳細なオブジェクトと総コスト、市場、利益を確認します。"
      }
    ],
    "inv": [
      {
        "id": "inv-columns-picker",
        "selector": ".table-container",
        "title": "ファームビュー",
        "text": "このページでは在庫、時間、コスト、相場、利回りを比較します。何を生産するのか、何を販売するのかを決めるのが主な視点です。"
      }
    ],
    "cook": [
      {
        "id": "cook-table",
        "selector": ".table-container",
        "title": "レシピビュー",
        "text": "ここでは、在庫、XP、時間、コストを通じて料理を比較します。材料の列には、各レシピのブロックとなるものが表示されます。"
      }
    ],
    "fish": [
      {
        "id": "fish-table",
        "selector": ".table-container",
        "title": "フィッシングビュー",
        "text": "フィッシングでは、アクティブなセットアップまたはトライセットに応じて、収量、実際のコスト、餌/餌、XP の獲得を比較します。"
      }
    ],
    "flower": [
      {
        "id": "flower-table",
        "selector": ".flower-table",
        "title": "花の追跡",
        "text": "このページは、有用な品種、品種、およびすでに在庫されているもの、収穫されたもの、または成長中のものを追跡するのに役立ちます。"
      }
    ],
    "bounty": [
      {
        "id": "dig-table",
        "selector": ".table-container",
        "title": "収益性の発掘",
        "text": "このページでは、発見物の価値とツールのコストを比較します。この比率は、その日または今日のパターンが努力に値するかどうかを示すのに役立ちます。"
      }
    ],
    "animal": [
      {
        "id": "animal-table",
        "selector": ".animal-table, .table-container table",
        "title": "動物の生産",
        "text": "ここでは、レベル別の動物の生産量、餌のコスト、各製品の実質単価を比較します。"
      }
    ],
    "pet": [
      {
        "id": "pet-table",
        "selector": ".table-container",
        "title": "ペットビュー",
        "text": "表示されるサブテーブルに応じて、ペット、神社を追跡したり、コストと収量を含むコンポーネントを取得したりできます。"
      }
    ],
    "craft": [
      {
        "id": "craft-table",
        "selector": ".table-container",
        "title": "クラフトレシピ",
        "text": "このページでは、在庫、必要なコンポーネント、作成コストを市場価格と比較してすぐに確認できます。"
      }
    ],
    "cropmachine": [
      {
        "id": "cropmachine-table",
        "selector": ".crop-machine-table",
        "title": "クロップマシンのシミュレーション",
        "text": "このページでは、作物機械のバッチをシミュレートします: 時間、使用した種子、消費したオイル、総コスト、利益、毎日の利益。"
      }
    ],
    "map": [
      {
        "id": "map-grid",
        "selector": ".table-container, table",
        "title": "島の地図",
        "text": "このマップは、島内で作物、機械、実行中のプロセスを直接視覚化するのに役立ちます。"
      }
    ],
    "expand": [
      {
        "id": "expand-table",
        "selector": ".table-container",
        "title": "計画の拡張",
        "text": "このページでは、拡張を購入または準備する前に必要な島、リソース、時間とコストを見積もります。"
      }
    ],
    "buynodes": [
      {
        "id": "buynodes-table",
        "selector": ".table-container",
        "title": "ノードを購入する",
        "text": "このビューは、価格、すでに購入されているもの、および次に予想されるコストに応じてノードの購入に優先順位を付けるのに役立ちます。"
      }
    ],
    "market": [
      {
        "id": "market-offers",
        "selector": ".table",
        "title": "オファーと取引",
        "text": "マーケット ページには、実際の価格、生産コスト、花の流れを比較するために、農場にリンクされたオファーと取引がまとめられています。"
      }
    ],
    "factions": [
      {
        "id": "factions-grid",
        "selector": ".factions-grid",
        "title": "派閥カード",
        "text": "各カードには、派閥のペット、進行状況、ストリーク、キッチンまたはペットのリクエストのコストが表示されます。"
      }
    ],
    "chapter": [
      {
        "id": "chapter-table",
        "selector": ".chapter-table",
        "title": "章の投影",
        "text": "この表は、配達、報奨金、雑用、ボーナス、コスト オプションからの季節チケットを予測します。"
      },
      {
        "id": "chapter-cost-mode",
        "selector": ".chapter-cost-mode-picker",
        "title": "コストモード",
        "text": "生産コストと市場コストを切り替えて、収益性の高いルートとより速いルートを比較できます。"
      },
      {
        "id": "chapter-total",
        "selector": ".chapter-total-row",
        "title": "合計行",
        "text": "合計には、選択全体のチケットとコストが凝縮されます。"
      }
    ],
    "auctions": [
      {
        "id": "auctions-range",
        "selector": "#auctions-start-date",
        "title": "日付範囲",
        "text": "特定の日付枠内のオークションをフィルターします。"
      },
      {
        "id": "auctions-list",
        "selector": ".table-container table",
        "title": "オークション一覧",
        "text": "オブジェクトをクリックして詳細ビューをロードします。"
      }
    ],
    "toplists": [
      {
        "id": "toplists-toolbar",
        "selector": ".toplists-toolbar",
        "title": "ランキングを選ぶ",
        "text": "カテゴリまたはオブジェクトを選択して更新し、結合されたトップリスト テーブルを作成します。"
      },
      {
        "id": "toplists-table",
        "selector": ".toplists-table",
        "title": "複数のランキングの比較",
        "text": "この表には、同じプレーヤーに関する複数のランキングが統合されています。"
      }
    ],
    "activity": [
      {
        "id": "activity-table",
        "selector": ".table-container",
        "title": "アクティビティの読み取り",
        "text": "このページでは、一定期間に何が生成、書き込み、変換されたかを分析します。"
      }
    ]
  },
  "baseSteps": [
    {
      "id": "options",
      "selector": "button[title=\"Options\"]",
      "title": "1. 計算の構成",
      "text": "ここでは、アプリ全体で表示される結果を変更するオプションを調整します。"
    },
    {
      "id": "autorefresh",
      "selector": ".coach-search-refresh-target",
      "title": "2. 検索と自動更新",
      "text": "検索ボタン、手動更新および自動更新リング。"
    },
    {
      "id": "trades",
      "selector": ".tabletrades",
      "title": "3. 最近の取引",
      "text": "このオブジェクトは、ファームの最近の上場または取引を要約します。クリックすると詳細が開きます。"
    },
    {
      "id": "page-select",
      "selector": ".header-page-select .cd-btn, .header-market-select .cd-btn",
      "title": "4. ページを変更する",
      "text": "このセレクターは、ホーム、農場、クック、魚、章、市場、リスト、およびその他のビューの間を移動します。"
    },
    {
      "id": "boosts-shortcut",
      "selector": ".top-frame .coach-boosts-btn",
      "title": "5.ブースト/NFT",
      "text": "このボタンを押すとブースト ビューが開き、アクティブな組み合わせまたはテストの組み合わせを設定できます。"
    },
    {
      "id": "deliveries-shortcut",
      "selector": "button[title=\"Deliveries\"]",
      "title": "6. 配送",
      "text": "このショートカットを使用すると、プラザにリンクされた配達、家事、報奨金コンテンツが開きます。"
    },
    {
      "id": "tryset-switch",
      "selector": ".top-frame .coach-tryset-switch",
      "title": "7. アクティブセット/トライセット",
      "text": "アクティブ セットは現在のファームを読み取ります。 Tryset は、別の NFT またはスキルのセットアップをシミュレートして結果を比較します。"
    },
    {
      "id": "help",
      "selector": ".top-frame .coach-help-btn",
      "title": "8. ツアーを再生する",
      "text": "このボタンをクリックすると、いつでもガイド付きツアーを再開できます。"
    }
  ]
};

export default locale;
