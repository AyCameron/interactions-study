# Change request — align the paradigm with the study script

Paste this into Claude Code if you are updating an existing copy of the project
rather than taking the new files wholesale. Work through it one numbered item at
a time and commit after each. Do not bundle them.

---

## 1. Eleven group members instead of five

`profiles.js` now contains eleven profiles per party, using the bios from the
study script. Usernames in file order:

`George, Sarah, Dan, Anca, Niki, Mary, Lauren, Kim, Jane, Heather, Arjen`

**Sarah must stay at index 1.** She is the compensating member whose likes are
overwritten by `adjust_to_condition()` to hold the on-screen total constant.

The bios are **identical across the Democratic and Republican sets** — only the
avatar differs. Do not add partisan wording to one set without adding a matched
cue to the other.

## 2. Party is now asked inside the paradigm

The avatar screen asks "Which do you identify as? Democrat / Republican", then
shows the assigned badge with the anonymity explanation.

- The participant's own answer sets `window.party` and drives the avatar and the
  in-group / out-group resolution.
- The `party` value passed in from Qualtrics is kept separately as
  `window.party_survey` and is no longer used for logic.
- `set_party()` is the single place where party, avatar, group party, group type,
  profile loading and condition application all happen. Anything that depends on
  party must be called from there, not at startup.
- Three variables are exported: `partySelfReport`, `partySurvey`, and
  `partyMatch` (1 if the two agree, 0 if they disagree or one is missing).

`settings.ask_party = false` restores the old behaviour of taking party silently
from the URL.

## 3. Introduction minimum raised to 240 characters

`settings.min_chars = 240`, `settings.max_chars = 400`. The counter below the
text box now counts up toward the requirement rather than down from 400.

## 4. Closing message before the Continue button

A `#final-msg` block appears with the timer at 00:00, reading "Thank you for your
participation in this social network. You will now return to Qualtrics to finish
the remaining portion of the study."

## 5. All on-screen text replaced

Welcome, avatar, introduction, group-introduction and task screens now match the
study script word for word, including the Research Assistant line and the
Facebook / X / Threads / Reddit references.

## 6. Reaction name lists updated

`likes_by_*` and `dislikes_by_*` now draw from the eleven usernames above. If you
rename any profile you must update both lists, or participants receive reactions
from people who are not on screen.

---

## Verify after merging

```
node --check main.js && node --check profiles.js
```

Then serve locally and open all eight cells. Confirm:

- eleven profiles render, none truncated, no stray quote marks
- the party question appears, and choosing an option reveals the matching badge
- the introduction box refuses fewer than 240 characters
- reaction counts match: rejected = 1 like + 5 dislikes, included = 6 likes + 0
- the closing message appears with the Continue button at 00:00
- every reaction popup names one of the eleven people on screen
