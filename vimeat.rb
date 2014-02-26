require 'rubygems'
require 'sinatra/base'
require 'sinatra/json'
require 'json'

class VimEat < Sinatra::Base
	helpers Sinatra::JSON

	set :public_folder, 'public/app'
	
	get '/' do
		# init(), for example, create today's today.json
		#File.read(File.join('public', 'app/index.html'))
		redirect '/index.html'
	end

	# Restaurant
	get '/restaurants' do
		# List all restaurants
		content_type :json
    	File.read('jsons/restaurants.json')
	end
	post '/restaurants/create' do
		# Create a new restaurant
		name = params['name']
		suggestor = params['suggestor']

		r = {}
		r['name'] = name
		r['suggestor'] = suggestor

		json_file = JSON.parse(File.read('jsons/restaurants.json'))

		File.open('jsons/restaurants.json','w') do |f|
			tmp = {}
			tmp['restaurants'] = json_file['restaurants'].push(r)
			f.write(tmp.to_json)
		end

		"#{name} created by #{suggestor}"
	end
	get '/restaurants/:id' do |id|
		# Get restaurants
		json_file = JSON.parse(File.read('jsons/restaurants.json'))
		# Return specific restaurant information
		json json_file['restaurants'][id.to_i].to_json
	end
	put '/restaurants/update/:id' do |id|
		# Update a restaurant
		'#{id}.put'
	end

end