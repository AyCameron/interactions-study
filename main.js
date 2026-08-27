// =====================================================================
// main.js  -  PARTISAN OSTRACISM ONLINE
// Based on Wolf, Levordashka, Ruff, Kraaijeveld, Lueckmann & Williams
// (2015), Behavior Research Methods, 47, 361-373. Original code by
// Jan-Matthis Lueckmann (github.com/smpo/socialmedia).
//
// MODIFIED FOR: 2 conditions (rejected / included), partisan avatars and
// partisan group profiles, string participant IDs, like AND dislike
// behavior logging, and return-to-Qualtrics via iframe postMessage.
//
// Condition 1 is REJECTION, not ostracism: the participant receives active
// dislikes rather than merely being ignored. See section 4b.
//
// EVERYTHING YOU NEED TO EDIT IS IN THE "PARAMETERS" BLOCK BELOW.
// =====================================================================

$(function() {

  // ===================================================================
  // PARAMETERS  -  edit these
  // ===================================================================

  function set_settings() {
    window.settings = {};

    // ---------------------------------------------------------------
    // 1. AVATARS
    // ---------------------------------------------------------------
    // In this version there is ONE avatar per party, used by everybody:
    // the participant and all five group members. It functions as a party
    // badge rather than as a personal profile picture.
    //
    // Put the two files in the avatars/ folder. 250x250 px PNG. Filenames
    // are CASE SENSITIVE (.png and .PNG are different files).

    settings.avatar_dem = 'dem.png';
    settings.avatar_rep = 'rep.png';

    // Ask the participant to state their party inside the paradigm, on the
    // avatar screen, exactly as in the study script. Their answer drives the
    // avatar they are given and the in-group / out-group resolution. The
    // party value passed from Qualtrics is still recorded separately so you
    // can check the two agree.
    settings.ask_party = true;

    // Minimum characters for the self-introduction.
    settings.min_chars = 244;
    settings.max_chars = 400;

    // Because there is nothing to choose between, the avatar selection
    // screen is skipped by default and the participant is simply assigned
    // the avatar for their party.
    //
    // Set this to false to instead show a one-item confirmation screen
    // ("this is how you will appear to the group"), which makes the party
    // cue explicit and gives the participant a moment to absorb it before
    // the task starts. See SETUP.md for the trade-off.
    settings.skip_avatar_selection = true;

    // ---------------------------------------------------------------
    // 2. WHERE THE PARTICIPANT GOES AFTERWARDS
    // ---------------------------------------------------------------
    // ONLY used if the paradigm is NOT running inside a Qualtrics iframe.
    // If you use the iframe method (recommended), leave this alone - the
    // code detects the iframe and sends data to Qualtrics directly.
    // If you use the two-survey method, put your Survey 2 anonymous link
    // here, or pass it in the URL as &redirect=<encoded link>.

    settings.defaultredirect = 'https://YOURUNIVERSITY.qualtrics.com/jfe/form/SV_XXXXXXXX';

    // Security: the page we are allowed to send data to - either the
    // Qualtrics page that has this paradigm in an iframe, or the Qualtrics
    // tab that opened this one via a target="_blank" link (the "new tab"
    // method - see SETUP.md). Set this to YOUR Qualtrics domain, exactly as
    // it appears in the address bar (no trailing slash). Leave as '*' only
    // while testing.
    settings.parentOrigin = 'https://ncsu.qualtrics.com';

    // ---------------------------------------------------------------
    // 3. TASK LENGTH
    // ---------------------------------------------------------------
    // Milliseconds. 180000 = 3 minutes (the validated default).
    settings.tasklength = 180000;

    // ---------------------------------------------------------------
    // 4. NUMBER AND TIMING OF "LIKES" THE PARTICIPANT RECEIVES
    // ---------------------------------------------------------------
    // Each number is the millisecond timepoint at which one like appears.
    // Add or remove timepoints to change how many likes are received.
    // A dummy value of 9999999 pads a one-item list; it is never reached
    // because it is longer than the task.
    //
    // NOTE: the original code had 1320000 (22 minutes) in the inclusion
    // list, which meant the "6 likes" condition actually delivered only 5.
    // It is corrected to 132000 here. Decide deliberately which you want.

    // CONDITION 1 = REJECTED (1 like)
    settings.condition_1_likes = [12000, 9999999];

    // CONDITION 2 = INCLUDED (6 likes)
    settings.condition_2_likes = [10000, 15000, 35000, 80000, 132000, 150000];

    // ---------------------------------------------------------------
    // 4b. NUMBER AND TIMING OF "DISLIKES" THE PARTICIPANT RECEIVES
    // ---------------------------------------------------------------
    // This is what turns condition 1 from OSTRACISM (being ignored) into
    // REJECTION (being actively disapproved of).
    //
    // The defaults hold TOTAL REACTIONS constant at 6 in both conditions
    // and flip only their valence:
    //     rejected  = 1 like  + 5 dislikes
    //     included  = 6 likes + 0 dislikes
    // That means both groups get the same amount of attention, so any
    // difference is about being evaluated negatively rather than about
    // being noticed more or less. Change these only deliberately.

    // CONDITION 1 = REJECTED (5 dislikes)
    settings.condition_1_dislikes = [20000, 45000, 70000, 105000, 140000];

    // CONDITION 2 = INCLUDED (0 dislikes; the dummy timepoint never fires)
    settings.condition_2_dislikes = [9999999];

    // Names that appear in the "X disliked your post" popups. Same rule as
    // likes_by: every name must be a username in profiles.js. All five are
    // majority-role names - see §8. Every name exists identically in both
    // party's profiles.js lists, so there is no dem/rep variant to pick.
    settings.dislikes_by = ['Lauren', 'Arjen', 'Dan', 'Mary', 'Heather'];

    // Can a participant both like AND dislike the same post?
    // true = one reaction per post (clicking either disables both).
    settings.one_reaction_per_post = true;

    // ---------------------------------------------------------------
    // 5. COMPENSATING LIKES FOR ONE GROUP MEMBER
    // ---------------------------------------------------------------
    // So that the TOTAL number of likes visible on screen is the same in
    // both conditions, one group member's likes move in the opposite
    // direction. This member is the one at position 1 (the second entry)
    // in each profile list in profiles.js.
    settings.condition_1_adjusted_likes = [12000, 14000, 15000, 35000, 80000, 100000, 110000, 150000, 20000]; // 9
    settings.condition_2_adjusted_likes = [12000, 14000, 15000, 35000]; // 4

    // The same idea can be applied to DISLIKES, but think before you do.
    // Turning this on means that in the INCLUDED condition one group member
    // receives 5 dislikes while the participant receives none - a strong
    // downward social comparison that could raise self-esteem on its own and
    // confound your inclusion condition. Off by default: group members'
    // dislike counts stay exactly as written in profiles.js in both
    // conditions, and only the participant's own dislikes vary.
    settings.compensate_dislikes = false;
    settings.condition_1_adjusted_dislikes = [9999999];                        // 0
    settings.condition_2_adjusted_dislikes = [25000, 55000, 90000, 120000, 155000]; // 5

    // ---------------------------------------------------------------
    // 6. WHO THE PARTICIPANT'S LIKES APPEAR TO COME FROM
    // ---------------------------------------------------------------
    // These names appear in the "X liked your post" popups. EVERY name
    // here must also be a username of a profile in profiles.js, or
    // participants will get likes from people who are not in the group -
    // an obvious tell.
    // The list is used in order, so the FIRST name is the one who likes
    // the rejected participant's single post. Kim is first deliberately:
    // she is the one minority-role reactor (see §8), so putting her first
    // makes her the sole like-giver in condition 1, and one of the six in
    // condition 2 - a consistent 5-majority/1-minority split either way.

    settings.likes_by = ['Kim', 'Dan', 'Anca', 'Niki', 'George', 'Heather'];

    // ---------------------------------------------------------------
    // 7. SHUFFLE THE ORDER OF THE GROUP MEMBERS?
    // ---------------------------------------------------------------
    // true = each participant sees the profiles in a random order, which
    // controls for position effects. (The original code intended to do
    // this but the shuffle silently did nothing - see SETUP.md.)
    settings.shuffle_profiles = true;

    // ---------------------------------------------------------------
    // 8. MAJORITY / MINORITY GROUP COMPOSITION (interaction source)
    // ---------------------------------------------------------------
    // The 11 group members are a mix of the majority party (whichever
    // party rejector resolves to - the "interaction source" manipulation) and a
    // minority presence from the other party. Which specific people play
    // which role is fixed here, independent of which party ends up being
    // majority for a given participant - only their avatar (and the
    // majority/minority label) changes per cell.
    //
    // Roster: 8 majority-role / 3 minority-role, an 8/3 split.
    // Reactions to the participant: 5 majority-authored / 1 minority-
    // authored out of every 6 (see likes_by/dislikes_by above), because
    // Kim - the sole minority reactor - is deliberately first in likes_by.
    //
    // Sarah MUST stay in this list. She is also the compensating member
    // at canonical position 1 (see §5 / adjust_to_condition()), and her
    // artificially large received-like-count is deliberately anchored to
    // whichever party is minority for a cell - minority has fewer people
    // (3 vs 8), so this keeps total visible likes roughly proportionate
    // across majority/minority instead of minority reading as simply
    // "fewer people, fewer likes." Do not move her to majority-role.
    settings.minority_role_names = ['Sarah', 'Kim', 'Jane'];
  }

  // ===================================================================
  // Below here you should not need to edit anything.
  // ===================================================================

  // --- Slide: Intro --------------------------------------------------
  function init_intro() {
    $('#intro').show();
    $('#submit_intro').on('click', function() {
      $('#intro').hide();
      init_name();
    });
  }

  // --- Slide: Username -----------------------------------------------
  function init_name() {
    $('#name').show();

    $('#submit_username').on('click', function() {
      var error = 0;
      var errormsg = '';
      var uname = $('#username').val();

      if (uname == "") {
        error = 1;
        errormsg = 'Please enter text';
        uname = "undefined";
      }
      if (not_alphanumeric(uname)) {
        error = 1;
        errormsg = 'Please use only letters and numbers (no spaces)';
      }

      if (error == 0) {
        $('#name').hide();
        window.username = $('#username').val();
        init_avatar();
      } else {
        alertify.log(errormsg, "error");
      }
    });
  }

  // --- Slide: Party + assigned avatar ----------------------------------
  // The participant states their party, is told they have been assigned that
  // party's badge, and sees it before continuing. Their answer here is what
  // drives window.party from this point on; the value passed in from
  // Qualtrics is kept separately as window.party_survey for cross-checking.
  function init_avatar() {

    if (!window.settings.ask_party) {
      set_party(window.party);
      init_text();
      return;
    }

    $('#avatar').show();

    $('input[name="partysr"]').on('change', function() {
      set_party($(this).val());
      window.party_answered = true;
      $('#party-word').text(window.party === 'rep' ? 'Republican' : 'Democratic');
      $('.avatars').html('<img class="avatar selected" src="avatars/' +
                         window.avatarfile + '" alt="your avatar" />');
      $('#avatar-assigned').show();
    });

    $('#submit_avatar').on('click', function() {
      // party_selfreport is also set by the provisional startup call, so it
      // can't be used to detect whether the participant actually answered.
      if (!window.party_answered) {
        alertify.log('Please select an option', 'error');
        return;
      }
      $('#avatar').hide();
      init_text();
    });
  }

  // Sets the working party and everything that depends on it. Called either
  // from the participant's own answer or from the Qualtrics parameter.
  function set_party(party) {
    window.party = (party === 'rep') ? 'rep' : 'dem';
    window.party_selfreport = window.party;
    window.avatarfile = (window.party === 'rep')
                      ? window.settings.avatar_rep
                      : window.settings.avatar_dem;
    window.avatarexport = window.avatarfile;

    // in-group / out-group is relative to the party just set. The absolute
    // option accepts either plain dem/rep or the obscured a/b codes (see
    // CLAUDE.md) - whichever the caller used for the `source`/`rejector`
    // URL param is what shows up here.
    if (window.rejector_request === 'in') {
      window.rejectorParty = window.party;
    } else if (window.rejector_request === 'out') {
      window.rejectorParty = (window.party === 'dem') ? 'rep' : 'dem';
    } else if (window.rejector_request === 'dem' || window.rejector_request === 'a') {
      window.rejectorParty = 'dem';
    } else if (window.rejector_request === 'rep' || window.rejector_request === 'b') {
      window.rejectorParty = 'rep';
    } else {
      window.rejectorParty = (window.party === 'dem') ? 'rep' : 'dem';
    }
    window.rejectorType = (window.rejectorParty === window.party) ? 'ingroup' : 'outgroup';

    load_profiles();
    adjust_to_condition();
  }

  // --- Slide: Description ---------------------------------------------
  function init_text() {
    $('#text').show();

    $("#count").text(window.settings.min_chars + " characters required");
    $("#description").keyup(function() {
      var n = $(this).val().length;
      $("#count").text(n < window.settings.min_chars
        ? (window.settings.min_chars - n) + " more characters required"
        : n + " characters (" + window.settings.min_chars + " required)");
    });

    $('#submit_text').on('click', function() {
      var error = 0;
      var errormsg = '';
      var val = $('#description').val();

      if (val == "") {
        error = 1;
        errormsg = 'Please enter text';
      } else if (val.length < window.settings.min_chars) {
        error = 1;
        errormsg = 'Please write at least ' + window.settings.min_chars + ' characters';
      } else if (val.length > window.settings.max_chars + 1) {
        error = 1;
        errormsg = 'Please enter less text';
      }

      if (error == 0) {
        $('#text').hide();
        window.description = val;
        init_fb_intro();
      } else {
        alertify.log(errormsg, "error");
      }
    });
  }

  // --- Slide: Task instructions ---------------------------------------
  function init_fb_intro() {
    $('#fb_intro').show();
    $('#submit_fb_intro').on('click', function() {
      $('#fb_intro').hide();
      init_fb_login();
    });
  }

  // --- Slide: Fake login / connecting ----------------------------------
  function init_fb_login() {
    $('#fb_login').show();

    setTimeout(function() {
      $('#msg_all_done').show();
      $("#loader").hide();
    }, 8000);

    $('#submit_fb_login').on('click', function() {
      $('#fb_login').hide();
      init_task();
    });
  }

  // --- Slide: The task --------------------------------------------------
  function init_task() {

    $('#task').show();
    window.taskStart = new Date().getTime();
    window.likeLog = [];      // which profiles the participant liked
    window.dislikeLog = [];   // which profiles the participant disliked

    shortcut.add("Backspace", function() {});

    jQuery("#countdown").countDown({
      startNumber: window.settings.tasklength / 1000,
      callBack: function(me) {
        $('#timer').text('00:00');
      }
    });

    // The participant's own post
    var users = {
      "posts": [{
        "avatar": 'avatars/' + window.avatarfile,
        "username": window.username,
        "text": window.description,
        "likes": window.settings.condition_likes,
        "usernames": window.settings.likes_by,
        "dislikes": window.settings.condition_dislikes,
        "usernames_dislike": window.settings.dislikes_by
      }]
    };

    var tpl = $('#usertmp').html();
    $("#task").append(Mustache.to_html(tpl, users));

    // Shuffle the group members before rendering, so the order on screen
    // is random for each participant. (Done here rather than in the DOM
    // because the original DOM shuffle targeted an element that does not
    // exist and therefore never ran.)
    if (window.settings.shuffle_profiles) {
      shuffle(window.others.posts);
    }

    var tpl2 = $('#otherstmp').html();
    $("#task").append(Mustache.to_html(tpl2, window.others));

    // Deliver the participant's likes on their timers
    $('.userslikes').each(function() {
      var that = $(this);
      var usernames = String($(this).data('usernames')).split(",");
      var times = String($(this).data('likes')).split(",");

      for (var i = 0; i < times.length; i++) {
        times[i] = +times[i];
        var themsg = usernames[i] + " liked your post";

        setTimeout(function(msg) {
          that.text(parseInt(that.text()) + 1);
          alertify.success(msg);
        }, times[i], themsg);
      }
    });

    // Deliver the group members' likes on their timers
    $('.otherslikes').each(function() {
      var that = $(this);
      var times = String($(this).data('likes')).split(",");

      for (var i = 0; i < times.length; i++) {
        times[i] = +times[i];
        setTimeout(function() {
          that.text(parseInt(that.text()) + 1);
        }, times[i]);
      }
    });

    // Deliver the DISLIKES the participant receives
    $('.userdislikes').each(function() {
      var that = $(this);
      var usernames = String($(this).data('dislikers')).split(",");
      var times = String($(this).data('dislikes')).split(",");

      for (var i = 0; i < times.length; i++) {
        times[i] = +times[i];
        var themsg = usernames[i] + " disliked your post";

        setTimeout(function(msg) {
          that.text(parseInt(that.text()) + 1);
          alertify.error(msg);
        }, times[i], themsg);
      }
    });

    // Deliver the group members' dislikes on their timers
    $('.othersdislikes').each(function() {
      var that = $(this);
      var times = String($(this).data('dislikes')).split(",");

      for (var i = 0; i < times.length; i++) {
        times[i] = +times[i];
        setTimeout(function() {
          that.text(parseInt(that.text()) + 1);
        }, times[i]);
      }
    });

    // Reaction buttons. Both are logged, since whether a participant likes
    // or dislikes out-party profiles is usually itself a dependent variable
    // in a partisan design.
    $('.btn-like, .btn-dislike').on('click', function() {
      var $btn   = $(this);
      var $entry = $btn.closest('.entry');
      var isLike = $btn.hasClass('btn-like');
      var target = $entry.data('username');
      var ms     = new Date().getTime() - window.taskStart;

      var $counter = isLike ? $entry.find('.otherslikes')
                            : $entry.find('.othersdislikes');
      $counter.text(parseInt($counter.text()) + 1);

      if (window.settings.one_reaction_per_post) {
        // one reaction per post: clicking either locks both
        $entry.find('.btn-like, .btn-dislike').attr("disabled", true);
      } else {
        $btn.attr("disabled", true);
      }

      if (isLike) {
        window.likeLog.push({ target: target, ms: ms });
      } else {
        window.dislikeLog.push({ target: target, ms: ms });
      }
    });

    $('#task').masonry({
      itemSelector: '.entry',
      columnWidth: 10
    });

    // End of task
    setTimeout(function() {

      // The countdown below runs its own independent animate-based tick that
      // can lag behind real time (e.g. a backgrounded tab gets throttled).
      // Flag it stopped so a late tick can't overwrite '00:00' after we set it.
      $('#countdown').data('countdown-stopped', true);

      $(window).unbind('beforeunload');

      // Opened via a target="_blank" link from Qualtrics (the "new tab"
      // method): this tab won't navigate away on its own, so it needs its
      // own instructions rather than the iframe/standalone message.
      if (window.parent === window && window.opener) {
        $('#final-msg-newtab').show();
      } else {
        $('#final-msg').show();
      }

      $('#final-continue').show();
      $('#timer').text('00:00');

      // finish() used to run only on the Continue click. That left a gap
      // for the new-tab method: the on-screen message tells the participant
      // they may close this tab, and a participant who does that without
      // clicking Continue first sent no data at all. sentOnce() below fires
      // finish() the instant the timer ends, before the participant has to
      // do anything, and the guard just stops the (still fully visible,
      // still clickable) Continue button from sending a second copy.
      var sent = false;
      function sentOnce() {
        if (sent) { return; }
        sent = true;
        finish();
      }
      sentOnce();

      $('#final-continue').on('click', function() {
        sentOnce();
        $('#final-continue').hide();
      });

    }, window.settings.tasklength);
  }

  // --- Sending the data back -------------------------------------------
  function finish() {

    var likedNames = [];
    var likedTimes = [];
    for (var i = 0; i < window.likeLog.length; i++) {
      likedNames.push(window.likeLog[i].target);
      likedTimes.push(window.likeLog[i].ms);
    }

    var dislikedNames = [];
    var dislikedTimes = [];
    for (var j = 0; j < window.dislikeLog.length; j++) {
      dislikedNames.push(window.dislikeLog[j].target);
      dislikedTimes.push(window.dislikeLog[j].ms);
    }

    var payload = {
      oo: true,                     // tag so Qualtrics recognises our message
      participant:  window.participant,
      condition:    window.condition,
      party:          window.party,            // used by the paradigm
      partySelfReport: window.party_selfreport, // answered on the avatar screen
      partySurvey:     window.party_survey,     // passed in from Qualtrics
      partyMatch:      (window.party_survey && window.party_selfreport
                        && window.party_survey === window.party_selfreport) ? 1 : 0,
      rejectorParty: window.rejectorParty,
      rejectorType:  window.rejectorType,   // "ingroup" or "outgroup"
      username:     window.username,
      avatar:       window.avatarexport,
      description:  window.description,
      likesGiven:    window.likeLog.length,
      likedWho:      likedNames.join('|'),
      likedWhen:     likedTimes.join('|'),
      dislikesGiven: window.dislikeLog.length,
      dislikedWho:   dislikedNames.join('|'),
      dislikedWhen:  dislikedTimes.join('|'),
      finishedAt:    new Date().toISOString()
    };

    if (window.parent !== window) {
      // Running inside a Qualtrics iframe: hand the data to the parent
      // page, which writes it into embedded data and clicks Next.
      window.parent.postMessage(payload, window.settings.parentOrigin);
    } else if (window.opener) {
      // Opened in a new tab from a target="_blank" link in Qualtrics (the
      // "new tab" method): hand the data back to the tab that opened this
      // one, the same way the iframe method does. That tab's listener sets
      // the embedded data and advances; this tab has nothing left to do -
      // the on-screen message (see the end-of-task handler) already told
      // the participant to close it.
      window.opener.postMessage(payload, window.settings.parentOrigin);
    } else {
      // Running standalone: redirect to the follow-up survey, appending
      // the data as URL parameters. The long free-text description is
      // deliberately NOT sent here - long text plus URL encoding can
      // exceed browser URL limits and get silently truncated.
      location.href = window.redirect
        + '&p='     + encodeURIComponent(window.participant)
        + '&c='     + window.condition
        + '&party=' + window.party
        + '&rejector=' + window.rejectorParty
        + '&rejectorType=' + window.rejectorType
        + '&av='    + encodeURIComponent(window.avatarexport)
        + '&u='     + encodeURIComponent(window.username)
        + '&lg='    + payload.likesGiven
        + '&lw='    + encodeURIComponent(payload.likedWho)
        + '&dg='    + payload.dislikesGiven
        + '&dw='    + encodeURIComponent(payload.dislikedWho);
    }
  }

  // --- URL parameters ---------------------------------------------------
  function get_params() {

    // c = condition. Must be 1 (rejected) or 2 (included).
    var c = parseInt(window.QueryString.c);
    window.condition = (c === 1 || c === 2) ? c : 1;

    // p = participant identifier. Accepts TEXT, not just numbers - this
    // matters because Qualtrics ResponseIDs look like "R_1a2B3c4D5e6F7g8"
    // and the original numeric-only code would have turned every one of
    // them into 0, making the data impossible to link.
    if (window.QueryString.p !== undefined && window.QueryString.p !== "") {
      window.participant = decodeURIComponent(window.QueryString.p);
    } else {
      window.participant = "unknown";
    }

    // party from Qualtrics. Two aliases are accepted: the plain `party`
    // param (dem/rep - readable, fine for the iframe method and direct
    // testing since neither exposes the URL to the participant) and the
    // obscured `affil` param (a=dem, b=rep - see CLAUDE.md) used
    // specifically by the new-tab method's visible link, where the URL
    // sits in the participant's address bar. `affil` wins if both are
    // present. Kept as party_survey for cross-checking; the participant's
    // own answer on the avatar screen is what the paradigm actually runs
    // on (see set_party).
    var partyRaw = window.QueryString.affil === 'a' ? 'dem'
                 : window.QueryString.affil === 'b' ? 'rep'
                 : window.QueryString.party;
    window.party_survey = (partyRaw === 'rep') ? 'rep'
                        : (partyRaw === 'dem') ? 'dem'
                        : '';
    window.party = window.party_survey || 'dem';
    window.party_selfreport = '';

    // rejector is resolved later, once the party is known. Same alias
    // pattern: plain `rejector` (readable) or obscured `source` (see
    // CLAUDE.md) - `source` wins if both are present.
    //   in / out       - relative to the participant (recommended)
    //   dem/rep or a/b - absolute
    window.rejector_request = window.QueryString.source || window.QueryString.rejector;

    // redirect (standalone mode only)
    if (window.QueryString.redirect !== undefined && window.QueryString.redirect !== "") {
      window.redirect = decode(window.QueryString.redirect);
    } else {
      window.redirect = window.settings.defaultredirect;
    }
    if (window.redirect.indexOf("?") === -1) {
      window.redirect = window.redirect + "?redir=1";
    }
  }

  // --- Build the mixed majority/minority group -----------------------------
  // window.rejectorParty is the MAJORITY party (the interaction-source
  // manipulation, driven by rejector=in/out/dem/rep). Most of the 11 group
  // members are that party; settings.minority_role_names names the few who
  // are the other party instead - see set_settings() §8. Every username
  // exists in both party lists in profiles.js with identical bios, so this
  // is purely a per-person selection of which party's avatar to use.
  function load_profiles() {
    if (typeof window.profiles === 'undefined') {
      alert('Setup error: profiles.js did not load.');
      return;
    }

    var majorityParty = window.rejectorParty;
    var minorityParty = (majorityParty === 'dem') ? 'rep' : 'dem';

    // profiles.dem and profiles.rep list the same 11 usernames in the same
    // order, so either can be used as the canonical order to walk.
    var canonical = window.profiles.dem.posts;

    window.others = { posts: canonical.map(function(entry) {
      var party = (window.settings.minority_role_names.indexOf(entry.username) !== -1)
                ? minorityParty
                : majorityParty;
      var source = window.profiles[party].posts.filter(function(p) {
        return p.username === entry.username;
      })[0];
      // Deep copy so that editing likes does not alter the master list.
      return JSON.parse(JSON.stringify(source));
    }) };
  }

  // --- Apply the condition ----------------------------------------------
  function adjust_to_condition() {

    // posts[1] is always Sarah (canonical position 1, load_profiles()
    // preserves profiles.dem's order) - the compensating member. Because
    // she's in minority_role_names, she's now always rendered with the
    // minority party's avatar for this cell; see set_settings() §8 for why.
    switch (window.condition) {
      case 1: // REJECTED: few likes, many dislikes
        window.settings.condition_likes    = window.settings.condition_1_likes;
        window.settings.condition_dislikes = window.settings.condition_1_dislikes;
        window.others.posts[1].likes = window.settings.condition_1_adjusted_likes;
        if (window.settings.compensate_dislikes) {
          window.others.posts[1].dislikes = window.settings.condition_1_adjusted_dislikes;
        }
        break;
      case 2: // INCLUDED: many likes, no dislikes
        window.settings.condition_likes    = window.settings.condition_2_likes;
        window.settings.condition_dislikes = window.settings.condition_2_dislikes;
        window.others.posts[1].likes = window.settings.condition_2_adjusted_likes;
        if (window.settings.compensate_dislikes) {
          window.others.posts[1].dislikes = window.settings.condition_2_adjusted_dislikes;
        }
        break;
    }

    // Safety net: if a profile has no dislikes array, give it an empty one so
    // the template never renders "undefined" into a data attribute.
    for (var i = 0; i < window.others.posts.length; i++) {
      if (!window.others.posts[i].dislikes) {
        window.others.posts[i].dislikes = [9999999];
      }
    }
  }

  // --- Helpers -----------------------------------------------------------

  // Fisher-Yates shuffle (the original reorder() function was broken)
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  window.QueryString = function() {
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (typeof query_string[pair[0]] === "undefined") {
        query_string[pair[0]] = pair[1];
      } else if (typeof query_string[pair[0]] === "string") {
        query_string[pair[0]] = [query_string[pair[0]], pair[1]];
      } else {
        query_string[pair[0]].push(pair[1]);
      }
    }
    return query_string;
  }();

  function not_alphanumeric(inputtxt) {
    var letterNumber = /^[0-9a-zA-Z]+$/;
    return !inputtxt.match(letterNumber);
  }

  function pad(str, max) {
    return str.length < max ? pad("0" + str, max) : str;
  }

  function encode(unencoded) {
    return encodeURIComponent(unencoded).replace(/'/g, "%27").replace(/"/g, "%22");
  }
  function decode(encoded) {
    return decodeURIComponent(encoded.replace(/\+/g, " "));
  }

  jQuery.fn.countDown = function(settings, to) {
    settings = jQuery.extend({
      startFontSize: "12px",
      endFontSize: "12px",
      duration: 1000,
      startNumber: 10,
      endNumber: 0,
      callBack: function() {}
    }, settings);
    return this.each(function() {
      var $this = jQuery(this);
      if (!to && to != settings.endNumber) { to = settings.startNumber; }
      $this.children('.secs').text(to);
      $this.animate({ fontSize: settings.endFontSize }, settings.duration, "", function() {
        // A throttled/backgrounded tab can deliver this tick long after the
        // real end-of-task timer already fired and set the display to
        // '00:00'. Once that happens the flag below is set, so bail instead
        // of overwriting it with a stale count.
        if ($this.data('countdown-stopped')) { return; }
        if (to > settings.endNumber + 1) {
          $this.children('.secs').text(to - 1);
          $this.countDown(settings, to - 1);
          var minutes = Math.floor(to / 60);
          var seconds = to - minutes * 60;
          $this.children('.cntr').text(pad(minutes.toString(), 2) + ':' + pad(seconds.toString(), 2));
        } else {
          settings.callBack(this);
        }
      });
    });
  };

  // Discourage accidental exit - but ONLY when running standalone. Inside
  // a Qualtrics iframe this produces a confusing "leave site?" prompt when
  // the participant advances the survey page.
  shortcut.add("f5", function() {});
  if (window.parent === window) {
    $(window).bind('beforeunload', function() {
      return 'Are you sure you want to quit the experiment completely?';
    });
  }

  // --- Start -------------------------------------------------------------
  set_settings();
  get_params();
  set_party(window.party);   // provisional; re-run when the participant answers
  init_intro();

});
