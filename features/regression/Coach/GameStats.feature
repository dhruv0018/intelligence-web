@ignore
Feature: Game Stats

    As a coach(INTWEB-883)
    I should be able to view game stats for Men's Lacrosse

    Rules:
    - Game must be a men's lacrosse game

    Scenario: Coach should be able to view team stats

    	Given I login as "Coach"
    	When I switch to role "Boys Lax Andrew"
    	When I select first breakdown
    	When I click Stats
    	When I pick option "Team Stats" from dropdown "Stat Type"
    	Then I should see stats in the following order: "scoring, shots, shots on goal, saves, groundballs, turnovers, faceoffs won, clears, man-up"
    	Then I should see the following columns: "Team Stats, Team, Q1, Q2, Total"

    Scenario: Coach should be able to view box score of home team
    	When I pick the "first" option "Box score" from dropdown "Stat Type"
    	Then I should see stats in the following order: "player names, unknown, totals"
    	Then I should see the following columns: "Player, G, A, Pts, Sh, SOG, GB, TO, CT, Checks, Faceoffs, Penalties"

    Scenario: Coach should be able to view goaltending stats of home team
    	When I pick the "first" option "Goaltending" from dropdown "Stat Type"
    	Then I should see stats in the following order: "player names, totals"
    	Then I should see the following columns: "Goalie, GA, Saves, SV%"

    Scenario: Coach should be able to view box score of away team
    	When I pick the "second" option "Box score" from dropdown "Stat Type"
    	Then I should see stats in the following order: "player names, unknown, totals"
    	Then I should see the following columns: "Player, G, A, Pts, Sh, SOG, GB, TO, CT, Checks, Faceoffs, Penalties"

    Scenario: Coach should be able to view goaltending stats of away team
    	When I pick the "second" option "Goaltending" from dropdown "Stat Type"
    	Then I should see stats in the following order: "player names, totals"
    	Then I should see the following columns: "Goalie, GA, Saves, SV%"

	Scenario: Coach should be able to view shooting stats of home team
    	When I pick the "first" option "Shooting" from dropdown "Stat Type"
    	Then I should see stats in the following order: "Goals, Shots On Goal, Total Shots, Shots Blocked, Shots Missed/Pipe"
    	Then I should see the following columns: "Category, Top of the Box, Wings, Crease, Flanks, Perimeter"

    Scenario: Coach should be able to view shooting stats of away team
    	When I pick the "second" option "Shooting" from dropdown "Stat Type"
    	Then I should see stats in the following order: "Goals, Shots On Goal, Total Shots, Shots Blocked, Shots Missed/Pipe"
    	Then I should see the following columns: "Category, Top of the Box, Wings, Crease, Flanks, Perimeter"

	Scenario: Coach should be able to view tags stats of home team
    	When I pick the "first" option "Tags" from dropdown "Stat Type"
    	Then I should see the following columns: "Tags, Count, G/Att, G, A, Sh, SOG, TO, TO%, Offensive GB, Checks"

    Scenario: Coach should be able to view tags stats of away team
    	When I pick the "second" option "Tags" from dropdown "Stat Type"
    	Then I should see the following columns: "Tags, Count, G/Att, G, A, Sh, SOG, TO, TO%, Offensive GB, Checks"
