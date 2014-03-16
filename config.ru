require './vimeat'
require 'em-websocket'

EM.run do
  @clients = []

  EM::WebSocket.start(:host => '0.0.0.0', :port => '3001') do |ws|
    ws.onopen do |handshake|
      @clients << ws
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

      @clients.each do |socket|
        socket.send JSON.generate(msg)
      end
    end
  end

  server = 'thin'
  host  = '0.0.0.0'
  port = '8080'
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