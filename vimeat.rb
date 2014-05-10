require 'rubygems'
require 'sinatra/base'
require 'sinatra/json'
require 'json'
require 'thin'

require_relative 'helpers/vimeathelpers'
require_relative 'routes/restaurant'
require_relative 'routes/restaurants'
require_relative 'routes/today'

class VimEat < Sinatra::Base
	helpers Sinatra::JSON
	helpers VimEatHelpers

	set :public_folder, 'public'
	settings.logging = true
	
	get '/' do
		File.read(File.join('public', '/index.html'))
	end

	post '/image' do
		# Generates a random file name
		id = ('A'..'Z').to_a.shuffle[0,10].join

		# Determine this image is for restaurant or drink
		if params['type'] == 'restaurant'
			file_name = 'public/img/restaurants/' + id + '-' + params['file'][:filename]
		elsif params['type'] == 'drink'
			file_name = 'public/img/drinks/' + id + '-' + params['file'][:filename]
		end

		# Save image to file
		File.open(file_name, "w") do |f|
    		f.write (params['file'][:tempfile].read)
  		end
		id + '-' + params['file'][:filename]
	end
end