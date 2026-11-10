# Configuration and strategy

## Getting started

Open the in-game Overview and Automation tabs to review purchase priorities, reserve policy, and currently enabled automations. The big-cookie clicker and event detection start enabled by default. The stock trader activates when the Bank minigame is available.

The Stocks tab shows forecasts, portfolio controls, and tracked trades. Mid Game covers Garden and combo systems. Ascension controls prestige progression. Targets and Diagnostics expose planned purchases, statuses, and stop conditions.

## Profiles

| Profile | Purchase priority | Bank reserve | Grandmapocalypse stage cap | Dragon plan |
| --- | --- | --- | --- | --- |
| Early game, active | Blue first | Smart | 1 | Milk only |
| Mid game, active | Blue first | None | 3 | Safe full training |

Profiles update several settings at once but do not reset your save. You can override their individual switches.

## Economy

The purchase planner uses Cookie Monster's modeled upgrade/building efficiency colors. It can consider off-color purchases if the estimated income gain saves time to the main target. Bank reserve modes protect Lucky, Conjure, and Cookie Chain opportunities, including the additional reserve required after an intended purchase.

## Garden

Auto breed identifies missing seeds, orders dependency goals, plans viable layouts, synchronizes maturity windows, and harvests mutations. Smart soil selects growth or mutation-enhancing soil while respecting game cooldowns.

For manual control, plant a parent pattern, save a Garden preset, and enable preset maintenance. The full-seed-log sacrifice option resets the log and should be enabled only when intentionally repeating Garden progression.

## Godzamok and dragon

Godzamok supports profit, prestige, combo, and sell-all objectives. Selling can affect production and reserves. The optimizer estimates the round-trip replacement cost, records outcomes, and may pause after an unprofitable or incompletely restored sacrifice.

Dragon automation can consume buildings during training or aura changes. Safe-full mode attempts to account for replacement costs and rebuild sacrificed inventory. Dragon drop collection, adaptive auras, and season renewal have separate switches.

## Ascension

The toolkit contains staged targets through the eighth ascension plus custom targets and repeat options. Automatic ascension requires selecting Automatic mode **and** separately arming it. Save export is recommended before using automatic ascension or Garden sacrifice.

## Reset toolkit settings

The localStorage key is cookieClickToolkitControlsV3. To remove only toolkit preferences, stop automation in the console and then clear that key. This does not delete the game's native save. Reloading restarts the userscript unless disabled in your manager.
