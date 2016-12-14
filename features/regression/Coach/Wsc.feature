@manual
Feature: Coach-WSC

    As a basketball coach
    I should see Order WSC button in reel detail page
    and be able to order highlights

    Rules:
    - To order highlights you must be in basketball
    - To order you will see wsc button in reel detail page

    Scenario: Coach once login should see the film home page

        Given I login as "BASKETBALL_COACH"
        When I switch to role "Friars"
        Then I should see the "film-home" page

    Scenario: Basketball Coach can order WSC highlight for breakdown
        Given I click "Games" tab on film home
        When I search for game "marlboro"    
        When I select first game
        Then I should see WSC Order button

    Scenario: Basketball Coach can view WSC on reel page

        Given I go to film home
        Then I click "Reels" tab on film home
        Then I should only see "Reels" on film home
        When I select first reel
        Then I should see WSC Order button