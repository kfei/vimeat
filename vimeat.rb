require 'rubygems'
require 'sinatra/base'
require 'sinatra/json'
require 'json'

class VimEat < Sinatra::Base
	helpers Sinatra::JSON

	set :public_folder, 'public/app'
	
	get '/' do
		# init(), for example, create today's today.json
		File.read(File.join('public', 'app/index.html'))
		#redirect '/index.html'
	end

	# List all restaurants
	get '/restaurants' do
		content_type :json
    	File.read('jsons/restaurants.json')
	end
	# Create a new restaurant
	post '/restaurants/create' do
		# Read the new restaurant object from http request (json format)
		json_request = JSON.parse(request.body.read)

		f = File.read('jsons/restaurants.json')

		f = '{"restaurants":[]}' if f.empty?

		json_file = JSON.parse(f)
		File.open('jsons/restaurants.json','w') do |f|
			tmp = {}
			tmp['restaurants'] = json_file['restaurants'].push(json_request)
			f.write(tmp.to_json)
		end

		200
	end
	# Get restaurants
	get '/restaurants/:id' do |id|
		restaurants = get_all_restaurants
		json restaurants['restaurants'][id.to_i].to_json
	end
	# Update a restaurant
	put '/restaurants/update/:id' do |id|
		# Update a restaurant
		'#{id}.put'
	end

	# Get today's random pick
	get '/today' do
		dateStr = `date "+%Y%m%d"`.chop!
		content_type :json
    	read_or_create_today_random_pick
	end
	# Update today's random pick, most likey a vote action.
	post '/today' do
		
		json_request = JSON.parse(request.body.read)
		index = json_request['index']
		voter = json_request['voter']

		today = JSON.parse(read_or_create_today_random_pick)
		today['today'][index]['vote'] += 1
		today['today'][index]['voters'].push(voter)

		update_today_random_pick(today)
	end

end

def read_or_create_today_random_pick
	date_str = `date "+%Y%m%d"`.chop!
	file_name = "jsons/#{date_str}.json"
	
	if(!FileTest.exists?(file_name))
		# today = { "today" : [ { "restaurant" : "KFC", "vote" : 3, "voters" : ["a", "b", "c", ... ] }, {...}, {...} ] }
		list = Array.new(3) { Hash.new }
		i = 0
		get_all_restaurants['restaurants'].sample(3).each do |x|
			# Initializes the today's array
			list[i] = { "restaurant" => "#{x['name']}", "vote" => 0, "voters" => Array.new }
			i += 1
	    end

	    today = { "today" => list }

		File.open(file_name,'w') do |f|
			f.write(today.to_json)
		end
	end

	File.read(file_name)
end

def get_all_restaurants
	JSON.parse(File.read('jsons/restaurants.json'))
end

def update_today_random_pick(today)
	date_str = `date "+%Y%m%d"`.chop!

	File.open('jsons/#{date_str}.json','w') do |f|
			f.write(today.to_json)
	end
end