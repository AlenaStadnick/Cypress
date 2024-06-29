
import {When} from "@badeball/cypress-cucumber-preprocessor";
import {config} from '@config/config';


 const BASE_URL = Cypress.env('base_url') as string;
const CREATE_FOLDER_URL = config.url.folder.create_folder

When('Sent POST request to Create Folder from file {string}', (filename:string) => {
    cy.fixture(filename).then((body) =>{
const randomString = Math.random().toString(36).substring(2, 15);
    
        body.name = `my name ${randomString}`;
        cy.sentRequest('post', `${BASE_URL}/${CREATE_FOLDER_URL}`, body);
    })
});

    When('Sent Get request for folder lists', () => {
            cy.sentRequest('get', `${BASE_URL}/${CREATE_FOLDER_URL}`);
        })
    
    When('User get id from body', () => {
    cy.get<Cypress.Response<Body>>('@obtainedResponse').then((resp: Cypress.Response<Body>) => {
        const id = String(resp.folders[0].id)
        cy.wrap(id).as('folderId');
    });
});


