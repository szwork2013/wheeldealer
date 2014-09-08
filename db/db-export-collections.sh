#!/bin/bash

db="appmoto"
out_dir="./data"

tmp_file="tmp_export.js"
echo "print('_ ' + db.getCollectionNames())" > $tmp_file
cols=`/opt/mongodb/bin/mongo $db $tmp_file | grep '_' | awk '{print $2}' | tr ',' ' '`
for c in $cols
do
    /opt/mongodb/bin/mongoexport -d $db -c $c -o "$out_dir/${c}.json"
done
rm $tmp_file

