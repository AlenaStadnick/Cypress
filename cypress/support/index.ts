declare namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-namespace
        interface Chainable {
            checkStatusCode(code:number): Chainable
            sentRequest(type: string, endpoint: string, code?, payload?, schema?): Chainable
        }
}