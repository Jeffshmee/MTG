# Play Patterns

How this list is supposed to play. Commander is [[02 Cards/Creatures/Zurgo Stormrender|Zurgo Stormrender]]. Every line is judged by whether it feeds **Mobilize** or pays off a token **entering** or **leaving**.

See also [[06 Strategy/Win Conditions|Win Conditions]], [[06 Strategy/Playtest Notes|Playtest Notes]], and [[01 Deck/Current Deck|Current Deck]].

**Status of this draft:** written against the current 100. Isshin, Teysa, Packbeasts, Bone-Cairn, Anim Pakal, Belladonna, Windcrag, Sacred Foundry, [[02 Cards/Enchantments/Mardu Ascendancy|Mardu Ascendancy]] (over Thunder of Unity), and [[02 Cards/Lands/Path of Ancestry|Path of Ancestry]] (over Goblin-town) are live. [[02 Cards/Creatures/Kambal, Profiteering Mayor|Kambal]] stays on the sideboard as a token-matchup sleeve. See [[01 Deck/Sideboard|Sideboard]].

---

## The engine

Zurgo has two jobs:

1. **Attack** → [[03 Effects/Mobilize|Mobilize]] 1 makes a tapped-and-attacking 1/1 Warrior. It is sacrificed at the next end step.
2. **Token leaves** → if it was attacking, [[03 Effects/Draw a Card|draw a card]]. Otherwise each opponent [[03 Effects/Opponent Loses Life|loses 1 life]].

The Mobilize token dies at end of step. That is a death, so aristocrat payoffs fire. If the token is [[03 Effects/Exile|exiled]] or bounced instead, Zurgo still sees the leave, but [[02 Cards/Creatures/Teysa Karlov|Teysa]] does not.

Protect Zurgo. [[02 Cards/Artifacts/Lightning Greaves|Lightning Greaves]] is the only dedicated suit in the 100. Opponents have stolen him — Mobilize works for them — so treat protection as a real hole. See [[06 Strategy/Playtest Notes|Playtest Notes]]. Losing him is the biggest tempo swing the deck can suffer.

---

## Opening and curve

**Keep** a hand that can cast Zurgo on turn 3 and attack. Ideal:

- Two or three lands that can make {R}{W}{B} by turn 3. Prefer untapped sources ([[02 Cards/Lands/Command Tower|Command Tower]], pain lands, shocks — [[02 Cards/Lands/Sacred Foundry|Sacred Foundry]] / [[02 Cards/Lands/Godless Shrine|Godless Shrine]] / [[02 Cards/Lands/Blood Crypt|Blood Crypt]], checklands) over a pile of Temples.
- A two-drop that does something before Zurgo: [[02 Cards/Creatures/Viscera Seer|Viscera Seer]], [[02 Cards/Creatures/Loyal Apprentice|Loyal Apprentice]], [[02 Cards/Creatures/Elas il-Kor, Sadistic Pilgrim|Elas]], [[02 Cards/Enchantments/Impact Tremors|Impact Tremors]], [[02 Cards/Artifacts/Skullclamp|Skullclamp]] / [[02 Cards/Artifacts/Sol Ring|Sol Ring]] / [[02 Cards/Artifacts/Arcane Signet|Arcane Signet]].

**Mulligan** hands with no red+white+black by three, or five-plus-mana piles with no early play and no Zurgo protection.

**Turn 3:** Zurgo, attack if the coast is clear. The first Mobilize token is already a card at end of turn.

**Turn 4+:** add a second engine (Adeline, Hero, Garna, Bastion, Clamp) and keep attacking. Do not sit back to “develop” unless Zurgo would die for free.

---

## Combat every turn

Once Zurgo is down, the default is **attack every turn**.

- Temporary Mobilize tokens still count. They draw, they ping [[02 Cards/Enchantments/Impact Tremors|Impact Tremors]] on the way in, they drain [[02 Cards/Enchantments/Bastion of Remembrance|Bastion]] on the way out.
- Send tokens into bad blocks on purpose if they were dying at end of turn anyway.
- [[02 Cards/Creatures/Adeline, Resplendent Cathar|Adeline]] does not have to attack. Swing with Zurgo; she still makes a Human per opponent.
- [[02 Cards/Creatures/Hero of Bladehold|Hero of Bladehold]] must attack. Same for Mobilize bodies ([[02 Cards/Creatures/Dalkovan Packbeasts|Dalkovan Packbeasts]], [[02 Cards/Creatures/Bone-Cairn Butcher|Bone-Cairn Butcher]]).

**Extra combat** ([[02 Cards/Creatures/Aurelia, the Warleader|Aurelia]], [[02 Cards/Enchantments/All-Out Assault|All-Out Assault]]) is the biggest multiplier in the 100. Cast them when Zurgo and at least one other attack engine are already on board.

---

## Token loop sequencing

Order of operations on a typical attack turn:

1. Declare attackers (Zurgo plus whatever else can swing).
2. Mobilize / Adeline / Hero / Legion Warboss / Caesar / Packbeasts / Anim Pakal / Ascendancy tokens enter → Impact Tremors, Elas lifegain, Goldnight pump, Belladonna ladder.
3. Combat damage.
4. End step: Mobilize tokens are sacrificed → Zurgo draws (they were attacking), Garna draws, Bastion / Boggart drain.

**Skullclamp** on a 1-toughness token in combat or after: Clamp draws two, Zurgo still sees the leave, Garna sees the death if it was attacking.

**Sac outlets** ([[02 Cards/Creatures/Viscera Seer|Viscera Seer]], [[02 Cards/Creatures/Yahenni, Undying Partisan|Yahenni]], [[02 Cards/Creatures/Aron, Benalia's Ruin|Aron]], [[02 Cards/Creatures/Caesar, Legion's Emperor|Caesar]]): crack a leftover token before a wipe, convert a non-attacking token into Zurgo drain + Bastion, or pay Caesar's attack trigger.

---

## What to cast when

| Priority | Role | Examples |
|----------|------|----------|
| 1 | Commander + protection | [[02 Cards/Creatures/Zurgo Stormrender\|Zurgo]], [[02 Cards/Artifacts/Lightning Greaves\|Greaves]] |
| 2 | Cheap payoffs | [[02 Cards/Enchantments/Impact Tremors\|Impact Tremors]], [[02 Cards/Artifacts/Skullclamp\|Skullclamp]], [[02 Cards/Creatures/Elas il-Kor, Sadistic Pilgrim\|Elas]] |
| 3 | Attack engines | [[02 Cards/Creatures/Adeline, Resplendent Cathar\|Adeline]], [[02 Cards/Creatures/Hero of Bladehold\|Hero]], [[02 Cards/Creatures/Legion Warboss\|Legion Warboss]], [[02 Cards/Creatures/Caesar, Legion's Emperor\|Caesar]], [[02 Cards/Creatures/Dalkovan Packbeasts\|Packbeasts]], [[02 Cards/Creatures/Anim Pakal, Thousandth Moon\|Anim Pakal]], [[02 Cards/Enchantments/Mardu Ascendancy\|Mardu Ascendancy]] |
| 4 | Death engines | [[02 Cards/Enchantments/Bastion of Remembrance\|Bastion]], [[02 Cards/Creatures/Garna, Bloodfist of Keld\|Garna]], [[02 Cards/Creatures/Teysa Karlov\|Teysa]] |
| 5 | Multipliers / closers | [[02 Cards/Creatures/Isshin, Two Heavens as One\|Isshin]], [[02 Cards/Enchantments/Windcrag Siege\|Windcrag Siege]], [[02 Cards/Creatures/Aurelia, the Warleader\|Aurelia]], [[02 Cards/Enchantments/Divine Visitation\|Divine Visitation]], [[02 Cards/Enchantments/All-Out Assault\|All-Out Assault]] |

Do not tap out into Aurelia or Divine Visitation if Zurgo is already dead and the board is empty.

---

## Interaction

Point removal at the thing that **stops the attack** (tax, pillowfort, a sweeper on the stack if you can), not at random value.

- [[02 Cards/Instants/Swords to Plowshares|Swords to Plowshares]] / [[02 Cards/Instants/Mortify|Mortify]] / [[02 Cards/Instants/Abrade|Abrade]] — keep Zurgo's attack live.
- [[02 Cards/Instants/Grand Crescendo|Grand Crescendo]] — tokens plus indestructible through a wipe.
- [[02 Cards/Sorceries/Hour of Reckoning|Hour of Reckoning]] — one-sided if you are token-heavy. Convoke it after combat.
- [[02 Cards/Lands/Bojuka Bog|Bojuka Bog]] — grave hate on ETB; not a reason to miss colours.

---

## Doublers

**In the 100 now**

- [[02 Cards/Creatures/Isshin, Two Heavens as One|Isshin]] and [[02 Cards/Enchantments/Windcrag Siege|Windcrag Siege]] (Mardu mode) double attack-caused triggers. Stack them: each trigger happens three times. That includes [[02 Cards/Enchantments/Mardu Ascendancy|Mardu Ascendancy]] (one Goblin per nontoken attacker, doubled).
- [[02 Cards/Creatures/Teysa Karlov|Teysa]] doubles **dies** triggers. Mobilize end-step sacrifice **is** a death → Zurgo draws twice per token. Exile/bounce → Zurgo once only.
- [[02 Cards/Creatures/Redoubled Stormsinger|Redoubled Stormsinger]] copies tokens that entered this turn when it attacks.
- [[02 Cards/Creatures/Aurelia, the Warleader|Aurelia]] / [[02 Cards/Enchantments/All-Out Assault|All-Out Assault]] — extra combat, not a trigger doubler.
- [[02 Cards/Planeswalkers/Kaya, Geist Hunter|Kaya]] −2 doubles the *number* of tokens created this turn.

---

## Matchup sleeve — Kambal vs token decks

[[02 Cards/Creatures/Kambal, Profiteering Mayor|Kambal, Profiteering Mayor]] stays in a sleeve on the [[01 Deck/Sideboard|Sideboard]]. He is **not** in the default 100 (Combined 74). Bring him in when an opponent’s main plan is making tokens.

**Example:** Mark’s Spirit deck makes tokens as cards leave the graveyard to exile. That is one event with a pile of Spirits. Kambal copies each of them, tapped, once that turn. The copies cannot block the turn they enter. They untap on your turn, so they are equivalent blockers by the time those Spirits can attack — unless the tokens have haste or entered attacking. Flying Spirits copy as flying Spirits.

The copies are *your* tokens: [[02 Cards/Enchantments/Impact Tremors|Impact Tremors]] / [[02 Cards/Creatures/Elas il-Kor, Sadistic Pilgrim|Elas]] / [[02 Cards/Enchantments/Divine Visitation|Divine Visitation]] all see them. The grouped drain on *your* token ETBs is extra, not the reason to sleeve him.

**What to take out (ranked)**

1. **Default:** [[02 Cards/Creatures/Sandskitter Outrider|Sandskitter Outrider]] (76). Creature for creature. Four-mana filler with no unique job against their tokens. Least you give up.
2. **If the table is token-heavy enough that a nontoken wipe does nothing to them:** [[02 Cards/Sorceries/Hour of Reckoning|Hour of Reckoning]] (82). Hour of Reckoning *leaves* Spirit tokens and can also eat your own nontoken engines. Keep it in if another player is a creature-heavy nontoken deck.
3. **If the game will be over before seven mana matters:** [[02 Cards/Creatures/Myr Battlesphere|Myr Battlesphere]] (83). You want the three-mana hate bear, not a late wad of Myr, once they are already flooding.

**Do not sleeve out:** Impact Tremors, Elas, Bastion, Goldnight, Divine Visitation, Greaves, attack engines, Path of Ancestry, Mardu Ascendancy.

This is a pre-game swap, not a committed cut. After playtesting the matchup, a standing 100 change can be named later.

---

## Common mistakes

- Not attacking with Zurgo “to stay safe.” The deck does not function if Mobilize never happens.
- Clamping Zurgo. The −1 toughness is a real way to lose the game.
- Resolving [[02 Cards/Enchantments/Divine Visitation|Divine Visitation]] and then trying to Skullclamp 1/1s. They are 4/4 Angels (5/3 with Clamp).
- Flooding the opener with tapped lands and missing the turn-3 commander.
- Holding Hour of Reckoning until you have no tokens. It is a one-sided wipe *because* of the tokens.

---

## Related Pages

- [[02 Cards/Creatures/Zurgo Stormrender|Zurgo Stormrender]]
- [[06 Strategy/Win Conditions|Win Conditions]]
- [[06 Strategy/Playtest Notes|Playtest Notes]]
- [[01 Deck/Current Deck|Current Deck]]
- [[01 Deck/Sideboard|Sideboard]]
