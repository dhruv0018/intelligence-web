Feature: Authentication

    As a user, I should be able to sign-in and be redirected accordingly.
    However, if I do not provide adequate credentials, then I will not be redirected.
    Once signed-in, I should be able to sign-out and be redirected to the login page again.

    #Background:
        #Given I navigate to the "login" page
        #Then I should see the "login" page

    Scenario: An authenticated Admin signing in with valid credentials

        Only test the admin since all users should see the same result.
        If the Admin doesn't get the correct result, no user will.

        #Given There is a "ADMIN"
        Given I navigate to the "login" page
        Given I am a "ADMIN"
        When I authenticate with valid credentials
        Then I should see the "users" page
        And I sign out
        Then I should see the "login" page
