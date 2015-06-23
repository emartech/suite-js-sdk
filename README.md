# suite-js-sdk [ ![Codeship Status for emartech/suite-js-sdk](https://codeship.com/projects/754d4680-a546-0132-cbce-72e52541da30/status?branch=master)](https://codeship.com/projects/66642)

Simple Javascript wrapper for the Emarsys API.

## Installation

    npm install --save suite-js-sdk

## Develop

    npm test

## Emarsys API Hint

This wrapper tries to implement all available methods of the Emarsys API in a
node fashion, exposing a **Promise-only interface**.



However, the Emarsys API lacks a decent amount of methods that you expect an API to provide.
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
    var suiteAPI = SuiteAPI.create(options);

#### Options

* `{String} customerId`: the id of the customer
* `{String} cacheId`: cacheId can be anything. If you want to cache / request you can use 'koa-request-id'
* `{Object} escherOptions`: if not provided will be read from environment variables


### SDK methods

Each of the following methods take a last `options` parameter as a last argument. With
this options set you can override the `customerId`, `escherOptions`, etc. that you had defined when created an
instance from the API client, like:


    var SuiteAPI = require('suite-js-sdk').api;
    var suiteAPI = SuiteAPI.create({
       customerId: 1083232
    });

    suiteAPI.administrator.getAdministrators({
        customerId: 20234245
    });

In the example above, the API will be called with `customerId = 20234245`.

#### Administrators

##### List

    suiteAPI.administrator.getAdministrators(customerId);

##### Get

    suiteAPI.administrator.getAdministrator(customerId, adminId);

##### Get By Name

    suiteAPI.administrator.getAdministratorByName(customerId, adminName);

##### Patch

    suiteAPI.administrator.patchAdministrator(customerId, adminId, payload);

##### Create

    suiteAPI.administrator.createAdministrator(customerId, payload);

##### Delete

    suiteAPI.administrator.deleteAdministrator(customerId, adminId, successorId);

##### Disable

    suiteAPI.administrator.disableAdministrator(customerId, adminId);

##### Enable

    suiteAPI.administrator.enableAdministrator(customerId, adminId, additionalDataToModify);

##### Get Interface Languages

    suiteAPI.administrator.getInterfaceLanguages(customerId);

##### Get Access Levels

    suiteAPI.administrator.getAccessLevels(customerId);

##### Promote to Superadmin

    suiteAPI.administrator.promoteToSuperadmin(customerId, adminId, additionalDataToModify);

##### Create Administrator

    suiteAPI.administrator.createAdministrator(customerId, additionalDataToModify);

##### Create Superadmin

    suiteAPI.administrator.createSuperadmin(customerId, additionalDataToModify);

##### Invite Existing Administrator

    suiteAPI.administrator.inviteExistingAdministrator(customerId, adminId, additionalDataToModify);

#### Contact

##### Create

    suiteAPI.contact.create(customerId, payload);

#### Contact List

##### Create

    suiteAPI.contactList.create(customerId, name, contactId);

##### List

    suiteAPI.contactList.list(customerId, contactListId, offset, limit);

#### ExternalEvent

##### Trigger

    suiteAPI.externalEvent.trigger(customerId, eventId, payload);

#### Language

##### Translate

    suiteAPI.language.translate(customerId, languageId);

#### Settings

##### Get

    suiteAPI.settings.getSettings(customerId);

##### Get Corporate Domains

    suiteAPI.settings.getCorporateDomains(customerId);

##### Set Corporate Domains

    suiteAPI.settings.setCorporateDomains(customerId, corporateDomainsArray);

#### Email

##### Copy

    suiteAPI.email.copy(customerId, emailId, payload);

##### Update source

    suiteAPI.email.updateSource(customerId, emailId, payload);

##### Launch

    suiteAPI.email.launch(customerId, emailId, schedule, timezone);

##### List

    suiteAPI.email.list(customerId);

#### Segment

##### List contacts

    suiteAPI.segment.listContacts(customerId, segmentId);


    suiteAPI.segment.listContacts(customerId, segmentId, {
        segment_id: 11,
        limit: 20,
        skip: 20

    });

##### List contacts

    suiteAPI.segment.listSegments(customerId);

#### Purchases

##### List

    suiteAPI.purchase.list(customerId, startDate, endDate, offset, limit);
