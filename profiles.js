// =====================================================================
// GROUP MEMBER PROFILES
// =====================================================================
// Ten fake group members. The BIOS ARE IDENTICAL in the Democratic and
// Republican versions - only the avatar differs. That is deliberate: it
// holds every word of content constant across conditions, so the partisan
// manipulation is carried entirely by the party badge and nothing else can
// confound it. Do not add partisan wording to one set without adding a
// matched cue to the other.
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
        "text": "I'm a 19 year old dude from Wisconsin (commence making fun of my accent). I love music. Besides music I like learning languages, psychology, drawing, and writing.",
        "likes": [22000, 61000, 118000, 152000],
        "dislikes": [9999999]
      },
      // index 1 - COMPENSATING MEMBER, likes overwritten by the code
      {
        "avatar": "avatars/dem.png",
        "username": "Sarah",
        "text": "Let me introduce myself. I'm Sarah, married, and mother of two wonderful (grown up) children. My career has been a bit weird. Starting off as a graduate historian, I switched to an entirely different discipline: vocational rehabilitation counselor trying to help young people with disabilities to get a job. I've just retired and started spending more time on my hobbies, such as singing, reading, and playing volleyball.",
        "likes": [12000, 14000, 15000, 35000],
        "dislikes": [58000]
      },
      {
        "avatar": "avatars/dem.png",
        "username": "Dan",
        "text": "Hi there, I'm 57 years old, married, with two kids. I've been a computer programmer for about 30 years, but don't worry: I don't have the dusty haircut, oversized buttoned shirt and nerdie big frame glasses. Looking forward to working with you all.",
        "likes": [30000, 74000, 129000],
        "dislikes": [82000]
      },
      {
        "avatar": "avatars/dem.png",
        "username": "Anca",
        "text": "I am a Computer Science student, interested in Natural Language processing. Also a lover of loose leaf tea and a Semantic Web enthusiast. I'm curious about what this task is about.",
        "likes": [26000, 88000, 141000, 166000],
        "dislikes": [9999999]
      },
      {
        "avatar": "avatars/dem.png",
        "username": "Niki",
        "text": "My life revolves around rock climbing. I started climbing when I was 12 (turning 19 soon) and usually climb 4-5 hours a day. Climbing never bores me, because each time is different - the routes, the weather, my strength and endurance. It's great!",
        "likes": [19000, 47000, 96000, 134000, 158000],
        "dislikes": [9999999]
      },
      {
        "avatar": "avatars/dem.png",
        "username": "Mary",
        "text": "My name is Mary and I am 49 years old. I have a husband and 2 grown sons. Our sons attended international schools and I found work at those schools as well. Besides roaming around the world, I like playing games. Board games, cards, black jack or poker, mah jong, or silly games on Facebook, jig saws, basically anything.",
        "likes": [38000, 92000, 147000],
        "dislikes": [71000, 126000]
      },
      {
        "avatar": "avatars/dem.png",
        "username": "Lauren",
        "text": "I'm Lauren, I love to hang out with friends and go shopping. Just doing some online studies here!",
        "likes": [65000, 121000],
        "dislikes": [44000, 139000]
      },
      {
        "avatar": "avatars/dem.png",
        "username": "Kim",
        "text": "Just now I'm finishing up my first year of a difficult college classes. I also work at a cosmetics counter as a part-time thing and earn some money online in my free time. I have a lot planned for my future, and it's really exciting. I want to grow up and be a doctor with a family of lots of little dogs. It'll be fantastic.",
        "likes": [24000, 69000, 108000, 155000],
        "dislikes": [9999999]
      },
      {
        "avatar": "avatars/dem.png",
        "username": "Jane",
        "text": "Dear all, my name is Jane and I have an important interview coming up soon. This is all I can think about these days. I hope you're doing well.",
        "likes": [51000, 103000, 144000],
        "dislikes": [99000]
      },
      {
        "avatar": "avatars/dem.png",
        "username": "Heather",
        "text": "Hey, guys. I'm 19, Korean American. I consider myself pretty nice, though not a total angel. I just like being friendly to people I meet. In my spare time, I like making all kinds of friends, having conversations about whatever, looking at paintings, using makeup, reading, singing (show choir representtt!), making jewelry, and eating delicious food. Enjoy your day, stay out of trouble. ❤️",
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
        "text": "I'm a 19 year old dude from Wisconsin (commence making fun of my accent). I love music. Besides music I like learning languages, psychology, drawing, and writing.",
        "likes": [22000, 61000, 118000, 152000],
        "dislikes": [9999999]
      },
      // index 1 - COMPENSATING MEMBER, likes overwritten by the code
      {
        "avatar": "avatars/rep.png",
        "username": "Sarah",
        "text": "Let me introduce myself. I'm Sarah, married, and mother of two wonderful (grown up) children. My career has been a bit weird. Starting off as a graduate historian, I switched to an entirely different discipline: vocational rehabilitation counselor trying to help young people with disabilities to get a job. I've just retired and started spending more time on my hobbies, such as singing, reading, and playing volleyball.",
        "likes": [12000, 14000, 15000, 35000],
        "dislikes": [58000]
      },
      {
        "avatar": "avatars/rep.png",
        "username": "Dan",
        "text": "Hi there, I'm 57 years old, married, with two kids. I've been a computer programmer for about 30 years, but don't worry: I don't have the dusty haircut, oversized buttoned shirt and nerdie big frame glasses. Looking forward to working with you all.",
        "likes": [30000, 74000, 129000],
        "dislikes": [82000]
      },
      {
        "avatar": "avatars/rep.png",
        "username": "Anca",
        "text": "I am a Computer Science student, interested in Natural Language processing. Also a lover of loose leaf tea and a Semantic Web enthusiast. I'm curious about what this task is about.",
        "likes": [26000, 88000, 141000, 166000],
        "dislikes": [9999999]
      },
      {
        "avatar": "avatars/rep.png",
        "username": "Niki",
        "text": "My life revolves around rock climbing. I started climbing when I was 12 (turning 19 soon) and usually climb 4-5 hours a day. Climbing never bores me, because each time is different - the routes, the weather, my strength and endurance. It's great!",
        "likes": [19000, 47000, 96000, 134000, 158000],
        "dislikes": [9999999]
      },
      {
        "avatar": "avatars/rep.png",
        "username": "Mary",
        "text": "My name is Mary and I am 49 years old. I have a husband and 2 grown sons. Our sons attended international schools and I found work at those schools as well. Besides roaming around the world, I like playing games. Board games, cards, black jack or poker, mah jong, or silly games on Facebook, jig saws, basically anything.",
        "likes": [38000, 92000, 147000],
        "dislikes": [71000, 126000]
      },
      {
        "avatar": "avatars/rep.png",
        "username": "Lauren",
        "text": "I'm Lauren, I love to hang out with friends and go shopping. Just doing some online studies here!",
        "likes": [65000, 121000],
        "dislikes": [44000, 139000]
      },
      {
        "avatar": "avatars/rep.png",
        "username": "Kim",
        "text": "Just now I'm finishing up my first year of a difficult college classes. I also work at a cosmetics counter as a part-time thing and earn some money online in my free time. I have a lot planned for my future, and it's really exciting. I want to grow up and be a doctor with a family of lots of little dogs. It'll be fantastic.",
        "likes": [24000, 69000, 108000, 155000],
        "dislikes": [9999999]
      },
      {
        "avatar": "avatars/rep.png",
        "username": "Jane",
        "text": "Dear all, my name is Jane and I have an important interview coming up soon. This is all I can think about these days. I hope you're doing well.",
        "likes": [51000, 103000, 144000],
        "dislikes": [99000]
      },
      {
        "avatar": "avatars/rep.png",
        "username": "Heather",
        "text": "Hey, guys. I'm 19, Korean American. I consider myself pretty nice, though not a total angel. I just like being friendly to people I meet. In my spare time, I like making all kinds of friends, having conversations about whatever, looking at paintings, using makeup, reading, singing (show choir representtt!), making jewelry, and eating delicious food. Enjoy your day, stay out of trouble. ❤️",
        "likes": [17000, 43000, 86000, 124000, 161000],
        "dislikes": [9999999]
      }
    ]
  }

};
