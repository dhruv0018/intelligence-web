Feature: Athlete

    As an athlete
    I should only see menu options of film home/analytics
    and be able to order highlights if I have game in basketball

    Rules:
    - only 3 menu options in the header

    Scenario: Athlete once login should see three menu options

        Given I login as "SUPER_ADMIN"
        When I go to user as "montalvoj0@students.rowan.edu"
        Then I should see "3" menu options in "Athlete" header
