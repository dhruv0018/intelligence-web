Feature: Share Games and Reels

    In order to collaborate about my game film
    As a coach
    I should be able to share games
    And reels
    With other Krossover users

    Rules:
    - Breakdown must be available in the team's film home
    - Reel must be available in the team's film home

    Scenario: Share a breakdown with another Krossover user as a coach

        Given I login as "LACROSSE_COACH"
        When I switch to role "Lacrosse Test"
        When I filter for breakdowns
        And I search for game "John Hopkins"
        And I click to share the "game" with Other Krossover Users
        And I select user with name "IntegrationTest" who is a coach of team "Test Opponent"
        Then I should see a drop-down to share raw film or raw film and breakdown
        When I pick option "Sharing raw film and breakdown" from dropdown "share.isBreakdownShared"
        And I click Done
        When I switch to role "Test Opponent"
        When I search for game "John Hopkins"
        Then I should see the game I shared with away team name "John Hopkins"
        And I should see text "shared by IntegrationTest User" on the "game"

    Scenario: Unshare breakdown with another Krossover user as a coach

        When I switch to role "Lacrosse Test"
        When I filter for breakdowns
        And I search for game "John Hopkins"
        And I click to share the "game" with Other Krossover Users
        And I click to revoke sharing of the "game"
        And I click Done
        When I switch to role "Test Opponent"
        When I search for game "John Hopkins"
        Then I should NOT see the "game" I shared with name "John Hopkins"

    Scenario: Share a reel with another Krossover user as a coach

        When I switch to role "Lacrosse Test"
        When I click "Reels" tab on film home
        And I search for reel "Integration Test Reel"
        And I click to share the "reel" with Other Krossover Users
        And I select user with name "IntegrationTest" who is a coach of team "Test Opponent"
        And I click Done
        When I sign out
        And I navigate to the "login" page
        And I login as "ASSISTANT_COACH"
        When I switch to role "Test Opponent"
        When I click "Reels" tab on film home
        And I search for reel "Integration Test Reel"
        Then I should see a reel with name "Integration Test Reel" on film home
        And I should see text "Shared by IntegrationTest User" on the "reel"
        But I should NOT see the share button next to the reel
        When I click on the reel with name "Integration Test Reel"
        Then I should NOT be able to edit the reel

    Scenario: Reels shared to a Head Coach are NOT automatically shared with Athletes

        Given I switch to role "Athlete"
        When I click "Reels" tab on film home
        And I search for reel "Integration Test Reel"
        Then I should NOT see the "reel" I shared with name "Integration Test Reel"

    Scenario: Unshare reel with another Krossover user as a coach

        Given I switch to role "Lacrosse Test"
        When I click "Reels" tab on film home
        And I click to share the "reel" with Other Krossover Users
        And I click to revoke sharing of the "reel"
        And I click Done
        When I switch to role "Test Opponent"
        When I click "Reels" tab on film home
        And I search for reel "Integration Test Reel"
        Then I should NOT see the "reel" I shared with name "Integration Test Reel"

@ignore
    #Can't create new reels because of existing bug INTWEB-953
    Scenario: Reels created by Head Coach are automatically shared with Assistant Coaches

        When I switch to role "Assistant Coach"
        When I click "Reels" tab on film home
        When I search for reel "Integration Test Reel"
        Then I should see a reel with name "Integration Test Reel" on film home

@ignore
    #Newly uploaded film doesn't display in shared coach's film home
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