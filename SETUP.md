# Partisan Ostracism Online — Setup Guide

A modified version of the Ostracism Online paradigm (Wolf, Levordashka, Ruff,
Kraaijeveld, Lueckmann & Williams, 2015) for a study of partisan inclusion vs.
rejection, integrated with Qualtrics.

**Condition 1 is rejection, not ostracism.** A dislike button has been added,
and rejected participants receive active dislikes rather than simply being
ignored. See §2b for what that changes about your design and your claims.

**⚠ UNRESOLVED: poster information-source (in-group vs. out-group) is built
as between-subjects, but the main study's preregistered hypotheses specify
it as within-subject.** This lives entirely in Qualtrics (the `poster`
Embedded Data field set alongside `cond`/`rejector`/`affil`/`source` in the
randomizer Groups — see §5) — the paradigm itself never receives or uses a
poster variable, so nothing here in `main.js` is affected either way. Do not
build or change anything based on this until it's confirmed with whoever
owns the preregistration; a within-subject redesign would mean each
participant sees both in-group- and out-group-posted stimuli rather than
being assigned to just one, which changes the Loop & Merge / randomizer
structure in Survey Flow, not just a value somewhere.

---

## 1. What changed from the original

### Features added

| Change | Where |
|---|---|
| Two conditions only: 1 = rejected, 2 = included | `main.js` |
| **Dislike button added**; rejection = receiving dislikes, not just few likes | `index.html`, `main.js` §4b |
| Records dislikes given as well as likes given | `main.js` `init_task()` |
| One reaction per post (like *or* dislike), switchable | `main.js` §4b |
| Participant's avatar pool depends on their party (`&party=dem` / `&party=rep`) | `main.js` §1 |
| Group members' party set by `&rejector=dem` / `&rejector=rep`; defaults to out-party | `main.js`, `profiles.js` |
| Participant ID now accepts **text**, so Qualtrics ResponseIDs work | `main.js` `get_params()` |
| Records how many likes the participant gave, to whom, and when | `main.js` `init_task()` |
| Returns data to Qualtrics via iframe `postMessage`, with URL redirect fallback | `main.js` `finish()` |
| Group members shown in random order | `main.js` `init_task()` |

### Bugs fixed from the published code

These are real defects in `smpo/socialmedia` as it stands today. Worth knowing
about even if you decide not to use these files, because two of them silently
corrupt data rather than producing a visible error.

1. **The inclusion condition delivered 5 likes, not 6.** One timepoint was
   written as `1320000` ms — 22 minutes — instead of `132000`. The task ends at
   3 minutes, so that like never arrived. Corrected here; note that published
   studies using the default settings may have run a 5-like inclusion condition.

2. **The profile shuffle never ran.** `reorder()` operated on `$("#others")`,
   an element that does not exist anywhere in `index.html`. Every participant
   therefore saw the group members in the same fixed order. Replaced with an
   array shuffle before rendering.

3. **The avatar grid was off by one.** The loop ran from `0`, generating
   `avatar_0.png` through `avatar_9.png`, while the shipped folder contains
   `avatar_1.png` through `avatar_10.png`. The first tile was a broken image
   and the last avatar was unreachable. Now uses explicit filename lists.

4. **All libraries loaded over `http://`.** Qualtrics runs on `https`. A
   browser will refuse to load `http` scripts inside an `https` page, so jQuery,
   Mustache, Masonry and alertify would all fail and the paradigm would show a
   blank screen. **This alone would have broken the study.** All changed to
   `https://`.

5. **`profiles.json` is not JSON.** Despite the extension it is JavaScript
   (`window.others = {...}`, with comments and a trailing comma) loaded through
   a `<script>` tag. Some servers send a `nosniff` header that makes browsers
   refuse to execute a `.json` file as script. Renamed to `profiles.js`.

6. **The avatar screen told participants their choice would not be recorded.**
   It now is recorded, so that sentence was removed. Make sure your consent form
   and IRB protocol match whatever the screen says.

---

## 2. Decide this before you build anything

**Whose party is the group?** The code supports three designs; you have to pick
one and it changes your cell structure:

- **Out-party group** (Democrat participant faces Republicans). Set `rejector` to
  the opposite of `party`, or just leave `rejector` out and let the default
  handle it. Design: 2 (condition) × 2 (participant party) = 4 cells.
- **In-party group.** Set `rejector` equal to `party`. Same 4 cells.
- **Group party manipulated.** Randomize `rejector` too. 8 cells, and you need
  roughly twice the sample.

**This build is set up for the third option**, crossing condition with in-group
vs out-group. That is what lets you separate "rejection hurts" from "rejection by
out-partisans hurts *more*" - the interaction, not either main effect, is the
finding. See §5 for the randomization and §2c for what to watch.

---

## 2b. How the rejection manipulation works

The dislike button changes the construct being manipulated, so it is worth being
precise about what the two conditions now do.

|  | Likes received | Dislikes received | Total reactions |
|---|---|---|---|
| **Rejected** (`c=1`) | 0 | 5 | 5 |
| **Included** (`c=2`) | 5 | 0 | 5 |

Total reactions are held constant at five - one from every member of the
5-person team that reacts to you (CLAUDE.md invariant 3b) - and only their
**valence** flips: a pure mirror, not a mixed count. That is deliberate: it
means both groups receive the same amount of attention, so a difference
between conditions reflects being evaluated negatively rather than being
noticed more or less. The original paradigm could not separate those two
things, because being ostracised there meant receiving fewer reactions
overall. This also matches Lutz & Schneider (2021)'s actual Rejected
condition more precisely than an earlier version of this build did - see
CLAUDE.md invariant 2 for the scaling logic (5 is a proportion of group size,
not the original paper's 6, which was a proportion of an 11-person pool).

Group members' own reaction counts on their own posts (visible in the
background, not sent to you) stay identical across conditions regardless of
which team reacted to you - see the `likes`/`dislikes` arrays in
`profiles.js` - so the only thing that varies between a rejected and an
included participant is how the group treats *them specifically*.

**One design choice you may want to revisit.** `settings.compensate_dislikes` is
**off** by default. Turning it on would give one group member 5 dislikes in the
included condition, mirroring the participant's 5 in the rejected condition, to
hold the total dislikes on screen constant. The cost is that included
participants would then watch a peer get savaged while they got nothing but
likes — a strong downward social comparison that can lift self-esteem on its own
and confound your inclusion condition. I would leave it off and report the
uncompensated totals, but the arrays are there if you disagree.

**What to call it in the paper.** With the dislike button this is rejection.
Without it, it was ostracism. Lutz and Schneider (2021) show these are separable
experiences with partly different consequences, so the label matters. If you want
both, add a third condition using the original ostracism timings (proportionally
scaled to this project's 5-person reacting team, roughly 1 like, 0 dislikes)
alongside rejection (0 likes, 5 dislikes) and inclusion (5 likes, 0 dislikes) —
the code supports it with one more `case` in `adjust_to_condition()`.

**Ethics.** Participants can now dislike the people they meet, and rejected
participants experience explicit disapproval rather than mere silence. That is a
stronger manipulation than the published version, and your IRB submission and
debriefing should describe it as such. Say plainly in the debrief that no real
person disliked anything they wrote.

---

## 2c. Two things the in-group / out-group crossing exposes

**The two profile sets are now compared directly.** When group party was held
constant, a difference in quality between the Democratic and Republican bios
affected every participant equally and mostly added noise. Now it lands squarely
on the comparison you care about: if the Republican profiles happen to be warmer
or better written, out-group rejection will look milder for Democrats for a
reason that has nothing to do with party. Matching the two sets on length,
topic, warmth and writing quality is no longer good practice, it is load-bearing.

**RESOLVED: the roster used to be an 8/3 majority/minority mix, which
confounded the manipulation.** In an out-group cell, the participant's badge
matched the 3-person minority instead of standing alone; in an in-group cell,
they blended into an 8-person majority. That meant "out-group" wasn't just
"rejected by the other party" - it was also "the only visually different
badge in a smaller subgroup," a confound layered on top of the manipulation
you actually care about. **Fixed**: the roster is now a flat 5 Democrat / 5
Republican split in *every* condition (`settings.TEAM_A`/`TEAM_B` in
`main.js` §8), counterbalanced across sessions by the `roster`/`rst` URL
parameter (§5a below) so no bio is permanently tied to one party. `rejector`
now only changes *which team reacts* to the participant, never what the room
looks like - see `CLAUDE.md` invariant 3b. If you're reading this while
deciding how to build the roster for the first time, this is why: don't
reintroduce a composition difference between in-group and out-group cells.

---

## 3. Put the files online

1. Create a free GitHub account.
2. Create a new **public** repository. Give it a bland name — participants can
   read your source code, and a URL containing "ostracism" or "rejection" gives
   the deception away. Something like `group-intro-task` is fine.
3. Upload every file from this folder (**Add file → Upload files**, then drag
   the whole folder in).
4. **Settings → Pages** → Source: *Deploy from a branch*, Branch: `main`,
   folder `/ (root)`. Save.
5. After a minute your study is live at
   `https://YOURNAME.github.io/group-intro-task/`.

To edit a file later: click it, click the pencil icon, edit, **Commit changes**.
Changes go live in about a minute; hard-refresh (Ctrl/Cmd+Shift+R) if you don't
see them, since GitHub Pages caches aggressively.

---

## 4. Add your avatars and profiles

**Participant avatars** → `avatars/`. 250×250 px PNG. The placeholder files
`dem_a1.png`–`dem_a8.png` and `rep_a1.png`–`rep_a8.png` are identical dummies;
replace them, or use your own filenames and list those in `main.js` §1. Keep the
two lists the same length.

**Group member avatars** → `avatars/others/`. Same size. Replace
`dem_1.png`–`dem_5.png` and `rep_1.png`–`rep_5.png`.

**Group member bios** → `profiles.js`. Every bio currently starts with
"REPLACE ME". Write on a single line, no line breaks.

Three things that will otherwise cause trouble:

- Filenames are **case sensitive**. `.PNG` and `.png` are different files.
- Every name in `settings.TEAM_A` / `TEAM_B` (`main.js` §8) must match a
  `username` in `profiles.js` exactly - these are what `likes_by`/`dislikes_by`
  get computed from at runtime (CLAUDE.md invariant 6). A like from someone
  who isn't in the group is an obvious tell.
- The **second** profile in each list is the compensating member whose likes are
  overwritten to keep the on-screen total constant across conditions. Don't move
  it out of that position without also editing `adjust_to_condition()`.

### 4b. Read this before you finalise the avatars

With one shared avatar per party, the image is carrying the entire manipulation,
and two consequences follow.

**The two images must be matched on everything except party.** Same illustration
style, same complexity, same colour saturation, same visual appeal. If one is
better drawn or simply more likeable, you have confounded party with
attractiveness and there is no way to separate them afterwards.

The supplied pair is well matched on style, format and saturation. The one
measured difference: the elephant fills about 29% of its disc against the
donkey's 20%, so the Republican badge carries slightly more visual weight. This
is a property of the standard party logos rather than a design error, and the
symbols are recognisable enough that redrawing them to match would cost more in
authenticity than it buys in balance. Worth a sentence in the limitations
section; not worth fixing.

**Five identical avatars is the cover story's weak point** - though party logos
handle this far better than faces would. Nobody expects five people to share a
photograph, but five people all displaying the same party badge is exactly what
a party badge is for. You still need to tell participants that is what they are
looking at. Two ways to handle it, in order of preference:

1. **Name it in the instructions.** Tell participants up front that profiles
   display a party badge rather than a personal photo - for example, "to protect
   privacy, profiles show only the political party each person identifies with."
   Uniformity then becomes expected rather than suspicious. This is the cheapest
   fix and I would do it regardless of what else you choose.

2. **Split the badge from the avatar.** Give each of the five group members a
   distinct neutral avatar and display the party marker as a separate badge or
   text label next to the username. This keeps the group looking like five
   individuals while making party unmistakable, and it removes the
   attractiveness confound entirely because the avatars can be counterbalanced.
   It is a moderate change to `index.html` and `profiles.js`.

Pilot whichever you choose: show people the task screen and ask what they
noticed, before you ask anything about party. If "everyone had the same picture"
comes up unprompted, fix it before collecting data.

**On making the party cue work:** an avatar alone is a weak signal. The bios
should carry an unambiguous partisan cue, and the Democratic and Republican sets
should be matched on everything else — bio length, topics, warmth, apparent age
and gender mix. Pilot the profiles on their own and confirm that people classify
them correctly *and* rate them equally likeable within party, or you won't know
whether an effect is about party or about the people you happened to write.

---

## 5. Qualtrics: random assignment, balanced by party

Do the randomization in Qualtrics, not in the paradigm. The paradigm is a static
page with no memory of previous participants, so it cannot balance anything.

The design is **2 (rejected / included) x 2 (in-group / out-group)**, nested
within participant party, giving eight cells in total:

| Participant | Group | Condition | Cell |
|---|---|---|---|
| Democrat | Democrats | rejected | rejected by in-group |
| Democrat | Democrats | included | included by in-group |
| Democrat | Republicans | rejected | rejected by out-group |
| Democrat | Republicans | included | included by out-group |
| Republican | Republicans | rejected | rejected by in-group |
| ... | | | ...and the same four for Republicans |

Assuming your earlier questions produce an embedded field `party` with values
`dem` / `rep`, build this in **Survey Flow**:

```
Embedded Data: party    = (blank)      <- set by your earlier questions
Embedded Data: cond     = (blank)
Embedded Data: rejector = (blank)
Embedded Data: OO_condition, OO_party, OO_rejectorparty, OO_rejectortype,
               OO_username, OO_avatar, OO_bio, OO_likesgiven, OO_likedwho,
               OO_likedwhen, OO_dislikesgiven, OO_dislikedwho,
               OO_dislikedwhen, OO_finished   <- all blank

  [ your consent + pre-measures + party questions ]

Branch If: party = dem
   └─ Randomizer  [Evenly Present Elements - present 1 of 4]
        ├─ Group A: cond = 1  AND  rejector = in     (rejected by in-group)
        ├─ Group B: cond = 2  AND  rejector = in     (included by in-group)
        ├─ Group C: cond = 1  AND  rejector = out    (rejected by out-group)
        └─ Group D: cond = 2  AND  rejector = out    (included by out-group)

Branch If: party = rep
   └─ Randomizer  [Evenly Present Elements - present 1 of 4]
        ├─ Group A: cond = 1  AND  rejector = in
        ├─ Group B: cond = 2  AND  rejector = in
        ├─ Group C: cond = 1  AND  rejector = out
        └─ Group D: cond = 2  AND  rejector = out

  [ the paradigm page ]
  [ needs-threat scale, then everything else ]
```

Each of the four elements inside a randomizer is a **Group** containing two
Embedded Data blocks, one setting `cond` and one setting `rejector`. Setting
both inside a single element is what guarantees the four cells are balanced.

Do not use two nested randomizers (one for `cond`, one for `rejector`). Two
independent evenly-present randomizers balance each factor's margins but do not
guarantee balanced cells, and cell balance is what you need for a 2x2.

Two separate branches is the stratification by party: each randomizer balances
only within its own branch, so Democrats and Republicans are each split evenly
across the four cells.

**Note the `rejector = in` / `rejector = out` values.** They are relative to
the participant, so Qualtrics never needs to know which party the person is
when assigning - the paradigm resolves `in` and `out` into an actual party
itself. You can still pass `rejector = dem` or `rejector = rep` if you would
rather set it absolutely.

Practical notes:

- "Evenly Present Elements" balances **assignments**, not completions. Rejected
  participants drop out more. Over-recruit by roughly 15%.
- Eight cells is a lot. Powering the condition x rejectorType interaction, which
  is the comparison this design exists to make, needs substantially more than
  powering the main effect of condition. Run the power analysis on the
  interaction before you set a recruitment target.
- The counter accumulates across previews and test responses. Do all testing on a
  **copy** of the survey, then activate the clean original.
- Declaring every embedded field at the top with a blank default is what makes
  them appear in your export even for people who quit partway.
- You need an explicit rule for independents and "prefer not to say", applied
  *before* the randomizer. Otherwise they reach the paradigm with no `cond` or
  `rejector` value and everyone silently defaults to rejected-by-out-group.

---

## 5a. Obscuring the URL for the new-tab method

**Only needed if you're using §6's "new tab" method.** The iframe method never
shows its URL to the participant, so it has no need for this - it keeps using
plain `party`/`rejector` (main.js accepts both forms; see CLAUDE.md invariant 9).

Declare two more Embedded Data fields at the very top of your flow, alongside
`party`, `cond` and `rejector`:

```
Embedded Data: affil  = (blank)
Embedded Data: source = (blank)
```

Then, immediately **after** the randomizer block from §5 (so `party` and
`rejector` are already set) and **before** the paradigm question from §6,
add four Branches - one Group per branch, each containing a single Embedded
Data element:

```
Branch If: party = dem
   └─ Embedded Data: affil = a

Branch If: party = rep
   └─ Embedded Data: affil = b

Branch If: rejector = in
   └─ Embedded Data: source = in

Branch If: rejector = out
   └─ Embedded Data: source = out
```

These four branches are siblings, all at the same level (not nested in each
other or in the §5 randomizer) - each just translates a value that's already
set into its obscured equivalent. `source` only ever copies `in`/`out`
straight across; only `affil` actually changes the letters (dem→a, rep→b).

Then use `affil`/`source` (not `party`/`rejector`) in the new-tab link's
`href` in §6 - that's the whole point of this step.

## 5b. Counterbalancing the paradigm roster (`roster`/`rst`)

**Needed for every delivery method**, unlike §5a. This isn't a URL-obscuring
step - `roster` decides which of the two fixed 5-person teams
(`settings.TEAM_A`/`TEAM_B` in `main.js` §8) shows the dem badge vs. the rep
badge, so it has to be set before the paradigm loads regardless of iframe or
new-tab. It follows the same plain/obscured pattern as §5a purely for
consistency (`CLAUDE.md` invariant 9), not because the value itself is
sensitive - `1`/`2` doesn't reveal anything on its own.

Declare two more Embedded Data fields at the top of your flow:

```
Embedded Data: roster = (blank)
Embedded Data: rst    = (blank)
```

Add a plain 1-of-2 randomizer anywhere before the paradigm question - it
doesn't depend on `party` or `rejector`, so it doesn't need to sit inside
the §5 branches or after them, just somewhere before §6:

```
Randomizer [Evenly Present Elements - present 1 of 2]
   ├─ Group 1: Embedded Data: roster = 1  AND  Embedded Data: rst = 1
   └─ Group 2: Embedded Data: roster = 2  AND  Embedded Data: rst = 2
```

Use `roster` in the iframe method and for direct/local testing, `rst` in the
new-tab link's `href` - same rule as `affil`/`source`.

---

## 6. Qualtrics: embedding the paradigm

The recommended approach keeps the participant inside the survey the whole time,
so there is one response row and no risk of a broken return trip.

**Step 1.** Create a Text/Graphic question on its own page. Click **HTML View**
and paste:

```html
<iframe id="ooframe"
  src="https://YOURNAME.github.io/group-intro-task/index.html?c=${e://Field/cond}&party=${e://Field/party}&rejector=${e://Field/rejector}&roster=${e://Field/roster}&p=${e://Field/ResponseID}"
  width="100%" height="900" style="border:0;"
  scrolling="yes"></iframe>
```

**Step 2.** In the same question, open the **JavaScript** editor and paste:

```javascript
Qualtrics.SurveyEngine.addOnload(function () {
    var qthis = this;
    qthis.hideNextButton();

    window.addEventListener('message', function (e) {
        // only accept messages from your own study page
        if (e.origin !== 'https://YOURNAME.github.io') { return; }
        if (!e.data || e.data.oo !== true) { return; }

        Qualtrics.SurveyEngine.setEmbeddedData('OO_condition',  e.data.condition);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_party',      e.data.party);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_rejectorparty', e.data.rejectorParty);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_rejectortype',  e.data.rejectorType);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_roster',     e.data.roster);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_username',   e.data.username);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_avatar',     e.data.avatar);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_bio',        e.data.description);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_likesgiven', e.data.likesGiven);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_likedwho',   e.data.likedWho);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_likedwhen',  e.data.likedWhen);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_dislikesgiven', e.data.dislikesGiven);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_dislikedwho',   e.data.dislikedWho);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_dislikedwhen',  e.data.dislikedWhen);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_finished',   e.data.finishedAt);

        qthis.clickNextButton();
    });
});
```

**Step 3.** In `main.js` §2, set `settings.parentOrigin` to your Qualtrics
domain exactly as it appears in the address bar, e.g.
`https://yourschool.qualtrics.com`. If the data isn't arriving during testing,
temporarily set it to `'*'` to confirm the origin is the problem, then put the
real value back.

**Step 4.** Put nothing else on that page and turn off the progress bar for it
if you can — a progress bar undercuts the illusion of a live interaction.

### Fallback: two surveys

If the iframe fights you, split into Survey 1 → paradigm → Survey 2. Link
Survey 1's end-of-survey redirect to:

```
https://YOURNAME.github.io/group-intro-task/index.html?c=${e://Field/cond}&party=${e://Field/party}&rejector=${e://Field/rejector}&roster=${e://Field/roster}&p=${e://Field/ResponseID}&redirect=<URL-encoded Survey 2 link>
```

Do not drop `rejector` from this URL - without it the paradigm falls back to
its default (out-group), silently breaking the in-group cells of your design.
Don't drop `roster` either - without it the paradigm falls back to its
default (`1`), which means every response in the fallback run would share the
same counterbalancing direction instead of the 50/50 split §5b sets up.

In Survey 2, declare `p`, `c`, `party`, `rejector`, `roster`, `rejectorType`,
`av`, `u`, `lg`, `lw`, `dg`, `dw` as embedded fields at the top of the flow —
Qualtrics captures matching URL parameters
automatically. Merge the two exports on `p` afterward. The free-text bio is
deliberately not sent this way; long text plus URL encoding can exceed browser
URL limits and truncate silently.

### Alternative: new tab (single survey, no merge)

Keeps everything in one survey and one response row, without the two-survey
`p`-merge - the original Qualtrics tab stays open the whole time, and the
paradigm opens in a second tab that hands data back via `postMessage` the
same way the iframe method does.

**Step 1.** Add a Text/Graphic question on its own page. This must be
entered via the **HTML view** (the `</>` / Source Code toolbar button) -
pasting a raw `<a>` tag into the normal rich-text editor just shows the
literal tag text on screen instead of a working link.

```html
<a id="oolink" href="https://YOURNAME.github.io/group-intro-task/index.html?c=${e://Field/cond}&affil=${e://Field/affil}&source=${e://Field/source}&rst=${e://Field/rst}&p=${e://Field/ResponseID}" target="_blank" rel="opener">Click here to begin the social network task</a>
```

This link uses `affil`/`source`/`rst` rather than `party`/`rejector`/`roster`.
Unlike the iframe method, this URL sits in the participant's address bar the
whole time the second tab is open, so it uses the obscured parameter
names/values (`affil`: `a`=dem, `b`=rep; `source`: unchanged `in`/`out`;
`rst`: unchanged `1`/`2`) instead of the plain readable ones - see CLAUDE.md
invariant 9 for why, and its limits. This means Survey Flow needs two more
Embedded Data fields, `affil` and `source`, derived from your existing
`party`/`rejector` fields right before this question (see §5a below); `rst`
itself is already declared and set by §5b's randomizer, nothing extra needed
for it here. Don't paste the plain `party=${e://Field/party}
&rejector=${e://Field/rejector}&roster=${e://Field/roster}` form into this
particular link - that's what this whole obscuring step exists to avoid.

**`rel="opener"` is required, not optional.** Modern Chrome (and most current
browsers) silently treat any `target="_blank"` link as if `rel="noopener"`
were set, unless `rel="opener"` explicitly overrides that default - so
without it, `window.opener` in the new tab is `null` from the start and no
data ever comes back, with no error anywhere to point at why. This is exactly
what happened during initial testing of this method: the link worked, the tab
opened, the task completed, and still nothing arrived, until `rel="opener"`
was added. Do not add `rel="noopener"` or `rel="noreferrer"` either, and if
your organization's Qualtrics theme or a browser extension force-adds one of
those, this method will silently stop delivering data again.

**Step 2.** Same question, **JavaScript** editor. Next stays hidden until
the participant actually clicks the link, at which point a fallback timer
starts. If the paradigm's data arrives before the timer runs out, Next is
clicked automatically and the timer is cancelled. If it doesn't - because
`window.opener` failed to survive the round trip, or the participant closed
the tab without finishing - Next reappears so nobody gets stranded, though
`OO_*` fields will be blank for that response. Without this, Next would
either be visible from the start (letting participants skip the task
entirely by clicking it immediately) or hidden forever if delivery ever
fails.

`600000` (10 minutes) is a starting point for the fallback delay - it needs
to comfortably exceed how long your intro screens plus the 3-minute task
actually take end to end. Time your own piloting and adjust.

```javascript
Qualtrics.SurveyEngine.addOnload(function () {
    var qthis = this;
    var fallbackTimer = null;
    var received = false;

    // Belt-and-suspenders: force rel="opener" at runtime even if the
    // question's saved HTML ever gets resaved with rel="noopener" instead
    // (this has happened - see the rel="opener" note above).
    document.getElementById('oolink').setAttribute('rel', 'opener');

    qthis.hideNextButton();

    // Start the fallback only once the participant actually clicks through,
    // not from page load - they may sit on this page a while first.
    //
    // Plain document.getElementById + addEventListener, NOT jQuery's
    // $(qthis.questionContainer).find(...) - that throws "$(...).find is
    // not a function" in Qualtrics's JS execution context. Because it
    // throws, everything after it in this function silently never runs,
    // including the window.addEventListener('message', ...) block below -
    // so the Qualtrics tab never listens for the paradigm's data at all.
    // This has already cost a full debugging session once; do not
    // reintroduce jQuery here.
    document.getElementById('oolink').addEventListener('click', function () {
        fallbackTimer = setTimeout(function () {
            if (!received) { qthis.showNextButton(); }
        }, 600000); // adjust based on your piloting - see note above
    });

    window.addEventListener('message', function (e) {
        if (e.origin !== 'https://YOURNAME.github.io') { return; }
        if (!e.data || e.data.oo !== true) { return; }

        received = true;
        if (fallbackTimer) { clearTimeout(fallbackTimer); }

        Qualtrics.SurveyEngine.setEmbeddedData('OO_condition',  e.data.condition);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_party',      e.data.party);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_rejectorparty', e.data.rejectorParty);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_rejectortype',  e.data.rejectorType);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_roster',     e.data.roster);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_username',   e.data.username);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_avatar',     e.data.avatar);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_bio',        e.data.description);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_likesgiven', e.data.likesGiven);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_likedwho',   e.data.likedWho);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_likedwhen',  e.data.likedWhen);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_dislikesgiven', e.data.dislikesGiven);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_dislikedwho',   e.data.dislikedWho);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_dislikedwhen',  e.data.dislikedWhen);
        Qualtrics.SurveyEngine.setEmbeddedData('OO_finished',   e.data.finishedAt);

        qthis.clickNextButton();
    });
});
```

**Step 3.** `settings.parentOrigin` in `main.js` is unchanged - it's used the
same way whether the message comes from an iframe's parent or a tab's
opener.

**Step 4.** The paradigm shows its own "you can close this tab" message once
the task finishes (participant-facing text in `index.html`, `#final-msg-newtab`)
- you don't need to add return instructions in the Qualtrics question text
itself, though telling participants up front what to expect ("this will open
in a new tab; when you're done there, close it and come back here") is worth
adding to this question's own text before the link.

**Trade-off vs. the two-survey fallback:** one response row instead of a
merge-on-`p` step, but data delivery depends on `window.opener` surviving
the round trip rather than a URL parameter, which is a slightly less robust
mechanism. Test this thoroughly (§7) before trusting it for real data
collection.

---

## 7. Test before you launch

Open each of these eight links directly and click all the way through. The
`rejector=in` / `rejector=out` form is what Qualtrics will actually send.

```
?c=1&party=dem&rejector=out&roster=1&p=TEST_D_REJ_OUT     rejected by Republicans
?c=2&party=dem&rejector=out&roster=1&p=TEST_D_INC_OUT     included by Republicans
?c=1&party=dem&rejector=in&roster=1&p=TEST_D_REJ_IN       rejected by fellow Democrats
?c=2&party=dem&rejector=in&roster=1&p=TEST_D_INC_IN       included by fellow Democrats
?c=1&party=rep&rejector=out&roster=2&p=TEST_R_REJ_OUT     rejected by Democrats
?c=2&party=rep&rejector=out&roster=2&p=TEST_R_INC_OUT     included by Democrats
?c=1&party=rep&rejector=in&roster=2&p=TEST_R_REJ_IN       rejected by fellow Republicans
?c=2&party=rep&rejector=in&roster=2&p=TEST_R_INC_IN       included by fellow Republicans
```

(Prefix each with `https://YOURNAME.github.io/group-intro-task/index.html`.)
`roster` isn't part of the manipulated design (CLAUDE.md invariant 3b), so it
doesn't need its own set of cells - the eight above just alternate `1`/`2` so
you've seen both counterbalancing directions at least once each.

For each one, confirm:

- [ ] The participant is assigned the correct party's avatar (or shown it for confirmation, if you turned the screen back on)
- [ ] Your own post displays your chosen avatar, not a broken image
- [ ] Of the 10 group members, exactly 5 show the Democratic avatar and 5 show
      the Republican avatar (`settings.TEAM_A`/`TEAM_B` in `main.js` §8) -
      never a different split, regardless of `c`, `rejector`, or `roster`
- [ ] Which 5 show which party flips between `roster=1` and `roster=2` -
      compare a `roster=1` load against a `roster=2` load and confirm the two
      teams have swapped badges
- [ ] Every reaction popup names someone from the same 5-person team, and that
      team is the in-group team when `rejector=in`, the out-group team when
      `rejector=out` (invariant 3b) - never a mix of both teams in one session
- [ ] You count the likes you receive: 0 in condition 1, 5 in condition 2
- [ ] You count the dislikes you receive: 5 in condition 1, 0 in condition 2
- [ ] Dislike popups appear in red, like popups in green
- [ ] Clicking Like disables the Dislike button on that post, and vice versa
- [ ] Both buttons fit inside the post box without overlapping the counters
- [ ] The total likes across all posts is the same in both conditions
- [ ] Every popup name corresponds to a profile visible on screen
- [ ] The persistent reaction feed (next to the timer) fills in alongside each
      toast and keeps every entry for the rest of the task, never clearing
- [ ] Press F12 → Console shows no red errors, Network shows no failed loads
- [ ] The profile order differs between two loads of the same link

Then take the full survey ten times as a test respondent and confirm the export
has roughly five per cell and that `OO_condition` equals `cond` on every row. If
those two ever disagree, your data linkage is broken.

---

## 8. Things worth deciding now rather than at n = 300

**Mobile.** This was built for desktop in 2014. A 900px iframe on a phone is
unusable and the Masonry columns collapse badly. Either make it responsive or
screen to desktop only and enforce it — Qualtrics captures a user-agent field
you can branch on.

**Nothing is stored until the participant finishes.** Anyone who closes the tab
at minute two leaves no paradigm data at all. Using the iframe method you at
least keep their Qualtrics partial response with condition and party attached,
which is enough to report attrition by condition — and you should report it,
since differential dropout is the standard threat to ostracism findings.

**Put the needs-threat measure first.** Ostracism effects on belonging,
self-esteem, control and meaningful existence are immediate and decay fast. The
manipulation check and needs measure go on the very next page — no demographics,
no attention checks in between. The standard instrument is van Beest & Williams
(2006), which is what the original validation used.

**Deception handling.** Your IRB will want consent permitting incomplete
disclosure, a funnel suspicion probe (open-ended first, before you cue anything),
an explicit debriefing stating that the other participants were scripted and the
likes were preprogrammed, and a mood-repair step. Partisan rejection adds a
wrinkle: some participants will otherwise leave believing real out-partisans
rejected them. Address that directly in the debrief.

**Lock your exclusion rules in advance.** "Excluded participants who guessed the
deception" is a very flexible decision after you've seen the data. Write the
criteria down, ideally in a preregistration, before collection starts.

**The reactions participants give are a free dependent variable.** With a
dislike button available, `OO_likesgiven`, `OO_dislikesgiven`, `OO_likedwho` and
`OO_dislikedwho` give you a behavioural measure of partisan animosity: whether
Democrats dislike Republican profiles at a higher rate than they'd dislike
Democratic ones, and whether being rejected increases that. In a partisan design
that's often as interesting as the need-threat outcome, and it comes for free.
Note that it is also partly a *consequence* of the manipulation, so treat it as
an outcome rather than a covariate.

---

## Citation

Wolf, W., Levordashka, A., Ruff, J. R., Kraaijeveld, S., Lueckmann, J.-M., &
Williams, K. D. (2015). Ostracism Online: A social media ostracism paradigm.
*Behavior Research Methods, 47*, 361–373. https://doi.org/10.3758/s13428-014-0475-x
