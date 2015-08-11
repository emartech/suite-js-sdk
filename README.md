# suite-js-sdk

[![Codeship Status for emartech/suite-js-sdk](https://codeship.com/projects/754d4680-a546-0132-cbce-72e52541da30/status?branch=master)](https://codeship.com/projects/66642)
[![Dependency Status](https://david-dm.org/emartech/suite-js-sdk.svg)](https://david-dm.org/emartech/suite-js-sdk)

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
* `{String} apiKey`: API key
* `{String} apiSecret`: API secret
* `{String} environment`: API environment

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

    suiteAPI.administrator.getAdministrators(payload);

##### Get

    suiteAPI.administrator.getAdministrator(payload);

##### Get By Name

    suiteAPI.administrator.getAdministratorByName(payload);

##### Patch

    suiteAPI.administrator.patchAdministrator(payload);

##### Create

    suiteAPI.administrator.createAdministrator(payload);

##### Delete

    suiteAPI.administrator.deleteAdministrator(payload);

##### Disable

    suiteAPI.administrator.disableAdministrator(payload);

##### Enable

    suiteAPI.administrator.enableAdministrator(payload);

##### Get Interface Languages

    suiteAPI.administrator.getInterfaceLanguages(payload);

##### Get Access Levels

    suiteAPI.administrator.getAccessLevels(payload);

##### Promote to Superadmin

    suiteAPI.administrator.promoteToSuperadmin(payload);

##### Create Administrator

    suiteAPI.administrator.createAdministrator(payload);

##### Create Superadmin

    suiteAPI.administrator.createSuperadmin(payload);

##### Invite Existing Administrator

    suiteAPI.administrator.inviteExistingAdministrator(payload);

#### Contact

##### Create

    suiteAPI.contact.create(payload);

#### Contact List

##### Create

    suiteAPI.contactList.create(payload);

##### List

    suiteAPI.contactList.list(payload);

##### Add

    suiteAPI.contactList.add(payload);

#### ExternalEvent

##### Trigger

    suiteAPI.externalEvent.trigger(payload);

#### Language

##### Translate

    suiteAPI.language.translate(payload);

#### Settings

##### Get

    suiteAPI.settings.getSettings(payload);

##### Get Corporate Domains

    suiteAPI.settings.getCorporateDomains(payload);

##### Set Corporate Domains

    suiteAPI.settings.setCorporateDomains(payload);

#### Email

##### Copy

    suiteAPI.email.copy(payload);

##### Update source

    suiteAPI.email.updateSource(payload);

##### Launch

    suiteAPI.email.launch(payload);

##### List

    suiteAPI.email.list(payload);

##### Get

    suiteAPI.email.get(payload);

##### Patch

    suiteAPI.email.patch(payload);

#### Segment

##### List contacts

    suiteAPI.segment.listContacts(payload);

##### List contacts

    suiteAPI.segment.listSegments(payload);

#### Purchases

##### List

    suiteAPI.purchase.list(payload);
