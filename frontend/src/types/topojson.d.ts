import { Topology, GeometryCollection } from "topojson-specification";
import { Feature, FeatureCollection, Geometry } from "geojson";

export interface WorldTopology extends Topology {
  objects: {
    countries: GeometryCollection;
  };
}

export interface GeoFeature extends Feature<Geometry> {
  id: string | number;
}

export interface GeoFeatureCollection extends FeatureCollection {
  features: GeoFeature[];
}

declare module "*.json" {
  const value: WorldTopology;
  export default value;
}
