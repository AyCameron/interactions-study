# CLAUDE.md

## What this is

A modified version of the Ostracism Online paradigm (Wolf et al., 2015) used as
the manipulation in a psychology experiment on partisan inclusion vs. rejection.
It is a static website: no server, no build step, no framework. It is hosted on
GitHub Pages and embedded in a Qualtrics survey via an iframe.

Real participants will run through this. Bugs here do not produce error
messages — they produce quietly invalid data that is not discovered until
analysis. Prefer being conservative over being clever.

**The `poster` variable (in-group vs. out-group source of the post-paradigm
misinformation stimuli) is Qualtrics-only** — it's an Embedded Data field set
in Survey Flow alongside `cond`/`rejector`/`affil`/`source`, and `main.js`
never reads or receives it. Whether it should ultimately be within-subject
(matching the main study's preregistration) or between-subject (how it's
currently built) is unresolved — see the warning at the top of `SETUP.md`.
Since this code never touches `poster`, no change here is needed either way,
but don't assume the current between-subjects Qualtrics build is settled.

## Files

| File | Purpose |
|---|---|
| `index.html` | All screens and all participant-facing text; two Mustache templates at the bottom |
| `main.js` | All logic. Editable parameters are in `set_settings()` at the top, in numbered sections |
| `profiles.js` | The ten fake group members, in a Democratic and a Republican version (identical bios, only the avatar differs). Despite the original's `.json` name this is JavaScript |
| `style.css` | Appearance. Dislike-button styles are in a marked block at the bottom |
| `shortcut.js` | Vendored keyboard library, untouched from the original |
| `avatars/` | Exactly two images: `dem.png` (donkey on blue) and `rep.png` (elephant on red), 250x250 RGBA with transparent corners. One badge per party, used by the participant and the group members — always a fixed 5 dem/5 rep split, counterbalanced across sessions by `roster` (invariant 3b) |
| `SETUP.md` | Qualtrics integration, randomization, test checklist. Keep in sync with code changes |
| `CHANGE_REQUEST.md` | A historical record of a prior change request (11-member roster, in-paradigm party self-report, etc.) that has already been applied. Not something to re-apply |

## Design invariants — do not change these without being asked

1. **Condition 1 = rejected, condition 2 = included.** No third condition
   exists. An out-of-range `c` parameter falls back to 1 rather than erroring.

1b. **The design is 2 (condition) x 2 (in-group / out-group), nested within
   participant party — eight cells.** `roster` (invariant 3b) is a separate
   counterbalancing factor, not a manipulated cell - it changes which specific
   people are on screen, never the manipulation itself. `rejector` accepts
   `in`/`out` (relative to the participant, which is what Qualtrics sends) or
   `dem`/`rep` (absolute). `window.rejectorType` is derived from it and must
   keep being exported, because the analysis keys on it. `window.rejectorParty`
   is the party of the team that reacts to the participant (see 3b) — ALL of
   the participant's reactions come from it now, not most.

2. **Total reactions to the participant's post are held constant at 5, a pure
   valence mirror.** Rejected = 0 likes + 5 dislikes. Included = 5 likes + 0
   dislikes. Nothing mixed, unlike the earlier 1-like/5-dislike design this
   replaced - see SETUP.md for why 5, not the original paper's 6 (it's a
   proportion of group size, not a universal constant, and 5 is that
   proportion scaled to this project's 5-person reacting team, invariant 3b).
   If you touch `condition_*_likes` or `condition_*_dislikes`, recount both
   totals and say so explicitly in your reply.

3. **Total likes visible on screen are held constant across conditions** via the
   compensating group member at canonical position 1 (Sarah). Participant 0 +
   peer 9 = participant 5 + peer 4 = 9. Moving her out of position 1 breaks
   `adjust_to_condition()`.

3b. **The roster is a fixed 5 Democrat / 5 Republican split in EVERY condition,
   never varying with `rejector`.** This replaced an earlier 8 majority/3
   minority design after testing found that letting roster composition change
   with `rejector` confounded the interaction-source manipulation: an
   out-group cell wasn't just changing who reacted to the participant, it was
   also changing how many people in the room visually matched them (see
   SETUP.md §2c). `settings.TEAM_A`/`TEAM_B` (§8 in `main.js`) are two fixed
   5-person halves of the 10-person roster; `window.roster` (`1`/`2`, from
   `get_params()`, obscured alias `rst` per invariant 9's pattern)
   counterbalances which team shows the dem badge vs the rep badge across
   participants, so no single bio is permanently tied to one party across the
   study. `rejector` (in/out) now controls **which team reacts** to the
   participant — `resolve_reactors()` computes `settings.likes_by`/
   `dislikes_by` from this at runtime, not from static arrays, and it must run
   after `window.party`/`window.roster`/`window.rejectorType` are all known
   (called from `set_party()`, right after `load_profiles()`). All 5 of the
   participant's reactions come from the same team, every condition. Sarah's
   team membership doesn't matter to her compensating-member role (invariant
   3) — do not reintroduce a majority/minority distinction as a side effect
   of unrelated work.

4. **`settings.compensate_dislikes` is deliberately `false`.** Turning it on
   introduces a downward-comparison confound in the inclusion condition. Do not
   flip it as part of unrelated work.

5. **The Democratic and Republican profile sets must stay matched** on bio
   length, topics, warmth, and apparent age/gender mix. The only intended
   difference is the partisan cue.

5b. **There is one avatar per party, shared by everyone on screen.** It is a
   party badge, not a profile picture. `dem.png` and `rep.png` must be matched
   on style, complexity, colour saturation and visual appeal - if one is more
   attractive or better drawn than the other, party is confounded with
   likeability. Do not reintroduce per-person avatars without being asked.

6. **Every name in `likes_by` and `dislikes_by` must be a `username` present in
   `profiles.js`.** (These are no longer split by party — every username exists
   identically in both the dem and rep lists, so one list now covers both; see
   3b for `TEAM_A`/`TEAM_B`, which is what `likes_by`/`dislikes_by` are computed
   from at runtime.) A reaction from someone not on screen gives away the
   deception.

7. **All external resources must load over `https://`.** Qualtrics is https and
   browsers block mixed content, which silently blanks the whole study.

8. **Do not "fix" `9999999` timepoints.** They are deliberate padding for
   "this reaction never happens" and must stay above `settings.tasklength`.

9. **`get_params()` accepts two names for party and for rejector: the plain
   readable one (`party`=dem/rep, `rejector`=in/out/dem/rep) and an obscured
   alias (`affil`=a/b, `source`=in/out/a/b) - whichever is present wins,
   `affil`/`source` take priority if both are.** The obscured pair exists
   specifically for the new-tab method's visible link, since that URL sits
   in the participant's address bar the whole time, unlike the iframe method
   where it's never shown. Use `party`/`rejector` for the iframe method and
   for direct/local testing (more readable); use `affil`/`source` only in
   the new-tab link's `href`. `affil`/`source` only defend against a
   participant glancing at the address bar, not one who reads the public
   repo's source (which still says `party`/`rejectorParty`/`REJECTED` etc.
   throughout `main.js` and its comments) - don't oversell what this buys
   you. Never let `dem`/`rep` reach the URL as a literal value under the
   `affil` key (only `a`/`b`), or it defeats the point. Keep `affil`/`source`
   disconnected from "party"/"democrat"/"republican" in spelling and don't
   rename them to anything more mnemonic later without re-reading this. The
   same plain/obscured pattern applies to `roster`/`rst` (invariant 3b).

## Data contract with Qualtrics

`finish()` in `main.js` sends the same `postMessage` payload to whichever
Qualtrics page is listening — the parent page if embedded in an iframe, or
the tab that opened this one if using the "new tab" method (SETUP.md §6).
Both listeners read the same key names. If you add, rename, or remove a
payload key, you must update **both** JavaScript snippets in `SETUP.md` and
tell me which embedded fields I need to add in the Qualtrics Survey Flow.
Silent mismatches here mean lost data.

Participant IDs are **strings** (Qualtrics ResponseIDs look like
`R_1a2B3c4D5e6F7g8`). Never reintroduce `parseInt` on the `p` parameter.

## How to test a change

Serve locally (e.g. `python3 -m http.server 8000`) and open all eight cells
from SETUP.md §7. `roster` isn't part of the manipulated design (invariant
3b), so it doesn't need its own set of cells, but test both `1` and `2` at
least once each so you've seen both counterbalancing directions:

```
http://localhost:8000/index.html?c=1&party=dem&rejector=out&roster=1&p=TEST_D_REJ_OUT
http://localhost:8000/index.html?c=2&party=dem&rejector=out&roster=1&p=TEST_D_INC_OUT
http://localhost:8000/index.html?c=1&party=dem&rejector=in&roster=1&p=TEST_D_REJ_IN
http://localhost:8000/index.html?c=2&party=dem&rejector=in&roster=1&p=TEST_D_INC_IN
http://localhost:8000/index.html?c=1&party=rep&rejector=out&roster=2&p=TEST_R_REJ_OUT
http://localhost:8000/index.html?c=2&party=rep&rejector=out&roster=2&p=TEST_R_INC_OUT
http://localhost:8000/index.html?c=1&party=rep&rejector=in&roster=2&p=TEST_R_REJ_IN
http://localhost:8000/index.html?c=2&party=rep&rejector=in&roster=2&p=TEST_R_INC_IN
```

Gotchas specific to this version:

- The URL's `party` value only seeds a provisional value. `settings.ask_party`
  is `true`, so you must actually click the matching Democrat/Republican radio
  on the avatar screen for the cell to reflect what the URL implies. Submit is
  correctly blocked ("Please select an option") until you do.
- The introduction box needs at least `settings.min_chars` (150) characters or
  the description screen will reject it.
- Lowering `settings.tasklength` for faster testing only makes the "final
  continue" button appear sooner — it does **not** speed up reaction delivery.
  `condition_1_dislikes`/`condition_2_likes` fire on their own fixed real-time
  schedule (up to ~150s) regardless of `tasklength`, so you still need to wait
  for those to see the final reaction counts. Always set `tasklength` back to
  `180000` before committing either way.

Check: no console errors, no broken images, the party self-report screen
actually gates progress, reaction counts match the design table (0 likes/5
dislikes rejected, 5 likes/0 dislikes included — invariant 2), all 5
reactions come from the same team every time (invariant 3b), the roster
always shows 5 dem/5 rep regardless of condition, the closing message
appears with the timer at `00:00`, Like and Dislike lock together, buttons
fit inside the 240px post box, and the persistent reaction feed fills in
correctly alongside the toasts.

## Working style for this repo

- Make one change at a time and commit it. Do not bundle refactors with
  behaviour changes.
- Never edit the timing arrays, the condition mapping, or participant-facing
  text as a side effect of another task. Ask first.
- Participant-facing wording changes need to be flagged clearly, because they
  may require an IRB amendment.
- This is a 2014 codebase using jQuery 1.7 and Masonry 2. Do not modernise it,
  do not add a build step, do not introduce a framework. Fidelity to the
  validated original matters more than code quality.
- No analytics, no third-party requests, no telemetry. Participant data leaves
  this page only via the Qualtrics postMessage.
- The repo is public, so participants can read it. Do not write comments,
  filenames, or commit messages that reveal the deception more than the existing
  ones already do. Avoid the words "ostracism" and "rejection" in filenames.

