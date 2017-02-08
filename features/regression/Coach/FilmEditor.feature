Feature: Film Editor

    As a coach(INTWEB-475)
    I should be able to use the film editor
    to create, edit and delete plays

    Rules:
    - To use film editor, the game must be raw film or a breakdown

    Scenario: Coach should be able to create a clip

        Given I login as "INDIABASKETBALL_COACH"
        When I switch to role "India Basketball"
        When I filter and select first breakdown
        When I click Film Editor tab
        When I click Continue Editing
        Then I should be in an editing state
        When I delete all clips
        When I click Create Clip
        When I wait for "5" seconds
        When I click End Clip
        Then I should see a play created
        When I click Finish Editing
        Then I should see a play created

    Scenario: Coach should be able to cancel the editing of a play from the playlist

        Given I click Continue Editing
        When I click to edit a play
        Then the pencil and trash icons should get replaced with a Cancel button
        When I click Cancel
        Then the pencil and trash icons should display

    Scenario: Coach can edit a play

        When I click to edit a play
        Then I should see an Update Start Time button
        When I select click Update Start Time
        Then I should see an Update End Time button
        When I click Update End Time
        Then the pencil and trash icons should display
        Then I should see a Create Clip button

@ignore 
    #Open bug KOINTEL-1964
    Scenario: Coach can edit clip, finish editing and continue editing again

        Given I click Finish Editing
        When I click Continue Editing
        When I click to edit a play
        When I click Finish Editing
        Then I should be able to click Continue Editing

    Scenario: Coach should be able to cancel deleting of a play

        When I click Delete Clip
        When I click to cancel the deletion
        Then the pencil and trash icons should display
        Then the play should not have been deleted

    Scenario: Coach should only be able to edit one play at a time

        #When I click Continue Editing
        When I click Create Clip
        When I wait for "2" seconds
        When I click End Clip
        When I click to edit a play
        Then I should not be able to edit any other play