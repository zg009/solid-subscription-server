# Solid Notifications Server #


### Requests ### 
According to Notifications Protocol, necessary for Subscription Request and response for determining allowed channel and access.

### Types ###
```utils.ts``` - Supporting ENUM types
```descriptionResource.ts``` - for modeling a DescriptionResource file
```notificationChannel.ts``` - for constructing a turtle/json-ld document for a notification channel meta file
```subscriptionService.ts``` - for constructing a turtle/json-ld document for a subscription service response

### Example ###
File contained in ```src/example/``` should have working minimal example server for integration testing at the end for users to view.