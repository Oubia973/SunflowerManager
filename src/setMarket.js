import React, { useEffect, useState, useRef } from 'react';
import { frmtNb, ColorValue, Timer } from './fct.js';

//const API_URL = process.env.REACT_APP_API_URL;

//const [dataSetMarket, setdataSetMarket] = useState({});

const imgsfl = <img src='./icon/res/flowertoken.webp' alt={''} className="itico" title="Flower" />;
const imgcoins = <img src='./icon/res/coins.png' alt={''} className="itico" title="Coins" />;
const imgna = <img src='./icon/nft/na.png' alt={''} className="itico" title="" />;

async function getMarket(dataSetMarket, API_URL) {
    const farmId = dataSetMarket.options.farmId;
    const userName = dataSetMarket.options.username;
    if (farmId) {
        const responseActivity = await fetch(API_URL + "/getmarket", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                frmid: farmId,
                username: userName,
            }),
        });
        if (responseActivity.ok) {
            const responseDataActivity = await responseActivity.json();
            //console.log(responseDataActivity);
            return responseDataActivity;
        } else {
            console.log(`Error : ${responseActivity.status}`);
        }
    }
}
export async function setMarket(dataSet, dataSetFarm, API_URL, xListeColBounty) {
    /* if (!dataSet.farmData.inventory) {
        return null;
    } */
    function key(name) {
        return dataSet.forTry ? name + "try" : name;
    }
    const dataMarket = await getMarket(dataSet, API_URL) || {};
    const { friends, listings, offers, trades, totalTrades, weeklyFlowerEarned, weeklyFlowerSpent } = dataMarket;
    if (!friends) { return null; }
    try {
        //const tableListings = setListings(listings, dataSet, dataSetFarm, xListeColBounty);
        const tableOffers = setListings(offers, dataSet, dataSetFarm, xListeColBounty, "offer");
        const tableTrades = setTrades(trades, dataSet, dataSetFarm, xListeColBounty);
        const result = (
            <>
                <div>Total Trades: {totalTrades}</div>
                <div>Weekly Flower Earned: {frmtNb(weeklyFlowerEarned)} - Weekly Flower Spent: {frmtNb(weeklyFlowerSpent)}</div>
                {/* <div>Listings</div>
                {tableListings} */}
                {/* <div>Offers</div> */}
                {tableOffers}
                {/* <div>Traded</div> */}
                {tableTrades}
            </>
        );
        //const result = tableListings;
        return result;
    } catch (error) {
        console.error("setMarket: ", error);
        return null;
    }
}
function setListings(elements, dataSet, dataSetFarm, xListeColBounty, listOrOffers = "listing") {
    if (!elements) { return null; }
    if (Object.keys(elements).length === 0) { return null; }
    const { it, fish, flower, bounty, craft, mutant, bud, nft, nftw } = dataSetFarm;
    const Key = Object.keys(elements);
    const tableBody = Key.map(element => {
        const cobj = elements[element];
        const itemName = Object.keys(cobj.items)[0];
        const itemQuant = Object.values(cobj.items)[0];
        let itemObj = {};
        itemObj.img = './icon/nft/na.png';
        if (it[itemName]) { itemObj = it[itemName]; }
        if (fish[itemName]) { itemObj = fish[itemName]; }
        if (flower[itemName]) { itemObj = flower[itemName]; }
        if (bounty[itemName]) { itemObj = bounty[itemName]; }
        if (craft[itemName]) { itemObj = craft[itemName]; }
        if (mutant[itemName]) { itemObj = mutant[itemName]; }
        //if (bud[itemName]) { itemObj = bud[itemName]; }
        if (nft[itemName]) { itemObj = nft[itemName]; }
        if (nftw[itemName]) { itemObj = nftw[itemName]; }
        const ico = <img src={itemObj.img} alt={''} className="nodico" title={itemName} />;
        const icost = (((itemObj.cost * itemQuant) / dataSet.options.coinsRatio) || 0);
        const icostm = (itemObj.costp2pt > 0 ? frmtNb(itemObj.costp2pt * itemQuant) : parseFloat(itemObj.pricemsfl * itemQuant).toFixed(0)) || "";
        const isfl = cobj.sfl || 0;
        const ts = Number(cobj.createdAt);
        const createdDate = isFinite(ts) ? new Date(ts < 1e12 ? ts * 1000 : ts) : null;
        const icreatedAt = createdDate ? createdDate.toLocaleString() : "";
        if (listOrOffers !== "listing") {
            //console.log("Offer:", itemName, itemQuant, icost, icostm, isfl, icreatedAt);
        }
        return (
            <tr>
                <td id="iccolumn">{ico}</td>
                {xListeColBounty[0][1] === 1 ? <td className="tditem">{itemName}</td> : null}
                {xListeColBounty[1][1] === 1 ? <td className="tdcenter">{itemQuant}</td> : null}
                {xListeColBounty[1][1] === 1 ? <td className="tdcenter">{isfl}</td> : null}
                {xListeColBounty[5][1] === 1 ? <td className="tdcenter">{icostm}</td> : null}
                {xListeColBounty[4][1] === 1 ? <td className="tdcenter">{parseFloat(icost).toFixed(3)}</td> : null}
                {xListeColBounty[1][1] === 1 ? <td className="tdcenter">{icreatedAt}</td> : null}
            </tr>
        );
    });
    const tableHeader = (
        <thead>
            <tr>
                <th className="th-icon"></th>
                {xListeColBounty[0][1] === 1 ? <th className="thcenter">Name</th> : null}
                {xListeColBounty[1][1] === 1 ? <th className="tdcenter">Quantity</th> : null}
                {xListeColBounty[1][1] === 1 ? <th className="thcenter">{listOrOffers === "listing" ? "Listing" : "Offer"}</th> : null}
                {xListeColBounty[5][1] === 1 ? <th className="thcenter">Market {imgsfl}</th> : null}
                {xListeColBounty[4][1] === 1 ? <th className="thcenter">Prod {imgsfl}</th> : null}
                {xListeColBounty[5][1] === 1 ? <th className="thcenter">Since</th> : null}
            </tr>
        </thead>
    );
    const table = (
        <>
            <h2 style={{ margin: 0 }}>{listOrOffers === "listing" ? "Listings" : "Offers"}</h2>
            <table className="table">
                {tableHeader}
                <tbody>
                    {tableBody}
                </tbody>
            </table>
        </>
    );
    return table;
}
function setTrades(elements, dataSet, dataSetFarm, xListeColBounty) {
    if (!elements) { return null; }
    const { it, fish, flower, bounty, craft, bud, mutant, nft, nftw } = dataSetFarm;
    const Key = Object.keys(elements);
    let totSell = 0;
    let totBuy = 0;
    const tableBody = Key.map(element => {
        const cobj = elements[element];
        const itemId = cobj.itemId;
        let itemName = "";
        let itemObj = {};
        itemObj.img = './icon/nft/na.png';
        itemName = "ID: " + itemId;
        function keyInTable(table, id) {
            const keyFound = Object.keys(table).find(key => {
                const match = Number(table[key].id) === Number(id);
                if (match) {
                    //console.log("keyInTable: trouvé", key, table[key].id, id);
                }
                return match;
            });
            return keyFound || null;
        }
        if (cobj.collection === "collectibles" || cobj.collection === "resources" || cobj.collection === "temporary") {
            if (keyInTable(it, itemId) !== null) { itemName = keyInTable(it, itemId); }
            if (keyInTable(fish, itemId) !== null) { itemName = keyInTable(fish, itemId); }
            if (keyInTable(flower, itemId) !== null) { itemName = keyInTable(flower, itemId); }
            if (keyInTable(bounty, itemId) !== null) { itemName = keyInTable(bounty, itemId); }
            if (keyInTable(craft, itemId) !== null) { itemName = keyInTable(craft, itemId); }
            if (keyInTable(mutant, itemId) !== null) { itemName = keyInTable(mutant, itemId); }
            if (keyInTable(nft, itemId) !== null) { itemName = keyInTable(nft, itemId); }
        }
        if (cobj.collection === "wearables") {
            itemName = "Wearable ID: " + itemId;
            if (keyInTable(nftw, itemId) !== null) { itemName = keyInTable(nftw, itemId); }
        }
        if (cobj.collection === "buds") {
            itemName = "Bud #" + itemId;
            itemObj.img = './icon/nft/budplaza.png';
        }
        //console.log("ID:", itemId, " itemName:", itemName);
        if (it[itemName]) { itemObj = it[itemName]; }
        if (flower[itemName]) { itemObj = flower[itemName]; }
        if (bounty[itemName]) { itemObj = bounty[itemName]; }
        if (craft[itemName]) { itemObj = craft[itemName]; }
        //if (bud[itemName]) { itemObj = bud[itemName]; }
        if (mutant[itemName]) { itemObj = mutant[itemName]; }
        if (nft[itemName]) { itemObj = nft[itemName]; }
        if (nftw[itemName]) { itemObj = nftw[itemName]; }
        const ico = <img src={itemObj.img} alt={''} className="nodico" title={itemName} />;
        const iFrom = cobj.fulfilledBy?.username || "?";
        const txtFrom = cobj.fulfilledBy?.username === dataSetFarm.username ? <b>{iFrom}</b> : iFrom;
        const iTo = cobj.initiatedBy?.username || "?";
        const txtTo = cobj.initiatedBy?.username === dataSetFarm.username ? <b>{iTo}</b> : iTo;
        const iQuant = cobj.quantity || 0;
        const iType = cobj.source || "?";
        const icost = frmtNb((itemObj.cost * iQuant) / dataSet.options.coinsRatio);
        const icostm = itemObj.costp2pt;
        const isfl = cobj.sfl;
        const ts = Number(cobj.fulfilledAt);
        const createdDate = isFinite(ts) ? new Date(ts < 1e12 ? ts * 1000 : ts) : null;
        const icreatedAt = createdDate ? createdDate.toLocaleString() : "";
        totSell += cobj.initiatedBy?.username === dataSetFarm.username ? isfl : 0;
        totBuy += cobj.fulfilledBy?.username === dataSetFarm.username ? isfl : 0;
        return (
            <tr>
                {xListeColBounty[0][1] === 1 ? <td className="tdcenter">{txtTo}</td> : null}
                {xListeColBounty[0][1] === 1 ? <td className="tdcenter">{txtFrom}</td> : null}
                {xListeColBounty[0][1] === 1 ? <td className="tdcenter">{iType}</td> : null}
                {/* {xListeColBounty[0][1] === 1 ? <td className="tditem">{itemId}</td> : null} */}
                <td id="iccolumn">{ico}</td>
                {xListeColBounty[0][1] === 1 ? <td className="tditem">{itemName}</td> : null}
                {xListeColBounty[0][1] === 1 ? <td className="tdcenter">{iQuant}</td> : null}
                {xListeColBounty[1][1] === 1 ? <td className="tdcenter">{isfl}</td> : null}
                {xListeColBounty[1][1] === 1 ? <td className="tdcenter">{icost}</td> : null}
                {xListeColBounty[1][1] === 1 ? <td className="tdcenter">{icreatedAt}</td> : null}
            </tr>
        );
    });
    const tableHeader = (
        <thead>
            <tr>
                {xListeColBounty[0][1] === 1 ? <th className="thcenter">Seller</th> : null}
                {xListeColBounty[0][1] === 1 ? <th className="thcenter">Buyer</th> : null}
                {xListeColBounty[0][1] === 1 ? <th className="thcenter">Type</th> : null}
                {/* {xListeColBounty[0][1] === 1 ? <th className="thcenter">ID</th> : null} */}
                <th className="th-icon"></th>
                {xListeColBounty[0][1] === 1 ? <th className="thcenter">Name</th> : null}
                {xListeColBounty[1][1] === 1 ? <th className="thcenter">Quantity</th> : null}
                {xListeColBounty[1][1] === 1 ? <th className="thcenter">Price {imgsfl}</th> : null}
                {xListeColBounty[4][1] === 1 ? <th className="thcenter">Prod {imgsfl}</th> : null}
                {xListeColBounty[5][1] === 1 ? <th className="thcenter">Since</th> : null}
            </tr>
        </thead>
    );
    const table = (
        <>
            <h2 style={{ margin: 0 }}>Traded</h2>
            <div>Total sold : {frmtNb(totSell)}{imgsfl} - Total buyed : {frmtNb(totBuy)}{imgsfl}</div>
            <table className="table">
                {tableHeader}
                <tbody>
                    {tableBody}
                </tbody>
            </table>
        </>
    );
    return table;
}