(() => {
  const TOOLKIT_VERSION = "2026.11.10.2";
  /*
   * COOKIE CLICKER TOOLKIT
   * Paste this entire file into the browser console.
   */

  /* MASTER SWITCH */
  const MASTER_ON = true;

  /* COOKIE MONSTER */
  const LOAD_COOKIE_MONSTER = true;
  const COOKIE_MONSTER_URL =
    "https://cookiemonsterteam.github.io/CookieMonster/dist/CookieMonster.js";

  /* BIG COOKIE AUTOCLICKER */
  const AUTO_CLICK_BIG_COOKIE = true;
  const BIG_COOKIE_CLICK_INTERVAL_MS = 0.1;
  const USE_WORKER_CLICK_TIMER = true;

  /* GOLDEN COOKIE AUTOCLICKER */
  const AUTO_CLICK_GOLDEN_COOKIES = true;
  const CLICK_WRATH_COOKIES = true;
  const AUTO_CLICK_REINDEER = true;
  const GOLDEN_COOKIE_CHECK_MS = 100;
  /* Direct clicking buffs trigger Godzamok and pause normal purchases.
   * The data-field check below also catches future click-power buffs. */
  const CLICK_POWER_BUFF_NAMES = new Set([
    "click frenzy",
    "dragonflight",
    "cursed finger",
    "devastation"
  ]);

  /* AUTOBUYER */
  const AUTO_BUY_RECOMMENDED_ITEMS = true;
  const AUTO_BUY_BLUE_ITEMS = true;
  const AUTO_BUY_GREEN_ITEMS = true;
  const AUTO_BUY_TIME_SAVING_OTHER_ITEMS = true;
  const MIN_OTHER_ITEM_TIME_SAVED_SECONDS = 0.25;
  const AUTO_BUY_BUILDINGS = true;
  const AUTO_BUY_WIZARD_TOWERS = true;
  const AUTO_SELL_WIZARD_FOR_FTHOF = true;
  const AUTO_RESTORE_WIZARD_TOWERS_AFTER_FTHOF = true;
  const FTHOF_TOWER_RESTORE_IGNORE_RESERVE = false;
  const FTHOF_TOWER_REBUILD_ACTIONS_PER_TICK = 4;
  const AUTO_BUY_UPGRADES = true;
  const AUTO_BUY_TOGGLE_UPGRADES = false;
  const AUTO_BUY_EXTRA_UPGRADES = true;
  const AUTO_BUY_RESEARCH_UPGRADES = true;
  const AUTO_BUY_ONE_MIND = false;
  const AUTO_CONFIRM_ONE_MIND = true;
  const AUTO_MANAGE_PANTHEON = true;
  const RESEARCH_UPGRADE_NAMES = [
    "Bingo center/Research facility",
    "Specialized chocolate chips",
    "Designer cocoa beans",
    "Ritual rolling pins",
    "Underworld ovens",
    "One mind",
    "Exotic nuts",
    "Communal brainsweep",
    "Arcane sugar",
    "Elder Pact",
    "Sacrificial rolling pins",
    "Elder Pledge",
    "Elder Covenant"
  ];
  const BUY_LUCKY_UPGRADES_IMMEDIATELY = true;
  const GOLDEN_COOKIE_PRIORITY_UPGRADES = [
    "Lucky day",
    "Serendipity",
    "Get lucky"
  ];
  const MOUSE_PRIORITY_UPGRADES = [
    "Plastic mouse",
    "Iron mouse",
    "Titanium mouse",
    "Adamantium mouse",
    "Unobtainium mouse",
    "Eludium mouse",
    "Wishalloy mouse",
    "Fantasteel mouse",
    "Nevercrack mouse",
    "Armythril mouse",
    "Technobsidian mouse",
    "Plasmarble mouse",
    "Miraculite mouse",
    "Aetherice mouse",
    "Omniplast mouse"
  ];
  const EXTRA_UPGRADE_NAMES = [
    ...GOLDEN_COOKIE_PRIORITY_UPGRADES,
    ...MOUSE_PRIORITY_UPGRADES
  ];
  const RESERVE_NEUTRAL_UPGRADE_NAMES = new Set(EXTRA_UPGRADE_NAMES);
  const BUILDING_BULK_AMOUNTS = [1, 10, 100];
  const AUTO_BUY_CHECK_MS = 10;
  const AUTO_BUY_COOLDOWN_MS = 20;
  const TARGET_SNAPSHOT_MS = 90;

  /* STRATEGY PROFILES */
  const DEFAULT_STRATEGY_PROFILE_ID = "early-active";
  const STRATEGY_PROFILES = Object.freeze({
    "early-active": Object.freeze({
      label: "Early game, active",
      timeSavingOtherItems: true,
      priority: "blue-first",
      reserveMode: "smart",
      grandmapocalypseStageCap: 1,
      wrinklerMode: "smart",
      protectShinyWrinklers: true,
      ascensionPlanId: "early-progression",
      chainProtection: false,
      dragonMode: "milk-only"
    }),
    "mid-active": Object.freeze({
      label: "Mid game, active",
      timeSavingOtherItems: true,
      priority: "blue-first",
      reserveMode: "none",
      grandmapocalypseStageCap: 3,
      wrinklerMode: "smart",
      protectShinyWrinklers: true,
      ascensionPlanId: "mid-progression",
      chainProtection: false,
      dragonMode: "safe-full"
    })
  });
  const DEFAULT_STRATEGY_PROFILE =
    STRATEGY_PROFILES[DEFAULT_STRATEGY_PROFILE_ID];

  /* COOKIE CHAIN BANK PROTECTION */
  const PROTECT_COOKIE_CHAINS = true;
  const DEFAULT_CHAIN_MODE = "normal"; // "normal" or "frenzy"
  const PROTECT_WRATH_COOKIE_CHAINS = true;

  /* GRANDMAPOCALYPSE AND WRINKLERS
   * Stage cap: 0 blocks One mind, 1 allows One mind,
   * 2 allows Communal brainsweep, 3 allows Elder Pact.
   * Wrinkler modes: smart, hold, farm.
   */
  const DEFAULT_GRANDMAPOCALYPSE_STAGE_CAP =
    DEFAULT_STRATEGY_PROFILE.grandmapocalypseStageCap;
  const DEFAULT_WRINKLER_MODE = DEFAULT_STRATEGY_PROFILE.wrinklerMode;
  const DEFAULT_PROTECT_SHINY_WRINKLERS =
    DEFAULT_STRATEGY_PROFILE.protectShinyWrinklers;
  const WRINKLER_CHECK_MS = 1000;
  const WRINKLER_POP_COOLDOWN_MS = 2000;

  /* SUGAR LUMP AUTOMATION */
  const AUTO_MANAGE_SUGAR_LUMPS = true;
  const AUTO_HARVEST_RIPE_SUGAR_LUMPS = true;
  const SUGAR_LUMP_RESERVE = 0;
  const SUGAR_LUMP_CHECK_MS = 1000;
  const SUGAR_LUMP_PLAN = [
    { building: "Wizard tower", targetLevel: 1 },
    { building: "Temple", targetLevel: 1 },
    { building: "Farm", targetLevel: 1 },
    { building: "Bank", targetLevel: 1 },
    { building: "Farm", targetLevel: 9 }
  ];

  /* GRIMOIRE AUTOMATION */
  const AUTO_CAST_FORCE_THE_HAND_OF_FATE = true;
  const FTHOF_REQUIRE_FRENZY = true;
  const FTHOF_CHECK_MS = 100;
  const FTHOF_BASE_BUFFS = [
    "Frenzy",
    "Dragon Harvest",
    "Elder frenzy",
    "High-five",
    "Congregation",
    "Luxuriant harvest",
    "Ore vein",
    "Oiled-up",
    "Juicy profits",
    "Fervent adoration",
    "Manabloom",
    "Delicious lifeforms",
    "Breakthrough",
    "Righteous cataclysm",
    "Golden ages",
    "Extra cycles",
    "Solar flare",
    "Winning streak",
    "Macrocosm",
    "Refactoring",
    "Cosmic nursery",
    "Brainstorm"
  ];

  /* GODZAMOK COMBO AUTOMATION */
  const AUTO_GODZAMOK_COMBOS = true;
  const GODZAMOK_CHECK_MS = 100;
  const GODZAMOK_MIN_BUFF_SECONDS = 3;
  const GODZAMOK_MODE = "maximum-combo";
  const GODZAMOK_SELL_FRACTION = 0.9;
  const GODZAMOK_MAX_SELL_PER_BUILDING = 400;
  const GODZAMOK_KEEP_PER_BUILDING = 25;
  const GODZAMOK_MAX_COMBO_SELL_PER_BUILDING = 1000;
  const GODZAMOK_FORECAST_RATE_FRACTION = 0.8;
  const GODZAMOK_PROFIT_MARGIN = 1.25;
  /* Recovery ignores target colours, but preserves the pre-sale bank reserve. */
  const GODZAMOK_REBUILD_ACTIONS_PER_TICK = 100;
  const GODZAMOK_BUILDINGS = [
    "Farm",
    "Mine",
    "Factory",
    "Bank",
    "Temple",
    "Wizard tower",
    "Shipment",
    "Alchemy lab",
    "Time machine"
  ];

  /* DRAGON AUTOMATION
   * Safe full training preserves the active bank reserve and immediately
   * rebuilds every building sacrificed for training or aura changes.
   * Milk only stops after unlocking and equipping Breath of Milk.
   */
  const AUTO_MANAGE_DRAGON = true;
  const DEFAULT_DRAGON_MODE = "safe-full";
  const DRAGON_CHECK_MS = 500;
  const DRAGON_ACTION_COOLDOWN_MS = 1000;
  const DRAGON_COOKIE_STEP_COSTS = [1e6, 2e6, 4e6, 8e6, 16e6];

  /* ASCENSION AUTOMATION
   * Modes: off, ready, automatic.
   * Automatic mode also requires the separate Arm checkbox in the panel.
   * Add future plans here. The panel and state machine populate dynamically.
   */
  const DEFAULT_ASCENSION_MODE = "ready";
  const DEFAULT_ASCENSION_PLAN_ID = "early-progression";
  const ASCENSION_CHECK_MS = 500;
  const TARGET_LUCKY_DIGIT = true;
  const AUTO_REINCARNATE_AFTER_ASCENSION = false;
  const ASCENSION_PREPARE_SETTLE_MS = 1500;
  const ASCENSION_STEP_TIMEOUT_MS = 30000;
  const TURN_OFF_BANK_RESERVES_AFTER_ASCENSION = true;
  const ASCENSION_PLANS = Object.freeze({
    "early-progression": Object.freeze({
      label: "Early progression, adaptive",
      stages: Object.freeze([
        Object.freeze({
          id: "first",
          label: "First ascension",
          guideCost: 365,
          heavenlyUpgrades: Object.freeze([
            "Legacy",
            "Heavenly cookies",
            "How to bake your dragon",
            "Box of brand biscuits",
            "Tin of british tea biscuits",
            "Box of macarons",
            "Heavenly luck",
            "Permanent upgrade slot I",
            "Heralds"
          ])
        }),
        Object.freeze({
          id: "second",
          label: "Second ascension",
          guideCost: 2185,
          heavenlyUpgrades: Object.freeze([
            "Tin of butter cookies",
            "Starter kit",
            "Golden switch",
            "Season switcher"
          ])
        }),
        Object.freeze({
          id: "third",
          label: "Third ascension",
          guideCost: 12409,
          heavenlyUpgrades: Object.freeze([
            "Twin Gates of Transcendence",
            "Angels",
            "Classic dairy selection",
            "Archangels",
            "Basic wallpaper assortment",
            "Virtues",
            "Persistent memory",
            "Dominions",
            "Kitten angels"
          ])
        })
      ]),
      permanentSlot: "highest-kitten",
      nextPlanId: "mid-progression"
    }),
    "mid-progression": Object.freeze({
      label: "Mid game progression, active",
      stages: Object.freeze([
        Object.freeze({
          id: "fourth",
          label: "Fourth ascension",
          guideCost: 62217,
          heavenlyUpgrades: Object.freeze([
            "Halo gloves",
            "Lasting fortune",
            "Lucky digit",
            "Starter kitchen"
          ])
        }),
        Object.freeze({
          id: "fifth",
          label: "Fifth ascension",
          guideCost: 127776,
          heavenlyUpgrades: Object.freeze([
            "Permanent upgrade slot II",
            "Residual luck",
            "Decisive fate"
          ])
        }),
        Object.freeze({
          id: "sixth",
          label: "Sixth ascension",
          guideCost: 825019,
          heavenlyUpgrades: Object.freeze([
            "Belphegor",
            "Mammon",
            "Abaddon",
            "Satan",
            "Synergies Vol. I",
            "Divine discount",
            "Divine sales",
            "Divine bakeries"
          ])
        }),
        Object.freeze({
          id: "seventh",
          label: "Seventh ascension",
          guideCost: 2568911,
          heavenlyUpgrades: Object.freeze([
            "Asmodeus",
            "Beelzebub",
            "Cherubim",
            "Seraphim",
            "Synergies Vol. II",
            "Lucky number"
          ])
        }),
        Object.freeze({
          id: "eighth",
          label: "Eighth ascension",
          guideCost: 32900000,
          heavenlyUpgrades: Object.freeze([
            "Inspired checklist",
            "Genius accounting",
            "Label printer",
            "Unshackled flavor",
            "Unshackled cursors"
          ])
        })
      ]),
      permanentSlot: "highest-kitten"
    })
  });
  const ASCENSION_UPGRADE_COSTS = Object.freeze({
    Legacy: 1,
    "Heavenly cookies": 3,
    "How to bake your dragon": 9,
    "Box of brand biscuits": 25,
    "Tin of british tea biscuits": 25,
    "Box of macarons": 25,
    "Heavenly luck": 77,
    "Permanent upgrade slot I": 100,
    Heralds: 100,
    "Tin of butter cookies": 25,
    "Starter kit": 50,
    "Golden switch": 999,
    "Season switcher": 1111,
    "Twin Gates of Transcendence": 1,
    Angels: 7,
    "Classic dairy selection": 9,
    Archangels: 49,
    "Basic wallpaper assortment": 99,
    Virtues: 343,
    "Persistent memory": 500,
    Dominions: 2401,
    "Kitten angels": 9000,
    "Halo gloves": 55555,
    "Lasting fortune": 777,
    "Lucky digit": 777,
    "Starter kitchen": 5000,
    "Permanent upgrade slot II": 20000,
    "Residual luck": 99999,
    "Decisive fate": 7777,
    Belphegor: 7,
    Mammon: 49,
    Abaddon: 343,
    Satan: 2401,
    "Synergies Vol. I": 222222,
    "Divine discount": 99999,
    "Divine sales": 99999,
    "Divine bakeries": 399999,
    Asmodeus: 16807,
    Beelzebub: 16807,
    Cherubim: 117649,
    Seraphim: 117649,
    "Synergies Vol. II": 2222222,
    "Lucky number": 77777,
    "Fanciful dairy selection": 1000000,
    "Wrapping paper": 999999,
    "Unholy bait": 44444,
    "Sacrilegious corruption": 444444,
    "Wrinkly cookies": 6666666,
    "Eye of the wrinkler": 99999999,
    "Genius accounting": 2000000,
    "Label printer": 5000000,
    "Unshackled flavor": 10000000,
    "Unshackled cursors": 15000000,
    "Inspired checklist": 900000,
    "Genius accounting": 2000000,
    "Label printer": 5000000,
    "Unshackled flavor": 10000000,
    "Unshackled cursors": 15000000
  });

  /* CONTROL PANEL DEFAULTS
   * Priority choices:
   *   blue-first, green-first, cheapest,
   *   upgrades-first, buildings-first
   *
   * Reserve choices:
   *   smart, none, normal-lucky, frenzy-lucky,
   *   normal-conjure, frenzy-conjure
   */
  const SHOW_CONTROL_PANEL = true;
  const DEFAULT_PRIORITY = DEFAULT_STRATEGY_PROFILE.priority;
  const DEFAULT_RESERVE_MODE = DEFAULT_STRATEGY_PROFILE.reserveMode;

  /* GOLDEN COOKIE SOUND */
  const USE_MEME_GOLDEN_COOKIE_SOUND = true;
  const GOLDEN_COOKIE_VOLUME = 65;
  const MEME_SOUND_URL =
    "https://assets.mixkit.co/active_storage/sfx/788/788-preview.mp3";

  /* Remove an earlier copy of this toolkit. */
  const previousCopies = new Set([
    window.cookieClickToolkit, window.clickIncomeMeter, window.roiHighlighter
  ]);
  for (const previous of previousCopies) {
    if (!previous) continue;
    try { previous.stop?.(); } catch (error) { console.warn("Stopping an older toolkit:", error); }
    // Disable leftover callbacks even if an older stop() was incomplete.
    previous.active = false;
    for (const [key, timer] of Object.entries(previous)) {
      if (key.endsWith("Timer")) clearInterval(timer);
    }
    previous.bigCookieWorker?.terminate?.();
    previous.panel?.remove?.();
  }
  document.getElementById("cookie-click-toolkit-panel")?.remove();

  if (!MASTER_ON) {
    console.log("Cookie Clicker toolkit is off.");
    return;
  }

  const STORAGE_KEY = "cookieClickToolkitControlsV3";
  const validPriorities = new Set([
    "blue-first",
    "green-first",
    "cheapest",
    "upgrades-first",
    "buildings-first"
  ]);
  const validReserveModes = new Set([
    "smart",
    "none",
    "normal-lucky",
    "frenzy-lucky",
    "normal-conjure",
    "frenzy-conjure"
  ]);
  const validChainModes = new Set(["normal", "frenzy"]);
  const validGrandmapocalypseStageCaps = new Set([0, 1, 2, 3]);
  const validWrinklerModes = new Set(["smart", "hold", "farm"]);
  const validDragonModes = new Set(["milk-only", "safe-full"]);
  const validStrategyProfileIds = new Set(
    Object.keys(STRATEGY_PROFILES)
  );
  const validAscensionModes = new Set(["off", "ready", "automatic"]);
  const validAscensionPlanIds = new Set(Object.keys(ASCENSION_PLANS));
  const validPanelTabs = new Set([
    "stocks",
    "overview",
    "automation",
    "midgame",
    "lategame",
    "ascension",
    "targets",
    "diagnostics"
  ]);

  let savedControls = {};
  try {
    savedControls = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch (_) {
    savedControls = {};
  }

  const savedAscensionPlanId =
    savedControls.ascensionPlanId === "first-365"
      ? DEFAULT_ASCENSION_PLAN_ID
      : savedControls.ascensionPlanId;

  const savedPanelRect = savedControls.panelRect;
  const validSavedPanelRect =
    savedPanelRect &&
    ["left", "top", "width", "height"].every((key) =>
      Number.isFinite(Number(savedPanelRect[key]))
    );

  const controls = {
    strategyProfileId: validStrategyProfileIds.has(
      savedControls.strategyProfileId
    )
      ? savedControls.strategyProfileId
      : DEFAULT_STRATEGY_PROFILE_ID,
    activeTab: validPanelTabs.has(savedControls.activeTab)
      ? savedControls.activeTab
      : "overview",
    ascensionMode: validAscensionModes.has(savedControls.ascensionMode)
      ? savedControls.ascensionMode
      : DEFAULT_ASCENSION_MODE,
    ascensionPlanId: validAscensionPlanIds.has(savedAscensionPlanId)
      ? savedAscensionPlanId
      : DEFAULT_ASCENSION_PLAN_ID,
    ascensionAdaptiveTarget:
      typeof savedControls.ascensionAdaptiveTarget === "boolean"
        ? savedControls.ascensionAdaptiveTarget
        : true,
    continueAscensions:
      typeof savedControls.continueAscensions === "boolean"
        ? savedControls.continueAscensions
        : true,
    ascensionPrestigeTarget:
      Number.isFinite(Number(savedControls.ascensionPrestigeTarget)) &&
      Number(savedControls.ascensionPrestigeTarget) >= 1
        ? Math.floor(Number(savedControls.ascensionPrestigeTarget))
        : ASCENSION_PLANS[DEFAULT_ASCENSION_PLAN_ID].stages[0].guideCost,
    ascensionArmed:
      typeof savedControls.ascensionArmed === "boolean"
        ? savedControls.ascensionArmed
        : false,
    popWrinklersBeforeAscend:
      typeof savedControls.popWrinklersBeforeAscend === "boolean"
        ? savedControls.popWrinklersBeforeAscend
        : true,
    assignPermanentSlot:
      typeof savedControls.assignPermanentSlot === "boolean"
        ? savedControls.assignPermanentSlot
        : true,
    autoBuy:
      typeof savedControls.autoBuy === "boolean"
        ? savedControls.autoBuy
        : AUTO_BUY_RECOMMENDED_ITEMS,
    autoBuyBuildings:
      typeof savedControls.autoBuyBuildings === "boolean"
        ? savedControls.autoBuyBuildings
        : AUTO_BUY_BUILDINGS,
    autoBuyUpgrades:
      typeof savedControls.autoBuyUpgrades === "boolean"
        ? savedControls.autoBuyUpgrades
        : AUTO_BUY_UPGRADES,
    autoBuyWizardTowers:
      typeof savedControls.autoBuyWizardTowers === "boolean"
        ? savedControls.autoBuyWizardTowers
        : AUTO_BUY_WIZARD_TOWERS,
    ftHofTowerRestoreTargetAmount:
      Number.isFinite(Number(savedControls.ftHofTowerRestoreTargetAmount)) &&
      Number(savedControls.ftHofTowerRestoreTargetAmount) >= 0
        ? Math.floor(Number(savedControls.ftHofTowerRestoreTargetAmount))
        : 0,
    researchUpgrades:
      typeof savedControls.researchUpgrades === "boolean"
        ? savedControls.researchUpgrades
        : AUTO_BUY_RESEARCH_UPGRADES,
    priorityUpgrades:
      typeof savedControls.priorityUpgrades === "boolean"
        ? savedControls.priorityUpgrades
        : AUTO_BUY_EXTRA_UPGRADES,
    timeSavingOtherItems:
      typeof savedControls.timeSavingOtherItems === "boolean"
        ? savedControls.timeSavingOtherItems
        : typeof savedControls.cheapOtherUpgrades === "boolean"
          ? savedControls.cheapOtherUpgrades
        : DEFAULT_STRATEGY_PROFILE.timeSavingOtherItems,
    bigCookie:
      typeof savedControls.bigCookie === "boolean"
        ? savedControls.bigCookie
        : AUTO_CLICK_BIG_COOKIE,
    goldenCookies:
      typeof savedControls.goldenCookies === "boolean"
        ? savedControls.goldenCookies
        : AUTO_CLICK_GOLDEN_COOKIES,
    clickWrathCookies:
      typeof savedControls.clickWrathCookies === "boolean"
        ? savedControls.clickWrathCookies
        : CLICK_WRATH_COOKIES,
    chainProtection:
      typeof savedControls.chainProtection === "boolean"
        ? savedControls.chainProtection
        : PROTECT_COOKIE_CHAINS,
    chainMode: validChainModes.has(savedControls.chainMode)
      ? savedControls.chainMode
      : DEFAULT_CHAIN_MODE,
    grandmapocalypseStageCap: validGrandmapocalypseStageCaps.has(
      Number(savedControls.grandmapocalypseStageCap)
    )
      ? Number(savedControls.grandmapocalypseStageCap)
      : DEFAULT_GRANDMAPOCALYPSE_STAGE_CAP,
    wrinklerMode: validWrinklerModes.has(savedControls.wrinklerMode)
      ? savedControls.wrinklerMode
      : DEFAULT_WRINKLER_MODE,
    protectShinyWrinklers:
      typeof savedControls.protectShinyWrinklers === "boolean"
        ? savedControls.protectShinyWrinklers
        : DEFAULT_PROTECT_SHINY_WRINKLERS,
    sugarLumps:
      typeof savedControls.sugarLumps === "boolean"
        ? savedControls.sugarLumps
        : AUTO_MANAGE_SUGAR_LUMPS,
    stockAuto: savedControls.stockAuto !== false,
    stockLiquidateBeforeAscend: savedControls.stockLiquidateBeforeAscend !== false,
    stockBudgetFullEnabled: true,
    stockBudgetPercent: savedControls.stockBudgetFullEnabled && Number.isFinite(savedControls.stockBudgetPercent)
      ? Math.min(100, Math.max(0, savedControls.stockBudgetPercent)) : 100,
    stockProfitMargin: Number.isFinite(savedControls.stockProfitMargin)
      ? Math.min(50, Math.max(0.5, savedControls.stockProfitMargin)) : 2,
    stockHorizon: Math.min(20, Math.max(10, Math.round(Number(savedControls.stockHorizon) || 15))),
    stockRiskPercent: Math.min(25, Math.max(1, Number(savedControls.stockRiskPercent) || 5)),
    stockBook: savedControls.stockBook && typeof savedControls.stockBook === "object" ? savedControls.stockBook : null,
    godzamokSellAllV1: true,
    godzamokComboGoalV1: true,
    godzamokObjective: savedControls.godzamokSellAllV1 && ["profit","prestige","combo","all"].includes(savedControls.godzamokObjective)
      ? savedControls.godzamokObjective : "all",
    godzamokMaxRecoverySeconds: Number.isFinite(savedControls.godzamokMaxRecoverySeconds)
      ? Math.min(3600, Math.max(0, savedControls.godzamokMaxRecoverySeconds)) : 300,
    godzamokConfidence: Number.isFinite(savedControls.godzamokConfidence)
      ? Math.min(1, Math.max(0.25, savedControls.godzamokConfidence)) : 1,
    godzamokRecoveryDebt: savedControls.godzamokSellAllV1 ? Math.max(Number(savedControls.godzamokRecoveryDebt) || 0, 0) : 0,
    godzamokRecoveryEarned: Number(savedControls.godzamokRecoveryEarned) || 0,
    godzamokRecoveryRun: Number(savedControls.godzamokRecoveryRun) || 0,
    godzamokLossGuardPaused: Boolean(savedControls.godzamokSellAllV1) && savedControls.godzamokLossGuardPaused === true,
    lateGameRepeatAscension: savedControls.lateGameRepeatAscension === true,
    lateGameRepeatTarget: Math.max(1, Math.floor(Number(savedControls.lateGameRepeatTarget) || Number(savedControls.ascensionPrestigeTarget) || 1)),
    lateGameBulkBuy: savedControls.lateGameBulkBuy === true,
    gardenAutoBreed: savedControls.gardenAutoBreed === true,
    gardenAutoSacrifice: savedControls.gardenAutoSacrifice !== false,
    gardenPreset: Array.isArray(savedControls.gardenPreset)
      ? savedControls.gardenPreset
      : [],
    gardenPresetEnabled:
      typeof savedControls.gardenPresetEnabled === "boolean"
        ? savedControls.gardenPresetEnabled
        : false,
    gardenSyncParents:
      typeof savedControls.gardenSyncParents === "boolean"
        ? savedControls.gardenSyncParents
        : true,
    gardenSmartSoil:
      typeof savedControls.gardenSmartSoil === "boolean"
        ? savedControls.gardenSmartSoil
        : true,
    gardenHarvestCells: Array.isArray(savedControls.gardenHarvestCells)
      ? savedControls.gardenHarvestCells
      : [],
    gardenMutationTarget:
      typeof savedControls.gardenMutationTarget === "string"
        ? savedControls.gardenMutationTarget
        : "",
    forceHand:
      typeof savedControls.forceHand === "boolean"
        ? savedControls.forceHand
        : AUTO_CAST_FORCE_THE_HAND_OF_FATE,
    godzamokCombos:
      typeof savedControls.godzamokCombos === "boolean"
        ? savedControls.godzamokCombos
        : AUTO_GODZAMOK_COMBOS,
    pantheonAutomation:
      typeof savedControls.pantheonAutomation === "boolean"
        ? savedControls.pantheonAutomation
        : AUTO_MANAGE_PANTHEON,
    dragonAutomation:
      typeof savedControls.dragonAutomation === "boolean"
        ? savedControls.dragonAutomation
        : AUTO_MANAGE_DRAGON,
    dragonDrops:
      typeof savedControls.dragonDrops === "boolean"
        ? savedControls.dragonDrops
        : false,
    adaptiveDragonAuras: savedControls.adaptiveDragonAuras === true,
    dragonUtilityAuras: savedControls.dragonUtilityAuras !== false,
    renewSeason: ['christmas','halloween','easter','valentines','fools'].includes(savedControls.renewSeason) ? savedControls.renewSeason : '',
    dragonMode: validDragonModes.has(savedControls.dragonMode)
      ? savedControls.dragonMode
      : DEFAULT_DRAGON_MODE,
    panelRect: validSavedPanelRect
      ? {
          left: Number(savedPanelRect.left),
          top: Number(savedPanelRect.top),
          width: Number(savedPanelRect.width),
          height: Number(savedPanelRect.height)
        }
      : null,
    priority: validPriorities.has(savedControls.priority)
      ? savedControls.priority
      : DEFAULT_PRIORITY,
    reserveMode: validReserveModes.has(savedControls.reserveMode)
      ? savedControls.reserveMode
      : DEFAULT_RESERVE_MODE
  };

  function saveControls() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(controls));
    } catch (_) {
      // The controls still work if browser storage is unavailable.
    }
  }

  function applyStrategyProfile(profileId) {
    const profile = STRATEGY_PROFILES[profileId];
    if (!profile) return false;

    controls.strategyProfileId = profileId;
    controls.timeSavingOtherItems = profile.timeSavingOtherItems;
    controls.priority = profile.priority;
    controls.reserveMode = profile.reserveMode;
    controls.chainProtection = profile.chainProtection;
    controls.grandmapocalypseStageCap =
      profile.grandmapocalypseStageCap;
    controls.wrinklerMode = profile.wrinklerMode;
    controls.protectShinyWrinklers = profile.protectShinyWrinklers;
    controls.dragonMode = profile.dragonMode;
    if (ASCENSION_PLANS[profile.ascensionPlanId]) {
      controls.ascensionPlanId = profile.ascensionPlanId;
      controls.ascensionAdaptiveTarget = true;
      controls.ascensionPrestigeTarget =
        ASCENSION_PLANS[profile.ascensionPlanId].stages[0].guideCost;
      controls.ascensionArmed = false;
    }
    toolkit.targetSnapshotAt = -Infinity;
    saveControls();
    return true;
  }

  const toolkit = {
    version: TOOLKIT_VERSION,
    active: true,
    controls,
    samples: [],
    lastObservedHandmade: Number(Game.handmadeCookies),
    started: performance.now(),
    panel: null,
    panelResizeObserver: null,
    panelDragCleanup: null,
    colorProbe: null,
    meterTimer: null,
    modTimer: null,
    bigCookieTimer: null,
    bigCookieWorker: null,
    bigCookieWorkerUrl: null,
    clickScheduler: "Starting",
    goldenCookieTimer: null,
    sugarLumpTimer: null,
    forceHandTimer: null,
    godzamokTimer: null,
    dragonTimer: null,
    dragonDropTimer: null,
    autoBuyTimer: null,
    wrinklerTimer: null,
    ascensionTimer: null,
    gardenTimer: null,
    stockTimer: null,
    stockStatus: "Waiting for Stock Market",
    stockMarketRef: null,
    stockLastTick: null,
    stockRows: [],
    gardenStatus: "Garden plan off",
    gardenTimingKey: null,
    gardenTimingPlan: null,
    lastPurchaseAt: 0,
    lastPurchaseName: "None",
    lastLumpAction: "None",
    forceHandStatus: "Waiting for Grimoire",
    godzamokStatus: "Waiting for Click Frenzy",
    godzamokPlanner: null,
    godzamokFrontier: null,
    godzamokNextPlanAt: 0,
    godzamokTransactionMs: 0,
    lastGodzamokPlan: null,
    godzamokLedger: null,
    lastGodzamokResult: null,
    godzamokMeasuredNet: 0,
    godzamokCompletedSacrifices: 0,
    godzamokRebuildQueue: [],
    godzamokRebuildBatch: 0,
    ftHofTowerRebuildRemaining: Math.max(
      Number(controls.ftHofTowerRestoreTargetAmount) -
        Math.floor(Number(Game.Objects?.["Wizard tower"]?.amount) || 0),
      0
    ),
    dragonStatus: "Waiting for A crumbly egg",
    lastDragonActionAt: -Infinity,
    lastWrinklerPopAt: -Infinity,
    lastWrinklerAction: "Holding",
    ascensionState: "idle",
    ascensionStatus: "Saving for first ascension",
    ascensionStateStartedAt: performance.now(),
    ascensionReadyNotified: false,
    ascensionPermanentUpgradeIds: [],
    ascensionPermanentUpgradeName: "None",
    ascensionMissingUpgrades: [],
    ascensionRequiredStageIndex: 0,
    ascensionLastHeavenlyPurchaseAt: -Infinity,
    ascensionPurchasedThisRun: [],
    lastForceHandFrenzyId: null,
    targetSnapshot: [],
    targetSnapshotAt: -Infinity,
    lastTargetScanMs: 0
  };

  const originalConfirmPrompt = Game.ConfirmPrompt;
  if (AUTO_CONFIRM_ONE_MIND && typeof originalConfirmPrompt === "function") {
    Game.ConfirmPrompt = function (...args) {
      const promptText = args
        .filter((value) => typeof value === "string")
        .join(" ")
        .toLowerCase();
      if (
        promptText.includes("one mind") ||
        promptText.includes("communal brainsweep") ||
        promptText.includes("elder pact")
      ) {
        const result = originalConfirmPrompt.apply(this, args);
        const yesCallback = args.find(
          (value, index) => typeof value === "function" && index > 0
        );
        if (yesCallback) {
          try {
            yesCallback();
            Game.ClosePrompt?.();
          } catch (_) {}
        }
        setTimeout(() => {
          const candidates = document.querySelectorAll(
            "#prompt button, #prompt .option, #prompt .promptOption"
          );
          for (const candidate of candidates) {
            if (/^yes$/i.test(String(candidate.textContent || "").trim())) {
              candidate.click();
              break;
            }
          }
        }, 0);
        return result;
      }
      return originalConfirmPrompt.apply(this, args);
    };
  }

  function isAscensionAutomationBusy() {
    return !["idle", "ready", "complete", "error"].includes(
      toolkit.ascensionState
    );
  }

  /* Load Cookie Monster without changing display settings. */
  if (LOAD_COOKIE_MONSTER && !Game.mods?.cookieMonsterFramework) {
    Game.LoadMod(COOKIE_MONSTER_URL);
  }

  function configureCookieMonster() {
    const settings =
      Game.mods?.cookieMonsterFramework?.saveData?.cookieMonsterMod?.settings;

    if (!settings) return false;

    if (USE_MEME_GOLDEN_COOKIE_SOUND) {
      settings.GCSoundURL = MEME_SOUND_URL;
      settings.GCSound = 1;
      settings.GCVolume = GOLDEN_COOKIE_VOLUME;
    }

    return true;
  }

  toolkit.modTimer = setInterval(() => {
    if (!toolkit.active) return;
    if (configureCookieMonster()) clearInterval(toolkit.modTimer);
  }, 500);

  /* Formatting */
  function compactNumber(number) {
    if (!Number.isFinite(number)) return "--";
    if (number === 0) return "0";

    const sign = number < 0 ? "-" : "";
    const absolute = Math.abs(number);
    const units = [
      "",
      "K",
      "M",
      "B",
      "T",
      "Qa",
      "Qi",
      "Sx",
      "Sp",
      "Oc",
      "No",
      "Dc"
    ];
    const group = Math.floor(Math.log10(absolute) / 3);

    if (group < 0) return number.toFixed(2);
    if (group >= units.length) return number.toExponential(2);

    const value = absolute / Math.pow(1000, group);
    const decimals = value < 10 ? 2 : value < 100 ? 1 : 0;

    return (
      sign +
      value.toFixed(decimals).replace(/\.0+$|(\.\d*[1-9])0+$/, "$1") +
      units[group]
    );
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "--";
    if (seconds <= 0.05) return "Ready";
    if (seconds < 60) return `${seconds.toFixed(1)}s`;

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${remainingSeconds}s`;
    return `${minutes}m ${remainingSeconds}s`;
  }

  function getBaseCps() {
    if (Number.isFinite(Game.unbuffedCps) && Game.unbuffedCps >= 0) {
      return Game.unbuffedCps;
    }
    return Math.max(Number(Game.cookiesPs) || 0, 0);
  }

  function getEffectiveReserveMode(target = null) {
    if (controls.reserveMode !== "smart") return controls.reserveMode;

    const targetName = target?.type === "upgrade" ? target.name : "";
    const willHaveGetLucky =
      Game.Upgrades?.["Get lucky"]?.bought || targetName === "Get lucky";
    const willHaveLuckyDay =
      Game.Upgrades?.["Lucky day"]?.bought || targetName === "Lucky day";

    if (willHaveGetLucky) return "frenzy-lucky";
    if (willHaveLuckyDay) return "normal-lucky";
    return "none";
  }

  function getReserveMultiplier(mode = getEffectiveReserveMode()) {
    if (mode === "normal-lucky") return 6000;
    if (mode === "frenzy-lucky") return 42000;
    if (mode === "normal-conjure") return 12000;
    if (mode === "frenzy-conjure") return 84000;
    return 0;
  }

  function getChainEffectMultipliers(target = null) {
    const cache = getCookieMonsterData()?.Cache || {};

    let commonMultiplier = 1;
    if (Game.Has?.("Green yeast digestives")) commonMultiplier *= 1.01;
    if (Game.Has?.("Dragon fang")) commonMultiplier *= 1.03;

    if (
      target?.type === "upgrade" &&
      target.name === "Green yeast digestives" &&
      !Game.Has?.("Green yeast digestives")
    ) {
      commonMultiplier *= 1.01;
    }

    if (
      target?.type === "upgrade" &&
      target.name === "Dragon fang" &&
      !Game.Has?.("Dragon fang")
    ) {
      commonMultiplier *= 1.03;
    }

    const goldenFallback =
      commonMultiplier *
      (1 + 0.1 * (Number(Game.auraMult?.("Ancestral Metamorphosis")) || 0)) *
      (Number(Game.eff?.("goldenCookieGain")) || 1);

    const wrathFallback =
      commonMultiplier *
      (1 + 0.1 * (Number(Game.auraMult?.("Unholy Dominion")) || 0)) *
      (Number(Game.eff?.("wrathCookieGain")) || 1);

    let golden = Number(cache.GoldenCookiesMult);
    let wrath = Number(cache.WrathCookiesMult);
    const goldenFromCache = Number.isFinite(golden) && golden > 0;
    const wrathFromCache = Number.isFinite(wrath) && wrath > 0;

    if (!goldenFromCache) golden = goldenFallback;
    if (!wrathFromCache) wrath = wrathFallback;

    /* Apply an upgrade being considered to Cookie Monster's current values. */
    if (target?.type === "upgrade" && target.name === "Green yeast digestives") {
      if (Game.Has?.("Green yeast digestives")) {
        // It is already included.
      } else {
        if (goldenFromCache) golden *= 1.01;
        if (wrathFromCache) wrath *= 1.01;
      }
    }

    if (target?.type === "upgrade" && target.name === "Dragon fang") {
      if (Game.Has?.("Dragon fang")) {
        // It is already included.
      } else {
        if (goldenFromCache) golden *= 1.03;
        if (wrathFromCache) wrath *= 1.03;
      }
    }

    let dragonFortune = Number(cache.DragonsFortuneMultAdjustment);
    if (!Number.isFinite(dragonFortune) || dragonFortune <= 0) {
      dragonFortune = 1;
      if ((Game.shimmerTypes?.golden?.n || 0) === 0) {
        dragonFortune *=
          1 + 1.23 * (Number(Game.auraMult?.("Dragon's Fortune")) || 0);
      }
    }

    return { golden, wrath, dragonFortune };
  }

  function calculateChainRequired(digit, productionCap, gainMultiplier) {
    if (!(productionCap > 0) || !(gainMultiplier > 0)) return 0;
    if (!Number.isFinite(productionCap)) return Infinity;

    const scaledCap = productionCap * gainMultiplier;
    if (!Number.isFinite(scaledCap)) return Infinity;

    const bank = Math.max(Number(Game.cookies) || 0, 0);
    let chain =
      1 + Math.max(0, Math.ceil(Math.log(bank) / Math.LN10) - 10);
    let reward = 0;
    let nextReward = 0;

    for (let guard = 0; guard < 400 && nextReward < scaledCap; guard++) {
      const rawReward =
        Math.floor(
          (1 / 9) * Math.pow(10, chain) * digit * gainMultiplier
        );
      const rawNext =
        Math.floor(
          (1 / 9) * Math.pow(10, chain + 1) * digit * gainMultiplier
        );

      reward = Math.max(digit, Math.min(rawReward, scaledCap));
      nextReward = Math.max(digit, Math.min(rawNext, scaledCap));
      chain += 1;
    }

    return (2 * reward) / gainMultiplier;
  }

  function getCachedChainReserve() {
    const cache = getCookieMonsterData()?.Cache || {};
    const goldenKey = controls.chainMode === "frenzy"
      ? "ChainFrenzyRequired"
      : "ChainRequired";
    const wrathKey = controls.chainMode === "frenzy"
      ? "ChainFrenzyWrathRequired"
      : "ChainWrathRequired";

    const golden = Math.max(Number(cache[goldenKey]) || 0, 0);
    const wrath = PROTECT_WRATH_COOKIE_CHAINS
      ? Math.max(Number(cache[wrathKey]) || 0, 0)
      : 0;

    return Math.max(golden, wrath);
  }

  function getChainReserveForCps(baseCps, target = null) {
    if (!controls.chainProtection || !(baseCps > 0)) return 0;

    const { golden, wrath, dragonFortune } =
      getChainEffectMultipliers(target);
    const frenzyMultiplier = controls.chainMode === "frenzy" ? 7 : 1;
    const productionCap =
      60 * 60 * 6 * baseCps * dragonFortune * frenzyMultiplier;

    const goldenRequired = calculateChainRequired(
      7,
      productionCap,
      golden
    );
    const wrathRequired = PROTECT_WRATH_COOKIE_CHAINS
      ? calculateChainRequired(6, productionCap, wrath)
      : 0;

    /* Keep Cookie Monster's own current requirement as a safe lower bound. */
    return Math.max(goldenRequired, wrathRequired, getCachedChainReserve());
  }

  function getReserveForCps(baseCps, mode, target = null) {
    const luckyOrConjureReserve = baseCps * getReserveMultiplier(mode);
    const chainReserve = getChainReserveForCps(baseCps, target);
    return Math.max(luckyOrConjureReserve, chainReserve);
  }

  function getReserve() {
    return getReserveForCps(getBaseCps(), getEffectiveReserveMode());
  }

  function getPostPurchaseBaseCps(target) {
    if (
      target?.type === "upgrade" &&
      RESERVE_NEUTRAL_UPGRADE_NAMES.has(target.name)
    ) {
      return getBaseCps();
    }

    const bonus = Number(target?.bonus);
    return getBaseCps() + (Number.isFinite(bonus) && bonus > 0 ? bonus : 0);
  }

  function getReserveAfterPurchase(target) {
    const mode = getEffectiveReserveMode(target);
    return getReserveForCps(getPostPurchaseBaseCps(target), mode, target);
  }

  function getRequiredBank(target) {
    return target.price + getReserveAfterPurchase(target);
  }

  function getEffectiveReserveModeForTargets(targets) {
    if (controls.reserveMode !== "smart") return controls.reserveMode;

    const upgradeNames = new Set(
      targets
        .filter((target) => target?.type === "upgrade")
        .map((target) => target.name)
    );
    const willHaveGetLucky =
      Game.Upgrades?.["Get lucky"]?.bought || upgradeNames.has("Get lucky");
    const willHaveLuckyDay =
      Game.Upgrades?.["Lucky day"]?.bought || upgradeNames.has("Lucky day");

    if (willHaveGetLucky) return "frenzy-lucky";
    if (willHaveLuckyDay) return "normal-lucky";
    return "none";
  }

  function getReserveAfterPurchases(targets) {
    const validTargets = targets.filter(Boolean);
    let baseCps = getBaseCps();

    for (const target of validTargets) {
      if (
        target.type === "upgrade" &&
        RESERVE_NEUTRAL_UPGRADE_NAMES.has(target.name)
      ) {
        continue;
      }

      const bonus = Number(target.bonus);
      if (Number.isFinite(bonus) && bonus > 0) baseCps += bonus;
    }

    const mode = getEffectiveReserveModeForTargets(validTargets);
    let reserve = getReserveForCps(baseCps, mode);

    /* Include each purchase's chain-effect changes in the combined reserve. */
    for (const target of validTargets) {
      reserve = Math.max(reserve, getReserveForCps(baseCps, mode, target));
    }

    return reserve;
  }

  function getReserveLabel() {
    const selected = controls.reserveMode;
    const effective = getEffectiveReserveMode();

    if (selected === "smart") {
      if (effective === "frenzy-lucky") return "Smart, Frenzy + Lucky";
      if (effective === "normal-lucky") return "Smart, normal Lucky";
      return "Smart, no Lucky/Conjure reserve";
    }
    if (effective === "frenzy-conjure") return "Frenzy + Conjure";
    if (effective === "normal-conjure") return "Normal Conjure";
    if (effective === "frenzy-lucky") return "Frenzy + Lucky";
    if (effective === "normal-lucky") return "Normal Lucky";
    return "Off";
  }

  /* Cookie Monster blue and green target detection */
  const colorProbe = document.createElement("span");
  colorProbe.style.cssText =
    "position:fixed;left:-10000px;top:-10000px;visibility:hidden";
  document.body.appendChild(colorProbe);
  toolkit.colorProbe = colorProbe;

  function normalizeColor(value) {
    if (!value) return "";
    colorProbe.style.color = "";
    colorProbe.style.color = value;
    return getComputedStyle(colorProbe).color;
  }

  function getCookieMonsterSettings() {
    return Game.mods?.cookieMonsterFramework?.saveData?.cookieMonsterMod
      ?.settings;
  }

  function getCookieMonsterData() {
    return window.CookieMonsterData || null;
  }

  function normalizeLabelColor(value) {
    const color = String(value || "").toLowerCase();
    if (color.includes("blue")) return "blue";
    if (color.includes("green")) return "green";
    if (color.includes("yellow")) return "yellow";
    if (color.includes("orange")) return "orange";
    if (color.includes("red")) return "red";
    if (color.includes("purple")) return "purple";
    if (color.includes("gray") || color.includes("grey")) return "gray";
    return null;
  }

  function getBuildingColor(object, settings) {
    const priceElement = document.getElementById(`productPrice${object.id}`);
    if (!priceElement) return null;

    const actual = getComputedStyle(priceElement).color;
    const blue = normalizeColor(settings.ColourBlue);
    const green = normalizeColor(settings.ColourGreen);

    if (actual === blue) return "blue";
    if (actual === green) return "green";
    return null;
  }

  function getUpgradeColor(index) {
    const upgradeElement = document.getElementById(`upgrade${index}`);
    if (!upgradeElement) return null;

    if (upgradeElement.querySelector(".CMBackBlue")) return "blue";
    if (upgradeElement.querySelector(".CMBackGreen")) return "green";
    if (upgradeElement.querySelector(".CMBackYellow")) return "yellow";
    if (upgradeElement.querySelector(".CMBackOrange")) return "orange";
    if (upgradeElement.querySelector(".CMBackRed")) return "red";
    if (upgradeElement.querySelector(".CMBackPurple")) return "purple";
    if (
      upgradeElement.querySelector(".CMBackGray") ||
      upgradeElement.querySelector(".CMBackGrey")
    ) {
      return "gray";
    }
    return null;
  }

  function getBuildingCacheEntry(object, quantity) {
    const cache = getCookieMonsterData()?.[`Objects${quantity}`];
    return cache?.[object.name] || null;
  }

  function getUpgradeCacheEntry(upgrade) {
    return getCookieMonsterData()?.Upgrades?.[upgrade.name] || null;
  }

  function getCachedBonus(entry) {
    const liveBonus = Number(entry?.bonus);
    if (!Number.isFinite(liveBonus) || liveBonus <= 0) return 0;

    /*
     * Cookie Monster simulates the item's gain using the current production
     * state. During Frenzy, Clot, building specials, and similar effects, its
     * cached bonus can therefore contain that temporary multiplier.
     *
     * Convert the gain back to normal CpS before using it in the after-buy
     * reserve. The reserve mode's 6,000x, 42,000x, 12,000x, or 84,000x
     * multiplier already accounts for the intended golden-cookie scenario.
     */
    const baseCps = getBaseCps();
    const liveCps = Math.max(Number(Game.cookiesPs) || 0, 0);

    if (baseCps > 0 && liveCps > 0) {
      return liveBonus * (baseCps / liveCps);
    }

    return liveBonus;
  }

  function getCachedLiveBonus(entry) {
    const bonus = Number(entry?.bonus);
    return Number.isFinite(bonus) && bonus > 0 ? bonus : 0;
  }

  function getCachedMouseBonus(entry) {
    const bonusMouse = Number(entry?.bonusMouse);
    return Number.isFinite(bonusMouse) && bonusMouse > 0 ? bonusMouse : 0;
  }

  function getBuildingTargetColor(object, quantity, settings) {
    const entry = getBuildingCacheEntry(object, quantity);
    if (entry) return normalizeLabelColor(entry.colour);

    if (quantity === Game.buyBulk && settings) {
      return getBuildingColor(object, settings);
    }

    return null;
  }

  function getUpgradeTargetColor(upgrade, index) {
    const entry = getUpgradeCacheEntry(upgrade);
    if (entry) return normalizeLabelColor(entry.colour);

    return getUpgradeColor(index);
  }

  function colorAllowed(color) {
    return (
      (color === "blue" && AUTO_BUY_BLUE_ITEMS) ||
      (color === "green" && AUTO_BUY_GREEN_ITEMS)
    );
  }

  function isOtherColor(color) {
    return ["yellow", "orange", "red", "purple", "gray"].includes(color);
  }

  function isResearchUpgrade(upgrade) {
    return Boolean(
      controls.researchUpgrades && upgrade &&
      (AUTO_BUY_ONE_MIND || upgrade.name !== "One mind") &&
      (upgrade.pool === "tech" || upgrade.pool === "research" ||
        RESEARCH_UPGRADE_NAMES.includes(upgrade.name))
    );
  }

  function isResearchTarget(target) {
    return Boolean(target?.research);
  }

  function getGrandmapocalypseUpgradeStage(name) {
    if (name === "One mind") return 1;
    if (name === "Communal brainsweep") return 2;
    if (name === "Elder Pact") return 3;
    return 0;
  }

  function isBlockedByGrandmapocalypseStageCap(upgrade) {
    const requiredStage = getGrandmapocalypseUpgradeStage(upgrade?.name);
    return requiredStage > controls.grandmapocalypseStageCap;
  }

  function getOwnedGrandmapocalypseStage() {
    if (Game.Has?.("Elder Pact")) return 3;
    if (Game.Has?.("Communal brainsweep")) return 2;
    if (Game.Has?.("One mind")) return 1;
    return 0;
  }

  function evaluateTimeSavingTarget(
    candidate,
    goal,
    clicksPerSecond,
    clickingCps
  ) {
    if (!candidate || !goal) return null;

    let goalPriceAfterCandidate = goal.price;

    /* Price the goal from the higher building count after the helper buy. */
    if (
      candidate.type === "building" &&
      goal.type === "building" &&
      candidate.item === goal.item
    ) {
      const combinedPrice = candidate.item.getSumPrice(
        candidate.quantity + goal.quantity
      );
      goalPriceAfterCandidate = combinedPrice - candidate.price;
      if (!(Number.isFinite(goalPriceAfterCandidate) && goalPriceAfterCandidate >= 0)) {
        return null;
      }
    }

    const bank = Math.max(Number(Game.cookies) || 0, 0);
    const currentIncome =
      Math.max(Number(Game.cookiesPs) || 0, 0) +
      Math.max(Number(clickingCps) || 0, 0);
    if (!(currentIncome > 0)) return null;

    const etaWithout = Math.max(getRequiredBank(goal) - bank, 0) / currentIncome;
    if (!(etaWithout > 0)) return null;

    const incomeGain =
      Math.max(Number(candidate.liveBonus) || 0, 0) +
      Math.max(Number(candidate.mouseBonus) || 0, 0) *
        Math.max(Number(clicksPerSecond) || 0, 0);
    if (!(incomeGain > 0)) return null;

    const waitToCandidate =
      Math.max(getRequiredBank(candidate) - bank, 0) / currentIncome;
    const bankWhenBought =
      bank + currentIncome * waitToCandidate - candidate.price;
    const incomeAfter = currentIncome + incomeGain;
    const goalRequiredAfterCandidate =
      goalPriceAfterCandidate + getReserveAfterPurchases([candidate, goal]);
    const etaAfter =
      waitToCandidate +
      Math.max(goalRequiredAfterCandidate - bankWhenBought, 0) / incomeAfter;
    const timeSaved = etaWithout - etaAfter;

    if (!(timeSaved > MIN_OTHER_ITEM_TIME_SAVED_SECONDS)) return null;

    return {
      ...candidate,
      timeSaver: true,
      timeSaved,
      goalName: goal.name,
      etaWithout,
      etaAfter,
      effectiveIncomeGain: incomeGain
    };
  }

  function getTargets() {
    const settings = getCookieMonsterSettings();
    const cookieMonsterData = getCookieMonsterData();
    if ((!settings && !cookieMonsterData) || Game.buyMode !== 1) return [];

    const recommendedTargets = [];
    const otherCandidates = [];

    if (AUTO_BUY_BUILDINGS && controls.autoBuyBuildings) {
      for (const quantity of BUILDING_BULK_AMOUNTS) {
        for (const object of Game.ObjectsById || []) {
          if (!object || object.locked) continue;
          if (
            object.name === "Wizard tower" &&
            !controls.autoBuyWizardTowers
          ) {
            continue;
          }

          const color = getBuildingTargetColor(object, quantity, settings);
          const recommended = colorAllowed(color);
          const timeSavingOther =
            !recommended &&
            controls.timeSavingOtherItems &&
            isOtherColor(color);
          if (!recommended && !timeSavingOther) continue;

          const price = object.getSumPrice(quantity);
          if (!Number.isFinite(price)) continue;

          const entry = getBuildingCacheEntry(object, quantity);
          const bonus = getCachedBonus(entry);

          const target = {
            type: "building",
            color,
            name: `${quantity} ${object.name}`,
            price,
            bonus,
            liveBonus: getCachedLiveBonus(entry),
            mouseBonus: 0,
            quantity,
            timeSavingOther,
            item: object
          };

          if (timeSavingOther) otherCandidates.push(target);
          else recommendedTargets.push(target);
        }
      }
    }

    if (AUTO_BUY_UPGRADES && controls.autoBuyUpgrades) {
      for (let index = 0; index < (Game.UpgradesInStore || []).length; index++) {
        const upgrade = Game.UpgradesInStore[index];
        if (!upgrade || upgrade.bought) continue;
        if (!AUTO_BUY_ONE_MIND && upgrade.name === "One mind") continue;
        if (isBlockedByGrandmapocalypseStageCap(upgrade)) continue;
        if (!AUTO_BUY_TOGGLE_UPGRADES && upgrade.pool === "toggle") continue;

        const detectedColor = getUpgradeTargetColor(upgrade, index);
        const research = isResearchUpgrade(upgrade);
        const extra =
          controls.priorityUpgrades &&
          EXTRA_UPGRADE_NAMES.includes(upgrade.name);
        const recommended = colorAllowed(detectedColor);
        const timeSavingOther =
          !recommended &&
          !extra && !research &&
          controls.timeSavingOtherItems &&
          isOtherColor(detectedColor);
        if (!research && !extra && !recommended && !timeSavingOther) continue;

        const color = research ? "research" : recommended
          ? detectedColor
          : extra
            ? "extra"
            : detectedColor;

        const price = upgrade.getPrice();
        if (!Number.isFinite(price)) continue;

        const entry = getUpgradeCacheEntry(upgrade);
        const bonus = getCachedBonus(entry);

        const target = {
          type: "upgrade",
          color,
          name: upgrade.name,
          price,
          bonus,
          liveBonus: getCachedLiveBonus(entry),
          mouseBonus: getCachedMouseBonus(entry),
          quantity: 1,
          extra,
          research,
          timeSavingOther,
          item: upgrade
        };

        if (timeSavingOther) otherCandidates.push(target);
        else recommendedTargets.push(target);
      }
    }

    const sortedRecommended = sortTargets(recommendedTargets);
    const goal = sortedRecommended[0] || null;

    if (goal && otherCandidates.length > 0) {
      const { clicksPerSecond, clickingCps } = getClickStats();
      const worthwhileCandidates = otherCandidates
        .map((candidate) =>
          evaluateTimeSavingTarget(
            candidate,
            goal,
            clicksPerSecond,
            clickingCps
          )
        )
        .filter(Boolean);

      if (worthwhileCandidates.length > 0) {
        const bestTimeSaver = worthwhileCandidates.reduce((best, candidate) =>
          candidate.timeSaved > best.timeSaved ? candidate : best
        );
        sortedRecommended.push(bestTimeSaver);
      }
    }

    return sortTargets(sortedRecommended);
  }

  function getTargetSnapshot(force = false) {
    const now = performance.now();

    if (
      force ||
      now - toolkit.targetSnapshotAt >= TARGET_SNAPSHOT_MS
    ) {
      const scanStarted = performance.now();
      toolkit.targetSnapshot = getTargets();
      toolkit.targetSnapshotAt = now;
      toolkit.lastTargetScanMs = performance.now() - scanStarted;
    }

    return toolkit.targetSnapshot;
  }

  function sortTargets(targets) {
    const typeRank = (target) => {
      if (controls.priority === "upgrades-first") {
        return target.type === "upgrade" ? 0 : 1;
      }
      if (controls.priority === "buildings-first") {
        return target.type === "building" ? 0 : 1;
      }
      return 0;
    };

    const colorRank = (target) => {
      if (controls.priority === "green-first") {
        if (target.color === "green") return 0;
        if (target.color === "blue") return 1;
        return 2;
      }
      if (target.color === "blue") return 0;
      if (target.color === "green") return 1;
      return 2;
    };

    return targets.sort((a, b) => {
      const timeSaverDifference =
        Number(Boolean(a.timeSaver)) - Number(Boolean(b.timeSaver));
      if (timeSaverDifference !== 0) return timeSaverDifference;

      if (controls.priority === "cheapest") return a.price - b.price;

      const typeDifference = typeRank(a) - typeRank(b);
      if (typeDifference !== 0) return typeDifference;

      const colorDifference = colorRank(a) - colorRank(b);
      if (colorDifference !== 0) return colorDifference;

      return a.price - b.price;
    });
  }

  /* Big cookie autoclicker */
  function clickBigCookie() {
    if (!toolkit.active || !controls.bigCookie) return;
    if (isAscensionAutomationBusy()) return;
    if (Game.OnAscend || Game.AscendTimer || Game.ReincarnateTimer) return;
    Game.ClickCookie();
  }

  function startBigCookieTimer() {
    if (USE_WORKER_CLICK_TIMER && window.Worker && window.Blob && window.URL) {
      try {
        const workerCode = `
          let timer = null;
          self.onmessage = event => {
            if (event.data?.type === "start") {
              clearInterval(timer);
              timer = setInterval(
                () => self.postMessage("click"),
                event.data.interval
              );
            }
            if (event.data?.type === "stop") {
              clearInterval(timer);
              self.close();
            }
          };
        `;
        const blob = new Blob([workerCode], { type: "text/javascript" });
        const workerUrl = URL.createObjectURL(blob);
        const worker = new Worker(workerUrl);

        worker.onmessage = clickBigCookie;
        worker.postMessage({
          type: "start",
          interval: BIG_COOKIE_CLICK_INTERVAL_MS
        });

        toolkit.bigCookieWorker = worker;
        toolkit.bigCookieWorkerUrl = workerUrl;
        toolkit.clickScheduler = `Worker, ${BIG_COOKIE_CLICK_INTERVAL_MS} ms`;
        return;
      } catch (_) {
        // Fall back to the normal browser timer.
      }
    }

    toolkit.bigCookieTimer = setInterval(
      clickBigCookie,
      BIG_COOKIE_CLICK_INTERVAL_MS
    );
    toolkit.clickScheduler = `Standard, ${BIG_COOKIE_CLICK_INTERVAL_MS} ms`;
  }

  startBigCookieTimer();

  /* Golden and wrath cookie autoclicker */
  toolkit.goldenCookieTimer = setInterval(() => {
    if (!toolkit.active || !controls.goldenCookies) return;
    if (isAscensionAutomationBusy()) return;
    if (Game.OnAscend || Game.AscendTimer || Game.ReincarnateTimer) return;

    for (const shimmer of [...(Game.shimmers || [])]) {
      if (shimmer.type === "golden") {
        if (!controls.clickWrathCookies && shimmer.wrath) continue;
        shimmer.pop();
        continue;
      }

      if (AUTO_CLICK_REINDEER && shimmer.type === "reindeer") {
        shimmer.pop();
      }
    }

    const ticker = document.getElementById("commentsText");
    const fortuneTarget = ticker?.matches?.(".fortune")
      ? ticker
      : ticker?.querySelector?.(".fortune");
    if (fortuneTarget) fortuneTarget.click();
  }, GOLDEN_COOKIE_CHECK_MS);

  /* Sugar lump harvesting and ordered building levels */
  function getNextSugarLumpStep() {
    for (const plannedStep of SUGAR_LUMP_PLAN) {
      const building = Game.Objects?.[plannedStep.building];
      if (!building) continue;

      if (building.level < plannedStep.targetLevel) {
        return {
          building,
          targetLevel: plannedStep.targetLevel,
          nextLevel: building.level + 1,
          cost: building.level + 1
        };
      }
    }

    return null;
  }

  function getSugarLumpStatus() {
    if (!controls.sugarLumps) return "Off";
    if (!Game.canLumps?.() || Game.lumps < 0) return "Not unlocked";

    const step = getNextSugarLumpStep();
    if (!step) return `Plan complete, ${compactNumber(Game.lumps)} saved`;
    if (step.building.amount < 1) {
      return `Buy 1 ${step.building.name} first`;
    }

    return (
      `${compactNumber(Game.lumps)}/${step.cost}, next ` +
      `${step.building.name} level ${step.nextLevel}`
    );
  }

  function harvestRipeSugarLump() {
    if (!AUTO_HARVEST_RIPE_SUGAR_LUMPS || !Game.canLumps?.()) return false;

    const age = Date.now() - Number(Game.lumpT);
    if (
      !Number.isFinite(age) ||
      age < Number(Game.lumpRipeAge) ||
      age >= Number(Game.lumpOverripeAge)
    ) {
      return false;
    }

    const before = Number(Game.lumps) || 0;
    Game.clickLump();
    if ((Number(Game.lumps) || 0) > before) {
      toolkit.lastLumpAction = "Harvested a ripe lump";
      return true;
    }

    return false;
  }

  function levelPlannedBuilding(step) {
    if (!step || step.building.amount < 1) return false;
    if ((Number(Game.lumps) || 0) < step.cost + SUGAR_LUMP_RESERVE) {
      return false;
    }

    const previousLevel = step.building.level;
    const previousLumps = Number(Game.lumps) || 0;
    const previousConfirmation = Game.prefs.askLumps;

    try {
      /* Use the game's level-up path without changing the saved preference. */
      Game.prefs.askLumps = 0;
      step.building.levelUp();
    } finally {
      Game.prefs.askLumps = previousConfirmation;
    }

    if (step.building.level === previousLevel + 1) {
      toolkit.lastLumpAction =
        `${step.building.name} reached level ${step.building.level}`;
      return true;
    }

    /* Restore a deduction if the game rejected the level change. */
    if ((Number(Game.lumps) || 0) < previousLumps) {
      Game.lumps = previousLumps;
    }
    return false;
  }

  function runSugarLumpAutomation() {
    if (!toolkit.active || !controls.sugarLumps) return;
    if (isAscensionAutomationBusy()) return;
    if (Game.OnAscend || Game.AscendTimer || Game.ReincarnateTimer) return;

    harvestRipeSugarLump();
    levelPlannedBuilding(getNextSugarLumpStep());
  }

  toolkit.sugarLumpTimer = setInterval(
    runSugarLumpAutomation,
    SUGAR_LUMP_CHECK_MS
  );
  runSugarLumpAutomation();

  /* Saved Garden breeding plan. All actions use native planting/harvest paths. */
  function getGarden() { return Game.Objects?.Farm?.minigame || null; }
  function gardenCellId(tile) { return `${tile.x},${tile.y}`; }
  function gardenTileOpen(garden, x, y) {
    return Boolean(garden.plot?.[y]?.[x]) &&
      typeof garden.isTileUnlocked === "function" && garden.isTileUnlocked(x, y);
  }
  function gardenPlantAt(garden, tile) {
    const cell = garden.plot?.[tile.y]?.[tile.x];
    return cell?.[0] > 0 ? garden.plantsById[cell[0] - 1] : null;
  }
  function gardenTargetPlant(garden) {
    const normalize = value => String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const wanted = normalize(controls.gardenMutationTarget);
    if (!wanted) return null;
    return Object.values(garden.plants).find(plant =>
      normalize(plant.key) === wanted || normalize(plant.name) === wanted
    ) || false;
  }
  toolkit.saveGardenPreset = () => {
    const garden = getGarden();
    if (!garden?.plot || !garden?.plantsById) return { ok: false };
    controls.gardenPreset = [];
    controls.gardenHarvestCells = [];
    garden.plot.forEach((row, y) => row.forEach((cell, x) => {
      if (!gardenTileOpen(garden, x, y)) return;
      const plant = gardenPlantAt(garden, { x, y });
      if (plant) controls.gardenPreset.push({ x, y, key: plant.key });
      else controls.gardenHarvestCells.push({ x, y });
    }));
    toolkit.gardenTimingKey = null;
    toolkit.gardenStatus = `Saved ${controls.gardenPreset.length} parents and ${controls.gardenHarvestCells.length} mutation tiles`;
    saveControls();
    return { ok: true, tiles: controls.gardenPreset.length };
  };

  function gardenGrowthWindow(garden, tile, plant, age = 0) {
    const boost = (Number(garden.plotBoost?.[tile.y]?.[tile.x]?.[0]) || 1) *
      (1 + 0.05 * (Number(Game.auraMult?.("Supreme Intellect")) || 0));
    const low = Math.max(Number(plant.ageTick) || 0, 0) * boost;
    const range = Math.max(Number(plant.ageTickR) || 0, 0) * boost;
    const mean = low + range / 2;
    const fraction = low - Math.floor(low);
    const variance = range * range / 12 +
      (range > 0 ? 1 / 6 : fraction * (1 - fraction));
    const maximum = Math.ceil(low + range);
    if (!(mean > 0)) return { start: age >= plant.mature ? 0 : Infinity,
      end: plant.immortal ? Infinity : 0, maximum, mean };
    const matureDistance = Math.max(Number(plant.mature) - age, 0);
    const lifeDistance = Math.max(100 - maximum - age, 0);
    // Approximate half-standard-deviation cushions. Re-evaluate actual ages
    // after every tick; stochastic growth cannot be synchronized exactly.
    return {
      start: matureDistance / mean + 0.5 * Math.sqrt(matureDistance * variance / mean ** 3),
      end: plant.immortal ? Infinity :
        Math.max(lifeDistance / mean - 0.5 * Math.sqrt(lifeDistance * variance / mean ** 3), 0),
      maximum, mean
    };
  }

  function gardenMutationWeight(garden, neighbors, target) {
    if (typeof garden.getMuts !== "function") return 0;
    const all = Object.fromEntries(Object.keys(garden.plants).map(key => [key, 0]));
    const mature = { ...all };
    for (const neighbor of neighbors) {
      all[neighbor.key] = (all[neighbor.key] || 0) + 1;
      if (neighbor.mature) mature[neighbor.key] = (mature[neighbor.key] || 0) + 1;
    }
    return garden.getMuts(all, mature).reduce((sum, mutation) =>
      sum + ((!target || mutation[0] === target.key) ? Math.max(Number(mutation[1]) || 0, 0) : 0), 0);
  }

  function planGardenParents(garden, parents, spaces, target) {
    const entries = parents.map(tile => {
      const plant = garden.plants[tile.key];
      const current = gardenPlantAt(garden, tile);
      const empty = !current;
      const age = current?.key === tile.key ? Number(garden.plot[tile.y][tile.x][1]) : 0;
      return { ...tile, plant, empty,
        window: gardenGrowthWindow(garden, tile, plant, age), delay: 0 };
    });
    const groups = [];
    for (const space of spaces) {
      let neighbors = entries.filter(entry =>
        Math.abs(entry.x - space.x) <= 1 && Math.abs(entry.y - space.y) <= 1 &&
        !(entry.x === space.x && entry.y === space.y)
      );
      const describe = list => list.map(entry => ({ key: entry.key, mature: true }));
      const weight = gardenMutationWeight(garden, describe(neighbors), target);
      if (!(weight > 0)) continue;
      // Remove redundant parents from this timing group, retaining the
      // earliest usable ones. Actual soil readiness always checks ALL neighbors.
      for (const entry of [...neighbors].sort((a, b) => b.window.start - a.window.start)) {
        const smaller = neighbors.filter(other => other !== entry);
        if (gardenMutationWeight(garden, describe(smaller), target) >= weight)
          neighbors = smaller;
      }
      const requirements = neighbors.map(entry => ({
        entry,
        needsMature: gardenMutationWeight(garden, neighbors.map(other => ({
          key: other.key, mature: other !== entry
        })), target) < weight
      }));
      groups.push({ requirements, weight });
    }
    const finiteEnds = entries.map(entry => entry.window.end).filter(Number.isFinite);
    const horizon = Math.max(32, ...finiteEnds, ...entries.map(entry =>
      Number.isFinite(entry.window.start) ? entry.window.start + 32 : 0));
    const interval = requirement => ({
      start: requirement.entry.delay + (requirement.needsMature ? requirement.entry.window.start : 0),
      end: Math.min(horizon, requirement.entry.delay + requirement.entry.window.end)
    });
    if (controls.gardenSyncParents) {
      // Start slow parents first. This seed avoids a zero-overlap local optimum
      // when several fast parents would all die before a slow parent matures.
      for (const group of groups) {
        const latest = Math.max(...group.requirements.map(req =>
          req.needsMature ? req.entry.window.start : 0));
        if (!Number.isFinite(latest)) continue;
        for (const req of group.requirements) {
          if (req.entry.empty && req.needsMature)
            req.entry.delay = Math.max(req.entry.delay, latest - req.entry.window.start);
        }
      }
      const score = affected => affected.reduce((total, group) => {
        const windows = group.requirements.map(interval);
        const start = Math.max(...windows.map(window => window.start));
        const end = Math.min(...windows.map(window => window.end));
        return total + Math.max(end - start, 0) * group.weight;
      }, 0);
      // Coordinate refinement at the overlap function's breakpoints.
      // This optimizes estimated local windows, not unknowable future RNG.
      for (let pass = 0; pass < 3; pass++) {
        for (const entry of entries.filter(entry => entry.empty)) {
          const affected = groups.filter(group =>
            group.requirements.some(req => req.entry === entry));
          if (!affected.length) { entry.delay = 0; continue; }
          const options = new Set([0, entry.delay]);
          for (const group of affected) {
            const own = group.requirements.find(req => req.entry === entry);
            const ownStart = own.needsMature ? entry.window.start : 0;
            const others = group.requirements.filter(req => req.entry !== entry).map(interval);
            for (const window of others) {
              for (const boundary of [window.start - ownStart, window.end - ownStart,
                window.start - entry.window.end, window.end - entry.window.end]) {
                if (Number.isFinite(boundary)) options.add(Math.max(0, boundary));
              }
            }
          }
          let bestDelay = entry.delay;
          let bestScore = score(affected);
          for (const delay of options) {
            entry.delay = delay;
            const value = score(affected);
            if (value > bestScore + 1e-9 ||
                (Math.abs(value - bestScore) <= 1e-9 && delay < bestDelay)) {
              bestDelay = delay; bestScore = value;
            }
          }
          entry.delay = bestDelay;
        }
      }
    }
    const nextWindow = groups.reduce((soonest, group) => {
      const windows = group.requirements.map(interval);
      const start = Math.max(...windows.map(window => window.start));
      const end = Math.min(...windows.map(window => window.end));
      return end > start ? Math.min(soonest, start) : soonest;
    }, Infinity);
    return { entries, groups, nextWindow };
  }

  function estimateGardenOverlap(garden, groups) {
    // Simulate independent native-style growth and stochastic rounding, using
    // our own PRNG. Never consume the game's mutation RNG or change its plot.
    const entries=[...new Set(groups.flatMap(g=>g.requirements.map(r=>r.entry)))];
    const descriptor=entries.map(e=>[e.x,e.y,e.key,e.empty?0:Number(garden.plot[e.y][e.x][1]),e.delay,
      e.plant.mature,e.plant.ageTick,e.plant.ageTickR,e.plant.immortal,
      Number(garden.plotBoost?.[e.y]?.[e.x]?.[0])||1]);
    const key=JSON.stringify([descriptor,groups.map(g=>[g.weight,g.requirements.map(r=>[entries.indexOf(r.entry),r.needsMature])]),Number(Game.auraMult?.("Supreme Intellect"))||0]);
    toolkit.gardenOverlapCache ||= new Map();
    if(toolkit.gardenOverlapCache.has(key)) return toolkit.gardenOverlapCache.get(key);
    if(toolkit.gardenOverlapCache.size>128) toolkit.gardenOverlapCache.clear();
    let seed=314159265;
    const random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)/4294967296;};
    let total=0,squares=0;
    const trials=128;
    const indexed=groups.map(g=>({weight:g.weight,requirements:g.requirements.map(r=>({i:entries.indexOf(r.entry),mature:r.needsMature}))}));
    for(let trial=0;trial<trials;trial++) {
      const windows=entries.map(e=>{
        const boost=(Number(garden.plotBoost?.[e.y]?.[e.x]?.[0])||1)*(1+0.05*(Number(Game.auraMult?.("Supreme Intellect"))||0));
        const low=Math.max(0,Number(e.plant.ageTick)||0)*boost;
        const range=Math.max(0,Number(e.plant.ageTickR)||0)*boost;
        let age=e.empty?0:Number(garden.plot[e.y][e.x][1]);
        let mature=age>=e.plant.mature?0:Infinity, end=Infinity;
        const delay=e.empty?Math.ceil(e.delay):0;
        if(low+range<=0) return {start:mature,end:e.plant.immortal?Infinity:0,delay};
        for(let tick=1;tick<=10000;tick++) {
          const growth=low+random()*range;
          age+=Math.floor(growth)+(random()<growth%1?1:0);
          if(age>=100 && !e.plant.immortal) {end=tick;break;}
          if(mature===Infinity && age>=e.plant.mature) mature=tick;
          if(e.plant.immortal && mature!==Infinity) break;
          // Match the toolkit's final-safe-tick parent harvesting rule.
          if(!e.plant.immortal && age>=e.plant.mature && age+Math.ceil(low+range)>=100) {end=tick;break;}
        }
        return {start:mature+delay,end:end+delay,delay};
      });
      let score=0;
      for(const g of indexed) {
        const start=Math.max(...g.requirements.map(r=>r.mature?windows[r.i].start:windows[r.i].delay));
        const end=Math.min(...g.requirements.map(r=>windows[r.i].end));
        score+=Math.max(0,Math.min(10000,end-start))*g.weight;
      }
      total+=score;squares+=score*score;
    }
    const mean=total/trials;
    const result={mean,se:Math.sqrt(Math.max(0,squares/trials-mean*mean)/trials)};
    toolkit.gardenOverlapCache.set(key,result);
    return result;
  }

  function synchronizeGardenCohorts(garden, parents, spaces, target, protectedIds = new Set()) {
    let plan = planGardenParents(garden, parents, spaces, target);
    if (!controls.gardenSyncParents) return plan;
    // Shared parents join neighborhoods into one component. Separate Queenbeet
    // rings remain separate; overlapping saved layouts cannot reset each other.
    const components = [];
    for (const group of plan.groups) {
      const ids = new Set(group.requirements.map(r => gardenCellId(r.entry)));
      const touching = components.filter(c => [...ids].some(id => c.ids.has(id)));
      const merged = {ids, groups:[group]};
      for (const c of touching) {
        c.ids.forEach(id => ids.add(id)); merged.groups.push(...c.groups);
        components.splice(components.indexOf(c), 1);
      }
      components.push(merged);
    }
    const blocked = new Set();
    let resets = 0;
    let budget = Number(Game.cookies)-getReserve();
    for (const component of components) {
      const entries = plan.entries.filter(e => component.ids.has(gardenCellId(e)));
      const mutable = entries.filter(e => !protectedIds.has(gardenCellId(e)) &&
        (!gardenPlantAt(garden,e) || gardenPlantAt(garden,e).key===e.key) &&
        e.plant.unlocked && e.plant.plantable!==false);
      const hasExisting = mutable.some(e => !e.empty && !e.plant.immortal);
      const readyNow = component.groups.some(g => g.requirements.every(r =>
        !r.entry.empty && (!r.needsMature || garden.plot[r.entry.y][r.entry.x][1]>=r.entry.plant.mature)));
      // Compare against a fresh synchronized cohort using a copied plot only.
      // Do not mistake the natural end of an active breeding window for drift.
      let poorOverlap = false;
      if (hasExisting && !readyNow) {
        const hypothetical = {...garden, plot:garden.plot.map(row=>row.map(cell=>[...cell]))};
        for (const e of mutable) if (!e.plant.immortal) hypothetical.plot[e.y][e.x]=[0,0];
        const fresh=planGardenParents(hypothetical,parents,spaces,target);
        const freshGroups=fresh.groups.filter(g=>g.requirements.every(r=>component.ids.has(gardenCellId(r.entry))));
        const baseline=estimateGardenOverlap(hypothetical,freshGroups);
        const current=estimateGardenOverlap(garden,component.groups);
        // Both sides include the spread across all parents, not a perfect-age
        // ideal. Require the shortfall to exceed Monte Carlo sampling error.
        const uncertainty=2*Math.hypot(current.se,0.75*baseline.se);
        poorOverlap=baseline.mean>0 && current.mean+uncertainty<baseline.mean*0.75;
        toolkit.gardenOverlapRatio=baseline.mean>0?current.mean/baseline.mean:null;
      }
      const reset = hasExisting && poorOverlap;
      const toFund = mutable.filter(e => e.empty || reset && !e.plant.immortal);
      const cost = toFund.reduce((sum,e) => sum + Number(garden.getCost(e.plant)),0);
      if (!Number.isFinite(cost) || cost > budget) {
        component.ids.forEach(id=>blocked.add(id)); continue;
      }
      budget-=cost;
      if (reset) {
        for (const e of mutable) {
          if (!e.empty && !e.plant.immortal) garden.harvest(e.x,e.y,true);
        }
        resets++;
      }
    }
    if (resets) {garden.computeBoostPlot?.(); plan=planGardenParents(garden,parents,spaces,target);}
    plan.blocked=blocked;
    toolkit.gardenSyncStatus=`${components.length} breeding group(s); ${resets} reset; ${blocked.size} parent tile(s) waiting for full funding`;
    return plan;
  }

  function getGardenBreedingSpots(garden, spaces, target) {
    return spaces.filter(space => {
      if (gardenPlantAt(garden, space)) return false;
      const neighbors = [];
      for (let y = space.y - 1; y <= space.y + 1; y++) {
        for (let x = space.x - 1; x <= space.x + 1; x++) {
          if ((x === space.x && y === space.y) || !gardenTileOpen(garden, x, y)) continue;
          const plant = gardenPlantAt(garden, { x, y });
          if (plant) neighbors.push({ key: plant.key, mature: garden.plot[y][x][1] >= plant.mature });
        }
      }
      return gardenMutationWeight(garden, neighbors, target) > 0;
    }).length;
  }

  function chooseGardenSoil(garden, ready, nextWindow, hasEmptySpace) {
    if (!controls.gardenSmartSoil) return "Soil: manual";
    const available = Object.values(garden.soils || {}).filter(soil =>
      Number(Game.Objects.Farm.amount) >= Number(soil.req));
    const fastest = [...available].sort((a, b) => a.tick - b.tick)[0];
    const woodchips = available.find(soil => soil.key === "woodchips");
    const current = garden.soilsById?.[garden.soil];
    let wanted = ready > 0 && woodchips ? woodchips : fastest;
    if (!wanted || !current) return "Soil data unavailable";
    const cooldown = Game.Has?.("Turbo-charged soil") ? 1 : 600000;
    // Avoid locking out Wood chips just before a breeding window starts.
    const growthEta = nextWindow * Number(fastest?.tick || 5) * 60000;
    if (!ready && woodchips && hasEmptySpace && growthEta <= cooldown &&
        (current.key === "woodchips" || current.tick <= 5)) wanted = current;
    if (current.id === wanted.id) return `Soil: ${current.name}`;
    if (Date.now() < Number(garden.nextSoil || 0))
      return `Soil: ${current.name}; ${wanted.name} in ${formatTime((garden.nextSoil - Date.now()) / 1000)}`;
    const button = document.getElementById(`gardenSoil-${wanted.id}`);
    if (!button) return `Open Garden to select ${wanted.name}`;
    // Use the native handler, which enforces unlocks and the real cooldown.
    button.click();
    return garden.soil === wanted.id ? `Soil: ${wanted.name}` : `Waiting to select ${wanted.name}`;
  }


  // Recipes checked against native 2.058 getMuts. Counts are adjacent parents;
  // planGardenParents asks getMuts whether each parent actually needs maturity.
  const gardenSeedRecipes = {
    thumbcorn: [['bakerWheat',2]], bakeberry: [['bakerWheat',2]],
    cronerice: [['bakerWheat',1],['thumbcorn',1]],
    gildmillet: [['cronerice',1],['thumbcorn',1]],
    clover: [['bakerWheat',1],['gildmillet',1]],
    goldenClover: [['clover',4]], shimmerlily: [['clover',1],['gildmillet',1]],
    elderwort: [['shimmerlily',1],['cronerice',1]],
    chocoroot: [['bakerWheat',1],['brownMold',1]],
    whiteMildew: [['brownMold',1]], whiteChocoroot: [['chocoroot',1],['whiteMildew',1]],
    whiskerbloom: [['shimmerlily',1],['whiteChocoroot',1]],
    chimerose: [['shimmerlily',1],['whiskerbloom',1]], nursetulip: [['whiskerbloom',2]],
    drowsyfern: [['chocoroot',1],['keenmoss',1]],
    wardlichen: [['cronerice',1],['whiteMildew',1]],
    keenmoss: [['greenRot',1],['brownMold',1]],
    queenbeet: [['chocoroot',1],['bakeberry',1]], queenbeetLump: [['queenbeet',8]],
    duketater: [['queenbeet',2]], glovemorel: [['crumbspore',1],['thumbcorn',1]],
    cheapcap: [['crumbspore',1],['shimmerlily',1]],
    foolBolete: [['doughshroom',1],['greenRot',1]], doughshroom: [['crumbspore',2]],
    wrinklegill: [['crumbspore',1],['brownMold',1]], greenRot: [['whiteMildew',1],['clover',1]],
    shriekbulb: [['duketater',3]], tidygrass: [['bakerWheat',1],['whiteChocoroot',1]],
    everdaisy: [['tidygrass',3],['elderwort',3]], ichorpuff: [['elderwort',1],['crumbspore',1]]
  };
  function gardenOpenCells(garden) {
    const cells=[];
    garden.plot.forEach((row,y)=>row.forEach((cell,x)=>{
      if(gardenTileOpen(garden,x,y)) cells.push({x,y});
    }));
    return cells;
  }
  function gardenLockChildren(garden,state,cells) {
    const old=state.locks || {};
    state.locks={};
    // Retain the same child across replans, then adopt the oldest uncollected seed.
    for(const tile of [...Object.values(old), ...[...cells].sort((a,b)=>
      garden.plot[b.y][b.x][1]-garden.plot[a.y][a.x][1])]) {
      const plant=gardenPlantAt(garden,tile);
      if(plant && !plant.unlocked && !state.locks[plant.key])
        state.locks[plant.key]={x:tile.x,y:tile.y,key:plant.key};
    }
    return new Set(Object.values(state.locks).map(gardenCellId));
  }
  function gardenSafeParent(garden,tile,key,locks) {
    const plant=garden.plants[key];
    return !Object.values(locks).some(lock=>{
      const child=garden.plants[lock.key];
      const adjacent=Math.abs(lock.x-tile.x)+Math.abs(lock.y-tile.y)===1;
      // Both directions: no contaminating parent beside a child, and no parent
      // vulnerable to a protected contaminating child (which cannot be removed).
      return adjacent && key!==lock.key &&
        ((plant.contam && !child.immortal && !child.noContam) ||
         (child.contam && !plant.immortal && !plant.noContam));
    });
  }
  function gardenAutomaticLayout(garden,key,recipe,locks,cells) {
    const fixed=new Map(Object.values(locks).map(t=>[gardenCellId(t),t]));
    let best=null;
    // Try several spatial orders. Greedy neighborhoods reuse parents; eight-parent
    // recipes naturally pack into non-overlapping 3x3 rings on a full Garden.
    for(let variant=0;variant<8;variant++) {
      const assigned=new Map(fixed), spaces=[];
      const order=[...cells].sort((a,b)=>{
        const ax=variant&1 ? 5-a.x:a.x, bx=variant&1 ? 5-b.x:b.x;
        const ay=variant&2 ? 5-a.y:a.y, by=variant&2 ? 5-b.y:b.y;
        return variant&4 ? ax-bx || ay-by : ay-by || ax-bx;
      });
      for(const center of order) {
        if(assigned.has(gardenCellId(center))) continue;
        const neighbors=cells.filter(t=>Math.abs(t.x-center.x)<=1 && Math.abs(t.y-center.y)<=1 && gardenCellId(t)!==gardenCellId(center));
        const trial=new Map(assigned);
        let valid=true;
        for(const [parent,n] of recipe) {
          let need=n-neighbors.filter(t=>trial.get(gardenCellId(t))?.key===parent).length;
          const available=neighbors.filter(t=>!trial.has(gardenCellId(t)) &&
            !spaces.some(s=>gardenCellId(s)===gardenCellId(t)) && gardenSafeParent(garden,t,parent,locks))
            .sort((a,b)=>Number(gardenPlantAt(garden,b)?.key===parent)-Number(gardenPlantAt(garden,a)?.key===parent));
          for(const tile of available) {if(need<=0) break; trial.set(gardenCellId(tile),{...tile,key:parent});need--;}
          if(need>0) {valid=false;break;}
        }
        if(valid && gardenMutationWeight(garden,neighbors.map(t=>trial.get(gardenCellId(t))).filter(Boolean).map(t=>({key:t.key,mature:true})),garden.plants[key])>0) {
          assigned.clear();for(const [id,t] of trial) assigned.set(id,t);
          spaces.push(center);
        }
      }
      // Include incidental viable spaces, beyond those used to construct the layout.
      const empty=cells.filter(t=>!assigned.has(gardenCellId(t)));
      const score=empty.reduce((sum,t)=>sum+gardenMutationWeight(garden,[...assigned.values()].filter(p=>Math.abs(p.x-t.x)<=1&&Math.abs(p.y-t.y)<=1).map(p=>({key:p.key,mature:true})),garden.plants[key]),0);
      const parents=[...assigned.values()].filter(t=>!fixed.has(gardenCellId(t)));
      if(score>0 && (!best || score>best.score || score===best.score && parents.length<best.parents.length))
        best={key,parents,spaces:empty,score};
    }
    return best;
  }
  function rankGardenSeedGoals(garden, pending) {
    const plants=Object.values(garden.plants);
    const recipes={...gardenSeedRecipes,brownMold:[["meddleweed",1]],crumbspore:[["meddleweed",1]]};
    const maturity=p=>Number(p.mature)/Math.max(0.01,Number(p.ageTick)+Number(p.ageTickR)/2);
    const work=key=>{
      const p=garden.plants[key];
      const recipe=recipes[key];
      const neighbors=(recipe||[]).flatMap(([key,n])=>Array.from({length:n},()=>({key,mature:true})));
      const chance=gardenMutationWeight(garden,neighbors,p);
      // Planning heuristic: growth plus expected mutation waiting at four
      // eligible spots on Wood chips. Layout/soil differences mean this is a
      // priority estimate, not a promised completion time.
      return maturity(p)+(chance>0?1/(12*chance):key==='meddleweed'?1/(36*0.002):20);
    };
    const scores=new Map(plants.map(p=>[p.key,0]));
    const uses=new Map();
    function visit(key,tail,path) {
      const p=garden.plants[key];
      if(!p || p.unlocked || pending.has(key) || path.has(key)) return;
      const next=new Set(path);next.add(key);
      const score=tail+work(key);
      scores.set(key,Math.max(scores.get(key)||0,score));
      uses.set(key,(uses.get(key)||0)+1);
      for(const [parent] of recipes[key]||[]) visit(parent,score,next);
    }
    for(const p of plants) if(!p.unlocked&&!pending.has(p.key)) visit(p.key,0,new Set());
    return plants.filter(p=>!p.unlocked&&!pending.has(p.key)).map(p=>({plant:p,
      score:scores.get(p.key)+5*(uses.get(p.key)||0)})).sort((a,b)=>b.score-a.score||a.plant.id-b.plant.id);
  }

  function runGardenSeedCycle(garden) {
    garden.computeMatures?.(); garden.computeBoostPlot?.();
    const run=`${Game.seed||''}:${Game.resets||0}:${garden.convertTimes||0}`;
    let state=toolkit.gardenCycle;
    if(!state || state.run!==run) state=toolkit.gardenCycle={run,locks:{},layout:null};
    const cells=gardenOpenCells(garden);
    let protectedIds=gardenLockChildren(garden,state,cells);
    for(const tile of Object.values(state.locks)) {
      const plant=gardenPlantAt(garden,tile);
      if(plant && garden.plot[tile.y][tile.x][1]>=plant.mature) garden.harvest(tile.x,tile.y,true);
    }
    protectedIds=gardenLockChildren(garden,state,cells);
    const plants=Object.values(garden.plants), missing=plants.filter(p=>!p.unlocked);
    if(!missing.length) {
      toolkit.gardenStatus=`All ${plants.length} seeds collected. `;
      if(controls.gardenAutoSacrifice && typeof garden.convert==='function') {
        garden.getUnlockedN?.();
        garden.convert(); // Native, guarded full-seed-log sacrifice; no generic prompt clicks.
        state.layout=null;
        toolkit.gardenStatus+='Sacrificed seed log; restarting next check.';
      } else toolkit.gardenStatus+='Auto sacrifice off; collection complete.';
      return;
    }
    const pending=new Set(Object.keys(state.locks));
    const signature=JSON.stringify([plants.map(p=>p.unlocked),Object.values(state.locks),cells]);
    if(state.signature!==signature || !state.layout) {
      state.signature=signature; state.layout=null;
      const ranked=rankGardenSeedGoals(garden,pending);
      // Prefer keeping productive work unless a substantially longer remaining
      // dependency chain becomes available. Protected children never compete.
      const previous=state.target;
      ranked.sort((a,b)=>b.score*(b.plant.key===previous?1.5:1)-a.score*(a.plant.key===previous?1.5:1));
      const candidates=ranked.map(r=>r.plant);
      for(const plant of candidates) {
        if(['meddleweed','brownMold','crumbspore'].includes(plant.key)) {
          if(plant.key!=='meddleweed'&&!garden.plants.meddleweed.unlocked) continue;
          const parents=garden.plants.meddleweed.unlocked ? cells.filter(t=>!protectedIds.has(gardenCellId(t))&&gardenSafeParent(garden,t,'meddleweed',state.locks)).map(t=>({...t,key:'meddleweed'})) : [];
          const spaces=cells.filter(t=>!parents.some(p=>gardenCellId(p)===gardenCellId(t)));
          if(!parents.length && !spaces.some(t=>!cells.some(n=>protectedIds.has(gardenCellId(n))&&Math.abs(n.x-t.x)<=1&&Math.abs(n.y-t.y)<=1))) continue;
          state.layout={key:'meddleweed',parents,spaces};state.target=plant.key;break;
        }
        const recipe=gardenSeedRecipes[plant.key];
        if(!recipe || !recipe.every(([key])=>garden.plants[key]?.unlocked && garden.plants[key].plantable!==false)) continue;
        const layout=gardenAutomaticLayout(garden,plant.key,recipe,state.locks,cells);
        if(layout) {state.layout=layout;state.target=plant.key;break;}
      }
      if(!state.layout) state.target=null;
    }
    let layout=state.layout;
    // Native special case: Meddleweed spawns only with no neighboring plants.
    // Its onKill rolls Brown mold/Crumbspore; uproot old weeds for better odds.
    const fungalNeeded=['brownMold','crumbspore'].some(k=>!garden.plants[k].unlocked&&!pending.has(k));
    if(!layout && (!garden.plants.meddleweed.unlocked&&!pending.has('meddleweed') || fungalNeeded)) {
      const parents=garden.plants.meddleweed.unlocked ? cells.filter(t=>!protectedIds.has(gardenCellId(t))&&gardenSafeParent(garden,t,'meddleweed',state.locks)).map(t=>({...t,key:'meddleweed'})) : [];
      layout={key:'meddleweed',parents,spaces:cells.filter(t=>!parents.some(p=>gardenCellId(p)===gardenCellId(t)))};
    }
    const desired=new Map((layout?.parents||[]).map(t=>[gardenCellId(t),t]));
    for(const tile of cells) {
      // Harvest can itself create a new fungus. Rescan immediately so the first
      // new child cannot be removed by the remainder of this pass.
      protectedIds=gardenLockChildren(garden,state,cells);
      if(protectedIds.has(gardenCellId(tile))) continue;
      const plant=gardenPlantAt(garden,tile);if(!plant) continue;
      const age=Number(garden.plot[tile.y][tile.x][1]);
      if(!gardenSafeParent(garden,tile,plant.key,state.locks) || desired.get(gardenCellId(tile))?.key!==plant.key ||
          !plant.immortal && age>=plant.mature && age+gardenGrowthWindow(garden,tile,plant,age).maximum>=100)
        garden.harvest(tile.x,tile.y,true);
    }
    protectedIds=gardenLockChildren(garden,state,cells);
    let waiting=0,unaffordable=0;
    if(layout) {
      // Protected matching parents may assist timing but are never planted/removed.
      const parents=[...layout.parents.filter(t=>!protectedIds.has(gardenCellId(t))),...Object.values(state.locks)];
      const timingKey=JSON.stringify([garden.plot,parents,layout.spaces,garden.plotBoost,controls.gardenSyncParents]);
      if(state.timingKey!==timingKey) {
        state.timingKey=timingKey;
        state.timing=planGardenParents(garden,parents,layout.spaces,garden.plants[layout.key]);
      }
      state.timing=synchronizeGardenCohorts(garden,parents,layout.spaces,garden.plants[layout.key],protectedIds);
      for(const entry of state.timing.entries) {
        if(state.timing.blocked?.has(gardenCellId(entry))) {unaffordable++;continue;}
        if(protectedIds.has(gardenCellId(entry))||gardenPlantAt(garden,entry)) continue;
        if(!gardenSafeParent(garden,entry,entry.key,state.locks)) continue;
        if(entry.delay>0.5) {waiting++;continue;}
        const cost=Number(garden.getCost(entry.plant));
        if(!Number.isFinite(cost)||Game.cookies-cost<getReserve()) {unaffordable++;continue;}
        if(entry.plant.unlocked && entry.plant.plantable!==false && (!garden.canPlant||garden.canPlant(entry.plant))) garden.useTool(entry.plant.id,entry.x,entry.y);
      }
      const ready=getGardenBreedingSpots(garden,layout.spaces,garden.plants[layout.key]);
      // Wood chips suppress spontaneous weeds. Dirt/Fertilizer keeps that route open.
      state.soil=chooseGardenSoil(garden,layout.key==='meddleweed'?0:ready,state.timing.nextWindow,layout.key!=='meddleweed');
    } else state.soil=chooseGardenSoil(garden,0,Infinity,false);
    toolkit.gardenStatus=`Seeds ${plants.length-missing.length}/${plants.length}; ${layout?'Breeding '+garden.plants[layout.key].name:'Waiting for protected seedlings'}. `+
      `Protected: ${Object.keys(state.locks).map(k=>garden.plants[k].name).join(', ')||'none'}. ${state.soil}. `+
      `${waiting} parents delayed; ${unaffordable} waiting for surplus. ${toolkit.gardenSyncStatus||""}. Sacrifices: ${garden.convertTimes||0}`;
  }

  function maintainGardenPreset() {
    if (!toolkit.active || (!controls.gardenPresetEnabled && !controls.gardenAutoBreed)) {
      toolkit.gardenStatus = "Garden plan off";
      return;
    }
    const garden = getGarden();
    if (!garden?.plot || !(Number(Game.Objects?.Farm?.amount) > 0)) {
      toolkit.gardenStatus = "Waiting for Garden"; return;
    }
    if (Game.OnAscend || Game.AscendTimer || Game.ReincarnateTimer || isAscensionAutomationBusy()) return;
    if (garden.freeze) { toolkit.gardenStatus = "Garden frozen manually; paused"; return; }
    if (controls.gardenAutoBreed) { runGardenSeedCycle(garden); return; }
    const target = gardenTargetPlant(garden);
    if (target === false) { toolkit.gardenStatus = "Unknown target name; no plants changed"; return; }
    const parents = controls.gardenPreset.filter(tile =>
      gardenTileOpen(garden, tile.x, tile.y) && garden.plants[tile.key]);
    const parentIds = new Set(parents.map(gardenCellId));
    const spaces = controls.gardenHarvestCells.filter(tile =>
      gardenTileOpen(garden, tile.x, tile.y) && !parentIds.has(gardenCellId(tile)));
    if (!parents.length) { toolkit.gardenStatus = "Save a planted parent pattern first"; return; }
    garden.computeMatures?.();
    garden.computeBoostPlot?.();

    // Check EVERY offspring tile. One immature target must not starve the rest.
    for (const tile of spaces) {
      const plant = gardenPlantAt(garden, tile);
      if (!plant) continue;
      if ((target && plant.key !== target.key) ||
          Number(garden.plot[tile.y][tile.x][1]) >= plant.mature)
        garden.harvest(tile.x, tile.y, true);
    }
    for (const tile of parents) {
      const plant = gardenPlantAt(garden, tile);
      if (!plant) continue;
      const age = Number(garden.plot[tile.y][tile.x][1]);
      if (plant.key !== tile.key) {
        // Preserve a wanted mutation even when contamination placed it on a parent tile.
        if ((target && plant.key !== target.key) || age >= plant.mature)
          garden.harvest(tile.x, tile.y, true);
      } else if (!plant.immortal && age >= plant.mature &&
          age + gardenGrowthWindow(garden, tile, plant, age).maximum >= 100) {
        garden.harvest(tile.x, tile.y, true);
      }
    }
    garden.computeBoostPlot?.();
    const key = JSON.stringify([garden.plot, parents, spaces, target?.key,
      garden.plotBoost, controls.gardenSyncParents, garden.plantsById.map(p => p.mature),
      Number(Game.auraMult?.("Supreme Intellect")) || 0]);
    if (toolkit.gardenTimingKey !== key) {
      toolkit.gardenTimingPlan = planGardenParents(garden, parents, spaces, target);
      toolkit.gardenTimingKey = key;
    }
    const protectedIds=new Set(parents.filter(t=>{
      const p=gardenPlantAt(garden,t); return p && (p.key!==t.key || !p.unlocked);
    }).map(gardenCellId));
    const plan = synchronizeGardenCohorts(garden,parents,spaces,target,protectedIds);
    let waiting = 0, planted = 0, unaffordable = 0, locked = 0;
    for (const entry of [...plan.entries].sort((a, b) => a.delay - b.delay)) {
      if (gardenPlantAt(garden, entry)) continue;
      if (plan.blocked?.has(gardenCellId(entry))) {unaffordable++;continue;}
      if (!entry.plant.unlocked || entry.plant.plantable === false) { locked++; continue; }
      if (entry.delay > 0.5) { waiting++; continue; }
      const cost = Number(garden.getCost(entry.plant));
      if (!Number.isFinite(cost) || Game.cookies - cost < getReserve()) { unaffordable++; continue; }
      if (garden.canPlant && !garden.canPlant(entry.plant)) continue;
      garden.useTool(entry.plant.id, entry.x, entry.y);
      garden.toCompute = true;
      if (gardenPlantAt(garden, entry)?.key === entry.key) planted++;
    }
    if (planted) toolkit.gardenTimingKey = null;
    const ready = getGardenBreedingSpots(garden, spaces, target);
    const hasEmptySpace = spaces.some(tile => !gardenPlantAt(garden, tile));
    const soil = chooseGardenSoil(garden, ready, plan.nextWindow, hasEmptySpace);
    const mature = parents.filter(tile => {
      const plant = gardenPlantAt(garden, tile);
      return plant?.key === tile.key && garden.plot[tile.y][tile.x][1] >= plant.mature;
    }).length;
    const phase = (ready ? `Breeding: ${ready} ready tile(s)` : "Growing parents") +
      (controls.gardenSyncParents ? `. ${toolkit.gardenSyncStatus || ""}` : "");
    toolkit.gardenStatus = `${phase}; ${mature}/${parents.length} mature. ${soil}` +
      (waiting ? `. Delaying ${waiting} faster parent(s) for overlap` : "") +
      (unaffordable ? `. ${unaffordable} planting(s) waiting for surplus` : "") +
      (locked ? `. ${locked} parent seed(s) unavailable` : "") +
      (target && !plan.groups.length ? ". Saved layout has no regular recipe for this target" : "");
  }
  toolkit.gardenTimer = setInterval(maintainGardenPreset, 1000);

  /* Stock trader: native quotes and CM's mode/delta/resting-value inputs. */
  function getStockMarket() {
    const bank = Game.Objects?.Bank;
    const market = bank?.minigame;
    return bank?.minigameLoaded && Array.isArray(market?.goodsById) &&
      typeof market.buyGood === "function" && typeof market.sellGood === "function" ? market : null;
  }

  function stockBookFor(market) {
    const run = `${Game.seed || ""}:${Number(Game.resets) || 0}`;
    let book = controls.stockBook;
    if (!book || book.run !== run || !book.positions || !Number.isFinite(book.realizedCookies)) {
      book = {run, positions: {}, realizedCookies: 0, realizedDollars: 0,
        trades: 0, feesDollars: 0, nativeProfit: Number(market.profit) || 0, lastAction: "No trades yet"};
      controls.stockBook = book;
    }
    // Native dollar profit also detects manual round trips with unchanged quantities.
    const externalTrade = Math.abs((Number(market.profit) || 0) - book.nativeProfit) >
      Math.max(1e-7, Math.abs(book.nativeProfit) * 1e-12);
    const changedQuantity = market.goodsById.some(g =>
      (Number(book.positions[g.id]?.quantity)||0) !== (Number(g.stock)||0));
    for (const good of market.goodsById) {
      const quantity = Math.max(0, Number(good.stock) || 0);
      const position = book.positions[good.id];
      if (!quantity) { delete book.positions[good.id]; continue; }
      if (!position || position.quantity !== quantity || (externalTrade && !changedQuantity))
        book.positions[good.id] = {quantity, unknown: true};
    }
    book.nativeProfit = Number(market.profit) || 0;
    return book;
  }

  // Matches Cookie Monster's expected-next-value estimate. It is a model,
  // not knowledge of the game's future random draws or a guaranteed signal.
  function stockExpectedNext(value, delta, resting, mode, level) {
    let next = value, drift = delta * (0.97 + 0.01 * (Number(Game.auraMult?.("Supreme Intellect")) || 0));
    if (mode === 0) drift *= 0.95;
    if (mode === 1) drift = drift * 0.99 + 0.02;
    if (mode === 2) drift = drift * 0.99 - 0.02;
    if (mode === 3) { drift += 0.06; next += 2.5; }
    if (mode === 4) { drift -= 0.06; next -= 2.5; }
    next += 0.01 * (resting - next);
    if (mode === 3) next -= 0.582;
    if (mode === 4) next += 0.6;
    if (next > 100 + 3 * (level - 1) && drift > 0) drift *= 0.9;
    if (next < 5) next += 0.5 * (5 - next);
    if (next < 5 && drift < 0) drift *= 0.95;
    return {value: Math.max(next + drift, 1), delta: drift};
  }

  // Native stochastic transitions, applied only to copies. Never consume the game's RNG.
  function stockSimulateTick(states, resting, level, aura, random) {
		var dragonBoost=aura;
		var globD=0;var globP=random();
		if (random()<0.1+0.1*dragonBoost) globD=(random()-0.5)*2;
		for (var i=0;i<states.length;i++)
		{
			var me=states[i];
			me.last=0;
			
			me.d*=0.97+0.01*dragonBoost;
			
			if (me.mode==0) {me.d*=0.95;me.d+=0.05*(random()-0.5);}
			else if (me.mode==1) {me.d*=0.99;me.d+=0.05*(random()-0.1);}
			else if (me.mode==2) {me.d*=0.99;me.d-=0.05*(random()-0.1);}
			else if (me.mode==3) {me.d+=0.15*(random()-0.1);me.val+=random()*5;}
			else if (me.mode==4) {me.d-=0.15*(random()-0.1);me.val-=random()*5;}
			else if (me.mode==5) me.d+=0.3*(random()-0.5);
			
			me.val+=(resting[me.id]-me.val)*0.01;
			
			if (globD!=0 && random()<globP) {me.val-=(1+me.d*Math.pow(random(),3)*7)*globD;me.val-=globD*(1+Math.pow(random(),3)*7);me.d+=globD*(1+random()*4);me.dur=0;}
			
			me.val+=Math.pow((random()-0.5)*2,11)*3;
			me.d+=0.1*(random()-0.5);
			if (random()<0.15) me.val+=(random()-0.5)*3;
			if (random()<0.03) me.val+=(random()-0.5)*(10+10*dragonBoost);
			if (random()<0.1) me.d+=(random()-0.5)*(0.3+0.2*dragonBoost);
			if (me.mode==5)
			{
				if (random()<0.5) me.val+=(random()-0.5)*10;
				if (random()<0.2) me.d=(random()-0.5)*(2+6*dragonBoost);
			}
			if (me.mode==3 && random()<0.3) {me.d+=(random()-0.5)*0.1;me.val+=(random()-0.7)*10;}
			if (me.mode==3 && random()<0.03) {me.mode=4;}
			if (me.mode==4 && random()<0.3) {me.d+=(random()-0.5)*0.1;me.val+=(random()-0.3)*10;}
			
			if (me.val>(100+(level-1)*3) && me.d>0) me.d*=0.9;
			
			me.val+=me.d;
			/*if (me.val<=0 && me.d<0)
			{
				me.d*=0.75;
				if (me.mode==4 && random()<0.05) me.mode=2;
			}
			if (me.val<2) me.val+=(2-me.val)*0.1;
			me.val=Math.max(me.val,0.01);*/
			/*var cutoff=5;
			var minvalue=1;
			if (me.val<=cutoff)
			{
				var s=Math.max(0,me.val)/cutoff;
				me.val=((2*minvalue-cutoff)*s+(2*cutoff-3*minvalue))*s*s+minvalue;//low soft-cap between 1 and 5
			}*/
			if (me.val<5) me.val+=(5-me.val)*0.5;
			if (me.val<5 && me.d<0) me.d*=0.95;
			me.val=Math.max(me.val,1);
			


			
			me.dur--;
			//if (random()<1/me.dur)
			if (me.dur<=0)
			{
				me.dur=Math.floor(10+random()*(690-200*dragonBoost));
				if (random()<dragonBoost && random()<0.5) me.mode=5;
				else if (random()<0.7 && (me.mode==3 || me.mode==4)) me.mode=5;
				else me.mode=[0,1,1,2,2,3,4,5][Math.floor(random()*8)];
			}
		}
  }

  function stockForecast(market) {
    const horizon = Math.min(20, Math.max(10, Math.round(Number(controls.stockHorizon) || 15)));
    const count = 256, goods = market.goodsById;
    const resting = Object.fromEntries(goods.map(g => [g.id, Number(market.getRestingVal(g.id))]));
    const results = goods.map(g => ({good:g, paths:[], at10:0, at20:0}));
    const level = Number(Game.Objects.Bank.level) || 1;
    const aura = Number(Game.auraMult?.("Supreme Intellect")) || 0;
    // A local deterministic stream keeps reruns reproducible without affecting game outcomes.
    let seed = (0x9e3779b9 ^ ((Number(market.ticks)||0)*2654435761)) >>> 0;
    const random = () => { seed += 0x6D2B79F5; let t=seed;
      t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61);
      return ((t^(t>>>14))>>>0)/4294967296; };
    for (let path=0; path<count; path++) {
      const states = goods.map(g => ({id:g.id,val:Number(g.val),d:Number(g.d),mode:Number(g.mode),dur:Number(g.dur)||0}));
      for (let tick=1; tick<=20; tick++) {
        stockSimulateTick(states,resting,level,aura,random);
        states.forEach((g,i) => {
          if(tick===10) results[i].at10+=g.val/count;
          if(tick===20) results[i].at20+=g.val/count;
          if(tick===horizon) results[i].paths.push(g.val);
        });
      }
    }
    const fee=0.2*Math.pow(0.95,Math.max(Number(market.brokers)||0,0));
    return results.map(r => {
      const price=Number(market.getGoodPrice(r.good)), entry=price*(1+fee);
      const mean=r.paths.reduce((a,b)=>a+b,0)/count;
      const variance=r.paths.reduce((a,b)=>a+(b-mean)**2,0)/count;
      const sorted=[...r.paths].sort((a,b)=>a-b);
      const win=r.paths.filter(v=>v>entry).length/count;
      return {...r,price,entry,mean,win,low:sorted[Math.floor(count*0.05)],horizon,
        next:stockExpectedNext(price,Number(r.good.d),resting[r.good.id],Number(r.good.mode),level).value,
        // Demand an edge beyond fees, user margin, and sampling uncertainty.
        buy:mean-1.96*Math.sqrt(variance/count)>entry*(1+(Number(controls.stockProfitMargin)||2)/100) && win>=0.55};
    });
  }

  function stockSignal(market,good) { return stockForecast(market).find(r=>r.good.id===good.id); }

  function stockPortfolioPlan(market, book, forecast, unit) {
    const reserve=Number(getReserve());
    const surplus=Math.max(0,Number(Game.cookies)-reserve);
    const marked=forecast.reduce((sum,r)=>sum+r.price*unit*Number(r.good.stock),0);
    const unknown=0; // Missing cost basis does not exclude holdings from risk management.
    const capital=Math.max(0,surplus+marked-unknown);
    const budget=Math.max(0,Math.min(capital,(surplus+marked)*controls.stockBudgetPercent/100-unknown));
    const targets=Object.fromEntries(forecast.map(r=>[r.good.id,0]));
    const candidates=forecast.filter(r=>r.good.active!==false);
    const sampleCount=forecast[0]?.paths.length||256;
    let pnl=Array(sampleCount).fill(0), used=0;
    const risk=(Number(controls.stockRiskPercent)||5)/100;
    const evaluate=values=>{
      const ordered=[...values].sort((a,b)=>a-b), tailCount=Math.ceil(sampleCount*0.05);
      const loss=Math.max(0,-ordered.slice(0,tailCount).reduce((a,b)=>a+b,0)/tailCount);
      const score=values.reduce((sum,v)=>sum+Math.log1p(Math.max(-0.999999999,v)),0)/sampleCount-0.5*loss;
      return {score,loss};
    };
    let current={score:0,loss:0};
    if(!(capital>0) || !(budget>0)) return {targets,risk:0,expected:0};
    // Greedy portfolio allocation across joint scenarios captures shared market shocks.
    // Existing shares have no new entry fee; only added shares pay overhead.
    for(let step=0;step<100;step++) {
      let best=null;
      for(const r of candidates) {
        const target=targets[r.good.id], owned=Number(r.good.stock);
        const existing=target<owned;
        if(!existing && (!r.buy || book.positions[r.good.id]?.unknown)) continue;
        const entry=existing?r.price:r.entry;
        const room=existing?owned-target:Math.max(0,market.getGoodMaxStock(r.good)-target);
        const qty=Math.min(room,Math.floor((budget-used)/(unit*entry)),Math.max(1,Math.floor(budget/40/(unit*entry))));
        if(!(qty>0)) continue;
        const delta=r.paths.map(v=>qty*unit*(v-entry)/capital);
        const next=pnl.map((v,i)=>v+delta[i]), metric=evaluate(next);
        if(metric.loss>risk || metric.score<=current.score) continue;
        const benefit=(metric.score-current.score)/(qty*unit*entry/capital);
        if(!best || benefit>best.benefit) best={r,qty,next,metric,benefit,cost:qty*unit*entry};
      }
      if(!best) break;
      targets[best.r.good.id]+=best.qty; used+=best.cost; pnl=best.next; current=best.metric;
    }
    return {targets,risk:current.loss,expected:pnl.reduce((a,b)=>a+b,0)/sampleCount};
  }

  function executeStockBuy(market, good, quantity, book, signal) {
    const unit = Number(Game.cookiesPsRawHighest);
    const price = Number(market.getGoodPrice(good));
    const fee = 0.2 * Math.pow(0.95, Math.max(Number(market.brokers) || 0, 0));
    const cost = unit * price * (1 + fee) * quantity;
    if (!(quantity > 0) || quantity === 10000 || book.positions[good.id]?.unknown || good.last === 2 ||
        !(unit > 0) || !Number.isFinite(cost) || Game.cookies - cost < getReserve()) return false;
    const before = Number(good.stock);
    if (!market.buyGood(good.id, quantity)) return false;
    const filled = Number(good.stock) - before;
    if (!(filled > 0)) return false;
    const old = book.positions[good.id];
    book.positions[good.id] = {quantity: before+filled, cookieCost: (old?.cookieCost||0)+unit*price*(1+fee)*filled,
      dollarCost: (old?.dollarCost||0)+price*(1+fee)*filled, peak:Math.max(old?.peak||0,price), unknown:false,
      lastBuyTick:market.ticks};
    book.feesDollars += price * fee * filled;
    book.trades++;
    book.nativeProfit = Number(market.profit) || 0;
    book.lastAction = `Bought ${filled} ${good.symbol || good.name || good.id} at $${price.toFixed(2)} + ${(fee*100).toFixed(2)}%`;
    saveControls();
    return true;
  }

  function executeStockSell(market, good, book, reason, quantity = Number(good.stock)) {
    if (!(good.stock > 0) || good.last === 1) return false;
    const before = Number(good.stock), price = Number(market.getGoodPrice(good));
    const unit = Number(Game.cookiesPsRawHighest), position = book.positions[good.id];
    if (!(unit > 0) || !(price > 0) || !Number.isFinite(unit * price * before)) return false;
    const order = Math.min(before, Math.max(0,Math.floor(quantity)));
    if (!(order > 0) || (order === 10000 && order !== before)) return false;
    if (!market.sellGood(good.id, order)) return false;
    const sold = before - Number(good.stock);
    if (!(sold > 0)) return false;
    if (position && !position.unknown) {
      const fraction = sold / position.quantity;
      book.realizedCookies += unit * price * sold - position.cookieCost * fraction;
      book.realizedDollars += price * sold - position.dollarCost * fraction;
      position.cookieCost *= 1-fraction; position.dollarCost *= 1-fraction;
      position.quantity -= sold;
    }
    if (position?.unknown) position.quantity = Number(good.stock);
    if (!good.stock) delete book.positions[good.id];
    book.trades++; book.nativeProfit = Number(market.profit) || 0;
    book.lastAction = `Sold ${sold} ${good.symbol || good.name || good.id}: ${reason}`;
    saveControls();
    return true;
  }

  function liquidateStocksBeforeAscend() {
    if (!controls.stockLiquidateBeforeAscend) return true;
    const market = getStockMarket();
    if (!market) return true;
    const book = stockBookFor(market);
    for (const good of market.goodsById) if (good.stock > 0)
      executeStockSell(market, good, book, "before automatic ascension");
    const remaining = market.goodsById.some(g => g.stock > 0);
    if (remaining) toolkit.ascensionStatus = "Waiting for next market tick to liquidate stocks before ascension";
    return !remaining;
  }

  function runStockAutomation() {
    if (!toolkit.active) return;
    const market = getStockMarket();
    if (!market) {toolkit.stockStatus = "Unlock the Bank minigame first"; return;}
    if (Game.OnAscend || Game.AscendTimer || Game.ReincarnateTimer || isAscensionAutomationBusy()) return;
    const book = stockBookFor(market);
    if (!controls.stockAuto) {toolkit.stockStatus = "Auto trading off"; return;}
    // Never loop trades at timer speed. Prices update on native market ticks.
    if (toolkit.stockMarketRef === market && toolkit.stockLastTick === market.ticks) return;
    toolkit.stockMarketRef = market; toolkit.stockLastTick = market.ticks;
    const unit = Number(Game.cookiesPsRawHighest);
    if (!(unit > 0) || !Number.isFinite(unit)) {toolkit.stockStatus = "Waiting for a valid market dollar value"; return;}
    const signals=stockForecast(market);
    if(signals.some(r=>![r.price,r.mean,...r.paths].every(Number.isFinite))) {
      toolkit.stockStatus="Invalid market data; trading paused";return;
    }
    const plan=stockPortfolioPlan(market,book,signals,unit);
    const soldThisTick=new Set();
    for(const r of signals) {
      const good=r.good, position=book.positions[good.id];
      if(!position || !(good.stock>0)) continue;
      const target=plan.targets[good.id];
      if(target<good.stock && executeStockSell(market,good,book,"forecast risk rebalance",good.stock-target)) soldThisTick.add(good.id);
    }
    for(const r of signals) {
      const good=r.good, position=book.positions[good.id];
      if(position?.unknown || soldThisTick.has(good.id) || position?.lastBuyTick===market.ticks) continue;
      const surplus=Math.max(0,Number(Game.cookies)-Number(getReserve()));
      const marked=signals.reduce((sum,r)=>sum+r.price*unit*Number(r.good.stock),0);
      const cap=Math.min(surplus,Math.max(0,(surplus+marked)*controls.stockBudgetPercent/100-marked));
      const quantity=Math.min(9999,Math.max(0,plan.targets[good.id]-good.stock),Math.floor(cap/(unit*r.entry)));
      executeStockBuy(market,good,quantity,book,r);
    }
    toolkit.stockRows=signals.map(r=>{
      const p=book.positions[r.good.id];
      return `${r.good.symbol||r.good.name}: $${r.price.toFixed(2)}; forecast ${r.horizon}t $${r.mean.toFixed(2)} `+
        `(5th percentile $${r.low.toFixed(2)}); modeled fee-profit chance ${(100*r.win).toFixed(0)}%\n`+
        `10t $${r.at10.toFixed(2)} / 20t $${r.at20.toFixed(2)}; held ${r.good.stock}, target ${plan.targets[r.good.id]}; `+
        (p?.unknown?"managed; historical cost/profit unknown":p?`fee-inclusive basis $${(p.dollarCost/p.quantity).toFixed(2)}`:"no position");
    });
    toolkit.stockStatus=`Tick ${market.ticks}; 256 joint scenarios, ${Number(controls.stockHorizon)||15}-tick horizon. `+
      `Modeled portfolio return ${(plan.expected*100).toFixed(2)}%; worst-5% average loss ${(plan.risk*100).toFixed(2)}%. `+
      `${(20*Math.pow(0.95,market.brokers)).toFixed(2)}% buy fee; sales 0%. Predictive allocation active.`;
    toolkit.telemetryStock = {
      tick: Number(market.ticks),
      horizon: Number(controls.stockHorizon) || 15,
      modeledReturn: plan.expected,
      modeledRisk: plan.risk,
      goods: signals.map(r => {
        const position = book.positions[r.good.id];
        return {
          id: r.good.id, symbol: r.good.symbol || "", name: r.good.name || "",
          price: r.price, stock: Number(r.good.stock), max: Number(market.getGoodMaxStock(r.good)),
          mode: Number(r.good.mode), trend: Number(r.good.d),
          mean: r.mean, low: r.low,
          high: Math.max(...r.paths), win: r.win, buy: r.buy,
          target: plan.targets[r.good.id] || 0,
          basis: position && !position.unknown && position.quantity > 0 ? position.dollarCost / position.quantity : 0,
          unknown: !!position?.unknown,
          paths: r.paths.map(value => Math.round(value * 1000) / 1000)
        };
      })
    };
    saveControls();
  }
  toolkit.stockTimer = setInterval(() => {
    try { runStockAutomation(); }
    catch (error) {toolkit.stockStatus = `Stock trader paused this tick: ${error.message || error}`;}
  }, 250);

  /* Grimoire, Force the Hand of Fate during Frenzy */
  function getGrimoire() {
    const tower = Game.Objects?.["Wizard tower"];
    if (!tower?.minigameLoaded || !tower.minigame) return null;
    return tower.minigame;
  }

  function getBuffSecondsLeft(buff) {
    const fps = Number(Game.fps) || 30;
    return Math.max((Number(buff?.time) || 0) / fps, 0);
  }

  function getBuffKey(buff) {
    return `${buff?.name || "buff"}:${buff?.id ?? buff?.time ?? 0}`;
  }

  function getActiveBuff(name) {
    const buff = Game.hasBuff?.(name);
    if (!buff) return null;
    return { ...buff, name: buff.name || name };
  }

  function getBestActiveBuff(names) {
    return names
      .map(getActiveBuff)
      .filter(Boolean)
      .sort((a, b) => getBuffSecondsLeft(b) - getBuffSecondsLeft(a))[0] || null;
  }

  function isClickPowerBuff(buff, fallbackName = "") {
    const name = String(buff?.name || fallbackName).trim().toLowerCase();

    if (CLICK_POWER_BUFF_NAMES.has(name)) return true;

    /* Cookie Clicker buffs can expose a direct click multiplier under
     * different property names. This keeps the detector forward-compatible
     * without treating ordinary production buffs, such as Frenzy, as clicks. */
    return [
      buff?.multClick,
      buff?.clickMult,
      buff?.clickPower,
      buff?.mousePower
    ].some((value) => Number(value) > 1);
  }

  function getActiveClickPowerBuffs() {
    return Object.entries(Game.buffs || {})
      .map(([key, buff]) => ({ ...buff, name: buff?.name || key }))
      .filter((buff) =>
        isClickPowerBuff(buff) && getBuffSecondsLeft(buff) > 0
      );
  }

  function getClickComboBuff() {
    return getActiveClickPowerBuffs()
      .sort((a, b) => getBuffSecondsLeft(b) - getBuffSecondsLeft(a))[0] || null;
  }

  function simulateFtHoFAtTowerCount(grimoire, spell, tower, remaining) {
    const originalAmount = tower.amount;
    const originalMagic = grimoire.magic;
    const originalMagicMax = grimoire.magicM;

    try {
      /*
       * Let Cookie Clicker calculate its own max magic and spell price.
       * This avoids maintaining a fragile copy of the game's formula.
       */
      tower.amount = remaining;
      grimoire.logic?.();

      const magicMax = Number(grimoire.magicM);
      const cost = Number(grimoire.getSpellCost(spell));
      return Number.isFinite(magicMax) && Number.isFinite(cost)
        ? { magicMax, cost }
        : null;
    } finally {
      tower.amount = originalAmount;
      grimoire.magic = originalMagic;
      grimoire.magicM = originalMagicMax;
    }
  }

  function getFtHoFTowerSalePlan(grimoire, spell) {
    const tower = Game.Objects?.["Wizard tower"];
    const amount = Math.floor(Number(tower?.amount) || 0);
    const currentMagic = Number(grimoire?.magic);
    if (!tower || amount < 2 || !Number.isFinite(currentMagic)) {
      return null;
    }

    // Keep only one tower if that is all the spell-cost calculation needs.
    const minimumRemaining = 1;
    for (let remaining = amount - 1; remaining >= minimumRemaining; remaining--) {
      const simulation = simulateFtHoFAtTowerCount(
        grimoire,
        spell,
        tower,
        remaining
      );
      if (!simulation) return null;

      // Selling towers can clamp current magic to the new maximum.
      const effectiveMagic = Math.min(currentMagic, simulation.magicMax);
      if (
        simulation.magicMax >= simulation.cost &&
        effectiveMagic >= simulation.cost
      ) {
        return {
          tower,
          sellAmount: amount - remaining,
          remaining,
          cost: simulation.cost
        };
      }
    }
    return null;
  }

  function runForceTheHandOfFate() {
    if (!toolkit.active || !controls.forceHand) {
      toolkit.forceHandStatus = "Off";
      return;
    }
    if (isAscensionAutomationBusy()) return;
    if (Game.OnAscend || Game.AscendTimer || Game.ReincarnateTimer) return;

    const grimoire = getGrimoire();
    const spell = grimoire?.spells?.["hand of fate"];
    if (!grimoire || !spell) {
      toolkit.forceHandStatus = "Waiting for Grimoire";
      return;
    }

    // Start every decision from Cookie Clicker's current, live magic values.
    grimoire.logic?.();

    const baseBuff = getBestActiveBuff(FTHOF_BASE_BUFFS);
    if (FTHOF_REQUIRE_FRENZY && !baseBuff) {
      toolkit.forceHandStatus = "Waiting for Frenzy or building special";
      return;
    }

    if (
      baseBuff &&
      toolkit.lastForceHandFrenzyId === getBuffKey(baseBuff)
    ) {
      toolkit.forceHandStatus = `Already cast this ${baseBuff.name}`;
      return;
    }

    if ((Game.shimmerTypes?.golden?.n || 0) > 0) {
      toolkit.forceHandStatus = "Waiting for screen cookie to clear";
      return;
    }

    if (baseBuff && getBuffSecondsLeft(baseBuff) <= 2) {
      toolkit.forceHandStatus = `Waiting for next ${baseBuff.name}`;
      return;
    }

    let cost = grimoire.getSpellCost(spell);
    let towersSoldForFtHoF = 0;
    if (AUTO_SELL_WIZARD_FOR_FTHOF && grimoire.magic < cost) {
      const plan = getFtHoFTowerSalePlan(grimoire, spell);
      if (plan) {
        const beforeAmount = Math.floor(Number(plan.tower.amount) || 0);
        plan.tower.sell(plan.sellAmount);
        const afterAmount = Math.floor(Number(plan.tower.amount) || 0);
        if (afterAmount !== plan.remaining || beforeAmount - afterAmount !== plan.sellAmount) {
          toolkit.forceHandStatus = "Sale verification failed; FtHoF stopped";
          return;
        }
        // Tower sales do not always refresh the minigame immediately.
        // Refresh before reading the real, post-sale spell cost.
        grimoire.logic?.();
        Game.CalculateGains?.();
        cost = grimoire.getSpellCost(spell);
        const actualMagic = Number(grimoire.magic) || 0;
        const actualMagicMax = Number(grimoire.magicM) || 0;
        if (actualMagicMax < cost || actualMagic < cost) {
          toolkit.forceHandStatus =
            `Post-sale magic ${Math.floor(actualMagic)}/${Math.floor(actualMagicMax)} needs ${Math.floor(cost)}; stopped`;
          return;
        }
        towersSoldForFtHoF = plan.sellAmount;
        controls.ftHofTowerRestoreTargetAmount = Math.max(
          Number(controls.ftHofTowerRestoreTargetAmount) || 0,
          beforeAmount
        );
        toolkit.ftHofTowerRebuildRemaining = Math.max(
          controls.ftHofTowerRestoreTargetAmount - afterAmount,
          0
        );
        saveControls();
        toolkit.forceHandStatus =
          `Sold ${plan.sellAmount} towers for ${Math.floor(cost)} magic FtHoF`;
      }
      toolkit.targetSnapshotAt = -Infinity;
    }
    if (grimoire.magic < cost) {
      toolkit.forceHandStatus =
        `Magic ${Math.floor(grimoire.magic)}/${cost}`;
      return;
    }

    try {
      if (grimoire.castSpell(spell)) {
        if (
          AUTO_RESTORE_WIZARD_TOWERS_AFTER_FTHOF &&
          towersSoldForFtHoF > 0
        ) {
          toolkit.ftHofTowerRebuildRemaining = Math.max(
            controls.ftHofTowerRestoreTargetAmount -
              Math.floor(Number(Game.Objects?.["Wizard tower"]?.amount) || 0),
            0
          );
        }
        toolkit.lastForceHandFrenzyId = baseBuff
          ? getBuffKey(baseBuff)
          : null;
        toolkit.forceHandStatus = baseBuff
          ? `Cast during ${baseBuff.name}`
          : "Cast";
      } else {
        toolkit.forceHandStatus = "Cast rejected";
      }
    } catch (_) {
      toolkit.forceHandStatus = "Waiting for Grimoire display";
    }
  }

  toolkit.forceHandTimer = setInterval(
    runForceTheHandOfFate,
    FTHOF_CHECK_MS
  );
  runForceTheHandOfFate();

  /* Pantheon, Godzamok selling during click buffs */
  function runPantheonAutomation() {
    if (!toolkit.active || !controls.pantheonAutomation) return;
    const temple = Game.Objects?.Temple;
    const minigame = temple?.minigame;
    if (!temple?.minigameLoaded || !minigame || typeof minigame.slotGod !== "function") return;
    if (hasGodzamokActive()) return;
    const godEntries = Array.isArray(minigame.gods)
      ? minigame.gods.map((entry, index) => [index, entry])
      : Object.entries(minigame.gods || {});
    const godEntry = godEntries.find(([, entry]) =>
      String(entry?.name || entry?.id || "").toLowerCase() === "godzamok"
    );
    if (!godEntry) return;
    const [godKey, god] = godEntry;
    const slots = minigame.slotGods || [];
    if (slots[0] === god || slots[0]?.name === god.name) return;
    try {
      minigame.slotGod(god.id ?? godKey, 0);
      if (minigame.slotGods?.[0] !== god && minigame.slotGods?.[0]?.name !== god.name) {
        minigame.slotGod(god, 0);
      }
      toolkit.godzamokStatus = "Godzamok assigned to diamond slot";
    } catch (_) {}
  }

  toolkit.pantheonTimer = setInterval(runPantheonAutomation, 1000);
  runPantheonAutomation();

  function hasGodzamokActive() {
    if (typeof Game.hasGod !== "function") return false;
    return Number(Game.hasGod("ruin")) > 0;
  }

  function getGodzamokClickGainPerBuilding() {
    const slot = Number(Game.hasGod?.("ruin")) || 0;
    if (slot === 1) return 0.01; // Diamond
    if (slot === 2) return 0.005; // Ruby
    if (slot === 3) return 0.0025; // Jade
    return 0;
  }

  function getCurrentGodzamokClickMultiplier() {
    const devastation = Game.hasBuff?.("Devastation");
    const multiplier = Number(devastation?.multClick);
    return Number.isFinite(multiplier) && multiplier > 0
      ? multiplier
      : 1;
  }
  function getGodzamokSaleLimits(building) {
    const amount = Math.max(Math.floor(Number(building?.amount) || 0), 0);
    if (controls.godzamokObjective === "all") return {amount, maxSell:amount};
    // Retain one Farm in optimized modes.
    const keep = Math.max(
      building?.name === "Farm" ? 1 : 0,
      GODZAMOK_MODE === "maximum-combo" ? 0 : GODZAMOK_KEEP_PER_BUILDING
    );
    const fraction = GODZAMOK_MODE === "maximum-combo" ? 1 : GODZAMOK_SELL_FRACTION;
    const cap = controls.godzamokObjective === "combo" ? amount : GODZAMOK_MODE === "maximum-combo"
      ? GODZAMOK_MAX_COMBO_SELL_PER_BUILDING : GODZAMOK_MAX_SELL_PER_BUILDING;
    return { amount, maxSell: Math.min(Math.floor(Math.max(amount - keep, 0) * fraction), cap) };
  }

  /*
   * Exact discrete cost frontier for the configured building types and caps.
   * For each total sold, retain the least round-trip cost and a backpointer.
   * The generator spreads work across timer turns, never mutating live amounts.
   * Future click income is still a forecast, not guaranteed profit.
   */
  function getGodzamokPricingKey() {
    return controls.godzamokObjective + ":" + GODZAMOK_BUILDINGS.map(name => {
      const building = Game.Objects?.[name];
      return building ? [name, building.amount, building.free, building.locked,
        building.getPrice?.(), building.getSellMultiplier?.()].join(":") : name;
    }).join("|");
  }

  function* buildGodzamokFrontier() {
    const pricingKey = getGodzamokPricingKey();
    const bank = Number(Game.cookies);
    const reserve = Number(getReserve());
    const budget = bank - reserve;
    const candidates = [];
    if (!Number.isFinite(budget)) return null;

    for (const name of GODZAMOK_BUILDINGS) {
      const building = Game.Objects?.[name];
      if (!building || building.locked || typeof building.sell !== "function" ||
          typeof building.buy !== "function" || typeof building.getPrice !== "function" ||
          typeof building.getSellMultiplier !== "function") continue;
      const { amount, maxSell } = getGodzamokSaleLimits(building);
      if (!(maxSell > 0)) continue;
      const quote = Object.create(building);
      const costs = [0];
      let buyCost = 0;
      let refund = 0;
      for (let quantity = 1; quantity <= maxSell; quantity++) {
        quote.amount = amount - quantity + 1;
        refund += Math.floor(Number(building.getPrice.call(quote)) * Number(building.getSellMultiplier()));
        quote.amount = amount - quantity;
        // Native sell refunds each unit at its PRE-sale price; native buy
        // charges each unit at its current price. Bulk tooltip totals differ.
        const price = Number(building.getPrice.call(quote));
        if (!(price >= 0) || !(refund >= 0) ||
            !Number.isFinite(price + refund)) break;
        buyCost += price;
        const loss = buyCost - refund;
        // Unexpected/modded pricing fails closed rather than approving a sale.
        if (loss < -Math.max(1, buyCost * 1e-12)) break;
        costs.push(Math.max(loss, 0));
        if (quantity % 16 === 0) yield;
      }
      if (costs.length > 1) {
        candidates.push({
          name, building, amount, free: building.free,
          price: Number(building.getPrice()), costs
        });
      }
    }

    let costs = new Float64Array([0]);
    const traces = [];
    let work = 0;
    for (const candidate of candidates) {
      const next = new Float64Array(costs.length + candidate.costs.length - 1);
      next.fill(Infinity);
      const choice = new Int32Array(next.length);
      choice.fill(-1);
      for (let previous = 0; previous < costs.length; previous++) {
        if (!Number.isFinite(costs[previous])) continue;
        for (let quantity = 0; quantity < candidate.costs.length; quantity++) {
          const cost = costs[previous] + candidate.costs[quantity];
          const total = previous + quantity;
          if (cost < next[total]) {
            next[total] = cost;
            choice[total] = quantity;
          }
          if (++work % 32768 === 0) yield;
        }
      }
      traces.push(choice);
      costs = next;
    }
    return { candidates, costs, traces, reserve, budget, pricingKey, createdAt: performance.now() };
  }

  function getGodzamokForecast() {
    const { clicksPerSecond } = getClickStats();
    // A stopped/throttled clicker must not borrow an old five-second average.
    const now = performance.now();
    const latest = toolkit.samples[toolkit.samples.length - 1];
    const recentClicks = toolkit.samples.filter(sample => sample.time >= now - 1000).length;
    const rate = Math.min(clicksPerSecond, recentClicks) *
      (controls.godzamokObjective === "combo" ? 1 : GODZAMOK_FORECAST_RATE_FRACTION);
    if (now - toolkit.started < 2000 || !latest || now - latest.time > 500 || !(rate > 0)) return null;
    if (Game.hasBuff?.("Cursed finger") || Game.recalculateGains) return null;

    const active = Object.entries(Game.buffs || {})
      .map(([name, buff]) => ({ ...buff, name: buff.name || name }))
      .filter(buff => getBuffSecondsLeft(buff) > 0);
    const trigger = active.find(buff =>
      String(buff.name).toLowerCase() !== "devastation" && isClickPowerBuff(buff)
    );
    // Do not retrigger from our own Devastation, or pay to stack it repeatedly.
    if (!trigger || Game.hasBuff?.("Devastation")) return null;

    // Credit only time before ANY current effect expires. No speculative tail.
    const horizon = Math.min(10, ...active.map(getBuffSecondsLeft));
    const latency = Math.max(0.25, (toolkit.godzamokTransactionMs || 0) / 1000 * 2);
    const seconds = Math.max(horizon - latency, 0);
    const perClick = Number(Game.computedMouseCps);
    const gain = getGodzamokClickGainPerBuilding();
    if (!(seconds >= 1) || !(perClick > 0) || !(gain > 0) ||
        !Number.isFinite(perClick)) return null;
    return {
      rate, averageRate: clicksPerSecond, seconds, horizon, latency, perClick, gain,
      valuePerBuilding: rate * perClick * gain * seconds,
      // Charge the full baseline income during execution as a conservative loss.
      interruptionCost: (rate * perClick + Math.max(Number(Game.cookiesPs) || 0, 0)) * latency
    };
  }

  function getGodzamokRecoveryRate(forecast) {
    let clickBoost = 1, productionBoost = 1;
    for (const buff of Object.values(Game.buffs || {})) {
      if (Number(buff.multClick) > 1) clickBoost *= Number(buff.multClick);
      if (Number(buff.multCpS) > 1) productionBoost *= Number(buff.multCpS);
    }
    // Remove temporary positive buffs. Dividing the whole click value by the
    // production multiplier also discounts its fixed part, conservatively.
    const rate = Math.max(Number(Game.cookiesPs) || 0, 0) / productionBoost *
      Math.max(0, 1 - (Number(Game.cpsSucked) || 0)) +
      forecast.rate * forecast.perClick / clickBoost / productionBoost;
    return Number.isFinite(rate) && rate > 0 ? rate : 0;
  }

  function scoreGodzamokCandidate(cost, sold, forecast, budget) {
    if (!Number.isFinite(cost) || cost < 0 || cost > budget) return null;
    const prestige = controls.godzamokObjective === "prestige";
    const combo = controls.godzamokObjective === "combo";
    const all = controls.godzamokObjective === "all";
    const confidence = prestige ? (Number(controls.godzamokConfidence) || 1) : 1;
    const extra = forecast.valuePerBuilding * sold * confidence;
    const baked = Math.max(extra - forecast.interruptionCost, 0);
    const profit = baked - cost;
    const loss = Math.max(-profit, 0);
    const recoveryRate = getGodzamokRecoveryRate(forecast);
    const recoverySeconds = loss > 0 ? (recoveryRate > 0 ? loss / recoveryRate : Infinity) : 0;
    // The cap applies to the entire upfront round-trip loss, even if all
    // future clicks stop. It is a ceiling, not a target to spend up to.
    const lossLimit = prestige ? Math.min(Math.max(budget, 0),
      recoveryRate * controls.godzamokMaxRecoverySeconds) : 0;
    if (prestige) {
      if (cost > lossLimit || recoverySeconds > controls.godzamokMaxRecoverySeconds || !(baked > 0)) return null;
    } else if (!all && (combo ? !(profit > 0) : !(extra > (cost + forecast.interruptionCost) * GODZAMOK_PROFIT_MARGIN))) return null;
    const score = prestige ? baked / (Math.max(forecast.horizon || forecast.seconds, 1) + recoverySeconds) : profit;
    const total = Math.max(Number(Game.cookiesReset) || 0, 0) + Math.max(Number(Game.cookiesEarned) || 0, 0);
    const baseline = (forecast.rate * forecast.perClick + Math.max(Number(Game.cookiesPs) || 0, 0)) * forecast.seconds;
    const prestigeGain = typeof Game.HowMuchPrestige === "function"
      ? Math.max(0, Math.floor(Game.HowMuchPrestige(total + baseline + baked)) - Math.floor(Game.HowMuchPrestige(total + baseline))) : 0;
    return { ...forecast, cost, sold, extra, baked, profit, score, loss, lossLimit, recoverySeconds, prestigeGain,
      objective: all ? "all" : combo ? "combo" : prestige ? "prestige" : "profit" };
  }

  function selectGodzamokPlan(frontier, forecast, budget) {
    let best = null;
    if (!frontier || !forecast) return null;
    for (let sold = 1; sold < frontier.costs.length; sold++) {
      const cost = frontier.costs[sold];
      const candidate = scoreGodzamokCandidate(cost, sold, forecast, budget);
      if (candidate && (!best || candidate.score > best.score ||
          (candidate.score === best.score && candidate.cost < best.cost))) best = candidate;
    }
    if (!best) return null;
    let remaining = best.sold;
    best.quantities = new Map();
    for (let index = frontier.candidates.length - 1; index >= 0; index--) {
      const quantity = frontier.traces[index][remaining];
      if (quantity < 0) return null;
      if (quantity) best.quantities.set(frontier.candidates[index].name, quantity);
      remaining -= quantity;
    }
    return remaining === 0 ? best : null;
  }

  function getGodzamokSellAllPlan(forecast) {
    const quantities = new Map();
    let sold=0, cost=0;
    for (const name of GODZAMOK_BUILDINGS) {
      const building=Game.Objects?.[name];
      const quantity=Math.max(0,Math.floor(Number(building?.amount)||0));
      if (!quantity) continue;
      if (typeof building.sell!=="function" || typeof building.buy!=="function") return null;
      const quote=quoteGodzamokRoundTrip(building,quantity);
      if (!quote) return null;
      quantities.set(name,quantity); sold+=quantity; cost+=quote.cost;
    }
    if (!sold) return null;
    const plan=scoreGodzamokCandidate(cost,sold,forecast,Infinity);
    return plan ? {...plan,quantities} : null;
  }

  function quoteGodzamokRoundTrip(building, quantity) {
    const quote = Object.create(building);
    const amount = Number(building.amount);
    let buyCost = 0;
    let refund = 0;
    for (let i = amount - quantity; i < amount; i++) {
      quote.amount = i;
      buyCost += Number(building.getPrice.call(quote));
      quote.amount = i + 1;
      refund += Math.floor(Number(building.getPrice.call(quote)) * Number(building.getSellMultiplier?.()));
    }
    if (!Number.isFinite(buyCost + refund) || buyCost < 0 || refund < 0) return null;
    return { buyCost, refund, cost: Math.max(buyCost - refund, 0) };
  }

  function getGodzamokExactBuyCost(building, quantity) {
    const quote = Object.create(building);
    let cost = 0;
    for (let index = 0; index < quantity; index++) {
      quote.amount = Number(building.amount) + index;
      cost += Number(building.getPrice.call(quote));
    }
    return cost;
  }

  function pauseGodzamokAfterLoss(reason) {
    controls.godzamokLossGuardPaused = true;
    toolkit.godzamokStatus = reason;
    saveControls();
  }

  function settleGodzamokLedger() {
    const ledger = toolkit.godzamokLedger;
    if (!ledger) return;
    const buff = Game.hasBuff?.("Devastation");
    if (buff === ledger.buff && getBuffSecondsLeft(buff) > 0 &&
        !Game.OnAscend && !Game.AscendTimer) return;
    ledger.complete = true;
    ledger.invalid = ledger.invalid || toolkit.godzamokRebuildQueue.length > 0;
    ledger.net = ledger.extraEarned - ledger.roundTripCost - ledger.interruptionCost;
    toolkit.lastGodzamokResult = ledger;
    toolkit.godzamokLedger = null;
    if (!ledger.invalid) toolkit.godzamokMeasuredNet += ledger.net;
    toolkit.godzamokCompletedSacrifices++;
    const incomplete = toolkit.godzamokRebuildQueue.length > 0 || ledger.invalid;
    if (ledger.objective === "prestige" && !incomplete) {
      const actualLoss = Math.max(-ledger.net, 0);
      controls.godzamokRecoveryDebt = actualLoss;
      controls.godzamokRecoveryEarned = Number(Game.cookiesEarned) || 0;
      controls.godzamokRecoveryRun = Number(Game.resets) || 0;
      const ratio = ledger.forecastExtra > 0 ? ledger.extraEarned / ledger.forecastExtra : 0;
      const old = Number(controls.godzamokConfidence) || 1;
      controls.godzamokConfidence = Math.max(0.25, Math.min(1, old * Math.min(ratio, 1.05)));
      saveControls();
    }
    if ((incomplete && !ledger.restoreDeferred) || (ledger.objective === "prestige"
        ? -ledger.net > ledger.lossLimit + ledger.interruptionCost + Math.max(1, ledger.lossLimit * 1e-12)
        : ["combo","all"].includes(ledger.objective) ? false : ledger.net <= 0)) {
      pauseGodzamokAfterLoss(incomplete
        ? "Paused: sacrifice could not be fully verified/restored"
        : `Paused: last sacrifice lost ${compactNumber(-ledger.net)}; review Diagnostics`);
    }
  }

  function recordGodzamokClick(earned) {
    settleGodzamokLedger();
    const ledger = toolkit.godzamokLedger;
    if (!ledger || ledger.invalid || toolkit.godzamokRebuildQueue.length ||
        Game.recalculateGains || Game.hasBuff?.("Cursed finger")) return;
    const buff = Game.hasBuff?.("Devastation");
    const multiplier = Number(buff?.multClick);
    if (buff !== ledger.buff || multiplier < 1 + ledger.gain - 1e-9 ||
        !(earned >= 0) || !Number.isFinite(earned)) return;
    // Only the portion attributable to OUR additive Godzamok multiplier.
    // Other buffs and unrelated bank spending are not credited as its profit.
    ledger.extraEarned += earned * ledger.gain / multiplier;
    ledger.clicks++;
    ledger.net = ledger.extraEarned - ledger.roundTripCost - ledger.interruptionCost;
  }

  toolkit.resumeGodzamok = () => {
    if (toolkit.godzamokRebuildQueue.length || toolkit.godzamokLedger) return false;
    controls.godzamokLossGuardPaused = false;
    toolkit.godzamokStatus = "Resumed; waiting for a combo within the selected limits";
    saveControls();
    return true;
  };

  function formatGodzamokResult() {
    const ledger = toolkit.godzamokLedger || toolkit.lastGodzamokResult;
    if (!ledger) return "No measured sacrifice yet";
    if (ledger.invalid) return "Sacrifice unverified: incomplete restoration; profit not credited";
    const net = ledger.extraEarned - ledger.roundTripCost - ledger.interruptionCost;
    return `${ledger.complete ? "Completed" : "In progress"}: ` +
      `extra clicks ${compactNumber(ledger.extraEarned)}, ` +
      `sell/rebuy loss ${compactNumber(ledger.roundTripCost)}, ` +
      `net ${net < 0 ? "-" : "+"}${compactNumber(Math.abs(net))}` +
      (ledger.objective === "prestige" ? `; prestige-focused, loss ceiling ${compactNumber(ledger.lossLimit)}` : "") +
      (ledger.invalid ? "; incomplete restoration, result unverified" : "");
  }

  function sellForGodzamok(plan) {
    let sold = 0;
    const start = performance.now();
    const bankBefore = Number(Game.cookies);
    const reserve = Number(getReserve());
    const quotes = [];
    let totalCost = 0;

    // Requote the WHOLE transaction before the first real sale.
    for (const [name, quantity] of plan.quantities) {
      const building = Game.Objects?.[name];
      if (!GODZAMOK_BUILDINGS.includes(name) || !building || getGodzamokSaleLimits(building).maxSell < quantity) return 0;
      if (plan.objective === "all" && quantity !== Math.floor(Number(building.amount))) return 0;
      const quote = quoteGodzamokRoundTrip(building, quantity);
      if (!quote) return 0;
      totalCost += quote.cost;
      quotes.push({ name, building, quantity, ...quote });
    }
    const rechecked = scoreGodzamokCandidate(totalCost, plan.sold, plan, plan.objective === "all" ? Infinity : bankBefore - reserve);
    if (!rechecked) return 0;
    Object.assign(plan, rechecked);

    // Restore each type synchronously, before another game tick or script can
    // use its sale proceeds. No waiting for future combo income to fund recovery.
    let transactionError = null;
    try {
    if (plan.objective === "all") {
      // Sell the entire allowlist first, independently of buyback affordability.
      for (const {building,name,quantity} of quotes) {
        const before=Number(building.amount);
        building.sell(quantity);
        const actualSold=Math.max(before-Number(building.amount),0);
        if (!actualSold) continue;
        sold+=actualSold;
        let recovery=toolkit.godzamokRebuildQueue.find(r=>r.name===name);
        if (!recovery) {
          recovery={name,restoreTo:before,remaining:actualSold,reserveFloor:reserve};
          toolkit.godzamokRebuildQueue.push(recovery);
        } else {
          recovery.restoreTo=Math.max(Number(recovery.restoreTo)||before,before);
          recovery.remaining=Math.max(0,recovery.restoreTo-Number(building.amount));
          recovery.reserveFloor=Math.max(Number(recovery.reserveFloor)||0,reserve);
        }
      }
      for (const recovery of toolkit.godzamokRebuildQueue) {
        const building=Game.Objects[recovery.name];
        while (Number(building.amount)<recovery.restoreTo) {
          const missing=recovery.restoreTo-Number(building.amount);
          const pack=[100,10,1].find(q=>q<=missing &&
            Game.cookies-getGodzamokExactBuyCost(building,q)>=Math.max(reserve,Number(recovery.reserveFloor)||0));
          if (!pack) break;
          const before=Number(building.amount);
          building.buy(pack);
          if (Number(building.amount)<=before) break;
        }
        recovery.remaining=Math.max(0,recovery.restoreTo-Number(building.amount));
      }
      toolkit.godzamokRebuildQueue=toolkit.godzamokRebuildQueue.filter(r=>r.remaining>0);
    } else for (const entry of quotes) {
      const { building, name, quantity } = entry;
      const before = Number(building.amount);
      if (Game.cookies - entry.cost < reserve || Game.buyMode !== 1) break;
      building.sell(quantity);
      const actualSold = Math.max(before - Number(building.amount), 0);
      if (!actualSold) continue;
      sold += actualSold;
      // Save exact recovery counts even if a modded buy method throws.
      toolkit.godzamokRebuildQueue.push({
        name, restoreTo: before, remaining: actualSold, reserveFloor: reserve
      });
      while (Number(building.amount) < before) {
        const missing = before - Number(building.amount);
        const pack = missing >= 100 ? 100 : missing >= 10 ? 10 : 1;
        const price = getGodzamokExactBuyCost(building, pack);
        if (!Number.isFinite(price) || Game.cookies - price < reserve) break;
        const prior = Number(building.amount);
        building.buy(pack);
        if (Number(building.amount) <= prior) break;
      }
      const remaining = Math.max(before - Number(building.amount), 0);
      const recovery = toolkit.godzamokRebuildQueue[toolkit.godzamokRebuildQueue.length - 1];
      recovery.remaining = remaining;
      if (remaining > 0) break;
      toolkit.godzamokRebuildQueue.pop();
    }
    } catch (error) { transactionError = error; }
    if (sold) {
      Game.CalculateGains?.();
      toolkit.godzamokTransactionMs = performance.now() - start;
      toolkit.lastGodzamokPlan = {
        ...plan, quantities: Object.fromEntries(plan.quantities),
        actualSold: sold, actualRoundTripCost: bankBefore - Number(Game.cookies),
        transactionMs: toolkit.godzamokTransactionMs
      };
      const buff = Game.hasBuff?.("Devastation");
      toolkit.godzamokLedger = {
        objective: plan.objective, lossLimit: plan.lossLimit, forecastExtra: plan.extra,
        buff, gain: sold * plan.gain, clicks: 0, extraEarned: 0,
        roundTripCost: Math.max(bankBefore - Number(Game.cookies), 0),
        interruptionCost: (plan.rate * plan.perClick + Math.max(Number(Game.cookiesPs) || 0, 0)) *
          toolkit.godzamokTransactionMs / 1000,
        restoreDeferred: plan.objective === "all" && Boolean(buff) && !transactionError && toolkit.godzamokRebuildQueue.length > 0,
        invalid: !buff || Boolean(transactionError) || toolkit.godzamokRebuildQueue.length > 0,
        startedAt: performance.now(), complete: false, net: 0
      };
      toolkit.godzamokLedger.net = -toolkit.godzamokLedger.roundTripCost - toolkit.godzamokLedger.interruptionCost;
      toolkit.targetSnapshotAt = -Infinity;
      toolkit.lastPurchaseAt = performance.now();
      toolkit.lastPurchaseName = "Godzamok immediate restore";
      toolkit.godzamokStatus = toolkit.godzamokRebuildQueue.length
        ? "Recovery pending; further sacrifices blocked"
        : `Sold/restored ${sold}; expected extra baked ${compactNumber(plan.baked)}`;
    }
    if (transactionError) {
      pauseGodzamokAfterLoss("Paused: restore failed; further sacrifices blocked");
      throw transactionError;
    }
    return sold;
  }

  function runGodzamokAutomation() {
    settleGodzamokLedger();
    if (!toolkit.active || !controls.godzamokCombos) {
      toolkit.godzamokStatus = "Off";
      return;
    }
    if (controls.godzamokLossGuardPaused) {
      toolkit.godzamokStatus = "Loss guard paused sacrifices; review Diagnostics";
      return;
    }
    if (controls.godzamokObjective === "prestige" && controls.godzamokRecoveryDebt > 0) {
      const earned = Number(Game.cookiesEarned) || 0;
      if ((Number(Game.resets) || 0) !== controls.godzamokRecoveryRun || earned < controls.godzamokRecoveryEarned)
        controls.godzamokRecoveryDebt = 0;
      else controls.godzamokRecoveryDebt = Math.max(0, controls.godzamokRecoveryDebt - (earned - controls.godzamokRecoveryEarned));
      controls.godzamokRecoveryEarned = earned;
      if (controls.godzamokObjective === "prestige" && controls.godzamokRecoveryDebt > 0) {
        toolkit.godzamokStatus = `Recovering ${compactNumber(controls.godzamokRecoveryDebt)} before another sacrifice`;
        return;
      }
      saveControls();
    }
    if (isAscensionAutomationBusy() || Game.OnAscend ||
        Game.AscendTimer || Game.ReincarnateTimer) return;
    if (!controls.autoBuy || !controls.autoBuyBuildings || Game.buyMode !== 1) {
      toolkit.godzamokStatus = "Enable building auto-buy for immediate restoration";
      return;
    }
    if (controls.godzamokObjective !== "all" && (toolkit.godzamokRebuildQueue.length ||
        toolkit.ftHofTowerRebuildRemaining > 0)) {
      toolkit.godzamokStatus = "Waiting for building restoration";
      return;
    }
    if (!hasGodzamokActive()) {
      toolkit.godzamokStatus = "Waiting for Godzamok";
      return;
    }
    // Prepare the cost frontier BETWEEN combos, so a ten-second buff need not
    // wait for a full search. Only changing building amounts/prices invalidates it.
    if (Game.hasBuff?.("Devastation")) return;
    const now = performance.now();
    if (now < (toolkit.godzamokNextPlanAt || 0)) return;
    try {
      if (controls.godzamokObjective === "all") {
        const forecast=getGodzamokForecast();
        if (!forecast) {toolkit.godzamokStatus="Sell all ready; waiting for click combo";return;}
        toolkit.godzamokNextPlanAt=performance.now()+1000;
        const plan=getGodzamokSellAllPlan(forecast);
        if (!plan) {toolkit.godzamokStatus="No allowed buildings available or invalid sale quote";return;}
        sellForGodzamok(plan);
        return;
      }
      let frontier = toolkit.godzamokFrontier;
      const pricingKey = getGodzamokPricingKey();
      if (!frontier || frontier.pricingKey !== pricingKey) {
        if (!toolkit.godzamokPlanner) toolkit.godzamokPlanner = buildGodzamokFrontier();
        const sliceStarted = performance.now();
        let result;
        do {
          result = toolkit.godzamokPlanner.next();
        } while (!result.done && performance.now() - sliceStarted < 8);
        if (!result.done) {
          toolkit.godzamokStatus = "Preparing optimal combo sacrifice";
          return;
        }
        toolkit.godzamokPlanner = null;
        frontier = result.value;
        if (!frontier || frontier.pricingKey !== getGodzamokPricingKey()) {
          toolkit.godzamokStatus = "Building prices changed; recalculating";
          return;
        }
        toolkit.godzamokFrontier = frontier;
      }
      const forecast = getGodzamokForecast();
      if (!forecast) {
        toolkit.godzamokStatus = "Plan ready; waiting for click combo and measured clicks";
        return;
      }
      toolkit.godzamokNextPlanAt = performance.now() + 1000;
      const plan = selectGodzamokPlan(frontier, forecast,
        Number(Game.cookies) - Number(getReserve()));
      if (!plan) {
        toolkit.godzamokStatus = "Skip: no sacrifice meets the selected goal and reserve limits";
        return;
      }
      sellForGodzamok(plan);
    } catch (error) {
      toolkit.godzamokPlanner = null;
      toolkit.godzamokNextPlanAt = performance.now() + 1000;
      toolkit.godzamokStatus = `Stopped safely: ${error.message || error}`;
    }
  }

  toolkit.godzamokTimer = setInterval(
    runGodzamokAutomation,
    GODZAMOK_CHECK_MS
  );
  runGodzamokAutomation();

  /* Autobuyer with post-purchase Lucky, Conjure, and Chain protection */
  function canBuyWithoutBreakingReserve(target) {
    if (shouldBuyImmediatelyWithoutReserve(target)) {
      return Game.cookies >= target.price;
    }

    return Game.cookies >= getRequiredBank(target);
  }

  function shouldBuyImmediatelyWithoutReserve(target) {
    if (isResearchTarget(target)) return true;
    return Boolean(
      BUY_LUCKY_UPGRADES_IMMEDIATELY &&
        target?.type === "upgrade" &&
        GOLDEN_COOKIE_PRIORITY_UPGRADES.includes(target.name)
    );
  }

  function isClickRelatedBuffActive() {
    return getActiveClickPowerBuffs().length > 0;
  }

  function buyTarget(target) {
    if (!target || Game.buyMode !== 1) return false;

    if (shouldBuyImmediatelyWithoutReserve(target)) {
      if (Game.cookies < target.price) return false;
    } else if (!canBuyWithoutBreakingReserve(target)) {
      return false;
    }

    if (target.type === "building") {
      target.item.buy(target.quantity);
      return true;
    }

    if (target.type === "upgrade") {
      if (target.item.bought || !target.item.canBuy()) return false;
      target.item.buy();
      return true;
    }

    return false;
  }

  function getBulkBuildingPrice(building, quantity) {
    const price = Number(building?.getSumPrice?.(quantity));
    return Number.isFinite(price) && price >= 0 ? price : Infinity;
  }

  function runGodzamokRebuild(now) {
    const queue = toolkit.godzamokRebuildQueue;
    if (!Array.isArray(queue) || queue.length === 0) return false;

    let actions = 0;
    let totalBought = 0;
    let lastBuildingName = "";

    /* This restoration ignores Cookie Monster colours and target priority,
     * but every pack must pass the same post-purchase reserve check used by
     * normal autobuy. */
    for (const entry of queue) {
      if (actions >= GODZAMOK_REBUILD_ACTIONS_PER_TICK) break;

      const building = Game.Objects?.[entry.name];
      if (!building || typeof building.buy !== "function") continue;

      const current = Math.floor(Number(building.amount) || 0);
      const savedRestoreTo = Math.floor(Number(entry.restoreTo));
      const restoreTo = Number.isFinite(savedRestoreTo)
        ? savedRestoreTo
        : current + Math.max(Math.floor(Number(entry.remaining)) || 0, 0);
      let missing = Math.max(restoreTo - current, 0);
      entry.restoreTo = restoreTo;
      entry.remaining = missing;

      while (
        missing > 0 &&
        actions < GODZAMOK_REBUILD_ACTIONS_PER_TICK
      ) {
        /* Always request the largest valid direct bulk purchase first. */
        const requested = missing >= 100 ? 100 : missing >= 10 ? 10 : 1;
        const price = getBulkBuildingPrice(building, requested);
        const target = {
          type: "building",
          item: building,
          quantity: requested,
          price
        };
        if (
          !Number.isFinite(price) ||
          !canBuyWithoutBreakingReserve(target) ||
          Game.cookies - price < (Number(entry.reserveFloor) || 0)
        ) break;

        const before = Math.floor(Number(building.amount) || 0);
        building.buy(requested);
        const after = Math.floor(Number(building.amount) || 0);
        const bought = Math.max(after - before, 0);
        if (bought <= 0) break;

        missing = Math.max(restoreTo - after, 0);
        entry.remaining = missing;
        totalBought += bought;
        lastBuildingName = entry.name;
        actions += 1;
      }
    }

    toolkit.godzamokRebuildQueue = queue.filter((entry) => {
      const building = Game.Objects?.[entry.name];
      const current = Math.floor(Number(building?.amount) || 0);
      const restoreTo = Math.floor(Number(entry.restoreTo));
      const remaining = Number.isFinite(restoreTo)
        ? Math.max(restoreTo - current, 0)
        : Math.max(Math.floor(Number(entry.remaining)) || 0, 0);
      entry.remaining = remaining;
      return remaining > 0;
    });

    if (totalBought > 0) {
      toolkit.lastPurchaseAt = now;
      toolkit.lastPurchaseName =
        `Godzamok restore: ${totalBought} ${lastBuildingName}`;
      toolkit.targetSnapshotAt = -Infinity;
    }

    if (toolkit.godzamokRebuildQueue.length > 0) {
      toolkit.godzamokRebuildBatch = 100;
      toolkit.godzamokStatus = totalBought > 0
        ? `Godzamok restoring: ${totalBought} buildings this pass`
        : "Godzamok restore waiting for cookies";
      /* A waiting Godzamok rebuild is not a global autobuy lock. It will try
       * again on the next scan, but normal buying and tower restoration may
       * keep progressing meanwhile. */
      return totalBought > 0;
    }

    toolkit.godzamokRebuildBatch = 0;
    toolkit.godzamokStatus = "Godzamok rebuild finished";
    return totalBought > 0;
  }

  function runFtHoFTowerRebuild(now) {
    if (!AUTO_RESTORE_WIZARD_TOWERS_AFTER_FTHOF) return false;

    const tower = Game.Objects?.["Wizard tower"];
    const currentAmount = Math.floor(Number(tower?.amount) || 0);
    let remaining = Math.max(
      Math.floor(toolkit.ftHofTowerRebuildRemaining || 0),
      Math.floor(Number(controls.ftHofTowerRestoreTargetAmount) || 0) -
        currentAmount,
      0
    );
    if (!tower || typeof tower.buy !== "function" || remaining <= 0) {
      toolkit.ftHofTowerRebuildRemaining = 0;
      return false;
    }

    let actions = 0;
    let totalBought = 0;

    while (
      remaining > 0 &&
      actions < FTHOF_TOWER_REBUILD_ACTIONS_PER_TICK
    ) {
      /* Do not get stuck on an unaffordable 100-pack. Fall through to a
       * 10-pack, then a 1-pack, while still keeping the restore queue ahead
       * of normal colour-based buying. */
      const option = [100, 10, 1]
        .filter((quantity) => remaining >= quantity)
        .map((quantity) => {
          const price = getBulkBuildingPrice(tower, quantity);
          const target = {
            type: "building",
            item: tower,
            quantity,
            price
          };
          const canRestore = FTHOF_TOWER_RESTORE_IGNORE_RESERVE
            ? (Number(Game.cookies) || 0) >= price
            : canBuyWithoutBreakingReserve(target);
          return { quantity, price, canRestore };
        })
        .find(({ price, canRestore }) =>
          Number.isFinite(price) && canRestore
        );

      if (!option) {
        toolkit.forceHandStatus =
          `Waiting to restore ${remaining} Wizard towers`;
        /* Preserve the restore target, but never freeze normal autobuy while
         * no Wizard tower pack is affordable. */
        return false;
      }

      const before = Math.floor(Number(tower.amount) || 0);
      tower.buy(option.quantity);
      const after = Math.floor(Number(tower.amount) || 0);
      const bought = Math.max(after - before, 0);
      if (bought <= 0) break;

      remaining -= bought;
      totalBought += bought;
      actions += 1;
    }

    toolkit.ftHofTowerRebuildRemaining = Math.max(remaining, 0);
    if (totalBought <= 0) return false;

    if (toolkit.ftHofTowerRebuildRemaining === 0) {
      controls.ftHofTowerRestoreTargetAmount = 0;
      saveControls();
    }

    toolkit.lastPurchaseAt = now;
    toolkit.lastPurchaseName =
      `FtHoF tower restore: ${totalBought} Wizard tower`;
    if (toolkit.ftHofTowerRebuildRemaining > 0) {
      toolkit.forceHandStatus =
        `Restoring ${toolkit.ftHofTowerRebuildRemaining} Wizard towers`;
    }
    toolkit.targetSnapshotAt = -Infinity;
    return true;
  }

  toolkit.setWizardTowerRestoreTarget = (amount) => {
    const target = Math.max(Math.floor(Number(amount) || 0), 0);
    const current = Math.floor(
      Number(Game.Objects?.["Wizard tower"]?.amount) || 0
    );
    controls.ftHofTowerRestoreTargetAmount = target;
    toolkit.ftHofTowerRebuildRemaining = Math.max(target - current, 0);
    saveControls();
    return {
      current,
      target,
      remaining: toolkit.ftHofTowerRebuildRemaining
    };
  };

  function runLateGameBulkBuy(now) {
    const started = performance.now();
    let purchases = 0;
    // Bounded passes keep clicking and other automation responsive. No CM ranks.
    for (let pass = 0; pass < 20 && performance.now() - started < 8; pass++) {
      let changed = false;
      if (AUTO_BUY_UPGRADES && controls.autoBuyUpgrades) {
        for (const upgrade of [...(Game.UpgradesInStore || [])]) {
          if (performance.now() - started >= 8 || purchases >= 40) break;
          if (!upgrade || upgrade.bought || upgrade.pool === "prestige" ||
              upgrade.pool === "toggle" ||
              (!AUTO_BUY_ONE_MIND && upgrade.name === "One mind") ||
              isBlockedByGrandmapocalypseStageCap(upgrade)) continue;
          const price = Number(upgrade.getPrice());
          if (!Number.isFinite(price) || price < 0) continue;
          const target = {type:"upgrade", item:upgrade, name:upgrade.name, price, research:isResearchUpgrade(upgrade)};
          if (!canBuyWithoutBreakingReserve(target) || !upgrade.canBuy()) continue;
          upgrade.buy();
          if (upgrade.bought) {
            purchases++; changed = true;
            toolkit.lastPurchaseName = `Bulk mode: ${upgrade.name}`;
          }
          if (Game.promptOn || Game.OnAscend) break;
        }
      }
      if (Game.promptOn || Game.OnAscend) break;
      if (AUTO_BUY_BUILDINGS && controls.autoBuyBuildings) {
        const buildings = collectionValues(Game.ObjectsById);
        for (let i = 0; i < buildings.length; i++) {
          if (performance.now() - started >= 8 || purchases >= 40) break;
          const index = (Number(toolkit.bulkBuyCursor) || 0) % buildings.length;
          toolkit.bulkBuyCursor = index + 1;
          const item = buildings[index];
          if (!item || item.locked ||
              (item.name === "Wizard tower" && !controls.autoBuyWizardTowers)) continue;
          const price = getBulkBuildingPrice(item, 100);
          if (!Number.isFinite(price)) continue;
          const target = {type:"building", item, quantity:100, price, name:`100 ${item.name}`};
          if (!canBuyWithoutBreakingReserve(target)) continue;
          const before = item.amount;
          item.buy(100);
          if (item.amount > before) {
            purchases++; changed = true;
            toolkit.lastPurchaseName = `Bulk mode: ${item.amount-before} ${item.name}`;
          }
        }
      }
      if (!changed || purchases >= 40) break;
    }
    if (purchases) {
      toolkit.lastPurchaseAt = now;
      toolkit.targetSnapshotAt = -Infinity;
    }
    return purchases;
  }

  toolkit.autoBuyTimer = setInterval(() => {
    if (!toolkit.active || !controls.autoBuy) return;
    if (isAscensionAutomationBusy()) return;
    if (Game.buyMode !== 1 || Game.OnAscend) return;

    const now = performance.now();

    /*
     * Godzamok's clicking bonus remains after buildings are repurchased.
     * Restore the sold buildings immediately so their click-related bonuses
     * apply for the rest of the active Click Frenzy or Dragonflight.
     */
    if (runFtHoFTowerRebuild(now)) return;
    if (runGodzamokRebuild(now)) return;

    if (now - toolkit.lastPurchaseAt < AUTO_BUY_COOLDOWN_MS) return;

    // Regular Frenzy and building specials do not increase click value.
    // Pause buying only while a direct clicking-effect combo is active.
    if (isClickRelatedBuffActive()) return;

    if (controls.lateGameBulkBuy) {
      if (!Game.promptOn) runLateGameBulkBuy(now);
      return;
    }

    const rankedTargets = getTargetSnapshot();
    if (rankedTargets.length === 0) return;

    /* Only the immediate research/Lucky checks look for an affordable item.
     * The normal path must keep the first ranked target, even while saving
     * for it, otherwise an affordable green item can bypass an unaffordable
     * blue target. */
    const buyableTargets = rankedTargets.filter(
      canBuyWithoutBreakingReserve
    );

    const immediateResearchUpgrade = buyableTargets
      .filter(isResearchTarget)
      .sort((a, b) => a.price - b.price)[0];
    if (immediateResearchUpgrade) {
      if (buyTarget(immediateResearchUpgrade)) {
        toolkit.lastPurchaseAt = now;
        toolkit.lastPurchaseName = immediateResearchUpgrade.name;
        toolkit.lastPurchasePrice = immediateResearchUpgrade.price;
        getTargetSnapshot(true);
      }
      return;
    }

    const immediateLuckyUpgrade = buyableTargets
      .filter(shouldBuyImmediatelyWithoutReserve)
      .sort((a, b) => a.price - b.price)[0];

    if (immediateLuckyUpgrade) {
      if (buyTarget(immediateLuckyUpgrade)) {
        toolkit.lastPurchaseAt = now;
        toolkit.lastPurchaseName = immediateLuckyUpgrade.name;
        toolkit.lastPurchasePrice = immediateLuckyUpgrade.price;
        getTargetSnapshot(true);
      }
      return;
    }

    /* Hold for the top-ranked target. Blue first therefore saves for blue
     * instead of purchasing a currently affordable green target. */
    const target = rankedTargets[0];
    if (!target) return;

    if (!canBuyWithoutBreakingReserve(target)) return;

    if (buyTarget(target)) {
      toolkit.lastPurchaseAt = now;
      toolkit.lastPurchaseName = target.name;
      toolkit.targetSnapshotAt = -Infinity;
    }
  }, AUTO_BUY_CHECK_MS);

  /* Dragon egg, training, rebuilding, and aura automation */
  function collectionValues(collection) {
    if (!collection) return [];
    return Array.isArray(collection)
      ? collection.filter(Boolean)
      : Object.values(collection).filter(Boolean);
  }

  function getDragonAuraByName(name) {
    return collectionValues(Game.dragonAuras).find(
      (aura) => aura?.name === name || aura?.dname === name
    ) || null;
  }

  function getDragonAuraName(auraId) {
    return Game.dragonAuras?.[auraId]?.name || "No aura";
  }

  function getAuraProductionFactor(auraId) {
    const name = getDragonAuraName(auraId);
    if (name === "Radiant Appetite") return 2;
    if (name === "Breath of Milk") return 1.05;
    return 1;
  }

  function getReserveAfterAuraChange(auraId, slot) {
    const primaryId = Number(Game.dragonAura) || 0;
    const secondaryId = Number(Game.dragonAura2) || 0;
    const currentFactor =
      getAuraProductionFactor(primaryId) *
      getAuraProductionFactor(secondaryId);
    const futurePrimaryId = slot === 0 ? auraId : primaryId;
    const futureSecondaryId = slot === 1 ? auraId : secondaryId;
    const futureFactor =
      getAuraProductionFactor(futurePrimaryId) *
      getAuraProductionFactor(futureSecondaryId);
    const projectedRatio=controls.adaptiveDragonAuras && toolkit.auraPairScore
      ? toolkit.auraPairScore([Game.dragonAuras?.[futurePrimaryId],Game.dragonAuras?.[futureSecondaryId]]) /
        Math.max(1e-100,toolkit.auraPairScore([Game.dragonAuras?.[primaryId],Game.dragonAuras?.[secondaryId]])) : futureFactor/currentFactor;
    const futureBaseCps = getBaseCps() * Math.max(1,projectedRatio);
    return getReserveForCps(
      futureBaseCps,
      getEffectiveReserveMode()
    );
  }

  function getHighestOwnedBuilding() {
    return collectionValues(Game.ObjectsById)
      .filter((building) => (Number(building.amount) || 0) > 0)
      .sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0))[0] || null;
  }

  function getBuildingReplacementCost(building, amount) {
    const currentAmount = Math.max(Math.floor(Number(building.amount) || 0), 0);
    const replacementAmount = Math.min(
      Math.max(Math.floor(Number(amount) || 0), 0),
      currentAmount
    );
    if (replacementAmount === 0) return 0;

    const start = currentAmount - replacementAmount;
    const free = Math.max(Math.floor(Number(building.free) || 0), 0);
    const basePrice = Number(building.basePrice);
    const priceIncrease = Number(Game.priceIncrease) || 1.15;

    if (!(basePrice >= 0)) {
      const reversePrice = Number(
        building.getReverseSumPrice?.(replacementAmount)
      );
      const sellMultiplier = Number(building.getSellMultiplier?.());
      if (reversePrice >= 0 && sellMultiplier > 0) {
        return Math.ceil(reversePrice / sellMultiplier);
      }
      return Infinity;
    }

    let price = 0;
    for (let index = start; index < currentAmount; index++) {
      price +=
        basePrice * Math.pow(priceIncrease, Math.max(0, index - free));
    }

    if (typeof Game.modifyBuildingPrice === "function") {
      price = Game.modifyBuildingPrice(building, price);
    }
    return Math.ceil(price);
  }

  function rebuildSacrificedBuildings(originalAmounts) {
    for (const { building, amount } of originalAmounts) {
      const missing = Math.max(
        amount - Math.floor(Number(building.amount) || 0),
        0
      );
      if (missing > 0) building.buy(missing);
    }

    return originalAmounts.every(
      ({ building, amount }) =>
        Math.floor(Number(building.amount) || 0) >= amount
    );
  }

  function getDragonSacrifices(level) {
    const dragonLevels = Game.dragonLevels || [];
    const lastLevel = dragonLevels.length - 1;
    const buildings = collectionValues(Game.ObjectsById)
      .sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0));

    if (level >= 5 && level < lastLevel - 2) {
      const building = buildings.find(
        (candidate) => Number(candidate.id) === level - 5
      );
      return building ? [{ building, amount: 100 }] : [];
    }

    if (level === lastLevel - 2) {
      return buildings.map((building) => ({ building, amount: 50 }));
    }

    if (level === lastLevel - 1) {
      return buildings.map((building) => ({ building, amount: 200 }));
    }

    return [];
  }

  function getSeasonMissingDrops() {
    const names=Game.season==='christmas'?Game.reindeerDrops:
      Game.season==='halloween'?Game.halloweenDrops:Game.season==='easter'?Game.easterEggs:[];
    return (names||[]).filter(name=>{
      const u=Game.Upgrades?.[name];return u && !u.unlocked && !u.bought;
    });
  }
  function getAdaptiveDragonAuras() {
    const unlocked=name=>{const a=getDragonAuraByName(name);return a && Game.dragonLevel>=a.id+4?a:null;};
    const production=['Radiant Appetite','Breath of Milk','Elder Battalion'].map(unlocked).filter(Boolean);
    const two=Game.dragonLevel>=(Game.dragonLevels?.length||Infinity)-1;
    let utility=null,reason='Production';
    if(controls.dragonUtilityAuras && !isClickRelatedBuffActive()) {
      if(getSeasonMissingDrops().length) {utility=unlocked('Mind Over Matter');reason='Seasonal drops';}
      else if(((controls.gardenAutoBreed && Object.values(getGarden()?.plants||{}).some(p=>!p.unlocked)) || (controls.gardenPresetEnabled && controls.gardenPreset.length)) && getGarden() && !getGarden().freeze) {
        utility=unlocked('Supreme Intellect');reason='Garden breeding';
      }
    }
    const kittenNames=['helpers','workers','engineers','overseers','managers','accountants','specialists','experts','consultants','assistants to the regional manager','marketeers','analysts','executives','admins','strategists','angels'];
    const powers=[.1,.125,.15,.175,.2,.2,.2,.2,.2,.175,.15,.125,.115,.11,.105,.1];
    let milk=Number(Game.milkProgress)||0;
    if(Game.Has?.("Santa's milk and cookies")) milk*=1.05;
    const mother=Game.hasGod?.('mother');milk*=mother===1?1.1:mother===2?1.05:mother===3?1.03:1;
    milk*=Number(Game.eff?.('milk'))||1;
    const cats=hasMilk=>{
      let factor=1;const m=milk*(hasMilk?1.05:1);
      kittenNames.forEach((n,i)=>{if(Game.Has?.('Kitten '+n)) factor*=1+m*powers[i];});
      if(Game.Has?.('Fortune #103'))factor*=1+m*.05;
      return factor;
    };
    const grandma=Game.Objects?.Grandma;
    const other=collectionValues(Game.ObjectsById).reduce((n,b)=>n+(b===grandma?0:Number(b.amount)||0),0);
    const currentElder=Number(Game.auraMult?.('Elder Battalion'))||0;
    const currentMilk=Number(Game.auraMult?.('Breath of Milk'))||0;
    const milkhelp=Game.Has?.('Milkhelp&reg; lactose intolerance relief tablets');
    const rawGrand=(Number(grandma?.storedTotalCps)||0)/(1+.01*other*currentElder)/(milkhelp?1+.05*milk*(1+.05*currentMilk):1);
    const rawOther=Math.max(0,(Number(Game.buildingCps)||0)-(Number(grandma?.storedTotalCps)||0));
    const score=pair=>{
      const names=pair.filter(Boolean).map(a=>a.name),m=names.includes('Breath of Milk');
      const grand=rawGrand*(names.includes('Elder Battalion')?1+.01*other:1)*(milkhelp?1+.05*milk*(m?1.05:1):1);
      return (rawOther+grand+(Game.Has?.('"egg"')?9:0))*cats(m)*(names.includes('Radiant Appetite')?2:1);
    };
    toolkit.auraPairScore=score;
    const options=[];
    for(const a of production) {
      if(!two)options.push([utility||a,null]);
      else if(utility)options.push([a,utility]);
      else for(const b of production)if(a.id!==b.id)options.push([a,b]);
    }
    let best=options.sort((a,b)=>score(b)-score(a))[0]||[utility,null];
    // Preserve slot order where possible; swapping an identical pair costs nothing.
    if(best[1] && (Game.dragonAura===best[1].id || Game.dragonAura2===best[0]?.id)) best=[best[1],best[0]];
    toolkit.adaptiveAuraStatus=`${reason}: ${best.filter(Boolean).map(a=>a.name).join(' + ')||'waiting for trained auras'}`;
    return {primary:best[0],secondary:best[1]};
  }
  function runSeasonAndAuraAutomation() {
    if(!toolkit.active || Game.OnAscend || Game.AscendTimer || Game.ReincarnateTimer || isAscensionAutomationBusy() || Game.promptOn) return;
    const wanted=controls.renewSeason;
    if(wanted) {
      if(Game.season===wanted) toolkit.seasonStatus=`${Game.seasons?.[wanted]?.name||wanted} active`;
      else {
        const name=Game.seasons?.[wanted]?.trigger;
        const upgrade=Game.Upgrades?.[name];
        const cost=Number(upgrade?.getPrice?.());
        if(!Game.Has?.('Season switcher') || !upgrade?.unlocked) toolkit.seasonStatus='Waiting for Season switcher / biscuit unlock';
        else if(!Number.isFinite(cost)||Game.cookies-cost<getReserve())toolkit.seasonStatus='Waiting for season renewal funds above reserve';
        else if(upgrade.canBuy?.()) {
          upgrade.buy();
          toolkit.seasonStatus=Game.season===wanted?`Started ${wanted}`:'Season purchase not completed';
        }
      }
    } else toolkit.seasonStatus='Season renewal off';
    if(!controls.adaptiveDragonAuras || Game.promptOn || Game.buyMode!==1) return;
    // Avoid aura churn as Godzamok sells/restores buildings during a short combo.
    if(isClickRelatedBuffActive()) {toolkit.adaptiveAuraStatus='Holding auras during click combo';return;}
    const now=performance.now();
    if(now-(toolkit.adaptiveAuraLastCheck||-Infinity)<30000) return;
    toolkit.adaptiveAuraLastCheck=now;
    const desired=getAdaptiveDragonAuras();
    // Do not remove Dragon Guts while wrinklers occupy its extra slots.
    if(Game.hasAura?.('Dragon Guts') && (Game.wrinklers||[]).filter(w=>w.hp>0&&w.phase>0).length>(Game.Has?.('Elder spice')?12:10)) {
      toolkit.adaptiveAuraStatus='Keeping Dragon Guts while extra wrinkler slots are occupied';return;
    }
    toolkit.adaptiveAuraPlan=desired;
    ensureDragonAuras();
  }

  function getDesiredDragonAuras() {
    if(controls.adaptiveDragonAuras) return toolkit.adaptiveAuraPlan || getAdaptiveDragonAuras();
    const level = Math.max(Math.floor(Number(Game.dragonLevel) || 0), 0);
    const lastLevel = (Game.dragonLevels?.length || 1) - 1;
    const radiant = getDragonAuraByName("Radiant Appetite");
    const milk = getDragonAuraByName("Breath of Milk");
    const primary = radiant && level >= Number(radiant.id) + 4
      ? radiant
      : milk && level >= Number(milk.id) + 4
        ? milk
        : null;
    const secondary =
      level >= lastLevel && milk && primary?.id !== milk.id
        ? milk
        : null;
    return { primary, secondary };
  }

  function switchDragonAura(aura, slot) {
    if (!aura) return false;
    const currentAura = slot === 0
      ? Number(Game.dragonAura) || 0
      : Number(Game.dragonAura2) || 0;
    if (currentAura === Number(aura.id)) return true;

    if (
      typeof Game.SelectDragonAura !== "function" ||
      typeof Game.SetDragonAura !== "function" ||
      typeof Game.ConfirmPrompt !== "function"
    ) {
      toolkit.dragonStatus = "Dragon aura controls are unavailable";
      return false;
    }

    const highestBuilding = getHighestOwnedBuilding();
    const replacementCost = highestBuilding
      ? getBuildingReplacementCost(highestBuilding, 1)
      : 0;
    const requiredBank =
      replacementCost + getReserveAfterAuraChange(Number(aura.id), slot);

    if (Game.cookies < requiredBank) {
      toolkit.dragonStatus =
        `Saving ${compactNumber(requiredBank)} to equip ${aura.name}`;
      return false;
    }

    const originalAmounts = highestBuilding
      ? [{ building: highestBuilding, amount: highestBuilding.amount }]
      : [];

    try {
      Game.SelectDragonAura(slot);
      Game.SetDragonAura(Number(aura.id), slot);
      Game.ConfirmPrompt();
    } catch (_) {
      toolkit.dragonStatus = `Could not equip ${aura.name}`;
      return false;
    }

    const selectedAura = slot === 0
      ? Number(Game.dragonAura) || 0
      : Number(Game.dragonAura2) || 0;
    if (selectedAura !== Number(aura.id)) {
      toolkit.dragonStatus = `Waiting to confirm ${aura.name}`;
      return false;
    }

    if (!rebuildSacrificedBuildings(originalAmounts)) {
      toolkit.dragonStatus = `${aura.name} equipped, rebuild incomplete`;
      return false;
    }

    toolkit.dragonStatus = `Equipped ${aura.name}${slot === 1 ? " secondary" : ""}`;
    toolkit.lastDragonActionAt = performance.now();
    toolkit.targetSnapshotAt = -Infinity;
    return true;
  }

  function ensureDragonAuras() {
    const { primary, secondary } = getDesiredDragonAuras();
    if (primary && (Number(Game.dragonAura) || 0) !== Number(primary.id)) {
      return { ready: false, acted: switchDragonAura(primary, 0) };
    }
    if (
      secondary &&
      (Number(Game.dragonAura2) || 0) !== Number(secondary.id)
    ) {
      return { ready: false, acted: switchDragonAura(secondary, 1) };
    }
    return { ready: true, acted: false };
  }

  function buyCrumblyEgg() {
    const egg = Game.Upgrades?.["A crumbly egg"];
    if (!egg || egg.bought) return true;
    if (!egg.unlocked) {
      toolkit.dragonStatus = "Waiting for 1M cookies baked this ascension";
      return false;
    }

    const price = Number(egg.getPrice?.() ?? egg.basePrice ?? egg.price) || 25;
    const requiredBank = price + getReserve();
    if (Game.cookies < requiredBank) {
      toolkit.dragonStatus =
        `Saving ${compactNumber(requiredBank)} for A crumbly egg`;
      return false;
    }

    const canBuy = typeof egg.canBuy === "function" ? egg.canBuy() : true;
    if (!canBuy) {
      toolkit.dragonStatus = "Waiting to buy A crumbly egg";
      return false;
    }

    egg.buy();
    if (!egg.bought) {
      toolkit.dragonStatus = "A crumbly egg purchase was rejected";
      return false;
    }

    toolkit.dragonStatus = "Bought A crumbly egg";
    toolkit.lastDragonActionAt = performance.now();
    toolkit.targetSnapshotAt = -Infinity;
    return false;
  }

  function trainDragonCookieStep(level) {
    const cost = DRAGON_COOKIE_STEP_COSTS[level];
    const requiredBank = cost + getReserve();
    if (Game.cookies < requiredBank) {
      toolkit.dragonStatus =
        `Saving ${compactNumber(requiredBank)} for dragon stage ${level + 1}`;
      return false;
    }

    const previousLevel = level;
    Game.UpgradeDragon();
    if (Number(Game.dragonLevel) !== previousLevel + 1) {
      toolkit.dragonStatus = `Dragon stage ${level + 1} was rejected`;
      return false;
    }

    toolkit.dragonStatus = `Completed dragon cookie stage ${level + 1}`;
    toolkit.lastDragonActionAt = performance.now();
    return true;
  }

  function trainDragonSacrificeStep(level, sacrifices) {
    if (sacrifices.length === 0) {
      toolkit.dragonStatus = `Dragon training data missing at level ${level}`;
      return false;
    }

    const short = sacrifices.find(
      ({ building, amount }) => (Number(building.amount) || 0) < amount
    );
    if (short) {
      toolkit.dragonStatus =
        `Waiting for ${short.amount} ${short.building.name}`;
      return false;
    }

    const replacementCost = sacrifices.reduce(
      (total, { building, amount }) =>
        total + getBuildingReplacementCost(building, amount),
      0
    );
    const requiredBank = replacementCost + getReserve();
    if (Game.cookies < requiredBank) {
      toolkit.dragonStatus =
        `Saving ${compactNumber(requiredBank)} to train and rebuild`;
      return false;
    }

    const originalAmounts = sacrifices.map(({ building }) => ({
      building,
      amount: Math.floor(Number(building.amount) || 0)
    }));
    const previousLevel = level;
    Game.UpgradeDragon();
    if (Number(Game.dragonLevel) !== previousLevel + 1) {
      toolkit.dragonStatus = `Dragon training at level ${level} was rejected`;
      return false;
    }

    if (!rebuildSacrificedBuildings(originalAmounts)) {
      toolkit.dragonStatus = "Dragon trained, building rebuild incomplete";
      return false;
    }

    toolkit.dragonStatus = `Trained dragon level ${level + 1} and rebuilt`;
    toolkit.lastDragonActionAt = performance.now();
    toolkit.targetSnapshotAt = -Infinity;
    return true;
  }

  function petDragonForDrops() {
    const dragonDrops = ["Dragon scale", "Dragon claw", "Dragon fang", "Dragon teddy bear"];
    const missingDrops = dragonDrops.filter((name) => !Game.Has?.(name));
    if (missingDrops.length === 0) return false;
    if (typeof Game.ClickSpecialPic === "function") Game.ClickSpecialPic();
    else document.getElementById("specialPic")?.click();
    toolkit.dragonStatus = `Petting dragon for drops: ${missingDrops.length} left`;
    toolkit.lastDragonActionAt = performance.now();
    return true;
  }

  function runDragonDropAutomation() {
    if (!toolkit.active || !controls.dragonDrops) return;
    if (Game.OnAscend || Game.AscendTimer || Game.ReincarnateTimer) return;
    const lastLevel = (Game.dragonLevels?.length || 0) - 1;
    if (lastLevel >= 0 && Number(Game.dragonLevel) >= lastLevel) petDragonForDrops();
  }

  function runDragonAutomation() {
    if (!toolkit.active || !controls.dragonAutomation) {
      toolkit.dragonStatus = "Off";
      return;
    }
    if (isAscensionAutomationBusy()) return;
    if (Game.OnAscend || Game.AscendTimer || Game.ReincarnateTimer) return;
    if (Game.buyMode !== 1) {
      toolkit.dragonStatus = "Waiting for Buy mode";
      return;
    }
    if (Game.promptOn) {
      toolkit.dragonStatus = "Waiting for open prompt to close";
      return;
    }
    if (
      performance.now() - toolkit.lastDragonActionAt <
      DRAGON_ACTION_COOLDOWN_MS
    ) {
      return;
    }
    if (!buyCrumblyEgg()) return;
    if (!Game.dragonLevels?.length || typeof Game.UpgradeDragon !== "function") {
      toolkit.dragonStatus = "Waiting for dragon menu";
      return;
    }

    const level = Math.max(Math.floor(Number(Game.dragonLevel) || 0), 0);
    const lastLevel = Game.dragonLevels.length - 1;
    const auraResult = controls.adaptiveDragonAuras ? {ready:true,acted:false} : ensureDragonAuras();
    if (!auraResult.ready) return;

    if (controls.dragonMode === "milk-only" && level >= 5) {
      toolkit.dragonStatus = "Breath of Milk ready, milk-only plan complete";
      return;
    }
    if (level >= lastLevel) {
      if (controls.dragonDrops && petDragonForDrops()) return;
      toolkit.dragonStatus = "Dragon fully trained, all drops collected";
      return;
    }
    if (level < DRAGON_COOKIE_STEP_COSTS.length) {
      trainDragonCookieStep(level);
      return;
    }

    trainDragonSacrificeStep(level, getDragonSacrifices(level));
  }

  toolkit.dragonTimer = setInterval(
    runDragonAutomation,
    DRAGON_CHECK_MS
  );
  runDragonAutomation();
  toolkit.dragonDropTimer = setInterval(runDragonDropAutomation, DRAGON_CHECK_MS);
  runDragonDropAutomation();

  toolkit.seasonAuraTimer=setInterval(runSeasonAndAuraAutomation,5000);
  runSeasonAndAuraAutomation();

  /* Wrinkler automation */
  function getWrinklerPayout(wrinkler) {
    if (!wrinkler || !(wrinkler.sucked > 0)) return 0;

    let multiplier = 1.1;
    if (Game.Has?.("Sacrilegious corruption")) multiplier *= 1.05;
    if (wrinkler.type === 1) multiplier *= 3;
    if (Game.Has?.("Wrinklerspawn")) multiplier *= 1.05;

    const temple = Game.Objects?.Temple;
    if (temple?.minigameLoaded && Game.hasGod) {
      const scornLevel = Number(Game.hasGod("scorn")) || 0;
      if (scornLevel === 1) multiplier *= 1.15;
      else if (scornLevel === 2) multiplier *= 1.1;
      else if (scornLevel === 3) multiplier *= 1.05;
    }

    return wrinkler.sucked * multiplier;
  }

  function getAttachedWrinklers() {
    return (Game.wrinklers || []).filter(
      (wrinkler) => wrinkler.phase === 2 && wrinkler.sucked > 0.5
    );
  }

  function getEligibleWrinklers() {
    return getAttachedWrinklers().filter(
      (wrinkler) =>
        !controls.protectShinyWrinklers || wrinkler.type !== 1
    );
  }

  function getWrinklerSummary() {
    const attached = getAttachedWrinklers();
    const max = Number(Game.getWrinklersMax?.()) || 10;
    const stored = attached.reduce(
      (total, wrinkler) => total + getWrinklerPayout(wrinkler),
      0
    );
    const shinyCount = attached.filter((wrinkler) => wrinkler.type === 1).length;

    return {
      attached: attached.length,
      max,
      stored,
      shinyCount
    };
  }

  function popWrinklers(wrinklers, reason) {
    if (controls.wrinklerMode === "hold") {
      toolkit.lastWrinklerAction = "Holding all wrinklers";
      return false;
    }
    if (!wrinklers.length) return false;

    for (const wrinkler of wrinklers) wrinkler.hp = 0;
    toolkit.lastWrinklerPopAt = performance.now();
    toolkit.lastWrinklerAction =
      `${reason}: ${wrinklers.length} wrinkler${wrinklers.length === 1 ? "" : "s"}`;
    return true;
  }

  function fundRecommendedTargetWithWrinklers() {
    if (!controls.autoBuy) return false;
    const target = getTargetSnapshot().find((item) => !item.timeSaver);
    if (!target) return false;

    const missing = Math.max(getRequiredBank(target) - Game.cookies, 0);
    if (!(missing > 0)) return false;

    const eligible = getEligibleWrinklers()
      .map((wrinkler) => ({
        wrinkler,
        payout: getWrinklerPayout(wrinkler)
      }))
      .filter(({ payout }) => payout > 0)
      .sort((a, b) => b.payout - a.payout);

    const available = eligible.reduce(
      (total, entry) => total + entry.payout,
      0
    );
    if (available < missing) return false;

    const selected = [];
    let selectedPayout = 0;
    for (const entry of eligible) {
      selected.push(entry.wrinkler);
      selectedPayout += entry.payout;
      if (selectedPayout >= missing) break;
    }

    return popWrinklers(selected, `Fund ${target.name}`);
  }

  function farmWrinklers() {
    const summary = getWrinklerSummary();
    if (summary.attached < summary.max) return false;

    const fattest = getEligibleWrinklers().reduce((best, wrinkler) => {
      if (!best) return wrinkler;
      return getWrinklerPayout(wrinkler) > getWrinklerPayout(best)
        ? wrinkler
        : best;
    }, null);

    return fattest ? popWrinklers([fattest], "Farm wrinklers") : false;
  }

  function runWrinklerAutomation() {
    if (!toolkit.active) return;
    if (isAscensionAutomationBusy()) return;
    if (Game.OnAscend || Game.AscendTimer || Game.ReincarnateTimer) return;
    if (controls.wrinklerMode === "hold") {
      toolkit.lastWrinklerAction = "Holding all wrinklers";
      return;
    }
    if (!(Number(Game.elderWrath) > 0)) {
      toolkit.lastWrinklerAction = "Waiting for wrinklers";
      return;
    }

    const now = performance.now();
    if (now - toolkit.lastWrinklerPopAt < WRINKLER_POP_COOLDOWN_MS) return;

    if (
      controls.wrinklerMode === "smart" &&
      fundRecommendedTargetWithWrinklers()
    ) {
      return;
    }

    if (controls.wrinklerMode === "farm") farmWrinklers();
  }

  toolkit.wrinklerTimer = setInterval(
    runWrinklerAutomation,
    WRINKLER_CHECK_MS
  );
  runWrinklerAutomation();

  /* Ascension manager */
  function getAscensionPlan() {
    return (
      ASCENSION_PLANS[controls.ascensionPlanId] ||
      ASCENSION_PLANS[DEFAULT_ASCENSION_PLAN_ID]
    );
  }

  function getAvailablePrestige() {
    return Math.max(Math.floor(Number(Game.ascendMeterLevel) || 0), 0);
  }

  function getHeavenlyUpgrade(name) {
    return Game.Upgrades?.[name] ||
      (name === "Starter kitchen" ? Game.Upgrades?.["Starter Kitchen"] : null);
  }

  function isUnavailableLuckyDigit(name) {
    return name === "Lucky digit" && !getHeavenlyUpgrade(name);
  }

  function getPlannedUpgradeEntries(plan) {
    return plan.stages.flatMap((stage, stageIndex) =>
      stage.heavenlyUpgrades.map((name) => ({
        name,
        stage,
        stageIndex,
        cost: ASCENSION_UPGRADE_COSTS[name] ||
          Number(Game.Upgrades?.[name]?.basePrice) || 0
      }))
    );
  }

  function getAscensionProgress(plan) {
    for (let stageIndex = 0; stageIndex < plan.stages.length; stageIndex++) {
      const stage = plan.stages[stageIndex];
      const missing = stage.heavenlyUpgrades.filter(
        (name) => !getHeavenlyUpgrade(name)?.bought && !isUnavailableLuckyDigit(name)
      );
      if (missing.length === 0) continue;

      const remainingCost = missing.reduce(
        (total, name) =>
          total +
          (ASCENSION_UPGRADE_COSTS[name] ||
            Number(Game.Upgrades?.[name]?.basePrice) || 0),
        0
      );
      const savedChips = Game.OnAscend
        ? Math.max(Math.floor(Number(Game.heavenlyChips) || 0), 0)
        : 0;

      return {
        allComplete: false,
        stage,
        stageIndex,
        missing,
        remainingCost,
        savedChips,
        adaptiveTarget: Math.max(remainingCost - savedChips, 1)
      };
    }

    return {
      allComplete: true,
      stage: null,
      stageIndex: plan.stages.length,
      missing: [],
      remainingCost: 0,
      savedChips: Math.max(Math.floor(Number(Game.heavenlyChips) || 0), 0),
      adaptiveTarget: Infinity
    };
  }

  function getEffectiveAscensionTarget(plan) {
    if (controls.lateGameRepeatAscension) return controls.lateGameRepeatTarget;
    const progress = getAscensionProgress(plan);
    const baseTarget = controls.ascensionAdaptiveTarget
      ? progress.adaptiveTarget
      : Math.max(Math.floor(Number(controls.ascensionPrestigeTarget) || 0), 1);
    if (TARGET_LUCKY_DIGIT && progress.missing.includes("Lucky digit") && Number.isFinite(baseTarget)) {
      return baseTarget + ((7 - (baseTarget % 10) + 10) % 10);
    }
    return baseTarget;
  }

  function setAscensionState(state, status) {
    toolkit.ascensionState = state;
    toolkit.ascensionStatus = status;
    toolkit.ascensionStateStartedAt = performance.now();
  }

  function failAscension(status) {
    controls.ascensionArmed = false;
    setAscensionState("error", status);
    saveControls();
  }

  function switchToNextAscensionPlan(plan) {
    const nextPlan = ASCENSION_PLANS[plan?.nextPlanId];
    if (!nextPlan || !controls.continueAscensions) return false;

    controls.ascensionPlanId = plan.nextPlanId;
    controls.ascensionAdaptiveTarget = true;
    controls.ascensionPrestigeTarget = nextPlan.stages[0].guideCost;
    controls.strategyProfileId = "mid-active";
    controls.reserveMode = STRATEGY_PROFILES["mid-active"].reserveMode;
    controls.chainProtection =
      STRATEGY_PROFILES["mid-active"].chainProtection;
    controls.grandmapocalypseStageCap =
      STRATEGY_PROFILES["mid-active"].grandmapocalypseStageCap;
    /* Hold is an explicit user lock. Never replace it while advancing an
     * ascension plan, otherwise the next wrinkler timer can cash out the
     * bank under Smart mode. */
    if (controls.wrinklerMode !== "hold") {
      controls.wrinklerMode = STRATEGY_PROFILES["mid-active"].wrinklerMode;
    }
    controls.dragonMode = STRATEGY_PROFILES["mid-active"].dragonMode;
    toolkit.targetSnapshotAt = -Infinity;
    setAscensionState(
      "idle",
      `Moved to ${nextPlan.label}`
    );
    saveControls();
    return true;
  }

  function applyPostAscensionSettings() {
    if (!TURN_OFF_BANK_RESERVES_AFTER_ASCENSION) return;

    controls.reserveMode = "none";
    controls.chainProtection = false;
  }

  function isPermanentUpgradeCandidate(upgrade) {
    if (!upgrade?.bought) return false;
    if (!upgrade.name?.toLowerCase().startsWith("kitten")) return false;
    return !["prestige", "toggle", "tech"].includes(upgrade.pool);
  }

  function getBestPermanentUpgrades() {
    const upgradesById = Game.UpgradesById || [];
    const upgrades = Array.isArray(upgradesById)
      ? upgradesById
      : Object.values(upgradesById);

    return upgrades
      .filter(isPermanentUpgradeCandidate)
      .sort((a, b) => {
        const priceDifference =
          (Number(b.basePrice) || 0) - (Number(a.basePrice) || 0);
        return priceDifference || (Number(b.id) || 0) - (Number(a.id) || 0);
      });
  }

  function popWrinklersForAscension() {
    if (controls.wrinklerMode === "hold") {
      toolkit.lastWrinklerAction = "Holding all wrinklers";
      return 0;
    }
    const attached = (Game.wrinklers || []).filter(
      (wrinkler) =>
        (wrinkler.phase === 2 || wrinkler.close) && wrinkler.hp > 0
    );
    for (const wrinkler of attached) wrinkler.hp = 0;
    return attached.length;
  }

  function buyAffordableAscensionUpgrades(plan) {
    function buyEntries(entries) {
      const boughtNames = [];

      for (let pass = 0; pass < entries.length; pass++) {
        let boughtSomething = false;

        for (const { name } of entries) {
          const upgrade = getHeavenlyUpgrade(name);
          if (!upgrade || upgrade.bought) continue;

          const canPurchase =
            typeof upgrade.canBePurchased === "function"
              ? upgrade.canBePurchased()
              : upgrade.canBePurchased;

          if (canPurchase && upgrade.buy(true)) {
            boughtSomething = true;
            boughtNames.push(name);
          }
        }

        if (!boughtSomething) break;
      }

      return boughtNames;
    }

    const entries = getPlannedUpgradeEntries(plan);
    const requiredEntries = entries.filter(
      (entry) => entry.stageIndex === toolkit.ascensionRequiredStageIndex
    );
    const requiredBought = buyEntries(requiredEntries);

    if (getMissingRequiredStageUpgrades(plan).length > 0) {
      return requiredBought;
    }

    const laterEntries = entries.filter(
      (entry) => entry.stageIndex > toolkit.ascensionRequiredStageIndex
    );
    return [...requiredBought, ...buyEntries(laterEntries)];
  }

  function getMissingRequiredStageUpgrades(plan) {
    const requiredStage = plan.stages[toolkit.ascensionRequiredStageIndex];
    if (!requiredStage) return [];
    return requiredStage.heavenlyUpgrades.filter(
      (name) => !getHeavenlyUpgrade(name)?.bought && !isUnavailableLuckyDigit(name)
    );
  }

  function assignPermanentSlots() {
    if (controls.lateGameRepeatAscension || !controls.assignPermanentSlot) return true;

    const slotUpgrades = [
      "Permanent upgrade slot I",
      "Permanent upgrade slot II",
      "Permanent upgrade slot III",
      "Permanent upgrade slot IV",
      "Permanent upgrade slot V"
    ];

    const availableSlots = slotUpgrades
      .map((name, slot) => ({ name, slot }))
      .filter(({ name }) => Game.Upgrades?.[name]?.bought);

    if (availableSlots.length === 0) return false;

    const upgradesById = Game.UpgradesById || [];
    const allUpgrades = Array.isArray(upgradesById)
      ? upgradesById
      : Object.values(upgradesById);

    const candidates = toolkit.ascensionPermanentUpgradeIds
      .map((id) => allUpgrades[id])
      .filter(Boolean);

    if (candidates.length === 0) {
      toolkit.ascensionPermanentUpgradeName = "No kitten available";
      return true;
    }

    try {
      const assignedNames = [];
      for (const { slot } of availableSlots) {
        const upgrade = candidates[slot];
        if (!upgrade) continue;
        Game.AssignPermanentSlot(slot);
        Game.PutUpgradeInPermanentSlot(upgrade.id, slot);
        Game.ConfirmPrompt();
        assignedNames.push(`Slot ${slot + 1}: ${upgrade.name}`);
      }
      toolkit.ascensionPermanentUpgradeName =
        assignedNames.length > 0 ? assignedNames.join(", ") : "No kitten available";
      return true;
    } catch (_) {
      return false;
    }
  }

  function beginAutomaticAscension(progress) {
    const permanentUpgrades = controls.lateGameRepeatAscension || !controls.assignPermanentSlot ? [] : getBestPermanentUpgrades();
    toolkit.ascensionPermanentUpgradeIds = permanentUpgrades.map(
      (upgrade) => upgrade.id
    );
    toolkit.ascensionPermanentUpgradeName =
      permanentUpgrades[0]?.name || "None";
    toolkit.ascensionMissingUpgrades = [];
    toolkit.ascensionRequiredStageIndex = progress.stageIndex;
    toolkit.ascensionLastHeavenlyPurchaseAt = -Infinity;
    toolkit.ascensionPurchasedThisRun = [];
    setAscensionState(
      "preparing",
      `Preparing for ${progress.stage.label.toLowerCase()}`
    );
  }

  function runAscensionManager() {
    if (!toolkit.active) return;

    const plan = getAscensionPlan();
    const available = getAvailablePrestige();
    const rawProgress = getAscensionProgress(plan);
    const progress = controls.lateGameRepeatAscension
      ? { ...rawProgress, allComplete:false, stage:{label:"Late-game repeat"}, stageIndex:rawProgress.stageIndex }
      : rawProgress.allComplete && !controls.ascensionAdaptiveTarget
      ? { ...rawProgress, stage: { label: "Manual target" }, stageIndex: 0 }
      : rawProgress;
    const target = getEffectiveAscensionTarget(plan);
    const elapsed = performance.now() - toolkit.ascensionStateStartedAt;

    // A repeat-mode opt-in may resume a manually entered or previously paused
    // ascension screen, but only while both automatic mode and arm are enabled.
    if (controls.lateGameRepeatAscension && controls.ascensionMode === "automatic" &&
        controls.ascensionArmed && Game.OnAscend && !Number(Game.AscendTimer) &&
        ["idle","ready","complete","paused-reincarnation","purchasing","slotting"].includes(toolkit.ascensionState)) {
      setAscensionState("reincarnating", "Late-game repeat: keeping permanent slots and reincarnating");
      return;
    }
    if (toolkit.ascensionState === "error") return;

    if (
      isAscensionAutomationBusy() &&
      (controls.ascensionMode !== "automatic" || !controls.ascensionArmed)
    ) {
      if (Game.OnAscend) {
        failAscension("Paused on the ascension screen");
      } else {
        setAscensionState("idle", "Automatic ascension cancelled");
      }
      return;
    }

    if (["idle", "ready", "complete"].includes(toolkit.ascensionState)) {
      if (progress.allComplete && controls.ascensionAdaptiveTarget) {
        if (switchToNextAscensionPlan(plan)) return;

        if (controls.ascensionArmed) {
          controls.ascensionArmed = false;
          saveControls();
        }
        setAscensionState(
          "complete",
          "All coded early ascension stages are complete"
        );
        return;
      }

      if (available < target) {
        toolkit.ascensionReadyNotified = false;
        setAscensionState(
          "idle",
          `${progress.stage.label}: ${available.toLocaleString()} / ${target.toLocaleString()}`
        );
        return;
      }

      if (controls.ascensionMode === "off") {
        setAscensionState("ready", "Target reached, ascension is off");
        return;
      }

      if (
        controls.ascensionMode === "ready" ||
        !controls.ascensionArmed
      ) {
        setAscensionState(
          "ready",
          controls.ascensionMode === "ready"
            ? "Ready, waiting for you"
            : "Ready, enable Arm automatic ascension"
        );
        if (!toolkit.ascensionReadyNotified) {
          Game.Notify?.(
            "Ascension ready",
            `${progress.stage.label}, ${available.toLocaleString()} prestige available`,
            [19, 7],
            8
          );
          toolkit.ascensionReadyNotified = true;
        }
        return;
      }

      beginAutomaticAscension(progress);
      return;
    }

    if (
      toolkit.ascensionState !== "paused-reincarnation" &&
      elapsed > ASCENSION_STEP_TIMEOUT_MS
    ) {
      failAscension(`Stopped during ${toolkit.ascensionState}`);
      return;
    }

    if (toolkit.ascensionState === "preparing") {
      if (!liquidateStocksBeforeAscend()) return;
      const digitSensitive =
        TARGET_LUCKY_DIGIT &&
        getAscensionProgress(plan).missing.includes("Lucky digit");
      if (controls.popWrinklersBeforeAscend && !digitSensitive) {
        const popped = popWrinklersForAscension();
        if (popped > 0) {
          toolkit.ascensionStatus = `Collecting ${popped} wrinklers`;
          toolkit.ascensionStateStartedAt = performance.now();
          return;
        }
      }

      if (elapsed < ASCENSION_PREPARE_SETTLE_MS) return;

      try {
        /* A new ascension starts with a new building inventory. Never carry a
         * pre-ascension FtHoF tower restore target into the next run. */
        toolkit.ftHofTowerRebuildRemaining = 0;
        controls.ftHofTowerRestoreTargetAmount = 0;
        saveControls();
        setAscensionState("ascending", "Entering the ascension screen");
        Game.Ascend(true);
      } catch (_) {
        failAscension("Could not start ascension");
      }
      return;
    }

    if (toolkit.ascensionState === "ascending") {
      if (!Game.OnAscend || Number(Game.AscendTimer) > 0) return;
      setAscensionState("purchasing", "Buying heavenly upgrades");
      return;
    }

    if (toolkit.ascensionState === "purchasing") {
      const bought = buyAffordableAscensionUpgrades(plan);
      if (bought.length > 0) {
        toolkit.ascensionPurchasedThisRun.push(...bought);
        toolkit.ascensionLastHeavenlyPurchaseAt = performance.now();
        toolkit.ascensionStateStartedAt = performance.now();
        toolkit.ascensionStatus = `Bought: ${bought.join(", ")}`;
        return;
      }

      const missing = getMissingRequiredStageUpgrades(plan);
      toolkit.ascensionMissingUpgrades = missing;

      if (missing.length > 0) {
        toolkit.ascensionStatus =
          `Waiting to finish checkpoint: ${missing.join(", ")}`;
        return;
      }

      if (
        performance.now() - toolkit.ascensionLastHeavenlyPurchaseAt <
        1000
      ) {
        toolkit.ascensionStatus = "Checking for more affordable upgrades";
        return;
      }

      setAscensionState(
        "slotting",
        `Spending complete, ${Math.floor(
          Number(Game.heavenlyChips) || 0
        ).toLocaleString()} chips remain`
      );
      return;
    }

    if (toolkit.ascensionState === "slotting") {
      if (!assignPermanentSlots()) {
        toolkit.ascensionStatus = "Waiting to assign permanent slots";
        return;
      }

      if (!AUTO_REINCARNATE_AFTER_ASCENSION) {
        setAscensionState(
          "paused-reincarnation",
          "Ready on ascension screen, reincarnate manually"
        );
        return;
      }

      setAscensionState("reincarnating", "Reincarnating");
      return;
    }

    if (toolkit.ascensionState === "paused-reincarnation") return;

    if (toolkit.ascensionState === "reincarnating") {
      try {
        setAscensionState("waiting-reincarnation", "Starting the new run");
        Game.Reincarnate(true);
      } catch (_) {
        failAscension("Could not reincarnate");
      }
      return;
    }

    if (toolkit.ascensionState === "waiting-reincarnation") {
      if (Game.OnAscend || Game.ReincarnateTimer) return;
      applyPostAscensionSettings();
      if (!controls.continueAscensions && !controls.lateGameRepeatAscension) controls.ascensionArmed = false;
      setAscensionState(
        "complete",
        (controls.continueAscensions || controls.lateGameRepeatAscension)
          ? "Ascension completed, saving for the next checkpoint"
          : "Ascension completed, automation resumed"
      );
      saveControls();
    }
  }

  toolkit.ascensionTimer = setInterval(
    runAscensionManager,
    ASCENSION_CHECK_MS
  );
  runAscensionManager();

  /* Clicking data */
  Game.registerHook("click", () => {
    if (!toolkit.active) return;
    const handmade = Number(Game.handmadeCookies);
    const earned = handmade - toolkit.lastObservedHandmade;
    toolkit.lastObservedHandmade = handmade;
    recordGodzamokClick(earned);
    toolkit.samples.push({
      time: performance.now(),
      cookies: Number.isFinite(earned) && earned >= 0 ? earned : Number(Game.computedMouseCps) || 0
    });
  });

  function getClickStats() {
    const now = performance.now();
    const windowMs = 5000;
    const cutoff = now - windowMs;

    toolkit.samples = toolkit.samples.filter((sample) => sample.time >= cutoff);

    const seconds = Math.min(
      5,
      Math.max((now - toolkit.started) / 1000, 0.25)
    );
    const clicksPerSecond = toolkit.samples.length / seconds;
    const clickingCps =
      toolkit.samples.reduce((sum, sample) => sum + sample.cookies, 0) /
      seconds;

    return { clicksPerSecond, clickingCps };
  }

  /* On-screen controls and meter */
  if (SHOW_CONTROL_PANEL) {
    const panel = document.createElement("div");
    panel.id = "cookie-click-toolkit-panel";
    panel.style.cssText = `
      position: fixed;
      left: 12px;
      bottom: 12px;
      z-index: 100000;
      width: min(560px, calc(100vw - 24px));
      height: min(400px, calc(100vh - 24px));
      min-width: min(360px, calc(100vw - 24px));
      min-height: min(240px, calc(100vh - 24px));
      max-width: calc(100vw - 12px);
      max-height: calc(100vh - 12px);
      box-sizing: border-box;
      overflow-x: hidden;
      overflow-y: auto;
      overscroll-behavior: contain;
      resize: both;
      padding: 12px 14px;
      color: white;
      background: rgba(0, 0, 0, 0.92);
      border: 2px solid #ffd700;
      border-radius: 7px;
      box-shadow: 0 0 12px rgba(255, 215, 0, 0.5);
      font: 13px Arial, sans-serif;
      line-height: 1.45;
      pointer-events: auto;
    `;

    panel.innerHTML = `
      <div style="position:sticky;top:-12px;z-index:3;margin:-4px -5px 10px;padding:4px 5px 7px;background:rgba(0,0,0,.98);border-bottom:1px solid #555">
        <div id="cct-drag-handle" title="Drag to move. Use the bottom-right corner to resize." style="color:#ffd700;font-size:15px;font-weight:bold;padding:2px 0 6px;cursor:move;user-select:none;touch-action:none">
          Cookie Toolkit ${TOOLKIT_VERSION}
        </div>
        <div id="cct-tab-buttons" style="display:flex;gap:4px;overflow-x:auto;padding-bottom:1px">
          <button type="button" data-cct-tab-button="overview">Overview</button>
          <button type="button" data-cct-tab-button="automation">Automation</button>
          <button type="button" data-cct-tab-button="midgame">Mid Game</button>
          <button type="button" data-cct-tab-button="stocks">Stocks</button>
          <button type="button" data-cct-tab-button="lategame">Late Game</button>
          <button type="button" data-cct-tab-button="ascension">Ascension</button>
          <button type="button" data-cct-tab-button="targets">Targets</button>
          <button type="button" data-cct-tab-button="diagnostics">Diagnostics</button>
        </div>
      </div>

      <section data-cct-tab="overview">
        <div style="font-weight:bold;margin-bottom:3px">Clicking</div>
        <div id="cct-stats"></div>
        <div style="border-top:1px solid #555;margin:10px 0 8px"></div>
        <div style="font-weight:bold;margin-bottom:3px">Run status</div>
        <div id="cct-bank"></div>
        <div style="border-top:1px solid #555;margin:10px 0 8px"></div>
        <div style="font-weight:bold;margin-bottom:3px">Ascension</div>
        <div id="cct-ascension-summary"></div>
      </section>

      <section data-cct-tab="automation" hidden>
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;align-items:start">
          <div>
            <div style="font-weight:bold;margin-bottom:4px">Core automation</div>
            <label style="display:block;margin:3px 0 7px">
              Strategy profile
              <select id="cct-strategy-profile" style="width:100%;margin-top:2px;background:#222;color:#fff;border:1px solid #777;padding:3px"></select>
            </label>
            <label style="display:flex;justify-content:space-between;align-items:center;margin:4px 0"><span>Auto-buy (master)</span><input id="cct-auto-buy" type="checkbox"></label>
            <label style="display:flex;justify-content:space-between;align-items:center;margin:4px 0"><span>Buy buildings</span><input id="cct-auto-buy-buildings" type="checkbox"></label>
            <label style="display:flex;justify-content:space-between;align-items:center;margin:4px 0"><span>Buy upgrades</span><input id="cct-auto-buy-upgrades" type="checkbox"></label>
            <label style="display:flex;justify-content:space-between;align-items:center;margin:4px 0" title="Always include Lucky day, Serendipity, Get lucky, and every mouse upgrade. Buy them when they are the cheapest eligible target."><span>Lucky + mouse upgrades</span><input id="cct-priority-upgrades" type="checkbox"></label>
            <label style="display:flex;justify-content:space-between;align-items:center;margin:4px 0" title="Buy an off-color item only when it reduces the ETA to the highest-priority blue or green target."><span>ETA-saving other items</span><input id="cct-time-saving-other-items" type="checkbox"></label>
            <label style="display:flex;justify-content:space-between;align-items:center;margin:4px 0"><span>Big cookie</span><input id="cct-big-cookie" type="checkbox"></label>
            <label style="display:flex;justify-content:space-between;align-items:center;margin:4px 0"><span>Golden cookies</span><input id="cct-golden-cookies" type="checkbox"></label>
            <label style="display:flex;justify-content:space-between;align-items:center;margin:4px 0"><span>Click wrath cookies</span><input id="cct-click-wrath-cookies" type="checkbox"></label>
            <label style="display:flex;justify-content:space-between;align-items:center;margin:4px 0"><span>Sugar lump plan</span><input id="cct-sugar-lumps" type="checkbox"></label>
            <label style="display:flex;justify-content:space-between;align-items:center;margin:4px 0"><span>Auto FtHoF</span><input id="cct-force-hand" type="checkbox"></label>
            <label style="display:flex;justify-content:space-between;align-items:center;margin:4px 0" title="Sells low-tier buildings during Click Frenzy or Dragonflight when Godzamok is active."><span>Godzamok combo sell</span><input id="cct-godzamok-combos" type="checkbox"></label>
            <label>Godzamok goal <select id="cct-godzamok-goal"><option value="all">Sell ALL allowed buildings</option><option value="combo">Maximum net combo cookies</option><option value="prestige">Prestige / recovery balance</option><option value="profit">Bank profit only</option></select></label>
            <label style="display:block">Max recovery time (seconds) <input id="cct-godzamok-recovery" type="number" min="0" max="3600" step="10" style="width:70px"></label>
            <div id="cct-godzamok-budget" style="color:#aaa;font-size:11px"></div>
            <label style="display:flex;justify-content:space-between;align-items:center;margin:4px 0" title="Keep Godzamok in the Pantheon diamond slot outside active combos."><span>Auto Pantheon</span><input id="cct-pantheon-automation" type="checkbox"></label>
            <label style="display:flex;justify-content:space-between;align-items:center;margin:4px 0"><span>Auto dragon</span><input id="cct-dragon-automation" type="checkbox"></label>
            <label style="display:flex;justify-content:space-between;align-items:center;margin:4px 0"><span>Dragon drops</span><input id="cct-dragon-drops" type="checkbox"></label>
            <label style="display:block;margin:8px 0 3px">Dragon plan
              <select id="cct-dragon-mode" style="width:100%;margin-top:2px;background:#222;color:#fff;border:1px solid #777;padding:3px">
                <option value="safe-full">Safe full training</option><option value="milk-only">Egg + Breath of Milk only</option>
              </select>
            </label>
            <label style="display:block;margin:8px 0 3px">Purchase priority
              <select id="cct-priority" style="width:100%;margin-top:2px;background:#222;color:#fff;border:1px solid #777;padding:3px">
                <option value="blue-first">Blue first</option><option value="green-first">Green first</option><option value="cheapest">Cheapest first</option><option value="upgrades-first">Upgrades first</option><option value="buildings-first">Buildings first</option>
              </select>
            </label>
          </div>
          <div>
            <div style="font-weight:bold;margin-bottom:4px">Banks and Grandmapocalypse</div>
            <label style="display:flex;justify-content:space-between;align-items:center;margin:4px 0"><span>Chain reserve</span><input id="cct-chain-protection" type="checkbox"></label>
            <label style="display:flex;justify-content:space-between;align-items:center;margin:4px 0"><span>Protect shiny wrinklers</span><input id="cct-protect-shiny-wrinklers" type="checkbox"></label>
            <label style="display:block;margin:8px 0 3px">Grandmapocalypse cap
              <select id="cct-grandmapocalypse-stage" style="width:100%;margin-top:2px;background:#222;color:#fff;border:1px solid #777;padding:3px">
                <option value="0">Stage 0, block One mind</option><option value="1">Stage 1, allow One mind</option><option value="2">Stage 2, allow Brainsweep</option><option value="3">Stage 3, allow Elder Pact</option>
              </select>
            </label>
            <label style="display:block;margin:8px 0 3px">Wrinklers
              <select id="cct-wrinkler-mode" style="width:100%;margin-top:2px;background:#222;color:#fff;border:1px solid #777;padding:3px">
                <option value="smart">Smart, fund protected targets</option><option value="hold">Hold, never pop</option><option value="farm">Farm, cycle a full ring</option>
              </select>
            </label>
            <label style="display:block;margin:8px 0 3px">Chain target
              <select id="cct-chain-mode" style="width:100%;margin-top:2px;background:#222;color:#fff;border:1px solid #777;padding:3px">
                <option value="normal">Normal Golden/Wrath Chain</option><option value="frenzy">Frenzy Golden/Wrath Chain</option>
              </select>
            </label>
            <label style="display:block;margin:8px 0 3px">Bank reserve
              <select id="cct-reserve" style="width:100%;margin-top:2px;background:#222;color:#fff;border:1px solid #777;padding:3px">
                <option value="smart">Smart</option><option value="none">Lucky/Conjure off</option><option value="normal-lucky">Normal Lucky, 6,000x</option><option value="frenzy-lucky">Frenzy + Lucky, 42,000x</option><option value="normal-conjure">Normal Conjure, 12,000x</option><option value="frenzy-conjure">Frenzy + Conjure, 84,000x</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      <section data-cct-tab="midgame" hidden>
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;align-items:start">
          <div>
            <div style="font-weight:bold;margin-bottom:4px">Midgame automation</div>
            <label style="display:flex;justify-content:space-between;align-items:center;margin:4px 0"><span>Use Mid game profile</span><input id="cct-midgame-profile" type="checkbox"></label>
            <label style="display:flex;justify-content:space-between;align-items:center;margin:4px 0"><span>Auto breed all missing seeds</span><input id="cct-garden-auto" type="checkbox"></label>
            <label style="display:flex;justify-content:space-between;align-items:center;margin:4px 0"><span>Sacrifice full seed log and repeat</span><input id="cct-garden-sacrifice" type="checkbox"></label>
            <div style="font-size:11px;color:#aaa">Auto breeding replaces unprotected crops. First missing-seed children are kept until mature; saved preset pauses. Sacrifice resets seeds for 10 lumps.</div>
            <label style="display:flex;justify-content:space-between;align-items:center;margin:4px 0"><span>Maintain Garden preset</span><input id="cct-garden-preset" type="checkbox"></label>
            <label style="display:flex;justify-content:space-between;align-items:center;margin:4px 0" title="Stagger replanting to increase the time needed parents are mature together. Existing healthy plants are kept."><span>Synchronize parents</span><input id="cct-garden-sync" type="checkbox"></label>
            <label style="display:flex;justify-content:space-between;align-items:center;margin:4px 0" title="Use fast growth soil, then Wood chips for available target breeding spots. Respects soil unlocks and cooldowns."><span>Smart soil</span><input id="cct-garden-soil" type="checkbox"></label>
            <button id="cct-save-garden-preset" type="button">Save current Garden pattern</button>
            <input id="cct-garden-target" type="text" placeholder="Target mutation, plant name or key" style="width:100%;box-sizing:border-box;margin-top:5px">
            <div id="cct-garden-status" style="margin-top:5px;color:#ccc"></div>
            <div id="cct-midgame-status" style="margin-top:7px;color:#ccc"></div>
          </div>
          <div>
            <div style="font-weight:bold;margin-bottom:4px">What changes now</div>
            <div id="cct-midgame-mechanics" style="color:#ccc"></div>
          </div>
        </div>
      </section>

      <section data-cct-tab="lategame" hidden>
        <div style="font-weight:bold;margin-bottom:4px">Late-game automation</div>
        <div style="color:#ccc">Use the Ascension tab to enter any custom prestige target. Disable Adaptive next target to use it exactly.</div>
        <div id="cct-lategame-status" style="margin-top:7px;color:#ccc"></div>
      </section>

      <section data-cct-tab="ascension" hidden>
        <label style="display:block"><input id="cct-adaptive-auras" type="checkbox"> Automatic dragon aura switching</label>
        <label style="display:block"><input id="cct-utility-auras" type="checkbox"> Use utility aura for seasonal drops / Garden</label>
        <label style="display:block">Maintain season <select id="cct-renew-season"><option value="">Off</option><option value="christmas">Christmas</option><option value="halloween">Halloween</option><option value="easter">Easter</option><option value="valentines">Valentine's Day</option><option value="fools">Business Day</option></select></label>
        <div id="cct-season-aura-status" style="font-size:11px;color:#ccc"></div>
        <label style="display:block;margin:6px 0"><input id="cct-late-repeat" type="checkbox"> Late-game repeat ascensions</label>
        <label style="display:block">Prestige gain per run <input id="cct-late-repeat-target" type="number" min="1" step="1" style="width:100%;box-sizing:border-box"></label>
        <div style="font-size:11px;color:#aaa">Uses this fixed gain target each run. Requires Automatic + Arm. Skips heavenly shopping and kitten assignment, keeps existing permanent slots, and reincarnates automatically.</div>
        <label style="display:block;margin:6px 0"><input id="cct-late-bulk" type="checkbox"> Late-game fast buying: 100 buildings + all upgrades</label>
        <div style="font-size:11px;color:#aaa">Uses Auto-buy switches. Ignores colors and ROI; keeps reserves, exclusions and click-combo pauses. Building batches are exactly 100.</div>
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;align-items:start">
          <div>
            <div style="font-weight:bold;margin-bottom:4px">Ascension controls</div>
            <label style="display:block;margin:7px 0">Mode
              <select id="cct-ascension-mode" style="width:100%;margin-top:2px;background:#222;color:#fff;border:1px solid #777;padding:3px">
                <option value="off">Off</option><option value="ready">Ready only</option><option value="automatic">Automatic</option>
              </select>
            </label>
            <label style="display:block;margin:7px 0">Plan
              <select id="cct-ascension-plan" style="width:100%;margin-top:2px;background:#222;color:#fff;border:1px solid #777;padding:3px"></select>
            </label>
            <label style="display:flex;justify-content:space-between;align-items:center;margin:6px 0"><span>Adaptive next target</span><input id="cct-ascension-adaptive" type="checkbox"></label>
            <label style="display:block;margin:7px 0">Prestige target
              <input id="cct-ascension-target" type="number" min="1" step="1" style="box-sizing:border-box;width:100%;margin-top:2px;background:#222;color:#fff;border:1px solid #777;padding:4px">
            </label>
            <label style="display:flex;justify-content:space-between;align-items:center;margin:6px 0"><span>Pop wrinklers first</span><input id="cct-ascension-pop-wrinklers" type="checkbox"></label>
            <label style="display:flex;justify-content:space-between;align-items:center;margin:6px 0"><span>Assign highest kitten</span><input id="cct-ascension-permaslot" type="checkbox"></label>
            <label style="display:flex;justify-content:space-between;align-items:center;margin:6px 0"><span>Continue to next stage</span><input id="cct-ascension-continue" type="checkbox"></label>
            <label style="display:flex;justify-content:space-between;align-items:center;margin:9px 0;padding:7px;border:1px solid #b8860b;background:#211b00"><span>Arm automatic ascension</span><input id="cct-ascension-armed" type="checkbox"></label>
          </div>
          <div>
            <div style="font-weight:bold;margin-bottom:4px">Plan status</div>
            <div id="cct-ascension-status"></div>
            <div style="border-top:1px solid #555;margin:10px 0 8px"></div>
            <div style="font-weight:bold;margin-bottom:4px">Heavenly purchases</div>
            <div id="cct-ascension-plan-list" style="color:#ccc"></div>
          </div>
        </div>
      </section>

      <section data-cct-tab="targets" hidden>
        <div style="font-weight:bold">Purchase targets</div>
        <div style="color:#aaa;font-size:11px">Blue/green targets plus the best ETA-saving item</div>
        <div id="cct-targets" style="margin-top:5px;padding-right:4px"></div>
      </section>

      <section data-cct-tab="diagnostics" hidden>
        <div style="font-weight:bold;margin-bottom:4px">Diagnostics</div>
        <div id="cct-diagnostics" style="font-size:12px"></div>
        <div id="cct-godzamok-result" style="margin:8px 0"></div>
        <button id="cct-godzamok-resume" type="button">Resume Godzamok after loss</button>
      </section>
      <section data-cct-tab="stocks" hidden>
        <label style="display:block"><input id="cct-stock-auto" type="checkbox"> Auto trade stocks</label>
        <label style="display:block"><input id="cct-stock-liquidate" type="checkbox"> Sell stocks before automatic ascension</label>
        <label style="display:block">Portfolio budget (% of surplus + holdings) <input id="cct-stock-budget" type="number" min="0" max="100" style="width:65px"></label>
        <label style="display:block">Minimum profit after fees (%) <input id="cct-stock-margin" type="number" min="0.5" max="50" step="0.5" style="width:65px"></label>
        <label style="display:block">Forecast horizon (ticks) <input id="cct-stock-horizon" type="number" min="10" max="20" step="1" style="width:65px"></label>
        <label style="display:block">Modeled downside limit (%) <input id="cct-stock-risk" type="number" min="1" max="25" style="width:65px"></label>
        <div style="color:#aaa;margin:8px 0">Budget is a ceiling, not a spending target. Positions use joint 10–20 tick simulations, including trend changes and shared shocks. Downside limit caps modeled average loss in the worst 5% of scenarios, not actual losses. 250ms monitoring; decisions once per native price tick. Uses Cookie Monster’s mode, drift and resting-value inputs with native stochastic transitions. Defensive exits may realize losses. Holdings with unknown cost basis are managed and can be sold; historical profit is excluded, and additions wait until that holding is closed.</div>
        <div id="cct-stock-status"></div>
        <div id="cct-stock-rows" style="white-space:pre-wrap;font:12px Arial;line-height:1.6"></div>
      </section>
    `;

    for (const eventName of ["click", "mousedown", "mouseup", "wheel"]) {
      panel.addEventListener(eventName, (event) => event.stopPropagation());
    }

    document.body.appendChild(panel);
    toolkit.panel = panel;
    for (const [id, key] of [["cct-stock-auto","stockAuto"],["cct-stock-liquidate","stockLiquidateBeforeAscend"]]) {
      const input = panel.querySelector(`#${id}`); input.checked = controls[key];
      input.addEventListener("change", () => {controls[key] = input.checked; saveControls();});
    }
    for (const [id,key,min,max] of [["cct-stock-budget","stockBudgetPercent",0,100],["cct-stock-margin","stockProfitMargin",0.5,50],["cct-stock-horizon","stockHorizon",10,20],["cct-stock-risk","stockRiskPercent",1,25]]) {
      const input = panel.querySelector(`#${id}`); input.value = controls[key];
      input.addEventListener("change", () => {
        if (input.value.trim() !== "" && Number.isFinite(Number(input.value))) controls[key] = Math.min(max,Math.max(min,Number(input.value)));
        if(key === "stockHorizon") controls[key]=Math.round(controls[key]);
        input.value = controls[key]; saveControls();
      });
    }
    const goalInput = panel.querySelector("#cct-godzamok-goal");
    const recoveryInput = panel.querySelector("#cct-godzamok-recovery");
    goalInput.value = controls.godzamokObjective;
    recoveryInput.value = controls.godzamokMaxRecoverySeconds;
    goalInput.addEventListener("change", () => {
      controls.godzamokObjective = ["all","combo","profit","prestige"].includes(goalInput.value) ? goalInput.value : "combo";
      toolkit.godzamokFrontier = null; toolkit.godzamokPlanner = null;
      saveControls();
    });
    for (const [input, key, max] of [[recoveryInput, "godzamokMaxRecoverySeconds", 3600]]) {
      input.addEventListener("change", () => {
        const value = Number(input.value);
        if (input.value.trim() !== "" && Number.isFinite(value)) controls[key] = Math.min(max, Math.max(0, value));
        input.value = controls[key];
        saveControls();
      });
    }
    panel.querySelector("#cct-godzamok-resume").addEventListener("click", () => toolkit.resumeGodzamok());

    const tabButtons = [
      ...panel.querySelectorAll("[data-cct-tab-button]")
    ];
    const tabSections = [...panel.querySelectorAll("[data-cct-tab]")];

    function showPanelTab(tabId) {
      const safeTabId = validPanelTabs.has(tabId) ? tabId : "overview";
      controls.activeTab = safeTabId;

      for (const section of tabSections) {
        section.hidden = section.dataset.cctTab !== safeTabId;
      }

      for (const button of tabButtons) {
        const active = button.dataset.cctTabButton === safeTabId;
        button.style.cssText = `
          flex:0 0 auto;
          padding:4px 7px;
          color:${active ? "#111" : "#ddd"};
          background:${active ? "#ffd700" : "#222"};
          border:1px solid ${active ? "#ffd700" : "#666"};
          border-radius:4px;
          font:12px Arial,sans-serif;
          cursor:pointer;
        `;
      }

      saveControls();
    }

    for (const button of tabButtons) {
      button.addEventListener("click", () => {
        showPanelTab(button.dataset.cctTabButton);
      });
    }
    showPanelTab(controls.activeTab);

    function clampPanelRect(rect) {
      const viewportWidth = Math.max(window.innerWidth || 0, 240);
      const viewportHeight = Math.max(window.innerHeight || 0, 180);
      const width = Math.min(
        Math.max(Number(rect.width) || 560, Math.min(360, viewportWidth)),
        Math.max(viewportWidth - 12, 120)
      );
      const height = Math.min(
        Math.max(Number(rect.height) || 400, Math.min(240, viewportHeight)),
        Math.max(viewportHeight - 12, 100)
      );
      const left = Math.min(
        Math.max(Number(rect.left) || 0, 0),
        Math.max(viewportWidth - width, 0)
      );
      const top = Math.min(
        Math.max(Number(rect.top) || 0, 0),
        Math.max(viewportHeight - height, 0)
      );

      return { left, top, width, height };
    }

    function applyPanelRect(rect) {
      const safeRect = clampPanelRect(rect);
      panel.style.left = `${safeRect.left}px`;
      panel.style.top = `${safeRect.top}px`;
      panel.style.bottom = "auto";
      panel.style.width = `${safeRect.width}px`;
      panel.style.height = `${safeRect.height}px`;
    }

    function savePanelGeometry() {
      if (!toolkit.active || !panel.isConnected) return;
      const rect = panel.getBoundingClientRect();
      controls.panelRect = {
        left: Math.round(rect.left),
        top: Math.round(rect.top),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      };
      saveControls();
    }

    if (controls.panelRect) applyPanelRect(controls.panelRect);

    const dragHandle = panel.querySelector("#cct-drag-handle");
    let dragState = null;

    function movePanel(event) {
      if (!dragState) return;
      event.preventDefault();

      const rect = clampPanelRect({
        left: event.clientX - dragState.offsetX,
        top: event.clientY - dragState.offsetY,
        width: panel.offsetWidth,
        height: panel.offsetHeight
      });
      panel.style.left = `${rect.left}px`;
      panel.style.top = `${rect.top}px`;
      panel.style.bottom = "auto";
    }

    function finishPanelDrag() {
      if (!dragState) return;
      dragState = null;
      window.removeEventListener("pointermove", movePanel);
      window.removeEventListener("pointerup", finishPanelDrag);
      window.removeEventListener("pointercancel", finishPanelDrag);
      savePanelGeometry();
    }

    dragHandle.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      const rect = panel.getBoundingClientRect();
      dragState = {
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top
      };
      panel.style.left = `${rect.left}px`;
      panel.style.top = `${rect.top}px`;
      panel.style.bottom = "auto";
      window.addEventListener("pointermove", movePanel, { passive: false });
      window.addEventListener("pointerup", finishPanelDrag);
      window.addEventListener("pointercancel", finishPanelDrag);
      event.preventDefault();
    });

    toolkit.panelDragCleanup = () => {
      dragState = null;
      window.removeEventListener("pointermove", movePanel);
      window.removeEventListener("pointerup", finishPanelDrag);
      window.removeEventListener("pointercancel", finishPanelDrag);
    };

    if (window.ResizeObserver) {
      let resizeSaveTimer = null;
      toolkit.panelResizeObserver = new ResizeObserver(() => {
        clearTimeout(resizeSaveTimer);
        resizeSaveTimer = setTimeout(savePanelGeometry, 150);
      });
      toolkit.panelResizeObserver.observe(panel);
    }

    const strategyProfileSelect = panel.querySelector(
      "#cct-strategy-profile"
    );
    const midgameProfileInput = panel.querySelector("#cct-midgame-profile");
    const gardenPresetInput = panel.querySelector("#cct-garden-preset");
    const gardenSyncInput = panel.querySelector("#cct-garden-sync");
    const gardenSoilInput = panel.querySelector("#cct-garden-soil");
    const saveGardenPresetButton = panel.querySelector("#cct-save-garden-preset");
    const gardenTargetInput = panel.querySelector("#cct-garden-target");
    const autoBuyInput = panel.querySelector("#cct-auto-buy");
    const autoBuyBuildingsInput = panel.querySelector(
      "#cct-auto-buy-buildings"
    );
    const autoBuyUpgradesInput = panel.querySelector(
      "#cct-auto-buy-upgrades"
    );
    const priorityUpgradesInput = panel.querySelector(
      "#cct-priority-upgrades"
    );
    const timeSavingOtherItemsInput = panel.querySelector(
      "#cct-time-saving-other-items"
    );
    const bigCookieInput = panel.querySelector("#cct-big-cookie");
    const goldenCookiesInput = panel.querySelector("#cct-golden-cookies");
    const clickWrathCookiesInput = panel.querySelector("#cct-click-wrath-cookies");
    const chainProtectionInput = panel.querySelector("#cct-chain-protection");
    const chainModeSelect = panel.querySelector("#cct-chain-mode");
    const sugarLumpsInput = panel.querySelector("#cct-sugar-lumps");
    const forceHandInput = panel.querySelector("#cct-force-hand");
    const godzamokCombosInput = panel.querySelector("#cct-godzamok-combos");
    const pantheonAutomationInput = panel.querySelector("#cct-pantheon-automation");
    const dragonAutomationInput = panel.querySelector(
      "#cct-dragon-automation"
    );
    const dragonDropsInput = panel.querySelector("#cct-dragon-drops");
    const dragonModeSelect = panel.querySelector("#cct-dragon-mode");
    const protectShinyWrinklersInput = panel.querySelector(
      "#cct-protect-shiny-wrinklers"
    );
    const grandmapocalypseStageSelect = panel.querySelector(
      "#cct-grandmapocalypse-stage"
    );
    const wrinklerModeSelect = panel.querySelector("#cct-wrinkler-mode");
    const prioritySelect = panel.querySelector("#cct-priority");
    const reserveSelect = panel.querySelector("#cct-reserve");
    const ascensionModeSelect = panel.querySelector("#cct-ascension-mode");
    const ascensionPlanSelect = panel.querySelector("#cct-ascension-plan");
    const ascensionAdaptiveInput = panel.querySelector(
      "#cct-ascension-adaptive"
    );
    const ascensionTargetInput = panel.querySelector("#cct-ascension-target");
    const ascensionPopWrinklersInput = panel.querySelector(
      "#cct-ascension-pop-wrinklers"
    );
    const ascensionPermaslotInput = panel.querySelector(
      "#cct-ascension-permaslot"
    );
    const ascensionContinueInput = panel.querySelector(
      "#cct-ascension-continue"
    );
    const ascensionArmedInput = panel.querySelector(
      "#cct-ascension-armed"
    );

    for (const [profileId, profile] of Object.entries(STRATEGY_PROFILES)) {
      const option = document.createElement("option");
      option.value = profileId;
      option.textContent = profile.label;
      strategyProfileSelect.appendChild(option);
    }

    for (const [planId, plan] of Object.entries(ASCENSION_PLANS)) {
      const option = document.createElement("option");
      option.value = planId;
      option.textContent = plan.label;
      ascensionPlanSelect.appendChild(option);
    }

    strategyProfileSelect.value = controls.strategyProfileId;
    autoBuyInput.checked = controls.autoBuy;
    for(const [id,key] of [['cct-adaptive-auras','adaptiveDragonAuras'],['cct-utility-auras','dragonUtilityAuras']]) {
      const input=panel.querySelector('#'+id);input.checked=controls[key];
      input.addEventListener('change',()=>{controls[key]=input.checked;toolkit.adaptiveAuraPlan=null;toolkit.adaptiveAuraLastCheck=-Infinity;saveControls();});
    }
    const seasonInput=panel.querySelector('#cct-renew-season');seasonInput.value=controls.renewSeason;
    seasonInput.addEventListener('change',()=>{controls.renewSeason=seasonInput.value;toolkit.adaptiveAuraLastCheck=-Infinity;saveControls();});
    const lateRepeatInput = panel.querySelector("#cct-late-repeat");
    const lateRepeatTarget = panel.querySelector("#cct-late-repeat-target");
    lateRepeatInput.checked = controls.lateGameRepeatAscension;
    lateRepeatTarget.value = String(controls.lateGameRepeatTarget);
    lateRepeatInput.addEventListener("change", () => {
      controls.lateGameRepeatAscension = lateRepeatInput.checked;
      if (toolkit.ascensionState === "error") setAscensionState("idle", "Ascension manager reset");
      saveControls();
    });
    lateRepeatTarget.addEventListener("change", () => {
      const value=Number(lateRepeatTarget.value);
      if (Number.isFinite(value) && value>=1) controls.lateGameRepeatTarget=Math.floor(value);
      lateRepeatTarget.value=String(controls.lateGameRepeatTarget);
      saveControls();
    });
    const lateBulkInput = panel.querySelector("#cct-late-bulk");
    lateBulkInput.checked = controls.lateGameBulkBuy;
    lateBulkInput.addEventListener("change", () => {
      controls.lateGameBulkBuy = lateBulkInput.checked;
      saveControls();
    });
    autoBuyBuildingsInput.checked = controls.autoBuyBuildings;
    autoBuyUpgradesInput.checked = controls.autoBuyUpgrades;
    priorityUpgradesInput.checked = controls.priorityUpgrades;
    timeSavingOtherItemsInput.checked = controls.timeSavingOtherItems;
    bigCookieInput.checked = controls.bigCookie;
    goldenCookiesInput.checked = controls.goldenCookies;
    clickWrathCookiesInput.checked = controls.clickWrathCookies;
    chainProtectionInput.checked = controls.chainProtection;
    chainModeSelect.value = controls.chainMode;
    sugarLumpsInput.checked = controls.sugarLumps;
    for (const [id,key] of [["cct-garden-auto","gardenAutoBreed"],["cct-garden-sacrifice","gardenAutoSacrifice"]]) {
      const input=panel.querySelector(`#${id}`);input.checked=controls[key];
      input.addEventListener("change",()=>{controls[key]=input.checked; toolkit.gardenCycle=null; saveControls();});
    }
    gardenPresetInput.checked = controls.gardenPresetEnabled;
    gardenSyncInput.checked = controls.gardenSyncParents;
    gardenSoilInput.checked = controls.gardenSmartSoil;
    gardenTargetInput.value = controls.gardenMutationTarget;
    forceHandInput.checked = controls.forceHand;
    godzamokCombosInput.checked = controls.godzamokCombos;
    pantheonAutomationInput.checked = controls.pantheonAutomation;
    dragonAutomationInput.checked = controls.dragonAutomation;
    dragonDropsInput.checked = controls.dragonDrops;
    dragonModeSelect.value = controls.dragonMode;
    protectShinyWrinklersInput.checked = controls.protectShinyWrinklers;
    grandmapocalypseStageSelect.value = String(
      controls.grandmapocalypseStageCap
    );
    wrinklerModeSelect.value = controls.wrinklerMode;
    prioritySelect.value = controls.priority;
    reserveSelect.value = controls.reserveMode;
    ascensionModeSelect.value = controls.ascensionMode;
    ascensionPlanSelect.value = controls.ascensionPlanId;
    ascensionAdaptiveInput.checked = controls.ascensionAdaptiveTarget;
    ascensionTargetInput.value = String(controls.ascensionPrestigeTarget);
    ascensionTargetInput.disabled = false;
    ascensionPopWrinklersInput.checked = controls.popWrinklersBeforeAscend;
    ascensionPermaslotInput.checked = controls.assignPermanentSlot;
    ascensionContinueInput.checked = controls.continueAscensions;
    ascensionArmedInput.checked = controls.ascensionArmed;

    function syncControlInputs() {
      strategyProfileSelect.value = controls.strategyProfileId;
      midgameProfileInput.checked =
        controls.strategyProfileId === "mid-active";
      timeSavingOtherItemsInput.checked = controls.timeSavingOtherItems;
      clickWrathCookiesInput.checked = controls.clickWrathCookies;
      prioritySelect.value = controls.priority;
      reserveSelect.value = controls.reserveMode;
      chainProtectionInput.checked = controls.chainProtection;
      dragonModeSelect.value = controls.dragonMode;
      godzamokCombosInput.checked = controls.godzamokCombos;
      pantheonAutomationInput.checked = controls.pantheonAutomation;
      grandmapocalypseStageSelect.value = String(
        controls.grandmapocalypseStageCap
      );
      wrinklerModeSelect.value = controls.wrinklerMode;
      protectShinyWrinklersInput.checked =
        controls.protectShinyWrinklers;
      ascensionPlanSelect.value = controls.ascensionPlanId;
      ascensionAdaptiveInput.checked = controls.ascensionAdaptiveTarget;
      ascensionTargetInput.disabled = false;
      ascensionArmedInput.checked = controls.ascensionArmed;
    }

    syncControlInputs();

    strategyProfileSelect.addEventListener("change", () => {
      if (!applyStrategyProfile(strategyProfileSelect.value)) return;
      syncControlInputs();
      runWrinklerAutomation();
      runAscensionManager();
    });

    midgameProfileInput.addEventListener("change", () => {
      applyStrategyProfile(
        midgameProfileInput.checked ? "mid-active" : "early-active"
      );
      syncControlInputs();
      runWrinklerAutomation();
      runAscensionManager();
    });
    gardenPresetInput.addEventListener("change", () => {
      controls.gardenPresetEnabled = gardenPresetInput.checked;
      saveControls();
    });
    gardenSyncInput.addEventListener("change", () => {
      controls.gardenSyncParents = gardenSyncInput.checked;
      toolkit.gardenTimingKey = null;
      saveControls();
    });
    gardenSoilInput.addEventListener("change", () => {
      controls.gardenSmartSoil = gardenSoilInput.checked;
      saveControls();
    });
    saveGardenPresetButton.addEventListener("click", () => {
      const result = toolkit.saveGardenPreset();
      panel.querySelector('#cct-season-aura-status').textContent=(toolkit.seasonStatus||'Season renewal off')+'; '+(controls.adaptiveDragonAuras?(toolkit.adaptiveAuraStatus||'Checking auras'):'Aura switching off');
      panel.querySelector("#cct-garden-status").textContent = result.ok
        ? `Saved ${result.tiles} Garden tiles`
        : "Open the Farm Garden first";
    });
    gardenTargetInput.addEventListener("change", () => {
      controls.gardenMutationTarget = gardenTargetInput.value.trim();
      saveControls();
    });
    autoBuyInput.addEventListener("change", () => {
      controls.autoBuy = autoBuyInput.checked;
      saveControls();
    });
    autoBuyBuildingsInput.addEventListener("change", () => {
      controls.autoBuyBuildings = autoBuyBuildingsInput.checked;
      toolkit.targetSnapshotAt = -Infinity;
      saveControls();
    });
    autoBuyUpgradesInput.addEventListener("change", () => {
      controls.autoBuyUpgrades = autoBuyUpgradesInput.checked;
      toolkit.targetSnapshotAt = -Infinity;
      saveControls();
    });
    priorityUpgradesInput.addEventListener("change", () => {
      controls.priorityUpgrades = priorityUpgradesInput.checked;
      toolkit.targetSnapshotAt = -Infinity;
      saveControls();
    });
    timeSavingOtherItemsInput.addEventListener("change", () => {
      controls.timeSavingOtherItems = timeSavingOtherItemsInput.checked;
      toolkit.targetSnapshotAt = -Infinity;
      saveControls();
    });
    bigCookieInput.addEventListener("change", () => {
      controls.bigCookie = bigCookieInput.checked;
      saveControls();
    });
    goldenCookiesInput.addEventListener("change", () => {
      controls.goldenCookies = goldenCookiesInput.checked;
      saveControls();
    });
    clickWrathCookiesInput.addEventListener("change", () => {
      controls.clickWrathCookies = clickWrathCookiesInput.checked;
      saveControls();
    });
    chainProtectionInput.addEventListener("change", () => {
      controls.chainProtection = chainProtectionInput.checked;
      saveControls();
    });
    chainModeSelect.addEventListener("change", () => {
      controls.chainMode = chainModeSelect.value;
      saveControls();
    });
    sugarLumpsInput.addEventListener("change", () => {
      controls.sugarLumps = sugarLumpsInput.checked;
      saveControls();
      runSugarLumpAutomation();
    });
    forceHandInput.addEventListener("change", () => {
      controls.forceHand = forceHandInput.checked;
      saveControls();
      runForceTheHandOfFate();
    });
    godzamokCombosInput.addEventListener("change", () => {
      controls.godzamokCombos = godzamokCombosInput.checked;
      saveControls();
      runGodzamokAutomation();
    });
    pantheonAutomationInput.addEventListener("change", () => {
      controls.pantheonAutomation = pantheonAutomationInput.checked;
      saveControls();
      runPantheonAutomation();
    });
    dragonAutomationInput.addEventListener("change", () => {
      controls.dragonAutomation = dragonAutomationInput.checked;
      saveControls();
      runDragonAutomation();
    });
    dragonDropsInput.addEventListener("change", () => {
      controls.dragonDrops = dragonDropsInput.checked;
      saveControls();
      runDragonDropAutomation();
    });
    dragonModeSelect.addEventListener("change", () => {
      controls.dragonMode = dragonModeSelect.value;
      saveControls();
      runDragonAutomation();
    });
    protectShinyWrinklersInput.addEventListener("change", () => {
      controls.protectShinyWrinklers = protectShinyWrinklersInput.checked;
      saveControls();
      runWrinklerAutomation();
    });
    grandmapocalypseStageSelect.addEventListener("change", () => {
      controls.grandmapocalypseStageCap = Number(
        grandmapocalypseStageSelect.value
      );
      toolkit.targetSnapshotAt = -Infinity;
      saveControls();
    });
    wrinklerModeSelect.addEventListener("change", () => {
      controls.wrinklerMode = wrinklerModeSelect.value;
      saveControls();
      runWrinklerAutomation();
    });
    prioritySelect.addEventListener("change", () => {
      controls.priority = prioritySelect.value;
      saveControls();
    });
    reserveSelect.addEventListener("change", () => {
      controls.reserveMode = reserveSelect.value;
      saveControls();
    });
    ascensionModeSelect.addEventListener("change", () => {
      controls.ascensionMode = ascensionModeSelect.value;
      if (controls.ascensionMode !== "automatic") {
        controls.ascensionArmed = false;
        ascensionArmedInput.checked = false;
      }
      if (toolkit.ascensionState === "error" && !Game.OnAscend) {
        setAscensionState("idle", "Ascension manager reset");
      }
      saveControls();
      runAscensionManager();
    });
    ascensionPlanSelect.addEventListener("change", () => {
      const plan = ASCENSION_PLANS[ascensionPlanSelect.value];
      if (!plan || isAscensionAutomationBusy()) return;
      controls.ascensionPlanId = ascensionPlanSelect.value;
      controls.ascensionAdaptiveTarget = true;
      controls.ascensionPrestigeTarget = plan.stages[0].guideCost;
      controls.ascensionArmed = false;
      ascensionAdaptiveInput.checked = true;
      ascensionTargetInput.disabled = false;
      ascensionTargetInput.value = String(plan.stages[0].guideCost);
      ascensionArmedInput.checked = false;
      setAscensionState("idle", "Ascension plan changed");
      saveControls();
      runAscensionManager();
    });
    ascensionAdaptiveInput.addEventListener("change", () => {
      const currentAdaptiveTarget = getAscensionProgress(
        getAscensionPlan()
      ).adaptiveTarget;
      controls.ascensionAdaptiveTarget = ascensionAdaptiveInput.checked;
      if (!controls.ascensionAdaptiveTarget) {
        controls.ascensionPrestigeTarget = Math.max(
          Number.isFinite(currentAdaptiveTarget)
            ? Math.floor(currentAdaptiveTarget)
            : Math.floor(Number(controls.ascensionPrestigeTarget) || 1),
          1
        );
      }
      controls.ascensionArmed = false;
      ascensionArmedInput.checked = false;
      ascensionTargetInput.disabled = false;
      ascensionTargetInput.value = String(
        controls.ascensionPrestigeTarget
      );
      saveControls();
      runAscensionManager();
    });
    ascensionTargetInput.addEventListener("change", () => {
      const target = Math.max(
        Math.floor(Number(ascensionTargetInput.value) || 1),
        1
      );
      controls.ascensionAdaptiveTarget = false;
      controls.ascensionPrestigeTarget = target;
      controls.ascensionArmed = false;
      ascensionTargetInput.value = String(target);
      ascensionAdaptiveInput.checked = false;
      ascensionTargetInput.disabled = false;
      ascensionArmedInput.checked = false;
      if (!isAscensionAutomationBusy()) {
        setAscensionState("idle", "Ascension target changed");
      }
      saveControls();
      runAscensionManager();
    });
    ascensionPopWrinklersInput.addEventListener("change", () => {
      controls.popWrinklersBeforeAscend =
        ascensionPopWrinklersInput.checked;
      saveControls();
    });
    ascensionPermaslotInput.addEventListener("change", () => {
      controls.assignPermanentSlot = ascensionPermaslotInput.checked;
      saveControls();
    });
    ascensionContinueInput.addEventListener("change", () => {
      controls.continueAscensions = ascensionContinueInput.checked;
      saveControls();
    });
    ascensionArmedInput.addEventListener("change", () => {
      controls.ascensionArmed = ascensionArmedInput.checked;
      if (controls.ascensionArmed) {
        controls.ascensionMode = "automatic";
        ascensionModeSelect.value = "automatic";
        if (toolkit.ascensionState === "error" && !Game.OnAscend) {
          setAscensionState("idle", "Ascension manager reset");
        }
      }
      saveControls();
      runAscensionManager();
    });

    function updatePanel() {
      if (!toolkit.active) return;

      const { clicksPerSecond, clickingCps } = getClickStats();
      const totalCps = Math.max((Number(Game.cookiesPs) || 0) + clickingCps, 0);
      const reserve = getReserve();
      const chainReserve = getChainReserveForCps(getBaseCps());
      const reserveMissing = Math.max(reserve - Game.cookies, 0);
      const reserveEta = totalCps > 0 ? reserveMissing / totalCps : Infinity;
      const targets = getTargetSnapshot();
      const wrinklers = getWrinklerSummary();
      const ownedGrandmapocalypseStage = getOwnedGrandmapocalypseStage();
      const strategyProfile =
        STRATEGY_PROFILES[controls.strategyProfileId];
      const ascensionPlan = getAscensionPlan();
      const availablePrestige = getAvailablePrestige();
      const ascensionProgress = getAscensionProgress(ascensionPlan);
      const ascensionTarget = getEffectiveAscensionTarget(ascensionPlan);
      const ascensionTargetLabel = Number.isFinite(ascensionTarget)
        ? ascensionTarget.toLocaleString()
        : "Complete";

      ascensionModeSelect.value = controls.ascensionMode;
      ascensionPlanSelect.value = controls.ascensionPlanId;
      ascensionAdaptiveInput.checked = controls.ascensionAdaptiveTarget;
      ascensionArmedInput.checked = controls.ascensionArmed;
      ascensionContinueInput.checked = controls.continueAscensions;
      ascensionTargetInput.disabled = false;
      // Preserve the user's editable target during periodic panel refreshes.

      panel.querySelector("#cct-stats").innerHTML = `
        Per click: ${compactNumber(Game.computedMouseCps)}<br>
        Click speed: ${clicksPerSecond.toFixed(1)}/s<br>
        Click earn: ${compactNumber(clickingCps)}/s
      `;

      panel.querySelector("#cct-diagnostics").innerHTML = `
        Version: ${TOOLKIT_VERSION}<br>
        Garden timing and smart soil: installed<br>
        Click timer: ${toolkit.clickScheduler}<br>
        Buyer: ${AUTO_BUY_CHECK_MS}ms scan, ${AUTO_BUY_COOLDOWN_MS}ms cooldown<br>
        Toolkit scan work: ${toolkit.lastTargetScanMs.toFixed(2)}ms<br>
        Wrinkler check: ${WRINKLER_CHECK_MS}ms<br>
        Dragon check: ${DRAGON_CHECK_MS}ms<br>
        Ascension check: ${ASCENSION_CHECK_MS}ms<br>
        Ascension state: ${toolkit.ascensionState}<br>
        Page: ${
          document.visibilityState === "hidden"
            ? "Hidden, browser limited"
            : document.hasFocus?.() === false
              ? "Visible, unfocused"
              : "Visible"
        }
      `;

      panel.querySelector("#cct-godzamok-result").textContent =
        `${formatGodzamokResult()}. Completed sacrifices: ${toolkit.godzamokCompletedSacrifices}. ` +
        `Session net: ${toolkit.godzamokMeasuredNet < 0 ? "-" : "+"}${compactNumber(Math.abs(toolkit.godzamokMeasuredNet))}`;
      const recoveryIncome = getGodzamokRecoveryRate({
        rate: Math.min(clicksPerSecond, toolkit.samples.filter(sample => sample.time >= performance.now() - 1000).length) * GODZAMOK_FORECAST_RATE_FRACTION,
        perClick: Number(Game.computedMouseCps) || 0
      });
      const recoveryBudget = Math.min(Math.max(Number(Game.cookies) - Number(reserve), 0),
        recoveryIncome * controls.godzamokMaxRecoverySeconds);
      panel.querySelector("#cct-godzamok-budget").textContent = controls.godzamokObjective === "prestige"
        ? `Estimated recovery income: ${compactNumber(recoveryIncome)}/s. Max sell/rebuy loss: ${compactNumber(recoveryBudget)}.`
        : controls.godzamokObjective === "all"
          ? "Sell every allowed building, including the last Farm, without an affordability gate. Buy back what is affordable; queue the rest above reserve."
          : controls.godzamokObjective === "combo"
          ? "Maximize estimated extra combo cookies minus sell/rebuy cost. No recovery-time cap; restore immediately above reserve."
          : "Bank-profit mode: sacrifices must pay for themselves.";
      panel.querySelector("#cct-godzamok-recovery").disabled = controls.godzamokObjective !== "prestige";
      panel.querySelector("#cct-godzamok-resume").disabled =
        !controls.godzamokLossGuardPaused || Boolean(toolkit.godzamokLedger) || toolkit.godzamokRebuildQueue.length > 0;

      panel.querySelector("#cct-bank").innerHTML = `
        Strategy: ${strategyProfile?.label || controls.strategyProfileId}<br>
        Reserve mode: ${getReserveLabel()}<br>
        Chain reserve (${controls.chainMode}): ${
          controls.chainProtection
            ? compactNumber(chainReserve)
            : "Off"
        }<br>
        Bank: ${compactNumber(Game.cookies)} / ${compactNumber(reserve)}<br>
        Reserve ETA: ${formatTime(reserveEta)}<br>
        Last purchase: ${toolkit.lastPurchaseName}<br>
        Grandmapocalypse: stage ${ownedGrandmapocalypseStage}, cap ${controls.grandmapocalypseStageCap}<br>
        Wrinklers: ${wrinklers.attached}/${wrinklers.max}, stored ${compactNumber(wrinklers.stored)}${
          wrinklers.shinyCount > 0
            ? `, ${wrinklers.shinyCount} shiny`
            : ""
        }<br>
        Wrinkler mode: ${controls.wrinklerMode}, ${toolkit.lastWrinklerAction}<br>
        Lumps: ${getSugarLumpStatus()}<br>
        FtHoF: ${toolkit.forceHandStatus}<br>
        Godzamok: ${toolkit.godzamokStatus}<br>
        ${toolkit.lastGodzamokPlan
          ? `Last sacrifice: ${toolkit.lastGodzamokPlan.rate.toFixed(1)} clicks/s,
            ${toolkit.lastGodzamokPlan.seconds.toFixed(2)}s credited,
            cost ${compactNumber(toolkit.lastGodzamokPlan.actualRoundTripCost)},
            estimated net ${toolkit.lastGodzamokPlan.profit < 0 ? "-" : "+"}${compactNumber(Math.abs(toolkit.lastGodzamokPlan.profit))}<br>
            ${toolkit.lastGodzamokPlan.objective === "prestige" ?
              `Expected extra baked ${compactNumber(toolkit.lastGodzamokPlan.baked)}, extra prestige ${compactNumber(toolkit.lastGodzamokPlan.prestigeGain)}, recovery ${formatTime(toolkit.lastGodzamokPlan.recoverySeconds)}<br>` : ""}
            ${formatGodzamokResult()}<br>`
          : ""}
        Dragon: ${toolkit.dragonStatus}<br>
        Lucky + mouse upgrades: ${controls.priorityUpgrades ? "On, buy when cheapest" : "Off"}
      `;

      panel.querySelector("#cct-garden-status").textContent = toolkit.gardenStatus;
      const stockBook = controls.stockBook;
      const signedStock = n => `${n < 0 ? "-" : "+"}${compactNumber(Math.abs(n || 0))}`;
      panel.querySelector("#cct-stock-status").textContent = toolkit.stockStatus + (stockBook
        ? ` Tracked realized: ${signedStock(stockBook.realizedCookies)} cookies / $${signedStock(stockBook.realizedDollars)}. Purchase fees: $${compactNumber(stockBook.feesDollars)}. Trades: ${stockBook.trades}. ${stockBook.lastAction}` : "");
      panel.querySelector("#cct-stock-rows").textContent = toolkit.stockRows.join("\n");

      midgameProfileInput.checked =
        controls.strategyProfileId === "mid-active";
      panel.querySelector("#cct-midgame-status").innerHTML = `
        Profile: ${strategyProfile?.label || controls.strategyProfileId}<br>
        Ascension plan: ${ascensionPlan.label}<br>
        Current checkpoint: ${ascensionProgress.stage?.label || "All coded midgame stages complete"}<br>
        Dragon: ${controls.dragonMode}, ${toolkit.dragonStatus}<br>
        Grimoire: ${toolkit.forceHandStatus}<br>
        Godzamok: ${toolkit.godzamokStatus}<br>
        Wrinklers: ${controls.wrinklerMode}, ${wrinklers.attached}/${wrinklers.max}<br>
        Grandmapocalypse cap: stage ${controls.grandmapocalypseStageCap}<br>
        Bank reserve: ${getReserveLabel()}<br>
        Chain reserve: ${controls.chainProtection ? controls.chainMode : "Off"}
      `;
      panel.querySelector("#cct-midgame-mechanics").innerHTML = `
        Auto-ascends through checkpoints 4 to 8.<br>
        Buys synergy and unshackled heavenly upgrades.<br>
        Keeps auto-buy, golden-cookie clicking, FtHoF, dragon, and wrinklers running.<br>
        Casts FtHoF during Frenzy or building specials when magic is ready.<br>
        Sells low-tier buildings for Godzamok during Click Frenzy or Dragonflight.<br>
        Sets dragon plan to safe full training.<br>
        Fills available permanent slots with your best kitten upgrades.<br>
        Keeps bank reserves off after ascension so buying resumes fast.
      `;
      panel.querySelector("#cct-lategame-status").innerHTML = `
        Checkpoint: ${ascensionProgress.stage?.label || "All coded late-game stages complete"}<br>
        Prestige gain: ${availablePrestige.toLocaleString()} / ${ascensionTargetLabel}<br>
        Missing upgrades: ${ascensionProgress.missing?.join(", ") || "None"}
      `;

      const ascensionSummary = `
        Mode: ${controls.ascensionMode}${
          controls.ascensionMode === "automatic"
            ? controls.ascensionArmed
              ? ", armed"
              : ", not armed"
            : ""
        }<br>
        Plan: ${ascensionPlan.label}<br>
        Checkpoint: ${ascensionProgress.stage?.label || "All coded stages complete"}<br>
        Prestige gain: ${availablePrestige.toLocaleString()} / ${ascensionTargetLabel}<br>
        Continue: ${controls.continueAscensions ? "On" : "One ascension only"}<br>
        Status: ${toolkit.ascensionStatus}
      `;
      panel.querySelector("#cct-ascension-summary").innerHTML =
        ascensionSummary;

      panel.querySelector("#cct-ascension-status").innerHTML = `
        ${ascensionSummary}<br>
        Heavenly chips: ${compactNumber(Game.heavenlyChips)}<br>
        Permanent slot: ${toolkit.ascensionPermanentUpgradeName}<br>
        Bought this ascension: ${
          toolkit.ascensionPurchasedThisRun.length > 0
            ? toolkit.ascensionPurchasedThisRun.join(", ")
            : "None"
        }
      `;

      panel.querySelector("#cct-ascension-plan-list").innerHTML =
        ascensionPlan.stages
          .map((stage, stageIndex) => {
            const stageDone = stage.heavenlyUpgrades.every(
              (name) => getHeavenlyUpgrade(name)?.bought
            );
            const current = stageIndex === ascensionProgress.stageIndex;
            const upgrades = stage.heavenlyUpgrades
              .map((name) => {
                const bought = Boolean(getHeavenlyUpgrade(name)?.bought);
                const price = ASCENSION_UPGRADE_COSTS[name] || Number(getHeavenlyUpgrade(name)?.basePrice) || 0;
                return `${bought ? "✓" : "○"} ${name}, ${compactNumber(price)}`;
              })
              .join("<br>");
            return `<div style="margin:0 0 10px">
              <b style="color:${stageDone ? "#55dd55" : current ? "#ffd700" : "#ccc"}">${stage.label}, ${stage.guideCost.toLocaleString()}</b><br>
              ${upgrades}
            </div>`;
          })
          .join("<br>");

      const targetBox = panel.querySelector("#cct-targets");
      const settings = getCookieMonsterSettings();
      const cookieMonsterData = getCookieMonsterData();

      if (!settings && !cookieMonsterData) {
        targetBox.textContent = "Cookie Monster is loading.";
        return;
      }

      if (targets.length === 0) {
        const colorsDisabled =
          !cookieMonsterData &&
          settings &&
          settings.BuildColour !== 1 &&
          settings.UpBarColour === 0;
        targetBox.textContent = colorsDisabled
          ? "Enable Cookie Monster building colours or upgrade colour bars."
          : "No eligible purchase targets right now.";
        return;
      }

      targetBox.innerHTML = targets
        .map((target) => {
          const reserveAfterPurchase = getReserveAfterPurchase(target);
          const requiredBank = getRequiredBank(target);
          const missing = Math.max(requiredBank - Game.cookies, 0);
          const eta = totalCps > 0 ? missing / totalCps : Infinity;
          const targetColors = {
            blue: "#55aaff",
            green: "#55dd55",
            yellow: "#ffff55",
            orange: "#ff9f43",
            red: "#ff5555",
            purple: "#bb66ff",
            gray: "#aaaaaa",
            extra: "#ffd700"
          };
          const color = targetColors[target.color] || "#ffd700";
          const extraLabel = target.extra ? " [buy when cheapest]" : "";
          const timeSaverLabel = target.timeSaver
            ? ` [saves ${formatTime(target.timeSaved)} to ${target.goalName}]`
            : "";

          return `
            <div style="margin:5px 0">
              <span style="color:${color}">●</span>
              ${target.name}${extraLabel}${timeSaverLabel}, ${compactNumber(target.price)}<br>
              <span style="padding-left:14px">Time: ${formatTime(eta)}</span><br>
              <span style="padding-left:14px;color:#aaa">After-buy reserve: ${compactNumber(reserveAfterPurchase)}</span>
            </div>
          `;
        })
        .join("");
    }

    toolkit.meterTimer = setInterval(updatePanel, 500);
    updatePanel();
  }

  toolkit.stop = () => {
    if (!toolkit.active) return;
    toolkit.active = false;

    clearInterval(toolkit.meterTimer);
    clearInterval(toolkit.modTimer);
    clearInterval(toolkit.bigCookieTimer);
    clearInterval(toolkit.goldenCookieTimer);
    clearInterval(toolkit.sugarLumpTimer);
    clearInterval(toolkit.gardenTimer);
    clearInterval(toolkit.stockTimer);
    clearInterval(toolkit.telemetryTimer);
    clearInterval(toolkit.forceHandTimer);
    clearInterval(toolkit.godzamokTimer);
    clearInterval(toolkit.pantheonTimer);
    clearInterval(toolkit.dragonTimer);
    clearInterval(toolkit.seasonAuraTimer);
    clearInterval(toolkit.dragonDropTimer);
    clearInterval(toolkit.autoBuyTimer);
    clearInterval(toolkit.wrinklerTimer);
    clearInterval(toolkit.ascensionTimer);

    if (Game.ConfirmPrompt && Game.ConfirmPrompt !== originalConfirmPrompt) {
      Game.ConfirmPrompt = originalConfirmPrompt;
    }

    toolkit.panelDragCleanup?.();
    toolkit.panelResizeObserver?.disconnect?.();
    toolkit.panel?.remove();
    toolkit.colorProbe?.remove();

    if (toolkit.bigCookieWorker) {
      toolkit.bigCookieWorker.postMessage({ type: "stop" });
      toolkit.bigCookieWorker.terminate();
    }
    if (toolkit.bigCookieWorkerUrl) {
      URL.revokeObjectURL(toolkit.bigCookieWorkerUrl);
    }

    delete window.cookieClickToolkit;
    delete window.clickIncomeMeter;
  };

  window.cookieClickToolkit = toolkit;
  window.clickIncomeMeter = toolkit;

  /* Cloud telemetry is opt-in and does not alter gameplay decisions. */
  const CQ_TELEMETRY_KEY = "cookiequant:telemetry:v1";
  const CQ_TELEMETRY_URL = "https://cookiequant-dashboard.vercel.app/api/telemetry";
  const cloudConfig = () => {
    try { return JSON.parse(localStorage.getItem(CQ_TELEMETRY_KEY) || "null"); }
    catch { return null; }
  };
  const finiteTelemetry = value => Number.isFinite(Number(value)) ? Number(value) : 0;
  const cloudRun = () => {
    const saved = cloudConfig();
    if (saved?.run && /^[a-zA-Z0-9_-]{8,90}$/.test(saved.run)) return saved.run;
    return window.crypto?.randomUUID?.() || ("cq" + Date.now() + Math.random().toString(36).slice(2));
  };
  toolkit.telemetry = {
    status: "Disabled. Call cookieClickToolkit.telemetry.connect('YOUR_WRITE_KEY') to opt in.",
    connect(writeKey) {
      if (typeof writeKey !== "string" || !/^[A-Za-z0-9_-]{32,150}$/.test(writeKey)) {
        throw Error("Expected a valid private telemetry write key.");
      }
      const settings = { key: writeKey, run: cloudRun(), enabled: true };
      localStorage.setItem(CQ_TELEMETRY_KEY, JSON.stringify(settings));
      this.status = "Connecting";
      void this.push();
      return "Cloud telemetry enabled. Use cookieClickToolkit.telemetry.status for health.";
    },
    disconnect() {
      localStorage.removeItem(CQ_TELEMETRY_KEY);
      this.status = "Disabled";
      return "Cloud telemetry disconnected. Stored cloud history remains until its 30-day expiry.";
    },
    async push() {
      if (!toolkit.active || !window.Game?.ready) return false;
      const settings = cloudConfig();
      if (!settings?.enabled || !settings.key) return false;
      if (this.pending) return false;
      const market = getStockMarket();
      const book = market ? stockBookFor(market) : null;
      const tick = market ? Number(market.ticks) : Math.floor(Date.now() / 60000);
      const existing = toolkit.telemetryStock;
      const planned = existing?.tick === tick ? existing : null;
      const goods = (market?.goodsById || []).map(good => {
        const row = planned?.goods?.find(g => g.id === good.id);
        const position = book?.positions?.[good.id];
        return {
          id: Number(good.id), symbol: String(good.symbol || ""),
          name: String(good.name || ""), price: market.getGoodPrice(good),
          stock: Number(good.stock), max: market.getGoodMaxStock(good),
          mode: Number(good.mode), trend: Number(good.d),
          mean: row?.mean ?? Number(market.getGoodPrice(good)),
          low: row?.low ?? Number(market.getGoodPrice(good)),
          high: row?.high ?? Number(market.getGoodPrice(good)),
          win: row?.win ?? 0, buy: row?.buy === true,
          target: row?.target ?? Number(good.stock),
          basis: position && !position.unknown && position.quantity > 0
            ? position.dollarCost / position.quantity : 0,
          unknown: !!position?.unknown, paths: row?.paths || []
        };
      });
      const snapshot = {
        version: 1, run: settings.run, emittedAt: new Date().toISOString(),
        game: {
          version: String(Game.version || ""), resets: Number(Game.resets) || 0,
          cookies: finiteTelemetry(Game.cookies), cps: finiteTelemetry(Game.cookiesPs),
          prestige: finiteTelemetry(Game.prestige)
        },
        market: {
          tick: Number.isSafeInteger(tick) ? tick : 0,
          level: Number(Game.Objects?.Bank?.level) || 0,
          brokers: Number(market?.brokers) || 0,
          fee: market ? 0.2 * Math.pow(0.95, Math.max(Number(market.brokers) || 0, 0)) : 0,
          riskLimit: (Number(controls.stockRiskPercent) || 5) / 100,
          budgetPercent: Number(controls.stockBudgetPercent) || 0,
          horizon: Number(controls.stockHorizon) || 15,
          modeledReturn: planned?.modeledReturn || 0,
          modeledRisk: planned?.modeledRisk || 0,
          autoTrading: controls.stockAuto === true,
          goods
        },
        stats: {
          trades: book?.trades || 0, realizedDollars: book?.realizedDollars || 0,
          feesDollars: book?.feesDollars || 0, nativeProfit: book?.nativeProfit || 0,
          lastAction: book?.lastAction || ""
        },
        modules: {
          stock: toolkit.stockStatus || "", garden: toolkit.gardenStatus || "",
          godzamok: toolkit.godzamokStatus || "",
          ascension: toolkit.ascensionStatus || "", dragon: toolkit.dragonStatus || ""
        }
      };
      this.pending = true;
      this.status = "Sending snapshot for tick " + tick;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      try {
        const response = await fetch(CQ_TELEMETRY_URL, {
          method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + settings.key },
          body: JSON.stringify(snapshot), mode: "cors", cache: "no-store", signal: controller.signal
        });
        if (!response.ok) throw Error("HTTP " + response.status);
        this.lastSent = Date.now();
        this.status = "Connected. Last upload " + new Date(this.lastSent).toLocaleTimeString() + " (tick " + tick + ")";
        return true;
      } catch(error) {
        this.status = "Upload failed: " + (error?.message || String(error));
        console.warn("[CookieQuant] Cloud telemetry: " + this.status);
        return false;
      } finally { clearTimeout(timeout); this.pending = false; }
    }
  };
  toolkit.telemetryTimer = setInterval(() => { if (toolkit.active) void toolkit.telemetry.push(); }, 60000);
  if (cloudConfig()?.enabled) setTimeout(() => { if (toolkit.active) void toolkit.telemetry.push(); }, 6000);

  saveControls();
  console.log(`Cookie Toolkit ${TOOLKIT_VERSION} loaded. Garden synchronization, smart soil and measured Godzamok profit are installed.`);
})();
