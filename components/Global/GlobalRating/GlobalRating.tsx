import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet } from "react-native";

function GlobalRating({ average_rating }: any) {
  const [ratingMarge, setRatingMarge] = useState([false, false, false, false, false]);

  useEffect(() => {
    const updatedMarge = ratingMarge.map((_, index) => index < 4);
    setRatingMarge(updatedMarge);
  }, [average_rating]);

  return (
    <View style={styles.container}>
      {/* Start Rating */}
      {ratingMarge.map((item: any, index) => (
        <Image
          key={index}
          source={
            item
              ? require("../../../assets/images/star.png")
              : require("../../../assets/images/emptyStar.png")
          }
          style={styles.star}
        />
      ))}
      {/* End Rating */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 4,
    marginTop: 12,
    marginBottom: 7,
  },
  star: {
    width: 14,
    height: 14,
    resizeMode: "contain",
  },
});

export default GlobalRating;
