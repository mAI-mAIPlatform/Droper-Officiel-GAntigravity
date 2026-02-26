/* ============================
   DROPER — Données Pass de Saison 1 : L'Éveil (50 paliers)
   ============================ */

function tier(n, free, premium) { return { tier: n, free, premium }; }
function coins(amount) { return { type: 'coins', amount, emoji: '🪙' }; }
function gems(amount) { return { type: 'gems', amount, emoji: '💎' }; }
function hero(id, emoji, label) { return { type: 'hero', heroId: id, emoji, label }; }
function item(id, amount, emoji, label) { return { type: 'item', itemId: id, amount, emoji, label }; }

export const SEASON_PASS = {
    id: 'season_1',
    name: "L'Éveil",
    emoji: '🌅',
    maxTier: 50,
    xpPerTier: 150,
    tiers: [
        tier(1, coins(100), gems(10)),
        tier(2, coins(150), coins(300)),
        tier(3, gems(5), item('crate_basic', 1, '📦', 'Caisse')),
        tier(4, coins(200), gems(15)),
        tier(5, hero('tank', '🛡️', 'Tank'), gems(25)),
        tier(6, coins(250), coins(500)),
        tier(7, gems(8), item('booster_xp', 1, '⚡', 'Booster XP')),
        tier(8, coins(300), coins(600)),
        tier(9, item('crate_basic', 1, '📦', 'Caisse'), gems(20)),
        tier(10, hero('sniper', '🎯', 'Sniper'), item('crate_rare', 1, '🎁', 'Caisse Rare')),
        tier(11, coins(350), coins(700)),
        tier(12, gems(10), gems(25)),
        tier(13, coins(400), item('fragment_hero', 3, '🧩', '3 Fragments')),
        tier(14, item('crate_basic', 2, '📦', '2 Caisses'), gems(30)),
        tier(15, hero('phantom', '👻', 'Phantom'), item('key_gold', 1, '🔑', 'Clé Dorée')),
        tier(16, coins(450), coins(900)),
        tier(17, gems(12), item('booster_coins', 1, '💰', 'Booster Pièces')),
        tier(18, coins(500), coins(1000)),
        tier(19, item('fragment_hero', 5, '🧩', '5 Fragments'), gems(35)),
        tier(20, item('crate_rare', 1, '🎁', 'Caisse Rare'), item('crate_rare', 2, '🎁', '2 Caisses Rares')),
        tier(21, coins(550), coins(1100)),
        tier(22, gems(15), gems(40)),
        tier(23, coins(600), item('fragment_hero', 5, '🧩', '5 Fragments')),
        tier(24, item('booster_xp', 1, '⚡', 'Booster XP'), gems(45)),
        tier(25, item('crate_epic', 1, '✨', 'Caisse Épique'), item('key_gold', 2, '🔑', '2 Clés Dorées')),
        tier(26, coins(650), coins(1300)),
        tier(27, gems(18), item('fragment_season', 2, '🌟', '2 Fragments S1')),
        tier(28, coins(700), coins(1400)),
        tier(29, item('crate_basic', 3, '📦', '3 Caisses'), gems(50)),
        tier(30, item('key_season', 1, '🗝️', 'Clé S1'), item('crate_season', 1, '🌅', 'Caisse S1')),
        tier(31, coins(750), coins(1500)),
        tier(32, gems(20), gems(55)),
        tier(33, coins(800), item('booster_xp', 2, '⚡', '2 Boosters XP')),
        tier(34, item('fragment_hero', 8, '🧩', '8 Fragments'), gems(60)),
        tier(35, item('crate_rare', 2, '🎁', '2 Caisses Rares'), item('crate_epic', 1, '✨', 'Caisse Épique')),
        tier(36, coins(850), coins(1700)),
        tier(37, gems(25), item('fragment_season', 3, '🌟', '3 Fragments S1')),
        tier(38, coins(900), coins(1800)),
        tier(39, item('booster_coins', 1, '💰', 'Booster Pièces'), gems(70)),
        tier(40, item('crate_epic', 1, '✨', 'Caisse Épique'), item('key_season', 1, '🗝️', 'Clé S1')),
        tier(41, coins(950), coins(1900)),
        tier(42, gems(30), gems(80)),
        tier(43, coins(1000), item('fragment_hero', 10, '🧩', '10 Fragments')),
        tier(44, item('crate_rare', 2, '🎁', '2 Caisses Rares'), gems(90)),
        tier(45, item('key_gold', 2, '🔑', '2 Clés Dorées'), item('crate_epic', 2, '✨', '2 Caisses Épiques')),
        tier(46, coins(1100), coins(2200)),
        tier(47, gems(40), item('fragment_season', 5, '🌟', '5 Fragments S1')),
        tier(48, coins(1200), coins(2500)),
        tier(49, item('crate_epic', 2, '✨', '2 Caisses Épiques'), gems(100)),
        tier(50, hero('titan', '⚡', 'Titan'), item('crate_season', 3, '🌅', '3 Caisses S1')),
    ],
};
