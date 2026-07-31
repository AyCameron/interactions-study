// =====================================================================
// GROUP MEMBER PROFILES  (partisan version)
// =====================================================================
// This file defines TWO sets of fake group members: one Democratic set
// and one Republican set. Which set a participant sees is decided by the
// "gp" (group party) parameter in the study URL.
//
// Each profile has:
//   avatar   - path to a 250x250 px image. In this version every profile
//              uses the single avatar for its party, so all five entries
//              point at the same file.
//   username - the name shown on the post AND used in the "X liked your
//              post" popups. Must match the names in settings.likes_by_*
//   text     - the self-introduction, written on ONE line (no line breaks)
//   likes    - millisecond timepoints at which this member receives a like
//   dislikes - millisecond timepoints at which this member receives a dislike
//              (use [9999999] for "none" - that timepoint is never reached)
//
// MATCHING RULE: the Democratic and Republican sets should be as similar
// as possible on everything except the partisan cue - same number of
// profiles, similar bio length, similar topics, similar warmth, similar
// apparent age/gender mix. Otherwise you cannot tell whether an effect is
// about party or about the people.
// =====================================================================

window.profiles = {

  // ------------------------- DEMOCRATIC GROUP -------------------------
  "dem": {
    "posts": [
      {
        "avatar": "avatars/dem.png",
        "username": "Georgeee",
        "text": "REPLACE ME. I'm a 19 year old from Wisconsin. I volunteer with a progressive voter registration drive on campus, and outside of that I mostly listen to music, draw, and read way too much psychology.",
        "likes": [45000, 50000, 110000, 150000], // 4
        "dislikes": [55000] // 1
      },
      {
        // NOTE: this is the COMPENSATING member (index 1). Its likes are
        // overwritten by the code to keep the on-screen total constant
        // across conditions. Do not reorder it out of position 1 unless
        // you also change adjust_to_condition() in main.js.
        "avatar": "avatars/dem.png",
        "username": "Sarah",
        "text": "REPLACE ME. I'm Sarah, married with two grown kids. I spent my career helping young people with disabilities find work, and I've knocked doors for Democratic candidates in every election since I was in my twenties.",
        "likes": [12000, 14000, 15000, 35000, 80000], // overwritten by code
        "dislikes": [60000] // 1  (overwritten only if compensate_dislikes is on)
      },
      {
        "avatar": "avatars/dem.png",
        "username": "John",
        "text": "REPLACE ME. Hi all. I work in logistics, I have two dogs, and on weekends I'm usually hiking. Politically I'm a pretty standard liberal Democrat, though I try not to make it my whole personality.",
        "likes": [20000, 60000, 95000, 140000], // 4
        "dislikes": [9999999] // 0
      },
      {
        "avatar": "avatars/dem.png",
        "username": "AncaD",
        "text": "REPLACE ME. Grad student, coffee enthusiast, terrible at cooking. I got into local politics through a campaign internship and now I can't stop reading about city budgets. Nice to meet everyone.",
        "likes": [30000, 70000, 120000], // 3
        "dislikes": [75000, 125000] // 2
      },
      {
        "avatar": "avatars/dem.png",
        "username": "Arjen",
        "text": "REPLACE ME. I teach high school and coach soccer. I grew up in a union family and that shaped a lot of how I see things. Outside of work I play guitar badly and garden slightly better.",
        "likes": [25000, 85000, 130000, 160000], // 4
        "dislikes": [9999999] // 0
      }
    ]
  },

  // ------------------------- REPUBLICAN GROUP -------------------------
  "rep": {
    "posts": [
      {
        "avatar": "avatars/rep.png",
        "username": "Georgeee",
        "text": "REPLACE ME. I'm a 19 year old from Wisconsin. I volunteer with the College Republicans on campus, and outside of that I mostly listen to music, draw, and read way too much psychology.",
        "likes": [45000, 50000, 110000, 150000], // 4
        "dislikes": [55000] // 1
      },
      {
        // COMPENSATING member - keep at index 1 (see note above)
        "avatar": "avatars/rep.png",
        "username": "Sarah",
        "text": "REPLACE ME. I'm Sarah, married with two grown kids. I spent my career helping young people with disabilities find work, and I've volunteered for Republican candidates in every election since I was in my twenties.",
        "likes": [12000, 14000, 15000, 35000, 80000], // overwritten by code
        "dislikes": [60000] // 1  (overwritten only if compensate_dislikes is on)
      },
      {
        "avatar": "avatars/rep.png",
        "username": "John",
        "text": "REPLACE ME. Hi all. I work in logistics, I have two dogs, and on weekends I'm usually hiking. Politically I'm a pretty standard conservative Republican, though I try not to make it my whole personality.",
        "likes": [20000, 60000, 95000, 140000], // 4
        "dislikes": [9999999] // 0
      },
      {
        "avatar": "avatars/rep.png",
        "username": "AncaD",
        "text": "REPLACE ME. Grad student, coffee enthusiast, terrible at cooking. I got into local politics through a campaign internship and now I can't stop reading about city budgets. Nice to meet everyone.",
        "likes": [30000, 70000, 120000], // 3
        "dislikes": [75000, 125000] // 2
      },
      {
        "avatar": "avatars/rep.png",
        "username": "Arjen",
        "text": "REPLACE ME. I teach high school and coach soccer. I grew up in a small business family and that shaped a lot of how I see things. Outside of work I play guitar badly and garden slightly better.",
        "likes": [25000, 85000, 130000, 160000], // 4
        "dislikes": [9999999] // 0
      }
    ]
  }

};
