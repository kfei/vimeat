class VimEat < Sinatra::Base
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