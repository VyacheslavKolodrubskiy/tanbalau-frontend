<template>
  <YandexMap
    :controls="[]"
    :coords="mapCoords"
    :style="{ height: height + 'px' }"
    :zoom="mapZoom"
    @click="handleMapClick"
    @map-was-initialized="mapWasInitialized"
  >
    <YmapMarker
      v-if="normalizedPoint"
      :coords="normalizedPoint"
      marker-id="point"
      @click="handleMarkerClick"
    />
  </YandexMap>
</template>

<script>
// https://vue-yandex-maps.github.io/guide/Map.html#events
// Имена компонентов в kebab-case - исключение для Yandex Maps
import { isArray, isString } from '@/utils/type-checks';

const DEFAULT_CITY_COORDS = [51.128207, 71.43042]; // Нур-Султан
const DEFAULT_ZOOM = 10;

export default {
  name: 'SelectMapPoint',
  props: {
    defaultCity: {
      type: String,
      default: '',
    },
    point: {
      type: String,
      default: null,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      default: '350',
    },
  },
  emits: ['update:point'],
  data() {
    return {
      mapCoords: DEFAULT_CITY_COORDS,
      mapZoom: DEFAULT_ZOOM,
    };
  },
  computed: {
    normalizedPoint() {
      if (!this.point)
        return null;

      return isString(this.point) ? this.point.split(',') : this.point;
    },
  },
  methods: {
    updatePoint(coords) {
      if (this.readonly)
        return;
      this.$emit('update:point', isArray(coords) ? coords.join(',') : coords);
    },

    handleMapClick(ev) {
      if (!ev.get)
        return;
      this.updatePoint(ev.get('coords'));
    },

    handleMarkerClick(ev) {
      this.updatePoint(null);
    },

    updateMapCenter(coords) {
      if (!coords)
        return;
      this.map.setCenter(coords);
      this.mapZoom = 15;
    },

    async mapWasInitialized(map) {
      this.map = map;

      if (this.normalizedPoint)
        return this.updateMapCenter(this.normalizedPoint);

      if (!this.defaultCity)
        return;

      try {
        const res = await ymaps.geocode(this.defaultCity, { result: 1 });
        const firstGeoObject = res.geoObjects.get(0);
        const objCoords = firstGeoObject?.geometry.getCoordinates();
        if (objCoords)
          this.mapCoords = objCoords;
      } catch (error) {
        console.warn(error);
      }
    },
  },
};
</script>
