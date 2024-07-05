#!/usr/bin/env bash

RUNDATE=$(date '+%Y.%m.%d');
RAWAUDIO="./podcast-audio";
EPISODE=$1;






MP3S () {
#echo "clearing out $RAWAUDIO"
#rm -rf $RAWAUDIO/*
npx github:hagent/export-macos-podcasts -p threedom -o $RAWAUDIO --datesubfolder false --nospaces
}

WAVS (){

    if [[ ! -d $RAWAUDIO/wavs ]]; then
echo "recreating $RAWAUDIO/wavs"
    mkdir $RAWAUDIO/wavs
fi

for M in $(find $RAWAUDIO/ -iname "*$EPISODE*.mp3");do
MO=$(basename $M '.mp3'|tr -d '[:punct:]');
echo "converting ${MO}...";
ffmpeg -i "$M" -acodec pcm_s16le -ac 1 -ar 16000 $RAWAUDIO/wavs/$MO.wav;
done
# result is wavs/*.wv in $RAWAUDIO/wavs/
}

VOSK (){
    if [[ ! -d ./transcripts ]]; then
    mkdir ./transcripts
fi
    for W in $(find $RAWAUDIO/wavs/ -iname "*$EPISODE*" );do
        echo "vosking $W...";
        TF=$(basename "$W" '.wav'|tr -d '[:punct:]');
        TR="./transcripts/${TF}.srt"
        if [[ ! -f $TR ]]; then
        vosk-transcriber -i $W --tasks 8 --model="./vosk-model-en-us-0.42-gigaspeech" -t "srt" -o "$TR"
        fi
    done
}

TEST (){
    echo "raw mp3 to remove:";
    ls -alh $RAWAUDIO/*;

    for W in $(find $RAWAUDIO/wavs/ -iname "*$EPISODE*" );do
        echo "testing $W...";
        TF=$(basename "$W" '.wav'|tr -d '[:punct:]');
        TR="./transcripts/${TF}.srt";echo $TR;
    done
}

#MP3S
WAVS
VOSK
# TEST
