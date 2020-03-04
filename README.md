# Docker Imagemin Image

## Usage

```
docker run -it \
           --rm \
           --name=optimize-images \
           --volumes-from=<another container> \
           --env=SRC_DIR=/var/www/html/public/data/ \
           --env=CHUNK_SIZE=1 \
           eddiebui/imagemin
```
