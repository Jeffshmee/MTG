---
title: Scoring
---

# Scoring

How the next 100 is scored. The ranked list is [[01 - Commander Ranking]]. Collection rebuild does not touch `09 Deck Ideas/`.

## Contents

- [[#Existing 100s]]
- [[#How a commander is scored]]
- [[#Pool and filters]]
- [[#What owned means]]
- [[#Variety]]
- [[#EDHREC]]
- [[#Next box]]
- [[#Finish cost]]
- [[#Kykar earmarked]]
- [[#Earmarked commander]]
- [[#After you pick one]]

---

## Existing 100s

Variety is scored against these three. Same identity or same plan is a penalty, not an automatic exclude.

| Deck | Commander | Identity | Plan |
|------|-----------|----------|------|
| Maralen | [**`mtg:Maralen, Fae Ascendant`**](https://edhrec.com/commanders/maralen-fae-ascendant) | Sultai (U B G) | Elf / Faerie mill-steal |
| Zurgo | [**`mtg:Zurgo Stormrender`**](https://edhrec.com/commanders/zurgo-stormrender) | Mardu (R W B) | Go-wide tokens / Mobilize |
| Kykar | [**`mtg:Kykar, Zephyr Awakener`**](https://edhrec.com/commanders/kykar-zephyr-awakener) | Azorius (W U) | Blink / bounce |

Kykar is being finished. Ordered Kykar singles are **earmarked** and do not count as free for a fourth 100.

---

## How a commander is scored

One Combined number, five parts. Raw columns stay on the table so you can ignore the blend.

| Part | Weight | What it measures |
|------|--------|------------------|
| **Collection fit** | **30** | Share of that commander’s EDHREC **99** you can sleeve from **unused** cards (land slots; basics as copies) |
| **Variety** | **30** | New identity and a new plan vs the three 100s above |
| **EDHREC rank** | **20** | How established the commander is (All bracket, deck count, log scale) |
| **Next box** | **10** | Missing synergy cards clustered in a Play Booster set you barely have |
| **Finish cost** | **10** | GBP to buy the missing synergy cards (cheaper is better) |

`Combined = (0.30 × Fit) + (0.30 × Variety) + (0.20 × EDHREC) + (0.10 × Box) + (0.10 × Cheap)`

Each part is 0–100 before weighting.

---

## Pool and filters

**In the pool**

- Legendary **creature** you own (a spare if the only copy is already in a 100)
- Legal commander
- [**`mtg:Bard, King of Dale`**](https://scryfall.com/card/ltr/192/bard-king-of-dale) is **earmarked** — always scored, even if Azorius overlap with Kykar looks bad on variety

**Out of the pool**

- Maralen, Zurgo, Kykar as “new” commanders
- Tokens, legendary lands, backgrounds-only
- Commanders you do not own (no “buy the general, then 80 cards”)

---

## What owned means

A name counts as available if **all** of these are true:

1. It is in the collection (Box, a sideboard, or a spare copy)
2. Colour identity is legal for that commander
3. It is **not** the last copy in Maralen, Zurgo, or Kykar
4. It is **not** on the Kykar ordered list (those are already spoken for)

Lands count the same as spells. Duals, basics, and rocks are just cards in the 99.

**Ideal 99** for Fit = EDHREC High Synergy + Average Deck + land slots (about 36). Basics count as copies (`Plains` ×8), not one name. Named lands that do not fit remaining slots are dropped.

**Fit score** = % of those 99 slots you can sleeve from the unused pool.

**Unused homes (display only, not a fifth weight):** how many unused, identity-legal names in the Box this commander could actually play. That is “give a home to cards I already own,” not only SOS.

---

## Variety

| Situation | Score |
|-----------|-------|
| New identity **and** a plan none of the three 100s do | 90–100 |
| New identity, overlapping plan (another token deck, another blink deck, another Elf deck) | 50–70 |
| Same identity as Maralen, Zurgo, or Kykar | 20–40 |
| Same identity **and** same plan | 0–20 |

Bard is Azorius and doubles tokens — overlap with Kykar (identity) and Zurgo (tokens). He still gets a full row because he is earmarked.

---

## EDHREC

All bracket, number of decks. Log scale. Thin samples (< ~200 decks) stay in the table with a small-sample note; they are not treated as “rank 1.”

---

## Next box

For High Synergy cards you do **not** own, use the latest **Play Booster** printing (not Commander decks, Masters, Secret Lair).

You already have volume in Foundations, Secrets of Strixhaven, Tarkir, The Hobbit, Lorwyn Eclipsed.

Score **up** if three or more missing synergy cards share one Play Booster set you have few names from. That set is the “next box” in the row.

Score **down** (and say so) if the holes are Commander staples a box will not hit.

---

## Finish cost

GBP to buy the missing High Synergy cards, using listed prices (Scryfall / collection GBP). Cheaper finish → higher score. A cheap 60% Fit deck beats a 70% Fit deck that still needs £200 of rares.

---

## Kykar earmarked (do not count as free)

Displacer Kitten, Ephemerate, Aetherize, Ghostly Flicker, Archaeomancer, Peregrine Drake, Deadeye Navigator, Reflector Mage, Panharmonicon, Starfield Vocalist, Wizard's Staff, Snap, Cloudshift, Soulherder, Mulldrifter, Teleportation Circle, Counterspell, Ponder, Hallowed Fountain, Mystic Sanctuary, Loran of the Third Path, Venser, Shaper Savant, Deputy of Detention, Skyclave Apparition, Azorius Signet, Talisman of Progress, Swiftfoot Boots, Time Wipe, Restoration Angel, Floodfarm Verge, Glacial Fortress, Port Town, Prairie Stream, Arcane Signet, **Virtue of Knowledge**.

---

## Earmarked commander

| Commander | Where it sits | Why it is here |
|-----------|---------------|----------------|
| [**`mtg:Bard, King of Dale`**](https://scryfall.com/card/ltr/192/bard-king-of-dale) | Kykar sideboard (owned extra, not in the 80) | You named him. Azorius extra-draw + token doubling. Score him anyway. |

---

## After you pick one

1. Confirm the commander in chat (or scratch).
2. Then, and only then, run `mtg-deck-skill-builder` for a new vault.
3. Do not treat this page as inventory. Binders stay until that commit.

