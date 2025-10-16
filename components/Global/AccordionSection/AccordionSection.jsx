import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import tw from "twrnc";

export default function AccordionSection({ mainChildren, children }) {
  const [open, setOpen] = useState(false);

  return (
    <View style={tw`mb-3`}>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={tw`bg-white rounded shadow`}
      >
        {mainChildren}
      </TouchableOpacity>

      {open && (
        <Animatable.View
          animation="fadeInDown"
          duration={500}
          style={tw`mt-2 bg-white p-3 rounded shadow`}
        >
          {children}
        </Animatable.View>
      )}
    </View>
  );
}
