FROM ubuntu

MAINTAINER kfei <kfei@kfei.net>

ADD . /vimeat
WORKDIR /vimeat

RUN set -x; build_deps="g++ gcc make ruby2.0-dev wget"; \
    apt-get update && apt-get install -y --no-install-recommends ${build_deps} \ 
    ruby2.0 && \ 
    unlink /usr/bin/ruby && \
    ln -s /usr/bin/ruby2.0 /usr/bin/ruby && \ 
    unlink /usr/bin/gem && \
    ln -s /usr/bin/gem2.0 /usr/bin/gem && \
    gem install bundler && \
    bundle install && \
    locale-gen en_US.UTF-8 && \
    apt-get purge -y --auto-remove ${build_deps} && \
    apt-get autoremove -y

ENV LC_ALL en_US.UTF-8

RUN cp /usr/share/zoneinfo/Asia/Taipei /etc/localtime

EXPOSE 80 3001

ENTRYPOINT ["/usr/local/bin/bundle", "exec", "rackup", "config.ru"]

VOLUME ["/vimeat/jsons", "/vimeat/img"]
