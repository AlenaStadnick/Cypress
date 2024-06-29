@api
Feature: Create folder

  Scenario: Get user info
    When GET USER info
    Then Status code is equal 200
    And Values 'user', 'username' in body are equal 'Yosyp Voloshchuk'

  Scenario: Create folder
    When Sent POST request to Create Folder from file 'folders/create_folder.json'
    Then Status code is equal 200
    

  Scenario: Get folders
    When Sent Get request for folder lists
    Then Status code is equal 200
     Then User get id from body

