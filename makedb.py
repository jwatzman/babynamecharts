#!/usr/bin/env python3

import os
import re
import sqlite3
import sys

from io import BytesIO
from urllib.request import urlopen
from zipfile import ZipFile

if len(sys.argv) < 2:
	print("Usage: makedb.py names.zip out.db")
	sys.exit(2)

zipdata = open(sys.argv[1], "rb").read()
zipobj = ZipFile(BytesIO(zipdata))
names_db_location = sys.argv[2]

try:
	os.unlink(names_db_location)
except FileNotFoundError:
	pass

db = sqlite3.connect(names_db_location)
db.execute("CREATE TABLE names (year INTEGER, name TEXT, gender INTEGER, rank INTEGER, occurances INTEGER)")

year_re = re.compile("yob(....)\\.txt")
for name in zipobj.namelist():
	match = year_re.match(name)
	if match:
		year = match.group(1)
		print("Processing %s..." % (year))
		rank = 0
		gender = 0
		for line in zipobj.open(name):
			splitline = line.decode("utf-8").split(",")
			name = splitline[0]
			if splitline[1] == "F":
				line_gender = 0
			else:
				line_gender = 1
			occurances = splitline[2].strip()

			if line_gender == gender:
				rank += 1
			else:
				gender = line_gender
				rank = 1

			db.execute("INSERT INTO names VALUES (?, ?, ?, ?, ?)", (year, name, gender, rank, occurances))

print("Indexing...")
db.execute("CREATE INDEX idx_name ON names(name);");
db.execute("CREATE INDEX idx_year ON names(year) WHERE rank <= 50");

db.commit()
db.close()
