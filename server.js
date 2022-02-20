const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')
const port = 8080
const crypto = require('crypto')
// require('events').EventEmitter.defaultMaxListeners = Infinity;  



const httpServer = http.createServer((req, res)=>{
    res.writeHead(200, {'Content-Type' : 'text/html'})
    // res.write(req.url)
    const q = url.parse(req.url, true)
    const fileName = '.' + q.pathname
    console.log(fileName)
    if(fileName == './'){
        return fs.readFile(fileName+'index.html', (err, data)=>{
            if(err){
                res.writeHead(404, {'Content-Type': 'text/html'})
                return res.end('404 not found')
            }
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.write(data)
            
            return res.end()
        })
    }
    fs.readFile(fileName, (err, data)=>{
        if(err){
            res.writeHead(404, {'Content-Type': 'text/html'})
            return res.end('404 not found')
        }
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(data)
        
        return res.end()
    })
    fs.watchFile(fileName, (file, event)=>{
        if(file){
            console.log('changes detected', fileName)
        }
    })
})

httpServer.on('upgrade', (req, socket)=>{
    console.log('upgrade is on the way...')

    if(req.headers['upgrade'] !== 'websocket'){
        socket.end('HTTP/1.1  404 BAD REQUEST')
        return
    }
    const socketKey = req.headers['sec-websocket-key']

    const hash = generateAcceptKey(socketKey)
    const responseHeaders = ['HTTP/1.1 101 Web Socket Protocol Handshake', 'Upgrade: websocket', 'Connection: upgrade', `Sec-WebSocket-Accept: ${hash}`]
     
    
    const protocol = req.headers['sec-websocket-protocol']
    
    const protocols = !protocol ? [] : protocol.split(' ').map(s=> s.trim())
    if(protocols.includes('json')){
        responseHeaders.push(`Sec-WebSocket-Protocol: json`)
    }
    
    socket.write(responseHeaders.join('\r\n') + '\r\n\r\n')
})  

function generateAcceptKey(acceptKey){
    return crypto.createHash('sha1', )
    .update(acceptKey + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', 'binary')
    .digest('base64')
}

httpServer.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})






