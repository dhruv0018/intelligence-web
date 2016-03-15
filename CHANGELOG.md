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