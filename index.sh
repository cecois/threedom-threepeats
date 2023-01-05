#!/bin/bash

audiodir="/Users/ccmiller/Downloads/threedom/podcast-audio/wavs"

# for audio in $(ls $audiodir/*.wav); do
#   T="$(basename "$audio" '.wav')";
#    vosk-transcriber -i $audio --tasks 8 --model="./vosk-model-en-us-0.42-gigaspeech" -t "srt" -o "./transcripts/${T}.srt"
# done


# declare -a wavs=("Ch_d_Your_D.wav" "Frank_Caliendo_s_Hot_Dog_Emporium.wav" "I_Get_It,_I_m_Doctor_Strange.wav" "I_Hope_Everyone_s_A_Mummy.wav" "It_s_MY_Birthday_Suit!.wav" "Let_s_All_Meet_Beef.wav" "Light_Bulb_s_Good.wav" "Now_They_re_Doing_Karate.wav" "Ryan_O_Needle.wav" "What_s_Morning.wav" "You_re_So_Plane.wav" "You_re_A_Ghost,_I_m_Ten.wav")
# declare -a wavs=("You_re_A_Ghost,_I_m_Ten.wav")
declare -a wavs=("Kind_of_a_Mess_Down_There.wav")

for audio in "${wavs[@]}";do 
  ffp="${audiodir}/${audio}";
  tf=$(basename "$audio" '.wav');
  transcript="/Users/ccmiller/git/threedom-threepeats/transcripts/${tf}.srt"
  vosk-transcriber -i $ffp --tasks 8 --model="./vosk-model-en-us-0.42-gigaspeech" -t "srt" -o "$transcript"
done