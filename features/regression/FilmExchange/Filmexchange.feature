Feature: FilmExchange

    As a FilmExchange Admin
    I should Only see Film Exchange Menu option
    and Manage Team Access

    Rules:
    - FilmExchange Admin once login should only see film exchange
    - Can turn on/off access for teams

    Scenario: FilmExchange Admin once login should see filmexchange only

        Given I login as "FILM_EXCHANGE_ADMIN"
        When I switch to role "Film Exchange Admin"
        Then I should see "1" menu options in "FilmExchange" header
