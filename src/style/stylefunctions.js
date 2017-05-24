"use strict";

	var ol = require('openlayers');
  function customStyle(styleName, params) {
	  if(styleName=='timeline'){
		var val=params.values;
		var colors=params.colors;
		var step=params.step;
		var range=params.range;
		var attrName=params.attrName;
		var fill = new ol.style.Fill({color: ''});
		var stroke = new ol.style.Stroke({color: '', width: 0.1, lineCap:'square', lineJoin:'round'});
		var polygon = new ol.style.Style({fill: fill, zIndex: 1});
		var strokedPolygon = new ol.style.Style({fill: fill, stroke: stroke, zIndex: 2});
		var styles = [];
		var min = val ? val[0] : undefined;
		var max = val ? val[1] : undefined;
		var from_value = range ? range[0] : undefined;
		var to_value = range ? range[1] : undefined;
		var stops = (to_value-from_value)/step;
		var num_colors = colors.length;
		var groups = stops/(num_colors-1);
	  
	  
	  return function(feature, resolution) {
		var length = 0;
		var value = feature.get(attrName);
		value = value<from_value ? from_value : value;
		if (value >= min && value <= max) {
		var group = Math.floor((value-from_value)/groups);
		var remainder = (value-from_value) % groups;
		var from_color = getColor(colors[group]);
		var to_color = getColor(colors[group+1]);
		var r, g, b;
		
		r = from_color[0] + Math.floor(((to_color[0]-from_color[0]) * (remainder / groups)));
		g = from_color[1] + Math.floor(((to_color[1]-from_color[1]) * (remainder / groups)));
		b = from_color[2] + Math.floor(((to_color[2]-from_color[2]) * (remainder / groups)));
		
		stroke.setColor('rgba('+Math.round(0.8*r)+','+Math.round(0.8*g)+','+Math.round(0.8*b)+',1)');
		stroke.setWidth(0.7);          
		fill.setColor('rgba('+r+','+g+','+b+',1)');
		styles[length++] = strokedPolygon;
		}
		styles.length = length;
		return styles;
	  }
	  }
	}
	function getColor(color){
			switch(color) {
			case 'red': return [255,0,0];
			case 'yellow': return [255,255,0];
			case 'green': return [0,255,0];
			case 'cyan': return [0,255,255];
			case 'blue': return [0,0,255];
			case 'magenta': return [255,0,255];
			default: return [255,255,255];
		}
	}
module.exports.customStyle = customStyle;
module.exports.getColor = getColor;
