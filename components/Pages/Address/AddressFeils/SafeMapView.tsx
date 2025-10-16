import { t } from 'i18next';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import MapView, { MapViewProps, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import tw from 'twrnc';

interface SafeMapViewProps extends MapViewProps {
  markerCoord?: { latitude: number; longitude: number } | null;
  onMapError?: () => void;
}

const SafeMapView = forwardRef<MapView, SafeMapViewProps>(
  ({ markerCoord, onMapError, ...mapProps }, ref) => {
    const [mapError, setMapError] = useState(false);
    const [isMapReady, setIsMapReady] = useState(false);
    const [mapRef, setMapRef] = useState<MapView | null>(null);

    useImperativeHandle(ref, () => mapRef as MapView);

    useEffect(() => {
      // مهلة زمنية لتحميل الخريطة
      const timeout = setTimeout(() => {
        if (!isMapReady && !mapError) {
          console.warn('Map loading timeout');
          setMapError(true);
          onMapError?.();
        }
      }, 10000); // 10 ثوانٍ

      return () => clearTimeout(timeout);
    }, [isMapReady, mapError, onMapError]);

    const handleMapReady = () => {
      console.log('SafeMapView: Map is ready');
      setIsMapReady(true);
      setMapError(false);
    };

    const handleRetry = () => {
      setMapError(false);
      setIsMapReady(false);
    };

    if (mapError) {
      return (
        <View style={tw`flex-1 items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300`}>
          <Text style={tw`text-gray-600 text-center mb-4`}>
            {t("map_loading_error") || "Map could not be loaded"}
          </Text>
          <TouchableOpacity
            onPress={handleRetry}
            style={tw`px-4 py-2 bg-blue-500 rounded-lg mb-2`}
          >
            <Text style={tw`text-white text-sm`}>
              {t("retry") || "Retry"}
            </Text>
          </TouchableOpacity>
          <Text style={tw`text-xs text-gray-500 text-center px-4`}>
            {t("map_manual_coordinates") || "You can still save the address. Coordinates will be set to default location."}
          </Text>
        </View>
      );
    }

    try {
      return (
        <MapView
          ref={setMapRef}
          provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
          {...mapProps}
          onMapReady={handleMapReady}
          loadingEnabled={true}
          loadingIndicatorColor="#3B82F6"
          loadingBackgroundColor="#F3F4F6"
        >
          {markerCoord && isMapReady && (
            <Marker coordinate={markerCoord} />
          )}
        </MapView>
      );
    } catch (error) {
      console.error('SafeMapView render error:', error);
      setMapError(true);
      
      return (
        <View style={tw`flex-1 items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300`}>
          <Text style={tw`text-gray-600 text-center mb-4`}>
            {t("map_render_error") || "Map rendering error"}
          </Text>
          <TouchableOpacity
            onPress={handleRetry}
            style={tw`px-4 py-2 bg-blue-500 rounded-lg`}
          >
            <Text style={tw`text-white text-sm`}>
              {t("retry") || "Retry"}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
);

SafeMapView.displayName = 'SafeMapView';

export default SafeMapView;