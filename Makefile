names.zip:
	curl -LO "http://www.ssa.gov/OACT/babynames/names.zip"

public_html/names.db: makedb.py names.zip
	./makedb.py names.zip public_html/names.db

public_html/names.db.gz: public_html/names.db
	cd public_html && gzip --keep names.db

public_html/names.db.zstd: public_html/names.db
	zstd -19 -f public_html/names.db -o public_html/names.db.zst

dev: public_html/names.db
	cd public_html && python3 -m http.server

HOST=jwatzman_babynamecharts@ssh.phx.nearlyfreespeech.net
deploy: public_html/names.db.gz
	rsync -avz --delete --delete-excluded --exclude=".DS_Store" --exclude="*.swp" --exclude="names.db" public_html/ $(HOST):/home/public/

clean:
	rm -f names.zip public_html/names.db public_html/names.db.gz public_html/names.db.zst

.PHONY: dev deploy clean
