export interface PointProperties {
  id: string;
  date: string;
  estado: number;
  type: string[];
  modo: string;
  user: string;
  repair_at: string;
  observaciones: string;
  last_update: string;
}

export type GJSONFeature = {
  type: 'Feature';
  properties: PointProperties;
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  }
}

export type GJSONFeatureCollection = {
  type: 'FeatureCollection';
  features: GJSONFeature[]
}

export type MapLayer = {
  layerName: string;
  layerColor: string;
  layerData: GJSONFeatureCollection;
}

export type MapLayerList = MapLayer[];

export interface SelectedPoint extends PointProperties {
  imageIDArray?: string[] | [];
  nombreCalle?: string;
}
