@manual
Feature: Share Games and Reels

    In order to collaborate about my game film
    As a Coach
    I should be able to share games
    and reels
    with other Krossover users

    Rules:
    - Breakdown must be available in the team's film home
    -

    Scenario: Share a breakdown with another Krossover user as a coach

        Given I login as "LACROSSE_COACH"
        When I switch to role "Lacrosse Test"
        When I filter for breakdowns
        And I search for game "John Hopkins"
        And I click to share the "game" with Other Krossover Users
        And I select user with name "IntegrationTest" who is a coach of team "Northwestern W Test"
        Then I should see a drop-down to share raw film or raw film and breakdown
        When I pick option "Sharing raw film and breakdown" from dropdown "share.isBreakdownShared"
        And I click Done
        When I switch to role "Northwestern W Test"
        And I search for game "John Hopkins"
        Then I should see the game I shared with away team name "John Hopkins"
        And I should see text "shared by IntegrationTest User" in the "Game Date" column

    Scenario: Unshare breakdown with another Krossover user as a coach

        When I switch to role "Lacrosse Test"
        When I filter for breakdowns
        And I search for game "John Hopkins"
        And I click to share the "game" with Other Krossover Users
        And I click to revoke sharing of the "game"
        And I click Done
        When I switch to role "Northwestern W Test"
        And I search for game "John Hopkins"
        Then I should NOT see the "game" I shared with name "John Hopkins"

    Scenario: Share raw film with another Krossover user as a coach

        When I switch to role "Lacrosse Test"
        When I click add film
        And I click on "Regular Game"
        And I upload a game
        And I add new canonical team "IGTest Opposing Team"
        When I go to film home        
        And I click to share the "game" with Other Krossover Users
        And I select user with name "IntegrationTest" who is a coach of team "Northwestern W Test"
        Then I should see a drop-down to share raw film or raw film and breakdown
        When I pick option "Sharing raw film only" from dropdown "share.isBreakdownShared"
        And I click Done
        When I switch to role "Northwestern W Test"
        When I filter for games that were shared with me
        And I search for game "IGTest Opposing Team"
        Then I should see the game I shared with home team name "IGTest Opposing Team"
        #And I should see text "shared by IntegrationTest User" in the "Game Date" column
@ignore
    Scenario: Share a reel with another Krossover user as a coach

        When I switch to role "Lacrosse Test"
        When I filter and select first breakdown
        Then I should see the "breakdown" page
        When I refresh the page
        When I select the first play
        When I click Add to Reel
        When I click Create New Reel
        When I create the reel with name "IGTest Reel"
        When I go to film home
        When I click "Reels" tab on film home
        Then I should see a reel with name "IGTest Reel" on film home
        When I click to share the "reel" with name "" with Other Krossover Users
        When I select user with name ""
        When I click Done
        When I switch to role ""
        When I click "Reels" tab on film home
        When I search for reel ""
        Then I should see the "reel" I shared with name ""
        And I should see the text "shared by IntegrationTest User"
        And I should NOT see the share button next to the game
        When I click on the reel
        Then I should not be able to edit the reel
@ignore
    Scenario: Reels created by Head Coach are not automatically shared with Athletes

        When I switch to role "Athlete"
        When I click "Reels" tab on film home
        When I search for reel ""
        Then I should NOT see the "reel" I shared with name ""
@ignore
    Scenario: Reels created by Head Coach are automatically shared with Assistant Coaches

        When I switch to role with title "Assistant Coach"
        When I click "Reels" tab on film home
        When I search for reel ""
        Then I should see the "reel" I shared with name ""
@ignore
    Scenario: Unshare reel with another Krossover user as a coach

        When I switch to role "Lacrosse Test"
        When I click "Reels" tab on film home
        When I click to share the "reel" with name "" with Other Krossover Users
        When I click to revoke sharing of the "reel"
        When I click Done
        When I switch to role ""
        When I click "Reels" tab on film home
        When I search for reel ""
        Then I should NOT see the "reel" I shared with name ""