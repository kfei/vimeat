class VimEat < Sinatra::Base
	# List all restaurants
	get '/restaurants' do
		content_type :json
    	get_all_restaurants_json
	end

	# Create a new restaurant
	post '/restaurants' do
		# Generates random string id for the new restaurant
		id = ('A'..'Z').to_a.shuffle[0,10].join
		# Add a random id
		json_request = {'id' => id}.merge(JSON.parse(request.body.read))

		f = get_all_restaurants_json
		f = '{"restaurants":[]}' if f.empty?
		json_obj = JSON.parse(f)

		tmp = {}
		tmp['restaurants'] = json_obj['restaurants'].unshift(json_request)
		update_restaurants_json(tmp)
		200
	end


	# Method to delete a key from the restaurants hash
	# delete '/restaurants/key' do
	# 	f = get_all_restaurants_json
	# 	f = JSON.parse(f)
	# 	tmp = {}
	# 	tmp['restaurants'] = []

	# 	f['restaurants'].each do |r|
	# 		tmp['restaurants'].push(r.delete_if { |key, value| key == '<key_name>'})
	# 	end
	# 	update_restaurants_json(tmp)
	# 	200
	# end
end