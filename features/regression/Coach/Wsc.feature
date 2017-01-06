Feature: Coach-WSC

    As a basketball coach
    I should see Order WSC button in breakdown and reel detail page
    and be able to order highlights

    Rules:
    - To order highlights you must be in basketball
    - To order you will see wsc button in reel detail page

    Scenario: Coach should see the film home page after logging in

        Given I login as "BASKETBALL_COACH"
        When I switch to role "Friars"
        Then I should see the "film-home" page

    Scenario: Basketball Coach can order WSC highlight for breakdowns
        Given I click "Games" tab on film home
        When I search for game "marlboro"
        When I select first game
        Then I should see WSC Order button
        When I click Order Now button
        Then I should see "krossover.clipro.tv" page in new tab

    Scenario: Basketball Coach can order WSC highlight for reels

        Given I go to film home
        Then I click "Reels" tab on film home
        Then I should only see "Reels" on film home
        When I select first reel
        Then I should see WSC Order button
