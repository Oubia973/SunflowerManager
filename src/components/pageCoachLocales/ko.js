const locale = {
  "code": "ko",
  "ui": {
    "localeName": "한국어",
    "languageLabel": "언어",
    "baseMode": "베이스",
    "currentPageMode": "현재 페이지",
    "step": "단계",
    "helpTitle": "돕다",
    "nextHint": "다음 단계로 이동합니다.",
    "missingZone": "이 화면에서는 영역을 찾을 수 없습니다. 다음 단계로 이동합니다.",
    "previous": "이전의",
    "next": "다음",
    "finish": "마치다",
    "close": "닫다",
    "currentPageFallback": "현재 페이지",
    "columnPrefix": "열",
    "groupTitle": "열 그룹",
    "groupText": "이 칼럼은 함께 읽어야 합니다.",
    "pageSummaryPrefix": "이 영역은 페이지를 요약합니다.",
    "pageSummarySuffix": "전체 세부정보를 얻으려면 뷰 데이터를 로드하세요."
  },
  "pageLabels": {
    "home": "집",
    "inv": "농장",
    "cook": "요리하다",
    "fish": "물고기",
    "flower": "월경",
    "bounty": "파기",
    "animal": "동물",
    "pet": "애완동물",
    "craft": "선박",
    "cropmachine": "자르기 기계",
    "map": "지도",
    "expand": "확장하다",
    "buynodes": "노드 구매",
    "factions": "세력",
    "market": "시장",
    "chapter": "장",
    "auctions": "경매",
    "toplists": "기울기",
    "activity": "활동"
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
    "home": "이 영역은 완료된 루틴, 진행 중인 수확, 쿨다운, 우선순위 블록 등 농장의 일일 상태를 읽는 데 도움이 됩니다.",
    "inv": "이 열은 주로 재고, 시간, 비용, 시장 가치 및 수확량을 통해 농장 보기의 개체를 비교하는 데 도움이 됩니다.",
    "cook": "이 칼럼은 Cook의 레시피, 특히 XP, 시간 및 실제 비용을 비교하는 데 도움이 됩니다.",
    "fish": "이 열은 물고기의 어획량, 비용, 희귀성 및 수익을 비교하는 데 도움이 됩니다.",
    "flower": "이 열은 가족, 품종, 줄기 및 성장별로 꽃을 추적하는 데 도움이 됩니다.",
    "bounty": "이 열은 도구 비용 및 일일 패턴을 기준으로 굴착 가치를 판단하는 데 도움이 됩니다.",
    "animal": "이 칼럼은 동물의 주기, 먹이, 제품 단가를 비교하는 데 도움이 됩니다.",
    "pet": "이 열은 애완동물, 성소 또는 가져오기 구성 요소의 가치를 읽는 데 도움이 됩니다.",
    "craft": "이 열은 재고, 구성 요소 및 제작 비용을 확인하는 데 도움이 됩니다.",
    "cropmachine": "이 열은 비용, 이익 및 일일 예측에서 자르기 기계 배치를 시뮬레이션하는 데 도움이 됩니다.",
    "map": "이 영역은 섬에서 무엇이 자라고, 달리고 있거나, 활동을 기다리고 있는지 직접 시각화하는 데 도움이 됩니다.",
    "expand": "이 열은 시간, 자원 및 비용의 확장을 계획하는 데 도움이 됩니다.",
    "buynodes": "이 열은 현재 가격과 다음 가격을 기준으로 노드 구매의 우선순위를 정하는 데 도움이 됩니다.",
    "factions": "이 영역은 세력 진행 상황, 주간 애완동물 및 요청 비용을 읽는 데 도움이 됩니다.",
    "market": "이 열은 농장과 연결된 실제 제안과 거래를 비교하는 데 도움이 됩니다.",
    "chapter": "이 칼럼은 프로젝트 티켓과 비용을 도와 장을 마무리하는 데 도움이 됩니다.",
    "auctions": "이 열은 입장, 종료 시간 및 보상을 통해 경매 또는 추첨을 모니터링하는 데 도움이 됩니다.",
    "toplists": "이 열은 병합된 순위에서 플레이어를 비교하는 데 도움이 됩니다.",
    "activity": "이 칼럼은 일정 기간 동안 농장의 실제 흐름(생산, 소각, 티켓, 꽃 및 동전)을 읽는 데 도움이 됩니다."
  },
  "commonExplanations": {
    "rank": "표시된 순위의 위치입니다.",
    "id": "Identifier of the player or farm, useful for matching the same entry elsewhere.",
    "lvl": "농장, 애완동물 또는 비교 대상의 레벨입니다.",
    "name": "표에 표시된 개체의 이름입니다.",
    "item": "표에 표시된 개체의 이름입니다.",
    "fish": "표에 표시된 개체의 이름입니다.",
    "pet": "관련된 애완동물이나 물건의 이름입니다.",
    "component": "관련 구성 요소의 이름입니다.",
    "shrine": "관련 신사의 이름입니다.",
    "source": "이 이득, 비용 또는 카운터의 소스입니다.",
    "qty": "이 개체에 대해 표시된 수량입니다.",
    "quantity": "이 개체에 대해 표시된 수량입니다.",
    "stock": "이 개체에 사용할 수 있는 현재 재고입니다.",
    "supply": "이 객체에 대해 사용 가능하거나 할당된 금액입니다.",
    "cost": "활성 계산 모드에서 이 개체에 대한 예상 비용입니다.",
    "prod": "시장 가치 또는 비용과 비교하기 위한 개체의 생산 가치입니다.",
    "betty": "이 물건을 베티에게 팔면 얻을 수 있는 가치입니다.",
    "market": "개체의 예상 시장 가치입니다.",
    "offer": "이 시장 제안에 대한 가격을 요청했습니다.",
    "ratio": "이 개체의 비교 비율입니다. 값이 높을수록 일반적으로 다른 객체보다 더 나은 변환 또는 더 나은 수익을 의미합니다.",
    "time": "이 개체에 필요한 성장, 제작 또는 주기 시간입니다.",
    "ready": "객체가 준비되는 순간 또는 준비되기까지 남은 시간입니다.",
    "when": "객체가 준비되는 시간입니다.",
    "grow": "개체의 성장 시간 또는 성장 진행 상황입니다.",
    "end": "이 개체, 이벤트 또는 주기의 종료 시간입니다.",
    "since": "이 제안 또는 이벤트의 연령입니다.",
    "date": "이 개체 또는 이벤트에 연결된 날짜입니다.",
    "xp": "XP를 얻었거나 이 개체에 연결했습니다.",
    "profit": "비용이 제거된 후 이 개체에 대한 예상 순이익입니다.",
    "profitpercent": "생산 비용 대비 개체의 수익성 비율입니다.",
    "diff": "이 개체에 대한 두 비교 값 사이의 간격입니다.",
    "coef": "이 객체에 대한 두 값 사이의 비교 계수입니다.",
    "withdraw": "출금규정 적용 후 실제로 회수할 수 있는 금액입니다.",
    "dailymax": "이 개체의 최대 일일 예측입니다.",
    "dailymaxaverage": "개체가 최상의 조건에서 실행되는 경우 평균 최대 일일 예측입니다.",
    "dailyflower": "??? ??? ?? farm ??? restock ??? ?? ??? ???? ?? ?? Flower ?????.",
    "daily": "이 개체의 일일 평균 예측입니다.",
    "gainh": "이 개체의 평균 시간당 이득입니다.",
    "chng": "선택한 기간 동안 이 개체의 최근 값이 변경되었습니다.",
    "chngpercent": "선택한 기간 동안 개체의 최근 가격 변동입니다.",
    "yield": "활성 설정을 사용한 개체의 평균 생산량입니다.",
    "harvest": "이 개체에 대해 수확할 수 있는 평균 수량입니다.",
    "harvestaverage": "이 개체에 대해 수확할 수 있는 평균 수량입니다.",
    "toharvest": "이 개체의 양이 이미 증가하고 있으며 곧 수확할 준비가 되었습니다.",
    "toharvestgrowing": "농장에서 성장하는 데 이미 투입된 이 개체의 수량입니다.",
    "done": "이 목표에 대해 이미 완료된 내용을 표시합니다.",
    "left": "해야 할 일이나 획득해야 할 일이 남아 있음을 보여줍니다.",
    "total": "이 개체에 대한 예상 또는 누적 합계입니다.",
    "notification": "이 개체에 대한 경고를 활성화할 수 있습니다.",
    "notifications": "이 개체에 대한 경고를 활성화할 수 있습니다.",
    "season": "이 개체를 사용할 수 있는 계절을 표시하고 표시된 계절을 필터링할 수 있습니다.",
    "buy": "객체를 생산하는 대신 직접 구매하는지 여부를 표시합니다."
  },
  "pageColumnExplanations": {
    "inv": {
      "season": "이 필터는 선택한 계절에 사용할 수 있는 개체로 테이블을 제한합니다.",
      "item": "팜에서 추적된 개체의 이름입니다. 모든 비용, 시장 및 수익률 계산에 사용되는 기본 개체입니다.",
      "hrvmax": "설정, 노드 및 활성 부스트에 따라 이 개체의 하루 동안 최대 수확 가능량입니다.",
      "hrv": "Daily 모드에서 사용되는 수확값입니다. 이론적 최대값 대신 실제 하루를 시뮬레이션하도록 조정할 수 있습니다.",
      "quantity": "이 선택기는 페이지의 모든 계산에 사용되는 수량을 변경합니다. 농장 = 농장의 현재 재고. 일일 = 하루에 생산할 수 있는 수량입니다. 재입고 = 한 번의 재입고로 생산량이 추가됩니다. Custom = 자신의 시뮬레이션을 위한 수동 값입니다.",
      "time": "물체를 생산하는 데 필요한 성장 또는 주기 시간입니다.",
      "cost": "이 선택기는 비용을 읽는 방법을 변경합니다. / 단위 = 한 단위를 생산하는 데 드는 비용입니다. x 수량 = 수량에서 선택한 수량에 대한 총 비용. 계산됨 = 다른 곳에서 이미 계산된 부가 비용도 포함됩니다.",
      "buy": "개체를 생산된 것이 아니라 구입한 것으로 표시하는 확인란입니다. 이로 인해 연결된 레시피 및 비교에 사용되는 비용이 변경됩니다.",
      "betty": "베티에게 물건을 팔아 얻는 가치. 보장된 가격과 시장 가치를 비교하는 데 유용합니다.",
      "ratio": "소비하거나 헌신한 꽃당 획득한 코인 수입니다. 값이 높을수록 상점에서 코인으로의 전환이 더 유리하다는 의미입니다.",
      "market": "개체의 예상 시장 가치입니다.",
      "profit": "시장 가치와 생산 비용 사이의 상대적 마진입니다. 이는 직접 물건을 생산하는 것이 여전히 경제적 우위를 갖고 있는지 여부를 보여줍니다.",
      "withdraw": "인출 규정 및 세금 적용 후 인출 가능 금액입니다. 실제로 복구할 수 있는 것과 원시 가치를 분리하는 데 유용합니다.",
      "diff": "두 가격 참조 사이의 차이. 이를 통해 시장이 다른 비교 값과 다른 경우를 빠르게 확인할 수 있습니다.",
      "coef": "생산 비용과 판매 가격 사이의 계수. 이는 시장이 실제 비용과 얼마나 떨어져 있는지를 보여줍니다.",
      "chng": "선택한 기간 동안의 최근 가격 변동입니다. 빠르게 오르거나 떨어지는 물체를 찾는 데 도움이 됩니다.",
      "yield": "활성 설정 또는 tryset에 따른 노드의 원시 생성입니다.",
      "harvest": "이 개체에 대해 수확할 수 있는 평균 수량입니다.",
      "toharvest": "농장에서 이미 양이 자라고 있고 곧 수확할 수 있습니다. 이것은 이론적인 결과물이 아닌 실제 결과물입니다.",
      "ready": "선택한 모드에 따라 준비 시간 또는 개체가 준비될 때까지 남은 시간을 표시합니다.",
      "when": "정확한 가용성 시간을 표시하는 준비 열 모드입니다.",
      "remain": "남은 시간을 표시하는 준비 열 모드입니다.",
      "1restock": "단일 재입고에 대한 생산 예측입니다. 하루 전체를 살펴보지 않고도 한 번의 리필로 인한 최소 영향을 측정하는 데 유용합니다.",
      "dailyflower": "??? ??? ?? farm ??? restock ??? ?? ??? ???? ?? ?? Flower ?????.",
      "daily": "일반적으로 시장 가치를 기준으로 개체에 의해 생성된 평균 일일 꽃 예측입니다.",
      "gainh": "개체의 평균 시간당 이득입니다.",
      "dailymax": "물체가 최대 속도로 실행되는 경우 평균 최대 일일 예측입니다."
    },
    "cook": {
      "building": "레시피에 대한 건물 또는 생산 제품군입니다.",
      "food": "비교 요리의 이름입니다.",
      "cook": "현재 계산에 유지되는 요리 수입니다.",
      "quantity": "현재 모드에서 사용되는 요리 수입니다.",
      "xp": "레시피 또는 선택한 수량으로 얻은 총 XP입니다.",
      "time": "레시피의 원시 조리 시간.",
      "timecomp": "레시피의 실제 무게를 비교하기 위해 구성 요소에 필요한 시간을 포함하여 조리 시간을 연장했습니다.",
      "xph": "요리 시간당 XP를 얻습니다.",
      "xphwithcomponentstime": "구성 요소 준비 시간을 포함한 시간당 XP입니다.",
      "xpflower": "꽃을 소비할 때마다 XP를 얻습니다.",
      "oil": "oilFood 옵션이 활성화된 경우 레시피에서 소비되는 오일입니다.",
      "cost": "레시피 생산 비용.",
      "prod": "요리의 시장 가치를 비용과 비교합니다."
    },
    "fish": {
      "category": "물고기과 또는 희귀도 등급.",
      "location": "이 어획량에 필요한 낚시 지역이나 환경.",
      "fish": "비교된 물고기의 이름입니다.",
      "crustacean": "비교된 갑각류의 이름입니다.",
      "bait": "이 낚시에 필요하거나 권장되는 미끼입니다.",
      "quantity": "비용 및 XP 계산에 사용되는 수량입니다.",
      "stock": "현재 재고 재고입니다.",
      "caught": "이미 농장에서 잡힌 양입니다.",
      "chum": "Chum은 어획량을 개선하거나 목표로 삼는 데 사용됩니다. 해당 비용을 계산에 다시 추가할 수 있습니다.",
      "time": "물체에 연결된 주기 시간 또는 속도입니다.",
      "grow": "갑각류가 다시 준비될 때까지의 시간입니다.",
      "ready": "객체를 다시 사용할 수 있게 되는 순간입니다.",
      "cost": "어획물 또는 주기의 생산 비용.",
      "prod": "시장이나 생산 시의 개체 가치를 비용과 비교합니다.",
      "xpsfl": "꽃을 소비할 때마다 XP를 얻습니다.",
      "tool": "잡기에 필요한 도구입니다.",
      "map": "이 캐치에 대한 지도 조각 또는 희귀한 지도 연결 드롭 관련 정보입니다."
    },
    "animal": {
      "lvl": "동물 수준. 사이클 출력은 이에 직접적으로 의존합니다.",
      "prod1": "사이클당 주요 제품의 평균 생산량입니다.",
      "prod2": "사이클당 2차 제품의 평균 생산량입니다.",
      "food": "한 주기 동안 소비되는 음식입니다.",
      "foodcost": "주기에 필요한 식품의 생산 비용.",
      "prodmarket": "부품을 시장에서 구매할 때 생산 비용.",
      "produ": "단위당 제품의 생산 비용입니다.",
      "costu": "동물이 생산한 제품의 실제 단위 비용입니다."
    },
    "pet": {
      "pet": "애완동물의 이름입니다.",
      "fetch": "이 애완동물 카테고리에서 가져올 수 있는 항목입니다.",
      "supply": "이 카테고리에서 소유하거나 이용할 수 있는 애완동물의 수입니다.",
      "lvl": "현재 펫 레벨입니다.",
      "aura": "애완동물이 제공하는 패시브 보너스.",
      "bib": "펫 장비의 효과.",
      "currentenergy": "요청으로 재충전되기 전에 현재 애완동물에서 사용할 수 있는 에너지입니다.",
      "requests": "애완동물을 재충전하는 데 사용되는 선택된 음식 요청입니다.",
      "energy": "선택한 요청에 의해 제공되는 총 에너지입니다.",
      "cost": "선택한 요청의 꽃 비용입니다.",
      "prodmarket": "모든 구성 요소를 시장에서 구매할 때 선택한 요청의 비용입니다.",
      "energyflower": "애완동물에게 먹이를 주기 위해 소비한 꽃당 얻는 에너지의 양입니다. 값이 높을수록 요청이 더 효율적이라는 의미입니다.",
      "energymarket": "애완동물에게 먹이를 주는 데 소비된 시장 가치당 얻은 에너지의 양입니다. 요청을 시장 기반 비용과 비교하는 데 유용합니다.",
      "shrine": "신사의 이름입니다.",
      "components": "신사에 필요한 구성품.",
      "boost": "신사가 부여하는 효과입니다.",
      "component": "가져오기 또는 신사 구성 요소의 이름입니다.",
      "yield": "애완동물이 생산하는 양입니다.",
      "fetchedby": "이 구성요소를 가져올 수 있는 애완동물은 무엇입니까?",
      "usedinshrines": "이 구성 요소를 소비하는 신사."
    },
    "craft": {
      "name": "제작 가능한 개체의 이름입니다.",
      "stock": "현재 사용 가능한 재고입니다.",
      "time": "한 유닛의 제작 시간입니다.",
      "compos": "레시피에 필요한 구성 요소입니다.",
      "cost": "제작된 물건의 생산 비용.",
      "prod": "비용과 비교한 참조 시장 또는 재판매 가치입니다."
    },
    "cropmachine": {
      "name": "자르기 기계로 처리된 자르기.",
      "time": "전체 배치에 필요한 시간입니다.",
      "seeds": "Stock, Max 또는 Custom 모드에 따라 사용되는 시드 수.",
      "harvestaverage": "처리된 배치의 평균 수율입니다.",
      "harvestcost": "배치의 종자 비용.",
      "oil": "소비된 오일의 양.",
      "oilcost": "소비된 오일의 비용.",
      "totalcost": "총 배치 비용: 종자 + 오일.",
      "profit": "배치의 예상 순이익입니다.",
      "gainh": "배치의 평균 시간당 이익입니다.",
      "dailysfl": "이 작물이 이 모드에서 기계를 사용하는 경우 일일 꽃 투사."
    },
    "expand": {
      "lvl": "확장 단계 또는 레벨.",
      "bumpkin": "필수 범프킨 레벨.",
      "farm": "이 단계의 현재 팜 상태입니다.",
      "from": "시작 수준.",
      "to": "목표 수준.",
      "time": "시간이 필요합니다.",
      "costsfl": "무대의 총 예상 비용입니다."
    },
    "buynodes": {
      "node": "추적된 노드 유형.",
      "basesunstone": "노드의 기본 Sunstone 가격입니다.",
      "increaseprice": "추가 구매 시마다 가격 인상이 적용됩니다.",
      "nodesonfarm": "팜에 이미 번호가 있습니다.",
      "bought": "현재 요금제에서 이미 구매한 번호입니다.",
      "buy": "시뮬레이션에서 구매할 수량입니다.",
      "nodesafter": "시뮬레이션 구매 후 총 개수입니다.",
      "nextprice": "동일한 노드에서 계속할 경우 다음 구매 가격입니다.",
      "totalsunstone": "시뮬레이션의 총 Sunstone 비용입니다.",
      "totalobsidian": "시뮬레이션에서 목표로 삼았거나 필요한 총 흑요석.",
      "totaltimeobsidianfromstock": "옵션에 따라 현재 재고 유무에 따라 흑요석 목표에 도달하는 데 예상되는 시간입니다.",
      "buytoreachtotalobsidianprice": "주어진 비용으로 글로벌 흑요석 목표에 도달하기 위해 얼마를 구매해야 하는지 추정하는 데 도움이 됩니다."
    },
    "market": {
      "seller": "거래에서 판매하는 플레이어.",
      "buyer": "거래에서 플레이어를 구매합니다.",
      "type": "관찰된 거래의 성격 또는 출처.",
      "name": "거래된 개체입니다.",
      "qty": "거래 수량.",
      "sfl": "꽃의 실제 거래 가격.",
      "market": "거래를 비교하는 데 사용되는 참조 시장 가치입니다.",
      "prod": "동일한 개체의 예상 생산 비용입니다.",
      "date": "거래일자.",
      "since": "목록의 나이입니다.",
      "offer": "제안에 대한 가격을 요청했습니다."
    },
    "chapter": {
      "source": "티켓 출처: 배달, 집안일, 포상금, 보너스 또는 VIP.",
      "done": "이미 완료된 것과 아직 사용 가능한 것을 표시합니다.",
      "daily": "이 소스에서 제공하는 일일 티켓입니다.",
      "week": "이 소스의 주간 예측입니다.",
      "left": "챕터가 끝나기 전에 수집해야 할 것은 무엇입니까?",
      "total": "나머지 장에 대한 전체 투영입니다."
    },
    "auctions": {
      "item": "경매나 추첨을 통해 제공되는 보상이나 로트입니다.",
      "type": "기계공의 종류. 추첨을 다른 경매 형식과 구별하는 데 유용합니다.",
      "cur": "입장 시 소비되는 화폐 또는 티켓.",
      "supply": "배포된 로트 또는 승자의 수입니다.",
      "end": "종료일. 추적에 있어서 가장 중요한 열입니다.",
      "notifications": "종료 전에 경고를 활성화할 수 있습니다.",
      "rank": "결과 순위.",
      "username": "결과에 플레이어 이름이 표시됩니다.",
      "xp": "표시된 순위표에 따라 플레이어 또는 입장 XP."
    },
    "toplists": {
      "rank": "참고순위 순위입니다.",
      "id": "Player or farm identifier, useful to cross-check several rankings.",
      "lvl": "표시된 순위의 플레이어 레벨입니다."
    },
    "activity": {
      "item": "선택한 기간 동안 추적된 개체입니다.",
      "description": "퀘스트 또는 활동 설명.",
      "reward": "퀘스트나 활동을 통해 얻은 보상입니다.",
      "cost": "해당 기간 동안의 생산 비용.",
      "market": "해당 기간 동안 관찰된 시장 가치.",
      "delivery": "배송과 관련된 흐름 또는 화상.",
      "season": "읽기 창에 사용되는 계절 필터입니다."
    },
    "home": {
      "item": "홈에서 추적되는 객체 또는 하위 블록.",
      "nodes": "관련된 플롯 또는 노드의 수입니다.",
      "seeds": "커밋된 시드 수입니다.",
      "cycles": "해당 기간 동안 가능한 주기 수입니다.",
      "harvest": "예상 수확량.",
      "oil": "이 개체에 석유가 소비되었습니다.",
      "cost": "블록의 총 비용입니다.",
      "market": "블록의 예상 시장 가치.",
      "profit": "블록의 예상 순이익입니다."
    },
    "flower": {
      "seed": "꽃이 속한 종자과. 그룹별로 품종을 읽는 데 도움이 됩니다.",
      "name": "정확한 꽃 이름.",
      "breed": "이 꽃과 관련된 품종이나 교배종입니다.",
      "time": "꽃이 자라는 시간.",
      "quant": "현재 재고가 재고입니다.",
      "hrvst": "이미 농장에서 수확한 수량입니다.",
      "grow": "현재 화단에서 자라는 수량입니다."
    },
    "bounty": {
      "name": "발굴하여 얻은 자원의 이름입니다.",
      "stock": "인벤토리에 있는 이 리소스의 현재 재고입니다.",
      "value": "선택한 통화로 표시된 자원의 가치입니다.",
      "today": "오늘 이 물건의 예상 수량 또는 가치입니다.",
      "toolcost": "이 자원을 얻기 위해 소모된 도구 비용입니다.",
      "ratio": "획득된 가치와 도구 비용 간의 비율입니다. 이는 가장 빠른 수익성 수치입니다.",
      "patternstoday": "패턴에 대한 오늘의 예측.",
      "patternsvalue": "오늘날의 패턴과 연결된 가치.",
      "patternstoolcost": "오늘의 패턴에 대한 도구 비용."
    },
    "factions": {
      "item": "세력 애완동물이나 주방이 요청한 개체입니다.",
      "cost": "요청을 충족하는 데 필요한 생산 비용."
    }
  },
  "pageIntroSteps": {
    "home": [
      {
        "id": "home-summary",
        "selector": ".home-left-panel",
        "title": "빠른 요약",
        "text": "이 영역에는 VIP, 일일 상자, 배달, 현상금, 보호 장치, 유용한 재사용 대기시간 등 주요 농장 정보가 중앙 집중화되어 있습니다."
      },
      {
        "id": "home-harvests",
        "selector": ".home-collapsible-wrap",
        "title": "수확 블록",
        "text": "각 블록은 개체군을 그룹화합니다. 블록을 열어 자세한 개체와 총 비용, 시장 및 이익을 확인하세요."
      }
    ],
    "inv": [
      {
        "id": "inv-columns-picker",
        "selector": ".table-container",
        "title": "농장 전경",
        "text": "이 페이지에서는 재고, 시간, 비용, 시장 가격 및 생산량을 비교합니다. 무엇을 생산할지, 판매할지 결정하는 것이 주된 관점이다."
      }
    ],
    "cook": [
      {
        "id": "cook-table",
        "selector": ".table-container",
        "title": "레시피 보기",
        "text": "여기에서는 재고, XP, 시간 및 비용을 통해 요리를 비교합니다. 성분 열에는 각 레시피를 차단하는 요소가 표시됩니다."
      }
    ],
    "fish": [
      {
        "id": "fish-table",
        "selector": ".table-container",
        "title": "낚시보기",
        "text": "낚시는 활성 설정이나 시도 세트에 따라 수확량, 실제 비용, 미끼/친구 및 XP 이득을 비교합니다."
      }
    ],
    "flower": [
      {
        "id": "flower-table",
        "selector": ".flower-table",
        "title": "꽃 추적",
        "text": "이 페이지는 유용한 품종, 품종 및 이미 비축, 수확 또는 아직 재배 중인 품종을 추적하는 데 도움이 됩니다."
      }
    ],
    "bounty": [
      {
        "id": "dig-table",
        "selector": ".table-container",
        "title": "발굴 수익성",
        "text": "이 페이지에서는 발견물의 가치를 도구 비용과 비교합니다. 비율은 그날의 패턴이나 오늘의 패턴이 노력할 가치가 있는지를 보여주는 데 도움이 됩니다."
      }
    ],
    "animal": [
      {
        "id": "animal-table",
        "selector": ".animal-table, .table-container table",
        "title": "동물 생산",
        "text": "여기에서는 레벨별 동물 생산량, 식량 비용 및 각 제품의 실제 단가를 비교합니다."
      }
    ],
    "pet": [
      {
        "id": "pet-table",
        "selector": ".table-container",
        "title": "애완동물 보기",
        "text": "표시된 하위 테이블에 따라 애완동물, 성소를 추적하거나 비용 및 생산량과 함께 구성 요소를 가져올 수 있습니다."
      }
    ],
    "craft": [
      {
        "id": "craft-table",
        "selector": ".table-container",
        "title": "공예 레시피",
        "text": "이 페이지에서는 재고, 필요한 구성품, 제작 비용을 시장 가치와 비교하여 빠르게 확인합니다."
      }
    ],
    "cropmachine": [
      {
        "id": "cropmachine-table",
        "selector": ".crop-machine-table",
        "title": "작물 기계 시뮬레이션",
        "text": "이 페이지는 시간, 사용된 종자, 소비된 오일, 총 비용, 이익 및 일일 이득 등 작물 기계 배치를 시뮬레이션합니다."
      }
    ],
    "map": [
      {
        "id": "map-grid",
        "selector": ".table-container, table",
        "title": "섬 지도",
        "text": "지도는 섬에서 직접 농작물, 기계 및 실행 중인 프로세스를 시각화하는 데 도움이 됩니다."
      }
    ],
    "expand": [
      {
        "id": "expand-table",
        "selector": ".table-container",
        "title": "계획 확장",
        "text": "이 페이지에서는 확장팩을 구입하거나 준비하기 전에 필요한 섬, 자원, 시간 및 비용을 추정합니다."
      }
    ],
    "buynodes": [
      {
        "id": "buynodes-table",
        "selector": ".table-container",
        "title": "노드 구매",
        "text": "이 보기는 가격, 이미 구매한 항목, 다음 예상 비용에 따라 노드 구매의 우선순위를 지정하는 데 도움이 됩니다."
      }
    ],
    "market": [
      {
        "id": "market-offers",
        "selector": ".table",
        "title": "제안 및 거래",
        "text": "시장 페이지에는 실제 가격, 생산 비용 및 꽃 흐름을 비교하기 위해 농장과 연결된 제안 및 거래가 요약되어 있습니다."
      }
    ],
    "factions": [
      {
        "id": "factions-grid",
        "selector": ".factions-grid",
        "title": "세력 카드",
        "text": "각 카드에는 세력 애완동물, 진행 상황, 연속, 주방 또는 애완동물 요청 비용이 표시됩니다."
      }
    ],
    "chapter": [
      {
        "id": "chapter-table",
        "selector": ".chapter-table",
        "title": "챕터 투영",
        "text": "이 테이블에는 배송, 현상금, 집안일, 보너스 및 비용 옵션의 시즌 티켓이 표시됩니다."
      },
      {
        "id": "chapter-cost-mode",
        "selector": ".chapter-cost-mode-picker",
        "title": "비용 모드",
        "text": "생산 비용과 시장 비용을 전환하여 수익성 있는 경로와 더 빠른 경로를 비교할 수 있습니다."
      },
      {
        "id": "chapter-total",
        "selector": ".chapter-total-row",
        "title": "총 행",
        "text": "총계에는 전체 선택에 대한 티켓과 비용이 요약되어 있습니다."
      }
    ],
    "auctions": [
      {
        "id": "auctions-range",
        "selector": "#auctions-start-date",
        "title": "기간",
        "text": "특정 날짜 창 내의 경매를 필터링합니다."
      },
      {
        "id": "auctions-list",
        "selector": ".table-container table",
        "title": "경매 목록",
        "text": "개체를 클릭하면 세부 보기가 로드됩니다."
      }
    ],
    "toplists": [
      {
        "id": "toplists-toolbar",
        "selector": ".toplists-toolbar",
        "title": "순위를 선택하세요",
        "text": "카테고리나 개체를 선택한 다음 새로 고쳐 병합된 상위 목록 테이블을 작성하세요."
      },
      {
        "id": "toplists-table",
        "selector": ".toplists-table",
        "title": "다중 순위 비교",
        "text": "테이블은 동일한 플레이어의 여러 순위를 병합합니다."
      }
    ],
    "activity": [
      {
        "id": "activity-table",
        "selector": ".table-container",
        "title": "활동 독서",
        "text": "이 페이지에서는 일정 기간 동안 생산, 소각 또는 변환된 내용을 분석합니다."
      }
    ]
  },
  "baseSteps": [
    {
      "id": "options",
      "selector": "button[title=\"Options\"]",
      "title": "1. 계산 구성",
      "text": "여기서는 앱 전체에 표시된 결과를 변경하는 옵션을 조정합니다."
    },
    {
      "id": "autorefresh",
      "selector": ".coach-search-refresh-target",
      "title": "2. 검색 및 자동 새로고침",
      "text": "검색 버튼, 수동 새로 고침 및 자동 새로 고침 링."
    },
    {
      "id": "trades",
      "selector": ".tabletrades",
      "title": "3. 최근 거래",
      "text": "이 개체는 농장의 최근 목록이나 거래를 요약합니다. 자세한 내용을 보려면 클릭하세요."
    },
    {
      "id": "page-select",
      "selector": ".header-page-select .cd-btn, .header-market-select .cd-btn",
      "title": "4. 페이지 변경",
      "text": "이 선택기는 홈, 농장, 요리, 생선, 장, 시장, 목록 및 기타 보기 사이를 탐색합니다."
    },
    {
      "id": "boosts-shortcut",
      "selector": ".top-frame .coach-boosts-btn",
      "title": "5. 부스트 / NFT",
      "text": "이 버튼을 누르면 Boosts 보기가 열려 활성 또는 테스트 조합을 구성할 수 있습니다."
    },
    {
      "id": "deliveries-shortcut",
      "selector": "button[title=\"Deliveries\"]",
      "title": "6. 배송",
      "text": "이 바로가기는 Plaza에 연결된 배달, 집안일, 포상금 콘텐츠를 엽니다."
    },
    {
      "id": "tryset-switch",
      "selector": ".top-frame .coach-tryset-switch",
      "title": "7. 액티브 세트 / 트라이세트",
      "text": "활성 세트는 현재 팜을 읽습니다. Tryset은 결과를 비교하기 위해 다른 NFT 또는 기술 설정을 시뮬레이션합니다."
    },
    {
      "id": "help",
      "selector": ".top-frame .coach-help-btn",
      "title": "8. 둘러보기 다시 재생",
      "text": "이 버튼은 원할 때마다 가이드 투어를 다시 시작합니다."
    }
  ]
};

export default locale;
