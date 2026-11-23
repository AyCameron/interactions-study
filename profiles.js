// =====================================================================
// GROUP MEMBER PROFILES
// =====================================================================
// Ten group members. The BIOS ARE IDENTICAL in the Democratic and
// Republican versions - only the avatar differs. That is deliberate: it
// holds every word of content constant across conditions, so the partisan
// manipulation is carried entirely by the party badge and nothing else can
// confound it. Do not add partisan wording to one set without adding a
// matched cue to the other.
//
// The bios are lightly edited, de-identified self-introductions written by
// real earlier participants (five written by Democrats, five by Republicans,
// randomly assigned to the ten names with each team getting a mix of both).
// No bio may name a party, attack the other side, or carry identifying
// detail. Writers' names and IDs are never stored in this file.
//
// The roster is always a fixed 5 Democrat / 5 Republican split in every
// condition - see main.js set_settings() §8 (TEAM_A/TEAM_B) for which five
// names play which team, and how the new `roster`/`rst` URL parameter
// counterbalances which team shows which party's badge across sessions.
//
// Each profile has:
//   avatar   - avatars/dem.png or avatars/rep.png (everyone shares one
//              badge per party)
//   username - shown on the post AND used in the reaction popups. Must
//              match a name in TEAM_A/TEAM_B (main.js) to ever be selected
//              as a reactor - see settings.likes_by/dislikes_by, computed
//              at runtime, not the static arrays this used to be.
//   text     - the self-introduction, on ONE line, no double quotes inside
//   likes    - millisecond timepoints at which this member receives a like
//   dislikes - millisecond timepoints at which this member receives a
//              dislike (use [9999999] for none - never reached)
//
// The member at INDEX 1 (Sarah) is the compensating member. Her likes are
// overwritten by the code to hold the on-screen total constant across
// conditions. Do not move her out of position 1.
// =====================================================================

window.profiles = {

  // DEMOCRATIC GROUP - all ten show the donkey badge
  "dem": {
    "posts": [
      {
        "avatar": "avatars/dem.png",
        "username": "George",
        "text": "When it comes to politics and most policies, I identify this way because of their views on social issues. I still like to keep an open mind when it comes to anything political and try to view all sides of the issues. My family and friends have also had an influence on my stance.",
        "likes": [22000, 61000, 118000, 152000],
        "dislikes": [9999999]
      },
      // index 1 - COMPENSATING MEMBER, likes overwritten by the code
      {
        "avatar": "avatars/dem.png",
        "username": "Sarah",
        "text": "I have a very open minded opinion on politics and try to hear every side. I don't agree with every single view point but I felt I agreed and resonated more with that side when voting.",
        "likes": [12000, 14000, 15000, 35000],
        "dislikes": [58000]
      },
      {
        "avatar": "avatars/dem.png",
        "username": "Dan",
        "text": "My party has a larger focus on the stock market and tax reduction, which are 2 things that I am an advocate for. While choosing to stay closer towards the middle than most people, I do still believe their ideas align much more with the beliefs and values of the Constitution.",
        "likes": [30000, 74000, 129000],
        "dislikes": [82000]
      },
      {
        "avatar": "avatars/dem.png",
        "username": "Anca",
        "text": "As a kid, I didn't really think about it, but as I grew up, I started taking more time to look at politics. I found myself identifying with a lot of traits and beliefs shared across this party. I liked and supported many of their prominent figures, and the policies and ides they believed in.",
        "likes": [26000, 88000, 141000, 166000],
        "dislikes": [9999999]
      },
      {
        "avatar": "avatars/dem.png",
        "username": "Niki",
        "text": "I grew up in a highly populated area with a lot of political ties, which provided me with the opportunity to learn and form my own opinions. I find that there are aspects of both parties that I agree and disagree with, but my preferences and beliefs feel more strongly tied to that of my party.",
        "likes": [19000, 47000, 96000, 134000, 158000],
        "dislikes": [9999999]
      },
      {
        "avatar": "avatars/dem.png",
        "username": "Mary",
        "text": "I like that the party values the people and the Constitution that was written hundreds of years ago as the best way to run this country. I also like the economic stances that party.",
        "likes": [38000, 92000, 147000],
        "dislikes": [71000, 126000]
      },
      {
        "avatar": "avatars/dem.png",
        "username": "Lauren",
        "text": "I decided to join my party because it is the party my family most commonly identify with. They raised me with a mirror of their values, and I believe the majority of the party's stances to be good for the American public.",
        "likes": [65000, 121000],
        "dislikes": [44000, 139000]
      },
      {
        "avatar": "avatars/dem.png",
        "username": "Kim",
        "text": "I think small businesses should be held up and supported through their process. As someone who is very invested in business, I think that being a part of my party, which holds these values, is extremely important to me. Everyone should have the opportunity to fulfill the American Dream.",
        "likes": [24000, 69000, 108000, 155000],
        "dislikes": [9999999]
      },
      {
        "avatar": "avatars/dem.png",
        "username": "Jane",
        "text": "My decision to join came from learning about notable political leaders around the country that have created campaigns surrounding topics such as better education funding and community wellbeing.",
        "likes": [51000, 103000, 144000],
        "dislikes": [99000]
      },
      {
        "avatar": "avatars/dem.png",
        "username": "Heather",
        "text": "My party supports my beliefs not just because I was raised to believe them but because of what I truly believe is right. I side with many of their views on education.",
        "likes": [17000, 43000, 86000, 124000, 161000],
        "dislikes": [9999999]
      }
    ]
  },

  // REPUBLICAN GROUP - identical bios, elephant badge
  "rep": {
    "posts": [
      {
        "avatar": "avatars/rep.png",
        "username": "George",
        "text": "When it comes to politics and most policies, I identify this way because of their views on social issues. I still like to keep an open mind when it comes to anything political and try to view all sides of the issues. My family and friends have also had an influence on my stance.",
        "likes": [22000, 61000, 118000, 152000],
        "dislikes": [9999999]
      },
      // index 1 - COMPENSATING MEMBER, likes overwritten by the code
      {
        "avatar": "avatars/rep.png",
        "username": "Sarah",
        "text": "I have a very open minded opinion on politics and try to hear every side. I don't agree with every single view point but I felt I agreed and resonated more with that side when voting.",
        "likes": [12000, 14000, 15000, 35000],
        "dislikes": [58000]
      },
      {
        "avatar": "avatars/rep.png",
        "username": "Dan",
        "text": "My party has a larger focus on the stock market and tax reduction, which are 2 things that I am an advocate for. While choosing to stay closer towards the middle than most people, I do still believe their ideas align much more with the beliefs and values of the Constitution.",
        "likes": [30000, 74000, 129000],
        "dislikes": [82000]
      },
      {
        "avatar": "avatars/rep.png",
        "username": "Anca",
        "text": "As a kid, I didn't really think about it, but as I grew up, I started taking more time to look at politics. I found myself identifying with a lot of traits and beliefs shared across this party. I liked and supported many of their prominent figures, and the policies and ides they believed in.",
        "likes": [26000, 88000, 141000, 166000],
        "dislikes": [9999999]
      },
      {
        "avatar": "avatars/rep.png",
        "username": "Niki",
        "text": "I grew up in a highly populated area with a lot of political ties, which provided me with the opportunity to learn and form my own opinions. I find that there are aspects of both parties that I agree and disagree with, but my preferences and beliefs feel more strongly tied to that of my party.",
        "likes": [19000, 47000, 96000, 134000, 158000],
        "dislikes": [9999999]
      },
      {
        "avatar": "avatars/rep.png",
        "username": "Mary",
        "text": "I like that the party values the people and the Constitution that was written hundreds of years ago as the best way to run this country. I also like the economic stances that party.",
        "likes": [38000, 92000, 147000],
        "dislikes": [71000, 126000]
      },
      {
        "avatar": "avatars/rep.png",
        "username": "Lauren",
        "text": "I decided to join my party because it is the party my family most commonly identify with. They raised me with a mirror of their values, and I believe the majority of the party's stances to be good for the American public.",
        "likes": [65000, 121000],
        "dislikes": [44000, 139000]
      },
      {
        "avatar": "avatars/rep.png",
        "username": "Kim",
        "text": "I think small businesses should be held up and supported through their process. As someone who is very invested in business, I think that being a part of my party, which holds these values, is extremely important to me. Everyone should have the opportunity to fulfill the American Dream.",
        "likes": [24000, 69000, 108000, 155000],
        "dislikes": [9999999]
      },
      {
        "avatar": "avatars/rep.png",
        "username": "Jane",
        "text": "My decision to join came from learning about notable political leaders around the country that have created campaigns surrounding topics such as better education funding and community wellbeing.",
        "likes": [51000, 103000, 144000],
        "dislikes": [99000]
      },
      {
        "avatar": "avatars/rep.png",
        "username": "Heather",
        "text": "My party supports my beliefs not just because I was raised to believe them but because of what I truly believe is right. I side with many of their views on education.",
        "likes": [17000, 43000, 86000, 124000, 161000],
        "dislikes": [9999999]
      }
    ]
  }

};
