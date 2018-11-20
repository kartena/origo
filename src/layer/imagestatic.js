import Static from 'ol/source/ImageStatic';
import GeoJSON from 'ol/format/geojson';
import $ from 'jquery';
import viewer from '../viewer';
import image from './image';
import isUrl from '../utils/isurl';

function createSource(options) {
  let imageStaticSource;

  const geojsonFormat = new GeoJSON();

  $.ajax({
    url: options.url,
    cache: false
  }).done((response) => {
    const features = geojsonFormat.readFeatures(response);

    const groundOverlays = features.filter(f => 'isGroundOverlay' in f.properties);

    // INSERT IMAGESTATIC
    groundOverlays.forEach((feature) => {
      imageStaticSource = new Static({
        imageExtent: feature.getGeometry().getExtent(),
        imageLoadFunction: (img) => {
          img.getImage().src = feature.image;
        },
        projection: viewer.getProjection(),
        url: ''
      });
    });
  });

  return imageStaticSource;
}

const imagestatic = function imagestatic(layerOptions) {
  const baseUrl = viewer.getBaseUrl();
  const imageStaticDefault = {
    layerType: 'image'
  };
  const imageStaticOptions = $.extend(imageStaticDefault, layerOptions);
  const sourceOptions = {};
  sourceOptions.attribution = imageStaticDefault.attribution;
  sourceOptions.projectionCode = viewer.getProjectionCode();
  sourceOptions.sourceName = layerOptions.source;
  if (isUrl(imageStaticOptions.source)) {
    sourceOptions.url = imageStaticOptions.source;
  } else {
    imageStaticOptions.sourceName = imageStaticOptions.source;
    sourceOptions.url = baseUrl + imageStaticOptions.source;
  }

  const imageStaticSource = createSource(sourceOptions);
  return image(imageStaticOptions, imageStaticSource);
};

export default imagestatic;
