import React, { useEffect, useState, useRef } from 'react';
import logo from './gobcarry.gif';
import './App.css';
import ModalTNFT from './ftrynft.js';
import ModalGraph from './fgraph.js';
import ModalDlvr from './fdelivery.js';
import ModalOptions from './foptions.js';
import Cadre from './animodal.js';
import Tooltip from "./tooltip.js";
import DropdownCheckbox from './listcol.js';
import { FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel } from '@mui/material';
import { frmtNb, ColorValue, Timer } from './fct.js';
import { setHome } from './setHome.js';
//import xrespFarm from './respFarm.json';
//import xrespPrice from './respPrice.json';
//import xrespBumpkin from './respBumpkin.json';

const runLocal = false;
const API_URL = runLocal ? "" : process.env.REACT_APP_API_URL;

var vversion = 1.02;
let dataSet = {};

var dateSeason = "";
var tktName = "";
var imgtkt = "";

const imgsfl = './icon/res/flowertoken.webp';
const imgcoins = './icon/res/coins.png';
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
const imgexchng = './icon/ui/exchange.png';
const imgna = './icon/nft/na.png';
const imgrod = './icon/tools/fishing_rod.png';

var it = [];
var tool = [];
var food = [];
var fish = [];
var flower = [];
var bounty = [];
var craft = [];
var compost = [];
//var fishing = [];
//var expand = [];
var xexpandData = [];
var nft = [];
var nftw = [];
var skilllgc = [];
var skill = [];
var buildng = [];
var buildngf = [];
var bud = [];
var spot = {};
var mutantchickens = [];
var sTickets = [];
var fishingDetails = "";
var ftrades = {};
var Animals = {};
var isleMap = {};
//var frmOwner = "";
var username = "";
var isAbo = false;
var isVip = false;
var isBanned = "";
var taxFreeSFL = 0;

var bFarmit = [];
var bCookit = [];
/* var bTrynft = [];
var bTrynftw = [];
var bTrybuild = [];
var bTryskill = [];
var bTryskilllgc = [];
var bTrybud = [];
var bnft = [];
var bnftw = [];
var bbuild = [];
var bskill = [];
var bbud = []; */
var fruitPlanted = [];
var dProd = [];
var dProdtry = [];
var xdxp = 0;

var xinitprc = false;
var xnotifiedTimers = [];
var xHrvst = [];
var xHrvsttry = [];
var HrvstMax = [];
var HrvstMaxtry = [];
var xBurning = [];
xBurning.burn = [];
xBurning.burntry = [];
var cstPricesb = [10000, 5000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 500, 100, 50, 50, 50, 1000, 100, 100, 100, 100, 100, 100, 100];
var platformListings = "Trades";
var coinsRatio = 320;

//var testb = false;

function App() {
  const [initialDataSet, setInitialDataSet] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [inputMaxBB, setInputMaxBB] = useState(1);
  const [inputFarmTime, setInputFarmTime] = useState(8);
  const [inputAnimalLvl, setInputAnimalLvl] = useState(5);
  const [inputCoinsRatio, setInputCoinsRatio] = useState(320);
  const [inputFromLvl, setInputFromLvl] = useState(1);
  const [inputToLvl, setInputToLvl] = useState(30);
  const [inputKeep, setInputKeep] = useState(3);
  const [fromtolvltime, setfromtolvltime] = useState(0);
  const [fromtolvlxp, setfromtolvlxp] = useState(0);
  const [dailyxp, setdailyxp] = useState(0);
  const [cstPrices, setCstPrices] = useState(cstPricesb);
  const [fromexpand, setfromexpand] = useState(1);
  const [toexpand, settoexpand] = useState(23);
  const [fromtoexpand, setfromtoexpand] = useState([]);
  const lastClickedInputValue = useRef('');
  const lastClickedInputKeep = useRef('');
  const [farmData, setFarmData] = useState([]);
  const [bumpkinData, setBumpkinData] = useState([]);
  const [reqState, setReqState] = useState("");
  const [homeData, sethomeData] = useState(null);
  const [isOpen, setIsOpen] = useState({});
  const [invData, setinvData] = useState(null);
  const [cookData, setcookData] = useState(null);
  const [fishData, setfishData] = useState(null);
  const [flowerData, setflowerData] = useState(null);
  const [bountyData, setbountyData] = useState(null);
  const [animalData, setanimalData] = useState(null);
  const [expandData, setexpandData] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [ftradesData, setftradesData] = useState(null);
  const [itData, setitData] = useState(it);
  const [priceData, setpriceData] = useState([]);
  const [tooltipData, setTooltipData] = useState(null);
  const [listingsData, setlistingsData] = useState([]);
  const [showfTNFT, setShowfTNFT] = useState(false);
  const [showfGraph, setShowfGraph] = useState(false);
  const [showfDlvr, setShowfDlvr] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showCadre, setShowCadre] = useState(false);
  const [selectedCurr, setSelectedCurr] = useState('SFL');
  const [selectedQuant, setSelectedQuant] = useState('unit');
  const [selectedQuantCook, setSelectedQuantCook] = useState('quant');
  const [selectedQuantFish, setSelectedQuantFish] = useState('quant');
  const [selectedCostCook, setselectedCostCook] = useState('trader');
  const [selectedQuantity, setSelectedQuantity] = useState('farm');
  const [selectedQuantityCook, setSelectedQuantityCook] = useState('farm');
  const [selectedReady, setSelectedReady] = useState('when');
  const [selectedDsfl, setSelectedDsfl] = useState('trader');
  const [selectedFromActivity, setSelectedFromActivity] = useState("today");
  const [selectedFromActivityDay, setSelectedFromActivityDay] = useState("7");
  const [selectedExpandType, setSelectedExpandType] = useState("spring");
  const [activityDisplay, setActivityDisplay] = useState("item");
  const [selectedInv, setSelectedInv] = useState('home');
  const [activeTimers, setActiveTimers] = useState([]);
  const [notifiedTimers, setNotifiedTimers] = useState([]);
  const [GraphType, setGraphType] = useState('');
  const [mutData, setmutData] = useState([]);
  const [ticketsData, setticketsData] = useState([]);
  const [deliveriesData, setdeliveriesData] = useState([]);
  const [HarvestD, setHarvestD] = useState(xHrvst);
  const [activityData, setActivityData] = useState({});
  const [activityTable, setActivityTable] = useState([]);
  const [xListeCol, setXListeCol] = useState([
    ['Hoard', 1],
    ['Item name', 0],
    ['Quantity', 1],
    ['Time', 1],
    ['Production cost', 1],
    ['Shop price', 1],
    ['Marketplace price', 1],
    ['Withdraw quantity', 1],
    ['Niftyswap price', 1],
    ['OpenSea price', 1],
    ['Yield', 1],
    ['Harvest average', 1],
    ['To harvest', 1],
    ['BlockBuck production', 0],
    ['Price difference with Marketplace', 1],
    ['Daily SFL', 1],
    ['Daily max production', 0],
    ['Coefficient Prod cost / Sell cost', 1],
    ['Wen ready', 1],
  ]);
  const [xListeColCook, setXListeColCook] = useState([
    ['Building', 1],
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
    ['Components', 1],
  ]);
  const [xListeColFish, setXListeColFish] = useState([
    ['Category', 1],
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
    ['XP/SFL', 1],
  ]);
  const [xListeColFlower, setXListeColFlower] = useState([
    ['Seed', 1],
    ['Flower name', 1],
    ['Breeding', 1],
    ['Quantity in bag', 1],
    ['Found', 1],
  ]);
  const [xListeColBounty, setXListeColBounty] = useState([
    ['Item name', 1],
    ['Stock', 1],
    ['Value', 1],
    ['Today', 1],
    ['Value', 1],
    ['ToolCost', 1],
  ]);
  const [xListeColAnimals, setXListeColAnimals] = useState([
    ['Item name', 1],
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
    ['2 love', 1],
  ]);
  const [xListeColExpand, setXListeColExpand] = useState([
    ['From / To', 1],
    ['LVL requirement', 1],
    ['Ressources requirement', 1],
    ['Nodes', 1],
    ['Cost', 1],
  ]);
  const [xListeColActivity, setXListeColActivity] = useState([
    ['From', 1],
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
    ['Ressources burned', 1],
  ]);
  const [xListeColActivityItem, setXListeColActivityItem] = useState([
    ['Item Name', 1],
    ['Harvested', 1],
    ['Quantity', 1],
    ['Burned', 1],
    ['Production Cost', 1],
    ['Balloon Price', 1],
    ['Niftyswap Price', 1],
    ['OpenSea Price', 1],
    ['Traded', 1],
    ['Devliveries Burn', 1],
    ['Food produced', 1],
  ]);
  const [xListeColActivityQuest, setXListeColActivityQuest] = useState([
    ['From', 1],
    ['Description', 1],
    ['Reward', 1],
    ['Date', 1],
  ]);
  const [CostChecked, setCostChecked] = useState(true);
  const [TryChecked, setTryChecked] = useState(false);
  const [BurnChecked, setBurnChecked] = useState(true);

  const handleHomeClic = (index) => {
    setIsOpen((prevState) => ({
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
    setInitialDataSet({ ...dataSet });
    setShowOptions(true);
  };
  const handleClosefTNFT = (xdataSet) => {
    dataSet = xdataSet;
    it = dataSet.it;
    food = dataSet.food;
    fish = dataSet.fish;
    nft = dataSet.nft;
    nftw = dataSet.nftw;
    buildng = dataSet.buildng;
    skill = dataSet.skill;
    skilllgc = dataSet.skilllgc;
    bud = dataSet.bud;
    fishingDetails = dataSet.fishingDetails;
    //setTryit(nft, nftw, skill, buildng, bud);
    //getFarmit(it);
    //setPlanted(ittry);
    //getCookit(it);
    /* MergeIt(it, ittry);
    MergeFood(food, foodtry);
    MergeFish(fish, fishtry);
    MergeBounty(bounty, bountytry);
    MergeFishing(fishingDetails, xfishingDetails); */
    //getActive(nft, nftw, skill, buildng, bud);
    //getTryit(nft, nftw, skill, buildng, bud);
    //setInv();
    setitData(it);
    //refreshDataSet();
    //setCookie();
    setShowfTNFT(false);
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
  };
  const handleCloseCadre = () => {
    setShowCadre(false);
  };
  const handleChangeQuant = (event) => {
    const selectedValue = event.target.value;
    setSelectedQuant(selectedValue);
  }
  const handleChangeQuantCook = (event) => {
    const selectedValue = event.target.value;
    setSelectedQuantCook(selectedValue);
  }
  const handleChangeQuantFish = (event) => {
    const selectedValue = event.target.value;
    setSelectedQuantFish(selectedValue);
  }
  const handleChangeFromActivity = (event) => {
    const selectedValue = event.target.value;
    setSelectedFromActivity(selectedValue);
  }
  const handleChangeFromActivityDay = (event) => {
    const selectedValue = event.target.value;
    setSelectedFromActivityDay(selectedValue);
  }
  const handleChangeActivityDisplay = (event) => {
    const selectedValue = event.target.value;
    setActivityDisplay(selectedValue);
  }
  const handleChangeExpandType = (event) => {
    const selectedValue = event.target.value;
    setSelectedExpandType(selectedValue);
  }
  const handleChangeQuantity = (event) => {
    const selectedValue = event.target.value;
    setSelectedQuantity(selectedValue);
  }
  const handleChangeQuantityCook = (event) => {
    const selectedValue = event.target.value;
    setSelectedQuantityCook(selectedValue);
    //if (inputFromLvl > 0 && inputToLvl < 66) { getxpFromToLvl(inputFromLvl, inputToLvl, xdxp) }
  }
  const handleChangeCostCook = (event) => {
    const selectedValue = event.target.value;
    setselectedCostCook(selectedValue);
  }
  const handleChangeInv = (event) => {
    const selectedValue = event.target.value;
    setSelectedInv(selectedValue);
  }
  const handleChangeReady = (event) => {
    const selectedValue = event.target.value;
    activeTimers.forEach(timerId => {
      clearInterval(timerId);
    });
    activeTimers.length = 0;
    setSelectedReady(selectedValue);
  }
  const handleChangeDsfl = (event) => {
    const selectedValue = event.target.value;
    setSelectedDsfl(selectedValue);
  }
  const handleTimerFinish = (index) => {
    setActiveTimers((prevTimers) => prevTimers.filter((_, i) => i !== index));
    if (Notification.permission === 'granted') {
      console.log(`Timer finish for index ${index}`);
      if (!notifiedTimers.includes(index) && !xnotifiedTimers.includes(index)) {
        createNotification(index);
      }
    }
  };
  function createNotification(index) {
    /*     if (xinit = true) {
          const notification = new Notification('Sunflower Manager', {
            body: index + ' ready.',
          });
          xnotifiedTimers.push(index);
          setNotifiedTimers((prevTimers) => [...prevTimers, index]);
          console.log(`Creating notification for index ${index}`);
        } */
  }
  /* const startTimer = (timestamp) => {
    setActiveTimers((prevTimers) => [...prevTimers, timestamp]);
  }; */
  const handleChangeCurr = (event) => {
    const selectedValue = event.target.value;
    setSelectedCurr(selectedValue);
  }
  const handleDropdownChange = (updatedOptions) => {
    setXListeCol(updatedOptions);
  };
  const handleDropdownCookChange = (updatedOptions) => {
    setXListeColCook(updatedOptions);
  };
  const handleDropdownFishChange = (updatedOptions) => {
    setXListeColFish(updatedOptions);
  };
  const handleDropdownFlowerChange = (updatedOptions) => {
    setXListeColFlower(updatedOptions);
  };
  const handleDropdownBountyChange = (updatedOptions) => {
    setXListeColBounty(updatedOptions);
  };
  const handleDropdownAnimalsChange = (updatedOptions) => {
    setXListeColAnimals(updatedOptions);
  };
  const handleDropdownExpandChange = (updatedOptions) => {
    setXListeColExpand(updatedOptions);
  };
  const handleDropdownActivityChange = (updatedOptions) => {
    setXListeColActivity(updatedOptions);
  };
  const handleDropdownActivityItemChange = (updatedOptions) => {
    setXListeColActivityItem(updatedOptions);
  };
  const handleDropdownActivityQuestChange = (updatedOptions) => {
    setXListeColActivityQuest(updatedOptions);
  };
  const handleInputChange = (event) => {
    //const value = event.target.value.replace(/\D/g, '');
    const value = event.target.value;
    setInputValue(value);
    lastClickedInputValue.current = value
  };
  const handleInputKeepChange = (event) => {
    const value = event.target.value.replace(/\D/g, '');
    setInputKeep(value);
    lastClickedInputKeep.current = value;
  };
  const handleInputcstPricesChange = (event, item) => {
    setCstPrices(prevCstPrices => ({
      ...prevCstPrices,
      [item]: event.target.innerText
    }));
  };
  const handleMaxBBChange = (event) => {
    let xvalue = 0;
    if (isNaN(event)) {
      xvalue = Number(event.target.value.replace(/\D/g, ''));
    } else {
      xvalue = Number(event);
    }
    if (xvalue < 0) { xvalue = 1 }
    //vinputMaxBB = xvalue;
    dataSet.inputMaxBB = xvalue;
    setInputMaxBB(xvalue);
  };
  const handleFarmTimeChange = (event) => {
    let xvalue = 0;
    if (isNaN(event)) {
      xvalue = Number(event.target.value.replace(/\D/g, ''));
    } else {
      xvalue = Number(event);
    }
    if (xvalue < 0) { xvalue = 1 }
    if (xvalue > 24) { xvalue = 24 }
    //vinputFarmTime = xvalue;
    dataSet.inputFarmTime = xvalue;
    setInputFarmTime(xvalue);
  };
  const handleCoinsRatioChange = (event) => {
    let xvalue = 0;
    if (isNaN(event)) {
      xvalue = Number(event.target.value.replace(/\D/g, ''));
    } else {
      xvalue = Number(event);
    }
    if (xvalue < 0) { xvalue = 1 }
    //if (xvalue > 24) { xvalue = 24 }
    coinsRatio = xvalue;
    dataSet.coinsRatio = xvalue;
    setInputCoinsRatio(xvalue);
  };
  const handleAnimalLvlChange = (event) => {
    let xvalue = 0;
    if (isNaN(event)) {
      xvalue = Number(event.target.value.replace(/\D/g, ''));
    } else {
      xvalue = Number(event);
    }
    if (xvalue < 0) { xvalue = 1 }
    if (xvalue > 15) { xvalue = 15 }
    //vinputAnimalLvl = xvalue;
    dataSet.inputAnimalLvl = xvalue;
    setInputAnimalLvl(xvalue);
  };
  const handleFromLvlChange = (event) => {
    const value = event.target.value.replace(/\D/g, '');
    setInputFromLvl(value);
    if (value > 0 && value < 66) { getxpFromToLvl(value, inputToLvl, xdxp) }
  };
  const handleToLvlChange = (event) => {
    const value = event.target.value.replace(/\D/g, '');
    setInputToLvl(value);
    if (value > 0 && value < 66) { getxpFromToLvl(inputFromLvl, value, xdxp) }
  };
  const handleButtonClick = async (reset) => {
    //if (Notification.permission !== 'granted') { Notification.requestPermission() }
    activeTimers.forEach(timerId => {
      clearInterval(timerId);
    });
    setActiveTimers([]);
    setNotifiedTimers([]);
    xnotifiedTimers = [];
    try {
      lastClickedInputValue.current = inputValue;
      var bTrynftArray = [];
      var bTrynftwArray = [];
      var bTrybuildArray = [];
      var bTryskillArray = [];
      var bTryskilllgcArray = [];
      var bTrybudArray = [];
      if (localStorage.getItem("SFLManData") !== null) {
        const cookieValue = localStorage.getItem("SFLManData");
        var loadedData = JSON.parse(cookieValue);
        bTrynftArray = loadedData.bTrynft.length > 0 ? loadedData.bTrynft.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {}) : "";
        bTrynftwArray = loadedData.bTrynftw.length > 0 ? loadedData.bTrynftw.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {}) : "";
        bTrybuildArray = loadedData.bTrybuild.length > 0 ? loadedData.bTrybuild.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {}) : "";
        bTryskillArray = loadedData.bTryskill.length > 0 ? loadedData.bTryskill.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {}) : "";
        bTryskilllgcArray = loadedData.bTryskilllgc.length > 0 ? loadedData.bTryskilllgc.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {}) : "";
        bTrybudArray = loadedData.bTrybud.length > 0 ? loadedData.bTrybud.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {}) : "";
      }
      username = "";
      if (reset) { setFarmData([]); }
      //setInputValue(lastClickedInputValue.current);
      const fetchFarmData = async (retryCount = 0) => {
        try {
          const response = await fetch(API_URL + "/getfarm", {
            method: 'GET',
            headers: {
              frmid: inputValue,
              inputkeep: inputKeep,
              inputFarmTime: dataSet.inputFarmTime,
              inputMaxBB: dataSet.inputMaxBB,
              inputAnimalLvl: dataSet.inputAnimalLvl,
              coinsratio: dataSet.coinsRatio,
              xtrynft: JSON.stringify(bTrynftArray),
              xtrynftw: JSON.stringify(bTrynftwArray),
              xtrybuild: JSON.stringify(bTrybuildArray),
              xtryskill: JSON.stringify(bTryskillArray),
              xtryskilllgc: JSON.stringify(bTryskilllgcArray),
              xtrybud: JSON.stringify(bTrybudArray),
            }
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
            username = responseData.username;
            isAbo = responseData.isabo;
            isVip = responseData.vip;
            dataSet.isVip = isVip;
            dataSet.dateVip = responseData.datevip;
            isBanned = responseData.isbanned ? <div style={{ color: "red", margin: "0", padding: "0" }}><img src={"./icon/ui/suspicious.png"} /><span>BANNED</span></div> : "";
            dataSet.isBanned = responseData.isbanned;
            dataSet.dailychest = responseData.dailychest;
            dateSeason = new Date(responseData.constants.dateSeason);
            tktName = responseData.constants.tktName;
            imgtkt = responseData.constants.imgtkt;
            it = responseData.it;
            tool = responseData.tool;
            food = responseData.food;
            fish = responseData.fish;
            flower = responseData.flower;
            bounty = responseData.bounty;
            craft = responseData.craft;
            compost = responseData.compost;
            nft = responseData.nft;
            nftw = responseData.nftw;
            skilllgc = responseData.skilllgc;
            skill = responseData.skill;
            buildng = responseData.buildng;
            bud = responseData.bud;
            spot = responseData.spot;
            fishingDetails = responseData.fishingDetails;
            mutantchickens = responseData.mutantchickens;
            sTickets = responseData.sTickets;
            buildngf = responseData.buildngf;
            Animals = responseData.Animals;
            isleMap = responseData.isleMap;
            //frmOwner = responseData.frmOwner;
            xexpandData = responseData.expandData;
            ftrades = responseData.ftrades;
            taxFreeSFL = frmtNb(responseData.taxFreeSFL);
            dataSet.taxFreeSFL = taxFreeSFL;
            setReqState('');
            setFarmData(responseData.frmData);
            dataSet.farmData = responseData.frmData;
            setBumpkinData(responseData.Bumpkin);
            dataSet.bumpkin = responseData.Bumpkin[0];
            getPlanted(it);
            if (dataSet.farmId !== inputValue || !dataSet.bumpkinImg) {
              const response = await fetch(API_URL + "/getbumpkin", {
                method: 'GET',
                headers: {
                  //tokenuri: bumpkinData[0].tkuri,
                  //bknid: 1, //bumpkinData[0].id,
                  frmid: inputValue,
                  tknuri: responseData.Bumpkin[0].tkuri,
                }
              });
              if (response.ok) {
                const data = await response.json();
                //bkn = data.responseBumpkin;
                const imageData = data.responseImage;
                //setImageData(`data:image/png;base64,${imageData}`);
                dataSet.bumpkinImg = `data:image/png;base64,${imageData}`;
                //setBumpkinDataOC(data.responseBkn);
                //bumpkinData[0].Bknlvl = data.Bknlvl;
              }
            }
            dataSet.farmId = inputValue;
            if (localStorage.getItem("SFLManData") === null) {
              //setFarmit(it);
              //setCookit(food);
              //setTryit(nft, nftw, skill, buildng, bud);
              //setActive(nft, nftw, skill, buildng, bud);
            } else {
              getFarmit(it);
              getCookit(food);
              //getTryit(nft, nftw, skill, buildng, bud);
              //setActive(nft, nftw, skill, buildng, bud);
            }
            //NFTPrice();
            setfTrades();
            setdeliveriesData(responseData.orderstable);
            dataSet.orderstable = responseData.orderstable;
            setSelectedExpandType(xexpandData.type);
            //setfromtoexpand(responseData.expandData);
            //getFromToExpand(fromexpand, toexpand);
            //setanimalData(responseData.Animals);
            if (localStorage.getItem("SFLManData") === null) {
              const nftEntries = Object.entries(nft);
              const nftwEntries = Object.entries(nftw);
              const sklEntries = Object.entries(skill);
              const bldEntries = Object.entries(buildng);
              const budEntries = Object.entries(bud);
              nftEntries.forEach(([item], index) => { nft[item].tryit = nft[item].isactive });
              nftwEntries.forEach(([item], index) => { nftw[item].tryit = nftw[item].isactive });
              sklEntries.forEach(([item], index) => { skill[item].tryit = skill[item].isactive });
              bldEntries.forEach(([item], index) => { buildng[item].tryit = buildng[item].isactive });
              budEntries.forEach(([item], index) => { bud[item].tryit = bud[item].isactive });
            }
            refreshDataSet();
            await getPrices(true);
          } else {
            setReqState(`Error : ${response.status}`);
            //console.error("Error fetching farm data:", response.status);
          }
        } catch (error) {
          //setReqState(`Error : ${response.status}`);
          //console.error("Error during fetchFarmData:", error);
          setReqState(`Error : ${error.message}`);
        }
      };

      await fetchFarmData();
      if (selectedInv === "activity") {
        getActivity();
      }
    } catch (error) {
      //setReqState(`Error : ${error}`);
      throw (error);
      //console.log(`Error : ${error}`);
      //localStorage.clear();
      //console.log("Error, cleared local data");
    }
  };

  const handleTraderClick = () => {
    setGraphType("Trader");
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
      setTooltipData({
        x: clientX,
        y: clientY,
        item,
        context,
        value
      });
      //console.log(responseData);
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
  const handleCostCheckedChange = (event) => {
    setCostChecked(event.target.checked);
  };
  const handleTryCheckedChange = (event) => {
    dataSet.forTry = event.target.checked;
    setTryChecked(event.target.checked);
  };
  const handleBurnCheckedChange = (event) => {
    setBurnChecked(event.target.checked);
  };
  const handleFarmitChange = (item) => {
    it[item].farmit = it[item].farmit === 1 ? 0 : 1;
    setFarmit(it);
    setInv();
    setCookie();
  };
  const handleCookitChange = (itemh) => {
    food[itemh].cookit = food[itemh].cookit === 1 ? 0 : 1;
    setCookit(food);
    setCook();
    setCookie();
  };
  const handleIncrement = (item, xtry, max) => {
    /* setxHrvst((prevHrvst) => {
      if (prevHrvst[item] < max) {
        const updatedHrvst = [...prevHrvst];
        updatedHrvst[item] += 1;
        return updatedHrvst;
      }
      return prevHrvst;
    }); */
    if (xtry) {
      if (xHrvsttry[item] < max) { xHrvsttry[item] += 1 }
    } else {
      if (xHrvst[item] < max) { xHrvst[item] += 1 }
    }
    setInv();
    setCookie();
  };
  const handleDecrement = (item, xtry) => {
    /* setxHrvst((prevHrvst) => {
      if (prevHrvst[item] > 1) {
        const updatedHrvst = [...prevHrvst];
        updatedHrvst[item] -= 1;
        return updatedHrvst;
      }
      return prevHrvst;
    }); */
    if (xtry) {
      if (xHrvsttry[item] > 1) { xHrvsttry[item] -= 1 }
    } else {
      if (xHrvst[item] > 1) { xHrvst[item] -= 1 }
    }
    setInv();
    setCookie();
  };
  const handleFromExpandChange = (xIndex) => {
    //setfromexpand(xIndex);
    setfromexpand(prevState => xIndex);
    //console.log(xIndex);
  };
  const handleToExpandChange = (xIndex) => {
    settoexpand(xIndex);
    //console.log(xIndex);
  };
  const handleSetHrvMax = (xtry) => {
    if (xtry) {
      const itemMx = Object.keys(HrvstMaxtry);
      itemMx.map(item => {
        xHrvsttry[item] = HrvstMaxtry[item];
        //console.log(xHrvsttry);
      });
      //xHrvsttry = HrvstMaxtry.slice();
    } else {
      const itemMx = Object.keys(HrvstMax);
      itemMx.map(item => {
        xHrvst[item] = HrvstMax[item];
        //console.log(xHrvst);
      });
      //xHrvst = HrvstMax.slice();
    }
    //setHarvestD(xHrsvtortry);
    setInv();
    setCookie();
  };

  function setInv() {
    if (farmData.inventory) {
      const inventoryEntries = Object.entries(farmData.inventory);
      var pinventoryEntries = "";
      if (farmData.previousInventory) { pinventoryEntries = Object.entries(farmData.previousInventory) }
      const itemOrder = Object.keys(it);
      const burnortry = !TryChecked ? "burn" : "burntry";
      if (selectedQuantity === "daily") {
        const stoneSpot = !TryChecked ? it["Stone"].farmit * (xHrvst["Stone"] * spot.stone) : it["Stone"].farmit * (xHrvsttry["Stone"] * spot.stone);
        const ironSpot = !TryChecked ? it["Iron"].farmit * (xHrvst["Iron"] * spot.iron) : it["Iron"].farmit * (xHrvsttry["Iron"] * spot.iron);
        const goldSpot = !TryChecked ? it["Gold"].farmit * (xHrvst["Gold"] * spot.gold) : it["Gold"].farmit * (xHrvsttry["Gold"] * spot.gold);
        const crimestoneSpot = !TryChecked ? it["Crimstone"].farmit * (xHrvst["Crimstone"] * spot.crimstone) : it["Crimstone"].farmit * (xHrvsttry["Crimstone"] * spot.crimstone);
        const sunstoneSpot = !TryChecked ? it["Sunstone"].farmit * (xHrvst["Sunstone"] * spot.sunstone) : it["Sunstone"].farmit * (xHrvsttry["Sunstone"] * spot.sunstone);
        const oilSpot = !TryChecked ? it["Oil"].farmit * (xHrvst["Oil"] * spot.oil) : it["Oil"].farmit * (xHrvsttry["Oil"] * spot.oil);
        xBurning[burnortry]["Wood"] = (stoneSpot * 3) + (ironSpot * 3) + (goldSpot * 3) + (crimestoneSpot * 3) + (sunstoneSpot * 3) + (oilSpot * 25);
        xBurning[burnortry]["Stone"] = (ironSpot * 5);
        xBurning[burnortry]["Iron"] = (goldSpot * 5) + (oilSpot * 10);
        xBurning[burnortry]["Gold"] = (crimestoneSpot * 3) + (sunstoneSpot * 3);
      }
      const sortedInventoryItems = itemOrder.map(item => {
        const quantity = inventoryEntries.find(([entryItem]) => entryItem === item)?.[1] || 0;
        return [item, quantity];
      });
      /* const priceTEntries = Object.entries(priceDataT);
      const itEntries = Object.entries(it);
      priceTEntries.forEach(([item], index) => {
        for (var j = 0; j < itEntries.length; j++) {
          if (Number(it[itEntries[j][0]].id) === priceTEntries[item][1].id) {
            it[itEntries[j][0]].farmid = priceTEntries[item][1].farmid;
            break;
          }
        }
      }); */
      var totTimeCrp = 0;
      var totTimeRs = 0;
      var totCost = 0;
      var totShop = 0;
      var totTrader = 0;
      var totNifty = 0;
      var totOS = 0;
      let invIndex = 0;
      const inventoryItemsCrop = setInvContent(pinventoryEntries, sortedInventoryItems, totCost, totShop, totTrader, totNifty, totOS, totTimeCrp, totTimeRs, invIndex, "crop");
      totTimeCrp = inventoryItemsCrop.totTimeCrp;
      totCost = inventoryItemsCrop.totCost;
      totShop = inventoryItemsCrop.totShop;
      totTrader = inventoryItemsCrop.totTrader;
      totNifty = inventoryItemsCrop.totNifty;
      totOS = inventoryItemsCrop.totOS;
      invIndex = inventoryItemsCrop.invIndex;
      var tprctcN = 0;
      var tprctcO = 0;
      tprctcN = inventoryItemsCrop.totcTrader > 0 ? parseFloat(((inventoryItemsCrop.totcNifty - inventoryItemsCrop.totcTrader) / inventoryItemsCrop.totcTrader) * 100).toFixed(0) : "";
      tprctcO = inventoryItemsCrop.totcTrader > 0 ? parseFloat(((inventoryItemsCrop.totcOS - inventoryItemsCrop.totcTrader) / inventoryItemsCrop.totcTrader) * 100).toFixed(0) : "";
      const totCrop = selectedQuant !== "unit" ?
        (<>
          {xListeCol[0][1] === 1 ? (<td className="ttcenter" >TOTAL</td>) : ("")}
          <td className="td-icon">   </td>
          <td></td>
          <td style={{ display: 'none' }}>ID</td>
          {xListeCol[1][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
          {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
          {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[2][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
          {xListeCol[3][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[4][1] === 1 ? (<td className="ttcenter">{parseFloat(inventoryItemsCrop.totcCost).toFixed(2)}</td>) : ("")}
          {xListeCol[5][1] === 1 ? (<td className="ttcenter">{parseFloat(inventoryItemsCrop.totcShop).toFixed(2)}</td>) : ("")}
          {xListeCol[6][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(inventoryItemsCrop.totcTrader).toFixed(2)}</td>) : ("")}
          {xListeCol[17][1] === 1 && xListeCol[6][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[7][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
          {xListeCol[8][1] === 1 && xListeCol[14][1] === 1 ? (<td className={tprctcN > -20 ? 'tdpdiffgrn' : 'tdpdiff'}>{tprctcN}{inventoryItemsCrop.totcTrader > 0 ? "%" : ""}</td>) : ("")}
          {xListeCol[8][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(inventoryItemsCrop.totcNifty).toFixed(2)}</td>) : ("")}
          {xListeCol[17][1] === 1 && xListeCol[8][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[9][1] === 1 && xListeCol[14][1] === 1 ? (<td className={tprctcO > -20 ? 'tdpdiffgrn' : 'tdpdiff'}>{tprctcO}{inventoryItemsCrop.totcTrader > 0 ? "%" : ""}</td>) : ("")}
          {xListeCol[9][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(inventoryItemsCrop.totcOS).toFixed(2)}</td>) : ("")}
          {xListeCol[17][1] === 1 && xListeCol[9][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[10][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[11][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[12][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[18][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[13][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
          {xListeCol[15][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[16][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
        </>) : ("");
      const inventoryItemsRes = setInvContent(pinventoryEntries, sortedInventoryItems, totCost, totShop, totTrader, totNifty, totOS, totTimeCrp, totTimeRs, invIndex, "mineral", "gem", "wood", "oil");
      totTimeRs = inventoryItemsCrop.totTimeRs;
      totCost = inventoryItemsRes.totCost;
      totShop = inventoryItemsRes.totShop;
      totTrader = inventoryItemsRes.totTrader;
      totNifty = inventoryItemsRes.totNifty;
      totOS = inventoryItemsRes.totOS;
      invIndex = inventoryItemsRes.invIndex;
      tprctcN = inventoryItemsRes.totcTrader > 0 ? parseFloat(((inventoryItemsRes.totcNifty - inventoryItemsRes.totcTrader) / inventoryItemsRes.totcTrader) * 100).toFixed(0) : "";
      tprctcO = inventoryItemsRes.totcTrader > 0 ? parseFloat(((inventoryItemsRes.totcOS - inventoryItemsRes.totcTrader) / inventoryItemsRes.totcTrader) * 100).toFixed(0) : "";
      const totRes = selectedQuant !== "unit" ?
        (<>
          {xListeCol[0][1] === 1 ? (<td className="ttcenter" >TOTAL</td>) : ("")}
          <td className="td-icon">   </td>
          <td></td>
          <td style={{ display: 'none' }}>ID</td>
          {xListeCol[1][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
          {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
          {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[2][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
          {xListeCol[3][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[4][1] === 1 ? (<td className="ttcenter">{parseFloat(inventoryItemsRes.totcCost).toFixed(2)}</td>) : ("")}
          {xListeCol[5][1] === 1 ? (<td className="ttcenter">{parseFloat(inventoryItemsRes.totcShop).toFixed(2)}</td>) : ("")}
          {xListeCol[6][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(inventoryItemsRes.totcTrader).toFixed(2)}</td>) : ("")}
          {xListeCol[17][1] === 1 && xListeCol[6][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[7][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
          {xListeCol[8][1] === 1 && xListeCol[14][1] === 1 ? (<td className={tprctcN > -20 ? 'tdpdiffgrn' : 'tdpdiff'}>{tprctcN}{inventoryItemsRes.totcTrader > 0 ? "%" : ""}</td>) : ("")}
          {xListeCol[8][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(inventoryItemsRes.totcNifty).toFixed(2)}</td>) : ("")}
          {xListeCol[17][1] === 1 && xListeCol[8][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[9][1] === 1 && xListeCol[14][1] === 1 ? (<td className={tprctcO > -20 ? 'tdpdiffgrn' : 'tdpdiff'}>{tprctcO}{inventoryItemsRes.totcTrader > 0 ? "%" : ""}</td>) : ("")}
          {xListeCol[9][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(inventoryItemsRes.totcOS).toFixed(2)}</td>) : ("")}
          {xListeCol[17][1] === 1 && xListeCol[9][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[10][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[11][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[12][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[18][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[13][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
          {xListeCol[15][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[16][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
        </>) : ("");
      const inventoryItemsAnml = setInvContent(pinventoryEntries, sortedInventoryItems, totCost, totShop, totTrader, totNifty, totOS, totTimeCrp, totTimeRs, invIndex, "animal", "honey", "flower");
      //totTimeRs = inventoryItemsAnml.totTimeRs;
      totCost = inventoryItemsAnml.totCost;
      totShop = inventoryItemsAnml.totShop;
      totTrader = inventoryItemsAnml.totTrader;
      totNifty = inventoryItemsAnml.totNifty;
      totOS = inventoryItemsAnml.totOS;
      invIndex = inventoryItemsAnml.invIndex;
      tprctcN = inventoryItemsAnml.totcTrader > 0 ? parseFloat(((inventoryItemsAnml.totcNifty - inventoryItemsAnml.totcTrader) / inventoryItemsAnml.totcTrader) * 100).toFixed(0) : "";
      tprctcO = inventoryItemsAnml.totcTrader > 0 ? parseFloat(((inventoryItemsAnml.totcOS - inventoryItemsAnml.totcTrader) / inventoryItemsAnml.totcTrader) * 100).toFixed(0) : "";
      const totAnml = selectedQuant !== "unit" ?
        (<>
          {xListeCol[0][1] === 1 ? (<td className="ttcenter" >TOTAL</td>) : ("")}
          <td className="td-icon">   </td>
          <td></td>
          <td style={{ display: 'none' }}>ID</td>
          {xListeCol[1][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
          {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
          {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[2][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
          {xListeCol[3][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[4][1] === 1 ? (<td className="ttcenter">{parseFloat(inventoryItemsAnml.totcCost).toFixed(2)}</td>) : ("")}
          {xListeCol[5][1] === 1 ? (<td className="ttcenter">{parseFloat(inventoryItemsAnml.totcShop).toFixed(2)}</td>) : ("")}
          {xListeCol[6][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(inventoryItemsAnml.totcTrader).toFixed(2)}</td>) : ("")}
          {xListeCol[17][1] === 1 && xListeCol[6][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[7][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
          {xListeCol[8][1] === 1 && xListeCol[14][1] === 1 ? (<td className={tprctcN > -20 ? 'tdpdiffgrn' : 'tdpdiff'}>{tprctcN}{inventoryItemsAnml.totcTrader > 0 ? "%" : ""}</td>) : ("")}
          {xListeCol[8][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(inventoryItemsAnml.totcNifty).toFixed(2)}</td>) : ("")}
          {xListeCol[17][1] === 1 && xListeCol[8][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[9][1] === 1 && xListeCol[14][1] === 1 ? (<td className={tprctcO > -20 ? 'tdpdiffgrn' : 'tdpdiff'}>{tprctcO}{inventoryItemsAnml.totcTrader > 0 ? "%" : ""}</td>) : ("")}
          {xListeCol[9][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(inventoryItemsAnml.totcOS).toFixed(2)}</td>) : ("")}
          {xListeCol[17][1] === 1 && xListeCol[9][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[10][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[11][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[12][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[18][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[13][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
          {xListeCol[15][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[16][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
        </>) : ("");
      const inventoryItemsFruit = setInvContent(pinventoryEntries, sortedInventoryItems, totCost, totShop, totTrader, totNifty, totOS, totTimeCrp, totTimeRs, invIndex, "fruit", "mushroom");
      totCost = inventoryItemsFruit.totCost;
      totShop = inventoryItemsFruit.totShop;
      totTrader = inventoryItemsFruit.totTrader;
      totNifty = inventoryItemsFruit.totNifty;
      totOS = inventoryItemsFruit.totOS;
      invIndex = inventoryItemsFruit.invIndex;
      const tprctN = totTrader > 0 ? parseFloat(((totNifty - totTrader) / totTrader) * 100).toFixed(0) : "";
      const tprctO = totTrader > 0 ? parseFloat(((totOS - totTrader) / totTrader) * 100).toFixed(0) : "";
      tprctcN = inventoryItemsFruit.totcTrader > 0 ? parseFloat(((inventoryItemsFruit.totcNifty - inventoryItemsFruit.totcTrader) / inventoryItemsFruit.totcTrader) * 100).toFixed(0) : "";
      tprctcO = inventoryItemsFruit.totcTrader > 0 ? parseFloat(((inventoryItemsFruit.totcOS - inventoryItemsFruit.totcTrader) / inventoryItemsFruit.totcTrader) * 100).toFixed(0) : "";
      const totFruit = selectedQuant !== "unit" ?
        (<>
          {xListeCol[0][1] === 1 ? (<td className="ttcenter" >TOTAL</td>) : ("")}
          <td className="td-icon">   </td>
          <td></td>
          <td style={{ display: 'none' }}>ID</td>
          {xListeCol[1][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
          {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
          {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[2][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
          {xListeCol[3][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[4][1] === 1 ? (<td className="ttcenter">{parseFloat(inventoryItemsFruit.totcCost).toFixed(2)}</td>) : ("")}
          {xListeCol[5][1] === 1 ? (<td className="ttcenter">{parseFloat(inventoryItemsFruit.totcShop).toFixed(2)}</td>) : ("")}
          {xListeCol[6][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(inventoryItemsFruit.totcTrader).toFixed(2)}</td>) : ("")}
          {xListeCol[17][1] === 1 && xListeCol[6][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[7][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
          {xListeCol[8][1] === 1 && xListeCol[14][1] === 1 ? (<td className={tprctcN > -20 ? 'tdpdiffgrn' : 'tdpdiff'}>{tprctcN}{inventoryItemsFruit.totcTrader > 0 ? "%" : ""}</td>) : ("")}
          {xListeCol[8][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(inventoryItemsFruit.totcNifty).toFixed(2)}</td>) : ("")}
          {xListeCol[17][1] === 1 && xListeCol[8][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[9][1] === 1 && xListeCol[14][1] === 1 ? (<td className={tprctcO > -20 ? 'tdpdiffgrn' : 'tdpdiff'}>{tprctcO}{inventoryItemsFruit.totcTrader > 0 ? "%" : ""}</td>) : ("")}
          {xListeCol[9][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(inventoryItemsFruit.totcOS).toFixed(2)}</td>) : ("")}
          {xListeCol[17][1] === 1 && xListeCol[9][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[10][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[11][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[12][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[18][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[13][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
          {xListeCol[15][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
          {xListeCol[16][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
        </>) : ("");
      var showBldinv = true;
      var BldItems = "";
      if (showBldinv) {
        const bldOrder = ["Fire Pit", "Kitchen", "Deli", "Bakery", "Smoothie Shack", "Compost Bin", "Turbo Composter", "Premium Composter"];
        const sortedBldItems = bldOrder.map(item => {
          const quantity = inventoryEntries.find(([entryItem]) => entryItem === item)?.[1] || 0;
          return [item, quantity];
        });
        BldItems = sortedBldItems.map(([building], index) => {
          if (buildngf[building]) {
            if (buildngf[building].readyAt > 0) {
              const itemBuild = buildngf[building];
              const ico = buildngf[building].img;
              const item = buildngf[building].name;
              const icost = buildngf[building].cost;
              const buildCraft = buildngf[building].craft;
              const irdyat = buildngf[building].readyAt;
              var xnow = new Date().getTime();
              const ximgrdy = irdyat > 0 && irdyat < xnow ? <img src={imgrdy} alt="" /> : "";
              const ximgfood = <img src={buildngf[building].itimg} alt="" style={{ width: '15px', height: '15px' }} />
              const iquant = buildngf[building].quant > 1 && buildngf[building].quant;
              const pNifty = buildngf[building].costp2pn;
              const pOS = buildngf[building].costp2po;
              const pTrad = buildngf[building].costp2pt;
              return (
                <tr key={index}>
                  {xListeCol[0][1] === 1 ? (<td></td>) : ("")}
                  <td id="iccolumn"><i><img src={ico} alt={''} className="itico" /></i></td>
                  <td></td>
                  <td style={{ display: 'none' }}></td>
                  {xListeCol[1][1] === 1 ? (<td className="tditem">{item}</td>) : ("")}
                  {selectedQuantity === "daily" ? (<td className="tdcenter"></td>) : ("")}
                  {selectedQuantity === "daily" ? (<td className="tdcenter"></td>) : ("")}
                  {selectedQuantity === "daily" ? (<td className="tdcenter"></td>) : ("")}
                  {xListeCol[2][1] === 1 ? (<td className="tdcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
                  {xListeCol[3][1] === 1 ? (<td className="tdcenter" style={{ color: `rgb(200, 200, 200)` }}></td>) : ("")}
                  {xListeCol[4][1] === 1 ? (<td className="tdcenter">{frmtNb(icost)}</td>) : ("")}
                  {xListeCol[5][1] === 1 ? (<td className="tdcenter"></td>) : ("")}
                  {xListeCol[6][1] === 1 ? (<td className="tdcenterbrd">{frmtNb(pTrad)}</td>) : ("")}
                  {xListeCol[17][1] === 1 && xListeCol[6][1] === 1 ? (<td className="tdcenter"></td>) : ("")}
                  {xListeCol[7][1] === 1 ? (<td className="tdcenter"></td>) : ("")}
                  {xListeCol[8][1] === 1 && xListeCol[14][1] === 1 ? (<td className="tdcenter"></td>) : ("")}
                  {xListeCol[8][1] === 1 ? (<td className="tdcenterbrd">{frmtNb(pNifty)}</td>) : ("")}
                  {xListeCol[17][1] === 1 && xListeCol[8][1] === 1 ? (<td className="tdcenter"></td>) : ("")}
                  {xListeCol[9][1] === 1 && xListeCol[14][1] === 1 ? (<td className="tdcenter"></td>) : ("")}
                  {xListeCol[9][1] === 1 ? (<td className="tdcenterbrd">{frmtNb(pOS)}</td>) : ("")}
                  {xListeCol[17][1] === 1 && xListeCol[9][1] === 1 ? (<td className="tdcenter"></td>) : ("")}
                  {xListeCol[10][1] === 1 ? (<td className="tdcenter" style={{ color: `rgb(255, 234, 204)` }}></td>) : ("")}
                  {xListeCol[11][1] === 1 ? (<td className="tdcenter" style={{ color: `rgb(255, 225, 183)` }}></td>) : ("")}
                  {xListeCol[12][1] === 1 ? (<td className="tdcenter" style={{ color: `rgb(253, 215, 162)` }} onClick={(e) => handleTooltip(itemBuild, "buildcraft", buildCraft, e, dataSet)}>
                    {iquant > 0 ? iquant : ""}{ximgfood}</td>) : ("")}
                  {xListeCol[18][1] === 1 ? (<td id={`timer-${index}`} className="tdcenterbrd">{(irdyat > 0 ? selectedReady === "when" ? (<span>{formatdate(irdyat)}{' '}{ximgrdy}</span>) :
                    <Timer key={`timer-${index}`} timestamp={irdyat} index={item} onTimerFinish={handleTimerFinish} /> : "")}</td>) : ("")}
                  {xListeCol[13][1] === 1 ? (<td className="tdcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
                  {xListeCol[15][1] === 1 ? (<td className="tdcenter" style={{ color: `rgb(255, 204, 132)` }}></td>) : ("")}
                  {xListeCol[16][1] === 1 ? (<td className="tdcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
                </tr>
              );
            }
          }
        });
      }
      const totTime = convTime(totTimeCrp);
      const tableContent = (
        <>
          <table className="table">
            <thead>
              <tr>
                {xListeCol[0][1] === 1 ? (<th className="thcenter" onClick={(e) => handleTooltip("hoard", "th", "", e, "")}>Hoard</th>) : ("")}
                <th className="th-icon">   </th>
                <th></th>
                <td style={{ display: 'none' }}>ID</td>
                {xListeCol[1][1] === 1 ? (<th className="thcenter">Item</th>) : ("")}
                {selectedQuantity === "daily" ? (<th className="thcenter"> </th>) : ("")}
                {selectedQuantity === "daily" ? (<th className="thcenter"><div>Hrv</div><div>max</div></th>) : ("")}
                {selectedQuantity === "daily" ? (<th className="thcenter"><div>Hrv</div><div>
                  <img src="/icon/ui/arrow_left.png" alt="Hrv = Hrv max" title="Set Hrv to Hrv Max" onClick={() => handleSetHrvMax(TryChecked)} style={{ width: '11px', height: '11px' }} /></div>
                </th>) : ("")}
                {xListeCol[2][1] === 1 ? (<th className="thcenter" style={{ color: `rgb(160, 160, 160)` }} onClick={(e) => handleTooltip("quantity", "th", "", e, "")}>
                  <div className="selectquantityback"><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                    <InputLabel>Quantity</InputLabel>
                    <Select value={selectedQuantity} onChange={handleChangeQuantity} onClick={(e) => e.stopPropagation()}>
                      <MenuItem value="farm">Farm</MenuItem>
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="blockbuck">Restock</MenuItem>
                      <MenuItem value="custom">Custom</MenuItem>
                    </Select></FormControl></div>
                </th>) : ("")}
                {xListeCol[3][1] === 1 ? (<th className="thcenter">{selectedQuantity === "daily" ? (<div><div>Time</div><div>{totTime}</div></div>) : ("Time")}</th>) : ("")}
                {xListeCol[4][1] === 1 ? (<th className="thcenter" onClick={(e) => handleTooltip("cost", "th", "", e, "")}>
                  <div className="selectquantback"><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                    <InputLabel>Cost</InputLabel>
                    <Select value={selectedQuant} onChange={handleChangeQuant} onClick={(e) => e.stopPropagation()}>
                      <MenuItem value="unit">/ Unit</MenuItem>
                      <MenuItem value="quant">x Quantity</MenuItem>
                    </Select></FormControl></div>
                  <div className="checkcost" style={{ visibility: selectedQuant === "quant" ? "visible" : "hidden" }}><input type="checkbox" id="CostColumnCheckbox" checked={CostChecked}
                    onChange={handleCostCheckedChange} onClick={(e) => e.stopPropagation()} /></div>
                </th>) : ("")}
                {xListeCol[5][1] === 1 ? (<th className="thcenter">Betty</th>) : ("")}
                {xListeCol[6][1] === 1 ? (<th className="thtrad" onClick={() => handleTraderClick()}><div className="overlay-trad"></div>Market</th>) : ("")}
                {xListeCol[17][1] === 1 && xListeCol[6][1] === 1 ? (<th className="thcenter" onClick={(e) => handleTooltip("coef", "th", "", e, "")}>Coef</th>) : ("")}
                {xListeCol[7][1] === 1 ? (<th className="thcenter" style={{ color: `rgb(160, 160, 160)` }}
                  onClick={(e) => handleTooltip("withdraw", "th", "", e, "")} >Withdraw</th>) : ("")}
                {xListeCol[8][1] === 1 && xListeCol[14][1] === 1 ? (<th className="thcenter" onClick={(e) => handleTooltip("diff", "th", "", e, "")}>Diff</th>) : ("")}
                {xListeCol[8][1] === 1 ? (<th className="thnifty" onClick={() => handleNiftyClick()}><div className="overlay-nifty"></div> </th>) : ("")}
                {xListeCol[17][1] === 1 && xListeCol[8][1] === 1 ? (<th className="thcenter" onClick={(e) => handleTooltip("coef", "th", "", e, "")}>Coef</th>) : ("")}
                {xListeCol[9][1] === 1 && xListeCol[14][1] === 1 ? (<th className="thcenter" onClick={(e) => handleTooltip("diff", "th", "", e, "")}>Diff</th>) : ("")}
                {xListeCol[9][1] === 1 ? (<th className="thos" onClick={() => handleOSClick()}><div className="overlay-os"></div> </th>) : ("")}
                {xListeCol[17][1] === 1 && xListeCol[9][1] === 1 ? (<th className="thcenter" onClick={(e) => handleTooltip("coef", "th", "", e, "")}>Coef</th>) : ("")}
                {xListeCol[10][1] === 1 ? (<th className="thcenter" onClick={(e) => handleTooltip("yield", "th", "", e, "")}>Yield</th>) : ("")}
                {xListeCol[11][1] === 1 ? (<th className="thcenter" onClick={(e) => handleTooltip("harvest", "th", "", e, "")}>Harvest</th>) : ("")}
                {xListeCol[12][1] === 1 ? (<th className="thcenter" onClick={(e) => handleTooltip("toharvest", "th", "", e, "")}>ToHarvest</th>) : ("")}
                {xListeCol[18][1] === 1 ? (<th className="tdcenterbrd">
                  <div className="selectreadyback"><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                    <InputLabel>Ready</InputLabel>
                    <Select value={selectedReady} onChange={handleChangeReady} onClick={(e) => e.stopPropagation()}>
                      <MenuItem value="when">When</MenuItem>
                      <MenuItem value="remain">Remain</MenuItem>
                    </Select></FormControl></div>
                </th>) : ("")}
                {xListeCol[13][1] === 1 ? (<th className="thcenter" style={{ color: `rgb(160, 160, 160)` }} onClick={(e) => handleTooltip("1restock", "th", "", e, "")}>1restock</th>) : ("")}
                {xListeCol[15][1] === 1 ? (<th className="thcenter"><div className="selectquantityback"><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                  <InputLabel>Daily SFL</InputLabel>
                  <Select value={selectedDsfl} onChange={handleChangeDsfl} onClick={(e) => e.stopPropagation()}>
                    <MenuItem value="trader">Market</MenuItem>
                    <MenuItem value="nifty">Niftyswap</MenuItem>
                    <MenuItem value="opensea">OpenSea</MenuItem>
                    <MenuItem value="max">Higher</MenuItem>
                    {/* <MenuItem value="min">Lower</MenuItem> */}
                  </Select></FormControl></div></th>) : ("")}
                {xListeCol[16][1] === 1 ? (<th className="thcenter" style={{ color: `rgb(160, 160, 160)` }} onClick={(e) => handleTooltip("dailymax", "th", "", e, "")}>DailyMax</th>) : ("")}
              </tr>
              {selectedQuant !== "unit" ?
                <tr style={{ position: "sticky" }}>
                  {xListeCol[0][1] === 1 ? (<td className="ttcenter" >TOTAL</td>) : ("")}
                  <td className="td-icon">   </td>
                  <td></td>
                  <td style={{ display: 'none' }}>ID</td>
                  {xListeCol[1][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                  {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
                  {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
                  {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
                  {xListeCol[2][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
                  {xListeCol[3][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                  {xListeCol[4][1] === 1 ? (<td className="ttcenter">{parseFloat(totCost).toFixed(2)}</td>) : ("")}
                  {xListeCol[5][1] === 1 ? (<td className="ttcenter">{parseFloat(totShop).toFixed(2)}</td>) : ("")}
                  {xListeCol[6][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(totTrader).toFixed(2)}</td>) : ("")}
                  {xListeCol[17][1] === 1 && xListeCol[6][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                  {xListeCol[7][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
                  {xListeCol[8][1] === 1 && xListeCol[14][1] === 1 ? (<td className={tprctN > -20 ? 'tdpdiffgrn' : 'tdpdiff'}>{tprctN}{totTrader > 0 ? "%" : ""}</td>) : ("")}
                  {xListeCol[8][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(totNifty).toFixed(2)}</td>) : ("")}
                  {xListeCol[17][1] === 1 && xListeCol[8][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                  {xListeCol[9][1] === 1 && xListeCol[14][1] === 1 ? (<td className={tprctO > -20 ? 'tdpdiffgrn' : 'tdpdiff'}>{tprctO}{totTrader > 0 ? "%" : ""}</td>) : ("")}
                  {xListeCol[9][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(totOS).toFixed(2)}</td>) : ("")}
                  {xListeCol[17][1] === 1 && xListeCol[9][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                  {xListeCol[10][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                  {xListeCol[11][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                  {xListeCol[12][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                  {xListeCol[18][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                  {xListeCol[13][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
                  {xListeCol[15][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                  {xListeCol[16][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
                </tr> : ("")}
            </thead>
            <tbody>
              {selectedQuant !== "unit" ?
                (<tr style={{ position: "sticky" }}>{totCrop}</tr>) : ""}
              {inventoryItemsCrop.inventoryItems}
              {selectedQuant !== "unit" ?
                (<tr style={{ position: "sticky" }}>{totRes}</tr>) : ""}
              {inventoryItemsRes.inventoryItems}
              {selectedQuant !== "unit" ?
                (<tr style={{ position: "sticky" }}>{totAnml}</tr>) : ""}
              {inventoryItemsAnml.inventoryItems}
              {selectedQuant !== "unit" ?
                (<tr style={{ position: "sticky" }}>{totFruit}</tr>) : ""}
              {inventoryItemsFruit.inventoryItems}
              {BldItems}
            </tbody>
          </table>
        </>
      );
      invIndex++;
      //setFarmID(xtfarmID);
      setinvData(tableContent);
      setMutants(mutantchickens);
      setsTickets(sTickets);
      //console.log(`Wood : ${new Date(it["Wood"].rdyat)} / ${it["Wood"].rdyat}`);
      //console.log(`Iron : ${new Date(it["Iron"].rdyat)} / ${it["Iron"].rdyat}`);
      //if (xinitinv = false) { xinitinv = true }
    }
  }
  function setInvContent(pinventoryEntries, sortedInventoryItems, totCost, totShop, totTrader, totNifty, totOS, totTimeCrp, totTimeRs, invIndex, ItCat1, ItCat2, ItCat3, ItCat4) {
    const farmTime = inputFarmTime / 24;
    const MaxBB = inputMaxBB;
    const burnortry = !TryChecked ? "burn" : "burntry";
    var totcCost = 0;
    var totcShop = 0;
    var totcTrader = 0;
    var totcNifty = 0;
    var totcOS = 0;
    //let xIndex = 0;
    //const TaxTradSfl = 0.25 / priceData[2];
    const catArray = [ItCat1, ItCat2, ItCat3, ItCat4].filter(Boolean);
    const CorespondantItems = sortedInventoryItems.filter(item => catArray.includes(it[item[0]].cat));
    const tableLen = CorespondantItems.length;
    invIndex += tableLen;
    const imgbee = <img src="./icon/ui/bee.webp" alt={''} className="nodico" title="Bee swarm" style={{ width: '15px', height: '15px' }} />;
    const imglove = <img src="./icon/ui/expression_love.png" alt={''} className="nodico" title="Needs love" style={{ width: '15px', height: '15px' }} />;
    const imgsick = <img src="./icon/ui/happiness_03.png" alt={''} className="nodico" title="Sick" style={{ width: '15px', height: '15px' }} />;
    const imgwinter = <img src="./icon/ui/winter.webp" alt={''} className="seasonico" title="Winter" />;
    const imgspring = <img src="./icon/ui/spring.webp" alt={''} className="seasonico" title="Spring" />;
    const imgsummer = <img src="./icon/ui/summer.webp" alt={''} className="seasonico" title="Summer" />;
    const imgautumn = <img src="./icon/ui/autumn.webp" alt={''} className="seasonico" title="Autumn" />;
    const imgfullmoon = <img src="./icon/ui/full_moon.png" alt={''} className="seasonico" title="Full Moon" />;
    const inventoryItems = sortedInventoryItems.map(([item, quantity], index) => {
      let xIndex = index;
      const firstind = index === invIndex - tableLen;
      const lastind = index === invIndex - 1;
      const cellStyle = {};
      cellStyle.borderBottom = lastind ? '1px solid rgb(83, 51, 51)' : 'none';
      cellStyle.borderTop = firstind ? '1px solid rgb(83, 51, 51)' : 'none';
      //cellStyle.color = lastind ? `rgb(150, 50, 20)` : '';
      if ((quantity > 0 || it[item].tobharvest > 0) && catArray.includes(it[item].cat)) {
        const cobj = it[item];
        const icat = cobj ? cobj.cat : '';
        const ico = cobj ? cobj.img : '';
        const icoseason = cobj ? (cobj.imgseason || '') : '';
        const xSeasonImg = icoseason.split("*");
        for (let i = 0; i < xSeasonImg.length; i++) {
          if (xSeasonImg[i] === "Winter") {
            xSeasonImg[i] = imgwinter;
          } else if (xSeasonImg[i] === "Summer") {
            xSeasonImg[i] = imgsummer;
          } else if (xSeasonImg[i] === "Autumn") {
            xSeasonImg[i] = imgautumn;
          } else if (xSeasonImg[i] === "Spring") {
            xSeasonImg[i] = imgspring;
          } else if (xSeasonImg[i] === "FullMoon") {
            xSeasonImg[i] = imgfullmoon;
          }
        }
        const ido = cobj ? cobj.id : 0;
        //const frmido = cobj ? cobj.farmid : 0;
        const ximgtrd = ""; //frmido === Number(inputValue) ? <img src={imgtrd} alt="" /> : "";
        //const ximgtrdOS = frmOwner === priceDataO[i].makerof ? <img src={imgtrd} alt="" /> : "";
        const maxh = cobj ? cobj.hoard : 0;
        var costp = cobj ? !TryChecked ? (cobj.cost / coinsRatio) : (cobj.costtry / coinsRatio) : 0;
        var pShop = cobj ? (cobj.shop / coinsRatio) : 0;
        var time = cobj ? !TryChecked ? cobj.time : cobj.timetry : 0;
        const timmenbr = convtimenbr(time);
        const rtimmenbr = convtimenbr(cobj.time);
        const timmenbrtry = convtimenbr(cobj.timetry);
        const imyield = cobj ? !TryChecked ? cobj.myield : cobj.myieldtry : 0;
        const iharvest = cobj ? !TryChecked ? cobj.harvest : cobj.harvesttry : 0;
        const rharvest = cobj.harvest ? cobj.harvest : 0;
        const rharvesttry = cobj.harvesttry ? cobj.harvesttry : 0;
        const iharvestdmax = cobj.harvestdmax ? cobj.harvestdmax : 0;
        const iharvestdmaxtry = cobj.harvestdmaxtry ? cobj.harvestdmaxtry : 0;
        const icycledmax = cobj.dailycycle ? cobj.dailycycle : 0;
        const icycledmaxtry = cobj.dailycycletry ? cobj.dailycycletry : 0;
        const irestockmax = cobj.restockmax ? cobj.restockmax : 0;
        const irestockmaxtry = cobj.restockmaxtry ? cobj.restockmaxtry : 0;
        const i2bharvest = cobj ? cobj.tobharvest : 0;
        const iplanted = cobj ? cobj.planted : 0;
        const irdyat = cobj ? cobj.rdyat : 0;
        var xnow = new Date().getTime();
        const ximgrdy = irdyat > 0 && irdyat < xnow ? <img src={imgrdy} alt="" /> : "";
        const itradmax = cobj ? cobj.tradmax : 0;
        const istock = cobj ? cobj.stock : 0;
        const ifrmit = cobj ? cobj.farmit : 0;
        const previousQuantity = parseFloat(pinventoryEntries.find(([pItem]) => pItem === item)?.[1] || 0);
        const pquant = previousQuantity;
        const itemQuantity = item === "Flower" ? it["Flower"].quant : quantity;
        const difference = itemQuantity - pquant;
        const absDifference = Math.abs(difference);
        const isNegativeDifference = difference < 0;
        const hoardPercentage = Math.floor((absDifference / maxh) * 100);
        let spotNb = 0;
        let istockorhoard = 0;
        let spotImage = "";
        if (icat === "crop") { spotNb = spot.crop; istockorhoard = istock; spotImage = imgcrop; }
        if (item === "Wood") { spotNb = spot.wood; nft["Foreman Beaver"].isactive === 1 ? istockorhoard = maxh : istockorhoard = istock; spotImage = imgwood; }
        if (item === "Stone") { spotNb = spot.stone; istockorhoard = istock; spotImage = imgstone; }
        if (item === "Iron") { spotNb = spot.iron; istockorhoard = istock; spotImage = imgstone; }
        if (item === "Gold") { spotNb = spot.gold; istockorhoard = istock; spotImage = imgstone; }
        if (item === "Crimstone") { spotNb = spot.crimstone; istockorhoard = istock; spotImage = imgstone; }
        if (item === "Sunstone") { spotNb = spot.sunstone; istockorhoard = istock; spotImage = imgstone; }
        if (item === "Egg" || item === "Feather") { spotNb = 1; istockorhoard = Math.ceil(farmTime / timmenbr); spotImage = imgchkn; }
        if (item === "Honey") { spotNb = spot.beehive; istockorhoard = istock; spotImage = imgbeehive; }
        if (item === "Flower") { spotNb = spot.flower; istockorhoard = istock; spotImage = imgflowerbed; }
        if (item === "Milk" || item === "Leather") { spotNb = spot.cow; istockorhoard = istock; spotImage = imgcow; }
        if (item === "Wool" || item === "Merino Wool") { spotNb = spot.sheep; istockorhoard = istock; spotImage = imgsheep; }
        const bswarm = item === "Honey" && it["Honey"].swarm;
        const needslove = (item === "Egg" || item === "Milk" || item === "Wool") && it[item].needlove;
        const issick = (item === "Egg" || item === "Milk" || item === "Wool") && it[item].issick;
        if (icat === "fruit") { spotNb = spot.fruit; istockorhoard = istock * (4 + buildng["Immortal Pear"].isactive); spotImage = imgwood; }
        const hrvststk = (Math.floor(istockorhoard / spotNb) > 0 ? Math.floor(istockorhoard / spotNb) : 1);
        const hrvststkfrt = (Math.floor(istockorhoard / iplanted) > 0 ? Math.floor(istockorhoard / iplanted) : 1);
        const hrvststkegg = (Math.floor(istockorhoard / spotNb) > 0 ? Math.floor(istockorhoard / spotNb) : 1) / timmenbr;
        const tmstk = hrvststk * timmenbr;
        const tmstkfrt = hrvststkfrt * timmenbr;
        const tmstkegg = hrvststkegg * timmenbr;
        const tmstkx = (icat === "fruit" ? tmstkfrt : item === "Egg" ? tmstkegg : tmstk);
        const BBd = farmTime / tmstkx;
        const BBdmx = farmTime / tmstk;
        //const BBprod = (((item === "Wood" && nft["Foreman Beaver"].isactive === 1) || item === "Egg" ? maxh : hrvststk * iharvest));
        const BBprod = !TryChecked ? irestockmax : irestockmaxtry;
        const hrvststkx = (icat === "fruit" ? hrvststkfrt : item === "Egg" ? hrvststkegg : hrvststk);
        const hrvstd = (BBd <= MaxBB ? (Math.ceil(hrvststkx * BBd)) : (Math.ceil(hrvststkx * MaxBB))) > 0 ? (BBd <= MaxBB ? (Math.ceil(hrvststkx * BBd)) :
          (Math.ceil(hrvststkx * MaxBB))) : 1;
        const hrvstdmx = (BBdmx <= MaxBB ? (Math.ceil(hrvststk * BBdmx)) : (Math.ceil(hrvststk * MaxBB))) > 0 ? (BBdmx <= MaxBB ? (Math.ceil(hrvststk * BBdmx)) :
          (Math.ceil(hrvststk * MaxBB))) : 1;
        if (!TryChecked) { HrvstMax[item] = hrvstdmx } else { HrvstMaxtry[item] = hrvstdmx }
        if (!TryChecked) { if (!xHrvst[item] || xHrvst[item] > HrvstMax[item]) { xHrvst[item] = HrvstMax[item] } }
        else { if (!xHrvsttry[item] || xHrvsttry[item] > HrvstMaxtry[item]) { xHrvsttry[item] = HrvstMaxtry[item] } }
        const bhrvstItem = !TryChecked ? xHrvst[item] : xHrvsttry[item];
        const dailyprod = bhrvstItem * (item === "Egg" ? iharvestdmax : iharvest);
        const rhdmax = rharvest / rtimmenbr;
        const rhdmaxtry = rharvesttry / timmenbrtry;
        dProd[item] = it[item].farmit ? bhrvstItem * (item === "Egg" ? rhdmax : rharvest) : 0;
        dProdtry[item] = it[item].farmit ? bhrvstItem * (item === "Egg" ? rhdmaxtry : rharvesttry) : 0;
        //const hrvstdmaxx = (icat === "fruit" ? !TryChecked ? iharvestdmax : iharvestdmaxtry : item === "Egg" ? !TryChecked ? iharvestdmax : iharvestdmaxtry : iharvest);
        //const dailyprodmx = hrvstdmx * hrvstdmaxx;
        const dailyprodmx = !TryChecked ? iharvestdmax : iharvestdmaxtry;
        if (ifrmit === 1 && icat === "crop") { totTimeCrp += bhrvstItem * timmenbr }
        if (ifrmit === 1 && (icat === "mineral" || icat === "gem" || icat === "wood")) { totTimeRs += tmstk }
        const iburn = xBurning[burnortry][item] ? xBurning[burnortry][item] : 0;
        const iQuant = selectedQuantity === "daily" ? (ifrmit === 1 ? dailyprod : 0) - iburn : selectedQuantity === "blockbuck" ?
          BBprod : selectedQuantity === "custom" ? cstPrices[xIndex] : itemQuantity;
        var Ttax = Math.ceil(iQuant / itradmax) * 0.25;
        const nTTax = 0.1;
        const NTax = 0.05;
        const OTax = 0.05;
        let convPricep = 0;
        let convPriceshp = 0;
        if (selectedCurr === "SFL") {
          convPricep = costp;
          convPriceshp = pShop;
        }
        if (selectedCurr === "MATIC" || selectedCurr === "POL") {
          convPricep = (costp * priceData[2]) / priceData[1];
          convPriceshp = (pShop * priceData[2]) / priceData[1];
        }
        if (selectedCurr === "USDC") {
          convPricep = costp * priceData[2];
          convPriceshp = pShop * priceData[2];
        }
        if (selectedQuant !== "unit") {
          costp = convPricep * (Number(iQuant) + Number(ifrmit === 1 ? iburn : 0));
          if (costp < 0) { costp = 0 }
          pShop = convPriceshp * iQuant;
          if (time !== "" && time !== 0) {
            if (selectedQuantity === "daily") {
              time = convTime(bhrvstItem * timmenbr);
            } else {
              time = convTime(Math.ceil(iQuant / iharvest) * timmenbr);
            }
          }
        }
        else {
          costp = convPricep;
          pShop = convPriceshp;
        }
        if (CostChecked === true && xListeCol[4][1] === 1 && selectedQuant !== "unit" && pShop > 0) { pShop = pShop - costp; }
        let pTrad = 0;
        let puTrad = 0;
        let convPrice = 0;
        const priceT = it[item].costp2pt || 0;
        const priceN = it[item].costp2pn || 0;
        const priceO = it[item].costp2po || 0;
        //for (let i = 0; i < priceDataT.length; i++) {
        //if (priceDataT[i].id.toString() === ido) {
        if (selectedCurr === "SFL") {
          //convPrice = priceDataT[i].unit;
          convPrice = priceT;
          Ttax = Ttax / priceData[2];
        }
        if (selectedCurr === "MATIC" || selectedCurr === "POL") {
          convPrice = (priceT * priceData[2]) / priceData[1];
          Ttax = Ttax / priceData[1];
        }
        if (selectedCurr === "USDC") {
          convPrice = priceT * priceData[2];
        }
        puTrad = convPrice;
        if (selectedQuant !== "unit") {
          convPrice *= iQuant;
          convPrice -= (convPrice * nTTax);
          convPrice -= ((CostChecked === true && xListeCol[4][1] === 1) ? costp : 0);
          //convPrice -= Ttax;
        }
        pTrad = convPrice;
        //break;
        //}
        //}
        let pNifty = 0;
        let puNifty = 0;
        if (selectedCurr === "SFL") {
          //convPrice = priceDataN[i].cryptoprice;
          convPrice = priceN;
        }
        if (selectedCurr === "MATIC" || selectedCurr === "POL") {
          convPrice = (priceN * priceData[2]) / priceData[1];
        }
        if (selectedCurr === "USDC") {
          convPrice = priceN * priceData[2];
        }
        puNifty = convPrice;
        if (selectedQuant !== "unit") {
          convPrice *= (iQuant * 0.7);
          convPrice -= (convPrice * NTax);
          convPrice -= ((CostChecked === true && xListeCol[4][1] === 1) ? costp : 0);
        }
        pNifty = convPrice;
        let pOS = 0;
        let puOS = 0;
        if (selectedCurr === "SFL") {
          //convPrice = priceDataO[i].unit / priceData[2];
          convPrice = priceO;
        }
        if (selectedCurr === "MATIC" || selectedCurr === "POL") {
          convPrice = (priceO * priceData[2]) / priceData[1];
        }
        if (selectedCurr === "USDC") {
          convPrice = priceO * priceData[2];
        }
        puOS = convPrice;
        if (selectedQuant !== "unit") {
          convPrice *= (iQuant * 0.7);
          convPrice -= (convPrice * OTax);
          convPrice -= ((CostChecked === true && xListeCol[4][1] === 1) ? costp : 0);
        }
        pOS = convPrice;
        const pTCoef = (puTrad * (1 - nTTax) / convPricep);
        const coefT = pTCoef !== "Infinity" ? parseFloat(pTCoef).toFixed(2) : "";
        const pNCoef = ((((puNifty * 0.7) * (1 - NTax))) / convPricep);
        const coefN = pNCoef !== "Infinity" ? parseFloat(pNCoef).toFixed(2) : "";
        const pOCoef = ((((puOS * 0.7) * (1 - OTax))) / convPricep);
        const coefO = pOCoef !== "Infinity" ? parseFloat(pOCoef).toFixed(2) : "";
        const colorT = ColorValue(coefT);
        const colorN = ColorValue(coefN);
        const colorO = ColorValue(coefO);
        const prctN = ((pTrad > 0) && (pNifty > 0)) ? parseFloat(((pNifty - pTrad) / pTrad) * 100).toFixed(0) : "";
        const prctO = ((pTrad > 0) && (pOS > 0)) ? parseFloat(((pOS - pTrad) / pTrad) * 100).toFixed(0) : "";
        //const BBsfl = (getMaxValue(puTrad, puNifty, puOS)) * BBprod;
        const puNiftyWthdr = puNifty * 0.7;
        const puOSWthdr = puOS * 0.7;
        const xDsfl = selectedDsfl === "max" ? (getMaxValue(puTrad * (1 - nTTax), puNiftyWthdr * (1 - NTax), puOSWthdr * (1 - OTax))) :
          selectedDsfl === "trader" ? puTrad * (1 - nTTax) : selectedDsfl === "nifty" ? puNiftyWthdr * (1 - NTax) : selectedDsfl === "opensea" ? puOSWthdr * (1 - OTax) : 0;
        //const Dsfl = (xDsfl - convPricep) * dailyprodmx;
        const Dsfl = (xDsfl - convPricep) * (!TryChecked ? iharvestdmax : iharvestdmaxtry);
        //const titleTrad = selectedQuant !== "unit" ? Math.ceil(iQuant / itradmax) + " * (" + itradmax + " * " + puTrad + " - 0.25$)" : "";
        const titleTrad = ""; // selectedQuant !== 'unit' ? frmtNb(Math.ceil(iQuant / itradmax)) + ` x (${frmtNb(itradmax)} x ${frmtNb(puTrad)}) - ${frmtNb(TaxTradSfl)}SFL(0.25$)` : "";
        const titleNifty = ""; // selectedQuant !== "unit" ? frmtNb(iQuant * 0.7) + " x " + frmtNb(puNifty) + " - 5%" : "";
        const titleOS = ""; // selectedQuant !== "unit" ? frmtNb(iQuant * 0.7) + " x " + frmtNb(puOS) + " - 10%" : "";
        const maxPltfrm = Math.max(puTrad, puNiftyWthdr, puOSWthdr) === puTrad ? "Trader" : Math.max(puTrad, puNiftyWthdr, puOSWthdr) === puNiftyWthdr ? "Niftyswap" :
          Math.max(puTrad, puNiftyWthdr, puOSWthdr) === puOSWthdr ? "OpenSea" : "";
        const titleDsfl = selectedDsfl === "max" ? `${frmtNb(dailyprodmx)} x ${frmtNb(xDsfl)} at ${maxPltfrm}` : "";
        const cellDSflStyle = {};
        cellDSflStyle.backgroundColor = (selectedDsfl === "max" && Dsfl > 0) ? maxPltfrm === "Trader" ? 'rgba(5, 128, 1, 0.14)' :
          maxPltfrm === "Niftyswap" ? 'rgba(103, 1, 128, 0.14)' : maxPltfrm === "OpenSea" ? 'rgba(0, 75, 236, 0.14)' : '' : '';
        cellDSflStyle.color = ColorValue(Dsfl, 0, 10);
        if (selectedQuant !== "unit") {
          const bCost = !isNaN(costp) ? Number(costp) : 0;
          const bShop = !isNaN(pShop) ? Number(pShop) : 0;
          const bTrad = !isNaN(pTrad) ? Number(pTrad) : 0;
          const bNifty = !isNaN(pNifty) ? Number(pNifty) : 0;
          const bOS = !isNaN(pOS) ? Number(pOS) : 0;
          totCost += bCost;
          totShop += bShop;
          totTrader += bTrad;
          totNifty += bNifty;
          totOS += bOS;
        }
        if (selectedQuant !== "unit") {
          const bCost = !isNaN(costp) ? Number(costp) : 0;
          const bShop = !isNaN(pShop) ? Number(pShop) : 0;
          const bTrad = !isNaN(pTrad) ? Number(pTrad) : 0;
          const bNifty = !isNaN(pNifty) ? Number(pNifty) : 0;
          const bOS = !isNaN(pOS) ? Number(pOS) : 0;
          totcCost += bCost;
          totcShop += bShop;
          totcTrader += bTrad;
          totcNifty += bNifty;
          totcOS += bOS;
        }
        const timerElement = (
          <Timer
            key={`timer-${xIndex}`}
            timestamp={irdyat}
            index={item}
            onTimerFinish={handleTimerFinish}
          />
        );
        return (
          <>
            <tr key={xIndex}>
              {xListeCol[0][1] === 1 ? (<td style={cellStyle}>
                {maxh > 0 && (
                  <div className={`progress-bar ${isNegativeDifference ? 'negative' : ''}`}>
                    <div className="progress" style={{ width: `${hoardPercentage}%` }}>
                      <span className="progress-text">
                        {isNegativeDifference ? `-${parseFloat(absDifference).toFixed(0)}` : `${parseFloat(difference).toFixed(0)}/${parseFloat(maxh > 1000 ? (maxh / 1000) : maxh).toFixed(0)}${maxh > 1000 ? "k" : ""}`}
                      </span>
                    </div>
                  </div>
                )}
              </td>) : ("")}
              <td id="iccolumn" style={cellStyle}><i><img src={ico} alt={''} className="itico" /></i></td>
              <td style={cellStyle}>
                {xSeasonImg.map((value, index) => {
                  if (value !== "") { return (<span key={index}><i>{xSeasonImg[index]}</i></span>) }
                  return null;
                })}</td>
              <td style={{ display: 'none' }}>{ido}</td>
              {xListeCol[1][1] === 1 ? (<td className="tditem" style={cellStyle}>{item}</td>) : ("")}
              {selectedQuantity === "daily" ? (<td className="tdcenter" style={cellStyle}><input type="checkbox" checked={ifrmit} onChange={() => handleFarmitChange(item)} /></td>) : ("")}
              {selectedQuantity === "daily" ? (<td className="tdcenter" style={cellStyle}>{hrvstd}</td>) : ("")}
              {selectedQuantity === "daily" ? (<td className="tdcenter" style={cellStyle}>
                <img src="/icon/ui/arrow_up-1.png" alt="Minus" onClick={() => handleDecrement(item, TryChecked)} style={{ width: '11px', height: '11px' }} />
                {bhrvstItem}
                <img src="/icon/ui/arrow_up.png" alt="Plus" onClick={() => handleIncrement(item, TryChecked, hrvstd)} style={{ width: '11px', height: '11px' }} />
              </td>) : ("")}
              {xListeCol[2][1] === 1 ? selectedQuantity === "custom" ?
                (<td className="tdcenter" style={{ ...cellStyle, color: `rgb(160, 160, 160)` }}><div
                  contentEditable
                  suppressContentEditableWarning={true}
                  onBlur={(event) => handleInputcstPricesChange(event, xIndex)}>{cstPrices[xIndex]}</div></td>) :
                (<td className="tdcenter" style={{ ...cellStyle, color: `rgb(160, 160, 160)` }}>{parseFloat(iQuant).toFixed(2)}</td>) : ("")}
              {xListeCol[3][1] === 1 ? (<td className="tdcenter" style={{ ...cellStyle, color: `rgb(200, 200, 200)` }}>{time}</td>) : ("")}
              {xListeCol[4][1] === 1 ? (<td className="tdcenter" style={cellStyle} onClick={(e) => handleTooltip(item, "costp", costp, e, dataSet)}>{frmtNb(costp)}</td>) : ("")}
              {xListeCol[5][1] === 1 ? (<td className="tdcenter" style={cellStyle}>{frmtNb(pShop)}</td>) : ("")}
              {xListeCol[6][1] === 1 ? (<td className={parseFloat(pTrad).toFixed(20) === getMaxValue(pTrad, pNifty, pOS) ? 'tdcentergreen' : 'tdcenterbrd'}
                onClick={(event) => handleTradeListClick(inputValue, ido, "Trades")} style={cellStyle} title={titleTrad} >{puTrad !== 0 ? frmtNb(pTrad) : ""}{ximgtrd}</td>) : ("")}
              {xListeCol[17][1] === 1 && xListeCol[6][1] === 1 ? (<td style={{ ...cellStyle, color: colorT, textAlign: 'center', fontSize: '8px' }}
                onClick={(e) => handleTooltip(item, "coef", coefT, e, dataSet)}>{coefT > 0 ? coefT : ""}</td>) : ("")}
              {xListeCol[7][1] === 1 ? (<td className="tdcenter" style={{ ...cellStyle, color: `rgb(160, 160, 160)` }}>{parseFloat((iQuant) * 0.7).toFixed(2)}</td>) : ("")}
              {xListeCol[8][1] === 1 && xListeCol[14][1] === 1 ? (<td className={prctN > -20 ? 'tdpdiffgrn' : 'tdpdiff'} style={cellStyle}
                onClick={(e) => handleTooltip(item, "prct", prctN, e, dataSet)}>{prctN}{((pTrad > 0) && (pNifty > 0)) ? "%" : ""}</td>) : ("")}
              {xListeCol[8][1] === 1 ? (<td className={parseFloat(pNifty).toFixed(20) === getMaxValue(pTrad, pNifty, pOS) ? 'tdcentergreen' : 'tdcenterbrd'}
                style={cellStyle} title={titleNifty}>{puNifty !== 0 ? frmtNb(pNifty) : ""}</td>) : ("")}
              {xListeCol[17][1] === 1 && xListeCol[8][1] === 1 ? (<td style={{ ...cellStyle, color: colorN, textAlign: 'center', fontSize: '8px' }}
                onClick={(e) => handleTooltip(item, "coef", coefT, e, dataSet)}>{coefN > 0 ? coefN : ""}</td>) : ("")}
              {xListeCol[9][1] === 1 && xListeCol[14][1] === 1 ? (<td className={prctO > -20 ? 'tdpdiffgrn' : 'tdpdiff'} style={cellStyle}
                onClick={(e) => handleTooltip(item, "prct", prctO, e, dataSet)}>{prctO}{((pTrad > 0) && (pOS > 0)) ? "%" : ""}</td>) : ("")}
              {xListeCol[9][1] === 1 ? (<td className={parseFloat(pOS).toFixed(20) === getMaxValue(pTrad, pNifty, pOS) ? 'tdcentergreen' : 'tdcenterbrd'}
                onClick={(event) => handleTradeListClick(inputValue, ido, "OS")} style={cellStyle} title={titleOS}>{puOS !== 0 ? frmtNb(pOS) : ""}</td>) : ("")}
              {xListeCol[17][1] === 1 && xListeCol[9][1] === 1 ? (<td style={{ ...cellStyle, color: colorO, textAlign: 'center', fontSize: '8px' }}
                onClick={(e) => handleTooltip(item, "coef", coefO, e, dataSet)}>{coefO > 0 ? coefO : ""}</td>) : ("")}
              {xListeCol[10][1] === 1 ? (<td className="tdcenter" style={{ ...cellStyle, color: `rgb(255, 234, 204)` }} onClick={(e) => handleTooltip(item, "harvest", imyield, e, dataSet)}>
                {parseFloat(imyield).toFixed(2)}</td>) : ("")}
              {xListeCol[11][1] === 1 ? (<td className="tdcenter" style={{ ...cellStyle, color: `rgb(255, 225, 183)` }} onClick={(e) => handleTooltip(item, "harvest", iharvest, e, dataSet)}>
                {parseFloat(iharvest).toFixed(2)}</td>) : ("")}
              {xListeCol[12][1] === 1 ? (<td className="tdcenter" style={{ ...cellStyle, color: `rgb(253, 215, 162)` }} onClick={(e) => handleTooltip(item, "harvest", i2bharvest, e, dataSet)}>
                <div class="tooltiphrvst-container">
                  {i2bharvest > 0 ? parseFloat(i2bharvest).toFixed(2) : ""}{bswarm && imgbee}{issick ? imgsick : needslove && imglove}
                  <div class="tooltiphrvst-content" style={{ top: `calc(${index > 1 ? "-100%" : "100%"} + 5px);` }}>
                    <div>
                      {iplanted} <img src={spotImage} alt="" style={{ width: '14px', height: '14px' }} /> <img src={imgflch} alt="" /> {parseFloat(i2bharvest).toFixed(2)} <img src={ico} alt={''} className="itico" />
                    </div></div>
                </div>
              </td>) : ("")}
              {xListeCol[18][1] === 1 ? (<td id={`timer-${xIndex}`} className="tdcenterbrd" style={cellStyle}>{(i2bharvest > 0 || item === "Honey" ? selectedReady === "when" ?
                (<span>{formatdate(irdyat)}{' '}{ximgrdy}</span>) : timerElement : "")}</td>) : ("")}
              {xListeCol[13][1] === 1 ? (<td className="tdcenter" style={{ ...cellStyle, color: `rgb(160, 160, 160)` }}>{BBprod > 0 ? parseFloat(BBprod).toFixed(2) : ""}</td>) : ("")}
              {xListeCol[15][1] === 1 ? (<td className="tdcenter" style={{ ...cellStyle, ...cellDSflStyle }}
                title={titleDsfl} onClick={(e) => handleTooltip(item, "dailysfl", costp, e, dataSet)}>
                {parseFloat(Dsfl).toFixed(2)}</td>) : ("")}
              {xListeCol[16][1] === 1 ? (<td className="tdcenter" style={{ ...cellStyle, color: `rgb(160, 160, 160)` }}>{dailyprodmx > 0 ? parseFloat(dailyprodmx).toFixed(2) : ""}</td>) : ("")}
            </tr>
          </>
        );
      }
    });
    const result = {
      inventoryItems: inventoryItems,
      totTimeRs: totTimeRs,
      totTimeCrp: totTimeCrp,
      totCost: totCost,
      totShop: totShop,
      totTrader: totTrader,
      totNifty: totNifty,
      totOS: totOS,
      totcCost: totcCost,
      totcShop: totcShop,
      totcTrader: totcTrader,
      totcNifty: totcNifty,
      totcOS: totcOS,
      invIndex: invIndex
    }
    return result;
  }

  function setCook() {
    if (farmData.inventory) {
      const inventoryEntries = selectedQuantityCook === "farm" || "daily" || "dailymax" ? Object.entries(farmData.inventory) : Object.entries(farmData.inventory);
      const foodNames = Object.keys(food);
      const Compo = [];
      Compo["total"] = [];
      const sortedCompo = [];
      const sortedInventoryItems = foodNames.map(item => {
        const quantity = inventoryEntries.find(([entryItem]) => entryItem === item)?.[1] || 0;
        for (let compofood in food[item].compoit) {
          const compo = compofood;
          const quant = food[item].compoit[compofood];
          if (it[compo] || fish[compo] || bounty[compo]) {
            Compo[item] = Compo[item] || [];
            Compo["total"][compo] = 0;
            Compo[item][compo] = Compo[item][compo] || 0;
            Compo[item][compo] += Number(quant);
          }
        }
        return [item, quantity];
      });
      Object.keys(it).forEach(item => {
        if (Object.hasOwn(Compo["total"], item)) {
          sortedCompo.push(item);
        }
      });
      Object.keys(fish).forEach(item => {
        if (Object.hasOwn(Compo["total"], item)) {
          sortedCompo.push(item);
        }
      });
      Object.keys(bounty).forEach(item => {
        if (Object.hasOwn(Compo["total"], item)) {
          sortedCompo.push(item);
        }
      });
      //console.log(sortedCompo);
      const farmTime = inputFarmTime / 24;
      var totXP = 0;
      var totCost = 0;
      var totCostp2p = 0;
      var BldTime = [];
      var totTime = 0;
      const inventoryItems = sortedInventoryItems.map(([item, quantity], index) => {
        const cobj = food[item];
        const ico = cobj ? cobj.img : '';
        const ibld = cobj ? cobj.bld : '';
        var time = cobj ? !TryChecked ? cobj.time : cobj.timetry : '';
        const timenbr = convtimenbr(time);
        var timecomp = cobj ? !TryChecked ? cobj.timecrp : cobj.timecrptry : '';
        //if (timecomp === '') {console.log (item + ": error timecomp" )}
        const timecrpnbr = convtimenbr(timecomp);
        const icookit = cobj ? cobj.cookit : 0;
        const iquantd = Math.ceil(farmTime / timenbr) !== Infinity ? Math.ceil(farmTime / timenbr) : 0;
        let prodValues = [];
        for (let compofood in food[item].compoit) {
          const compo = compofood;
          const quant = food[item].compoit[compofood];
          if (it[compo]) {
            const itdprod = dProd[compo] ? dProd[compo] : 0;
            const itdprodtry = dProdtry[compo] ? dProdtry[compo] : 0;
            const dCook = Math.floor(!TryChecked ? itdprod / quant : itdprodtry / quant);
            prodValues.push(dCook);
          }
        }
        //const prodValues = selectedQuantityCook === "dailymax" ? iquantd : selectedQuantityCook === "daily" ? [dprod1, dprod2, dprod3, dprod4, dprod5].filter(value => value > 0) : 0;
        var xquantd = selectedQuantityCook === "dailymax" ? iquantd : selectedQuantityCook === "daily" ? Math.min(...prodValues) !== Infinity ? Math.min(...prodValues) : 0 : 0;
        xquantd = selectedQuantityCook === "daily" ? xquantd > iquantd ? iquantd : xquantd : xquantd;
        //!TryChecked ? food[item].dprod = xquantd : food[item].dprodtry = xquantd;
        const iKeep = selectedQuantCook !== "unit" ? inputKeep : 0;
        const iQuant = selectedQuantityCook === "farm" ? (quantity - iKeep > 0 ? quantity - iKeep : 0) : xquantd;
        const ixp = cobj ? selectedQuantCook === "unit" ? (!TryChecked ? cobj.xp : cobj.xptry) : (!TryChecked ? cobj.xp : cobj.xptry) * iQuant : 0;
        const ixph = cobj ? (!TryChecked ? cobj.xph : cobj.xphtry) : 0;
        const ixpsfl = cobj ? (!TryChecked ? cobj.xpsfl * coinsRatio : cobj.xpsfltry * coinsRatio) : 0;
        totXP += (selectedQuantityCook === "daily" || selectedQuantityCook === "dailymax" ? isNaN(ixp) ? 0 : Number(ixp) * food[item].cookit : isNaN(ixp) ? 0 : Number(ixp));
        if (cobj.cookit) {
          if (!BldTime[ibld]) { BldTime[ibld] = 0 }
          BldTime[ibld] += xquantd * timenbr;
        }
        const ixphcomp = cobj ? timecomp !== 0 ? parseFloat(ixp / (timecrpnbr * 24)).toFixed(1) : 0 : 0;
        var icost = cobj ? selectedQuantCook === "unit" ? ((!TryChecked ? cobj.cost : cobj.costtry) / coinsRatio) : ((!TryChecked ? cobj.cost : cobj.costtry) / coinsRatio) * iQuant : 0;
        var icostp2p = cobj ? selectedQuantCook === "unit" ?
          selectedCostCook === "shop" ? (cobj.costshop / coinsRatio) : selectedCostCook === "trader" ? cobj.costp2pt : selectedCostCook === "nifty" ? cobj.costp2pn : selectedCostCook === "opensea" ? cobj.costp2po : 0
          : selectedCostCook === "shop" ? (cobj.costshop / coinsRatio) * iQuant : selectedCostCook === "trader" ? cobj.costp2pt * iQuant : selectedCostCook === "nifty" ? cobj.costp2pn * iQuant : selectedCostCook === "opensea" ? cobj.costp2po * iQuant : 0 : 0;
        if (isNaN(icostp2p)) { icostp2p = 0 }
        let convPricep = 0;
        let convPricep2p = 0;
        if (selectedCurr === "SFL") {
          convPricep = icost;
          convPricep2p = icostp2p;
        }
        if (selectedCurr === "MATIC") {
          convPricep = (icost * priceData[2]) / priceData[1];
          convPricep2p = (icostp2p * priceData[2]) / priceData[1];
        }
        if (selectedCurr === "USDC") {
          convPricep = icost * priceData[2];
          convPricep2p = icostp2p * priceData[2];
        }
        icost = convPricep;
        icostp2p = convPricep2p;
        if (selectedQuantCook !== "unit") {
          if (time !== "" && time !== 0) { time = convTime(iQuant * timenbr) }
          if (timecomp !== "" && timecomp !== 0) { timecomp = convTime(iQuant * timecrpnbr) }
        }
        if (((selectedQuantityCook === "daily" || selectedQuantityCook === "dailymax") && cobj.cookit) || selectedQuantityCook === "farm") {
          totCost += icost;
          totCostp2p += icostp2p;
          for (let compofood in food[item].compoit) {
            const compo = compofood;
            const quant = food[item].compoit[compofood];
            if (it[compo] || fish[compo] || bounty[compo]) { Compo["total"][compo] += quant * (selectedQuantCook === "unit" ? 1 : iQuant) }
          }
        }
        return (
          <tr key={index}>
            {xListeColCook[0][1] === 1 ? <td className="tdcenter">{ibld}</td> : null}
            <td id="iccolumn"><i><img src={ico} alt={''} className="itico" /></i></td>
            {xListeColCook[1][1] === 1 ? <td className="tditem">{item}</td> : null}
            {selectedQuantityCook === "daily" || selectedQuantityCook === "dailymax" ? <td className="tdcenter"><input type="checkbox" checked={icookit} onChange={() => handleCookitChange(item)} /></td> : null}
            {xListeColCook[2][1] === 1 ? <td className="tdcenter">{iQuant}</td> : null}
            {xListeColCook[3][1] === 1 ? <td className="tdcenter">{parseFloat(ixp).toFixed(1)}</td> : null}
            {xListeColCook[4][1] === 1 ? <td className="tdcenter">{time}</td> : null}
            {xListeColCook[5][1] === 1 ? <td className="tdcenter">{timecomp}</td> : null}
            {xListeColCook[6][1] === 1 ? <td className="tdcenter">{ixph}</td> : null}
            {xListeColCook[7][1] === 1 ? <td className="tdcenter">{ixphcomp}</td> : null}
            {xListeColCook[8][1] === 1 ? <td className="tdcenter">{frmtNb(ixpsfl)}</td> : null}
            {xListeColCook[9][1] === 1 ? <td className="tdcenter">{frmtNb(icost)}</td> : null}
            {xListeColCook[10][1] === 1 ? <td className="tdcenter">{frmtNb(icostp2p)}</td> : null}
            {xListeColCook[11][1] === 1 ? Object.values(sortedCompo).map((itemName, itIndex) => (
              <td className="tdcenterbrd" style={{ fontSize: '12px' }} key={itemName}>
                {food[item].compoit[itemName] ? food[item].compoit[itemName] * (selectedQuantCook === "unit" ? 1 : iQuant) : ""}
              </td>
            )) : null}
          </tr>
        );
      });

      var maxTime = 0;
      for (var key in BldTime) {
        if (BldTime.hasOwnProperty(key)) {
          var value = BldTime[key];
          if (typeof value === 'number' && !isNaN(value)) {
            if (value > maxTime) {
              maxTime = value;
            }
          }
        }
      }
      totTime = convTime(maxTime);
      const timeOver = maxTime > 1; //farmTime / 24;
      const xinputKeep = selectedQuantCook !== "unit" && selectedQuantityCook === "farm" ? <input type="text" value={inputKeep} onChange={handleInputKeepChange} style={{ width: '11px' }} maxLength={1} /> : "";
      const xinputKeept = selectedQuantCook !== "unit" && selectedQuantityCook === "farm" ? "Keep " : "";
      const xinputFromLvl = selectedQuantCook !== "unit" && selectedQuantityCook !== "farm" ? <input type="text" value={inputFromLvl} onChange={handleFromLvlChange} style={{ width: '20px', marginLeft: 'auto' }} maxLength={2} /> : "";
      const xinputToLvl = selectedQuantCook !== "unit" && selectedQuantityCook !== "farm" ? <input type="text" value={inputToLvl} onChange={handleToLvlChange} style={{ width: '20px', marginLeft: 'auto' }} maxLength={2} /> : "";
      const xinputFromLvlt = selectedQuantCook !== "unit" && selectedQuantityCook !== "farm" ? "From " : "";
      const xinputToLvlt = selectedQuantCook !== "unit" && selectedQuantityCook !== "farm" ? " to " : "";
      const xLvlconft = selectedQuantCook !== "unit" && selectedQuantityCook !== "farm" ? " days, " + fromtolvlxp + "xp" : "";
      const xspace = selectedQuantCook !== "unit" && selectedQuantityCook !== "farm" ? " " : "";
      xdxp = totXP;
      setdailyxp(xdxp);
      const bfdtolvl = !TryChecked ? bumpkinData[0].foodtolvl : bumpkinData[0].foodtolvltry;
      const bfdpstlvl = !TryChecked ? bumpkinData[0].foodxppastlvl : bumpkinData[0].foodxppastlvltry;
      const bxptonxtlvl = !TryChecked ? bumpkinData[0].xptonextlvl : bumpkinData[0].xptonextlvltry;
      //const icolspan = xListeColCook[0][1] === 1 ? 3 : 2;
      const tableContent = (
        <>
          {selectedQuantityCook !== "farm" ?
            <span>{xinputFromLvlt}{xinputFromLvl}{xinputToLvlt}{xinputToLvl}{xspace}{selectedQuantCook !== "unit" ? parseFloat(fromtolvltime).toFixed(1) : ""}{xLvlconft}</span>
            : null}
          <table className="table">
            <thead>
              <tr>
                {xListeColCook[0][1] === 1 ? <th className="thcenter" >Building</th> : null}
                <th className="th-icon">   </th>
                {xListeColCook[1][1] === 1 ? <th className="thcenter" >Food</th> : null}
                {selectedQuantityCook === "daily" || selectedQuantityCook === "dailymax" ? <th className="thcenter" >Cook</th> : null}
                {xListeColCook[2][1] === 1 ? <th className="thcenter" >
                  <div className="selectquantback" style={{ top: `4px` }}><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                    <InputLabel>Quant</InputLabel>
                    <Select value={selectedQuantityCook} onChange={handleChangeQuantityCook}>
                      <MenuItem value="farm">Farm</MenuItem>
                      <MenuItem value="daily">Daily/Farm</MenuItem>
                      <MenuItem value="dailymax">Daily/Time</MenuItem>
                    </Select></FormControl></div></th> : null}
                {xListeColCook[3][1] === 1 ? <th className="thcenter"  >
                  <div className="selectquantback" style={{ top: `4px` }}><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                    <InputLabel>XP</InputLabel>
                    <Select value={selectedQuantCook} onChange={handleChangeQuantCook}>
                      <MenuItem value="unit">/ Unit</MenuItem>
                      <MenuItem value="quant">x Quantity</MenuItem>
                    </Select></FormControl></div></th> : null}
                {xListeColCook[4][1] === 1 ? <th className="thcenter" >Time</th> : null}
                {xListeColCook[5][1] === 1 ? <th className="thcenter" >Time comp</th> : null}
                {xListeColCook[6][1] === 1 ? <th className="thcenter" >XP/H</th> : null}
                {xListeColCook[7][1] === 1 ? <th className="thcenter" >XP/H comp</th> : null}
                {xListeColCook[8][1] === 1 ? <th className="thcenter" >XP/SFL</th> : null}
                {xListeColCook[9][1] === 1 ? <th className="thcenter" >Cost</th> : null}
                {xListeColCook[10][1] === 1 ? <th className="thcenter" >
                  <div className="selectquantback" style={{ top: `4px` }}><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                    <InputLabel>Cost</InputLabel>
                    <Select value={selectedCostCook} onChange={handleChangeCostCook}>
                      <MenuItem value="shop">Shop</MenuItem>
                      <MenuItem value="trader">Market</MenuItem>
                      <MenuItem value="nifty">Niftyswap</MenuItem>
                      <MenuItem value="opensea">OpenSea</MenuItem>
                    </Select></FormControl></div></th> : null}
                {xListeColCook[11][1] === 1 ? Object.values(sortedCompo).map((itemName, itIndex) => (
                  <th className="thcenter" key={itemName}><i><img src={(it[itemName] ? it[itemName].img : fish[itemName] ? fish[itemName].img : bounty[itemName] ? bounty[itemName].img : imgna)} alt={itemName} className="itico" /></i></th>
                )) : null}
              </tr>
              {(selectedQuantCook !== "unit" || selectedQuantityCook !== "farm") ?
                <tr key="total">
                  {xListeColCook[0][1] === 1 ? <td className="tdcenter">Total</td> : null}
                  {xListeColCook[1][1] === 1 ? <td></td> : null}
                  {selectedQuantityCook !== "farm" ? <td className="tdcenter"></td> : null}
                  {/* {xListeColCook[1][1] === 1 && selectedQuantityCook === "farm" ? <td className="tditem"></td> : null} */}
                  {xListeColCook[2][1] === 1 ? <td></td> : null}
                  {selectedQuantityCook !== "farm" ? <td className="tdcenter"></td> : null}
                  {xListeColCook[2][1] === 1 && selectedQuantityCook === "farm" ?
                    <td className="tdcenter" title="Keep for deliveries">{xinputKeept}{xinputKeep}</td> : null}
                  {xListeColCook[3][1] === 1 ? <td className="tdcenter">{selectedQuantCook !== "unit" ? parseFloat(totXP).toFixed(1) : ""}</td> : null}
                  {xListeColCook[4][1] === 1 ? <td className="tdcenter" style={{ color: timeOver && selectedQuantityCook !== "farm" ? "rgb(255, 0, 0)" : "rgb(255, 255, 255)" }}>
                    {selectedQuantityCook !== "farm" ? totTime :
                      <><span>to lvl{bfdtolvl}</span>
                        <div className="progress-bar" style={{ width: "80px" }}>
                          <div className="progress" style={{ width: `${bfdpstlvl / (bfdpstlvl + bxptonxtlvl) * 100}%` }}>
                            <span className="progress-text">
                              {`${parseFloat(bfdpstlvl).toFixed(0)}`}
                            </span>
                          </div>
                        </div></>}</td> : null}
                  {xListeColCook[5][1] === 1 ? <td className="tdcenter"></td> : null}
                  {xListeColCook[6][1] === 1 ? <td className="tdcenter"></td> : null}
                  {xListeColCook[7][1] === 1 ? <td className="tdcenter"></td> : null}
                  {xListeColCook[8][1] === 1 ? <td className="tdcenter"></td> : null}
                  {xListeColCook[9][1] === 1 ? <td className="tdcenter">{selectedQuantCook !== "unit" ? frmtNb(totCost) : ""}</td> : null}
                  {xListeColCook[10][1] === 1 ? <td className="tdcenter">{selectedQuantCook !== "unit" ? frmtNb(totCostp2p) : ""}</td> : null}
                  {xListeColCook[11][1] === 1 ? Object.values(sortedCompo).map((itemName, itIndex) => (
                    <td className="tdcenterbrd" key={itemName}
                      style={{
                        fontSize: '12px', color: it[itemName] ? (Compo["total"][itemName] > (!TryChecked ? dProd[itemName] : dProdtry[itemName])
                          && selectedQuantityCook !== "farm" ? "rgb(255, 0, 0)" : "rgb(255, 255, 255)") : "rgb(255, 255, 255)"
                      }}>
                      {selectedQuantCook !== "unit" && Compo["total"][itemName] > 0 ? Compo["total"][itemName] : ""}
                    </td>
                  )) : null}
                </tr> : null}
            </thead>
            <tbody>
              {inventoryItems}
            </tbody>
          </table>
        </>
      );
      setcookData(tableContent);
      setMutants(mutantchickens);
      setsTickets(sTickets);
    }
  }

  function setFish() {
    if (farmData.inventory) {
      var totXPfsh = 0;
      var totCaught = 0;
      var totCost = 0;
      const inventoryEntries = Object.entries(farmData.inventory);
      var pinventoryEntries = "";
      if (farmData.previousInventory) { pinventoryEntries = Object.entries(farmData.previousInventory) }
      const fishNames = Object.keys(fish);
      const sortedInventoryItems = fishNames.map(item => {
        const quantity = inventoryEntries.find(([entryItem]) => entryItem === item)?.[1] || 0;
        return [item, quantity];
      });
      const earthwormbait = <i><img src={fish["Earthworm"].img} alt={''} className="itico" title="Earthworm" /></i>
      const grubbait = <i><img src={fish["Grub"].img} alt={''} className="itico" title="Grub" /></i>
      const redwigglerbait = <i><img src={fish["Red Wiggler"].img} alt={''} className="itico" title="Red Wiggler" /></i>
      const earthwormquant = fish["Earthworm"].quant;
      const grubquant = fish["Grub"].quant;
      const redwigglerquant = fish["Red Wiggler"].quant;
      const imgwinter = <img src="./icon/ui/winter.webp" alt={''} className="seasonico" title="Winter" />;
      const imgspring = <img src="./icon/ui/spring.webp" alt={''} className="seasonico" title="Spring" />;
      const imgsummer = <img src="./icon/ui/summer.webp" alt={''} className="seasonico" title="Summer" />;
      const imgautumn = <img src="./icon/ui/autumn.webp" alt={''} className="seasonico" title="Autumn" />;
      const imgfullmoon = <img src="./icon/ui/full_moon.png" alt={''} className="seasonico" title="Full Moon" />;
      const inventoryItems = sortedInventoryItems.map(([item, quantity], index) => {
        const cobj = fish[item];
        const ico = cobj ? cobj.img : '';
        const icat = cobj ? cobj.cat : '';
        const ibait = cobj ? cobj.bait : '';
        const ilocat = cobj ? cobj.locations : '';
        const xBaits = ibait.split("/");
        const icaught = cobj ? cobj.caught : '';
        const previousQuantity = parseFloat(pinventoryEntries.find(([pItem]) => pItem === item)?.[1] || 0);
        const pquant = previousQuantity;
        const itemQuantity = quantity;
        const difference = itemQuantity - pquant;
        const absDifference = Math.abs(difference);
        const isNegativeDifference = difference < 0;
        const maxh = 100;
        const hoardPercentage = Math.floor((absDifference / maxh) * 100);
        const ichum = cobj ? cobj.chum : '';
        const ichumimgs = cobj ? cobj.chumimgs : '';
        const xChums = ichum.split("*");
        const xChumsImg = ichumimgs.split("*");
        const iperiodimgs = cobj ? cobj.weather : '';
        const xPeriodImg = iperiodimgs.split("*");
        for (let i = 0; i < xPeriodImg.length; i++) {
          if (xPeriodImg[i] === "Winter") {
            xPeriodImg[i] = imgwinter;
          } else if (xPeriodImg[i] === "Summer") {
            xPeriodImg[i] = imgsummer;
          } else if (xPeriodImg[i] === "Autumn") {
            xPeriodImg[i] = imgautumn;
          } else if (xPeriodImg[i] === "Spring") {
            xPeriodImg[i] = imgspring;
          } else if (xPeriodImg[i] === "FullMoon") {
            xPeriodImg[i] = imgfullmoon;
          }
        }
        const iperiod = xPeriodImg;
        var icost = cobj ? ((!TryChecked ? cobj.cost : cobj.costtry) / coinsRatio) : '';
        const iQuant = quantity;
        const ixp = cobj ? selectedQuantFish === "unit" ? (!TryChecked ? cobj.xp : cobj.xptry) : parseFloat((!TryChecked ? cobj.xp : cobj.xptry) * iQuant).toFixed(1) : 0;
        totXPfsh += isNaN(ixp) ? 0 : Number(ixp);
        totCaught += icaught;
        const iprct = cobj ? parseFloat(cobj.prct).toFixed(1) : '';
        let convPricep = 0;
        if (selectedCurr === "SFL") {
          convPricep = icost;
        }
        if (selectedCurr === "MATIC") {
          convPricep = (icost * priceData[2]) / priceData[1];
        }
        if (selectedCurr === "USDC") {
          convPricep = icost * priceData[2];
        }
        icost = isNaN(convPricep) ? 0 : Number(convPricep);
        totCost += icost * iQuant;
        const xCost = selectedQuantFish === "unit" ? icost : icost * iQuant;
        const ixpsfl = isNaN(ixp / xCost) ? "" : ixp / xCost;
        xListeColFish[1][1] = 0;
        if (icat !== "Bait") {
          return (
            <tr key={index}>
              {xListeColFish[0][1] === 1 ? <td className="tdcenter">{icat}</td> : null}
              {xListeColFish[1][1] === 1 ? <td className="tdcenter">{ilocat}</td> : null}
              {xListeColFish[2][1] === 1 ? (<td>
                {maxh > 0 && (
                  <div className={`progress-bar ${isNegativeDifference ? 'negative' : ''}`}>
                    <div className="progress" style={{ width: `${hoardPercentage}%` }}>
                      <span className="progress-text">
                        {isNegativeDifference ? `-${parseFloat(absDifference).toFixed(0)}` : `${parseFloat(difference).toFixed(0)}/${parseFloat(maxh).toFixed(0)}`}
                      </span>
                    </div>
                  </div>
                )}
              </td>) : ("")}
              <td id="iccolumn"><i><img src={ico} alt={''} className="itico" /></i></td>
              {xListeColFish[3][1] === 1 ? <td className="tditem">{item}</td> : null}
              {xListeColFish[4][1] === 1 ? <td className="tdcenter">
                {xBaits.map((value, index) => (
                  value !== "" ? (<span key={index}>
                    <i><img src={fish[value].img} alt={''} className="itico" title={value} /></i>
                  </span>) : ("")
                ))}</td> : null}
              {xListeColFish[5][1] === 1 ? <td className="tdcenter">{iQuant}</td> : null}
              {xListeColFish[6][1] === 1 ? <td className="tdcenter">{icaught}</td> : null}
              {xListeColFish[7][1] === 1 ? <td className="tdcenter">
                {xChums.map((value, index) => {
                  if (value !== "") { return (<span key={index}><i><img src={xChumsImg[index]} alt={''} className="itico" title={value} /></i></span>) }
                  return null;
                })}</td> : null}
              {xListeColFish[8][1] === 1 ? <td className="tdcenter">
                {iperiod.map((value, index) => {
                  if (value !== "") { return (<span key={index}><i>{iperiod[index]}</i></span>) }
                  return null;
                })}</td> : null}
              {xListeColFish[9][1] === 1 ? <td className="tdcenter">{iprct}</td> : null}
              {xListeColFish[10][1] === 1 ? <td className="tdcenter">{isNaN(ixp) ? "" : parseFloat(ixp).toFixed(1)}</td> : null}
              {xListeColFish[11][1] === 1 ? <td className="tdcenter">{parseFloat(xCost).toFixed(3)}</td> : null}
              {xListeColFish[12][1] === 1 ? <td className="tdcenter">{isNaN(parseFloat(ixpsfl).toFixed(1)) ? "" : parseFloat(ixpsfl).toFixed(1)}</td> : null}
            </tr>
          );
        }
      });
      const tableContent = (
        <>
          <table className="table">
            <thead>
              <tr>
                {xListeColFish[0][1] === 1 ? <th className="thcenter" >Category</th> : null}
                {xListeColFish[1][1] === 1 ? <th className="thcenter" >Location</th> : null}
                {xListeColFish[2][1] === 1 ? <th className="thcenter" >Hoard</th> : null}
                <th className="th-icon">   </th>
                {xListeColFish[3][1] === 1 ? <th className="thcenter" >Fish</th> : null}
                {xListeColFish[4][1] === 1 ? <th className="thcenter" >Bait</th> : null}
                {xListeColFish[5][1] === 1 ? <th className="thcenter" >Quantity</th> : null}
                {xListeColFish[6][1] === 1 ? <th className="thcenter" >Caught</th> : null}
                {xListeColFish[7][1] === 1 ? <th className="thcenter" >Chum</th> : null}
                {xListeColFish[8][1] === 1 ? <th className="thcenter" >Period</th> : null}
                {xListeColFish[9][1] === 1 ? <th className="thcenter" > % </th> : null}
                {xListeColFish[10][1] === 1 ? <th className="thcenter" >
                  <div className="selectquantback" style={{ top: `4px` }}><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                    <InputLabel>XP</InputLabel>
                    <Select value={selectedQuantFish} onChange={handleChangeQuantFish}>
                      <MenuItem value="unit">/ Unit</MenuItem>
                      <MenuItem value="quant">x Quantity</MenuItem>
                    </Select></FormControl></div></th> : null}
                {xListeColFish[11][1] === 1 ? <th className="thcenter" >Cost</th> : null}
                {xListeColFish[12][1] === 1 ? <th className="thcenter" >XP/SFL</th> : null}
              </tr>
              <tr key="total">
                {xListeColFish[0][1] === 1 ? <td className="tdcenter">Total</td> : null}
                {xListeColFish[1][1] === 1 ? <td className="tdcenter"></td> : null}
                {xListeColFish[2][1] === 1 ? <td className="tditem"></td> : null}
                <td></td>
                {xListeColFish[3][1] === 1 ? <td className="tditem"></td> : null}
                {xListeColFish[4][1] === 1 ? <td className="tdcenter">{earthwormquant}{earthwormbait}{grubquant}{grubbait}{redwigglerquant}{redwigglerbait}</td> : null}
                {xListeColFish[5][1] === 1 ? <td className="tdcenter"></td> : null}
                {xListeColFish[6][1] === 1 ? <td className="tdcenter">{totCaught}</td> : null}
                {xListeColFish[7][1] === 1 ? <td className="tdcenter"></td> : null}
                {xListeColFish[8][1] === 1 ? <td className="tdcenter"></td> : null}
                {xListeColFish[9][1] === 1 ? <td className="tdcenter"></td> : null}
                {xListeColFish[10][1] === 1 ? <td className="tdcenter">{(selectedQuantFish !== "unit") ? parseFloat(totXPfsh).toFixed(1) : ""}</td> : null}
                {xListeColFish[11][1] === 1 ? <td className="tdcenter">{(selectedQuantFish !== "unit") ? parseFloat(totCost).toFixed(1) : ""}</td> : null}
                {xListeColFish[12][1] === 1 ? <td className="tdcenter"></td> : null}
              </tr>
            </thead>
            <tbody>
              {inventoryItems}
            </tbody>
          </table>
        </>
      );
      setfishData(tableContent);
      setMutants(mutantchickens);
      setsTickets(sTickets);
    }
  }

  function setExpand() {
    if (farmData.inventory) {
      //const expEntries = Object.entries(expand);
      //const expKeys = Object.keys(expand);
      const expKeys = Object.keys(fromtoexpand.expandData);
      var i = 0;
      const imgcropnode = <img src={imgcrop} alt={''} className="nodico" title="Crop Node" />;
      const imgfruitnode = <img src="./icon/res/apple_tree.png" alt={''} className="nodico" title="Fruit Patch" />;
      const imgwoodnode = <img src={imgwood} alt={''} className="nodico" title="Tree" />;
      const imgstonenode = <img src={imgstone} alt={''} className="nodico" title="Stone Node" />;
      const imgironnode = <img src="./icon/res/iron_small.png" alt={''} className="nodico" title="Iron Node" />;
      const imggoldnode = <img src="./icon/res/gold_small.png" alt={''} className="nodico" title="Gold Node" />;
      const imgcrimstonenode = <img src="./icon/res/crimstone_rock_5.webp" alt={''} className="nodico" title="Crimstone Node" />;
      const imgsunstonenode = <img src="./icon/res/sunstone_rock_1.webp" alt={''} className="nodico" title="Sunstone Node" />;
      const imgoilnode = <img src="./icon/res/oil.webp" alt={''} className="nodico" title="Oil Node" />;
      const imglavapitnode = <img src="./icon/res/lava_pit.webp" alt={''} className="nodico" title="Lavapit Node" />;
      const imgbeehivenode = <img src="./icon/res/beehive.webp" alt={''} className="itico" title="Beehive" />;
      const imgwoodres = <img src="./icon/res/wood.png" alt={''} className="itico" title="Wood" />;
      const imgstoneres = <img src="./icon/res/stone.png" alt={''} className="itico" title="Stone" />;
      const imgironres = <img src="./icon/res/iron_ore.png" alt={''} className="itico" title="Iron" />;
      const imggoldres = <img src="./icon/res/gold_ore.png" alt={''} className="itico" title="Gold" />;
      const imgcrimstoneres = <img src="./icon/res/crimstone.png" alt={''} className="itico" title="Crimstone" />;
      const imgoilres = <img src="./icon/res/oil.webp" alt={''} className="itico" title="Oil" />;
      const imgobsidianres = <img src="./icon/res/obsidian.webp" alt={''} className="itico" title="Obsidian" />;
      const imgbbres = <img src="./icon/res/gem.webp" alt={''} className="itico" title="Block Buck" />;
      const imgcoinres = <img src="./icon/res/coins.png" alt={''} className="itico" title="Coins" />;
      const itotTime = fromtoexpand.expand.totalTime / (60 * 60 * 24);
      const totTime = convTime(itotTime);
      const imglvl = './icon/ui/confirm.png';
      const tableContent = expKeys.map(([element]) => {
        i++;
        //const indx = Number(element);
        //const cobj = expand[i];
        const cobj = fromtoexpand.expandData[i];
        const resBB = cobj.resources ? cobj.resources["Block Buck"] : "";
        const resCoins = cobj.resources ? cobj.resources.Coins : "";
        const resWood = cobj.resources ? cobj.resources.Wood || "" : "";
        const resStone = cobj.resources ? cobj.resources.Stone || "" : "";
        const resIron = cobj.resources ? cobj.resources.Iron || "" : "";
        const resGold = cobj.resources ? cobj.resources.Gold || "" : "";
        const resCrimstone = cobj.resources ? cobj.resources.Crimstone ? cobj.resources.Crimstone || "" : "" : "";
        const resOil = cobj.resources ? cobj.resources.Oil ? cobj.resources.Oil || "" : "" : "";
        const resObsidian = cobj.resources ? cobj.resources.Obsidian ? cobj.resources.Obsidian || "" : "" : "";
        const nodCrop = cobj.nodes ? cobj.nodes.Crop || "" : "";
        const nodFruit = cobj.nodes ? cobj.nodes.Fruit || "" : "";
        const nodTree = cobj.nodes ? cobj.nodes.Wood || "" : "";
        const nodStone = cobj.nodes ? cobj.nodes.Stone || "" : "";
        const nodIron = cobj.nodes ? cobj.nodes.Iron || "" : "";
        const nodGold = cobj.nodes ? cobj.nodes.Gold || "" : "";
        const nodCrimstone = cobj.nodes ? cobj.nodes.Crimstone ? cobj.nodes.Crimstone || "" : "" : "";
        const nodSunstone = cobj.nodes ? cobj.nodes.Sunstone ? cobj.nodes.Sunstone || "" : "" : "";
        const nodBeehive = cobj.nodes ? cobj.nodes.Beehive ? cobj.nodes.Beehive || "" : "" : "";
        const nodOil = cobj.nodes ? cobj.nodes.Oil ? cobj.nodes.Oil || "" : "" : "";
        const nodLavapit = cobj.nodes ? cobj.nodes.Lavapit ? cobj.nodes.Lavapit || "" : "" : "";
        const itime = cobj.seconds ? cobj.seconds / (60 * 60 * 24) : 0;
        const time = convTime(itime);
        const level = cobj.bumpkinLevel || "";
        const imglvlfarm = xexpandData.current === i ? <img src={imglvl} alt={''} className="itico" title="Your lvl" /> : "";
        const indexrow = i;
        return (
          <tr key={indexrow}>
            {xListeColExpand[0][1] === 1 ? <td className="tdcenter">{i}</td> : null}
            {xListeColExpand[1][1] === 1 ? <td className="tdcenter">{level}</td> : null}
            <td className="tdcenter">{imglvlfarm}</td>
            {xListeColExpand[2][1] === 1 ? <td className="tdcenter">
              <input type="radio" name="fromOption" className="round-checkbox" checked={fromexpand === indexrow} onChange={() => handleFromExpandChange(indexrow)} /></td> : null}
            {xListeColExpand[2][1] === 1 ? <td className="tdcenter">
              <input type="radio" name="toOption" className="round-checkbox" checked={toexpand === indexrow} onChange={() => handleToExpandChange(indexrow)} /></td> : null}
            {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{nodCrop}</td> : null}
            {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{nodFruit}</td> : null}
            {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{nodTree}</td> : null}
            {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{nodStone}</td> : null}
            {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{nodIron}</td> : null}
            {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{nodGold}</td> : null}
            {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{nodCrimstone}</td> : null}
            {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{nodSunstone}</td> : null}
            {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{nodBeehive}</td> : null}
            {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{nodOil}</td> : null}
            {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{nodLavapit}</td> : null}
            {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{time}</td> : null}
            {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{resWood}</td> : null}
            {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{resStone}</td> : null}
            {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{resIron}</td> : null}
            {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{resGold}</td> : null}
            {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{resCrimstone}</td> : null}
            {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{resOil}</td> : null}
            {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{resObsidian}</td> : null}
            {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{resBB}</td> : null}
            {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{resCoins}</td> : null}
          </tr>
        );
      });
      const tableHeader = (
        <thead>
          <tr>
            {xListeColExpand[0][1] === 1 ? <th className="th-icon">
              <div className="selectquantback" style={{ top: `4px` }}><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                <InputLabel>LVL</InputLabel>
                <Select value={selectedExpandType} onChange={handleChangeExpandType}>
                  <MenuItem value="basic">Basic</MenuItem>
                  <MenuItem value="spring">Spring</MenuItem>
                  <MenuItem value="desert">Desert</MenuItem>
                  <MenuItem value="volcano">Volcan</MenuItem>
                </Select></FormControl></div></th> : null}
            {xListeColExpand[1][1] === 1 ? <th className="thcenter">Bumpkin</th> : null}
            <th className="tdcenter">Farm</th>
            {xListeColExpand[2][1] === 1 ? <th className="thcenter">From</th> : null}
            {xListeColExpand[2][1] === 1 ? <th className="thcenter">To</th> : null}
            {xListeColExpand[3][1] === 1 ? <th className="thcenter">{imgcropnode}</th> : null}
            {xListeColExpand[3][1] === 1 ? <th className="thcenter">{imgfruitnode}</th> : null}
            {xListeColExpand[3][1] === 1 ? <th className="thcenter">{imgwoodnode}</th> : null}
            {xListeColExpand[3][1] === 1 ? <th className="thcenter">{imgstonenode}</th> : null}
            {xListeColExpand[3][1] === 1 ? <th className="thcenter">{imgironnode}</th> : null}
            {xListeColExpand[3][1] === 1 ? <th className="thcenter">{imggoldnode}</th> : null}
            {xListeColExpand[3][1] === 1 ? <th className="thcenter">{imgcrimstonenode}</th> : null}
            {xListeColExpand[3][1] === 1 ? <th className="thcenter">{imgsunstonenode}</th> : null}
            {xListeColExpand[3][1] === 1 ? <th className="thcenter">{imgbeehivenode}</th> : null}
            {xListeColExpand[3][1] === 1 ? <th className="thcenter">{imgoilnode}</th> : null}
            {xListeColExpand[3][1] === 1 ? <th className="thcenter">{imglavapitnode}</th> : null}
            {xListeColExpand[3][1] === 1 ? <th className="thcenter">Time</th> : null}
            {xListeColExpand[4][1] === 1 ? <th className="thcenter">{imgwoodres}</th> : null}
            {xListeColExpand[4][1] === 1 ? <th className="thcenter">{imgstoneres}</th> : null}
            {xListeColExpand[4][1] === 1 ? <th className="thcenter">{imgironres}</th> : null}
            {xListeColExpand[4][1] === 1 ? <th className="thcenter">{imggoldres}</th> : null}
            {xListeColExpand[4][1] === 1 ? <th className="thcenter">{imgcrimstoneres}</th> : null}
            {xListeColExpand[4][1] === 1 ? <th className="thcenter">{imgoilres}</th> : null}
            {xListeColExpand[4][1] === 1 ? <th className="thcenter">{imgobsidianres}</th> : null}
            {xListeColExpand[4][1] === 1 ? <th className="thcenter">{imgbbres}</th> : null}
            {xListeColExpand[4][1] === 1 ? <th className="thcenter">{imgcoinres}</th> : null}
          </tr>
          <tr>
            {xListeColExpand[0][1] === 1 ? <td className="tdcenter">TOTAL</td> : null}
            {xListeColExpand[1][1] === 1 ? <td className="tdcenter"></td> : null}
            <td className="tdcenter"></td>
            {xListeColExpand[2][1] === 1 ? <td className="tdcenter"></td> : null}
            {xListeColExpand[2][1] === 1 ? <td className="tdcenter"></td> : null}
            {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalNodes.Crop}</td> : null}
            {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalNodes.Fruit}</td> : null}
            {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalNodes.Wood}</td> : null}
            {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalNodes.Stone}</td> : null}
            {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalNodes.Iron}</td> : null}
            {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalNodes.Gold}</td> : null}
            {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalNodes.Crimstone}</td> : null}
            {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalNodes.Sunstone}</td> : null}
            {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalNodes.Beehive}</td> : null}
            {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalNodes.Oil}</td> : null}
            {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalNodes.Lavapit}</td> : null}
            {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{totTime}</td> : null}
            {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalResources.Wood}</td> : null}
            {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalResources.Stone}</td> : null}
            {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalResources.Iron}</td> : null}
            {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalResources.Gold}</td> : null}
            {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalResources.Crimstone}</td> : null}
            {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalResources.Oil}</td> : null}
            {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalResources.Obsidian}</td> : null}
            {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalResources["Block Buck"]}</td> : null}
            {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalResources.Coins}</td> : null}
          </tr>
        </thead>
      );
      const table = (
        <>
          <table className="table">
            {tableHeader}
            <tbody>
              {tableContent}
            </tbody>
          </table>
        </>
      );

      setexpandData(table);
      setMutants(mutantchickens);
      setsTickets(sTickets);
    }
  }

  function setFlower() {
    if (farmData.inventory) {
      const flwrKeys = Object.keys(flower);
      const tableContent = flwrKeys.map(element => {
        const cobj = flower[element];
        const flName = element;
        const ico = <img src={cobj.img} alt={''} className="nodico" title={flName} />;
        const seed = cobj.cat && cobj.cat;
        const ibreed = cobj ? cobj.breed : '';
        const ibreedimgs = cobj ? cobj.breedimgs : '';
        const xBreeds = ibreed.split("*");
        const xBreedsImg = ibreedimgs.split("*");
        const iquant = cobj.quant > 0 ? cobj.quant : '';
        const ihrvstd = cobj.harvested > 0 ? cobj.harvested : '';
        let growingQuant = 0;
        let nBeds = 0;
        for (let key in it["Flower"].beds) {
          const nKey = Number(key);
          if (it["Flower"].beds[nKey].name === flName) { growingQuant += it["Flower"].beds[nKey].quant };
          nBeds++;
        }
        return (
          <tr>
            {xListeColFlower[0][1] === 1 ? <td className="tdcenter">{seed}</td> : null}
            <td id="iccolumn">{ico}</td>
            {xListeColFlower[1][1] === 1 ? <td className="tditem">{flName}</td> : null}
            {xListeColFlower[2][1] === 1 ? <td className="tdcenter">
              {xBreeds.map((value, index) => {
                if (value !== "") { return (<span key={index}><i><img src={xBreedsImg[index]} alt={''} className="itico" title={value} /></i></span>) }
                return null;
              })}</td> : null}
            {xListeColFlower[3][1] === 1 ? <td className="tdcenter">{iquant}</td> : null}
            {xListeColFlower[4][1] === 1 ? <td className="tdcenter">{ihrvstd}</td> : null}
            {xListeColFlower[4][1] === 1 ? <td className="tdcenter">{growingQuant > 0 ? growingQuant : ""}</td> : null}
          </tr>
        );
      });
      const tableHeader = (
        <thead>
          <tr>
            {xListeColFlower[0][1] === 1 ? <th className="thcenter">Seed</th> : null}
            <th className="th-icon"></th>
            {xListeColFlower[1][1] === 1 ? <th className="thcenter">Name</th> : null}
            {xListeColFlower[2][1] === 1 ? <th className="thcenter">Breed</th> : null}
            {xListeColFlower[3][1] === 1 ? <th className="thcenter">Quant</th> : null}
            {xListeColFlower[4][1] === 1 ? <th className="thcenter">Hrvst</th> : null}
            {xListeColFlower[4][1] === 1 ? <th className="thcenter">Grow</th> : null}
          </tr>
          <tr>
            {xListeColFlower[0][1] === 1 ? <td className="tdcenter">TOTAL</td> : null}
            <td></td>
            {xListeColFlower[1][1] === 1 ? <td className="tdcenter"></td> : null}
            {xListeColFlower[2][1] === 1 ? <td className="tdcenter"></td> : null}
            {xListeColFlower[3][1] === 1 ? <td className="tdcenter"></td> : null}
            {xListeColFlower[4][1] === 1 ? <td className="tdcenter"></td> : null}
            {xListeColFlower[4][1] === 1 ? <td className="tdcenter"></td> : null}
          </tr>
        </thead>
      );

      const table = (
        <>
          <table className="table">
            {tableHeader}
            <tbody>
              {tableContent}
            </tbody>
          </table>
        </>
      );

      setflowerData(table);
      setMutants(mutantchickens);
      setsTickets(sTickets);
    }
  }

  function setBounty() {
    if (farmData.inventory) {
      const bountyKeys = Object.keys(bounty);
      let valueTotal = 0;
      let vTodayTotal = 0;
      let toolcostTodayTotal = 0;
      let dugTotal = 0;
      const tableContent = bountyKeys.map(element => {
        const cobj = bounty[element];
        const bntName = element;
        const ico = <img src={cobj.img} alt={''} className="nodico" title={bntName} />;
        const stock = cobj.stock > 0 ? cobj.stock : '';
        const icost = TryChecked ? cobj.costtry : cobj.cost;
        const value = (icost > 0 && !it[bntName]) ? parseFloat((icost * stock) / coinsRatio).toFixed(3) : '';
        const qtoday = cobj.qtoday > 0 ? cobj.qtoday : '';
        const ivtoday = TryChecked ? cobj.vtodaytry : cobj.vtoday;
        const valuetoday = ivtoday > 0 ? parseFloat(ivtoday / coinsRatio).toFixed(3) : '';
        const itoolctoday = TryChecked ? cobj.toolctodaytry : cobj.toolctoday;
        const toolcostToday = itoolctoday > 0 ? parseFloat(itoolctoday / coinsRatio).toFixed(3) : '';
        valueTotal += Number(value);
        vTodayTotal += Number(valuetoday);
        toolcostTodayTotal += Number(toolcostToday);
        return (
          <tr>
            <td id="iccolumn">{ico}</td>
            {xListeColBounty[0][1] === 1 ? <td className="tditem">{bntName}</td> : null}
            {xListeColBounty[1][1] === 1 ? <td className="tdcenter">{stock}</td> : null}
            {xListeColBounty[2][1] === 1 ? <td className="tdcenter">{value}</td> : null}
            {xListeColBounty[3][1] === 1 ? <td className="tdcenter">{qtoday > 0 ? qtoday : ""}</td> : null}
            {xListeColBounty[4][1] === 1 ? <td className="tdcenter">{valuetoday > 0 ? valuetoday : ""}</td> : null}
            {xListeColBounty[5][1] === 1 ? <td className="tdcenter">{toolcostToday > 0 ? toolcostToday : ""}</td> : null}
          </tr>
        );
      });
      const tableHeader = (
        <thead>
          <tr>
            <th className="th-icon"></th>
            {xListeColBounty[0][1] === 1 ? <th className="thcenter">Name</th> : null}
            {xListeColBounty[1][1] === 1 ? <th className="thcenter">Stock</th> : null}
            {xListeColBounty[2][1] === 1 ? <th className="thcenter">Value</th> : null}
            {xListeColBounty[3][1] === 1 ? <th className="thcenter">Today</th> : null}
            {xListeColBounty[4][1] === 1 ? <th className="thcenter">Value</th> : null}
            {xListeColBounty[5][1] === 1 ? <th className="thcenter">Tool cost</th> : null}
          </tr>
          <tr>
            <td></td>
            {xListeColBounty[0][1] === 1 ? <td className="tdcenter"></td> : null}
            {xListeColBounty[1][1] === 1 ? <td className="tdcenter"></td> : null}
            {xListeColBounty[2][1] === 1 ? <td className="tdcenter">{parseFloat(valueTotal).toFixed(3)}</td> : null}
            {xListeColBounty[3][1] === 1 ? <td className="tdcenter"></td> : null}
            {xListeColBounty[4][1] === 1 ? <td className="tdcenter">{parseFloat(vTodayTotal).toFixed(3)}</td> : null}
            {xListeColBounty[5][1] === 1 ? <td className="tdcenter">{parseFloat(toolcostTodayTotal).toFixed(3)}</td> : null}
          </tr>
        </thead>
      );

      const table = (
        <>
          <table className="table">
            {tableHeader}
            <tbody>
              {tableContent}
            </tbody>
          </table>
        </>
      );

      setbountyData(table);
      setMutants(mutantchickens);
      setsTickets(sTickets);
    }
  }

  function setAnimals() {
    if (Animals) {
      let table = [];
      const imgmix = "./icon/res/mixed_grain_v2.webp";
      const ximgmix = <img src={"./icon/res/mixed_grain_v2.webp"} alt={''} className="itico" title={"Food"} />;
      const imgomni = <img src={"./icon/res/omnifeed.webp"} alt={''} className="itico" title={"Corn"} />;
      const imgcorn = <img src={it["Corn"].img} alt={''} className="itico" title={"Corn"} />;
      const imgwheat = <img src={it["Wheat"].img} alt={''} className="itico" title={"Wheat"} />;
      const imgbarley = <img src={it["Barley"].img} alt={''} className="itico" title={"Barley"} />;
      const imgkale = <img src={it["Kale"].img} alt={''} className="itico" title={"Kale"} />;
      const imgtrade = <img src={imgexchng} alt={''} className="itico" title={"Marketplace price"} />;
      const ximgsfl = <img src={imgsfl} alt={''} className="itico" title={"SFL"} />;
      for (let key in Animals) {
        const animalKeys = Object.values(Animals[key]);
        let prod1Total = 0;
        let prod2Total = 0;
        let foodTotal = {};
        foodTotal.corn = 0;
        foodTotal.wheat = 0;
        foodTotal.barley = 0;
        foodTotal.kale = 0;
        foodTotal.omni = 0;
        let prod1costTotal = 0;
        let prod2costTotal = 0;
        let foodcostTotal = 0;
        let foodcostp2pTotal = 0;
        //let love1Total = 0;
        //let love2Total = 0;
        const itemName = key;
        const tableContent = animalKeys.map(element => {
          const cobj = element;
          const itemImg = (itemName === "Chicken") ? imgchkn : (itemName === "Cow") ? imgcow : (itemName === "Sheep") ? imgsheep : imgna;
          const ico = <img src={itemImg} alt={''} className="itico" title={itemName} />;
          const xlvl = cobj.lvl > 0 ? cobj.lvl : '';
          const food = Number(parseFloat(!TryChecked ? cobj.quantfood : cobj.quantfoodtry).toFixed(2));
          const foodname = !TryChecked ? cobj.food : cobj.foodtry;
          const xfoodimg = it[foodname] ? it[foodname].img : foodname === "Mix" ? imgmix : imgna;
          const foodimg = <img src={xfoodimg} alt={''} className="itico" title={foodname} />;
          const foodcost = frmtNb((!TryChecked ? cobj.costFood : cobj.costFoodtry) / coinsRatio) || 0;
          const foodcostp2p = frmtNb(!TryChecked ? cobj.costFoodp2p : cobj.costFoodp2ptry) || 0;
          const prod1 = Number(parseFloat(!TryChecked ? cobj.yield1 : cobj.yield1try).toFixed(2)) || 0;
          const prod1name = (itemName === "Chicken") ? "Egg" : (itemName === "Cow") ? "Milk" : (itemName === "Sheep") ? "Wool" : "";
          const xprod1img = it[prod1name].img || imgna;
          const prod1img = <img src={xprod1img} alt={''} className="itico" title={prod1name} />;
          const prod1cost = frmtNb((!TryChecked ? cobj.costyield1 : cobj.costyield1try) / coinsRatio) || 0;
          const prod1costp2p = it[prod1name].costp2pt || 0;
          const prod2 = Number(parseFloat(cobj.yield2).toFixed(2)) || 0;
          const prod2name = (itemName === "Chicken") ? "Feather" : (itemName === "Cow") ? "Leather" : (itemName === "Sheep") ? "Merino Wool" : "";;
          const xprod2img = it[prod2name].img || imgna;
          const prod2img = <img src={xprod2img} alt={''} className="itico" title={prod2name} />;
          const prod2cost = frmtNb((!TryChecked ? cobj.costyield2 : cobj.costyield2try) / coinsRatio) || 0;
          const prod2costp2p = it[prod2name].costp2pt || 0;
          const prod1costuwithfoodp2p = frmtNb(foodcostp2p / prod1);
          const coefprod1p2p = frmtNb(prod1costp2p / prod1cost);
          const coefprod1costuwithfoodp2p = frmtNb(prod1costp2p / prod1costuwithfoodp2p);
          const prod2costuwithfoodp2p = frmtNb(foodcostp2p / prod2);
          const coefprod2p2p = frmtNb(prod2costp2p / prod2cost);
          const coefprod2costuwithfoodp2p = frmtNb(prod2costp2p / prod2costuwithfoodp2p);
          const color1 = ColorValue(coefprod1p2p);
          const color1costufoodp2p = ColorValue(coefprod1costuwithfoodp2p);
          const color2 = ColorValue(coefprod2p2p);
          const color2costufoodp2p = ColorValue(coefprod2costuwithfoodp2p);
          const cellStyle = {};
          //const love1 = 0;
          //const love2 = 0;
          prod1Total += Number(prod1);
          prod2Total += Number(prod2);
          foodTotal.corn += (foodname === "Corn") ? food : 0;
          foodTotal.wheat += (foodname === "Wheat") ? food : 0;
          foodTotal.barley += (foodname === "Barley") ? food : 0;
          foodTotal.kale += (foodname === "Kale") ? food : 0;
          foodTotal.omni += (foodname === "Omni") ? food : 0;
          if (foodname === "Mix") {
            foodTotal.corn += food;
            foodTotal.wheat += food;
            foodTotal.barley += food;
          }
          prod1costTotal += Number(prod1cost);
          prod2costTotal += Number(prod2cost);
          foodcostTotal += Number(foodcost);
          foodcostp2pTotal += Number(foodcostp2p);
          //love1Total += Number(love1);
          //love2Total += Number(love2);
          return (
            <tr>
              <td id="iccolumn">{ico}</td>
              {xListeColAnimals[0][1] === 1 ? <td className="tditem">{itemName}</td> : null}
              {xListeColAnimals[1][1] === 1 ? <td className="tdcenter">{xlvl}</td> : null}
              {xListeColAnimals[2][1] === 1 ? <td className="tdcenter">{prod1 > 0 && prod1}{prod1 > 0 && prod1img}</td> : null}
              {xListeColAnimals[3][1] === 1 ? <td className="tdcenter">{prod2 > 0 && prod2}{prod2 > 0 && prod2img}</td> : null}
              {xListeColAnimals[4][1] === 1 ? <td className="tdcenter">{food}{foodimg}</td> : null}
              {xListeColAnimals[5][1] === 1 ? <td className="tdcenter">{foodcost}</td> : null}
              {xListeColAnimals[6][1] === 1 ? <td className="tdcenter">{foodcostp2p}</td> : null}
              {xListeColAnimals[7][1] === 1 ? <td className="tdcenter">{prod1cost}</td> : null}
              {xListeColAnimals[8][1] === 1 ? (<td style={{ ...cellStyle, color: color1, textAlign: 'center', fontSize: '8px' }}>{coefprod1p2p > 0 ? coefprod1p2p : ""}</td>) : ("")}
              {xListeColAnimals[8][1] === 1 ? <td className="tdcenter">{prod1costuwithfoodp2p}</td> : null}
              {xListeColAnimals[8][1] === 1 ? (<td style={{ ...cellStyle, color: color1costufoodp2p, textAlign: 'center', fontSize: '8px' }}>{coefprod1costuwithfoodp2p > 0 ? coefprod1costuwithfoodp2p : ""}</td>) : ("")}
              {xListeColAnimals[8][1] === 1 ? <td className="tdcenter">{prod1costp2p}</td> : null}
              {xListeColAnimals[9][1] === 1 ? <td className="tdcenter">{prod2cost}</td> : null}
              {xListeColAnimals[10][1] === 1 ? (<td style={{ ...cellStyle, color: color2, textAlign: 'center', fontSize: '8px' }}>{coefprod2p2p > 0 ? coefprod2p2p : ""}</td>) : ("")}
              {xListeColAnimals[10][1] === 1 ? <td className="tdcenter">{prod2costuwithfoodp2p}</td> : null}
              {xListeColAnimals[10][1] === 1 ? (<td style={{ ...cellStyle, color: color2costufoodp2p, textAlign: 'center', fontSize: '8px' }}>{coefprod2costuwithfoodp2p > 0 ? coefprod2costuwithfoodp2p : ""}</td>) : ("")}
              {xListeColAnimals[10][1] === 1 ? <td className="tdcenter">{prod2costp2p}</td> : null}
            </tr>
          );
        });
        const tableHeader = (
          <thead>
            <tr>
              <th className="th-icon"></th>
              {xListeColAnimals[0][1] === 1 ? <th className="thcenter">Name</th> : null}
              {xListeColAnimals[1][1] === 1 ? <th className="thcenter">LVL</th> : null}
              {xListeColAnimals[2][1] === 1 ? <th className="thcenter">Prod1</th> : null}
              {xListeColAnimals[3][1] === 1 ? <th className="thcenter">Prod2</th> : null}
              {xListeColAnimals[4][1] === 1 ? <th className="thcenter">Food</th> : null}
              {xListeColAnimals[5][1] === 1 ? <th className="thcenter">Food cost</th> : null}
              {xListeColAnimals[6][1] === 1 ? <th className="thcenter">{imgtrade}</th> : null}
              {xListeColAnimals[7][1] === 1 ? <th className="thcenter" title="Prod cost per unit">Prod1 cost/u</th> : null}
              {xListeColAnimals[8][1] === 1 ? <th className="thcenter" title="Coef market / production"> % </th> : null}
              {xListeColAnimals[8][1] === 1 ? <th className="thcenter" title="Prod cost per unit buying food at market">{ximgmix}{imgtrade}</th> : null}
              {xListeColAnimals[8][1] === 1 ? <th className="thcenter" title="Coef market / production buying food comp at p2p"> % </th> : null}
              {xListeColAnimals[8][1] === 1 ? <th className="thcenter" title="Market price per unit">{imgtrade}</th> : null}
              {xListeColAnimals[9][1] === 1 ? <th className="thcenter" title="Prod cost per unit">Prod2 cost/u</th> : null}
              {xListeColAnimals[10][1] === 1 ? <th className="thcenter" title="Coef market / production"> % </th> : null}
              {xListeColAnimals[10][1] === 1 ? <th className="thcenter" title="Prod cost per unit buying food at market">{ximgmix}{imgtrade}</th> : null}
              {xListeColAnimals[10][1] === 1 ? <th className="thcenter" title="Coef market / production buying food comp at p2p"> % </th> : null}
              {xListeColAnimals[10][1] === 1 ? <th className="thcenter" title="Market price per unit">{imgtrade}</th> : null}
            </tr>
            <tr>
              <td></td>
              {xListeColAnimals[0][1] === 1 ? <td className="tdcenter"></td> : null}
              {xListeColAnimals[1][1] === 1 ? <td className="tdcenter"></td> : null}
              {xListeColAnimals[2][1] === 1 ? <td className="tdcenter">{parseFloat(prod1Total).toFixed(2)}</td> : null}
              {xListeColAnimals[3][1] === 1 ? <td className="tdcenter">{parseFloat(prod2Total).toFixed(2)}</td> : null}
              {xListeColAnimals[4][1] === 1 ? <td className="tdcenter">
                {foodTotal.corn > 0 && parseFloat(foodTotal.corn).toFixed(2)}{foodTotal.corn > 0 && imgcorn}
                {foodTotal.wheat > 0 && parseFloat(foodTotal.wheat).toFixed(2)}{foodTotal.wheat > 0 && imgwheat}
                {foodTotal.barley > 0 && parseFloat(foodTotal.barley).toFixed(2)}{foodTotal.barley > 0 && imgbarley}
                {foodTotal.kale > 0 && parseFloat(foodTotal.kale).toFixed(2)}{foodTotal.kale > 0 && imgkale}
                {foodTotal.omni > 0 && parseFloat(foodTotal.omni).toFixed(2)}{foodTotal.omni > 0 && imgomni}
              </td> : null}
              {xListeColAnimals[5][1] === 1 ? <td className="tdcenter">{parseFloat(foodcostTotal).toFixed(3)}{ximgsfl}</td> : null}
              {xListeColAnimals[6][1] === 1 ? <td className="tdcenter">{parseFloat(foodcostp2pTotal).toFixed(3)}{ximgsfl}</td> : null}
              {xListeColAnimals[7][1] === 1 ? <td className="tdcenter"></td> : null}
              {xListeColAnimals[8][1] === 1 ? <td className="tdcenter"></td> : null}
              {xListeColAnimals[8][1] === 1 ? <td className="tdcenter"></td> : null}
              {xListeColAnimals[8][1] === 1 ? <td className="tdcenter"></td> : null}
              {xListeColAnimals[8][1] === 1 ? <td className="tdcenter"></td> : null}
              {xListeColAnimals[9][1] === 1 ? <td className="tdcenter"></td> : null}
              {xListeColAnimals[10][1] === 1 ? <td className="tdcenter"></td> : null}
              {xListeColAnimals[10][1] === 1 ? <td className="tdcenter"></td> : null}
              {xListeColAnimals[10][1] === 1 ? <td className="tdcenter"></td> : null}
              {xListeColAnimals[10][1] === 1 ? <td className="tdcenter"></td> : null}
            </tr>
          </thead>
        );
        table.push(
          <>
            <table className="table">
              {tableHeader}
              <tbody>
                {tableContent}
              </tbody>
            </table>
          </>
        );
      }

      setanimalData(table);
      setMutants(mutantchickens);
      setsTickets(sTickets);
    }
  }

  function setMap() {
    if (isleMap) {
      let minYield = 500;
      let minYieldGH = 500;
      let cropMachineDone = false;
      let greenhouseDone = false;
      const isGA = nftw["Green Amulet"].isactive;
      const imgcropmachine = "./icon/building/stage1_collector_empty.webp";
      const imggreenhouse = "./icon/building/greenhouse.webp";
      const imgbee = <img src="./icon/ui/bee.webp" alt={''} title="Bee swarm" style={{ position: 'absolute', transform: 'translate(20%, -110%)', width: '14px', height: '14px' }} />;
      const minX = Math.min(...Object.keys(isleMap).map(x => parseInt(x)));
      const minY = Math.min(...Object.values(isleMap).flatMap(row => Object.keys(row).map(y => parseInt(y))));
      const maxX = Math.max(...Object.keys(isleMap).map(x => parseInt(x)));
      const maxY = Math.max(...Object.values(isleMap).flatMap(row => Object.keys(row).map(y => parseInt(y))));
      const adjustedIsleMap = Array.from({ length: maxX - minX + 1 }, () => ({}));
      let rdyAtValues = [];
      let lastCropMachineX = -1;
      let lastCropMachineY = -1;
      let lastGreenhouseX = -1;
      let lastGreenhouseY = -1;
      let greenprocIndices = [];
      let lastGreenProc = 0;
      let cropIndexTotal = 0;
      let cropIndex = 0;
      let isLastCrop = false;
      Object.keys(isleMap).forEach(x => {
        const adjustedX = x - minX;
        Object.keys(isleMap[x]).forEach(y => {
          const adjustedY = y - minY;
          adjustedIsleMap[adjustedX][adjustedY] = isleMap[x][y];
          if (isleMap[x][y].type === "crop") {
            minYield = isleMap[x][y].amount < minYield ? isleMap[x][y].amount : minYield;
            rdyAtValues.push(isleMap[x][y].rdyAt);
          }
          if (isleMap[x][y].type === "greenhouse") {
            minYieldGH = isleMap[x][y].amount < minYieldGH ? isleMap[x][y].amount : minYieldGH;
            lastGreenhouseX = adjustedX;
            lastGreenhouseY = adjustedY;
          }
          if (isleMap[x][y].type === "crop machine") {
            lastCropMachineX = adjustedX;
            lastCropMachineY = adjustedY;
          }
        });
      });
      rdyAtValues.sort((a, b) => a - b);
      const rdyAtMap = new Map();
      rdyAtValues.forEach((value, index) => {
        rdyAtMap.set(value, index);
      });
      adjustedIsleMap.forEach((row, x) => {
        Object.keys(row).forEach(y => {
          const item = row[y];
          //console.log(item);
          if ((item.type === "crop") && (item.amount > minYield + 9)) {
            greenprocIndices.push(rdyAtMap.get(item.rdyAt));
          }
        });
      });
      greenprocIndices.sort((a, b) => a - b);
      let rngColor = [];
      let rngColor2 = [];
      let rngColor3 = [];
      let lastStart = 0;
      const previousColors = [];
      function getBackgroundColor(index) {
        let start = 0;
        let end = rdyAtValues.length - 1;
        for (let i = 0; i < greenprocIndices.length; i++) {
          if (index <= greenprocIndices[i]) {
            end = greenprocIndices[i];
            break;
          }
          start = greenprocIndices[i];
          lastStart = start;
        }
        const ratio = (index - start) / (end - start);
        if (!rngColor[end]) {
          let xR, xG, xB, isUnique;
          let min = 0;
          let max = 256;
          do {
            xR = Math.floor(Math.random() * 156) + 100;
            xG = Math.floor(Math.random() * 156) + 100;
            xB = Math.floor(Math.random() * 156) + 100;
            min = Math.min(xR, xG, xB);
            max = Math.max(xR, xG, xB);
            isUnique = (max - min >= 50);
            for (let prev of previousColors.slice(-5)) {
              let diff = Math.abs(prev.xR - xR) + Math.abs(prev.xG - xG) + Math.abs(prev.xB - xB);
              if (diff < 100) {
                isUnique = false;
                break;
              }
            }
          } while (!isUnique);
          rngColor[end] = xR;
          rngColor2[end] = xG;
          rngColor3[end] = xB;
        }
        return `rgba(${rngColor[end]}, ${rngColor2[end]}, ${rngColor3[end]}, ${ratio})`;
      }
      const table = Array.from({ length: maxY - minY + 1 }, () => Array(maxX - minX + 1).fill(null));
      adjustedIsleMap.forEach((row, x) => {
        Object.keys(row).forEach(y => {
          const item = row[y];
          const tableX = parseInt(x);
          const tableY = maxY - minY - parseInt(y);
          const amount = parseFloat(item.amount).toFixed(2 * (item.type !== "crop machine"));
          const Greenproc = (item.type === "crop") && (item.amount > minYield + 9);
          const GreenprocGH = (item.type === "greenhouse") && (item.amount > minYieldGH + 9);
          const colorAmount = (Greenproc || GreenprocGH) ? 'red' : 'white';
          const rdyAtIndex = rdyAtMap.get(item.rdyAt);
          const backColor = (item.type === "crop" && isGA) ? getBackgroundColor(rdyAtIndex) : 'transparent';
          if (Greenproc) {
            lastGreenProc = rdyAtIndex;
          }
          if (item.type === "crop") {
            cropIndexTotal++;
            cropIndex = ((rdyAtIndex + 1) - (lastStart + 1)) + (1 * (rdyAtIndex === 0));
            isLastCrop = (rdyAtIndex === (rdyAtValues.length - 1));
            //cropIndex = rdyAtIndex;
          }
          const typeOrName = item.name ? item.name : item.type;
          const isSwarm = item.swarm && imgbee;
          const toReset = item.reset && item.reset;
          cropMachineDone = (x === lastCropMachineX && y === lastCropMachineY);
          greenhouseDone = (x === lastGreenhouseX && y === lastGreenhouseY);
          //const ximgcropmachine = (item.type === "crop machine" && cropMachineDone === true) ? <img src={imgcropmachine} className="image-overflow" /> : "";
          //const ximggreenhouse = (item.type === "greenhouse" && greenhouseDone === true) ? <img src={imggreenhouse} className="image-overflow" /> : "";
          table[tableY][tableX] = (
            <td key={`${tableX}-${tableY}`} style={{ position: 'relative', backgroundColor: backColor }} title={typeOrName}>
              {/* {ximgcropmachine}
              {ximggreenhouse} */}
              <img src={item.img} style={{ width: '22px', height: '22px' }} />
              <span style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -10%)',
                color: colorAmount,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                padding: '0px 0px',
                borderRadius: '0px',
                fontSize: '11px'
              }}>
                {isSwarm}
                {amount}
              </span>
              <span style={{
                position: 'absolute',
                top: '10%',
                left: '90%',
                transform: 'translate(-50%, -50%)',
                color: 'rgb(45, 252, 55)',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                padding: '0px 0px',
                borderRadius: '0px',
                fontSize: '11px'
              }}>
                {toReset}
                {(item.type === "crop" && isGA === 1 && (Greenproc || isLastCrop)) && cropIndex}
              </span>
              {/* <span style={{
                position: 'absolute',
                top: '0%',
                right: '0%',
                transform: 'translate(-50%, -50%)',
                color: 'rgb(36, 229, 255)',
                padding: '0px 0px',
                borderRadius: '0px',
                fontSize: '11px'
              }}>
                {rdyAtIndex}
                {{x},{y}}
              </span> */}
            </td>
          );
        });
      });

      const tableContent = table.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {row.map((cell, cellIndex) => (
            cell || <td key={`${cellIndex}-${rowIndex}`} />
          ))}
        </tr>
      ));

      const tableElement = (
        <>
          <table class="tablemap">
            <tbody>
              {tableContent}
            </tbody>
          </table>
        </>
      );

      setMapData(tableElement);
      setMutants(mutantchickens);
      setsTickets(sTickets);
    }
  }

  function setfTrades() {
    if (ftrades) {
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
              <td style={{ textAlign: 'center', position: "relative" }}>{<img src={it[name]?.img || nft[name]?.img || nftw[name]?.img || imgna} alt={''} className="itico" title={name} />}{data[index]?.fulfilledAt && imgsold}</td>
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

  function setActivityDay() {
    if (activityData[0]) {
      const actKeys = Object.keys(activityData);
      var totXP = 0;
      var tottktdchest = 0;
      //var tottktcrop = 0;
      var tottktbert = 0;
      //var tottktwactv = 0;
      //var tottkttntcl = 0;
      var totdeliveriestkt = 0;
      var totchorestkt = 0;
      var totmaxtkt = 0;
      var totdeliveriescost = 0;
      var totdeliveriescostp2pt = 0;
      var totdeliveriessfl = 0;
      var totdeliveriescoins = 0;
      const ximgxp = <i><img src={imgxp} alt='' className="resico" title="XP" style={{ width: `20px`, height: `20px` }} /></i>;
      const ximgtkt = <i><img src={imgtkt} alt='' className="itico" title="Tickets" /></i>;
      //const ximgcoins = <i><img src={imgcoins} alt='' className="itico" title="Coins" /></i>;
      const ximgdchest = <i><img src="./icon/ui/synced.gif" alt='' className="itico" title="Tickets from daily chest" style={{ width: `20px`, height: `20px` }} /></i>;
      //const ximgcrop = <i><img src={imgcrop} alt='' className="resico" title="Tickets from crops" style={{ width: `20px`, height: `20px` }} /></i>;
      const ximgbert = <i><img src="./icon/pnj/bert.png" alt='' className="itico" title="Tickets from Bert obsession" /></i>;
      //const ximgwactv = <i><img src={it["Flower"].img} alt='' className="itico" title="Tickets from Weekly activity" /></i>;
      //const ximgtntcl = <i><img src="./icon/fish/tentacle.png" alt='' className="itico" title="Tickets from tentacles" /></i>;
      const imgdeliv = <i><img src="./icon/ui/delivery_board.png" alt='' className="resico" title="Deliveries" /></i>;
      const imgchore = <i><img src="./icon/ui/expression_chat.png" alt='' className="resico" title="Chores" style={{ width: `20px`, height: `20px` }} /></i>;
      //const imgmaxtkt = <i><img src={imgtkt} alt='' className="resico" title="Tickets max by day" /></i>;
      let i = 0;
      const sfs = new Date() - dateSeason;
      const dfs = Math.floor(sfs / (1000 * 60 * 60 * 24));
      const tableContent = actKeys.map(([element]) => {
        const idData = i;
        i++;
        const endDate = new Date(activityData[idData].date);
        //const isSeasonDay = endDate >= dateSeason;
        const isSeasonDay = endDate.setHours(0, 0, 0, 0) >= dateSeason.setHours(0, 0, 0, 0);
        //const curw = ((endDate.getDate()) / 8);
        //const isweeklyactday = Number.isInteger(curw) || (endDate.getDate() === dateSeason.getDate() && endDate.getMonth() === dateSeason.getMonth());
        //const curD = endDate.getDay() === resetDay;
        //const wactdone = isweeklyactday && wklactivity[Math.floor(curw) + 1];
        if (isSeasonDay) {
          const ActTot = setActivityTot(activityData[idData], "day");
          //const allSortedItems = ActTot.allSortedItems;
          //const compoHarvested = ActTot.compoHarvested;
          //const compoHarvestn = ActTot.compoHarvestn;
          //const compoBurn = ActTot.compoBurn;
          const tot = ActTot.tot;
          //const cobj = activityData[idData].data;
          const sday = String(endDate.getDate()).padStart(2, '0');
          const smonth = String(endDate.getMonth() + 1).padStart(2, '0');
          const syear = String(endDate.getFullYear()).slice(-2);
          const sxdate = `${smonth}/${sday}/${syear}`;
          const idate = sxdate
          const itotxp = tot.XP;
          const itktdchest = tot.tktchest;
          //const itktcrop = tot.tktcrop;
          const itktbert = tot.tktbert;
          //const itktwactv = isweeklyactday ? wactdone ? tktWeekly : 0 : 0;
          //const itktbertMax = tot.tktbertMax;
          //const itkttntcl = cobj.tickettentacle ? cobj.tickettentacle : 0; //compoHarvested["Kraken Tenacle"] * 12;
          //const itkttntcl = 0; //compoHarvested["Kraken Tentacle"] ? compoHarvested["Kraken Tentacle"] * 12 : 0;
          const ideliveriestkt = tot.deliveriestkt;
          const ichorestkt = tot.chorestkt;
          const itktmax = tot.tktMax;
          const ideliveriescost = tot.deliveriescost;
          const ideliveriescostp2pt = tot.deliveriescostp2pt;
          const itktcost = tot.tktCost;
          const ideliveriessfl = tot.deliveriessfl;
          const ideliveriescoins = tot.deliveriescoins;
          const ichoresdelivtkt = Number(ideliveriestkt) + Number(ichorestkt) + Number(itktdchest) + Number(itktbert); //+ Number(itktwactv);
          totXP += itotxp;
          tottktdchest += itktdchest;
          //tottktcrop += itktcrop;
          tottktbert += itktbert;
          //tottktwactv += itktwactv;
          //tottkttntcl += Number(itkttntcl);
          totdeliveriestkt += ideliveriestkt;
          totchorestkt += ichorestkt;
          totdeliveriescost += ideliveriescost;
          totdeliveriescostp2pt += ideliveriescostp2pt;
          totdeliveriessfl += ideliveriessfl;
          totdeliveriescoins += ideliveriescoins;
          totmaxtkt += itktmax;
          return (
            <tr>
              {xListeColActivity[0][1] === 1 ? <td className="tdcenter" id="iccolumn">{idate}</td> : null}
              {xListeColActivity[1][1] === 1 ? <td className="tdcenter">{parseFloat(itotxp).toFixed(1)}</td> : null}
              {xListeColActivity[2][1] === 1 ? <td className="tdcenter">{itktdchest > 0 ? itktdchest : ""}</td> : null}
              {/* {xListeColActivity[3][1] === 1 ? <td className="tdcenter">{itktcrop > 0 ? itktcrop : ""}</td> : null} */}
              {xListeColActivity[4][1] === 1 ? <td className="tdcenter">{itktbert > 0 ? itktbert : ""}</td> : null}
              {/* {xListeColActivity[5][1] === 1 ? <td className="tdcenter">{itktwactv > 0 ? itktwactv : ""}</td> : null} */}
              {xListeColActivity[6][1] === 1 ? <td className="tdcenter">{ideliveriestkt > 0 ? ideliveriestkt : ""}</td> : null}
              {xListeColActivity[7][1] === 1 ? <td className="tdcenter">{ichorestkt > 0 ? ichorestkt : ""}</td> : null}
              {xListeColActivity[8][1] === 1 ? <td className="tdcenter">{ichoresdelivtkt}/{itktmax}</td> : null}
              {xListeColActivity[9][1] === 1 ? <td className="tdcenter">{ideliveriescost > 0 ? frmtNb(ideliveriescost) : ""}</td> : null}
              {xListeColActivity[10][1] === 1 ? <td className="tdcenter">{ideliveriescostp2pt > 0 ? frmtNb(ideliveriescostp2pt) : ""}</td> : null}
              {xListeColActivity[11][1] === 1 ? <td className="tdcenter">{itktcost > 0 ? frmtNb(itktcost) : ""}</td> : null}
              {xListeColActivity[12][1] === 1 ? <td className="tdcenter">{ideliveriessfl > 0 ? frmtNb(ideliveriessfl) : ""}</td> : null}
              {xListeColActivity[12][1] === 1 ? <td className="tdcenter">{ideliveriescoins > 0 ? frmtNb(ideliveriescoins) : ""}</td> : null}
            </tr>
          );
        }

      });
      const tableHeader = (
        <thead>
          <tr>
            {xListeColActivity[0][1] === 1 ? <th className="th-icon">
              <div className="selectquantback" style={{ top: `4px` }}><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                <InputLabel>From</InputLabel>
                <Select value={selectedFromActivityDay} onChange={handleChangeFromActivityDay}>
                  <MenuItem value="7">7 days</MenuItem>
                  <MenuItem value="31">1 month</MenuItem>
                  <MenuItem value="season">season</MenuItem>
                </Select></FormControl></div></th> : null}
            {xListeColActivity[1][1] === 1 ? <th className="thcenter">{ximgxp}</th> : null}
            {xListeColActivity[2][1] === 1 ? <th className="thcenter">{ximgdchest}</th> : null}
            {/* {xListeColActivity[3][1] === 1 ? <th className="thcenter">{ximgcrop}</th> : null} */}
            {xListeColActivity[4][1] === 1 ? <th className="thcenter">{ximgbert}</th> : null}
            {/* {xListeColActivity[5][1] === 1 ? <th className="thcenter">{ximgwactv}</th> : null} */}
            {xListeColActivity[6][1] === 1 ? <th className="thcenter">{imgdeliv}</th> : null}
            {xListeColActivity[7][1] === 1 ? <th className="thcenter">{imgchore}</th> : null}
            {xListeColActivity[8][1] === 1 ? <th className="thcenter">Max{ximgtkt}</th> : null}
            {xListeColActivity[9][1] === 1 ? <th className="thcenter">Cost{imgdeliv}</th> : null}
            {xListeColActivity[10][1] === 1 ? <th className="thcenter">CostP2P{imgdeliv}</th> : null}
            {xListeColActivity[11][1] === 1 ? <th className="thcenter">Cost{ximgtkt}</th> : null}
            {xListeColActivity[12][1] === 1 ? <th className="thcenter">SFL{imgdeliv}</th> : null}
            {xListeColActivity[12][1] === 1 ? <th className="thcenter">Coins{imgdeliv}</th> : null}
          </tr>
          <tr>
            {xListeColActivity[0][1] === 1 ? <td className="tdcenter">TOTAL</td> : null}
            {xListeColActivity[1][1] === 1 ? <td className="tdcenter">{parseFloat(totXP).toFixed(1)}</td> : null}
            {xListeColActivity[2][1] === 1 ? <td className="tdcenter">{tottktdchest}</td> : null}
            {/* {xListeColActivity[3][1] === 1 ? <td className="tdcenter">{tottktcrop}</td> : null} */}
            {xListeColActivity[4][1] === 1 ? <td className="tdcenter">{tottktbert}</td> : null}
            {/* {xListeColActivity[5][1] === 1 ? <td className="tdcenter">{tottktwactv}</td> : null} */}
            {xListeColActivity[6][1] === 1 ? <td className="tdcenter">{totdeliveriestkt}</td> : null}
            {xListeColActivity[7][1] === 1 ? <td className="tdcenter">{totchorestkt}</td> : null}
            {xListeColActivity[8][1] === 1 ? <td className="tdcenter">{totdeliveriestkt + totchorestkt + tottktdchest + tottktbert}/{totmaxtkt}</td> : null}
            {xListeColActivity[9][1] === 1 ? <td className="tdcenter">{frmtNb(totdeliveriescost)}</td> : null}
            {xListeColActivity[10][1] === 1 ? <td className="tdcenter">{frmtNb(totdeliveriescostp2pt)}</td> : null}
            {xListeColActivity[11][1] === 1 ? <td className="tdcenter"></td> : null}
            {xListeColActivity[12][1] === 1 ? <td className="tdcenter">{frmtNb(totdeliveriessfl)}</td> : null}
            {xListeColActivity[12][1] === 1 ? <td className="tdcenter">{frmtNb(totdeliveriescoins)}</td> : null}
          </tr>
        </thead>
      );
      const table = (
        <>
          <table className="table">
            {tableHeader}
            <tbody>
              {tableContent.reverse()}
            </tbody>
          </table>
        </>
      );
      setActivityTable(table);
      setMutants(mutantchickens);
      setsTickets(sTickets);
    }
  }
  function setActivityItem() {
    if (activityData[0]) {
      const ActTot = setActivityTot(activityData, "items");
      const allSortedItems = ActTot.allSortedItems;
      const compoHarvested = ActTot.compoHarvested;
      const compoHarvestn = ActTot.compoHarvestn;
      const compoTraded = ActTot.compoTraded;
      const compoTradedSfl = ActTot.compoTradedSfl;
      const compoBurn = ActTot.compoBurn;
      const foodBuild = ActTot.foodBuild;
      const delivBurn = ActTot.delivBurn;
      const tot = ActTot.tot;
      var totCost = 0;
      var totCostt = 0;
      var totCostn = 0;
      var totCosto = 0;
      var totTradedSfl = tot.totTradedSfl - (tot.totTradedSfl * 0.1);
      const tableContent = allSortedItems.map(([element]) => {
        if (compoHarvested[element] > 0 || compoBurn[element] > 0 || compoTraded[element] > 0) {
          const cobj = it[element] || fish[element] || flower[element] || null;
          const ico = cobj ? cobj.img : element === "SFL" ? imgsfl : element === "TKT" ? imgtkt : element === "COINS" ? imgcoins : imgxp;
          const iburn = element === "SFL" ? '' : compoBurn[element] || '';
          var iquant = compoHarvested[element] ? compoHarvested[element] : '';
          var iquantmax = 0;
          if (element === "TKT") {
            iquant = (tot.deliveriestkt + tot.chorestkt + tot.tktchest + tot.tktbert);
            iquantmax = tot.tktMax;
          }
          const iquanttraded = compoTraded[element] ? compoTraded[element] : '';
          const iquanttradedsfl = compoTradedSfl[element] ? (compoTradedSfl[element] - (compoTradedSfl[element] * 0.1)) : '';
          const iquantb = element !== "TKT" ? parseFloat(iquant - (BurnChecked ? iburn : 0)).toFixed(1) : iquant;
          const iharvestn = element === "SFL" ? frmtNb(tot.balSfl) : compoHarvestn[element] || ''; //tot.balSfl
          const titlesfl = element === "SFL" ? "based on farm balance" : "";
          //const icostb = !iquant && cobj ? cobj.cost * iburn || 0 : element === "SFL" && iburn;
          //const icostb = cobj ? cobj.cost * iburn || 0 : element === "SFL" && iburn;
          const icost = cobj ? ((cobj.cost / coinsRatio) * (iquant || iburn)) : (element === "SFL" && (iburn - iquant));
          const icostp2pt = cobj && iquant > 0 ? !isNaN(Number(cobj.costp2pt)) ? Number(cobj.costp2pt) * (iquant || 0) : '' : '';
          const icostp2pn = cobj && iquant > 0 ? !isNaN(Number(cobj.costp2pn)) ? Number(cobj.costp2pn) * (iquant || 0) : '' : '';
          const icostp2po = cobj && iquant > 0 ? !isNaN(Number(cobj.costp2po)) ? Number(cobj.costp2po) * (iquant || 0) : '' : '';
          const icostt = icost;
          //const itoolscraft = cobj.toolscrafted;
          totCost += Number(icostt);
          totCostt += Number(icostp2pt);
          totCostn += Number(icostp2pn);
          totCosto += Number(icostp2po);
          return (
            <tr>
              <td className="tdcenter" id="iccolumn"><i><img src={ico} alt={''} className="itico" title={element} /></i></td>
              {xListeColActivityItem[0][1] === 1 ? <td className="tditem">{element}</td> : null}
              {xListeColActivityItem[1][1] === 1 ? <td className="tdcenter" title={titlesfl}>{iharvestn && iharvestn}</td> : null}
              {xListeColActivityItem[2][1] === 1 ? <td className="tdcenter">{iquantb && iquantb}{iquantmax > 0 ? `/${iquantmax}` : ""}</td> : null}
              {xListeColActivityItem[3][1] === 1 ? <td className="tdcenter">{iburn}</td> : null}
              {xListeColActivityItem[4][1] === 1 ? <td className="tdcenter">{icostt && frmtNb(icostt)}</td> : null}
              {xListeColActivityItem[5][1] === 1 ? <td className="tdcenter">{icostp2pt && frmtNb(icostp2pt)}</td> : null}
              {xListeColActivityItem[6][1] === 1 ? <td className="tdcenter">{icostp2pn && frmtNb(icostp2pn)}</td> : null}
              {xListeColActivityItem[7][1] === 1 ? <td className="tdcenter">{icostp2po && frmtNb(icostp2po)}</td> : null}
              {xListeColActivityItem[8][1] === 1 ? <td className="tdcenterbrd">{iquanttraded && parseFloat(iquanttraded).toFixed(0)}</td> : null}
              {xListeColActivityItem[8][1] === 1 ? <td className="tdcenterbrd">{iquanttradedsfl && parseFloat(iquanttradedsfl).toFixed(1)}</td> : null}
              {xListeColActivityItem[9][1] === 1 ? <td className="tdcenterbrd">{delivBurn["total"][element]}</td> : null}
              {xListeColActivityItem[9][1] === 1 ? Object.entries(foodBuild).map(([itemName]) => (
                (food[itemName]) ? (<td className="tdcenterbrd">{!isNaN(foodBuild[itemName][element]) ? parseFloat(foodBuild[itemName][element]).toFixed(0) : ""}</td>) : null)) : null}
            </tr>
          );
        }
      });
      const tableHeader = (
        <thead>
          <tr>
            <th className="th-icon"></th>
            {xListeColActivityItem[0][1] === 1 ? <th className="thcenter">Item</th> : null}
            {xListeColActivityItem[1][1] === 1 ? <th className="thcenter">Hrvst</th> : null}
            {xListeColActivityItem[2][1] === 1 ? <th className="thcenter">
              <div className="selectquantback" style={{ top: `4px` }}><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                <InputLabel>Quantity</InputLabel>
                <Select value={selectedFromActivity} onChange={handleChangeFromActivity}>
                  <MenuItem value="today">today</MenuItem>
                  <MenuItem value="1">24h</MenuItem>
                  <MenuItem value="7">7 days</MenuItem>
                  <MenuItem value="31">1 month</MenuItem>
                  <MenuItem value="season">season</MenuItem>
                </Select></FormControl></div></th> : null}
            {xListeColActivityItem[3][1] === 1 ? <th className="thcenter">
              <div className="checktry"><input type="checkbox" id="CostColumnCheckbox" style={{ alignContent: `right` }} checked={BurnChecked} onChange={handleBurnCheckedChange} /></div>
              Burn</th> : null}
            {xListeColActivityItem[4][1] === 1 ? <th className="thcenter">Cost</th> : null}
            {xListeColActivityItem[5][1] === 1 ? <th className="thcenter">Market</th> : null}
            {xListeColActivityItem[6][1] === 1 ? <th className="thcenter">Niftyswap</th> : null}
            {xListeColActivityItem[7][1] === 1 ? <th className="thcenter">OpenSea</th> : null}
            {xListeColActivityItem[8][1] === 1 ? <th className="tdcenterbrd"><i><img src="./icon/ui/exchange.png" title="Traded" className="itico" /></i></th> : null}
            {xListeColActivityItem[8][1] === 1 ? <th className="tdcenterbrd"><i><img src={imgsfl} title="SFL" className="itico" /></i></th> : null}
            {xListeColActivityItem[9][1] === 1 ? <th className="tdcenterbrd"><i><img src="./icon/ui/delivery_board.png" title="Deliveries burn" className="itico" /></i></th> : null}
            {xListeColActivityItem[9][1] === 1 ? Object.entries(foodBuild).map(([itemName]) => (
              (food[itemName]) ? (<th className="tdcenterbrd" key={itemName}><i><img src={food[itemName].img} title={itemName} className="itico" /></i></th>) : null)) : null}
          </tr>
          <tr>
            <td className="tdcenter">TOTAL</td>
            {xListeColActivityItem[0][1] === 1 ? <td className="tdcenter"></td> : null}
            {xListeColActivityItem[1][1] === 1 ? <td className="tdcenter"></td> : null}
            {xListeColActivityItem[2][1] === 1 ? <td className="tdcenter"></td> : null}
            {xListeColActivityItem[3][1] === 1 ? <td className="tdcenter"></td> : null}
            {xListeColActivityItem[4][1] === 1 ? <td className="tdcenter">{frmtNb(totCost)}</td> : null}
            {xListeColActivityItem[5][1] === 1 ? <td className="tdcenter">{frmtNb(totCostt)}</td> : null}
            {xListeColActivityItem[6][1] === 1 ? <td className="tdcenter">{frmtNb(totCostn)}</td> : null}
            {xListeColActivityItem[7][1] === 1 ? <td className="tdcenter">{frmtNb(totCosto)}</td> : null}
            {xListeColActivityItem[8][1] === 1 ? <td className="tdcenterbrd"></td> : null}
            {xListeColActivityItem[8][1] === 1 ? <td className="tdcenterbrd">{frmtNb(totTradedSfl)}</td> : null}
            {xListeColActivityItem[9][1] === 1 ? <td className="tdcenterbrd"></td> : null}
            {xListeColActivityItem[9][1] === 1 ? Object.entries(foodBuild).map(([itemName]) => (
              (food[itemName]) ? (<td className="tdcenterbrd" key={itemName}>{foodBuild[itemName]["quant"]}</td>) : null)) : null}
          </tr>
        </thead>
      );
      const table = (
        <>
          <table className="table">
            {tableHeader}
            <tbody>
              {tableContent}
            </tbody>
          </table>
        </>
      );
      setActivityTable(table);
      setMutants(mutantchickens);
      setsTickets(sTickets);
    }
  }
  function setActivityQuest() {
    if (activityData[0]) {
      const tot = setActivityTotQuest(activityData);
      const Quest = tot.Quest;
      const questKeys = Object.keys(Quest);
      const dayKeys = Object.keys(activityData);
      const uniqueQuests = new Set();
      const completionsByDate = {};
      const dToday = formatDate(new Date());
      questKeys.forEach((element) => {
        const cobj = Quest[element];
        //const idate = new Date(cobj.date);
        //const qxdate = `${String(idate.getMonth() + 1).padStart(2, '0')}/${String(idate.getDate()).padStart(2, '0')}/${String(idate.getFullYear()).slice(-2)}`;
        const qxdate = formatDate(cobj.date);
        uniqueQuests.add(JSON.stringify({
          from: cobj.from,
          description: cobj.description,
          reward: Number(cobj.reward),
          istkt: cobj.istkt,
        }));
        if (!completionsByDate[qxdate]) {
          completionsByDate[qxdate] = {};
        }
        completionsByDate[qxdate][JSON.stringify({
          from: cobj.from,
          description: cobj.description,
          reward: Number(cobj.reward),
          istkt: cobj.istkt,
        })] = cobj.completed ? "X" : qxdate === dToday ? "." : "-";
      });
      const uniqueQuestsArray = Array.from(uniqueQuests).map(JSON.parse).sort((a, b) => {
        if (a.from === "hank" && b.from !== "hank") {
          return -1;
        } else if (a.from !== "hank" && b.from === "hank") {
          return 1;
        } else {
          return a.from.localeCompare(b.from);
        }
      });
      const tableContent = uniqueQuestsArray.reverse().map((uniqueQuest) => {
        const columns = dayKeys.map((date, index) => {
          //const qxdate = `${String(new Date(date).getMonth() + 1).padStart(2, '0')}/${String(new Date(date).getDate()).padStart(2, '0')}/${String(new Date(date).getFullYear()).slice(-2)}`;
          const qxdate = formatDate(activityData[index].date);
          return completionsByDate[qxdate] ? completionsByDate[qxdate][JSON.stringify(uniqueQuest)] || "" : "";
        });
        var xfrom = "";
        const ofrom = uniqueQuest.from;
        xfrom = "./icon/pnj/" + ofrom + ".png";
        if (ofrom === "pumpkin' pete") { xfrom = "./icon/pnj/pumpkinpete.png" }
        const ximgfrom = <img src={xfrom} alt="" title={ofrom} style={{ width: '20px', height: '20px' }} />;
        //const ximgrew = <img src={imgtkt} alt="" title={ofrom} style={{ width: '25px', height: '25px' }} />;
        return (
          <tr>
            {xListeColActivityQuest[0][1] === 1 ? <td className="tdcenter" id="iccolumn">{ximgfrom}</td> : null}
            {xListeColActivityQuest[1][1] === 1 ? <td className="tdcenter" id="iccolumn" style={{ fontSize: '11px' }} dangerouslySetInnerHTML={{ __html: uniqueQuest.description }}></td> : null}
            {xListeColActivityQuest[2][1] === 1 ? <td className="tdcenter" style={{ fontSize: '11px' }}>{uniqueQuest.reward}</td> : null}
            {xListeColActivityQuest[3][1] === 1 ? columns.map((value, index) => (
              (value === "X") ? (<td className="tdcenterbrd" style={{ backgroundColor: 'rgba(0, 110, 0, 0.39)' }} title='completed'></td>) :
                (value === "-") ? (<td className="tdcenterbrd" style={{ backgroundColor: 'rgba(110, 0, 0, 0.39)' }} title='skipped'></td>) :
                  (value === ".") ? (<td className="tdcenterbrd" style={{ backgroundColor: 'rgba(110, 110, 0, 0.39)' }} title='not done'></td>) :
                    (<td className="tdcenterbrd"></td>))) : null}
          </tr>
        );
      });
      const tableHeader = (
        <thead>
          <tr>
            {xListeColActivityQuest[0][1] === 1 ? <th className="th-icon">From</th> : null}
            {xListeColActivityQuest[1][1] === 1 ? <th className="thcenter" style={{ fontSize: '14px' }}>Description</th> : null}
            {xListeColActivityQuest[2][1] === 1 ? <th className="thcenter" style={{ fontSize: '14px' }}>Reward</th> : null}
            {xListeColActivityQuest[3][1] === 1 ? Object.entries(dayKeys).map((date, index) => (
              (<th className="tdcenterbrd" style={{ fontSize: '8px' }}>{formatDateAndSupYr(activityData[index].date)}</th>))) : null}
          </tr>
        </thead>
      );
      const table = (
        <>
          <table className="table">
            {tableHeader}
            <tbody>
              {tableContent.reverse()}
            </tbody>
          </table>
        </>
      );
      setActivityTable(table);
      setMutants(mutantchickens);
      setsTickets(sTickets);
    }
  }
  function setActivityTot(activityData, xContext) {
    let compoHarvested = [];
    compoHarvested["XP"] = 0;
    compoHarvested["TKT"] = 0;
    compoHarvested["SFL"] = 0;
    compoHarvested["COINS"] = 0;
    let compoHarvestn = [];
    let compoTraded = [];
    let compoTradedSfl = [];
    let compoBurn = [];
    compoBurn["SFL"] = 0;
    let foodBuild = [];
    let delivBurn = [];
    delivBurn["total"] = [];
    var tot = {
      XP: 0,
      tktchest: 0,
      tktcrop: 0,
      tktbert: 0,
      //tktwact: 0,
      tktbertMax: 0,
      deliveriestkt: 0,
      deliveriessfl: 0,
      deliveriescoins: 0,
      deliveriescost: 0,
      deliveriestktcost: 0,
      deliveriescostp2pt: 0,
      deliveriescostp2pn: 0,
      deliveriescostp2po: 0,
      chorestkt: 0,
      tktMax: 0,
      tktCost: 0,
      totTradedSfl: 0,
      balSfl: 0
    };
    //const dataEntries = Object.entries(activityData);
    const dataEntries = Object.keys(activityData);
    let i = 0;
    dataEntries.map((value, index) => {
      const DataContext = xContext === "items" ? activityData[index] : activityData;
      //const endDate = new Date(DataContext.date).toISOString();
      const endDate = new Date(DataContext.date);
      //const endDateFormatted = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;
      //const isSeasonDay = endDateFormatted >= dateSeason;
      /* const isSeasonDay = endDate.getFullYear() === dateSeason.getFullYear() &&
        endDate.getMonth() === dateSeason.getMonth() &&
        endDate.getDate() === dateSeason.getDate(); */
      const isSeasonDay = endDate.setHours(0, 0, 0, 0) >= dateSeason.setHours(0, 0, 0, 0);
      //const curw = ((endDate.getDate()) / 8);
      //const isweeklyactday = Number.isInteger(curw) || (endDate.getDate() === dateSeason.getDate() && endDate.getMonth() === dateSeason.getMonth());
      //const wactdone = isweeklyactday && wklactivity[Math.floor(curw) + 1];
      if (((xContext === "day" && i === 0) || xContext !== "day") && isSeasonDay) {
        const itktdchest = DataContext.data.ticketdailychest;
        const itktcrop = DataContext.data.ticketsoncrop || 0;
        const ibert = DataContext.data.bert || 0;
        const itktbertMax = ibert ? ibert.reward ? ibert.reward : 0 : 0;
        const ibertcompleted = ibert ? ibert.completed && ibert.completed : false;
        const itktbert = ibertcompleted === true ? itktbertMax : 0;
        //const itktwact = isweeklyactday ? wactdone ? tktWeekly : 0 : 0;
        //const itktwactMax = isweeklyactday ? tktWeekly : 0;
        //const itkttntcl = DataContext.data.tickettentacle ? DataContext.data.tickettentacle : 0;
        //const itkttntcl = DataContext.data.totfish["Kraken Tentacle"] ? DataContext.data.totfish["Kraken Tentacle"] * 12 : 0;
        //const istoday = selectedFromActivity === "today";
        //compoHarvested["TKT"] += !istoday ? itkttntcl : 0;
        tot.tktchest += itktdchest;
        tot.tktcrop += itktcrop;
        tot.tktbert += itktbert;
        //tot.tktwact += itktwact;
        //tot.tktbertMax += itktbertMax;
        tot.tktMax += 1 + itktbertMax; //+ itktwactMax;
        //console.log("tktMax +1+bert -> " + (itktbertMax + 1));
        compoHarvested["TKT"] += itktcrop + itktdchest + itktbert; // + itktwact; // + itkttntcl;
        const prevBalance = activityData[i + 1] ? activityData[i + 1].data.balance : 0;
        const dayBalance = DataContext.data.balance;
        const dayGain = activityData[i + 1] ? prevBalance - dayBalance : 0;
        tot.balSfl += activityData.length > 1 ? dayGain : 0;
        const totHarvestEntries = Object.entries(DataContext.data.totharvest);
        totHarvestEntries.map(([item]) => {
          compoHarvested[item] = compoHarvested[item] || 0;
          compoHarvested[item] += DataContext.data.totharvest[item];
          compoHarvestn[item] = compoHarvestn[item] || 0;
          compoHarvestn[item] += DataContext.data.totharvestn[item];
        });
        if (DataContext.data.totfish) {
          const totFishEntries = Object.entries(DataContext.data.totfish);
          totFishEntries.map(([item]) => {
            compoHarvested[item] = compoHarvested[item] || 0;
            compoHarvested[item] += DataContext.data.totfish[item];
            //compoHarvested["TKT"] += item === "Kraken Tentacle" ? DataContext.data.totfish[item] : 0;
          });
        }
        if (DataContext.data.totflower) {
          const totFlowerEntries = Object.entries(DataContext.data.totflower);
          totFlowerEntries.map(([item]) => {
            compoHarvested[item] = compoHarvested[item] || 0;
            compoHarvested[item] += DataContext.data.totflower[item];
            //compoHarvested["TKT"] += item === "Kraken Tentacle" ? DataContext.data.totfish[item] : 0;
          });
        }
        if (DataContext.data.tottrades) {
          const totTradesEntries = Object.entries(DataContext.data.tottrades);
          totTradesEntries.map(([item]) => {
            const itemTraded = DataContext.data.tottrades[item].item;
            compoTraded[itemTraded] = compoTraded[itemTraded] || 0;
            compoTraded[itemTraded] += DataContext.data.tottrades[item].quant;
            compoTradedSfl[itemTraded] = compoTradedSfl[itemTraded] || 0;
            compoTradedSfl[itemTraded] += DataContext.data.tottrades[item].sfl;
            tot.totTradedSfl += DataContext.data.tottrades[item].sfl;
          });
        }
        const totBuildEntries = Object.entries(DataContext.data.totbuild);
        totBuildEntries.map(([item, quantity]) => {
          const buildQuant = DataContext.data.totbuild[item];
          if (food[item]) {
            foodBuild[item] = foodBuild[item] || [];
            foodBuild[item]["quant"] = foodBuild[item]["quant"] || 0;
            foodBuild[item]["quant"] += buildQuant;
            for (let compofood in food[item].compoit) {
              const compo = compofood;
              const quant = food[item].compoit[compofood];
              if (it[compo] || fish[compo]) {
                compoBurn[compo] = compoBurn[compo] || 0;
                compoBurn[compo] += quant * buildQuant;
                foodBuild[item][compo] = foodBuild[item][compo] || 0;
                foodBuild[item][compo] += quant * buildQuant;
                //console.log(item + ":" + compoValues[compo]);
              }
            }
            tot.XP += Number(food[item].xp) * buildQuant;
            compoHarvested["XP"] += Number(food[item].xp) * buildQuant;
            foodBuild[item]["XP"] = foodBuild[item]["XP"] || 0;
            foodBuild[item]["XP"] += Number(food[item].xp) * buildQuant;
          }
          if (fish[item]) {
            compoHarvested[item] = compoHarvested[item] || 0;
            compoHarvested[item] += buildQuant;
            tot.XP += !isNaN(Number(fish[item].xp)) ? Number(fish[item].xp) * buildQuant : 0;
          }
        });
        const totToolEntries = Object.entries(DataContext.data.toolscrafted);
        totToolEntries.map(([item], quantity) => {
          const iquant = DataContext.data.toolscrafted[item];
          if (item === "Axe") {
            compoBurn["SFL"] += 0.065 * iquant;
          }
          if (item === "Pickaxe") {
            compoBurn["SFL"] += 0.065 * iquant;
            compoBurn["Wood"] = compoBurn["Wood"] || 0;
            compoBurn["Wood"] += 3 * iquant;
          }
          if (item === "Stone Pickaxe") {
            compoBurn["SFL"] += 0.065 * iquant;
            compoBurn["Wood"] = compoBurn["Wood"] || 0;
            compoBurn["Wood"] += 3 * iquant;
            compoBurn["Stone"] = compoBurn["Stone"] || 0;
            compoBurn["Stone"] += 5 * iquant;
          }
          if (item === "Iron Pickaxe") {
            compoBurn["SFL"] += 0.25 * iquant;
            compoBurn["Wood"] = compoBurn["Wood"] || 0;
            compoBurn["Wood"] += 3 * iquant;
            compoBurn["Iron"] = compoBurn["Iron"] || 0;
            compoBurn["Iron"] += 5 * iquant;
          }
          if (item === "Gold Pickaxe") {
            compoBurn["SFL"] += 0.3125 * iquant;
            compoBurn["Wood"] = compoBurn["Wood"] || 0;
            compoBurn["Wood"] += 3 * iquant;
            compoBurn["Gold"] = compoBurn["Gold"] || 0;
            compoBurn["Gold"] += 3 * iquant;
          }
          if (item === "Rod") {
            compoBurn["SFL"] += 0.065 * iquant;
            compoBurn["Wood"] = compoBurn["Wood"] || 0;
            compoBurn["Wood"] += 3 * iquant;
            compoBurn["Stone"] = compoBurn["Stone"] || 0;
            compoBurn["Stone"] += 1 * iquant;
          }
        });
        const totDelivEntries = Object.entries(DataContext.data.deliveries);
        totDelivEntries.map(([item]) => {
          const OrderItem = DataContext.data.deliveries[item];
          /* const createdDate = new Date(OrderItem.createdAt);
          const offsetInMinutes = createdDate.getTimezoneOffset();
          const createdDateUTC = new Date(createdDate.getTime() + offsetInMinutes * 60 * 1000);
          const dNow = new Date();
          const isToday = createdDateUTC.getDay() === dNow.getDay() && createdDateUTC.getMonth() === dNow.getMonth(); */
          //const Shelly = ["shelly"];
          //const isShelly = Shelly.some(valeur => new RegExp(valeur).test(totDelivEntries[item][1].from));
          //if (isToday) {
          const isShelly = item === "shelly";
          let patterntkn = /res\/(.*?)\ alt=/g;
          let correspondancetkn = patterntkn.exec(OrderItem.reward);
          let pattern = /(.*?)<img/g;
          let correspondance = pattern.exec(OrderItem.reward);
          let correspondancetktname = OrderItem.reward.includes(imgtkt);
          const istkt = correspondancetktname;
          const issfl = correspondancetkn && correspondancetkn[1] === "flowertoken.webp";
          const iscoins = correspondancetkn && correspondancetkn[1] === "coins.png";
          const isPreSeason = OrderItem.preSeason && OrderItem.preSeason;
          if (OrderItem.completed) {
            delivBurn[item] = [];
            //"items": "1<img src=./icon/food/fermented_carrots.png alt=\"\" title=\"Fermented Carrots\" style=\"width: 17px; height: 17px\"/>",
            var regex = /(\d+)<img[^>]+title="([^"]+)"[^>]*\/>/g;
            var match;
            while ((match = regex.exec(OrderItem.items)) !== null) {
              var value = match[1];
              const ivalue = Number(value);
              var title = match[2];
              if (food[title]) {
                //for (let i = 1; i < 5; i++) {
                for (let compofood in food[title].compoit) {
                  const compo = compofood;
                  const quant = food[title].compoit[compofood];
                  if (it[compo] || fish[compo]) {
                    compoBurn[compo] = compoBurn[compo] || 0;
                    compoBurn[compo] += quant * ivalue;
                    delivBurn[item][compo] = delivBurn[item][compo] || 0;
                    delivBurn[item][compo] += quant * ivalue;
                    delivBurn["total"][compo] = delivBurn["total"][compo] || 0;
                    delivBurn["total"][compo] += quant * ivalue;
                    const xcompo = it[compo] ? it[compo] : fish[compo] ? fish[compo] : null;
                    const icost = (xcompo.cost / coinsRatio) * (quant * ivalue);
                    const icostt = xcompo.costp2pt ? xcompo.costp2pt : 0 * (quant * ivalue);
                    const icostn = xcompo.costp2pn ? xcompo.costp2pn : 0 * (quant * ivalue);
                    const icosto = xcompo.costp2po ? xcompo.costp2po : 0 * (quant * ivalue);
                    tot.deliveriescost += icost;
                    tot.deliveriescostp2pt += Number(icostt);
                    tot.deliveriescostp2pn += Number(icostn);
                    tot.deliveriescostp2po += Number(icosto);
                    tot.deliveriestktcost += istkt ? icost : 0
                    //console.log(item + ":" + compoValues[compo]);
                  }
                }
                //tot.XP += Number(food[title].xp) * ivalue;
              }
              if (it[title] || fish[title]) {
                compoBurn[title] = compoBurn[title] || 0;
                compoBurn[title] += ivalue;
                delivBurn[item][title] = delivBurn[item][title] || 0;
                delivBurn[item][title] += ivalue;
                delivBurn["total"][title] = delivBurn["total"][title] || 0;
                delivBurn["total"][title] += ivalue;
                const xcompo = it[title] ? it[title] : fish[title] ? fish[title] : null;
                const icost = (xcompo.cost / coinsRatio) * ivalue;
                const icostt = xcompo.costp2pt ? xcompo.costp2pt : 0 * ivalue;
                const icostn = xcompo.costp2pn ? xcompo.costp2pn : 0 * ivalue;
                const icosto = xcompo.costp2po ? xcompo.costp2po : 0 * ivalue;
                tot.deliveriescost += icost;
                tot.deliveriescostp2pt += Number(icostt);
                tot.deliveriescostp2pn += Number(icostn);
                tot.deliveriescostp2po += Number(icosto);
                tot.deliveriestktcost += istkt ? icost : 0
                //console.log(item + ":" + compoValues[compo]);
              }
            }
            //"reward": "1.42<img src=./icon/res/sfltoken.png alt=\"\" style=\"width: 20px; height: 20px\"/>",
            //"reward": "4<img src=./icon/res/mermaid_scale.webp alt=\"\" style=\"width: 20px; height: 20px\"/>",
            const itm = istkt ? "TKT" : (issfl ? "SFL" : "COINS");
            if (correspondance || istkt) {
              compoHarvested[itm] += Number(correspondance[1]) || 0;
              tot.deliveriestkt += !isPreSeason && istkt && (Number(correspondance[1]) || 0);
              tot.deliveriessfl += issfl && (Number(correspondance[1]) || 0);
              tot.deliveriescoins += iscoins && (Number(correspondance[1]) || 0);
            }
          }
          tot.tktMax += !isShelly && istkt && (correspondance && (Number(correspondance[1]) || 0));
          //if (istkt) { console.log("tktMax +deliv: " + item + "-> " + Number(correspondance[1])) }
          //}
        });
        const totChoreEntries = Object.entries(DataContext.data.chores);
        totChoreEntries.map(([item]) => {
          const choreItem = DataContext.data.chores[item];
          /* const createdDate = new Date(totChoreEntries[item][1].createdAt);
          const offsetInMinutes = createdDate.getTimezoneOffset();
          const createdDateUTC = new Date(createdDate.getTime() + offsetInMinutes * 60 * 1000);
          const dNow = new Date();
          const isToday = createdDateUTC.getDay() === dNow.getDay() && createdDateUTC.getMonth() === dNow.getMonth(); */
          //if (isToday) {
          //const choreItem = totChoreEntries[item][1] && totChoreEntries[item][1];

          let completedToday = false;
          if (activityData[i - 1]) {
            if (activityData[i - 1].data.chores[item]?.completed) { completedToday = true }
            //activityData[i + 1].data.chores[item].completed;
          }

          if (choreItem && choreItem.completed && completedToday) {
            if (choreItem.rewarditem === tktName) {
              compoHarvested["TKT"] = compoHarvested["TKT"] || 0;
              compoHarvested["TKT"] += choreItem.reward;
              tot.chorestkt += choreItem.reward;
            } else {
              compoHarvested[choreItem.rewarditem] = compoHarvested[choreItem.rewarditem] || 0;
              compoHarvested[choreItem.rewarditem] += choreItem.reward;
            }
          }
          tot.tktMax += choreItem && (choreItem.rewarditem === tktName) && Number(choreItem.reward);
          //if ((choreItem.rewarditem === tktName)) { console.log("tktMax +chore: " + item + "-> " + choreItem.reward) }
          //}
        });
      }
      i++;
    });
    //console.log(compoBurn);
    tot.tktCost = tot.deliveriestktcost / (tot.deliveriestkt);
    let compoTotal = [];
    compoTotal = Object.assign({}, compoHarvested, compoBurn);
    const itemOrder = Object.keys(it);
    const fishOrder = Object.keys(fish);
    const flowerOrder = Object.keys(flower);
    const compoEntries = Object.entries(compoTotal);
    const sortedInventoryItems = itemOrder.map((item) => {
      const entry = compoEntries.find(([entryItem]) => entryItem === item);
      const quantity = entry ? entry[1] : 0;
      return [item, quantity];
    });
    const sortedFishItems = fishOrder.map((item) => {
      const entry = compoEntries.find(([entryItem]) => entryItem === item);
      const quantity = entry ? entry[1] : 0;
      return [item, quantity];
    });
    const sortedFlowerItems = flowerOrder.map((item) => {
      const entry = compoEntries.find(([entryItem]) => entryItem === item);
      const quantity = entry ? entry[1] : 0;
      return [item, quantity];
    });
    sortedInventoryItems.unshift(["TKT", compoHarvested["TKT"]]);
    sortedInventoryItems.unshift(["SFL", compoBurn["SFL"]]);
    sortedInventoryItems.unshift(["COINS", compoBurn["COINS"]]);
    sortedInventoryItems.unshift(["XP", compoHarvested["XP"]]);
    const allSortedItems1 = sortedInventoryItems.concat(sortedFlowerItems);
    const allSortedItems = allSortedItems1.concat(sortedFishItems);
    const result = {
      allSortedItems: allSortedItems,
      compoHarvested: compoHarvested,
      compoHarvestn: compoHarvestn,
      compoTraded: compoTraded,
      compoTradedSfl: compoTradedSfl,
      compoBurn: compoBurn,
      foodBuild: foodBuild,
      delivBurn: delivBurn,
      tot: tot
    }
    //console.log("tktMax -> " + tot.tktMax);
    return result;
  }
  function setActivityTotQuest(activityData) {
    let Quest = [];
    let i = 0;
    //const dataEntries = Object.entries(activityData);
    const dataEntries = Object.keys(activityData);
    dataEntries.map((value, index) => {
      const totChoreEntries = Object.entries(activityData[index].data.chores);
      totChoreEntries.map(([item]) => {
        const choreItem = activityData[index].data.chores[item];
        const choreFrom = "hank";
        const choreDesc = choreItem.description;
        const choreDate = formatDate(activityData[index].date);
        const choreCompleted = choreItem.completed;
        const choreTkt = choreItem.tickets;
        Quest[i] = {
          from: choreFrom,
          description: choreDesc,
          date: choreDate,
          completed: choreCompleted,
          istkt: true,
          reward: choreTkt
        }
        i++;
        //if (!Dates.includes(choreDate)) { Dates.push(choreDate) }
        //console.log(Quest[i - 1]);
      });
      const totDelivEntries = Object.entries(activityData[index].data.deliveries);
      totDelivEntries.map(([item]) => {
        const isShelly = item === "shelly";
        if (!isShelly) {
          const delivItem = activityData[index].data.deliveries[item];
          const delivFrom = item;
          const delivDesc = delivItem.items;
          const delivDate = formatDate(activityData[index].date);
          const delivCompleted = delivItem.completed;
          let patterntkn = /res\/(.*?)\ alt=/g;
          let correspondancetkn = patterntkn.exec(delivItem.reward);
          let pattern = /(.*?)<img/g;
          let correspondance = pattern.exec(delivItem.reward);
          const istkt = correspondancetkn && correspondancetkn[1] !== "flowertoken.webp";
          const delivRew = correspondance && correspondance[1];
          Quest[i] = {
            from: delivFrom,
            description: delivDesc,
            date: delivDate,
            completed: delivCompleted,
            istkt: istkt,
            reward: delivRew
          }
          i++;
          //if (!Dates.includes(delivDate)) { Dates.push(delivDate) }
          //console.log(Quest[i - 1]);
        }
      });
    });
    const result = {
      Quest: Quest,
      //Dates: Dates,
    }
    return result;
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
    //if (testb === false) {
    var bTrynftArray = [];
    var bTrynftwArray = [];
    var bTrybuildArray = [];
    var bTryskillArray = [];
    var bTryskilllgcArray = [];
    var bTrybudArray = [];
    if (!onlyPrices) {
      if (localStorage.getItem("SFLManData") !== null) {
        const cookieValue = localStorage.getItem("SFLManData");
        var loadedData = JSON.parse(cookieValue);
        bTrynftArray = loadedData.bTrynft.length > 0 ? loadedData.bTrynft.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {}) : "";
        bTrynftwArray = loadedData.bTrynftw.length > 0 ? loadedData.bTrynftw.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {}) : "";
        bTrybuildArray = loadedData.bTrybuild.length > 0 ? loadedData.bTrybuild.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {}) : "";
        bTryskillArray = loadedData.bTryskill.length > 0 ? loadedData.bTryskill.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {}) : "";
        bTryskilllgcArray = loadedData.bTryskilllgc.length > 0 ? loadedData.bTryskilllgc.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {}) : "";
        bTrybudArray = loadedData.bTrybud.length > 0 ? loadedData.bTrybud.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {}) : "";
      }
    }
    let vHeaders = onlyPrices ? {
      onlyprices: "true",
    } : {
      frmid: lastClickedInputValue.current,
      inputkeep: lastClickedInputKeep.current,
      inputFarmTime: dataSet.inputFarmTime,
      inputMaxBB: dataSet.inputMaxBB,
      inputAnimalLvl: dataSet.inputAnimalLvl,
      coinsratio: dataSet.coinsRatio,
      xtrynft: JSON.stringify(bTrynftArray),
      xtrynftw: JSON.stringify(bTrynftwArray),
      xtrybuild: JSON.stringify(bTrybuildArray),
      xtryskill: JSON.stringify(bTryskillArray),
      xtryskilllgc: JSON.stringify(bTryskilllgcArray),
      xtrybud: JSON.stringify(bTrybudArray),
    };
    const response = await fetch(API_URL + "/getdatacrypto", {
      method: 'GET',
      headers: vHeaders
    });
    if (response.ok) {
      const responseData = await response.json();
      setpriceData(JSON.parse(JSON.stringify(responseData.priceData)));
      if (responseData.allData !== "" && responseData.allData !== undefined) {
        it = responseData.allData.it;
        tool = responseData.allData.tool;
        food = responseData.allData.food;
        fish = responseData.allData.fish;
        craft = responseData.allData.craft;
        flower = responseData.allData.flower;
        bounty = responseData.allData.bounty;
        compost = responseData.allData.compost;
        nft = responseData.allData.nft;
        nftw = responseData.allData.nftw;
        skilllgc = responseData.allData.skilllgc;
        skill = responseData.allData.skill;
        buildng = responseData.allData.buildng;
        bud = responseData.allData.bud;
        spot = responseData.allData.spot;
        mutantchickens = responseData.allData.mutantchickens;
        sTickets = responseData.allData.sTickets;
        buildngf = responseData.allData.buildngf;
        fishingDetails = responseData.allData.fishingDetails;
        Animals = responseData.allData.Animals;
        isleMap = responseData.allData.isleMap;
        ftrades = responseData.allData.ftrades;
        dataSet.taxFreeSFL = frmtNb(responseData.allData.taxFreeSFL);
        dataSet.dailychest = responseData.allData.dailychest;
        //setanimalData(responseData.allData.Animals);
        //expand = responseData.allData.expand;
        //xexpandData = responseData.allData.expandData;
        //frmOwner = responseData.allData.frmOwner;
        setFarmData(responseData.allData.frmData);
        dataSet.farmData = responseData.allData.frmData;
        setBumpkinData(responseData.allData.Bumpkin);
        //MergeIt(responseData.allData.it, it);
        setPlanted(responseData.allData.it);
        getFarmit(it);
        getCookit(food);
        //getTryit(nft, nftw, skilllgc, buildng, bud);
        //getFarmit(it);
        //getCookit(food);
        //getTryit(nft, nftw, skill, buildng, bud);
        //getActive(nft, nftw, skill, buildng, bud);
        setdeliveriesData(responseData.allData.orderstable);
        dataSet.orderstable = responseData.allData.orderstable;
        setfTrades();
        setitData(it);
        refreshDataSet();
      }
      //NFTPrice();
      xinitprc = true;
      setReqState('');
    } else {
      console.log(`Error : ${response.status}`);
      setReqState('Error refreshing prices');
      //localStorage.clear();
      //console.log("Cleared local data");
    }
    /*} else {
      const responseData = xrespPrice;
      setpriceData(JSON.parse(JSON.stringify(responseData.priceData)));
      setpriceDataT(responseData.priceDataT);
      setpriceDataN(responseData.priceDataN);
      setpriceDataO(responseData.priceDataO);
      setpriceDataOW(responseData.priceDataOW);
      NFTPrice();
    } */
  }
  function setMutants(table) {
    const MutItems = table.map(([item, amount], index) => {
      const cobj = nft[table[index][0].name];
      const ico = cobj ? cobj.img : '';
      return (
        <img src={ico} alt={''} className="nftico" />
      )
    });
    /* if (table.length > 0) {
      var poulette = <img src="./icon/nft/poulte.png" alt={''} className="poulteico" />;
      MutItems.unshift(poulette);
    } */
    setmutData(MutItems);
  }
  function setsTickets(tabletk) {
    if (tabletk.length > 1) {
      setticketsData(<div><img src={imgtkt} alt={''} className="itico" />{tabletk[1].amount}</div>);
    } else {
      setticketsData("");
    }
  }

  const withdrawreduc = (xexpandData.type === "desert" || xexpandData.type === "spring" || xexpandData.type === "volcano") ? 2.5 : 0;
  const withdrawtax = (farmData.balance < 10 ? 30 : farmData.balance < 100 ? 25 : farmData.balance < 1000 ? 20 : farmData.balance < 5000 ? 15 : 10) - withdrawreduc;
  dataSet.withdrawtax = withdrawtax;
  const withdrawSFLbeyondTaxFree = Number(taxFreeSFL) - Number(farmData.balance);
  const withdrawsflFree = (withdrawSFLbeyondTaxFree < 0) ? Number(taxFreeSFL) : Number(farmData.balance);
  const withdrawsflNotFree = (withdrawsflFree >= Number(farmData.balance)) ? 0 : (Number(farmData.balance) - withdrawsflFree);
  const withdrawSflNotFreeTaxed = (withdrawsflNotFree > 0) ? (withdrawsflNotFree - (withdrawsflNotFree * (withdrawtax / 100))) : 0;
  const balanceUSD = frmtNb(Number(farmData.balance) * Number(priceData[2]));
  dataSet.balanceUSD = balanceUSD;
  const sflwithdraw = frmtNb(withdrawsflFree + withdrawSflNotFreeTaxed);
  dataSet.sflwithdraw = sflwithdraw;
  const usdwithdraw = frmtNb(Number(sflwithdraw) * Number(priceData[2]));
  dataSet.usdwithdraw = usdwithdraw;
  const xfishcastmax = fishingDetails && (!TryChecked ? fishingDetails.CastMax : fishingDetails.CastMaxtry);
  const xfishcost = fishingDetails && ((!TryChecked ? fishingDetails.CastCost : fishingDetails.CastCosttry) / coinsRatio);
  const fishcasts = fishingDetails && (fishingDetails.casts + "/" + xfishcastmax);
  const fishcosts = fishingDetails && (parseFloat(fishingDetails.casts * xfishcost).toFixed(3) + "/" + parseFloat(xfishcastmax * xfishcost).toFixed(3));

  useEffect(() => {
    loadCookie();
  }, []);
  const intervalRef = useRef(null);
  useEffect(() => {
    //loadCookie();
    const fetchData = async () => {
      try {
        await getPrices();
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    };
    //fetchData();
    if (!isAbo) {
      //console.log("not abo");
      setTimeout(() => {
        if (farmData.balance) {
          fetchData();
        }
      }, 19 * 1000);
    }
    const startInterval = () => {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          if (farmData.balance) {
            fetchData();
          }
        }, 60 * 1000);
      }
    };
    const clearIntervalIfExists = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        startInterval();
      } else {
        clearIntervalIfExists();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    if (document.visibilityState === 'visible') {
      startInterval();
    }
    return () => {
      clearIntervalIfExists();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [farmData?.balance]);
  useEffect(() => {
    if (selectedInv === "home") {
      try {
        const xhomeData = setHome(dataSet, xListeColBounty, handleHomeClic, isOpen);
        sethomeData(xhomeData);
        setMutants(mutantchickens);
        setsTickets(sTickets);
        if (farmData.balance) { setCookie() }
      } catch (error) {
        //localStorage.clear();
        console.log(error);
      }
    }
    if (selectedInv === "inv") {
      try {
        setInv();
        if (farmData.balance) { setCookie() }
      } catch (error) {
        //localStorage.clear();
        console.log(error);
      }
    }
    if (selectedInv === "cook") {
      try {
        setCook();
        if (farmData.balance) { setCookie() }
      } catch (error) {
        //localStorage.clear();
        //console.log("Error, cleared local data");
        console.log(error);
      }
    }
    if (selectedInv === "fish") {
      try {
        setFish();
        if (farmData.balance) { setCookie() }
      } catch (error) {
        //localStorage.clear();
        //console.log("Error, cleared local data");
        console.log(error);
      }
    }
    if (selectedInv === "flower") {
      try {
        setFlower();
        if (farmData.balance) { setCookie() }
      } catch (error) {
        //localStorage.clear();
        //console.log("Error, cleared local data");
        console.log(error);
      }
    }
    if (selectedInv === "bounty") {
      try {
        setBounty();
        if (farmData.balance) { setCookie() }
      } catch (error) {
        //localStorage.clear();
        //console.log("Error, cleared local data");
        console.log(error);
      }
    }
    if (selectedInv === "animal") {
      try {
        setAnimals();
        if (farmData.balance) { setCookie() }
      } catch (error) {
        //localStorage.clear();
        //console.log("Error, cleared local data");
        console.log(error);
      }
    }
    if (selectedInv === "map") {
      try {
        setMap();
        if (farmData.balance) { setCookie() }
      } catch (error) {
        //localStorage.clear();
        //console.log("Error, cleared local data");
        console.log(error);
      }
    }
    if (selectedInv === "expand") {
      try {

        setExpand();
        if (farmData.balance) { setCookie() }
      } catch (error) {
        //localStorage.clear();
        //console.log("Error, cleared local data");
        console.log(error);
      }
    }
    if (selectedInv === "activity") {
      //try {
      if (activityDisplay === "day") {
        setActivityDay();
      }
      if (activityDisplay === "item") {
        setActivityItem();
      }
      if (activityDisplay === "quest") {
        setActivityQuest();
      }
      if (farmData.balance) { setCookie() }
      /* } catch {
        //localStorage.clear();
        //console.log("Error, cleared local data");
      } */
    }
  }, [farmData, itData, selectedCurr, selectedQuant, selectedQuantCook, selectedQuantFish, selectedQuantity, selectedQuantityCook, selectedCostCook,
    selectedReady, selectedDsfl, selectedInv, inputMaxBB, inputKeep, inputFarmTime, inputAnimalLvl, inputCoinsRatio, deliveriesData, HarvestD,
    xListeCol, xListeColCook, xListeColFish, xListeColFlower, xListeColExpand, xListeColAnimals, xListeColActivity,
    xListeColActivityItem, CostChecked, TryChecked, BurnChecked, cstPrices, fromtolvltime, inputFromLvl, inputToLvl, fromtoexpand, activityData,
    activityDisplay, ftradesData, isOpen]);
  /* useEffect(() => {
    console.log("InputValue a changé :", inputValue);
  }, [inputValue]); */
  useEffect(() => {
    if (inputFromLvl > 0 && inputToLvl < 100) { getxpFromToLvl(inputFromLvl, inputToLvl, xdxp) }
  }, [dailyxp]);
  useEffect(() => {
    getFromToExpand(fromexpand + 1, toexpand, selectedExpandType);
  }, [fromexpand, toexpand, selectedExpandType]);
  useEffect(() => {
    if (selectedInv === "activity") {
      getActivity();
    }
  }, [selectedFromActivity, selectedFromActivityDay, selectedInv, activityDisplay]);

  return (
    <>
      <div className="App">
        <div className="top-frame">
          <h1 className="App-h1">
            <div className="vertical">
              <div style={{ pointerEvents: 'none' }}>{username !== "" ? username + " lvl" + bumpkinData[0].lvl : <span>Farm ID or name</span>}</div>
              <div class="horizontal">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleButtonClick(true);
                    }
                  }}
                  style={{ width: '65px' }}
                />
                <button onClick={handleButtonClick} class="button"><img src="./icon/ui/search.png" alt="" className="resico" /></button>
              </div>
              {farmData.balance ? (
                <div className="vertical" style={{ transform: 'translate(105px, 0%)' }}>
                  <div className="horizontal">
                    <button onClick={handleButtonfTNFTClick} title="NFT" class="button">
                      <img src="./icon/ui/lightning.png" alt="" className="itico" />
                    </button>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={TryChecked}
                          onChange={handleTryCheckedChange}
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
            {/* <div className="don">if you would like to give MATIC to help keep server running : <a id="copy-link" href="#" onClick={(event) => handleDonClick("0xAc3c7f9f1f8492Cc10A4fdb8C738DD82013d61dA", event.target)}>0xAc3c7f9f1f8492Cc10A4fdb8C738DD82013d61dA</a></div> */}
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
                      <Select value={selectedCurr} onChange={handleChangeCurr}>
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
                  <button onClick={handleButtonOptionsClick} title="Options" class="button"><img src="./options.png" alt="" className="itico" /></button>
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
                <div class="horizontal" onClick={(e) => handleTooltip("", "balance", "", e, dataSet)} style={{ margin: "0", padding: "0" }}>
                  <img src="./icon/res/flowertoken.webp" alt="" title={`${balanceUSD}usd-${withdrawtax}% = ${sflwithdraw}sfl = ${usdwithdraw}usd (${taxFreeSFL}sfl free)`} />
                  {frmtNb(farmData.balance)}
                  {PBarSFL()}
                  {isBanned ? isBanned : null}
                  {mutData ? mutData : null}
                </div>
              </>) : null}
              <p className="reqstat">{reqState}</p>
            </div>
            {farmData.balance ? (<>
              <div className="tabletrades" onClick={(e) => handleTooltip("", "trades", "", e, dataSet)} style={{ margin: "0", padding: "0" }}>
                {<>{ftradesData ? ftradesData : ""}</>}
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'left', height: '20px', width: '180px', top: '1px', overflow: 'hidden', margin: "0", padding: "0" }}>
                <div className="selectinvback" style={{ display: 'flex', alignItems: 'left', height: '20px', width: '110px', overflow: 'hidden', margin: "0", padding: "0" }}>
                  <FormControl variant="standard" id="formselectinv" className="selectinv" size="small" style={{ width: '100px', margin: "0", padding: "0" }}>
                    <InputLabel></InputLabel>
                    <Select value={selectedInv} onChange={handleChangeInv}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            '& .MuiMenuItem-root': {
                              color: 'black', // Couleur du texte des éléments du menu
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
                      <MenuItem value="map"><img src="./icon/ui/world.png" alt="" className="itico" />Map</MenuItem>
                      <MenuItem value="expand"><img src="./icon/tools/hammer.png" alt="" className="itico" />Expand</MenuItem>
                      {isAbo ? <MenuItem value="activity"><img src="./icon/ui/stopwatch.png" alt="" className="itico" />Activity</MenuItem> : null}
                    </Select>
                  </FormControl>
                </div>
                {selectedInv === "activity" ? (
                  <div className="selectinvback" style={{ display: 'flex', alignItems: 'left', height: '20px', width: '75px', margin: "0", padding: "0" }}>
                    <FormControl variant="standard" id="formselectinv" className="selectinv" size="small">
                      <InputLabel></InputLabel>
                      <Select value={activityDisplay} onChange={handleChangeActivityDisplay}>
                        <MenuItem value="day">/Day</MenuItem>
                        <MenuItem value="item">/Item</MenuItem>
                        <MenuItem value="quest">/Quest</MenuItem>
                      </Select>
                    </FormControl>
                  </div>) : null}
              </div>
            </>) : null}
          </div>
        </div>
        <div className="table-container">
          {farmData.balance ? (
            (() => {
              const componentsMap = {
                home: homeData || null,
                inv: invData || null,
                cook: cookData || null,
                fish: (
                  <>
                    <span>
                      <img src={imgrod} alt="" className="itico" title="Daily casts" />
                      {fishcasts} - Cost: {fishcosts}
                    </span>
                    {fishData || null}
                  </>
                ),
                flower: flowerData || null,
                bounty: bountyData || null,
                animal: animalData || null,
                map: mapData || null,
                expand: expandData || null,
                activity: activityTable || null,
              };

              return componentsMap[selectedInv] || null;
            })()
          ) : null}
        </div>
        {showOptions && (
          <ModalOptions onClose={() => {
            handleCloseOptions();
            const hasChanged = JSON.stringify(initialDataSet) !== JSON.stringify(dataSet);
            if (hasChanged) {
              handleButtonClick();
            }
          }}
            dataSet={dataSet}
            onFarmTimeChange={handleFarmTimeChange}
            onMaxBBChange={handleMaxBBChange}
            onCoinsRatioChange={handleCoinsRatioChange}
            onAnimalLvlChange={handleAnimalLvlChange}
          />
        )}
        {showfGraph && (
          <ModalGraph onClose={handleClosefGraph} graphtype={GraphType} frmid={lastClickedInputValue.current} it={it} API_URL={API_URL} />
        )}
        {showfTNFT && (
          <ModalTNFT onClose={(dataSet) => { handleClosefTNFT(dataSet) }}
            frmid={lastClickedInputValue.current} coinsRatio={coinsRatio} API_URL={API_URL} dataSet={dataSet} />
        )}
        {showfDlvr && (
          <ModalDlvr
          onClose={() => { handleClosefDlvr() }}
          tableData={deliveriesData}
          imgtkt={imgtkt}
          coinsRatio={coinsRatio}
          TryChecked={TryChecked}
          handleTryCheckedChange={handleTryCheckedChange}
          />
        )}
        {showCadre && (
          <Cadre onClose={handleCloseCadre} tableData={listingsData} Platform={platformListings} frmid={lastClickedInputValue.current} />
        )}
        {tooltipData && (
          <Tooltip
            onClose={() => setTooltipData(null)}
            clickPosition={tooltipData}
            item={tooltipData.item}
            context={tooltipData.context}
            value={tooltipData.value}
            dataSet={dataSet}
          />
        )}
      </div >
    </>
  );
  function setCookie() {
    try {
      const bvversion = vversion;
      const bFarmitArray = Object.entries(bFarmit).map(([key, value]) => ({ name: key, value }));
      const bCookitArray = Object.entries(bCookit).map(([key, value]) => ({ name: key, value }));

      const filteredTryit = filterTryit(true);
      const bTrynftArray = filteredTryit.bTrynftArray;
      const bTrynftwArray = filteredTryit.bTrynftwArray;
      const bTrybuildArray = filteredTryit.bTrybuildArray;
      const bTryskillArray = filteredTryit.bTryskillArray;
      const bTryskilllgcArray = filteredTryit.bTryskilllgcArray;
      const bTrybudArray = filteredTryit.bTrybudArray;

      const xHrvstArray = Object.entries(xHrvst).map(([key, value]) => ({ name: key, value }));
      const xHrvsttryArray = Object.entries(xHrvsttry).map(([key, value]) => ({ name: key, value }));
      const xBurningArray = Object.entries(xBurning).map(([key, value]) => ({ name: key, value }));
      const fruitPlantedArray = Object.entries(fruitPlanted).map(([key, value]) => ({ name: key, value }));
      const dProdArray = Object.entries(dProd).map(([key, value]) => ({ name: key, value }));
      const dProdtryArray = Object.entries(dProdtry).map(([key, value]) => ({ name: key, value }));
      var dataToStore = {
        vversion: bvversion,
        inputValue: inputValue,
        inputKeep: inputKeep,
        inputMaxBB: dataSet.inputMaxBB,
        inputFarmTime: dataSet.inputFarmTime,
        inputAnimalLvl: dataSet.inputAnimalLvl,
        coinsRatio: dataSet.coinsRatio,
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
        TryChecked: TryChecked,
        CostChecked: CostChecked,
        xHrvst: xHrvstArray,
        xHrvsttry: xHrvsttryArray,
        xBurning: xBurningArray,
        cstPrices: cstPrices,
        bFarmit: bFarmitArray,
        bCookit: bCookitArray,
        bTrynft: bTrynftArray,
        bTrynftw: bTrynftwArray,
        bTrybuild: bTrybuildArray,
        bTryskill: bTryskillArray,
        bTryskilllgc: bTryskilllgcArray,
        bTrybud: bTrybudArray,
        fruitPlanted: fruitPlantedArray,
        dProd: dProdArray,
        dProdtry: dProdtryArray,
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
      if (cookieValue) {
        var loadedData = JSON.parse(cookieValue);
        //console.log("loadC: " + loadedData);
        if (loadedData.vversion !== vversion) {
          localStorage.removeItem("SFLManData");
          console.log("Cleared local data to fit newer version");
          return;
        }
        vversion = loadedData.vversion;
        setInputValue(loadedData.inputValue);
        setInputKeep(loadedData.inputKeep);
        lastClickedInputKeep.current = loadedData.inputKeep;
        setInputMaxBB(loadedData.inputMaxBB);
        //vinputMaxBB = loadedData.inputMaxBB;
        dataSet.inputMaxBB = loadedData.inputMaxBB;
        setInputFarmTime(loadedData.inputFarmTime);
        //vinputFarmTime = loadedData.inputFarmTime;
        dataSet.inputFarmTime = loadedData.inputFarmTime;
        setInputAnimalLvl(loadedData.inputAnimalLvl);
        //vinputAnimalLvl = loadedData.inputAnimalLvl;
        dataSet.inputAnimalLvl = loadedData.inputAnimalLvl;
        //coinsRatio = loadedData.coinsRatio || 320;
        dataSet.coinsRatio = loadedData.coinsRatio || 320;
        setInputFromLvl(loadedData.inputFromLvl);
        setInputToLvl(loadedData.inputToLvl);
        setCstPrices(loadedData.cstPrices);
        //setSelectedInv(loadedData.selectedInv);
        setSelectedInv("home");
        setSelectedCurr(loadedData.selectedCurr);
        setSelectedDsfl(loadedData.selectedDsfl);
        setSelectedQuantity(loadedData.selectedQuantity);
        setSelectedQuant(loadedData.selectedQuant);
        setSelectedQuantityCook(loadedData.selectedQuantityCook);
        setSelectedQuantCook(loadedData.selectedQuantCook);
        setSelectedQuantFish(loadedData.selectedQuantFish);
        setXListeCol(loadedData.xListeCol);
        setXListeColCook(loadedData.xListeColCook && loadedData.xListeColCook);
        setXListeColFish(loadedData.xListeColFish && loadedData.xListeColFish);
        setXListeColExpand(loadedData.xListeColExpand && loadedData.xListeColExpand);
        setXListeColActivity(loadedData.xListeColActivity && loadedData.xListeColActivity);
        setXListeColActivityItem(loadedData.xListeColActivityItem && loadedData.xListeColActivityItem);
        setTryChecked(loadedData.TryChecked);
        setCostChecked(loadedData.CostChecked);
        xHrvst = loadedData.xHrvst.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {});
        xHrvsttry = loadedData.xHrvsttry.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {});
        xBurning = loadedData.xBurning.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {});
        bFarmit = loadedData.bFarmit.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {});
        bCookit = loadedData.bCookit.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {});

        let bTrynft = loadedData.bTrynft.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {});
        let bTrynftw = loadedData.bTrynftw.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {});
        let bTrybuildng = loadedData.bTrybuild.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {});
        let bTryskill = loadedData.bTryskill.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {});
        let bTryskilllgc = loadedData.bTryskilllgc.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {});
        let bTrybud = loadedData.bTrybud.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {});

        Object.entries(nft).forEach(([item]) => { nft[item].tryit = bTrynft[item]; });
        Object.entries(nftw).forEach(([item]) => { nftw[item].tryit = bTrynftw[item]; });
        Object.entries(skill).forEach(([item]) => { skill[item].tryit = bTryskill[item]; });
        Object.entries(skilllgc).forEach(([item]) => { skilllgc[item].tryit = bTryskilllgc[item]; });
        Object.entries(buildng).forEach(([item]) => { buildng[item].tryit = bTrybuildng[item]; });
        Object.entries(bud).forEach(([item]) => { bud[item].tryit = bTrybud[item]; });

        fruitPlanted = loadedData.fruitPlanted.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {});
        dProd = loadedData.dProd.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {});
        dProdtry = loadedData.dProdtry.reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {});
      }
    }
    catch {
      localStorage.removeItem("SFLManData");
      //localStorage.clear();
      console.log("Error, cleared local data");
    }
  }
  async function getxpFromToLvl(xfrom, xto, xdxp) {
    const responseLVL = await fetch(API_URL + "/getfromtolvl", {
      method: 'GET',
      headers: {
        frmid: lastClickedInputValue.current,
        from: xfrom,
        to: xto,
        xdxp: xdxp,
      }
    });
    if (responseLVL.ok) {
      const responseDataLVL = await responseLVL.json();
      //console.log(responseData);
      //setpriceData(JSON.parse(JSON.stringify(responseData.priceData)));
      setfromtolvltime(responseDataLVL.time);
      setfromtolvlxp(responseDataLVL.xp);
    } else {
      console.log(`Error : ${responseLVL.status}`);
    }
  }
  async function getFromToExpand(xfrom, xto, xtype) {
    const responseExpand = await fetch(API_URL + "/getfromtoexpand", {
      method: 'GET',
      headers: {
        frmid: lastClickedInputValue.current,
        from: xfrom,
        to: xto,
        type: xtype,
        spot: spot
      }
    });
    if (responseExpand.ok) {
      const responseDataExp = await responseExpand.json();
      //console.log(responseData);
      //setpriceData(JSON.parse(JSON.stringify(responseData.priceData)));
      setfromtoexpand(responseDataExp);
    } else {
      console.log(`Error : ${responseExpand.status}`);
    }
  }
  async function getActivity() {
    if (lastClickedInputValue.current !== '') {
      const xContextTime = activityDisplay === "day" ? selectedFromActivityDay : activityDisplay === "item" ? selectedFromActivity : activityDisplay === "quest" ? "season" : "today";
      const responseActivity = await fetch(API_URL + "/getactivity", {
        method: 'GET',
        headers: {
          frmid: lastClickedInputValue.current,
          time: xContextTime,
        }
      });
      if (responseActivity.ok) {
        const responseDataActivity = await responseActivity.json();
        //console.log(responseData);
        //setpriceData(JSON.parse(JSON.stringify(responseData.priceData)));
        setActivityData(responseDataActivity);
      } else {
        console.log(`Error : ${responseActivity.status}`);
      }
    }
  }
  function refreshDataSet() {
    dataSet.it = it;
    dataSet.food = food;
    dataSet.fish = fish;
    dataSet.flower = flower;
    dataSet.bounty = bounty;
    dataSet.craft = craft;
    dataSet.nft = nft;
    dataSet.nftw = nftw;
    dataSet.skill = skill;
    dataSet.skilllgc = skilllgc;
    dataSet.buildng = buildng;
    dataSet.buildngf = buildngf;
    dataSet.bud = bud;
    dataSet.tool = tool;
    dataSet.compost = compost;
    dataSet.spot = spot;
    //dataSet.forTry = TryChecked;
    dataSet.ftrades = ftrades;
  }
}
function convTime(nombre) {
  if (nombre > 0 && nombre !== Infinity) {
    //if (nombre === "-Infinity" || nombre === "Infinity" || nombre === 0 || nombre === NaN) { return "00:00:00" }
    const heures = Math.floor(nombre * 24);
    const minutes = Math.floor(nombre * 24 * 60) % 60;
    const secondes = Math.floor(nombre * 24 * 60 * 60) % 60;
    const jours = Math.floor(heures / 24);
    const heuresFormat = heures % 24;
    const jourStr = jours > 0 ? jours.toString().padStart(2, '0') + ':' : '';
    const heureStr = heuresFormat.toString().padStart(2, '0');
    const minuteStr = minutes.toString().padStart(2, '0');
    const secondeStr = secondes.toString().padStart(2, '0');
    return jourStr + heureStr + ':' + minuteStr + ':' + secondeStr;
  } else {
    return '00:00:00';
  }
}
function convtimenbr(tempsFormat) {
  if (tempsFormat !== "" && tempsFormat !== 0) {
    const tempsArray = tempsFormat.split(':');
    let jours, heures, minutes, secondes;
    if (tempsArray.length === 3) {
      jours = 0;
      heures = parseInt(tempsArray[0], 10);
      minutes = parseInt(tempsArray[1], 10);
      secondes = parseInt(tempsArray[2], 10);
    } else if (tempsArray.length === 4) {
      jours = parseInt(tempsArray[0], 10);
      heures = parseInt(tempsArray[1], 10);
      minutes = parseInt(tempsArray[2], 10);
      secondes = parseInt(tempsArray[3], 10);
    } else {
      return 0;
    }
    var totalSecondes = (jours * 86400 + heures * 3600 + minutes * 60 + secondes);
    const nombre = totalSecondes / (24 * 60 * 60);
    return nombre;
  } else {
    return 0;
  }
}
function formatdate(timestamp) {
  if (timestamp < 3600 * 1000 * 24) { timestamp -= 3600 * 1000 }
  if (timestamp <= 0) { return 0 }
  var dateActuelle = new Date(timestamp);
  //var jours = dateActuelle.getDate();
  var heures = dateActuelle.getHours();
  var minutes = dateActuelle.getMinutes();
  //var secondes = dateActuelle.getSeconds();
  var dateFormatee = (
    //(jours < 10 ? "0" : "") + jours + ":" +
    (heures < 10 ? "0" : "") + heures + ":" +
    (minutes < 10 ? "0" : "") + minutes //+ ":" +
    //(secondes < 10 ? "0" : "") + secondes
  );
  return dateFormatee;
}
function formatDate(xDate, setUTC) {
  const currentDate = (xDate instanceof Date) ? xDate : new Date(xDate);
  var day = "";
  var month = "";
  var year = "";
  if (setUTC) {
    day = String(currentDate.getUTCDate()).padStart(2, '0');
    month = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
    year = String(currentDate.getUTCFullYear()).slice(-2);
  } else {
    day = String(currentDate.getDate()).padStart(2, '0');
    month = String(currentDate.getMonth() + 1).padStart(2, '0');
    year = String(currentDate.getFullYear()).slice(-2);
  }
  const dateNow = `${month}/${day}/${year}`;
  return dateNow;
}
function formatDateAndSupYr(xDate, setUTC) {
  const currentDate = (xDate instanceof Date) ? xDate : new Date(xDate);
  var day = "";
  var month = "";
  if (setUTC) {
    day = String(currentDate.getUTCDate()).padStart(2, '0');
    month = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
  } else {
    day = String(currentDate.getDate()).padStart(2, '0');
    month = String(currentDate.getMonth() + 1).padStart(2, '0');
  }
  const dateNow = `${month}/${day}`;
  return dateNow;
}
const getMaxValue = (value1, value2, value3) => {
  const positiveValues = [parseFloat(value1).toFixed(20), parseFloat(value2).toFixed(20), parseFloat(value3).toFixed(20)].filter(value => value > 0);
  return positiveValues.length > 0 ? parseFloat(Math.max(...positiveValues)).toFixed(20).toString() : null;
};
function setTryit(xnft, xnftw, xskill, xbuildng, xbud) {
  const nftEntries = Object.entries(xnft);
  const nftwEntries = Object.entries(xnftw);
  const sklEntries = Object.entries(xskill);
  const bldEntries = Object.entries(xbuildng);
  const budEntries = Object.entries(xbud);
  nftEntries.forEach(([item], index) => { bTrynft[item] = xnft[item].tryit });
  nftwEntries.forEach(([item], index) => { bTrynftw[item] = xnftw[item].tryit });
  sklEntries.forEach(([item], index) => { bTryskill[item] = xskill[item].tryit });
  bldEntries.forEach(([item], index) => { bTrybuild[item] = xbuildng[item].tryit });
  budEntries.forEach(([item], index) => { bTrybud[item] = xbud[item].tryit });
}
function setActive(xnft, xnftw, xskill, xbuildng, xbud) {
  const nftEntries = Object.entries(xnft);
  const nftwEntries = Object.entries(xnftw);
  const sklEntries = Object.entries(xskill);
  const bldEntries = Object.entries(xbuildng);
  const budEntries = Object.entries(xbud);
  nftEntries.forEach(([item], index) => { bnft[item] = xnft[item].isactive });
  nftwEntries.forEach(([item], index) => { bnftw[item] = xnftw[item].isactive });
  sklEntries.forEach(([item], index) => { bskill[item] = xskill[item].isactive });
  bldEntries.forEach(([item], index) => { bbuild[item] = xbuildng[item].isactive });
  budEntries.forEach(([item], index) => { bbud[item] = xbud[item].isactive });
}
function getTryit(xnft, xnftw, xskill, xbuildng, xbud) {
  const nftEntries = Object.entries(xnft);
  const nftwEntries = Object.entries(xnftw);
  const sklEntries = Object.entries(xskill);
  const bldEntries = Object.entries(xbuildng);
  const budEntries = Object.entries(xbud);
  nftEntries.forEach(([item], index) => { xnft[item].tryit = bTrynft[item] });
  nftwEntries.forEach(([item], index) => { xnftw[item].tryit = bTrynftw[item] });
  sklEntries.forEach(([item], index) => { xskill[item].tryit = bTryskill[item] });
  bldEntries.forEach(([item], index) => { xbuildng[item].tryit = bTrybuild[item] });
  budEntries.forEach(([item], index) => { xbud[item].tryit = bTrybud[item] });
}
function setFarmit(xit) {
  const itEntries = Object.entries(xit);
  itEntries.forEach(([item], index) => { bFarmit[item] = xit[item].farmit });
  //console.log(food);
}
function getFarmit(xit) {
  const itEntries = Object.entries(xit);
  itEntries.forEach(([item], index) => { xit[item].farmit = bFarmit[item] ? bFarmit[item] : 0 });
  //console.log(food);
}
function setCookit(xfood) {
  const itEntries = Object.entries(xfood);
  itEntries.forEach(([item], index) => { bCookit[item] = xfood[item].cookit });
  //console.log(food);
}
function getCookit(xfood) {
  const itEntries = Object.entries(xfood);
  itEntries.forEach(([item], index) => { xfood[item].cookit = bCookit[item] ? bCookit[item] : 0 });
  //console.log(food);
}
function filterTryit(toArray) {
  const result = {};
  let bTrynft = {};
  let bTrynftw = {};
  let bTrybuild = {};
  let bTryskill = {};
  let bTryskilllgc = {};
  let bTrybud = {};
  function xfilterTryit() {
    Object.entries(nft).forEach(([item]) => { bTrynft[item] = nft[item].tryit; });
    Object.entries(nftw).forEach(([item]) => { bTrynftw[item] = nftw[item].tryit; });
    Object.entries(skill).forEach(([item]) => { bTryskill[item] = skill[item].tryit; });
    Object.entries(skilllgc).forEach(([item]) => { bTryskilllgc[item] = skilllgc[item].tryit; });
    Object.entries(buildng).forEach(([item]) => { bTrybuild[item] = buildng[item].tryit; });
    Object.entries(bud).forEach(([item]) => { bTrybud[item] = bud[item].tryit; });
  }
  xfilterTryit();
  if (toArray) {
    result.bTrynftArray = Object.entries(bTrynft).map(([key, value]) => ({ name: key, value }));
    result.bTrynftwArray = Object.entries(bTrynftw).map(([key, value]) => ({ name: key, value }));
    result.bTrybuildArray = Object.entries(bTrybuild).map(([key, value]) => ({ name: key, value }));
    result.bTryskillArray = Object.entries(bTryskill).map(([key, value]) => ({ name: key, value }));
    result.bTryskilllgcArray = Object.entries(bTryskilllgc).map(([key, value]) => ({ name: key, value }));
    result.bTrybudArray = Object.entries(bTrybud).map(([key, value]) => ({ name: key, value }));
    return result;
  } else {
    result.bTrynft = bTrynft;
    result.bTrynftw = bTrynftw;
    result.bTrybuild = bTrybuild;
    result.bTryskill = bTryskill;
    result.bTryskilllgc = bTryskilllgc;
    result.bTrybud = bTrybud;
    return result;
  }
}
function MergeIt(xit, xittry) {
  const ittryEntries = Object.entries(xittry);
  ittryEntries.forEach(([item], index) => {
    xit[item].costtry = xittry[item].costtry;
    xit[item].timetry = xittry[item].timetry;
    xit[item].harvesttry = xittry[item].harvesttry;
    xit[item].harvestdmaxtry = xittry[item].harvestdmaxtry;
    xit[item].stocktry = xittry[item].stocktry;
    xit[item].myieldtry = xittry[item].myieldtry;
    xit[item].mtimetry = xittry[item].mtimetry;
  });
}
function MergeFood(xfood, xfoodtry) {
  const ittryEntries = Object.entries(xfoodtry);
  ittryEntries.forEach(([item], index) => {
    xfood[item].costtry = xfoodtry[item].costtry;
    xfood[item].timetry = xfoodtry[item].timetry;
    xfood[item].timecrptry = xfoodtry[item].timecrptry;
    xfood[item].xptry = xfoodtry[item].xptry;
    xfood[item].xphtry = xfoodtry[item].xphtry;
  });
}
function MergeFish(xfish, xfishtry) {
  const ittryEntries = Object.entries(xfishtry);
  ittryEntries.forEach(([item], index) => {
    xfish[item].xptry = xfishtry[item].xptry;
    xfish[item].costtry = xfishtry[item].costtry;
  });
}
function MergeBounty(xbounty, xbountytry) {
  const bountytryEntries = Object.entries(xbountytry);
  bountytryEntries.forEach(([item], index) => {
    xbounty[item].costtry = xbountytry[item].costtry;
  });
}
function MergeFishing(xFishing, xFishingtry) {
  xFishing["CastCosttry"] = xFishingtry["CastCosttry"];
  xFishing["CastMaxtry"] = xFishingtry["CastMaxtry"];
}
function getPlanted(xit) {
  const itEntries = Object.entries(xit);
  itEntries.forEach(([item], index) => {
    if (xit[item].cat === "fruit") { fruitPlanted[item] = xit[item].planted }
  });
}
function setPlanted(xit) {
  const itEntries = Object.entries(xit);
  itEntries.forEach(([item], index) => {
    if (xit[item].cat === "fruit") { xit[item].planted = fruitPlanted[item] }
  });
}

export default App;