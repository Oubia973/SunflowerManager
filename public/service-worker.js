self.addEventListener('push', async function (event) {
  const data = event.data.json();
  let items = [];
  if (Array.isArray(data)) {
    items = data.map(item => item.item || item);
  } else if (typeof data === "object" && data !== null) {
    items = Object.keys(data);
  }

  /* const iconMap = {
    'Crop': '🌱',
    'Alert': '🚨',
    'Carrot': '🥕',
    'Wheat': '🌾',
  };
   const emojis = {
        "Tree": "🌳", "Stone": "🪨", "Iron": "⚒️", "Gold": "⚜️", "Crimstone": "💎", "Sunstone": "🏵️", "Oil": "🛢️",
        "Sunflower": "🌻", "Potato": "🥔", "Pumpkin": "🎃", "Carrot": "🥕", "Corn": "🌽", "Wheat": "🌾", "Cabbage": "🥬", "Broccoli": "🥦",
        "Tomato": "🍅", "Apple": "🍎", "Banana": "🍌", "Orange": "🍊", "Lemon": "🍋", "Blueberry": "🫐",
        "Chicken": "🐔", "Cow": "🐄", "Sheep": "🐑",
        "Rice": "🍚", "Olive": "🫒", "Grape": "🍇",
        "Beehive": "🍯",
        "Mushroom": "🍄", "Magic Mushroom": "🍄‍🟫",
        "Mashed Potato": "🥔", "Pumpkin Soup": "🍲", "Mushroom Soup": "🍄",
        "Pancakes": "🥞", "Apple Pie": "🥧", "Honey Cake": "🍰",
        "Cheese": "🧀", "Apple Juice": "🧃", "Premium Composter": "♻️",
        "Turbo Composter": "⚡", "Compost Bin": "🗂️",
    };
  const bodyText = items.map(item => {
    const emoji = iconMap[item] || '🔔';
    return `${emoji} ${item}`;
  }).join('\n'); */

  const existingNotifications = await self.registration.getNotifications({ tag: 'sunflowerman-notif' });
  let previousItems = [];
  if (existingNotifications.length > 0) {
    // Récupère le body de la notif précédente
    const prevBody = existingNotifications[0].body;
    if (prevBody) {
      previousItems = prevBody.split('\n');
    }
  }

  // Fusionne les anciennes et nouvelles notifications (évite les doublons)
  const allItems = Array.from(new Set([...previousItems, ...items]));

  const bodyText = allItems.join('\n');
  self.registration.showNotification('Sunflower Manager', {
    body: bodyText,
    icon: './logo192.png',
    tag: 'sunflowerman-notif',
    renotify: true
  });
});