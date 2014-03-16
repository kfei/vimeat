require 'rubygems'
require 'sinatra/base'
require 'sinatra/json'
require 'json'
require 'thin'

require_relative 'helpers/vimeathelpers'

require_relative 'routes/restaurant.rb'
require_relative 'routes/restaurants.rb'
require_relative 'routes/today.rb'

class VimEat < Sinatra::Base
	helpers Sinatra::JSON
	helpers VimEatHelpers

	set :public_folder, 'public'
	settings.logging = true
	
	get '/' do
		File.read(File.join('public', '/index.html'))
	end

	post '/image' do
		file_name = 'public/app/img/' + params['file'][:filename]
		File.open(file_name, "w") do |f| 
    		f.write (params['file'][:tempfile].read)
  		end
  		200
	end
end