FROM ubuntu

MAINTAINER kfei

RUN apt-get update && apt-get install -y \ 
    g++ \ 
    gcc \ 
    make \ 
    ruby2.0 \ 
    ruby2.0-dev \ 
    wget

RUN unlink /usr/bin/ruby && ln -s /usr/bin/ruby2.0 /usr/bin/ruby && \ 
    unlink /usr/bin/gem && ln -s /usr/bin/gem2.0 /usr/bin/gem

ADD . /vimeat
WORKDIR /vimeat

RUN gem install bundler && bundle install
RUN locale-gen en_US.UTF-8
ENV LC_ALL en_US.UTF-8
RUN cp /usr/share/zoneinfo/Asia/Taipei /etc/localtime

ENTRYPOINT ["/usr/local/bin/bundle", "exec", "rackup", "config.ru"]

VOLUME ["/vimeat/jsons", "/vimeat/img"]
