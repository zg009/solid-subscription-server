import express, { Request, Response, NextFunction } from "express"
import { WebSocketConnectionManager } from "../connectionManager.js"
import { ChannelType, NotificationTypes } from "./types/utils.js"
import { SubscriptionService } from "./types/subscriptionService.js"
import { DescriptionResource } from "./types/descriptionResource.js"
import { NotificationMessage } from "./types/notificationMessage.js"

const app = express()
const solidNS = new WebSocketConnectionManager()

function createStorageDescriptionMiddleware(link: string) {
  return function(req: Request, res: Response, next: NextFunction) {
    res.appendHeader('Link', `<${link}>; rel="http://www.w3.org/ns/solid/terms#storageDescription"`)
    next()
  }
}

const baseUri = `http://localhost:3000/`
const descriptionResourcePath = `descriptionResource`
const descriptionLink = `${baseUri}${descriptionResourcePath}`
app.use(createStorageDescriptionMiddleware(descriptionLink))

const subscriptionServicePath = `subscription`
const subscriptionServiceUri = `${baseUri}${subscriptionServicePath}`
const subscriptionService = new SubscriptionService(subscriptionServiceUri, ChannelType.WebSocketChannel2023)
subscriptionService.addFeatures("rate")
subscriptionService.addFeatures("state")

const descriptionResource = new DescriptionResource(descriptionLink);
descriptionResource.addSubscription(subscriptionService)

const JSONLD_BASE_URI = 'http://www.w3.org/ns/json-ld#'
const JSONLD_PROFILE_TYPES = [
  `${JSONLD_BASE_URI}expanded`,
  `${JSONLD_BASE_URI}compacted`,
  `${JSONLD_BASE_URI}context`,
  `${JSONLD_BASE_URI}flatted`,
  `${JSONLD_BASE_URI}frame`,
  `${JSONLD_BASE_URI}framed`,
]

function containsJsonLDHeader(req: Request, header: string) {
  const jsonLDHeader = req.headers[header]
  return jsonLDHeader?.includes('application/ld+json') ? true : false
}

function jsonLDContentTypeMiddleware(req: Request, res: Response, next: NextFunction) {

}

function jsonLDHeaderMiddleware(req: Request, res: Response, next: NextFunction) {

}

function hasValidProfileParameters(header: string, values: string[]) {
  if (!header.includes("profile")) {
    return true
  }
  const idx = header.indexOf("profile")
  let end = header.substring(idx).indexOf(";")
  if (end == -1) {
    end = header.length
  }
  let profileParam = header.substring(idx, end)
  let [profile, paramValue] = profileParam.split('=')
  return values.includes(paramValue)
}

const createValidProfileTypesMiddleware = (header: string, values: string[] = JSONLD_PROFILE_TYPES) => {
  return function(req: Request, res: Response, next: NextFunction) {
    if (!containsJsonLDHeader(req, header)) {
      next()
    }
    const jsonLDHeader = req.headers[header] as string
    if (!hasValidProfileParameters(jsonLDHeader, values)) {
      res.status(415).send({ message: "invalid profile parameter in application/ld+json header"})
    }
    next()
  }
}

app.get(descriptionResourcePath, (req, res) => {
  // res.send(JSON.stringify(descriptionResource.generateDoc()))
})

app.get(subscriptionServicePath, (req, res) => {

})

app.head(subscriptionServicePath, (req, res) => {

})

app.options(subscriptionServicePath, (req, res) => {

})

app.post(subscriptionServicePath, (req, res) => {

})

app.get('/*', (req, res, next) => {
    console.log('in the middleware')
    next()
})

app.get('/*', (req, res) => {
    console.log('in the endpoint handler')
    res.sendStatus(200)
})

app.delete('/*', (req, res, next) => {
  res.on('finish', () => {
    if (Math.floor(res.statusCode / 100) === 2) {
    //   console.log(solidNS.uris)
    //   console.log(solidNS.uris.includes(req.url))
      if (solidNS.uris.includes(req.url)) {
        const nm = new NotificationMessage(
            '1',
            NotificationTypes.Delete,
            req.url
        )
        solidNS.sendMessage(req.url, nm)
      }
    }
  })
  next()
})

app.delete('/*', (req, res) => {
    console.log('did an delete')
    res.sendStatus(200)
})



// app.use(() => {
//   const solidNS = new WebSocketConnectionManager()

// //   app.post('/*', (req, res, next) => {
// //     res.on('finish', () => {
// //       if (res.statusCode % 100 === 2) {

// //       }
// //     })
// //     next()
// //   })

// //   app.patch('/*', (req, res, next) => {
// //     res.on('finish', () => {
// //       if (res.statusCode % 100 === 2) {
        
// //       }
// //     })
// //     next()
// //   })

// //   app.put('/*', (req, res, next) => {
// //     res.on('finish', () => {
// //       if (res.statusCode % 100 === 2) {
        
// //       }
// //     })
// //     next()
// //   })

// //   app.delete('/*', (req, res, next) => {
// //     res.on('finish', () => {
// //       if (res.statusCode % 100 === 2) {
// //         if (solidNS.uris.includes(req.url)) {
// //             const nm = new NotificationMessage(
// //                 '1',
// //                 NotificationTypes.Delete,
// //                 req.url
// //             )
// //             solidNS.sendMessage(req.url, nm)
// //         }
// //       }
// //     })
// //     next()
// //   })

//   app.get('/*', (req, res, next) => {
//     console.log('in the middleware')
//     // solidNS.getDescriptionResource(req.url)
//     next()
//   })

// })



const PORT = 8080
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})