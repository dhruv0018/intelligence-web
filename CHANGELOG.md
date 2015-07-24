# v2.9.0 #

## Features ##
- As an indexer, my History tab, should show assigned games that I previously completed
- As an indexer, my Games tab should only show assigned games I am currently working on

# v2.8.0 #

## Features ##
- Initial UI/UX styleguide

# v2.7.1 #

## Bug Fixes / Improvements ##
- Fix an issue with an external library

# v2.7.0 #

## Features ##
- Athlete profiles
- Full screen indexing
- As a coach, when I am looking at a reel, I should have the same tags/reels functionality as for breakdowns (checkboxes, multiple select, etc)
- As an Admin, on the team info page, in the plans and package section, I should be able to see the number of breakdowns submitted and left for a package and the plan
- As an Admin, I should be able to toggle QA status on a user with an indexer role in the user info page
- Coach or Athlete on Web will see video pause when opening the toolbar
- As a user, I should be able to see a link to my profile below my resumé

## Bug Fixes / Improvements ##
- Center video player controls
- Profile design enhancements
- As a basic athlete, I should not be able to add a reel to my profile

# v2.6.0 #

## Features ##
- Stats

# v2.5.0 #

## Features ##
- Telestrations

# v2.4.2 #

## Bug Fixes / Improvements ##
- As a coach, when selecting an event in the breakdown the play for the event should be selected.

# v2.4.1 #

## Bug Fixes / Improvements ##
- 'Add to Reel' button appearing on Reels for athletes. The button does not do anything when selected.
- As an athlete, when I create a reel, by adding clips from a breakdown, there is no date on the reel when I go back to the Film Home, until I refresh.
- When a user applies a custom tag to a large number of plays, the "Tag Added" confirmation is taking a long time to appear.

# v2.4.0 #

## Features ##
- Custom tags

# v2.3.1 #

## Bug Fixes / Improvements ##
- Clips Pages Not Loading

# v2.3.0 #

## Known Issues ##
- Clips pages not loading
- As an indexer, while watching the video I should be able to see the video duration
- On down and distance and formation report, the playlist play button is not starting the video

## Features ##
- Design improvements to the queue dashboard/status
- Admin can toggle dashboard up and down on queue
- As a coach, I should see the number of plays next to the filter button

## Bug Fixes / Improvements ##
- Reels page not showing for athletes
- Show when a game was indexed only if that data is available
- As an admin, when I use the typeahead to add a school to a team, I should be able to see more than ten results
- As an indexer, if I delete an event, the playlist script removes the last event of the play. It should remove the event which was deleted
- As an indexer, I cannot save an event with an arena field because the dialog only dismisses on ESC
- As a user, when playing clips in continuous play, the clips do not advance to the next play
- If 'DNP' is selected, nothing should be editable for that player (jersey number or position)
- As a mobile device user, I should not see the videoplayer controls on the web

# v2.2.7 #

## Bug Fixes / Improvements ##
- As a coach, when viewing a breakdown, I should see only the clips from that game

# v2.2.6 #

## Known Issues ##
- I should not see buttons "glowing"
- As an indexer, if I delete an event, the playlist script removes the last event of the play. It should remove the event which was deleted.
- As a coach, when selecting an event in the breakdown the play for the event should be selected.
- As a coach, when uploading a Football (and all sports) game and entering my team's roster, I should see a header that says DNP. On volleyball games, the header is there.

## Features ##
- Maintenance Functionality v0.1
- Update API to force maintenance mode via server config (503) disabling access to all data for read or write
- Create connection error intercept message displayed on login page disabling logging in for Web Client

# v2.2.5 #

## Known Issues ##
- Public Pages Not Loading in Private Window in Safari

## Bug Fixes / Improvements ##
- As a coach, athlete, or public user, If the current clip is paused, I want the 'Play button in the playlist' to play that video when I select it, so that the user can play the video from the play button on the playlist
- The playlist does not force scroll downward when indexing a play
- If a Coach marks a player as DNP (Did Not Play) while uploading a game, the player should NOT be appearing for the indexer when indexing.
- The Video Player is Not Showing Up Correctly on Mozilla
- As an indexer, when I index a player field, duplicate selections should not appear
- Team Names are not showing up on Reels in the Summary sentence

# v2.2.4 #

## Known Issues ##
- If 'DNP' is selected, nothing should be editable for that player (jersey number or position)

## Bug Fixes / Improvements ##
- Server Error results when adding e-mail address for athlete through roster page. Cannot add athlete account through coach.
- The team in possession (who is serving) is not displaying in the Breakdown Playlist Event Summaries.
- End & Start tags are not initiating new plays
- On the playlist, colors are appearing after the player name as opposed to before as on production.
- Cannot Set Reel as Public. Results in Server Error
- Reset Password Link on Integration Server Leads to "Your Connection is not Private" Warning Message, and cannot reset password.
- No longer get warning message when attempting to assign 'Athlete' Role though Admin/SuperAdmin.
- No longer getting e-mail notifying about game assignment
- When adding Assistant Coach through Head Coach account, coach is automatically activated right after e-mail address is entered. Assistant Coach never gets a link to create password in e-mail.
- When uploading a game and adding a player, the position selector is no longer scrolling properly.
- Play Button on Playlist playing Incorrect Play (and changing colors to red when it should not)
- On Playlist, the Circles on Play Events are not following events correctly.
- The playlist does not force scroll downward when indexing a play
- When indexing a play, if you edit a previous tag, events no longer appear to generate on the playlist
- Play button not playing plays.
- Play not displaying on Clips page

# v2.2.3 #

## Bug Fixes / Improvements ##
- After editing any X,Y field (arena selection field), the arena does not cancel out after saving
- When editing an X,Y field, the previously indexed selection does not appear
- When indexing, a new play will initiate every time you try to add a new start tag (rather than adding it to the selected play)
- Video Player Controls Not Working on Safari/Mozilla.
- Cannot Re-Arrange Clips on an Upload
- Clicking the play (play description) on the playlist should expand/compress the play, and it should not start playing in the video player.  Only the 'play button' on the playlist should have it play in the video player.
- Unable to have more than one breakdown/reel play expanded at one time without scrolling up.
- Reels not expanding/ showing play events
- As a mobile device user, I should not see the videoplayer controls on the web
- Athlete Cannot Access Own Reels if Reel is Not Set to Public.  User Gets a \"You Do Not Have Permission to Access Reel\" message.
- When indexing, a new play will initiate every time you try to add a new start tag (rather than adding it to the selected play)
- Switch Video Player Controls (away from click + hold) back to behavior of Production.
- Slow and fast forward and rewind buttons should toggle ON and OFF with a click interaction.

# v2.2.2 #

## Bug Fixes / Improvements ##
- Displayed count of viewable plays does not match # of plays viewable in game breakdown on some games.
- On Game Information Page/Uploader, the tabs have a styling error (a blue box around the tabs) when selected.
- Game Information page is Blank on games already uploaded.
- On a few users who have already activated their Krossover accounts, there is still a \"Resend Invitation\" button next to their names on Team Rosters.  When selecting the \"Resend Invitation\" button, a bad request occurs (which is probably expected).
- On Uploader, the \"next\" button is not active, so user is unable to upload.
- Video Player FullScreen Feature is no longer actual fullscreen, but just stretches the video to fill the entire browser.
- Cannot rearrange clips in some reels (affects Sales/Marketing)
- The playlist for reels does not show on Safari
- When user goes into reel, there is nothing there.  Reels are completely broken.
- Sharing With Other Krossover Users' Typeahead is missing
- Cannot Share a Reel - Server Error
- On a reel If user selects the play button on the playlist, the reel clip that the user selected does not play.
- When the video shows an event, that event is being shown at the very top of the playlist.  The user should be able to see the entire play, not just the event currently being shown.
- The playlist events no longer have vertical lines that connect them to each other anymore.
- While video is playing on a breakdown, clicking anywhere on a collapsed play will begin playing the video
- On Safari Playlist on Breakdowns is not showing up
- Breakdown Filters are showing either a) players named 'undefined' b) showing Krossover users not listed on either team's rosters, c) the players for the opposing team d) multiple 'unknowns'.
- When a Krossover user shares just Raw Film with another Krossover user, the game is appearing under the 'Breakdown' tab on the film home
- When a game is shared with a Krossover user, that game is showing up in the regular tab on the film home.
- Video returns to 00:00 after any event has been tagged.
- An indexer is unable to bring up the 'edit line' of a saved event
- All tags are saving at timestamp 00:00.
- When I switch between accounts/roles, the reels from the first account/role I view are showing up on the second account/role until I hit refresh.
- When a user (coach or athlete) creates a reel on one role, it is showing up under his 'Shared with Me' filter on any other roles in that user's account.
- When a user uploads a video, and then go back to the Film Home before going through the entire Game Upload process, if the user tries to go to a different website, he will get a message saying the video is still uploading, even though it is done uploading.
- When indexing, unable to ESC back after an event (with a field) has been selected.
- When indexing, Client/Left Side Team can not be selected for 'Start' tags"
- When indexing, player selection delays 2-3 seconds
- When indexing, hitting ENTER, when on an 'Optional' field, returns the indexer to the previous field
- When an indexer switches from one game to another, indexing from the last game will appear in the playlist
- Players from the previous game will as appear selections in the new game [See screenshot]
- Several Player/Team selections appear for player entry fields of tags
- Running scores are not being displayed while indexing.
- OOB tag is missing it's field
- Selecting an event to edit does not bring an indexer to the event time-stamp
- Indexed Scores are not displaying on Game Info page
- Any uncompleted events appear in the new game
- 504 preventing queue from loading
- Can't add a new Default Plan
- Down and Distance/ Formation Report \"Field picture\" are showing up incorrectly.
- Reels in edit mode looks odd
- Cannot rearrange clips in some reels
- Game Information page is Blank on games already uploaded.
- The upload screen should look exactly the same way as it does on production.  Upload Selector is now a Film Reel, and has two extra 'dots' on the left of the icons.
- Formation tag data is not saving (or is not being displayed)
- The DNP feature regressed back to an X (as opposed to a checkbox) and the player is removed from the page (instead of being greyed out).
- When selecting the play events in a breakdown, it no longer brings you to that event in the play
- Breakdown Playlist Styling Issue
- 'Wrong Password' and 'Wrong Email' Text On Login Page used to be Red.  Now it is Blue.
- On Formation Report/Down and Distance, some play events have extra connecting lines at the bottom of the play (Style Error)
- Down and Distance/Formation Report Individual Plays are Not Showing Up on Playlist on these sections.
- When Searching in the Queue, the first time a user searches, incorrect search results appear, but the second time, the search results are actually correct.
- When editing events, End tags can not be saved
- Events can not be deleted from a saved play
- On Upload If Coach selects a Player as DNP, if Coach goes into Game Info page while game is processing, the DNP players are back on the roster and able to be edited.
