import express from "express"
import { WebSocketConnectionManager } from "../connectionManager.js"
import { NotificationMessage, NotificationTypes } from "../index.js"

const app = express()
const solidNS = new WebSocketConnectionManager()
app.get('/*', (req, res, next) => {
    console.log('in the middleware')
    solidNS.getDescriptionResource(req.url)
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