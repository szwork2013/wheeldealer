#!/bin/bash

db="appmoto"
out_dir="./data"

cd $out_dir

for i in *.json
do  
   collection=`echo $i | cut -d '.' -f1`
   echo "Importing collection: " $collection
  /opt/mongodb/bin/mongoimport --db $db --collection $collection --file $i
done
