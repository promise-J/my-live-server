

const ws = new WebSocket('ws://localhost:8080', ['json', 'xml'])

ws.addEventListener('open', ()=>{
    console.log('this connection is open on the client side')
    ws.send('connection opened')
})



