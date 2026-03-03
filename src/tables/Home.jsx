import { useState } from "react";
import { useAppCtx } from "../context/AppCtx";
import { frmtNb, ColorValue } from "../fct.js";

function isToday(date) {
    if (!date) return false;
    const today = new Date();
    const givenDate = new Date(date);
    return (
        today.getUTCDate() === givenDate.getUTCDate() &&
        today.getUTCMonth() === givenDate.getUTCMonth() &&
        today.getUTCFullYear() === givenDate.getUTCFullYear()
    );
}

function readSet(row, forTry) {
    return forTry ? (row?.tryset || {}) : (row?.active || {});
}

export default function HomeTable() {
    const [isBumpkinCooldown, setIsBumpkinCooldown] = useState(false);
    const [isBumpkinRefreshing, setIsBumpkinRefreshing] = useState(false);
    const {
        data: { dataSet, dataSetFarm, bumpkinLoading },
        ui: {
            selectedInv,
            xListeColBounty,
            TryChecked,
            isOpen,
            selectedHomeBlocks,
            selectedHomeItems
        },
        actions: {
            handleHomeClic,
            setUIField,
        },
        config: { API_URL },
    } = useAppCtx();

    if (selectedInv !== "home") return;

    const homeData = dataSetFarm?.homeData;
    if (!homeData) return <div>Loading home data...</div>;

    async function getBumpkin(dataSetRef) {
        const response = await fetch(API_URL + "/getbumpkin", {
            method: "GET",
            headers: {
                frmid: dataSetRef.farmId,
                username: dataSetRef.options.username,
                tknuri: dataSetRef.bumpkin.tkuri,
            }
        });
        if (response.ok) {
            const data = await response.json();
            dataSetRef.bumpkinImg = data.responseImage;
            dataSetRef.bumpkinImgFarmId = String(dataSetRef?.farmId ?? "");
        }
    }

    const img = dataSet?.bumpkinImg || "./logo512.png";
    const vipImg = <img src={"./icon/ui/vip.webp"} alt={""} className="itico" title={"VIP"} />;
    const imgDone = <img src={"./icon/ui/confirm.png"} alt={""} className="itico" title={"Done"} />;
    const imgCancel = <img src={"./icon/ui/cancel.png"} alt={""} className="itico" title={"Not done"} />;
    const imgDoneSmall = <img src={"./icon/ui/confirm.png"} alt={""} className="seasonico" title={"Done"} />;
    const imgCancelSmall = <img src={"./icon/ui/cancel.png"} alt={""} className="seasonico" title={"Not done"} />;
    const imgTkt = <img src={dataSet.imgtkt || "./icon/nft/na.png"} alt={""} className="seasonico" title={dataSet.tktName || "Season tickets"} />;
    const imgCoinsSmall = <img src={"./icon/res/coins.png"} alt={""} className="seasonico" title={"Coins"} />;
    const imgSflSmall = <img src={"./icon/res/flowertoken.webp"} alt={""} className="seasonico" title={"Flower"} />;
    const imgFishSmall = <img src={"./icon/fish/anchovy.png"} alt={""} className="itico" title={"Fish casts"} />;
    const imgPetSmall = <img src={"./icon/pet/dog.webp"} alt={""} className="itico" title={"Pets"} />;
    const imgDishSmall = <img src={"./icon/food/sunflower_crunch.png"} alt={""} className="itico" title={"Pet requests"} />;
    const vipDate = homeData?.vipDate ? new Date(homeData.vipDate).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }) : imgCancel;

    const dailyChest = isToday(homeData?.dailyChest?.collectedAt) ? imgDone : imgCancel;
    const dailyChestStreak = homeData?.dailyChest?.streak ? <span> Streak: {homeData.dailyChest.streak}</span> : null;
    const dailyDig = isToday(homeData?.digging?.collectedAt) ? imgDone : imgCancel;
    const dailyDigStreak = homeData?.digging?.streak ? <span> Streak: {homeData.digging.streak}</span> : null;
    const fishCastsStatus = homeData?.fish?.done ? imgDone : imgCancel;
    const petRequestsStatus = homeData?.pets?.done ? imgDone : imgCancel;
    const bountyHasSfl = homeData?.bounties && ("sflDone" in homeData.bounties || "sflCount" in homeData.bounties);

    const blocks = Array.isArray(homeData?.blocks) ? homeData.blocks : [];
    const forTry = !!TryChecked;
    const setName = forTry ? "tryset" : "active";
    const curHrvst = forTry ? "average" : "current";
    let totalCost = 0;
    let totalMarket = 0;

    const leftPanel = (
        <div className="home-left-panel">
            <div className="home-left-panel-image-wrap">
                <img src={`${img}`} width="100%" alt="Bumpkin"></img>
                {(bumpkinLoading || isBumpkinRefreshing) && (
                    <div className="bumpkin-loading-badge" title="Loading bumpkin image">
                        <img src="./icon/ui/syncing.gif" alt="" />
                    </div>
                )}
                <button
                    type="button"
                    className="button small-btn bumpkin-refresh-btn"
                    title={isBumpkinCooldown ? "Cooldown 10s" : (bumpkinLoading || isBumpkinRefreshing) ? "Loading" : "Refresh bumpkin"}
                    disabled={isBumpkinCooldown || bumpkinLoading || isBumpkinRefreshing}
                    onClick={async () => {
                        if (isBumpkinCooldown || bumpkinLoading || isBumpkinRefreshing) return;
                        setIsBumpkinCooldown(true);
                        setIsBumpkinRefreshing(true);
                        try {
                            await getBumpkin(dataSet);
                        } finally {
                            setIsBumpkinRefreshing(false);
                            setTimeout(() => setIsBumpkinCooldown(false), 10000);
                        }
                    }}
                >
                    <img src="./icon/ui/refresh.png" alt="" />
                </button>
            </div>
            <div className="home-left-panel-text">
                <p>{vipImg} {vipDate}</p>
                <p>Daily chest: {dailyChest} {dailyChestStreak}</p>
                <p className="home-deliveries-bounties">
                    <span className="home-db-line">Deliveries: {homeData?.deliveries?.done || 0}/{homeData?.deliveries?.count || 0}</span>
                    <span className="home-reward-row">
                        <span className="home-reward-item">{imgTkt}{homeData?.deliveries?.tktDone || 0}/{homeData?.deliveries?.tktCount || 0}</span>
                        <span className="home-reward-item">{imgCoinsSmall}{homeData?.deliveries?.coinsDone || 0}/{homeData?.deliveries?.coinsCount || 0}</span>
                        <span className="home-reward-item">{imgSflSmall}{homeData?.deliveries?.sflDone || 0}/{homeData?.deliveries?.sflCount || 0}</span>
                    </span>
                    <span className="home-db-line">Chores: {homeData?.chores?.done || 0}/{homeData?.chores?.count || 0}</span>
                    <span className="home-db-line">Bounties: {homeData?.bounties?.done || 0}/{homeData?.bounties?.count || 0}</span>
                    <span className="home-reward-row">
                        <span className="home-reward-item">{imgTkt}{homeData?.bounties?.tktDone || 0}/{homeData?.bounties?.tktCount || 0}</span>
                        <span className="home-reward-item">{imgCoinsSmall}{homeData?.bounties?.coinsDone || 0}/{homeData?.bounties?.coinsCount || 0}</span>
                        {bountyHasSfl ? <span className="home-reward-item">{imgSflSmall}{homeData?.bounties?.sflDone || 0}/{homeData?.bounties?.sflCount || 0}</span> : null}
                    </span>
                </p>
                <p>Daily dig: {dailyDig} {dailyDigStreak}</p>
                <p>
                    <span>Protections</span>
                    <br />
                    <span>
                        <img src="./icon/ui/winter.webp" alt={""} className="seasonico" title="Winter" />{homeData?.protections?.winter ? imgDoneSmall : imgCancelSmall}
                        <img src="./icon/ui/spring.webp" alt={""} className="seasonico" title="Spring" />{homeData?.protections?.spring ? imgDoneSmall : imgCancelSmall}
                        <img src="./icon/ui/summer.webp" alt={""} className="seasonico" title="Summer" />{homeData?.protections?.summer ? imgDoneSmall : imgCancelSmall}
                        <img src="./icon/ui/autumn.webp" alt={""} className="seasonico" title="Autumn" />{homeData?.protections?.autumn ? imgDoneSmall : imgCancelSmall}
                    </span>
                </p>
                <p>{imgFishSmall} {homeData?.fish?.casts || 0}/{homeData?.fish?.max || 0} {fishCastsStatus}</p>
                <p>{imgPetSmall} {homeData?.pets?.fed || 0}/{homeData?.pets?.total || 0}{imgDishSmall} {petRequestsStatus}</p>
            </div>
        </div>
    );

    const collapsibleBlocks = blocks.map((block, index) => {
        const rows = Array.isArray(block?.rows) ? block.rows : [];
        const isBlockSelected = selectedHomeBlocks?.[index] ?? true;
        const blockLabel = forTry ? (block?.labelTry || block?.label || `Block ${index + 1}`) : (block?.label || `Block ${index + 1}`);
        const iconSrc = block?.img || "./icon/nft/na.png";
        const blockIcon = <img src={iconSrc} alt="" className="nodico" title={blockLabel} />;
        let blockCost = 0;
        let blockMarket = 0;

        const isItemActive = (row) => {
            if (!block?.itemToggle) return true;
            const selectionKey = String(row?.selectionKey || row?.key || row?.name || "");
            return selectedHomeItems?.[selectionKey] ?? true;
        };
        const toggleItemSelection = (row) => {
            const selectionKey = String(row?.selectionKey || row?.key || row?.name || "");
            if (!selectionKey) return;
            setUIField("selectedHomeItems", (prevState) => ({
                ...(prevState || {}),
                [selectionKey]: !(prevState?.[selectionKey] ?? true),
            }));
        };
        const handleItemToggleClick = (event, row) => {
            event.stopPropagation();
            toggleItemSelection(row);
        };

        rows.forEach((row) => {
            const rowSet = readSet(row, forTry);
            if (!isItemActive(row)) return;
            blockCost += Number(rowSet?.cost || 0);
            blockMarket += Number(rowSet?.market || 0);
        });
        const blockProfit = blockMarket - blockCost;
        if (isBlockSelected) {
            totalCost += blockCost;
            totalMarket += blockMarket;
        }

        return (
            <div key={block?.key || index} className="collapsible-block">
                <div className="collapsible-header" onClick={() => handleHomeClic(index)}>
                    <span className="collapsible-header-left">
                        <input
                            type="checkbox"
                            className="collapsible-header-checkbox"
                            checked={!!isBlockSelected}
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => {
                                setUIField("selectedHomeBlocks", (prevState) => ({
                                    ...(prevState || {}),
                                    [index]: !(prevState?.[index] ?? true),
                                }));
                            }}
                        />
                        {blockIcon} {blockLabel}
                    </span>
                    <span style={{ textAlign: "right" }}>
                        Cost: {frmtNb(blockCost)} - Profit: <span style={{ color: ColorValue(frmtNb(blockProfit), 0, 10) }}>{frmtNb(blockProfit)}</span>
                    </span>
                </div>
                {isOpen[index] && (
                    <div className="collapsible-content">
                        <table className="table" style={{ width: "100%" }}>
                            <thead>
                                <tr>
                                    {xListeColBounty[1][1] === 1 ? <th className="collapsible-content-th">Item</th> : null}
                                    {xListeColBounty[2][1] === 1 ? <th className="collapsible-content-th">Nodes</th> : null}
                                    {xListeColBounty[3][1] === 1 ? <th className="collapsible-content-th">Harvest</th> : null}
                                    {xListeColBounty[4][1] === 1 ? <th className="collapsible-content-th">Cost</th> : null}
                                    {xListeColBounty[5][1] === 1 ? <th className="collapsible-content-th">Market</th> : null}
                                    {xListeColBounty[5][1] === 1 ? <th className="collapsible-content-th">Profit</th> : null}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, itemIndex) => {
                                    const rowActive = isItemActive(row);
                                    const rowSet = readSet(row, forTry);
                                    const planted = rowActive ? Number(rowSet?.planted || 0) : 0;
                                    const harvest = rowActive ? Number(rowSet?.harvest || 0) : 0;
                                    const cost = rowActive ? Number(rowSet?.cost || 0) : 0;
                                    const market = rowActive ? Number(rowSet?.market || 0) : 0;
                                    const profit = market - cost;
                                    return (
                                        <tr key={(row?.key || row?.name || "row") + "-" + itemIndex} style={{ opacity: rowActive ? 1 : 0.5 }}>
                                            {xListeColBounty[1][1] === 1 && (
                                                <td className="tdcenter">
                                                    {block?.itemToggle ? (
                                                        <span
                                                            className="home-item-toggle"
                                                            title="Tap to count / uncount this item"
                                                            role="button"
                                                            tabIndex={0}
                                                            onClick={(event) => handleItemToggleClick(event, row)}
                                                            onKeyDown={(event) => {
                                                                if (event.key === "Enter" || event.key === " ") {
                                                                    event.preventDefault();
                                                                    handleItemToggleClick(event, row);
                                                                }
                                                            }}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                className="home-item-checkbox"
                                                                checked={!!rowActive}
                                                                onClick={(event) => event.stopPropagation()}
                                                                onChange={() => toggleItemSelection(row)}
                                                                title="Count this item"
                                                            />
                                                            <img src={row?.img || "./icon/nft/na.png"} alt={row?.name || ""} className="nodico" />
                                                        </span>
                                                    ) : (
                                                        <img src={row?.img || "./icon/nft/na.png"} alt={row?.name || ""} className="nodico" />
                                                    )}
                                                </td>
                                            )}
                                            {xListeColBounty[2][1] === 1 && <td className="tdcenter">{frmtNb(planted)}</td>}
                                            {xListeColBounty[3][1] === 1 && <td className="tdcenter">{frmtNb(harvest)}</td>}
                                            {xListeColBounty[4][1] === 1 && <td className="tdcenter">{frmtNb(cost)}</td>}
                                            {xListeColBounty[5][1] === 1 && <td className="tdcenter">{frmtNb(market)}</td>}
                                            {xListeColBounty[5][1] === 1 && <td className="tdcenter" style={{ color: ColorValue(profit, 0, 10) }}>{frmtNb(profit)}</td>}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    });

    const totalProfit = totalMarket - totalCost;
    return (
        <div className="home-container">
            {leftPanel}
            <div className="home-collapsible-wrap">
                <div className="home-collapsible-header home-harvest-row">
                    <span className="home-harvest-block home-harvest-block-primary">Your {curHrvst} harvests total :</span>
                    <span className="home-harvest-block home-harvest-block-secondary">
                        Cost: {frmtNb(totalCost)} - Profit: <span style={{ color: ColorValue(frmtNb(totalProfit), 0, 10) }}>{frmtNb(totalProfit)}</span>
                    </span>
                </div>
                <div className="collapsible-container">{collapsibleBlocks}</div>
            </div>
        </div>
    );
}
