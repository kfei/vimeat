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
			list[0] = { "restaurant" => guarantee['name'],\
						      "vote" => 0,\
						    "voters" => Array.new,\
						     "sleep" => guarantee['sleep'],\
						      "ship" => guarantee['ship'],\
						       "img" => guarantee['img'] }

			i = 1
			all['restaurants'].select{ |r| r['id'] != guarantee['id'] }.sample(2).each do |x|
				# Initializes the today's array
				list[i] = { "restaurant" => x['name'],\
							      "vote" => 0,\
							    "voters" => Array.new,\
							     "sleep" => x['sleep'],\
							      "ship" => x['ship'],\
							       "img" => x['img'] }
				i += 1
		    end

		    today = { "today" => list }

			File.open(file_name,'w') do |f|
				f.write(today.to_json)
			end
		end

		File.read(file_name)
	end

	def blackbox_pick(date, id)
		file_name = "jsons/#{date}.json"

		all = JSON.parse(get_all_restaurants_json)

		x = all['restaurants'].select { |r| r['id'] == id }
		if x.size != 1
			puts "ID: #{id} IS NOT FOUND"
			return
		else
			x = x[0]
		end

		black = { "restaurant" => x['name'],\
			            "vote" => 0,\
			          "voters" => Array.new,\
			           "sleep" => x['sleep'],\
			            "ship" => x['ship'],\
			             "img" => x['img'] }

		list = Array.new(3) { black }
		today = { "today" => list, "random" => false }
		File.open(file_name,'w') do |f|
			f.write(today.to_json)
		end
	end

	def add_comment_on_today(comment)
		today = JSON.parse(read_or_create_today_random_pick)
		index, msg, ip = comment['index'], comment['msg'], comment['ip']
		today['today'][index]['comments'] ||= []
		today['today'][index]['comments'].push(comment.delete_if {|key| key == 'index'})
		update_today_random_pick(today)
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