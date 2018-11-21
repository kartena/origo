import ImageStatic from 'ol/source/imagestatic';
import GeoJSON from 'ol/format/geojson';
import $ from 'jquery';
import viewer from '../viewer';
import image from './image';
import isUrl from '../utils/isurl';

function createSource(options) {
  const geojsonFormat = new GeoJSON();
  const source = new ImageStatic({
    imageExtent: [181896.33, 6101648.07, 864416, 7689478.31],
    url: '',
    projection: viewer.getProjection(),
    imageLoadFunction: (img) => {
      $.ajax({
        url: options.url,
        cache: false
      }).done((result) => {
        const features = geojsonFormat.readFeatures(result);
        const groundOverlays = features.map((f) => {
          const properties = f.getProperties();
          if (properties && properties.isGroundOverlay) {
            return f;
          }
          return null;
        }).filter(Boolean);
        groundOverlays.forEach((feature) => {
          source.imageExtent = feature.getGeometry().getExtent();
          const base64Image = feature.getProperties().image;
          img.getImage().src = `data:image/png;base64,${base64Image}`;

          // There was no setter for this, but apparently the image has its own extent
          // that differs from the imageExtent of the parent source?
          img.extent = source.imageExtent;

          // Trying to get size
          // No idea if this is necessary, but it's the easiest way to get
          // the file size from the base64 image.
          const imageSize = new Image();
          imageSize.onload = function() {
            source.imageSize = [imageSize.width, imageSize.height]
          }
          imageSize.src = `data:image/png;base64,${base64Image}`;
        });
      });
    }
  });
  return source;
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

  const imageStaticPromise = createSource(sourceOptions);
  const imageSource = image(imageStaticOptions, imageStaticPromise);
  return imageSource;
};

export default imagestatic;
