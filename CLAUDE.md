# CLAUDE.md

## What this is

A modified version of the Ostracism Online paradigm (Wolf et al., 2015) used as
the manipulation in a psychology experiment on partisan inclusion vs. rejection.
It is a static website: no server, no build step, no framework. It is hosted on
GitHub Pages and embedded in a Qualtrics survey via an iframe.

Real participants will run through this. Bugs here do not produce error
messages — they produce quietly invalid data that is not discovered until
analysis. Prefer being conservative over being clever.

## Files

| File | Purpose |
|---|---|
| `index.html` | All screens and all participant-facing text; two Mustache templates at the bottom |
| `main.js` | All logic. Editable parameters are in `set_settings()` at the top, in numbered sections |
| `profiles.js` | The five fake group members, in a Democratic and a Republican version. Despite the original's `.json` name this is JavaScript |
| `style.css` | Appearance. Dislike-button styles are in a marked block at the bottom |
| `shortcut.js` | Vendored keyboard library, untouched from the original |
| `avatars/` | Exactly two images: `dem.png` (donkey on blue) and `rep.png` (elephant on red), 250x250 RGBA with transparent corners. One badge per party, used by the participant and all five group members alike |
| `SETUP.md` | Qualtrics integration, randomization, test checklist. Keep in sync with code changes |

## Design invariants — do not change these without being asked

1. **Condition 1 = rejected, condition 2 = included.** No third condition
   exists. An out-of-range `c` parameter falls back to 1 rather than erroring.

1b. **The design is 2 (condition) x 2 (in-group / out-group), nested within
   participant party — eight cells.** `gp` accepts `in`/`out` (relative to the
   participant, which is what Qualtrics sends) or `dem`/`rep` (absolute).
   `window.grouptype` is derived from it and must keep being exported, because
   the analysis keys on it. Reactions must always come from the party named by
   `gp`: `likes_by_*` and `dislikes_by_*` are selected by `groupparty`, never by
   the participant's own party. Do not change that wiring.

2. **Total reactions to the participant's post are held constant at 6.**
   Rejected = 1 like + 5 dislikes. Included = 6 likes + 0 dislikes. Only the
   valence differs. If you touch `condition_*_likes` or `condition_*_dislikes`,
   recount both totals and say so explicitly in your reply.

3. **Total likes visible on screen are held constant across conditions** via the
   compensating group member at index 1 of `profiles.js`. Participant 1 + peer 9
   = participant 6 + peer 4 = 10. Moving that member out of position 1 breaks
   `adjust_to_condition()`.

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

6. **Every name in `likes_by_*` and `dislikes_by_*` must be a `username` present
   in the corresponding profile set.** A reaction from someone not on screen
   gives away the deception.

7. **All external resources must load over `https://`.** Qualtrics is https and
   browsers block mixed content, which silently blanks the whole study.

8. **Do not "fix" `9999999` timepoints.** They are deliberate padding for
   "this reaction never happens" and must stay above `settings.tasklength`.

## Data contract with Qualtrics

`finish()` in `main.js` sends a `postMessage` payload to the parent Qualtrics
page. The listener in Qualtrics reads specific key names. If you add, rename, or
remove a payload key, you must also update the JavaScript snippet in `SETUP.md`
and tell me which embedded fields I need to add in the Qualtrics Survey Flow.
Silent mismatches here mean lost data.

Participant IDs are **strings** (Qualtrics ResponseIDs look like
`R_1a2B3c4D5e6F7g8`). Never reintroduce `parseInt` on the `p` parameter.

## How to test a change

Serve locally and open all four cells:

```bash
python3 -m http.server 8000
```

```
http://localhost:8000/index.html?c=1&party=dem&gp=rep&p=TEST_DR
http://localhost:8000/index.html?c=2&party=dem&gp=rep&p=TEST_DI
http://localhost:8000/index.html?c=1&party=rep&gp=dem&p=TEST_RR
http://localhost:8000/index.html?c=2&party=rep&gp=dem&p=TEST_RI
```

To avoid waiting three minutes per pass, temporarily lower
`settings.tasklength` — and always set it back to `180000` before committing.

Check: no console errors, no broken images, reaction counts match the design
table, Like and Dislike lock together, buttons fit inside the 240px post box.

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
