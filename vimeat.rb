require 'rubygems'
require 'sinatra/base'
require 'sinatra/json'
require 'json'
require 'thin'

class VimEat < Sinatra::Base
	helpers Sinatra::JSON

	set :public_folder, 'public/app'
	
	get '/' do
		File.read(File.join('public', 'app/index.html'))
	end

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
		# Add a count field
		json_request.merge!({'count' => 0})

		f = get_all_restaurants_json
		f = '{"restaurants":[]}' if f.empty?
		json_obj = JSON.parse(f)

		tmp = {}
		tmp['restaurants'] = json_obj['restaurants'].unshift(json_request)
		update_restaurants_json(tmp)
		200
	end
	
	# Get restaurant
	get '/restaurant/:id' do |id|
		restaurants = JSON.parse(get_all_restaurants_json)
		index = restaurants['restaurants'].index { |r| r['id'] == id }
		json restaurants['restaurants'][index]
	end
	
	# Update a restaurant
	post '/restaurant/:id' do |id|
		json_request = JSON.parse(request.body.read)
		json_obj = JSON.parse(get_all_restaurants_json)
		json_obj['restaurants'].each do |r|
			if (r['id'] == id)
				# Assign each key-value to preserve the order
				r['name'] = json_request['name']
				r['creator'] = json_request['creator']
				r['tags'] = json_request['tags']
				r['sleep'] = json_request['sleep']
			end
		end
		update_restaurants_json(json_obj)
		200
	end
	
	# Delete a restaurant
	delete '/restaurant/:id' do |id|
		json_obj = JSON.parse(get_all_restaurants_json)
		json_obj['restaurants'].delete_if { |r| r['id'] == id }
		update_restaurants_json(json_obj)
		200
	end

	post '/image' do
		file_name = 'public/app/img/' + params['file'][:filename]
		File.open(file_name, "w") do |f| 
    		f.write (params['file'][:tempfile].read)
  		end
  		200
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
		voter = request.ip

		today = JSON.parse(read_or_create_today_random_pick)

		# If the voter still not voted on any restaurants
		result = 1
		if (voter_is_valid_today(voter, today))
			today['today'][index]['vote'] += 1
			today['today'][index]['voters'].push(voter)
			update_today_random_pick(today)
			result = 0
		end
		
		response = {'result' => result, 'voter' => voter }

		content_type :json
		json response
	end

end

def read_or_create_today_random_pick
	date_str = `date "+%Y%m%d"`.chop!
	file_name = "jsons/#{date_str}.json"
	
	if(!FileTest.exists?(file_name))
		# today = { "today" : [
		#           { "restaurant" : "KFC", "vote" : 3, "voters" : ["a", "b", "c", ... ], "sleep" : true, "img" : "file.jpg", "count" : 0 },
		#           {...}, {...}, ..., {...} ] 
		#         }
		list = Array.new(3) { Hash.new }
		all = JSON.parse(get_all_restaurants_json)


		# First, select one restaurants with sleep tag
		guarantee = all['restaurants'].select{ |r| r['sleep'] == true }.sample(1)[0]
		list[0] = { "restaurant" => guarantee['name'], "vote" => 0, "voters" => Array.new, "sleep" => guarantee['sleep'], "img" => guarantee['img'] }

		# 
		i = 1
		all['restaurants'].select{ |r| r['id'] != guarantee['id'] }.sample(2).each do |x|
			# Initializes the today's array
			if x['img']
				list[i] = { "restaurant" => x['name'], "vote" => 0, "voters" => Array.new, "sleep" => x['sleep'], "img" => x['img'] }
			else
				list[i] = { "restaurant" => x['name'], "vote" => 0, "voters" => Array.new, "sleep" => x['sleep'] }
			end
			i += 1
	    end

	    today = { "today" => list }

		File.open(file_name,'w') do |f|
			f.write(today.to_json)
		end
	end

	File.read(file_name)
end

def get_all_restaurants_json

	file_name = 'jsons/restaurants.json'
	if(!FileTest.exists?(file_name))
		return ""
	end

	File.read(file_name)
end

def update_today_random_pick(today)
	date_str = `date "+%Y%m%d"`.chop!

	File.open("jsons/#{date_str}.json",'w') do |f|
			f.write(today.to_json)
	end
end

def voter_is_valid_today(voter, today)
	[0, 1, 2].each do |i|
		if (today['today'][i]['voters'].include?(voter))
			return false
		end
	end
	return true
end

def update_restaurants_json(obj)
	File.open('jsons/restaurants.json','w') do |f|
		f.write(obj.to_json)
	end
end