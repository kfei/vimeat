class VimEat < Sinatra::Base
  # Get drink
  get '/drink/:id' do |id|
    drinks = JSON.parse(get_json_all('drink'))
    index = drinks['drinks'].index { |r| r['id'] == id }
    json drinks['drinks'][index]
  end
  	
  # Update a drink
  post '/drink/:id' do |id|
    json_request = JSON.parse(request.body.read)
    json_obj = JSON.parse(get_json_all('drink'))
    json_obj['drinks'].each do |r|
      if (r['id'] == id)
        r['name'] = json_request['name']
        r['creator'] = json_request['creator']
        r['img'] = json_request['img']
        r['phone'] = json_request['phone']
        r['min'] = json_request['min']
      end
    end
    update_json('drink', json_obj)
    200
  end
  	
  # Delete a drink
  delete '/drink/:id' do |id|
    json_obj = JSON.parse(get_json_all('drink'))
    json_obj['drinks'].delete_if { |r| r['id'] == id }
    update_json('drink', json_obj)
    200
  end
end
