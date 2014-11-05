class VimEat < Sinatra::Base
	# Get restaurant
	get '/restaurant/:id' do |id|
		restaurants = JSON.parse(get_json_all('restaurant'))
		index = restaurants['restaurants'].index { |r| r['id'] == id }
		json restaurants['restaurants'][index]
	end
	
	# Update a restaurant
	post '/restaurant/:id' do |id|
		json_request = JSON.parse(request.body.read)
		json_obj = JSON.parse(get_json_all('restaurant'))
		json_obj['restaurants'].each do |r|
			if (r['id'] == id)
				# Assign each key-value to preserve the order
				r['name'] = json_request['name']
				r['creator'] = json_request['creator']
				r['tags'] = json_request['tags']
				r['img'] = json_request['img']
				r['phone'] = json_request['phone']
				r['sleep'] = json_request['sleep']
				r['ship'] = json_request['ship']
				r['ac'] = json_request['ac']
				r['min'] = json_request['min']
			end
		end
		update_json('restaurant', json_obj)
		200
	end
	
	# Delete a restaurant
	delete '/restaurant/:id' do |id|
		json_obj = JSON.parse(get_json_all('restaurant'))
		json_obj['restaurants'].delete_if { |r| r['id'] == id }
		update_json('restaurant', json_obj)
		200
	end
end