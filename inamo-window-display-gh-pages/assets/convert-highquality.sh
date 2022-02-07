#!/bin/sh

cd `dirname "$0"`;

VIDEO_HEIGHT=200

function compile {
    ANIM=${1%/} # strip trailing slash
    rm -rf "tmp-convert"
    mkdir tmp-convert
    if [ -f "$ANIM/$ANIM.pngs.zip" ]
    then
        echo "Converting $ANIM";
        unzip "$ANIM/$ANIM.pngs.zip" -d tmp-convert > /dev/null
        
        mv "tmp-convert/pngs" "tmp-convert/pngs-resized"
        
        
        echo "   ... encoding video"
        ffmpeg -pattern_type glob -i "tmp-convert/pngs-resized/*.png" -pix_fmt rgba -c:v libvpx -qmin 0 -qmax 50 -crf 10 "tmp-convert/converted.webm" > /dev/null
        
        echo "   ... saving to $ANIM.webm"
        mv "tmp-convert/converted.webm" "tmp-convert-output/$ANIM.webm"
        
        sed "s/VIDEO_FILE/$ANIM.webm/" preview_template.html > "tmp-convert-output/preview-$ANIM.html"

        
    else
        echo "Not an animation folder: $ANIM (no $ANIM/$ANIM.pngs.zip file)";
    fi
}


rm -rf tmp-convert-output
mkdir tmp-convert-output
if [ "$1" = "" ]
then
    for ANIM in */
    do
        compile $ANIM
    done
else
    compile $1
fi
exit
