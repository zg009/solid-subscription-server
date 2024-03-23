import express from "express"
import { WebSocketConnectionManager } from "./connectionManager.ts"
import { NotificationMessage, NotificationTypes } from "./index.ts"

const app = express()

app.use(() => {
  const solidNS = new WebSocketConnectionManager()

  app.post('/*', (req, res, next) => {
    res.on('finish', () => {
      if (res.statusCode % 100 === 2) {

      }
    })
    next()
  })

  app.patch('/*', (req, res, next) => {
    res.on('finish', () => {
      if (res.statusCode % 100 === 2) {
        
      }
    })
    next()
  })

  app.put('/*', (req, res, next) => {
    res.on('finish', () => {
      if (res.statusCode % 100 === 2) {
        
      }
    })
    next()
  })

  app.delete('/*', (req, res, next) => {
    res.on('finish', () => {
      if (res.statusCode % 100 === 2) {
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

  app.get('/*', (req, res, next) => {
    solidNS.getDescriptionResource(req.url)
    next()
  })

})

const PORT = 8080
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})