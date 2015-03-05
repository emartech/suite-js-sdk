# js-suite-sdk [ ![Codeship Status for emartech/js-suite-sdk](https://www.codeship.io/projects/4916fa40-a024-0132-279d-161c16488463/status?branch=master)](https://www.codeship.io/projects/65359)

Simple Javascript wrapper for the Emarsys API.

## Installation

    npm install --save js-suite-sdk

## Develop

    npm test

## Emarsys API Hint

This wrapper tries to implement all available methods of the Emarsys API in a
node fashion. However, the Emarsys API lacks a decent amount of methods that
you expect an API to provide.
Thus, if methods are missing or a certain implementation
style was choosen it is most likely due to the inconsistency of the API itself.
Feel free to get in touch or submit a pull request if you encounter any problems.

## Configuration and Setup

### Debug

If you want to debug. Set your environment variables

    DEBUG=suite-sdk,suiterequest

## Authentication middleware

### Configuration
    
Set your environment variables

    SUITE_ESCHER_SECRET=yourEscherSecret
    SUITE_ESCHER_CREDENTIAL_SCOPE=yourEscherCredentialScope

### Usage

    var middleware = require('js-suite-sdk').authentication.koaMiddleware.getMiddleware();
    
If the authentication fails it throws an error with 401 code.
If the authentication success it decorates the request with a validatedData property. It contains the signed parameters.

## Translation middleware

### Configuration
    
    var middleware = require('js-suite-sdk').translations.koaMiddleware.decorateRenderWithTranslations();

The middleware use 'validatedData' from the request. 'validatedData' must contains an 'environment' property. 
If you want to load an admins language then 'validatedData' must contains a 'customer_id' and an 'admin_id' properties.
If you want to load a specific language then 'validatedData' must contains a 'language' property.

### Usage

Middleware decorates the render method. It will add 'translations' object as render data. It also adds a '_' method as render data. So you can use it for transations.
    
    translations = {
        dialogs: {
            invitation: {
                confirmation: {
                    message: 'test string with %s and with %s'
                }
            }
        }
    }
    
    
in your jade file     

    p.message= _('dialogs.invitation.confirmation.message', [ 'firstParameter', 'second parameter'])
    
## Interacting with the API

### Authentication

Authenticate with the api credentials provided by your Emarsys account manager.

Set your environment variables

    SUITE_API_KEY=yourApiKey
    SUITE_API_SECRET=yourSecretKey


After in your Codebase

    var SuiteAPI = require('js-suite-sdk').api;
    var suiteAPI = SuiteApi.create();

With cache

    var SuiteAPI = require('js-suite-sdk').api;
    var suiteAPI = SuiteApi.createWithCache(cacheId);
    
CacheId can be anything. If you want to cache / request you can use 'koa-request-id' 

### Administrators

#### List

    suiteAPI.administrator.getAdministrators(customerId);

#### Get

    suiteAPI.administrator.getAdministrator(customerId, adminId);

#### Get By Name

    suiteAPI.administrator.getAdministratorByName(customerId, adminName);

#### Patch

    suiteAPI.administrator.patchAdministrator(customerId, adminId, payload);

#### Create

    suiteAPI.administrator.createAdministrator(customerId, payload);

#### Delete

    suiteAPI.administrator.deleteAdministrator(customerId, adminId, successorId);
    
#### Disable

    suiteAPI.administrator.disableAdministrator(customerId, adminId);
    
#### Enable

    suiteAPI.administrator.enableAdministrator(customerId, adminId, additionalDataToModify);
    
#### Get Interface Languages

    suiteAPI.administrator.getInterfaceLanguages(customerId);
    
#### Get Access Levels

    suiteAPI.administrator.getAccessLevels(customerId);
    
#### Promote to Superadmin

    suiteAPI.administrator.promoteToSuperadmin(customerId, adminId, additionalDataToModify);

#### Create Administrator

    suiteAPI.administrator.createAdministrator(customerId, additionalDataToModify);

#### Create Superadmin

    suiteAPI.administrator.createSuperadmin(customerId, additionalDataToModify);
    
#### Invite Existing Administrator

    suiteAPI.administrator.inviteExistingAdministrator(customerId, adminId, additionalDataToModify);
    
### Contact

#### Create

    suiteAPI.contact.create(customerId, payload);

### ExternalEvent

#### Trigger

    suiteAPI.externalEvent.trigger(customerId, eventId, payload);

### Language

#### Translate

    suiteAPI.language.translate(customerId, languageId);

### Settings

#### Get

    suiteAPI.settings.getSettings(customerId);

#### Get Corporate Domains

    suiteAPI.settings.getCorporateDomains(customerId);

#### Set Corporate Domains

    suiteAPI.settings.setCorporateDomains(customerId, corporateDomainsArray);
