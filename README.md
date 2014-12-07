# vimeat

專為那些每天為了中午要吃什麼而困擾的的辦公室上班族們設計的隨機餐飲管理系統。

## Quick Start

直接跑：

```bash
git clone https://github.com/kfei/vimeat
cd vimeat
bundle install
LC_ALL=en_US.UTF-8 bundle exec rackup config.ru
```

放在 Docker 裡跑（推薦）：

```bash
git clone https://github.com/kfei/vimeat
cd vimeat
docker build -t vimeat .
mkdir /data/{jsons,img}
docker run -it --rm \
    -p 80:80 -p 3001:3001 \
    -v /data/jsons:/vimeat/jsons -v /data/img:/vimeat/img \
    vimeat
```
