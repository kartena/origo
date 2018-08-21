import ImageLayer from 'ol/layer/image';
import VectorLayer from 'ol/layer/vector';
import VectorTileLayer from 'ol/layer/vectortile';
import ClusterSource from 'ol/source/cluster';
import ImageVectorSource from 'ol/source/imagevector';
import Style from '../style';

export default function vector(opt, src, viewer) {
  const options = opt;
  const source = src;
  const distance = 60;
  const map = viewer.getMap();
  const view = map.getView();
  let vectorLayer;
  switch (options.layerType) {
    case 'vector':
    {
      options.source = source;
      options.style = Style.createStyle({
        style: options.style,
        viewer
      });
      vectorLayer = new VectorLayer(options);
      break;
    }
    case 'cluster':
    {
      options.clusterOptions = options.clusterOptions || {};
      if (options.type === 'WFS' || options.type === 'AGS_FEATURE') {
        source.clusterOptions = viewer.getMapSource()[options.sourceName].clusterOptions || {};
      } else {
        source.clusterOptions = {};
      }
      const clusterDistance = options.clusterOptions.clusterDistance || source.clusterOptions.clusterDistance || viewer.getClusterOptions().clusterDistance || distance;
      const clusterMaxZoom = options.clusterOptions.clusterMaxZoom || source.clusterOptions.clusterMaxZoom || viewer.getClusterOptions().clusterMaxZoom || viewer.getResolutions().length - 1;
      const clusterInitialDistance = viewer.getInitialZooom() > clusterMaxZoom ? 0 : clusterDistance;
      options.source = new ClusterSource({
        attributions: options.attribution,
        source,
        distance: clusterInitialDistance
      });
      options.source.setProperties({
        clusterDistance,
        clusterMaxZoom
      });
      options.style = Style.createStyle({
        style: options.style,
        clusterStyle: options.clusterStyle,
        viewer
      });
      vectorLayer = new VectorLayer(options);
      map.on('movestart', (evt) => {
        const mapZoom = view.getZoomForResolution(evt.frameState.viewState.resolution);
        map.once('moveend', () => {
          const currentZoom = parseInt(view.getZoom(), 10);
          if (currentZoom !== mapZoom) {
            if (currentZoom >= clusterMaxZoom) {
              options.source.setDistance(0);
            } else if (currentZoom < clusterMaxZoom) {
              options.source.setDistance(clusterDistance);
            }
          }
        });
      });
      break;
    }
    case 'image':
    {
      options.source = new ImageVectorSource({
        source,
        style: Style.createStyle({
          style: options.style,
          viewer
        })
      });
      vectorLayer = new ImageLayer(options);
      break;
    }
    case 'vectortile':
    {
      options.source = source;
      options.style = Style.createStyle({
        style: options.style,
        viewer
      });
      vectorLayer = new VectorTileLayer(options);
      break;
    }
    default:
    {
      break;
    }
  }
  return vectorLayer;
}
