public_html/names.db: makedb.py
	./makedb.py

public_html/names.db.gz: public_html/names.db
	cd public_html && gzip --keep names.db

dev: public_html/names.db
	cd public_html && python3 -m http.server

HOST=jwatzman_babynamecharts@ssh.phx.nearlyfreespeech.net
deploy: public_html/names.db.gz
	rsync -avz --delete --delete-excluded --exclude=".DS_Store" --exclude="*.swp" --exclude="names.db" public_html/ $(HOST):/home/public/

.PHONY: dev deploy
