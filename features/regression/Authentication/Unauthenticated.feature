@manual
Feature: Authentication with inadequate credentials

    As a user, I should be able to sign-in and be redirected accordingly.
    However, if I do not provide adequate credentials, then I will not be redirected.
    Once signed-in, I should be able to sign-out and be redirected to the login page again.

    Scenario: An unauthenticated Admin signing in with inadequate credentials

        Only test the admin since all users should see the same result.
        If the Admin doesn't get the correct result, no user will.

        Given I navigate to the "login" page
        Given I am a "ADMIN"
        When I authenticate with an invalid password
        Then I should see the "login" page
