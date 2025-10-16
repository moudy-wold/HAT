import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import tw from "twrnc"
function OfferTimer({ targetDate }: any) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const countdownTime = new Date(targetDate).getTime();
      const distance = countdownTime - now;

      if (distance < 0) {
        clearInterval(intervalId);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate]);

  return (
    <View  >
      <View style={tw`my-[2px] mx-auto  flex-row items-center gap-[2px] `}>
        <Text style={tw`border-2 border-gray-300 p-[2px]  rounded-lg text-center`}>
          {timeLeft.days < 10 ? `0${timeLeft.days}` : timeLeft.days}
        </Text>
        <Text>:</Text>
        <Text style={tw`border-2 border-gray-300 p-[2px]  rounded-lg text-center`}>{
          timeLeft.hours < 10 ? `0${timeLeft.hours}` : timeLeft.hours}
        </Text>
        <Text>:</Text>
        <Text style={tw`border-2 border-gray-300 p-[2px]  rounded-lg text-center`}>
          {timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}
        </Text>
        <Text>:</Text>
        <Text style={tw`border-2 border-gray-300 p-[2px]  rounded-lg text-center`}>
          {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
        </Text>
      </View>
    </View>
  )
}

export default OfferTimer;