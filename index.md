1. export podcast audio to file

    npx github:hagent/export-macos-podcasts -p threedom -o ./podcast-audio --datesubfolder false --nospaces

2. convert to mono

-   vosk [says](https://alphacephei.com/vosk/install) "When using your own audio file make sure it has the correct format - PCM 16khz 16bit mono."

    for M in $(ls *.mp3);do MO=$(basename $M '.mp3');ffmpeg -i "$M" -acodec pcm_s16le -ac 1 -ar 16000 "$MO.wav";done

2. [optionally] rename files

(in node, where files is fs.readdirSync results): > fs.readdirSync('./').forEach(f=>{let newName=f.replace(/\_/g,' ');fs.rename(f,newName,(e)=>{console.log(e);})});

4. run vosk on those mono wavs via "./index.sh"