# suite-js-sdk

[![Codeship Status for emartech/suite-js-sdk](https://codeship.com/projects/754d4680-a546-0132-cbce-72e52541da30/status?branch=master)](https://codeship.com/projects/66642)
[![Dependency Status](https://david-dm.org/emartech/suite-js-sdk.svg)](https://david-dm.org/emartech/suite-js-sdk)

Simple Javascript wrapper for the Emarsys API.

> Important: This library does not support WSSE authentication. It is intended only to be used by Emarsys add-ons and internal services.

## Installation

    npm install --save suite-js-sdk

## Testing

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

### Prerequisites

The koa bodyparser module should be installed and in use **before** the use of
the koaMiddleware.

    npm install koa-bodyparser -S

In application configuration:

    var bodyParser = require('koa-bodyparser');

    var app = koa();
    app.use(bodyParser());

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

    suiteAPI.administrator.getAdministrators({}, {
        customerId: 20234245
    });

In the example above, the API will be called with `customerId = 20234245`.

#### Administrators

##### [List](https://dev.emarsys.com/v2/accounts/list-administrator-accounts)

    suiteAPI.administrator.getAdministrators(payload, options);

##### Get By Name

Data of an admin can be queried by providing its name.

    suiteAPI.administrator.getAdministratorByName(payload, options);

##### [Patch](https://dev.emarsys.com/v2/accounts/update-an-administrator-account)

    suiteAPI.administrator.patchAdministrator(payload, options);

##### [Create](https://dev.emarsys.com/v2/accounts/create-an-administrator-account)

    suiteAPI.administrator.createAdministrator(payload, options);

##### [Delete]()

    suiteAPI.administrator.deleteAdministrator(payload, options);

##### Disable

Changes the status of the admin to disabled so logging in will not be possible.

    suiteAPI.administrator.disableAdministrator(payload, options);

##### Enable

Changes the status of the disabled admin back to enabled so logging in becomes possible.

    suiteAPI.administrator.enableAdministrator(payload, options);

##### [Get Interface Languages](https://dev.emarsys.com/v2/accounts/get-user-interface-languages)

    suiteAPI.administrator.getInterfaceLanguages(payload, options);

##### [Get Start Pages](https://dev.emarsys.com/v2/accounts/list-administrator-start-pages)

Returns the start pages of an administrator.

    suiteAPI.administrator.getStartPages(payload, options);

##### [Get Access Levels](https://dev.emarsys.com/v2/accounts/list-access-levels)

    suiteAPI.administrator.getAccessLevels(payload, options);

##### Promote to Superadmin

Levels up an admin to a superadmin.

    suiteAPI.administrator.promoteToSuperadmin(payload, options);

##### Create Superadmin

Creates a superadmin.

    suiteAPI.administrator.createSuperadmin(payload, options);

##### Invite Existing Administrator

Sets the status of the admin to disabled and invites the admin again. The admin can log in only after completing the
necessary data on the invitation form.

    suiteAPI.administrator.inviteExistingAdministrator(payload, options);

#### AutomationCenter

##### [ProgramResource](https://dev.emarsys.com/v2/programs/list-program-resources-in-use)

    suiteAPI.automationCenter.programResource(payload, options);

##### [ProgramsEntrypoints](https://dev.emarsys.com/v2/programs/start-program)

    suiteAPI.automationCenter.programsEntrypoints(payload, options);

#### Campaign

##### create

    suiteAPI.campaign.create(payload, options);

##### update

    suiteAPI.campaign.update(payload, options);

#### Condition

##### List

    suiteAPI.condition.list(payload, options);

##### List with contact fields

    suiteAPI.condition.listWithContactFields(payload, options);

#### Contact

##### [GetData](https://dev.emarsys.com/v2/contacts/get-contact-data)

    suiteAPI.contact.getData(payload, options);

To return the contacts with string field ids, specify `{ stringIds: true }` in the options.

    suiteAPI.contact.getData(payload, { stringIds: true });

##### [Create](https://dev.emarsys.com/v2/contacts/create-contacts)

    suiteAPI.contact.create(payload, options);

##### Merge

    suiteAPI.contact.merge(payload, options);

##### [Update](https://dev.emarsys.com/v2/contacts/update-contacts)

    suiteAPI.contact.update(payload, options);

##### [Create or update](https://dev.emarsys.com/v2/contacts/update-contacts)

    suiteAPI.contact.createOrUpdate(payload, options);

##### [Delete](https://dev.emarsys.com/v2/contacts/delete-contact)

    suiteAPI.contact.delete(payload, options);

#### Contact List

##### [Create](https://dev.emarsys.com/v2/contact-lists/create-a-contact-list)

    suiteAPI.contactList.create(payload, options);

##### [List](https://dev.emarsys.com/v2/contact-lists/list-contact-lists)

    suiteAPI.contactList.list(payload, options);

##### [Add](https://dev.emarsys.com/v2/contact-lists/add-contacts-to-a-contact-list)

    suiteAPI.contactList.add(payload, options);

##### [ListContactLists](https://dev.emarsys.com/v2/contact-lists/list-contact-lists)

    suiteAPI.contactList.listContactLists(payload, options);

##### [Count](https://dev.emarsys.com/v2/contact-lists/count-contacts-in-a-contact-list)

    suiteAPI.contactList.count(payload, options);

##### [GetContactsData](https://dev.emarsys.com/v2/contact-lists/get-contact-data-in-a-contact-list)

    suiteAPI.contactList.getContactsData(payload, options);

##### [DeleteList](https://dev.emarsys.com/v2/contact-lists/delete-a-contact-list)

    suiteAPI.contactList.deleteList(payload, options);

#### ExternalEvent

##### [Create](https://dev.emarsys.com/v2/events/create-an-external-event)

    suiteAPI.externalEvent.create(payload, options);

##### [List](https://dev.emarsys.com/v2/events/list-external-events)

    suiteAPI.externalEvent.list(payload, options);

##### [Get Event Details](https://dev.emarsys.com/v2/events/list-external-events)

    suiteAPI.externalEvent.get(payload, options);

##### [Update](https://dev.emarsys.com/v2/events/update-an-external-event)

    suiteAPI.externalEvent.update(payload, options);

##### [Delete](https://dev.emarsys.com/v2/events/delete-an-external-event)

    suiteAPI.externalEvent.delete(payload, options);

##### [Trigger](https://dev.emarsys.com/v2/events/trigger-external-events)

    suiteAPI.externalEvent.trigger(payload, options);

#### Language

##### Translate

Lists available languages for a customer in the customer's own language.

    suiteAPI.language.translate(payload, options);

#### Settings

##### [Get](https://dev.emarsys.com/v2/accounts/get-customer-settings)

    suiteAPI.settings.getSettings(payload, options);

##### Get Corporate Domains

Lists the permitted corporate domains of the customer. If corporate domains are set, registration is possible only with
those email addresses which meet these requirements.

    suiteAPI.settings.getCorporateDomains(payload, options);

##### Set Corporate Domains

Accepted corporate domains can be defined.

    suiteAPI.settings.setCorporateDomains(payload, options);

##### Get IP Restrictions

Lists the permitted IP address rules (e.g. 192.168.* allows IP addresses which start with these two numbers and can end
in any numbers).

    suiteAPI.settings.getIpRestrictions(payload, options);

##### Set IP Restrictions

Possible IP address rules can be defined.

    suiteAPI.settings.setIpRestrictions(payload, options);

##### Get available languages

    suiteAPI.settings.getLanguages(payload, options);

##### Get security settings

Get security settings (IP whitelisting enabled option)

    suiteAPI.settings.getSecuritySettings(payload, options);

##### Set security settings

Set security settings (IP whitelisting enabled option)

    suiteAPI.settings.setSecuritySettings(payload, options);

##### Get sender domains

    suiteAPI.settings.getDeliverabilitySenderDomains(payload, options);

##### Set sender domain

    suiteAPI.settings.setDeliverabilitySenderDomain(payload, options);

#### Email

##### [Create](https://dev.emarsys.com/v2/email-campaigns/create-an-email-campaign)

    suiteAPI.email.create(payload, options);

##### [Copy](https://dev.emarsys.com/v2/email-campaigns/copy-an-email-campaign)

    suiteAPI.email.copy(payload, options);

##### [Update source](https://dev.emarsys.com/v2/email-campaigns/update-an-email-campaign-recipient-source)

    suiteAPI.email.updateSource(payload, options);

##### [Launch](https://dev.emarsys.com/v2/email-campaign-life-cycle/launch-an-email-campaign)

    suiteAPI.email.launch(payload, options);

##### [Launch list](https://dev.emarsys.com/v2/email-campaign-life-cycle/list-email-campaign-launches)

    suiteAPI.email.launchList(payload, options);

##### [List](https://dev.emarsys.com/v2/email-campaigns/list-email-campaigns)

    suiteAPI.email.list(payload, options);

##### [Get](https://dev.emarsys.com/v2/email-campaigns/get-email-campaign-data)

    suiteAPI.email.get(payload, options);

##### [Patch](https://dev.emarsys.com/v2/email-campaigns/update-an-email-campaign)

    suiteAPI.email.patch(payload, options);

##### [Sending a Test Email](https://dev.emarsys.com/v2/email-campaign-life-cycle/send-a-test-email)

    suiteAPI.email.sendTestMail(payload, options);

##### [Delivery Status](https://dev.emarsys.com/v2/email-campaign-life-cycle/query-delivery-status)

    suiteAPI.email.getDeliveryStatus(payload, options);

##### [Response](https://dev.emarsys.com/v2/email-campaign-life-cycle/get-email-response-metrics-and-deliverability-results)

    suiteAPI.email.responses(payload, options);

##### [getResponseSummary](https://dev.emarsys.com/v2/email-campaign-life-cycle/get-a-response-summary)

Returns the summary of the responses of a launched, paused, activated or deactivated email campaign.

    suiteAPI.email.getResponseSummary(payload, options);

##### Querying Email Personalizations

Lists all possible alternate texts with their email campaigns. Alternate texts are defined for a specific field, and
displayed in the email campaign if this field has no value.

    suiteAPI.email.getPersonalizations(payload, options);

##### Updating Email Personalizations

Updates alternate texts.

    suiteAPI.email.setPersonalizations(payload, options);

##### [Creating a Tracked Link](https://dev.emarsys.com/v2/tracked-links/create-a-tracked-link-in-an-email-campaign)

    suiteAPI.email.createTrackedLink(payload, options);

##### [Querying Tracked Links](https://dev.emarsys.com/v2/tracked-links/list-tracked-links-in-an-email-campaign)

    suiteAPI.email.getTrackedLinks(payload, options);

##### [Updating a Tracked Link](https://dev.emarsys.com/v2/tracked-links/update-a-tracked-link-in-an-email-campaign)

    suiteAPI.email.updateTrackedLink(payload, options);

##### [Deleting Tracked Links](https://dev.emarsys.com/v2/tracked-links/delete-a-tracked-link-in-an-email-campaign)

    suiteAPI.email.deleteTrackedLinks(payload, options);

##### [Export contact list](http://documentation.emarsys.com/resource/developers/endpoints/exporting-data/export-list/)

    suiteAPI.email.getContacts(payload, options);

##### [Deleting Tracked Links](https://documentation.emarsys.com/resource/developers/endpoints/email/delete-all-links/)

    suiteAPI.email.deleteTrackedLinksBySource(payload, options);

##### [Listing Programs Email is used in](https://documentation.emarsys.com/resource/developers/endpoints/email/programs/)

    suiteAPI.email.listPrograms(payload, options);

#### Segment

##### [List contacts](https://dev.emarsys.com/v2/contact-and-email-data/export-a-contact-list)

    suiteAPI.segment.listContacts(payload, options);

##### [Count contacts](https://dev.emarsys.com/v2/segments/count-contacts-in-a-segment)

    suiteAPI.segment.countContacts(payload, options);

##### [List segments](https://dev.emarsys.com/v2/segments/list-segments)

    suiteAPI.segment.listSegments(payload, options);

##### [Get Segment](https://dev.emarsys.com/v2/segments/list-segments)

    suiteAPI.segment.getSegment(payload, options);

##### [Create new segment](https://dev.emarsys.com/v2/segments/create-a-segment)

    suiteAPI.segment.create(payload, options);

##### [Querying contact criteria of a segment](https://dev.emarsys.com/v2/segments/get-segment-contact-criteria)

    suiteAPI.segment.getContactCriteria(payload, options);

##### [Updating contact criteria of a segment](https://dev.emarsys.com/v2/segments/update-contact-criteria-in-a-segment)

    suiteAPI.segment.updateContactCriteria(payload, options);

##### [Run Segment for Single Contact](https://dev.emarsys.com/v2/segments/run-a-contact-segment-single)

    suiteAPI.segment.runForSingleContact(payload, options);

##### [Get Segment Run Status for Single Contact](https://dev.emarsys.com/v2/segments/poll-the-status-of-contact-segment-single)

    suiteAPI.segment.multipleContactsRunStatus(payload, options);

##### [Run Segment for Multiple Contacts](https://dev.emarsys.com/v2/segments/run-a-contact-segment-batch)

    suiteAPI.segment.runForMultipleContacts(payload, options);

##### [Get Segment Run Status for Multiple Contacts](https://dev.emarsys.com/v2/segments/poll-the-status-of-a-segment-run-for-multiple-contacts)

    suiteAPI.segment.multipleContactsRunStatus(payload, options);

#### Combined Segment

##### [List combined segments](https://dev.emarsys.com/v2/segments/list-combined-segments)

    suiteAPI.combinedSegment.list(payload, options);

##### [Create new combined segment](https://documentation.emarsys.com/resource/developers/endpoints/contacts/create-combined-segment/)

    suiteAPI.combinedSegment.create(payload, options);

##### [Querying a combined segment](https://dev.emarsys.com/v2/segments/create-a-combinde-segment)

    suiteAPI.combinedSegment.get(payload, options);

##### [Updating a combined segment](https://dev.emarsys.com/v2/segments/update-a-combined-segment)

    suiteAPI.combinedSegment.update(payload, options);

#### Purchases

##### List

Lists the purchases of customers per day.

    suiteAPI.purchase.list(payload, options);

#### Contact Fields

##### [Create](http://documentation.emarsys.com/resource/developers/endpoints/contacts/create-field/)

    suiteAPI.field.create(payload, options);

##### [Listing Available Fields](https://dev.emarsys.com/v2/fields/list-available-fields)

    suiteAPI.field.get(payload, options);

##### [Listing Available Fields Choices](https://dev.emarsys.com/v2/fields/list-available-choices-of-a-single-field)

    suiteAPI.field.getChoices(payload, options);

##### [Listing Available Fields Choices for multiple fields](https://dev.emarsys.com/v2/fields/list-available-choices-of-multiple-field)

    suiteAPI.field.getMultipleChoices(payload, options);

#### Export

##### [Downloading export data](https://dev.emarsys.com/v2/contact-and-email-data/download-export-data)

    suiteAPI.export.getData(payload, options);

##### [Get Changes](https://help.emarsys.com/hc/en-us/articles/115004497073)

    suiteAPI.export.getChanges(payload, options);

#### Keyring

Manage customer PKI options

##### list

    suiteAPI.keyring.list(payload, options);

##### get

    suiteAPI.keyring.get(payload, options);

##### create

    suiteAPI.keyring.create(payload, options);

##### delete

    suiteAPI.keyring.delete(payload, options);

#### Contact Sources

##### [Create](https://dev.emarsys.com/v2/contact-sources/create-a-contact-source)

  suiteAPI.source.create(payload, options);

##### [Listing Sources](https://dev.emarsys.com/v2/contact-sources/list-contact-sources)

  suiteAPI.source.listSources(payload, options);
