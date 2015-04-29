#!/bin/sh
FILELIST=file.list

if [ $# -lt 1 ]; then
        echo "need tftp host IP";
        echo "usage: update.sh \$IP"
        exit
fi

printf "fetching file.list...."
tftp -g -r $FILELIST -l /tmp/$FILELIST $1 >/dev/null 2>&1
if [ $? -eq 0 ]; then
	echo "          [ DONE]"
else
	echo "          [FAILE]"
fi

for f in `cat /tmp/$FILELIST`; do
	printf "get $f from $1"
	tftp -g -r $f -l $f $1 >/dev/null 2>&1
	if [ $? -eq 0 ]; then
		echo "          [ DONE]"
	else
		echo "          [FAILE]"
	fi
done