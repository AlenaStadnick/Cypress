
import {When} from "@badeball/cypress-cucumber-preprocessor";
import {config} from '@config/config';


const BASE_URL = Cypress.env('base_url') as string;
const USER_URL = config.url.authentication.user

When('GET USER info', () => {
    cy.log(`${BASE_URL}/${USER_URL}`)
    cy.sentRequest('get', `${BASE_URL}/${USER_URL}`);
});
