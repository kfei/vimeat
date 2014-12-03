class VimEat < Sinatra::Base
	# List all restaurants
	get '/restaurants' do
		content_type :json
		restaurants = JSON.parse(get_json_all('restaurant'))
		JSON.pretty_generate(restaurants)
	end

	# Create a new restaurant
	post '/restaurants' do
		# Generates random string id for the new restaurant
		id = ('A'..'Z').to_a.shuffle[0,10].join
		# Add a random id
		json_request = {'id' => id}.merge(JSON.parse(request.body.read))

		f = get_json_all('restaurant')
		f = '{"restaurants":[]}' if f.empty?
		json_obj = JSON.parse(f)

		tmp = {}
		tmp['restaurants'] = json_obj['restaurants'].unshift(json_request)
		update_json('restaurant', tmp)
		200
	end
end
