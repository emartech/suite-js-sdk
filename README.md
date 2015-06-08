# suite-js-sdk [ ![Codeship Status for emartech/suite-js-sdk](https://codeship.com/projects/754d4680-a546-0132-cbce-72e52541da30/status?branch=master)](https://codeship.com/projects/66642)

Simple Javascript wrapper for the Emarsys API.

## Installation

    npm install --save suite-js-sdk

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

    var middleware = require('suite-js-sdk').authentication.koaMiddleware.getMiddleware();
    
If the authentication fails it throws an error with 401 code.
If the authentication success it decorates the request with a validatedData property. It contains the signed parameters.

## Translation middleware

### Configuration
    
    var middleware = require('suite-js-sdk').translations.koaMiddleware.decorateRenderWithTranslations();

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

    var SuiteAPI = require('suite-js-sdk').api;
    var suiteAPI = SuiteAPI.create();

With cache

    var SuiteAPI = require('suite-js-sdk').api;
    var suiteAPI = SuiteAPI.createWithCache(cacheId);
    
CacheId can be anything. If you want to cache / request you can use 'koa-request-id' 

### Options

Each SDK methods accepts an additional options object as the last argument.

```
{
    rawResponse: true
}
```

Supported option properties:

* `rawResponse`: the SDK method returns not just the data from the response, but all the status codes as well

### Administrators

#### List

    suiteAPI.administrator.getAdministrators(customerId, options);

#### Get

    suiteAPI.administrator.getAdministrator(customerId, adminId, options);

#### Get By Name

    suiteAPI.administrator.getAdministratorByName(customerId, adminName, options);

#### Patch

    suiteAPI.administrator.patchAdministrator(customerId, adminId, payload, options);

#### Create

    suiteAPI.administrator.createAdministrator(customerId, payload, options);

#### Delete

    suiteAPI.administrator.deleteAdministrator(customerId, adminId, successorId, options);
    
#### Disable

    suiteAPI.administrator.disableAdministrator(customerId, adminId, options);
    
#### Enable

    suiteAPI.administrator.enableAdministrator(customerId, adminId, additionalDataToModify, options);
    
#### Get Interface Languages

    suiteAPI.administrator.getInterfaceLanguages(customerId, options);
    
#### Get Access Levels

    suiteAPI.administrator.getAccessLevels(customerId, options);
    
#### Promote to Superadmin

    suiteAPI.administrator.promoteToSuperadmin(customerId, adminId, additionalDataToModify, options);

#### Create Administrator

    suiteAPI.administrator.createAdministrator(customerId, additionalDataToModify, options);

#### Create Superadmin

    suiteAPI.administrator.createSuperadmin(customerId, additionalDataToModify, options);
    
#### Invite Existing Administrator

    suiteAPI.administrator.inviteExistingAdministrator(customerId, adminId, additionalDataToModify, options);
    
### Contact

#### Create

    suiteAPI.contact.create(customerId, payload, options);

### Contact List

#### Create

    suiteAPI.contactList.create(customerId, name, contactIds, options);

#### List

    suiteAPI.contactList.list(customerId, contactListId, options);

### ExternalEvent

#### Trigger

    suiteAPI.externalEvent.trigger(customerId, eventId, payload, options);

### Language

#### Translate

    suiteAPI.language.translate(customerId, languageId, options);

### Settings

#### Get

    suiteAPI.settings.getSettings(customerId, options);

#### Get Corporate Domains

    suiteAPI.settings.getCorporateDomains(customerId, options);

#### Set Corporate Domains

    suiteAPI.settings.setCorporateDomains(customerId, corporateDomainsArray, options);

### Email

#### Copy

    suiteAPI.email.copy(customerId, emailId, payload, options);

#### Update source

    suiteAPI.email.updateSource(customerId, emailId, payload, options);

#### Launch

    suiteAPI.email.launch(customerId, emailId, schedule, timezone, options);

#### List

    suiteAPI.email.list(customerId, options);

### Segment

#### List contacts

    suiteAPI.segment.listContacts(customerId, segmentId, offset, limit, options);

#### List contacts

    suiteAPI.segment.listSegments(customerId, options);

### Smart Insight

#### Get purchases

    suiteAPI.si.getPurchases(customerId, startDate, endDate, offset, limit, options);
