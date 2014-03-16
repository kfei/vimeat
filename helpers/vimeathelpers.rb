module VimEatHelpers
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
end