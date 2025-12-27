import React, { useEffect, useState, useRef, useMemo } from 'react';
import logo from './gobcarry.gif';
import './App.css';
import ModalTNFT from './ftrynft.js';
import ModalGraph from './fgraph.js';
import ModalDlvr from './fdelivery.js';
import ModalOptions from './foptions.js';
import Help from './fhelp.js';
import Cadre from './animodal.js';
import Tooltip from "./tooltip.js";
//import DropdownCheckbox from './listcol.js';
//import CounterInput from "./counterinput.js";
import { FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel } from '@mui/material';
import { frmtNb, filterTryit, formatUpdated } from './fct.js';

import { AppCtx } from "./context/AppCtx";
import PanelTable from "./tables/PanelTable";

import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { StatusBar, Style } from '@capacitor/status-bar';
//StatusBar.setStyle({ style: Style.Light });
const isNativeApp = Capacitor.isNativePlatform();

const runLocal = true;
const API_URL = runLocal ? "" : process.env.REACT_APP_API_URL;

var vversion = 0.08;
let dataSet = {};
dataSet.options = {};

const imgsfl = './icon/res/flowertoken.webp';
const imgSFL = <img src={imgsfl} alt={''} className="itico" title="Flower" />;
const imgcoins = './icon/res/coins.png';
const imgCoins = <img src={imgcoins} alt={''} className="itico" title="Coins" />;
const imgxp = './icon/ui/level_up.png';
const imgcrop = './icon/res/soil.png';
const imgwood = './icon/res/harvested_tree.png';
const imgstone = './icon/res/stone_small.png';
const imgbeehive = './icon/res/beehive.webp';
const imgcow = './icon/res/cow.webp';
const imgsheep = './icon/res/sheep.webp';
const imgflowerbed = './icon/flower/flower_bed_modal.png';
const imgchkn = './icon/res/chkn.png';
const imgflch = './icon/ui/flch.png';
const imgrdy = './icon/ui/expression_alerted.png';
const imgtrd = './icon/ui/sparkle2.gif';
const imgpet = './icon/pet/dog.webp';
const imgshrine = './icon/shrine/boar.webp';
const imgacorn = './icon/pet/acorn.webp';
const imgexchng = './icon/ui/exchange.png';
const imgExchng = <img src={imgexchng} alt={''} title="Marketplace" style={{ width: '25px', height: '25px' }} />;
const imgbuyit = <img src={imgexchng} alt={''} title="Marketplace" style={{ width: '15px', height: '15px' }} />;
const imgna = './icon/nft/na.png';
const imgrod = './icon/tools/fishing_rod.png';
const imgwinter = <img src="./icon/ui/winter.webp" alt={''} className="seasonico" title="Winter" />;
const imgspring = <img src="./icon/ui/spring.webp" alt={''} className="seasonico" title="Spring" />;
const imgsummer = <img src="./icon/ui/summer.webp" alt={''} className="seasonico" title="Summer" />;
const imgautumn = <img src="./icon/ui/autumn.webp" alt={''} className="seasonico" title="Autumn" />;

var platformListings = "Trades";
let buttonClicked = false;
let initialIntervalDone = false;
let curID = "";
let lastID = "";

let helpImage = "./image/helpgeneral.jpg";

function App() {
  const [initialDataSet, setInitialDataSet] = useState(null);
  const [notifListInitial, setNotifListInitial] = useState(null);
  const uiDefaults = {
    selectedInv: "home",
    selectedCurr: "SFL",
    selectedQuant: "unit",
    selectedQuantCook: "quant",
    selectedQuantFish: "quant",
    selectedCostCook: "trader",
    selectedQuantity: "farm",
    selectedQuantityCook: "farm",
    selectedAnimalLvl: "farm",
    selectedReady: "when",
    selectedDsfl: "trader",
    selectedFromActivity: "today",
    selectedExpandType: "spring",
    selectedSeedsCM: "stock",
    selectedQuantFetch: "stock",
    activityDisplay: "item",
    selectedDigCur: "sfl",
    selectedSeason: "all",
    petView: "pets",
    inputValue: "",
    inputKeep: 3,
    inputFromLvl: 1,
    inputToLvl: 30,
    useNotif: false,
    TryChecked: false,
    CostChecked: true,
    BurnChecked: true,
    fromtoexpand: [],
    xHrvst: {},
    xHrvsttry: {},
    isOpen: {},
    customSeedCM: {},
    customQuantFetch: {},
    cstPrices: {},
    toCM: {},
    xListeCol: [['Hoard', 1],
    ['Item name', 0],
    ['Quantity', 1],
    ['Time', 1],
    ['Production cost', 1],
    ['Shop price', 1],
    ['Ratio coins/flower', 1],
    ['Marketplace price', 1],
    ['Withdraw quantity', 0],
    ['Niftyswap price', 0],
    ['OpenSea price', 0],
    ['Price difference with Marketplace', 0],
    ['Yield', 1],
    ['Harvest average', 1],
    ['To harvest', 1],
    ['BlockBuck production', 0],
    ['Daily SFL', 1],
    ['Daily max production', 1],
    ['Coefficient Prod cost / Sell cost', 1],
    ['Wen ready', 1]],
    xListeColCook: [['Building', 1],
    ['Item name', 0],
    ['Quantity', 1],
    ['XP', 1],
    ['Time to cook', 1],
    ['Time for components growing', 0],
    ['XP/H', 1],
    ['XP/H with components time', 0],
    ['XP/SFL', 1],
    ['Cost', 1],
    ['Cost p2p', 1],
    ['Components', 1]],
    xListeColFish: [['Category', 1],
    ['Location', 0],
    ['Hoard', 1],
    ['Item name', 1],
    ['Bait', 1],
    ['Quantity on farm', 1],
    ['Caught', 1],
    ['Chum', 1],
    ['Period', 1],
    ['Percent by category', 1],
    ['XP', 1],
    ['Cost', 1],
    ['XP/SFL', 1]],
    xListeColFlower: [['Seed', 1],
    ['Flower name', 1],
    ['Breeding', 1],
    ['Quantity in bag', 1],
    ['Found', 1]],
    xListeColBounty: [['Item name', 1],
    ['Stock', 1],
    ['Value', 1],
    ['Today', 1],
    ['Value', 1],
    ['ToolCost', 1]],
    xListeColAnimals: [['Item name', 1],
    ['LVL', 1],
    ['Prod 1', 1],
    ['Prod 2', 1],
    ['Food', 1],
    ['Food Cost', 1],
    ['Food Cost P2P', 1],
    ['Prod 1 Cost', 1],
    ['Prod 1 Cost P2P', 1],
    ['Prod 2 Cost', 1],
    ['Prod 2 Cost P2P', 1],
    ['1 love', 1],
    ['2 love', 1]],
    xListeColExpand: [['From / To', 1],
    ['LVL requirement', 1],
    ['Ressources requirement', 1],
    ['Nodes', 1],
    ['Cost', 1]],
    xListeColActivity: [['From', 1],
    ['Total XP', 1],
    ['Tickets on daily chest', 1],
    ['Tickets on crops', 1],
    ['Tickets on tentacles', 1],
    ['Tickets from deliveries', 1],
    ['Tickets from chores', 1],
    ['Tickets max', 1],
    ['Deliveries cost', 1],
    ['Deliveries cost P2P', 1],
    ['Ticket cost', 1],
    ['SFL from deliveries', 1],
    ['SFL balance', 1],
    ['Ressources burned', 1]],
    xListeColActivityItem: [['Item Name', 1],
    ['Harvested', 1],
    ['Quantity', 1],
    ['Burned', 1],
    ['Production Cost', 1],
    ['Balloon Price', 1],
    ['Niftyswap Price', 1],
    ['OpenSea Price', 1],
    ['Traded', 1],
    ['Devliveries Burn', 1],
    ['Food produced', 1]],
    xListeColActivityQuest: [['From', 1],
    ['Description', 1],
    ['Reward', 1],
    ['Date', 1]],
  };
  const [ui, setUI] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("ui"));
      return {
        ...uiDefaults,
        ...(stored || {}),
      };
    } catch {
      return uiDefaults;
    }
  });
  useEffect(() => {
    localStorage.setItem("ui", JSON.stringify(ui));
  }, [ui]);
  const { inputValue, TryChecked, selectedInv, useNotif, fromexpand, toexpand, selectedExpandType } = ui;

  const [farmData, setFarmData] = useState([]);
  const [dataSetFarm, setdataSetFarm] = useState({});
  const [options, setOptions] = useState({});
  const [bumpkinData, setBumpkinData] = useState([]);
  const [ftradesData, setftradesData] = useState(null);
  const [mutData, setmutData] = useState([]);
  const [GraphType, setGraphType] = useState('');
  const [deliveriesData, setdeliveriesData] = useState([]);
  const [priceData, setpriceData] = useState([]);
  const [tooltipData, setTooltipData] = useState(null);
  const progressTimerRef = useRef(null);
  const [searchProgress, setSearchProgress] = useState(0);
  const [activeTimers, setActiveTimers] = useState([]);
  const pendingSaveRef = useRef(false);
  const [reqState, setReqState] = useState("");
  const [cdButton, setcdButton] = useState(false);
  const [showfTNFT, setShowfTNFT] = useState(false);
  const [showfGraph, setShowfGraph] = useState(false);
  const [showfDlvr, setShowfDlvr] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showCadre, setShowCadre] = useState(false);

  const handleHomeClic = (index) => {
    //setIsOpen((prevState) => ({
    setUIField("isOpen", (prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };
  const handleButtonfTNFTClick = () => {
    setShowfTNFT(true);
  };
  const handleButtonfDlvrClick = () => {
    setShowfDlvr(true);
  };
  const handleButtonOptionsClick = () => {
    setInitialDataSet(JSON.parse(JSON.stringify(dataSet)));
    setNotifListInitial(JSON.stringify(dataSet.options.notifList));
    setShowOptions(true);
  };
  const handleButtonHelpClick = () => {
    helpImage = "./image/helpgeneral.jpg";
    setShowHelp(true);
  };
  const handleClosefTNFT = (xdataSet, xdataSetFarm) => {
    dataSet = xdataSet;
    /* const newDataSetLocal = { ...xdataSetFarm };
    setdataSetFarm(newDataSetLocal); */
    //const deepClone = obj => JSON.parse(JSON.stringify(obj));
    setdataSetFarm(xdataSetFarm);
    setdeliveriesData(xdataSetFarm.orderstable);
    setShowfTNFT(false);
    //setCookie();
    pendingSaveRef.current = true;
  };
  const handleRefreshfTNFT = (xdataSet, xdataSetFarm) => {
    dataSet = xdataSet;
    setdataSetFarm(xdataSetFarm);
    //setCookie();
    pendingSaveRef.current = true;
  };
  const handleClosefGraph = () => {
    setShowfGraph(false);
  };
  const handleClosefDlvr = () => {
    setShowfDlvr(false);
  };
  const handleCloseOptions = () => {
    setShowOptions(false);
    setCookie();
    if (notifListInitial && JSON.stringify(dataSet.options.notifList) !== notifListInitial) {
      UpdateNotifList();
    }
  };
  const handleCloseHelp = () => {
    setShowHelp(false);
  };
  const handleCloseCadre = () => {
    setShowCadre(false);
  };
  async function subscribeToPush() {
    if (isNativeApp) {
      const permStatus = await PushNotifications.requestPermissions();
      if (permStatus.receive === 'granted') {
        await PushNotifications.register();
        PushNotifications.addListener('registration', async (token) => {
          console.log('FCM token:', token.value);
          dataSet.options.pushToken = token.value;
          const subfarm = {
            farmId: curID,
            token: token.value,
            type: 'fcm'
          };
          await fetch('/save-subscription', {
            method: 'POST',
            body: JSON.stringify(subfarm),
            headers: { 'Content-Type': 'application/json' },
          });
          console.log('FCM subscription saved');
        });
        PushNotifications.addListener('registrationError', (err) => {
          console.error('FCM registration error:', err);
        });
      } else {
        console.warn('Push permission not granted');
      }
    } else {
      function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
          .replace(/\-/g, '+').replace(/_/g, '/');

        const rawData = atob(base64);
        return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
      }
      const registration = await navigator.serviceWorker.ready;
      const webPushK = process.env.REACT_APP_WEBPUSH_PUBLICKEY;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(webPushK)
      });
      const subfarm = {
        farmId: curID,
        subscription: subscription.toJSON(),
        type: 'web'
      }
      await fetch('/save-subscription', {
        method: 'POST',
        body: JSON.stringify(subfarm),
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Notif on');
    }
  }
  async function UpdateNotifList() {
    const subfarm = {
      farmId: curID,
      notifList: Object.fromEntries(dataSet.options.notifList)
    }
    await fetch('/notiflist-subscription', {
      method: 'POST',
      body: JSON.stringify(subfarm),
      headers: { 'Content-Type': 'application/json' },
    });
    //console.log('FCM subscription saved');
  }
  async function unsubscribeFromPush() {
    if (isNativeApp) {
      const token = dataSet.options.pushToken; //await getFCMToken();
      if (token) {
        const subfarm = {
          farmId: curID,
          token: token,
          type: 'fcm'
        };
        await fetch('/remove-subscription', {
          method: 'POST',
          body: JSON.stringify(subfarm),
          headers: { 'Content-Type': 'application/json' },
        });
        console.log('FCM token removed');
      }
    } else {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        const subfarm = {
          farmId: curID,
          subscription: subscription.toJSON(),
          type: 'web'
        }
        await fetch('/remove-subscription', {
          method: 'POST',
          body: JSON.stringify(subfarm),
          headers: { 'Content-Type': 'application/json' },
        });
        console.log('Notif off');
      } else {
        console.log('No subscription');
      }
    }
  }

  const handleUIChange = (e) => {
    if (!e || !e.target) return;
    const t = e.target;
    const name = t.name;
    if (!name) return;
    let value;
    if (t.type === "checkbox") {
      if (name.includes(".")) {
        const [root, key] = name.split(".", 2);
        setUI(prev => ({
          ...(prev ?? {}),
          [root]: {
            ...(prev?.[root] ?? {}),
            [key]: !!t.checked,
          },
        }));
        return;
      } else value = !!t.checked;
    } else value = t.value;

    if (name.includes(":")) {
      const [root, item] = name.split(":", 2);
      //const item = name.slice(root.length + 1);
      setdataSetFarm(prev => {
        const itables = prev?.itables ?? {};
        const it = itables?.it ?? {};
        const food = itables?.food ?? {};
        let tableKey = null;
        if (it[item]) tableKey = "it";
        else if (food[item]) tableKey = "food";
        else return prev;
        const table = itables[tableKey] ?? {};
        const current = table[item] ?? {};
        return {
          ...prev,
          itables: {
            ...itables,
            [tableKey]: {
              ...table,
              [item]: {
                ...current,
                [root]: current?.[root] === 1 ? 0 : 1,
              },
            },
          },
        };
      });
      setCookie();
      return;
    }

    if (name.includes(".")) {
      const [root, key] = name.split(".", 2);
      const n = parseInt(String(value).replace(/\D/g, ""), 10);
      const parsed = Number.isFinite(n) ? n : 0;

      setUI(prev => ({
        ...(prev ?? {}),
        [root]: {
          ...(prev?.[root] ?? {}),
          [key]: parsed,
        },
      }));
      return;
    }

    setUI(prev => ({ ...(prev ?? {}), [name]: value }));
  };

  const setUIField = (name, valueOrUpdater) => {
    setUI((prev) => {
      const prevValue = prev?.[name];
      const nextValue =
        typeof valueOrUpdater === "function"
          ? valueOrUpdater(prevValue)
          : valueOrUpdater;
      return {
        ...(prev ?? {}),
        [name]: nextValue,
      };
    });
  };

  const handleOptionChange = (eventOrValue, fieldName = null) => {
    let xvalue = 0;
    let name = "";
    if (eventOrValue?.target) {
      if (eventOrValue?.target.value) {
        xvalue = Number(eventOrValue.target.value.replace(/\D/g, ""));
      }
      if (eventOrValue?.target.checked) {
        xvalue = eventOrValue.target.checked;
      }
      name = eventOrValue.target.name;
    } else {
      xvalue = Number(eventOrValue);
      name = fieldName;
    }
    if (!name) {
      if (Array.isArray(eventOrValue)) {
        if (JSON.stringify(dataSet.options.notifList) !== JSON.stringify(eventOrValue)) {
          dataSet.options.notifList = eventOrValue;
          setOptions({ ...dataSet.options, notifList: eventOrValue });
          //UpdateNotifListDebounced();
        }
        return;
      }
      return;
    }
    /* let notifListTimeout;
    function UpdateNotifListDebounced() {
      clearTimeout(notifListTimeout);
      notifListTimeout = setTimeout(() => {
        UpdateNotifList();
      }, 300);
    } */
    if (isNaN(xvalue)) xvalue = 0;
    if (xvalue < 0) xvalue = 1;
    if (name.startsWith("animalLvl_")) {
      const animal = name.replace("animalLvl_", "");
      // immutable update: avoid mutating dataSet.options in-place
      const newAnimalLvl = { ...(dataSet.options.animalLvl || {}), [animal]: xvalue };
      const newOptions = { ...dataSet.options, animalLvl: newAnimalLvl };
      dataSet.options = newOptions;
      setOptions(newOptions);
      return;
    }
    switch (name) {
      case "FarmTime":
        if (xvalue > 24) xvalue = 24;
        dataSet.options.inputFarmTime = xvalue;
        setOptions({ ...dataSet.options });
        //setInputFarmTime(xvalue);
        break;
      case "CoinsRatio":
        dataSet.options.coinsRatio = xvalue;
        setOptions({ ...dataSet.options });
        //setInputCoinsRatio(xvalue);
        break;
      case "GemsRatio":
        dataSet.options.gemsRatio = xvalue;
        setOptions({ ...dataSet.options });
        //setInputGemsRatio(xvalue);
        break;
      default:
        try {
          dataSet.options[name] = xvalue;
          setOptions({ ...dataSet.options });
        } catch (error) {
          console.error("Error updating option:" + name + ": ", error);
        }
      //console.warn("Champ inconnu :", name);
    }
    //setCookie();
  };
  function handleSetHrvMax(TryChecked) {
    if (!dataSetFarm?.itables?.it) return;
    const it = dataSetFarm.itables.it;
    const next = {};
    for (const item in it) {
      const dc = TryChecked
        ? (it[item]?.dailycycletry ?? it[item]?.dailycycle ?? 0)
        : (it[item]?.dailycycle ?? 0);

      if (dc > 0) next[item] = dc;
    }
    setUI((prev) => ({
      ...prev,
      ...(TryChecked
        ? { xHrvsttry: next }
        : { xHrvst: next }),
    }));
  }
  const handleButtonClick = async (context = null) => {
    const { inputValue } = ui;
    if (inputValue === null || inputValue === "" || inputValue === 0) return;
    if (cdButton) return;
    activeTimers.forEach(timerId => {
      clearInterval(timerId);
    });
    try {
      //lastClickedInputValue.current = inputValue;
      curID = inputValue;
      if (context === "EnterPressed") { setFarmData([]); }
      const tryItArrays = filterTryit(dataSetFarm, true);
      //setInputValue(lastClickedInputValue.current);
      const fetchFarmData = async (retryCount = 0) => {
        try {
          const response = await fetch(API_URL + "/getfarm", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              frmid: curID,
              options: dataSet.options,
              tryitarrays: tryItArrays,
              context: context,
            }),
          });
          if (response.status === 202) {
            setReqState(
              <div>
                <img src="./icon/goblin_carry.gif" alt="Your farm is coming." />
                Your farm is coming.
              </div>
            );
            //console.log("Farm data not yet available. Retrying...");
            if (retryCount < 5) {
              setTimeout(() => fetchFarmData(retryCount + 1), 5000);
            } else {
              //console.error("Max retry attempts reached. Farm data still not available.");
              setReqState("Farm data not available after multiple attempts.");
            }
          } else if (response.status === 200) {
            const responseData = await response.json();
            buttonClicked = true;
            dataSet.options.username = responseData.username;
            dataSet.options.farmId = responseData.frmid;
            dataSet.isBanned = responseData.frmData.isbanned ?
              <div style={{ color: "red", margin: "0", padding: "0" }}><img src={"./icon/ui/suspicious.png"} />
                <span>BANNED {responseData.frmData.isbannedstatus}</span></div>
              : "";
            dataSet.options.isAbo = responseData.isabo;
            dataSet.isVip = responseData.frmData.vip;
            dataSet.dateVip = responseData.frmData.datevip;
            dataSet.dailychest = responseData.frmData.dailychest;
            dataSet.taxFreeSFL = frmtNb(responseData.frmData.taxFreeSFL);
            dataSet.bumpkin = responseData.Bumpkin[0];
            //dateSeason = new Date(responseData.constants.dateSeason);
            dataSet.tktName = responseData.constants.tktName;
            dataSet.imgtkt = responseData.constants.imgtkt;
            //dataSet.options.tradeTax = responseData.tradeTax;
            if (!dataSet?.options?.tradeTax || dataSet?.options?.autoTradeTax) { dataSet.options.tradeTax = responseData.frmData.tradeTax; }
            if (dataSet?.options?.autoCoinRatio) { dataSet.options.coinsRatio = responseData.bestCoinRatio?.ratio || 0; }
            if ((lastID !== curID || !dataSet.bumpkinImg)) {
              const response = await fetch(API_URL + "/getbumpkin", {
                method: 'GET',
                headers: {
                  //tokenuri: bumpkinData[0].tkuri,
                  //bknid: 1, //bumpkinData[0].id,
                  frmid: curID,
                  username: dataSet.options.username,
                  tknuri: dataSet.bumpkin.tkuri,
                }
              });
              if (response.ok) {
                const data = await response.json();
                //bkn = data.responseBumpkin;
                let imageData = data.responseImage;
                //imageData = await magentaToAlpha(imageData, { r: 255, g: 0, b: 255, tol: 24 });
                //setImageData(`data:image/png;base64,${imageData}`);
                //dataSet.bumpkinImg = `data:image/png;base64,${imageData}`;
                dataSet.bumpkinImg = imageData;
                //setBumpkinDataOC(data.responseBkn);
                //bumpkinData[0].Bknlvl = data.Bknlvl;
              }
            }
            setReqState('');
            setFarmData(responseData.frmData);
            setBumpkinData(responseData.Bumpkin);
            setUIField("selectedExpandType", responseData.frmData.expandData.type);
            //setUIField("selectedInv", "home");
            //setSelectedExpandType(responseData.frmData.expandData.type);
            //setfromtoexpand(responseData.expandData);
            getFromToExpand(fromexpand || 1, toexpand || 10, responseData.frmData.expandData.type);
            //setanimalData(responseData.Animals);
            refreshDataSet(responseData);
            const { frmData, expandData, fishingDetails, taxFreeSFL } = responseData;
            dataSet.balance = frmData.balance;
            dataSet.coins = frmData.coins;
            const balance = frmData.balance;
            const withdrawreduc = (expandData?.type === "desert" || expandData?.type === "spring" || expandData?.type === "volcano") ? 2.5 : 0;
            const withdrawtax = (balance < 10 ? 30 : balance < 100 ? 25 : balance < 1000 ? 20 : balance < 5000 ? 15 : 10) - withdrawreduc;
            dataSet.withdrawtax = withdrawtax;
            const withdrawSFLbeyondTaxFree = Number(taxFreeSFL) - Number(balance);
            const withdrawsflFree = (withdrawSFLbeyondTaxFree < 0) ? Number(taxFreeSFL) : Number(balance);
            const withdrawsflNotFree = (withdrawsflFree >= Number(balance)) ? 0 : (Number(balance) - withdrawsflFree);
            const withdrawSflNotFreeTaxed = (withdrawsflNotFree > 0) ? (withdrawsflNotFree - (withdrawsflNotFree * (withdrawtax / 100))) : 0;
            const sflwithdraw = frmtNb(withdrawsflFree + withdrawSflNotFreeTaxed);
            dataSet.sflwithdraw = sflwithdraw;
            const xfishcastmax = fishingDetails && (!TryChecked ? fishingDetails.CastMax : fishingDetails.CastMaxtry);
            const xfishcost = fishingDetails && ((!TryChecked ? fishingDetails.CastCost : fishingDetails.CastCosttry) / dataSet.options.coinsRatio);
            dataSet.fishcasts = fishingDetails && (fishingDetails.casts + "/" + xfishcastmax);
            dataSet.fishcosts = fishingDetails && (parseFloat(fishingDetails.casts * xfishcost).toFixed(3) + "/" + parseFloat(xfishcastmax * xfishcost).toFixed(3));
            setdataSetFarm({ ...responseData });
            dataSet.updated = formatUpdated(frmData?.updated);
            if (dataSet.options.firstLoad) {
              dataSet.options.firstLoad = false
              handleButtonHelpClick();
            }
            if (context === "optionChanged") {

            } else {
              await getPrices(true);
            }
            if (responseData.mutantchickens) {
              setMutants(responseData);
            }
            //setRefresh(new Date().getMilliseconds());
            setdeliveriesData(responseData.orderstable);
            setfTrades();
            setCookie();
          } else {
            setReqState(`Error : ${response.status}`);
            dataSet.updated = formatUpdated(farmData?.updated);
            const newdataSetFarm = { ...dataSetFarm };
            setdataSetFarm(newdataSetFarm);
            //console.error("Error fetching farm data:", response.status);
          }
          //setUIField("cdButton", true);
          setcdButton(true);
          setTimeout(() => {
            //setUIField("cdButton", false);
            setcdButton(false);
          }, 2000);
        } catch (error) {
          //setReqState(`Error : ${response.status}`);
          //console.error("Error during fetchFarmData:", error);
          setReqState(`Error : ${error.message}`);
          dataSet.updated = formatUpdated(farmData?.updated);
          const newdataSetFarm = { ...dataSetFarm };
          setdataSetFarm(newdataSetFarm);
          throw (error);
        }
      };
      await fetchFarmData();
      /* if (selectedInv === "activity") {
        getActivity();
      } */
      lastID = curID;
    } catch (error) {
      //setReqState(`Error : ${error}`);
      throw (error);
      //console.log(`Error : ${error}`);
      //localStorage.clear();
      //console.log("Error, cleared local data");
    }
  };

  const handleTraderClick = () => {
    setGraphType("Marketplace");
    setShowfGraph(true);
  };
  const handleNiftyClick = () => {
    setGraphType("Nifty");
    setShowfGraph(true);
  };
  const handleOSClick = () => {
    setGraphType("OpenSea");
    setShowfGraph(true);
  };
  const handleTradeListClick = async (frmid, element, platform) => {
    platformListings = platform;
    if (platformListings === "OS") {
      const response = await fetch(API_URL + "/get50listing", {
        method: 'GET',
        headers: {
          frmid: frmid,
          listid: element,
          platform: platform,
        }
      });
      if (response.ok) {
        try {
          const responseData = await response.json();
          if (responseData !== 'error') {
            //const responseData = response.body;
            setlistingsData(responseData);
            setShowCadre(true);
            //console.log(responseData);
          }
        } catch (error) {
          console.log(error)
        }
      } else {
        console.log(response);
      }
    }
  }
  const handleTooltip = async (item, context, value, event) => {
    try {
      const { clientX, clientY } = event;
      let bdrag = true;
      if (context === "trades") { bdrag = false }
      if (context === "username") { bdrag = false }
      setTooltipData({
        x: clientX,
        y: clientY,
        item,
        context,
        value,
        bdrag
      });
      //console.log(item, context, value, event);
    } catch (error) {
      console.log(error)
    }
  }
  const handleDonClick = (address, element) => {
    const textarea = document.createElement('textarea');
    textarea.value = address;
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    if (success) {
      const tooltip = document.createElement('div');
      tooltip.classList.add('tooltipfrmid');
      tooltip.textContent = address + ' copied !';
      const rect = element.getBoundingClientRect();
      tooltip.style.top = rect.top + 40 + 'px';
      tooltip.style.left = rect.left - 70 + 'px';
      document.body.appendChild(tooltip);
      setTimeout(() => {
        document.body.removeChild(tooltip);
      }, 2000);
      document.body.removeChild(textarea);
    };
  }

  const data = useMemo(() => ({
    dataSet,
    dataSetFarm,
    farmData,
    bumpkinData,
    priceData,
    tooltipData
  }), [
    dataSet,
    dataSetFarm,
    farmData,
    bumpkinData,
    priceData,
    tooltipData
  ]);
  const config = useMemo(() => ({
    API_URL
  }), [
    API_URL
  ]);
  const actions = useMemo(() => ({
    handleUIChange,
    handleOptionChange,
    setUIField,
    handleTooltip,
    handleHomeClic,
    handleTraderClick,
    handleRefreshfTNFT,
    handleSetHrvMax
  }), [
    handleUIChange,
    setUIField,
    handleTooltip,
    handleHomeClic,
    handleTraderClick,
    handleRefreshfTNFT,
    handleSetHrvMax
  ]);
  const img = useMemo(() => ({
    imgsfl,
    imgSFL,
    imgcoins,
    imgCoins,
    imgxp,
    imgrdy,
    imgwinter,
    imgspring,
    imgsummer,
    imgautumn,
    imgcrop,
    imgwood,
    imgstone,
    imgbeehive,
    imgcow,
    imgsheep,
    imgflowerbed,
    imgchkn,
    imgpet,
    imgexchng,
    imgExchng,
    imgbuyit,
    imgna,
    imgrod,
  }), [
    imgsfl,
    imgSFL,
    imgcoins,
    imgCoins,
    imgxp,
    imgrdy,
    imgwinter,
    imgspring,
    imgsummer,
    imgautumn,
    imgcrop,
    imgwood,
    imgstone,
    imgbeehive,
    imgcow,
    imgsheep,
    imgflowerbed,
    imgchkn,
    imgpet,
    imgexchng,
    imgExchng,
    imgbuyit,
    imgna,
    imgrod,
  ]);
  const ctx = useMemo(() => ({ data, config, ui, actions, img }), [data, config, ui, actions, img]);

  function setfTrades() {
    const { ftrades } = dataSetFarm;
    if (ftrades) {
      if (dataSetFarm.itables === undefined) return;
      const { it, fish, flower } = dataSetFarm.itables;
      const { nft, nftw } = dataSetFarm.boostables;
      const data = Object.values(ftrades);
      const vegetableNames = data.map((entry) => Object.keys(entry.items)[0]);
      //const vegetablePrices = data.map((entry) => Object.values(entry.items)[0]);
      const exchangeimg = <img src={imgexchng} alt="" className="itico" title="Listings" />;
      const imgsold = <img
        src="./icon/ui/confirm.png"
        title="Sold"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "15px",
          height: "15px",
          zIndex: 1,
          opacity: 0.6
        }}
      />
      //const itemimg = it[name]?.img || nft[name]?.img || nftw[name]?.img || imgna;
      const tableContent = (
        <>
          <tr>
            <td>{exchangeimg}</td>
            {vegetableNames.map((name, index) => (
              <td style={{ textAlign: 'center', position: "relative" }}>
                {<img src={it[name]?.img || fish[name]?.img || flower[name]?.img || nft[name]?.img || nftw[name]?.img || imgna}
                  alt={''} className="itico" title={name} />}
                {data[index]?.fulfilledAt && imgsold}</td>
            ))}
          </tr>
          {/* <tr>
            {vegetablePrices.map((price, index) => (
              <td className="tdcenter">{price}</td>
            ))}
          </tr> */}
        </>
      );
      const table = (
        <>
          <table className="tabletrades">
            <tbody>
              {tableContent}
            </tbody>
          </table>
        </>
      );
      setftradesData(table);
    }
  }

  function PBarSFL() {
    const maxh = 255;
    if (farmData.balance) {
      const previousQuantity = farmData.previousBalance;
      const Quantity = farmData.balance;
      const difference = Quantity - previousQuantity;
      const absDifference = Math.abs(difference);
      const isNegativeDifference = difference < 0;
      const hoardPercentage = Math.floor((absDifference / maxh) * 100);
      return (
        hoardPercentage > 0 && (
          <div className={`progress-barb ${isNegativeDifference ? 'negative' : ''}`}>
            <div className="progress" style={{ width: `${hoardPercentage}%` }}>
              <span className="progress-text">
                {isNegativeDifference ? frmtNb(absDifference) : `${frmtNb(difference)}/${frmtNb(maxh)}`}
              </span>
            </div>
          </div>
        )
      );
    }
  }
  async function getPrices(onlyPrices) {
    const tryItArrays = filterTryit(dataSetFarm, true);
    let vHeaders = onlyPrices ? {
      onlyprices: "true",
    } : {
      frmid: curID,
      options: dataSet.options,
      tryitarrays: tryItArrays,
    };
    //console.log("dataSetFarm dans getPrices :", dataSetFarm);
    const response = await fetch(API_URL + "/getdatacrypto", {
      //method: 'GET',
      //headers: vHeaders
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vHeaders),
    });
    if (response.ok) {
      const responseData = await response.json();
      const respData = responseData.allData;
      setpriceData(JSON.parse(JSON.stringify(responseData.priceData)));
      if (respData !== "" && respData !== undefined) {
        //setdataSetFarm(respData);
        setFarmData(respData.frmData);
        dataSet.options.isAbo = respData.isabo;
        dataSet.isVip = respData.frmData.vip;
        dataSet.dateVip = respData.frmData.datevip;
        dataSet.dailychest = respData.frmData.dailychest;
        dataSet.taxFreeSFL = frmtNb(respData.frmData.taxFreeSFL);
        dataSet.bumpkin = respData.Bumpkin[0];
        setBumpkinData(respData.Bumpkin);
        const { frmData, expandData, fishingDetails, taxFreeSFL } = respData;
        dataSet.balance = frmData.balance;
        dataSet.coins = frmData.coins;
        const balance = frmData.balance;
        dataSet.updated = formatUpdated(frmData?.updated);
        let refreshOptions = false;
        if (dataSet?.options?.tradeTax !== frmData?.tradeTax && dataSet?.options?.tradeTax > 0 && dataSet.options.autoTradeTax) {
          dataSet.options.tradeTax = frmData?.tradeTax;
          refreshOptions = true;
          //console.log("reset Tax");
        }
        if (dataSet?.options?.autoCoinRatio) {
          dataSet.options.coinsRatio = responseData?.bestCoinRatio?.ratio || dataSet.options.coinsRatio;
          refreshOptions = true;
        }
        if (respData?.gemsRatio > 0) {
          dataSet.options.gemsRatio = frmData.gemsRatio;
          refreshOptions = true;
          //console.log("update gemsRatio");
        }
        if (refreshOptions) {
          const newOptions = { ...dataSet.options };
          dataSet.options = newOptions;
          setOptions(newOptions);
        }
        const withdrawreduc = (expandData?.type === "desert" || expandData?.type === "spring" || expandData?.type === "volcano") ? 2.5 : 0;
        const withdrawtax = (balance < 10 ? 30 : balance < 100 ? 25 : balance < 1000 ? 20 : balance < 5000 ? 15 : 10) - withdrawreduc;
        dataSet.withdrawtax = withdrawtax;
        const withdrawSFLbeyondTaxFree = Number(taxFreeSFL) - Number(balance);
        const withdrawsflFree = (withdrawSFLbeyondTaxFree < 0) ? Number(taxFreeSFL) : Number(balance);
        const withdrawsflNotFree = (withdrawsflFree >= Number(balance)) ? 0 : (Number(balance) - withdrawsflFree);
        const withdrawSflNotFreeTaxed = (withdrawsflNotFree > 0) ? (withdrawsflNotFree - (withdrawsflNotFree * (withdrawtax / 100))) : 0;
        const sflwithdraw = frmtNb(withdrawsflFree + withdrawSflNotFreeTaxed);
        dataSet.sflwithdraw = sflwithdraw;
        const xfishcastmax = fishingDetails && (!TryChecked ? fishingDetails.CastMax : fishingDetails.CastMaxtry);
        const xfishcost = fishingDetails && ((!TryChecked ? fishingDetails.CastCost : fishingDetails.CastCosttry) / dataSet.options.coinsRatio);
        dataSet.fishcasts = fishingDetails && (fishingDetails.casts + "/" + xfishcastmax);
        dataSet.fishcosts = fishingDetails && (parseFloat(fishingDetails.casts * xfishcost).toFixed(3) + "/" + parseFloat(xfishcastmax * xfishcost).toFixed(3));
        setdataSetFarm({ ...respData });
        setdeliveriesData(respData.orderstable);
        setfTrades();
      }
      const priceData = responseData.priceData;
      const balanceUSD = frmtNb(Number(dataSet?.balance || 0) * Number(priceData[2]));
      dataSet.balanceUSD = balanceUSD;
      const usdwithdraw = frmtNb(Number(dataSet?.sflwithdraw || 0) * Number(priceData[2]));
      dataSet.usdwithdraw = usdwithdraw;
      dataSet.options.usdSfl = responseData.priceData[2];
      //NFTPrice();
      //xinitprc = true;
      setReqState('');
      if (respData.mutantchickens) {
        setMutants(respData);
        //setsTickets(respData.sTickets);
      }
    } else {
      console.log(`Error : ${response.status}`);
      setReqState('Error refreshing prices');
      dataSet.updated = formatUpdated(farmData?.updated);
      const newdataSetFarm = { ...dataSetFarm };
      setdataSetFarm(newdataSetFarm);
      //localStorage.clear();
      //console.log("Cleared local data");
    }
  }
  function setMutants(dataSetMutant) {
    const tableMutant = dataSetMutant.mutantchickens;
    const MutItems = tableMutant.map(([item, amount], index) => {
      const itemName = tableMutant[index][0].name;
      //const cobj = nft[itemName];
      let itemImg = imgna;
      if (dataSetMutant?.nft?.[itemName]) { itemImg = dataSetMutant?.nft?.[itemName]?.img; }
      if (dataSetMutant?.mutant?.[itemName]) { itemImg = dataSetMutant?.mutant?.[itemName]?.img; }
      return (
        <img src={itemImg} alt={''} className="nftico" title={tableMutant[index][0].name} />
      )
    });
    const txtMutants = tableMutant.length > 0 && <><span style={{ fontSize: "11px" }}>Mutant found : {MutItems}</span></>;
    setmutData(txtMutants);
  }
  function setsTickets(tabletk) {
    /* if (tabletk.length > 1) {
      //setticketsData(<div><img src={dataSet.imgtkt} alt={''} className="itico" />{tabletk[1].amount}</div>);
    } else {
      //setticketsData("");
    } */
  }

  useEffect(() => {
    if (!pendingSaveRef.current) return;
    pendingSaveRef.current = false;
    setCookie();
  }, [dataSetFarm, options]);
  useEffect(() => {
    if (isNativeApp) {
      StatusBar.setOverlaysWebView({ overlay: false });
    }
    loadCookie();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          //console.log('Service Worker enregistré avec succès:', registration);
        })
        .catch(error => {
          console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
        });
    }
    //setXListeCol();
  }, []);
  const intervalRef = useRef(null);
  useEffect(() => {
    let startTime = Date.now();
    let duration = 60 * 1000;
    let timeoutId = null;
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setSearchProgress(progress);
      if (progress >= 100) {
        startTime = Date.now();
        setSearchProgress(0);
      }
    };
    const fetchData = async () => {
      try {
        await getPrices();
      } catch (error) {
        console.log(`Error: ${error}`);
        //setReqState(`Error`);
        dataSet.updated = formatUpdated(farmData?.updated);
        const newdataSetFarm = { ...dataSetFarm };
        setdataSetFarm(newdataSetFarm);
      }
    };
    const clearAll = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      setSearchProgress(0);
    };
    const startMainInterval = () => {
      clearAll();
      startTime = Date.now();
      duration = 60 * 1000;
      setSearchProgress(0);
      progressTimerRef.current = setInterval(updateProgress, 5000);
      intervalRef.current = setInterval(() => {
        fetchData();
        startTime = Date.now();
        setSearchProgress(0);
      }, duration);
    };
    const startInitialTimeout = () => {
      clearAll();
      startTime = Date.now();
      duration = 20 * 1000;
      setSearchProgress(0);
      progressTimerRef.current = setInterval(updateProgress, 1000);
      timeoutId = setTimeout(() => {
        fetchData();
        startMainInterval();
        initialIntervalDone = true;
      }, 20 * 1000);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (!buttonClicked) return;
        if (!dataSet.options?.isAbo) {
          startInitialTimeout();
        } else {
          startMainInterval();
        }
      } else {
        clearAll();
      }
    };
    clearAll();
    if (buttonClicked) {
      if (!dataSet.options?.isAbo && !initialIntervalDone) {
        startInitialTimeout();
      } else {
        startMainInterval();
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      clearAll();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dataSetFarm]);
  useEffect(() => {
    getFromToExpand(Number(fromexpand) + 1, Number(toexpand), selectedExpandType);
  }, [fromexpand, toexpand, selectedExpandType]);
  useEffect(() => {
    if (dataSet.options.useNotifications === true) {
      if (inputValue) { subscribeToPush(); }
    } else if (dataSet.options.useNotifications === 0) {
      if (inputValue) { unsubscribeFromPush(); }
    }
    // eslint-disable-next-line
  }, [useNotif]);
  useEffect(() => {
    if (!dataSetFarm?.itables?.it) return;
    const it = dataSetFarm.itables.it;
    const nextHrvst = {};
    const nextHrvstTry = {};
    for (const item in it) {
      const dc = it[item]?.dailycycle ?? 0;
      const dcTry = it[item]?.dailycycletry ?? dc;
      if (dc > 0) nextHrvst[item] = dc;
      if (dcTry > 0) nextHrvstTry[item] = dcTry;
    }
    setUI((prev) => ({
      ...prev,
      xHrvst: { ...nextHrvst, ...(prev.xHrvst ?? {}) },
      xHrvsttry: { ...nextHrvstTry, ...(prev.xHrvsttry ?? {}) },
    }));
  }, [dataSetFarm]);

  return (
    <>
      <div className="App">
        <div className="top-frame">
          <h1 className="App-h1">
            <div className="vertical">
              <div onClick={(e) => handleTooltip("", "username", "", e)}>
                {dataSet?.options?.username && dataSet?.options?.username !== "" ? dataSet.options.username + (bumpkinData[0]?.lvl > 0 ? (" lvl" + bumpkinData[0]?.lvl) : "") :
                  <span>Farm ID or name</span>}</div>
              <div class="horizontal">
                <input
                  type="text"
                  name="inputValue"
                  //value={inputValue}
                  // onChange={handleInputChange}
                  value={ui?.inputValue ?? ""}
                  onChange={handleUIChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleButtonClick("EnterPressed");
                    }
                  }}
                  style={{ width: '65px' }}
                />
                <div style={{ position: "relative", left: -4, top: -2 }}>
                  <button
                    name="getFarm"
                    onClick={(e) => {
                      const el = e.currentTarget;
                      if (el.disabled) return;
                      handleButtonClick();
                      el.disabled = true;
                      el.classList.add("is-wait");
                      setTimeout(() => {
                        el.disabled = false;
                        el.classList.remove("is-wait");
                        el.dataset.locked = "";
                      }, 2000);
                    }}
                    //onClick={handleButtonClick}
                    className="button"
                    onPointerDown={(e) => {
                      const el = e.currentTarget;
                      if (el.dataset.locked === "1") {
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                      }
                      el.dataset.locked = "1";
                    }}
                    style={{ left: 1, top: 3, zIndex: 2 }}
                    disabled={cdButton}
                  >
                    <img src="./icon/ui/search.png" alt="" className="resico" />
                  </button>
                  <svg
                    style={{ position: "absolute", left: -1, zIndex: 1, pointerEvents: "none" }}
                    width="34"
                    height="35"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      stroke="#4caf50"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 16}
                      strokeDashoffset={2 * Math.PI * 16 * (1 - searchProgress / 100)}
                      style={{ transition: "stroke-dashoffset 0.5s linear" }}
                    />
                  </svg>
                </div>
              </div>
              <div style={{
                pointerEvents: 'none',
                transform: 'translateY(-4px)',
                fontSize: '9px',
                color: 'gray',
              }}>{dataSet?.updated || ""}</div>
              {farmData.balance ? (
                <div className="vertical" style={{ transform: 'translate(105px, 0%)' }}>
                  <div className="horizontal">
                    <button onClick={handleButtonfTNFTClick} title="NFT" class="button">
                      <img src="./icon/ui/lightning.png" alt="" className="itico" />
                    </button>
                    <FormControlLabel
                      control={
                        <Switch
                          name="TryChecked"
                          checked={!!ui.TryChecked}
                          onChange={handleUIChange}
                          color="primary"
                          size="small"
                          sx={{
                            '& .MuiSwitch-track': {
                              backgroundColor: 'gray',
                            },
                            transform: 'translate(10%, 0%)',
                          }}
                        />
                      }
                      label={TryChecked ? 'Tryset' : 'Activeset'}
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontSize: '10px',
                        },
                      }}
                    />
                  </div>
                  <button onClick={handleButtonfDlvrClick} title="Deliveries" class="button"><img src="./icon/ui/chores.webp" alt="" className="itico" /></button>
                </div>
              ) : ""}
            </div>
            <div class="h1-container"><img src={logo} alt="" className="App-logo" />Sunflower Manager</div>
            {farmData.balance ? (
              <div className="currencies">
                <div className="currency-controls">
                  {/* {selectedInv === "inv" ? <div className="selectcol" size="small"><DropdownCheckbox options={xListeCol} onChange={handleDropdownCookChange} /></div> : ""}
                  {selectedInv === "cook" ? <div className="selectcol" size="small"><DropdownCheckbox options={xListeColCook} onChange={handleDropdownCookChange} /></div> : ""}
                  {selectedInv === "fish" ? <div className="selectcol" size="small"><DropdownCheckbox options={xListeColFish} onChange={handleDropdownFishChange} /></div> : ""}
                  {selectedInv === "flower" ? <div className="selectcol" size="small"><DropdownCheckbox options={xListeColFlower} onChange={handleDropdownFlowerChange} /></div> : ""}
                  {selectedInv === "bounty" ? <div className="selectcol" size="small"><DropdownCheckbox options={xListeColBounty} onChange={handleDropdownBountyChange} /></div> : ""}
                  {selectedInv === "animal" ? <div className="selectcol" size="small"><DropdownCheckbox options={xListeColAnimals} onChange={handleDropdownAnimalsChange} /></div> : ""}
                  {selectedInv === "map" ? <div className="selectcol" size="small"><DropdownCheckbox options={xListeColAnimals} onChange={handleDropdownAnimalsChange} /></div> : ""}
                  {selectedInv === "expand" ? <div className="selectcol" size="small"><DropdownCheckbox options={xListeColExpand} onChange={handleDropdownExpandChange} /></div> : ""}
                  {selectedInv === "activity" && activityDisplay === "day" ? <div className="selectcol" size="small"><DropdownCheckbox options={xListeColActivity} onChange={handleDropdownActivityChange} /></div> : ""}
                  {selectedInv === "activity" && activityDisplay === "item" ? <div className="selectcol" size="small"><DropdownCheckbox options={xListeColActivityItem} onChange={handleDropdownActivityItemChange} /></div> : ""}
                  {selectedInv === "activity" && activityDisplay === "quest" ? <div className="selectcol" size="small"><DropdownCheckbox options={xListeColActivityQuest} onChange={handleDropdownActivityQuestChange} /></div> : ""}
                   */}
                  <div className="selectcurrback">
                    <FormControl id="formselectcurr" className="selectcurr" size="small">
                      <InputLabel>Currency</InputLabel>
                      <Select name={"selectedCurr"} value={ui.selectedCurr} onChange={handleUIChange}>
                        <MenuItem value="SFL">
                          <img src={imgsfl} alt="SFL" className="nodico" />
                        </MenuItem>
                        <MenuItem value="MATIC">
                          <img src="./matic.png" alt="MATIC" className="curr-icon" />
                        </MenuItem>
                        <MenuItem value="USDC">
                          <img src="./usdc.png" alt="USDC" className="curr-icon" />
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="horizontal" style={{ margin: "0", padding: "0" }}>
                    <button onClick={handleButtonOptionsClick} title="Options" class="button"><img src="./options.png" alt="" className="itico" /></button>
                    <button onClick={handleButtonHelpClick} title="Help" class="button"><img src="./icon/nft/na.png" alt="" className="itico" /></button>
                  </div>
                </div>
                <div className="currency-pair">
                  <div className="currency"><img src={imgsfl} alt="" className="nodico" />{parseFloat(priceData[2]).toFixed(3)}</div>
                  <div className="currency"><img src="./matic.png" alt="" className="curr-icon" />{parseFloat(priceData[1]).toFixed(3)}</div>
                </div>
              </div>
            ) : ("")}
          </h1>
          <div style={{ transform: 'translate(0px, -20px)', margin: "0", padding: "0" }}>
            <div class="horizontal" style={{ margin: "0", padding: "0" }}>
              {farmData.balance ? (<>
                <div class="horizontal" onClick={(e) => handleTooltip("", "balance", "", e)} style={{ margin: "0", padding: "0" }}>
                  {imgSFL}{frmtNb(dataSet.balance)} {imgCoins}{parseFloat(dataSet.coins).toFixed(0)}{dataSet.isBanned ? dataSet.isBanned : null}
                </div>
                <span>{mutData ? mutData : null}</span>
              </>) : null}
              <p className="reqstat">{reqState}</p>
            </div>
            {farmData.balance ? (<>
              <div className="tabletrades" onClick={(e) => handleTooltip("", "trades", "", e)} style={{ margin: "0", padding: "0" }}>
                {<>{ftradesData ? ftradesData : ""}</>}
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'left', height: '20px', width: '180px', top: '1px', overflow: 'hidden', margin: "0", padding: "0" }}>
                <div className="selectinvback" style={{ display: 'flex', alignItems: 'left', height: '20px', width: '110px', overflow: 'hidden', margin: "0", padding: "0" }}>
                  <FormControl variant="standard" id="formselectinv" className="selectinv" size="small" style={{ width: '100px', margin: "0", padding: "0" }}>
                    <InputLabel></InputLabel>
                    <Select name="selectedInv" value={ui.selectedInv} onChange={handleUIChange}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            '& .MuiMenuItem-root': {
                              color: 'black',
                            },
                          },
                        },
                      }}>
                      <MenuItem value="home"><img src="./icon/ui/playercount.png" alt="" className="itico" />Home</MenuItem>
                      <MenuItem value="inv"><img src="./icon/tools/shovel.png" alt="" className="itico" />Farm</MenuItem>
                      <MenuItem value="cook"><img src="./icon/food/chef_hat.png" alt="" className="itico" />Cook</MenuItem>
                      <MenuItem value="fish"><img src="./icon/fish/anchovy.png" alt="" className="itico" />Fish</MenuItem>
                      <MenuItem value="flower"><img src="./icon/flower/red_pansy.webp" alt="" className="itico" />Flower</MenuItem>
                      <MenuItem value="bounty"><img src="./icon/tools/sand_shovel.png" alt="" className="itico" />Dig</MenuItem>
                      <MenuItem value="animal"><img src={imgchkn} alt="" className="itico" />Animals</MenuItem>
                      <MenuItem value="pet"><img src="./icon/ui/petegg.png" alt="" className="itico" />Pets</MenuItem>
                      <MenuItem value="craft"><img src="./icon/craft/bee_box.webp" alt="" className="itico" />Craft</MenuItem>
                      <MenuItem value="cropmachine"><img src="./icon/skillr/efficiency_ext_module.png" alt="" className="itico" />Crop Machine</MenuItem>
                      <MenuItem value="map"><img src="./icon/ui/world.png" alt="" className="itico" />Map</MenuItem>
                      <MenuItem value="expand"><img src="./icon/tools/hammer.png" alt="" className="itico" />Expand</MenuItem>
                      <MenuItem value="market"><img src={imgexchng} alt="" className="itico" />Market</MenuItem>
                      {dataSet.options.isAbo ? <MenuItem value="activity"><img src="./icon/ui/stopwatch.png" alt="" className="itico" />Activity</MenuItem> : null}
                    </Select>
                  </FormControl>
                </div>
                {selectedInv === "activity" ? (
                  <div className="selectinvback" style={{ display: 'flex', alignItems: 'left', height: '20px', width: '75px', margin: "0", padding: "0" }}>
                    <FormControl variant="standard" id="formselectinv" className="selectinv" size="small">
                      <InputLabel></InputLabel>
                      <Select name="activityDisplay" value={ui.activityDisplay} onChange={handleUIChange}>
                        <MenuItem value="day">/Day</MenuItem>
                        <MenuItem value="item">/Item</MenuItem>
                        <MenuItem value="quest">/Quest</MenuItem>
                      </Select>
                    </FormControl>
                  </div>) : null}
                {selectedInv === "pet" ? (
                  <div className="selectpetback" style={{ display: 'flex', alignItems: 'left', height: '20px', margin: "0", padding: "0" }}>
                    <FormControl variant="standard" id="formselectinv" className="selectinv" size="small" sx={{ width: 125 }}>
                      <InputLabel></InputLabel>
                      <Select name="petView" value={ui.petView} onChange={handleUIChange}>
                        <MenuItem value="pets"><img src={imgpet} alt="" className="itico" />Pets</MenuItem>
                        <MenuItem value="shrines"><img src={imgshrine} alt="" className="itico" />Shrines</MenuItem>
                        <MenuItem value="components"><img src={imgacorn} alt="" className="itico" />Fetch</MenuItem>
                      </Select>
                    </FormControl>
                  </div>) : null}
              </div>
            </>) : null}
          </div>
        </div>
        <div className="table-container">
          {buttonClicked ?
            <AppCtx.Provider value={ctx}>
              <PanelTable />
            </AppCtx.Provider> : null}
        </div>
        {showOptions && (
          <ModalOptions onClose={() => {
            handleCloseOptions();
            const hasChanged = JSON.stringify(initialDataSet) !== JSON.stringify(dataSet);
            if (hasChanged) {
              handleButtonClick("optionChanged");
            }
          }}
            dataSet={dataSet.options}
            onOptionChange={handleOptionChange}
            API_URL={API_URL}
          />
        )}
        {showfGraph && (
          <ModalGraph onClose={handleClosefGraph}
            graphtype={GraphType}
            frmid={dataSet.options.farmid}
            username={dataSet.options.username}
            dataSetFarm={dataSetFarm}
            API_URL={API_URL} />
        )}
        {showfTNFT && (
          <AppCtx.Provider value={ctx}>
            <ModalTNFT onClose={handleClosefTNFT}
            />
          </AppCtx.Provider>
        )}
        {showfDlvr && (
          <AppCtx.Provider value={ctx}>
            <ModalDlvr
              onClose={() => { handleClosefDlvr() }}
              tableData={deliveriesData}
              imgtkt={dataSet.imgtkt}
              coinsRatio={dataSet.options.coinsRatio}
            />
          </AppCtx.Provider>
        )}
        {showCadre && (
          <Cadre onClose={handleCloseCadre} tableData={listingsData} Platform={platformListings} frmid={curID} />
        )}
        {showHelp && (
          <Help onClose={handleCloseHelp} image={helpImage} />
        )}
        {tooltipData && (
          <Tooltip
            onClose={() => setTooltipData(null)}
            clickPosition={tooltipData}
            item={tooltipData.item}
            context={tooltipData.context}
            value={tooltipData.value}
            dataSet={dataSet}
            dataSetFarm={dataSetFarm}
            bdrag={tooltipData.bdrag}
            forTry={TryChecked}
          />
        )}
      </div >
    </>
  );
  function setCookie() {
    try {
      const bvversion = vversion;
      let xdataSetFarm = JSON.parse(JSON.stringify(dataSetFarm));
      //delete xdataSetFarm?.frmData;
      //delete xdataSetFarm?.initialIntervalDone;
      var dataToStore = {
        //ui: ui,
        dataSetFarm: xdataSetFarm,
        dataSet: dataSet,
        vversion: bvversion,
        lastID: lastID,
        /* inputValue: inputValue,
        isOpen: isOpen,
        TryChecked: TryChecked,
        cstPrices: cstPrices,
        customSeedCM: customSeedCM,
        customQuantFetch: customQuantFetch,
        toCM: toCM,
        inputFromLvl: inputFromLvl,
        inputToLvl: inputToLvl,
        selectedInv: selectedInv,
        selectedCurr: selectedCurr,
        selectedDsfl: selectedDsfl,
        selectedQuantity: selectedQuantity,
        selectedQuant: selectedQuant,
        selectedQuantityCook: selectedQuantityCook,
        selectedQuantCook: selectedQuantCook,
        selectedQuantFish: selectedQuantFish,
        xListeCol: xListeCol,
        xListeColCook: xListeColCook,
        xListeColFish: xListeColFish,
        xListeColExpand: xListeColExpand,
        xListeColActivity: xListeColActivity,
        xListeColActivityItem: xListeColActivityItem,
        TryChecked: false, //TryChecked,
        CostChecked: CostChecked,
        bFarmit: bFarmitArray,
        bCookit: bCookitArray,
        bTrynft: bTrynftArray,
        bTrynftw: bTrynftwArray,
        bTrybuild: bTrybuildArray,
        bTryskill: bTryskillArray,
        bTryskilllgc: bTryskilllgcArray,
        bTrybud: bTrybudArray,
        fruitPlanted: fruitPlantedArray, */
      };
      var dataToStoreString = JSON.stringify(dataToStore);
      //document.cookie = "sflman=" + dataToStoreString + ";expires=31 Dec 2024 23:59:59 UTC;";
      localStorage.setItem("SFLManData", dataToStoreString);
      //console.log("setC: " + dataToStoreString);
    }
    catch {
      localStorage.removeItem("SFLManData");
      //localStorage.clear();
      console.log("Error, cleared local data");
    }
  }
  function loadCookie() {
    try {
      //var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)sflman\s*=\s*([^;]*).*$)|^.*$/, "$1");
      const cookieValue = localStorage.getItem("SFLManData");
      if (!cookieValue) {
        dataSet.options.firstLoad = true;
      }
      if (cookieValue) {
        var loadedData = JSON.parse(cookieValue);
        //console.log("loadC: " + loadedData);
        let validCookie = true;
        //if (!loadedData.dataSetFarm?.itables) { validCookie = false; }
        if ((loadedData.vversion !== vversion) || !validCookie) {
          DefaultOptions();
          localStorage.removeItem("SFLManData");
          console.log("Cleared local data to fit newer version");
          return;
        }
        vversion = loadedData.vversion;
        setdataSetFarm(loadedData.dataSetFarm);
        dataSet = loadedData.dataSet;
        dataSet.updated = 0;
        lastID = loadedData.lastID || 0;
        DefaultOptions();
        try {
          const storedUI = JSON.parse(localStorage.getItem("ui"));
          setUI({ ...uiDefaults, ...(storedUI || {}) });
        } catch {
          setUI(uiDefaults);
        }
        //setUI(loadedData.ui);
        //setInputValue(loadedData.inputValue);
        //dataSet.options = loadedData.xoptions;
        /* setInputKeep(dataSet.options.inputKeep);
        lastClickedInputKeep.current = dataSet.options.inputKeep;
        setInputMaxBB(dataSet.options.inputMaxBB);
        //vinputMaxBB = loadedData.inputMaxBB;
        //dataSet.inputMaxBB = loadedData.inputMaxBB;
        setInputFarmTime(dataSet.options.inputFarmTime);
        setIsOpen(loadedData.isOpen || []);
        setTryChecked(loadedData.TryChecked || false);
        setCstPrices(loadedData.cstPrices);
        setcustomSeedCM(loadedData.customSeedCM);
        setcustomQuantFetch(loadedData.customQuantFetch);
        settoCM(loadedData.toCM); */
        //bBuyit = loadedData.bBuyit.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {});
        //bSpottry = loadedData.bSpottry.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {});
        //vinputFarmTime = loadedData.inputFarmTime;
        //dataSet.inputFarmTime = loadedData.inputFarmTime;
        //setInputAnimalLvl(dataSet.options.inputAnimalLvl);
        //vinputAnimalLvl = loadedData.inputAnimalLvl;
        //dataSet.inputAnimalLvl = loadedData.inputAnimalLvl;
        //coinsRatio = loadedData.coinsRatio || 320;
        //dataSet.options.coinsRatio = loadedData.coinsRatio || 320;
        /* setInputFromLvl(loadedData.inputFromLvl);
        setInputToLvl(loadedData.inputToLvl);
        //setSelectedInv(loadedData.selectedInv);
        setSelectedInv("home");
        setSelectedCurr(loadedData.selectedCurr);
        setSelectedDsfl(loadedData.selectedDsfl);
        setSelectedQuantity(loadedData.selectedQuantity);
        setSelectedQuant(loadedData.selectedQuant);
        setSelectedQuantityCook(loadedData.selectedQuantityCook);
        setSelectedQuantCook(loadedData.selectedQuantCook);
        setSelectedQuantFish(loadedData.selectedQuantFish);
        loadedData.xListeCol[16][1] = 1;
        loadedData.xListeCol[7][1] = 0;
        loadedData.xListeCol[8][1] = 0;
        loadedData.xListeCol[9][1] = 0;
        setXListeCol(loadedData.xListeCol);
        setXListeColCook(loadedData.xListeColCook && loadedData.xListeColCook);
        setXListeColFish(loadedData.xListeColFish && loadedData.xListeColFish);
        setXListeColExpand(loadedData.xListeColExpand && loadedData.xListeColExpand);
        setXListeColActivity(loadedData.xListeColActivity && loadedData.xListeColActivity);
        setXListeColActivityItem(loadedData.xListeColActivityItem && loadedData.xListeColActivityItem);
        */
      } else {
        DefaultOptions();
      }
    }
    catch (error) {
      localStorage.removeItem("SFLManData");
      //localStorage.clear();
      console.log("Load Error, cleared local data");
      console.log(error);
    }
    function DefaultOptions() {
      if (!dataSet.options?.inputFarmTime) { dataSet.options.inputFarmTime = 15 }
      if (!dataSet.options?.inputMaxBB) { dataSet.options.inputMaxBB = 1 }
      if (!dataSet.options?.inputKeep) { dataSet.options.inputKeep = 3 }
      //if (!dataSet.options?.tradeTax) { dataSet.options.tradeTax = 10 }
      if (dataSet.options?.autoTradeTax === undefined) { dataSet.options.autoTradeTax = 1 }
      if (!dataSet.options?.gemsRatio) { dataSet.options.gemsRatio = 0.07 }
      if (!dataSet.options?.gemsPack) { dataSet.options.gemsPack = 7400 }
      if (!dataSet.options?.coinsRatio) { dataSet.options.coinsRatio = 1000 }
      if (!dataSet.options?.inputMaxBB) { dataSet.options.inputMaxBB = 1 }
      if (!dataSet.options?.animalLvl) { dataSet.options.animalLvl = {} }
      if (!dataSet.options?.animalLvl?.Chicken) { dataSet.options.animalLvl.Chicken = 7 }
      if (!dataSet.options?.animalLvl?.Cow) { dataSet.options.animalLvl.Cow = 7 }
      if (!dataSet.options?.animalLvl?.Sheep) { dataSet.options.animalLvl.Sheep = 7 }
      if (!dataSet.options?.usePriceFood) { dataSet.options.usePriceFood = 1 }
      if (!dataSet.options?.oilFood) { dataSet.options.oilFood = 0 }
      setOptions(dataSet.options);
    }
  }
  async function getxpFromToLvl(xfrom, xto, xdxp) {
    const responseLVL = await fetch(API_URL + "/getfromtolvl", {
      method: 'GET',
      headers: {
        frmid: dataSet.farmId,
        from: xfrom,
        to: xto,
        xdxp: xdxp,
      }
    });
    if (responseLVL.ok) {
      const responseDataLVL = await responseLVL.json();
      //console.log(responseData);
      //setpriceData(JSON.parse(JSON.stringify(responseData.priceData)));
      setUIField("fromtolvltime", responseDataLVL.time);
      //setfromtolvltime(responseDataLVL.time);
      setUIField("fromtolvlxp", responseDataLVL.xp);
      //setfromtolvlxp(responseDataLVL.xp);
    } else {
      console.log(`Error : ${responseLVL.status}`);
    }
  }
  async function getFromToExpand(xfrom, xto, xtype) {
    const responseExpand = await fetch(API_URL + "/getfromtoexpand", {
      method: 'GET',
      headers: {
        frmid: dataSet.farmId,
        from: xfrom,
        to: xto,
        type: xtype,
        spot: dataSetFarm.spot || 0
      }
    });
    if (responseExpand.ok) {
      const responseDataExp = await responseExpand.json();
      //console.log(responseData);
      //setpriceData(JSON.parse(JSON.stringify(responseData.priceData)));
      //setfromtoexpand(responseDataExp);
      //setUIField("fromtoexpand", responseDataExp);
      dataSet.fromtoexpand = responseDataExp;
    } else {
      console.log(`Error : ${responseExpand.status}`);
    }
  }
  function refreshDataSet(dataSetRefresh) {
    if (dataSetRefresh.itables.it) {
      if (!dataSet.options?.animalLvl) {
        dataSet.options.animalLvl = Object.fromEntries(
          Object.keys(dataSetRefresh.Animals).map(animal => [animal, 5])
        );
      }
      if (!dataSet.options?.notifList) {
        dataSet.options.notifList = Object.keys(dataSetRefresh.itables.it)
          .filter(key =>
            !(dataSetRefresh.itables.it[key]?.matcat === 2) &&
            !(key === "Wild Mushroom") &&
            !(key === "Magic Mushroom")
          )
          .map(key => [key, 1]);
        dataSet.options.notifList.push(['Bee Swarm', 1]);
      }
      if (dataSet.options.notifList.some(([key]) => key === 'Wild Mushroom')) {
        dataSet.options.notifList = dataSet.options.notifList.filter(([key]) => key !== 'Wild Mushroom');
      }
      if (dataSet.options.notifList.some(([key]) => key === 'Magic Mushroom')) {
        dataSet.options.notifList = dataSet.options.notifList.filter(([key]) => key !== 'Magic Mushroom');
      }
      if (!dataSet.options.notifList.some(([key]) => key === 'Market Sold')) {
        dataSet.options.notifList.push(['Market Sold', 1]);
      }
      if (!dataSet.options.notifList.some(([key]) => key === 'Animal needs love')) {
        dataSet.options.notifList.push(['Animal needs love', 1]);
      }
    }
  }
}

export default App;