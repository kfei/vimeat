require './vimeat'
require 'em-websocket'
require 'em-http-request'

_SINATRA_PORT = '80'
# Warning: Change the websocket port here does not automatically change the javascript client side.
_WEBSOCKET_PORT = '3001'

EM.run do
  @clients = []

  EM::WebSocket.start(:host => '0.0.0.0', :port => _WEBSOCKET_PORT) do |ws|
    ws.onopen do |handshake|
      @clients << ws
      # Send some connected message if needed.
      # ws.send "Connected to #{handshake.path}."
    end

    ws.onclose do
      ws.send "Websocket closed."
      @clients.delete ws
    end

    ws.onmessage do |msg|
      msg = JSON.parse(msg)
      msg['ip'] = Socket.unpack_sockaddr_in(ws.get_peername)[1]

      puts "Received Message : #{msg}"

      http = EventMachine::HttpRequest.new("http://127.0.0.1:#{_SINATRA_PORT}/today/comments").post({
        :head => {
          'content-type' => 'application/json',
          'accept' => 'application/json',
          'Accept-Encoding' => 'gzip,deflate,sdch'
        },
        :body => JSON.generate(msg)
      })

      @clients.each do |socket|
        socket.send JSON.generate(msg)
      end
    end
  end

  server = 'thin'
  host  = '0.0.0.0'
  port = _SINATRA_PORT
  web_app = VimEat.new

  dispatch = Rack::Builder.app do
    map '/' do
      run web_app
    end
  end

  Rack::Server.start({
    app: dispatch,
    server: server,
    Host: host,
    Port: port
  })
end
