# v84.0#
## Features##
- Various updates to film exchange
- Canonical team typahead for game info page

# v82.1#
## Fixes##
- Use previous season for WSC if current season is less than half complete

# v81.1#
## Fixes##
- Show member teams for conferences that are not film exchanges

# v81.0#
## Features##
- Self Editor Improvements
- Conference Search page for Admins
- Updates for FB and VB flags

# v80.0#
## Features##
- Self Editor Improvements
- Admin conference management improvements

# v79.0#
## Features##
- Self Editor Improvements
- Film Exchange Video Sharing and Loading
- Film Upload Typeahead(Feature Flagged Off)
- Film Upload Roster Improvements

## Fixes##
- Remove links to old krossover site

# v78.0#
## Features##
- Copy a game from a film exchange
- Film Exchange Improvements
- Self Editor Improvements
- Move stat navigation buttons into singular dropdown

## Fixes##
- Fixes bug that caps number of film exchanges loaded by admin

# v77.0#
## Features##
- Remove a game from a film exchange
- Self editor improvements

# v76.2#
## Fixes##
- Fix shot chart x-y coordinates for Chrome v51

# v76.1#
## Fixes##
- Fixes minor linter issue
- Updates background-color in self-editor

# v76.0#
## Features##
- Improves film home performance (Teams)
- Imrpove show/hide buttons on Self Editor
- Film Exchange improvements

# v75.0#
## Features##
- Various UI improvements to Self Editor
- Film Exchange and Conference Features

# v74.0#
## Features##
- Adds ability to create and manage Film Exchanges, INTWEB-159
- Makes use of the V2 Conference namespace, INTWEB-156

## Fixes##
- Fixes bug where self-editor drop down would not close, INTWEB-164
- Corrects the self-editor list item header to be "sticky", INTWEB-163

# v72.0#
## Features##
- Adds ability to assign a Team to a Conference
- Adds stats export CSV to football and volleyball
- updates indexer groups
- makes Conferences admin available only to super users
- standardizes fonts of HTML players across browsers

# v2.46#
## Features##
- Adds first cut Conferences / Associations

# v2.45#
## Features##
- Adds revert to indexer
- Enables QA Flags for VB/FB
- Adds indexing groups

# v2.44.2#
## Fixes##
- Fixes styling issues related to Chrome v50 update

# v2.44.1#
## Fixes##
- Fixes race condition when switching roles

# v2.44#
## Features##
- Updates the UI for Playlists; makes tags case-insensitive
- reduces load times of Film home for customers with multiple Roles

## Fixes##
- fixes plan start date bug

# v2.43#
## Features##
- Updates design for WSC season highlights link
- improves messaging to user around changing their email address

## Fixes##
- addresses console.log error on the self-editor playlist

# v2.42.1#
## Fixes##
- Unhides season-highlights button

# v2.42.0#
## Features##
- Updates Evaporate to v1.0.2
- Removes old S3 uploader files
- Prevents user from editing reel information when it is not allowed

# v2.41.0#
##Features##
- Corrects Football Formation Visualizations!

## Fixes##
- Fixes minutes display on Admin Games overdue for indexing
- Resolved console javascript bug when viewing a copied game
- Correctly uses the most recent package for a Team if more than one package has been assigned

# v2.40.0#
##Features##
- Hides WSC Link on film home for coach and athlete
- Adds two new team labels "custom1" and "custom2"
- improves display of required fields on the Team Info page

## Fixes##
- Fixes team name showing for volleyball breakdowns based on which team served first

# v2.39.0#
##Features##
- Hides WSC Link on film home for coach and athlete
- Adds two new team labels "custom1" and "custom2"
- improves display of required fields on the Team Info page

## Fixes##
- Fixes team name showing for volleyball breakdowns based on which team served first

# v2.38.0#
##Features##
- Adds ability to create custom Football Formation Labels

# v2.37.0#
##Features##
- Improves styling of "go to as" and adds it to the Users page.
- Restricts reverting indexer assignments to only the indexer's active assignments
- Add additional teams to the Self Editor Whitelist
- Makes Postal Code required for Schools
- Restricts reverting indexer set aside to only active assignments
- Adds WSC link to Player Information template

##Fixes##
- Improves Roster upload modal styling
- Reverts to redirects for https:


# v2.36.0#
##Features##
- Improves navigation styling a bit, focus on search bar when opening drop down
- Prevents deleting a Game if the game is being processed
- Allows ENTER to submit password change requests
- Improves styling of Leagues so they are scrollable
- Removes redirect back to HTTP
- Adds developer configuation feature to selct backend API enviornment

##Fixes##
- Uses secure urls to WSC reel purchase and social links
- Improves Excel upload to remove extra native padding
- Fixes bug created when saving a player without a first name
- Uses GMT time to compare dates for all Sports

# v2.35.0#
##Features##
- Adds a color picker polyfill to non-supported browsers that do not impelement the HTML5 input type="color"
- Makes stats table styling such that the stats are more readable
- Adds bold headers to the stats text style

##Fixes##
- Correctly displays game copy button (raw film) without clearing cache
- Corrects uploader's inability to distinguish between files with same name, size, timestamp when determining if the file
needs to be reuploaded.
- Corrects stats boldness ('weight') in styling
