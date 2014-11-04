module VimEatHelpers
	def read_or_create_today(blackbox_id = nil)
		date_str = `date "+%Y%m%d"`.chop!
		file_name = "jsons/#{date_str}.json"
		
		if(!FileTest.exists?(file_name))
			i = 0
			list = Array.new(4) { Hash.new }
			all_r = JSON.parse(get_json_all('restaurant'))
			all_d = JSON.parse(get_json_all('drink'))

			if blackbox_id != nil && all_r['restaurants'].select { |r| r['id'] == blackbox_id }.size > 0
				# Blackbox generation
				x = all_r['restaurants'].select { |r| r['id'] == blackbox_id }[0]
				3.times do
					list[i] = { "restaurant" => x['name'],\
								      "vote" => 0,\
								    "voters" => Array.new,\
								       "img" => x['img'],\
								     "phone" => x['phone'],\
								     "sleep" => x['sleep'],\
								      "ship" => x['ship'],\
								        "ac" => x['ac'] }
					i += 1
				end
			elsif
				# Random generation
				all_r['restaurants'].select { |r| r['ship'] == true }.sample(3).each do |x|
					# Initializes the today's array
					list[i] = { "restaurant" => x['name'],\
								      "vote" => 0,\
								    "voters" => Array.new,\
								       "img" => x['img'],\
								     "phone" => x['phone'],\
								     "sleep" => x['sleep'],\
								      "ship" => x['ship'],\
								        "ac" => x['ac'] }
					i += 1
			    end		
			end

		    all_d['drinks'].sample(1).each do |x|
		    	list[i] = { "drink" => x['name'],\
		    				"phone" => x['phone'],\
		    				  "img" => x['img'],\
		    				  "min" => x['min'] }
		    end

		    today = { "today" => list }

			File.open(file_name,'w') do |f|
				f.write(today.to_json)
			end
		end

		File.read(file_name)
	end

	def add_comment_on_today(comment)
		today = JSON.parse(read_or_create_today)
		index, msg, ip = comment['index'], comment['msg'], comment['ip']
		today['today'][index]['comments'] ||= []
		today['today'][index]['comments'].push(comment.delete_if {|key| key == 'index'})
		update_today_json(today)
	end

	def get_json_all(type)
		file_name = 'jsons/' + type + 's.json'
		if(!FileTest.exists?(file_name))
			return ""
		end

		File.read(file_name)
	end

	def update_today_json(today)
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

	def update_json(type, obj)
		File.open('jsons/' + type + 's.json','w') do |f|
			f.write(obj.to_json)
		end
	end
end