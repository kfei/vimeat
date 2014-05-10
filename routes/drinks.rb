class VimEat < Sinatra::Base
	# List all drinks
	get '/drinks' do
		content_type :json
		drinks = JSON.parse(get_json_all('drink'))
		JSON.pretty_generate(drinks)
	end

	# Create a new drink
	post '/drinks' do
		# Generates random string id for the new drink
		id = ('A'..'Z').to_a.shuffle[0,10].join
		# Add a random id
		json_request = {'id' => id}.merge(JSON.parse(request.body.read))
		json_request['img'] ||= ''

		f = get_json_all('drink')
		f = '{"drinks":[]}' if f.empty?
		json_obj = JSON.parse(f)

		tmp = {}
		tmp['drinks'] = json_obj['drinks'].unshift(json_request)
		update_json('drink', tmp)
		200
	end

	# Method to delete a key from the drinks hash
	# delete '/drinks/key' do
	# 	f = get_json_all('drink')
	# 	f = JSON.parse(f)
	# 	tmp = {}
	# 	tmp['drinks'] = []

	# 	f['drinks'].each do |r|
	# 		tmp['drinks'].push(r.delete_if { |key, value| key == '<key_name>'})
	# 	end
	# 	update_json('drink', tmp)
	# 	200
	# end
end
