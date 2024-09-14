declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module './LeafletMap' {
  import { FC } from 'react';
  interface LeafletMapProps {
    route: [number, number][] | null;
    showWeather: boolean;
  }
  const LeafletMap: FC<LeafletMapProps>;
  export default LeafletMap;
}
